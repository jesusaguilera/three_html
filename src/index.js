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
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Scene
    this.scene = new THREE.Scene();

    // Camera 
    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 10);
    this.camera.position.z = 1;

    // Time
    this.time = 0;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      // canvas: this.canvas,
      antialias: true,
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
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize( this.sizes.width, this.sizes.height );

  }

  setup() {
    window.addEventListener("resize", () => this.resize())
  }

  addObjects() {

    // Geometry
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 40, 40);
    this.geometry = new THREE.SphereBufferGeometry(0.4, 40, 40);

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
