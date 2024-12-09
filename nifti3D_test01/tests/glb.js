// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Import OrbitControls for camera movement
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Import GLTFLoader for loading GLB/GLTF files
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Get the target <div> element and file input
const container = document.querySelector('.brain-model-box');
const fileInput = document.querySelector('.glb-input');
//progressBar element init
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");


// Create a Three.js scene
const scene = new THREE.Scene();

// Set up a camera
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1, -180);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights to the scene
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Set up OrbitControls for user interaction
const controls = new OrbitControls(camera, renderer.domElement);

// GLTFLoader to load GLB files
const loader = new GLTFLoader();

// Handle file input change
fileInput.addEventListener('change', (event) => {
   

  const file = event.target.files[0];
  if (file) {
    while (scene.children.length > 2) {
      const object = scene.children.pop();
      object.geometry?.dispose();
      object.material?.dispose();
    }
    const url = URL.createObjectURL(file); // Create a temporary URL for the file

    //로딩바 보여주기
    progressContainer.style.display = "block";
    progressBar.style.display = "block";
    progressBar.style.width = "0%";
    progressBar.innerHTML = "0%";

    //로딩바 작동
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        //로딩바 100% 채우면 로딩바는 사라지고 glb 파일 띄움
        progressContainer.style.display = "none";
        progressBar.style.display = "none";
        clearInterval(interval);

         // Load the selected GLB file
    loader.load(
      url,
      (gltf) => {
        // Remove previous models if any
        while (scene.children.length > 2) {
          const object = scene.children.pop();
          object.geometry?.dispose();
          object.material?.dispose();
        }

        // Add the loaded model to the scene
        const model = gltf.scene;
        scene.add(model);

       
        // Optional: Adjust model position, scale, or rotation
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        console.log('Model loaded successfully');
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred:', error);
        progressContainer.style.display = "none";
        progressBar.style.display = "none";
        alert("Failed to read file")
      }
    );
      } else {
        width++;
        progressBar.style.width = width + "%";
        progressBar.innerHTML = width + "%";
      }
    }, 20); // Adjust speed as necessary


   
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

