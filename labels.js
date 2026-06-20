import * as THREE from 'three';

export function createLabels(labelData, camera, container) {
  const labels = labelData.map((item) => {
    const el = document.createElement('div');
    el.className = 'label';
    el.textContent = item.text;
    container.appendChild(el);
    return { mesh: item.mesh, text: item.text, offset: item.position.clone(), world: new THREE.Vector3(), element: el };
  });

  function update(renderer, visible = true) {
    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    labels.forEach((label) => {
      label.world.copy(label.offset);
      const screen = label.world.project(camera);
      const inFront = screen.z < 1;
      label.element.style.display = visible && inFront ? 'block' : 'none';
      label.element.style.transform = `translate(-50%, -50%) translate(${(screen.x * 0.5 + 0.5) * width}px, ${(-screen.y * 0.5 + 0.5) * height}px)`;
    });
  }

  return { update, labels };
}
