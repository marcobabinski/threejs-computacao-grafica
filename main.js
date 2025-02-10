import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let clock = new THREE.Clock(); // Relógio para calcular o tempo

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adiciona fundo (substitua 'fundo.jpg' pela sua imagem)
const backgroundTexture = new THREE.TextureLoader().load('fundo.jpg');
scene.background = backgroundTexture;

// Adiciona luz ambiente (suaviza sombras)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Adiciona luz direcional principal
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

// Adiciona uma segunda luz direcional para preencher sombras
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 5, 5);
scene.add(fillLight);

// Adiciona controles na câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza os movimentos
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Zoom mínimo
controls.maxDistance = 10; // Zoom máximo
controls.maxPolarAngle = Math.PI / 2; // Limita a rotação para não virar de cabeça para baixo

let loadedObject = null;

// Carrega o material (.mtl)
const mtlLoader = new MTLLoader();
mtlLoader.load('lowpoly.mtl', (materials) => {
  materials.preload();

  // Carrega o modelo (.obj)
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('lowpoly.obj', (object) => {
    object.position.set(0, 0, 0);
    object.scale.set(5, 5, 5);
    scene.add(object);
    loadedObject = object;
  });
});

// Posiciona a câmera
camera.position.set(0, 2, 5);

// Cena 2
const scene2 = new THREE.Scene();

const cubeGeo = THREE.BoxGeometry(1,1,1);
const material2 = THREE.Material({ color: 'ff0000' })

const cube = THREE.Mesh(cubeGeo, material2);

scene2.add(cube)

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    
    // if (loadedObject) {
    //   let time = clock.getElapsedTime(); // Obtém o tempo decorrido
  
    //   loadedObject.rotation.y += 0.03; // Rotação no eixo Y
    //   loadedObject.position.y = Math.sin(time*2) * 0.2; // Movimento de flutuação
    // }
  
    controls.update();
    renderer.render(scene2, camera);
  }
animate();
