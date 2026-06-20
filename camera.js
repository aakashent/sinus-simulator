import * as THREE from 'three';

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 4.2);
const DEFAULT_ROTATION = { yaw: 0, pitch: 0 };

export function createEndoscopeCamera(canvas, onStatus) {
  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 100);
  const keys = new Set();
  let yaw = DEFAULT_ROTATION.yaw;
  let pitch = DEFAULT_ROTATION.pitch;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function applyRotation() {
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  }

  function reset() {
    camera.position.copy(DEFAULT_POSITION);
    yaw = DEFAULT_ROTATION.yaw;
    pitch = DEFAULT_ROTATION.pitch;
    applyRotation();
  }

  function setFov(fov) {
    camera.fov = Number(fov);
    camera.updateProjectionMatrix();
  }

  window.addEventListener('keydown', (event) => keys.add(event.key.toLowerCase()));
  window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    if (document.pointerLockElement !== canvas && event.pointerType === 'mouse') {
      canvas.requestPointerLock?.();
    }
  });

  canvas.addEventListener('pointerup', (event) => {
    dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  });

  window.addEventListener('pointermove', (event) => {
    const locked = document.pointerLockElement === canvas;
    if (!dragging && !locked) return;
    const dx = locked ? event.movementX : event.clientX - lastX;
    const dy = locked ? event.movementY : event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    yaw -= dx * 0.0025;
    pitch -= dy * 0.0025;
    pitch = THREE.MathUtils.clamp(pitch, -1.35, 1.35);
    applyRotation();
  });

  function update(delta) {
    const speed = keys.has('shift') ? 3.6 : 1.8;
    const distance = speed * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (keys.has('w')) camera.position.addScaledVector(forward, distance);
    if (keys.has('s')) camera.position.addScaledVector(forward, -distance);
    if (keys.has('a')) camera.position.addScaledVector(right, -distance);
    if (keys.has('d')) camera.position.addScaledVector(right, distance);
    if (keys.has('e')) camera.position.y += distance;
    if (keys.has('q')) camera.position.y -= distance;

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -1.25, 3.2);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, -1.35, 1.55);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.2, 4.6);
  }

  reset();
  onStatus?.('Use WASD + mouse look to explore the sinonasal placeholder model.');
  return { camera, update, reset, setFov };
}
