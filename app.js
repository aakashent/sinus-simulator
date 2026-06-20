import * as THREE from 'three';
import { createScene, STRUCTURES } from './scene.js';
import { createEndoscopeCamera } from './camera.js';
import { createLabels } from './labels.js';
import { createQuiz } from './quiz.js';

const canvas = document.querySelector('#sceneCanvas');
const statusOverlay = document.querySelector('#statusOverlay');
const labelsToggle = document.querySelector('#labelsToggle');
const explorerMode = document.querySelector('#explorerMode');
const quizMode = document.querySelector('#quizMode');
const resetView = document.querySelector('#resetView');
const fovSlider = document.querySelector('#fovSlider');
const fovOutput = document.querySelector('#fovOutput');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const { scene, interactive, labels: labelData } = createScene();
const endoscope = createEndoscopeCamera(canvas, (message) => { statusOverlay.textContent = message; });
const labelManager = createLabels(labelData, endoscope.camera, document.querySelector('.viewport'));
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();

const quiz = createQuiz({
  structures: STRUCTURES,
  scoreDisplay: document.querySelector('#scoreDisplay'),
  prompt: document.querySelector('#quizPrompt'),
  status: statusOverlay,
  onTargetChange: (key) => {
    interactive.forEach((mesh) => mesh.material.emissive?.set(mesh.userData.key === key ? 0x12382e : 0x000000));
  }
});

function resize() {
  const { clientWidth, clientHeight } = canvas;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    renderer.setSize(clientWidth, clientHeight, false);
    endoscope.camera.aspect = clientWidth / clientHeight;
    endoscope.camera.updateProjectionMatrix();
  }
}

function selectFromEvent(event) {
  if (document.pointerLockElement === canvas) {
    pointer.set(0, 0);
  } else {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  raycaster.setFromCamera(pointer, endoscope.camera);
  const hit = raycaster.intersectObjects(interactive, false)[0];
  if (hit) quiz.handleSelection(hit.object);
}

canvas.addEventListener('click', selectFromEvent);
resetView.addEventListener('click', () => {
  endoscope.reset();
  statusOverlay.textContent = 'View reset to the anterior endoscope-style starting position.';
});
fovSlider.addEventListener('input', () => {
  endoscope.setFov(fovSlider.value);
  fovOutput.textContent = `${fovSlider.value}°`;
});
explorerMode.addEventListener('click', () => {
  explorerMode.classList.add('active');
  quizMode.classList.remove('active');
  quiz.setActive(false);
});
quizMode.addEventListener('click', () => {
  quizMode.classList.add('active');
  explorerMode.classList.remove('active');
  quiz.setActive(true);
});

function animate() {
  requestAnimationFrame(animate);
  resize();
  endoscope.update(clock.getDelta());
  labelManager.update(renderer, labelsToggle.checked);
  renderer.render(scene, endoscope.camera);
}

animate();
