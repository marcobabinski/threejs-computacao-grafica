import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const THREE = require('three');


const textureObamium = new THREE.TextureLoader().load( 'oi.png' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const cameraOrt = new THREE.OrthographicCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const texture = new THREE.TextureLoader().load( 'eu.png' );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { map: texture } );

const cube = new THREE.Mesh( geometry, material );
const cube2 = new THREE.Mesh( geometry, material );
const cube3 = new THREE.Mesh( geometry, material );

scene.add( cube );
scene.add( cube2 );
scene.add( cube3 );

cube2.position.x = -0.7
cube2.position.z = -1.2

cube3.position.x = 0.7
cube3.position.z = 1.2

camera.position.z = 4;
camera.position.y = 2;

camera.rotation.x = -0.65

function animate() {


	renderer.render( scene, camera );

}