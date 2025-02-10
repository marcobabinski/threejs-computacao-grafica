import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Controles da câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2;

// ---------- CENA 1 ----------
const scene1 = new THREE.Scene();
scene1.background = new THREE.TextureLoader().load('fundo.jpg');

const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.6);
const mainLight1 = new THREE.DirectionalLight(0xffffff, 1);
mainLight1.position.set(5, 5, 5);
scene1.add(ambientLight1, mainLight1);

const mtlLoader = new MTLLoader();
mtlLoader.load('lowpoly.mtl', (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('lowpoly.obj', (object) => {
        object.scale.set(5, 5, 5);
        scene1.add(object);
    });
});

// ---------- CENA 2 ----------
const scene2 = new THREE.Scene();
scene2.background = new THREE.TextureLoader().load('finally.webp');

const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(5, 5, 5);
scene2.add(ambientLight2, directionalLight2);

let gltfModel2 = null;
const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('scene.gltf', (gltf) => {
    gltfModel2 = gltf.scene;
    scene2.add(gltfModel2);
});

// ---------- CENA 3 ----------
const scene3 = new THREE.Scene();
scene3.background = new THREE.Color(0xffffff);

const ambientLight3 = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(5, 5, 5);
scene3.add(ambientLight3, directionalLight3);

let gltfModel3 = null;
let mixer3 = null;

let sceneradio = null;

const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('scenemax.gltf', (gltf) => {
    gltfModel3 = gltf.scene;

    // Aumentar a escala do objeto na cena 3
    gltfModel3.scale.set(3, 3, 3);

    scene3.add(gltfModel3);

    // Carregar texturas
    const textureLoader = new THREE.TextureLoader();
    const bodyTexture = textureLoader.load('textures/body_baseColor.png');
    const whiskersTexture = textureLoader.load('textures/whiskers.002_baseColor.png');

    gltfModel3.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("body")) {
                child.material.map = bodyTexture;
            } else if (child.name.includes("whiskers")) {
                child.material.map = whiskersTexture;
            }
            child.material.needsUpdate = true;
        }
    });

    // Aplicar animação do GLTF
    if (gltf.animations.length > 0) {
        mixer3 = new THREE.AnimationMixer(gltfModel3);
        gltf.animations.forEach((clip) => {
            const action = mixer3.clipAction(clip);
            action.loop = THREE.LoopRepeat;
            action.play();
        });
    }
});

// Carregar o modelo "sceneradio.gltf" na cena 3
const gltfLoader4 = new GLTFLoader();
gltfLoader4.load('sceneradio.gltf', (gltf) => {
    sceneradio = gltf.scene;
    sceneradio.scale.set(0.1, 0.1, 0.1);  // Ajustado para 0.1 de escala
    sceneradio.position.set(5, 0, 0);  // Colocado ao lado do modelo principal
    sceneradio.rotation.set(0, 90, 0)
    scene3.add(sceneradio);
});

// ---------- Alternar entre cenas ----------
let activeScene = scene1;

document.getElementById('scene1Btn').addEventListener('click', () => {
    activeScene = scene1;
});

document.getElementById('scene2Btn').addEventListener('click', () => {
    activeScene = scene2;
});

document.getElementById('scene3Btn').addEventListener('click', () => {
    activeScene = scene3;
});

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Remover a rotação e flutuação da cena 3
    if (gltfModel3) {
        // Removendo rotação e flutuação
        gltfModel3.rotation.set(0, 0, 0);  // Garantir que o modelo não gire
        gltfModel3.position.set(0, 0, 0);  // Garantir que o modelo não flutue
    }

    // Atualizar a animação do GLTF (apenas para cena3)
    if (mixer3) {
        mixer3.update(clock.getDelta());
    }

    renderer.render(activeScene, camera);
}
animate();
