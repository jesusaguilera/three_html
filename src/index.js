import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

    // Render
    this.render();

    // Objects
    this.addObjects();

    // Setup
    this.setup()
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

  setup() {
    // this.camera.fov =  2 * Math.atan((this.sizes.height / 2 ) / this.camera.position.z) * THREE.Math.RAD2DEG;
    window.addEventListener("resize", () => this.resize())
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

new Sketch({
  dom: document.body
});
