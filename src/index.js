import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import imagesLoaded from "imagesloaded";
import FontFaceObserver from "fontfaceobserver";
import vertex from "./glsl/vertex.glsl";
import fragment from "./glsl/fragment.glsl";
import "./assets/scss/main.scss";
import forest from "./assets/images/forest.jpg";

export default class Sketch {
  constructor(options) {

    // Container
    this.container = options.dom;

    // Sizes
    this.sizes = {
      // width: this.container.offsetWidth,
      // height: this.container.offsetHeight,
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Camera distance
    this.cameraDistance = 600;

    // Scene
    this.scene = new THREE.Scene();

    // Camera 
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 100, 2000);
    this.camera.position.z = this.cameraDistance;
    this.camera.fov =  2 * Math.atan((this.sizes.height / 2 ) / this.camera.position.z) * (180 / Math.PI)
    this.camera.updateProjectionMatrix();

    // Time
    this.time = 0;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      // canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;

    // Images
    this.images = [...document.querySelectorAll("img")];

    // Fonts loaded
    const fontOpen = new Promise( resolve => {
      new FontFaceObserver("Open Sans")
        .load()
        .then(() => {
          resolve();
        });
    });

    const fontPlayfair = new Promise( resolve => {
      new FontFaceObserver("Playfair Display")
        .load()
        .then(()=> {
          resolve();
        });
    });

    // Preload images
    const preloadImages = new Promise(( resolve, reject ) => {
      imagesLoaded(
        document.querySelectorAll("img"), 
        { background: true }, 
        resolve()
      );
    });

    let allDone = [fontOpen, fontPlayfair, preloadImages];

    Promise.all(allDone).then(() => {

      // Add images
      this.addImages();
      this.setPosition();

      // Resize
      this.resize()
      this.setupResize()

      // Objects
      this.addObjects();

      // Render
      this.render();

    })

  }

  resize() {

    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.fov =  2 * Math.atan((this.sizes.height / 2 ) / this.camera.position.z) * (180 / Math.PI)
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize( this.sizes.width, this.sizes.height );

  }

  setupResize() {
    // this.camera.fov =  2 * Math.atan((this.sizes.height / 2 ) / this.camera.position.z) * THREE.Math.RAD2DEG;
    window.addEventListener("resize", () => this.resize())
  }

  addImages() {
    this.imageStore = this.images.map(( img, index ) => {

      let bounds  = img.getBoundingClientRect();

      let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 1, 1);
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      let material = new THREE.MeshBasicMaterial({ 
        // color: 0xff0000 ,
        map: texture
      });
      let mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      console.log(bounds);

      return {
        img: img,
        mesh: mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      }

    })

  }

  setPosition() {

    this.imageStore.forEach( o => {
      o.mesh.position.y = -o.top + this.sizes.height * 0.5 - o.height * 0.5;
      o.mesh.position.x = o.left - this.sizes.width * 0.5 + o.width * 0.5;
    })

  }

  addObjects() {

    // Geometry
    this.geometry = new THREE.PlaneBufferGeometry(200, 400, 10, 10);
    // this.geometry = new THREE.SphereBufferGeometry(0.4, 40, 40);

    // Material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime : {type: "f", value: 0},
        uTexture: {value: new THREE.TextureLoader().load(forest)}
      },
     // wireframe: true,
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    // Mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );

  }

  render() {

    // Update time
    this.time +=  0.05;

    // Update material
    if(this.material) {
      this.material.uniforms.uTime.value = this.time;
    }

    // Update render
    this.renderer.render( this.scene, this.camera );

    // Updadte controls
    this.controls.update();

    // Frame
    window.requestAnimationFrame(this.render.bind(this));

  }

}

window.onload = () => {

  new Sketch({
    dom: document.body
  });

}
