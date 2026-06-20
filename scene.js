import * as THREE from 'three';

export const STRUCTURES = [
  { key: 'septum', label: 'Nasal septum', quizName: 'Septum', color: 0x9ec5ff },
  { key: 'inferior-turbinate', label: 'Inferior turbinate', quizName: 'Inferior turbinate', color: 0x74c69d },
  { key: 'middle-turbinate', label: 'Middle turbinate', quizName: 'Middle turbinate', color: 0x74c69d },
  { key: 'lateral-wall', label: 'Lateral nasal wall', quizName: 'Lateral wall', color: 0x8bb3d9 },
  { key: 'maxillary-sinus', label: 'Maxillary sinus region', quizName: 'Maxillary sinus region', color: 0xf4d35e }
];

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071b33);
  scene.fog = new THREE.Fog(0x071b33, 7, 22);

  scene.add(new THREE.AmbientLight(0x8fb4d8, 1.2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const anatomyGroup = new THREE.Group();
  anatomyGroup.name = 'placeholder-sinonasal-anatomy';
  scene.add(anatomyGroup);

  const interactive = [];
  const labels = [];

  const addMesh = (mesh, data, labelPosition) => {
    mesh.name = data.label;
    mesh.userData = { ...data, interactive: true };
    anatomyGroup.add(mesh);
    interactive.push(mesh);
    labels.push({ mesh, text: data.label, position: labelPosition });
    return mesh;
  };

  const septum = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 3.0, 7.5),
    new THREE.MeshStandardMaterial({ color: 0x9ec5ff, roughness: 0.48, metalness: 0.02 })
  );
  septum.position.set(0, 0.05, -1.1);
  addMesh(septum, STRUCTURES[0], new THREE.Vector3(0, 1.85, -1.0));

  const turbinateMaterial = new THREE.MeshStandardMaterial({ color: 0x74c69d, roughness: 0.55 });
  const inferior = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 3.8, 10, 24), turbinateMaterial.clone());
  inferior.position.set(0.78, -0.72, -1.1);
  inferior.rotation.z = Math.PI / 2;
  inferior.rotation.y = -0.12;
  addMesh(inferior, STRUCTURES[1], new THREE.Vector3(0.95, -1.15, -1.15));

  const middle = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 3.1, 10, 24), turbinateMaterial.clone());
  middle.position.set(0.7, 0.18, -1.25);
  middle.rotation.z = Math.PI / 2;
  middle.rotation.y = -0.18;
  addMesh(middle, STRUCTURES[2], new THREE.Vector3(0.95, 0.62, -1.25));

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 3.0, 7.2),
    new THREE.MeshStandardMaterial({ color: 0x8bb3d9, roughness: 0.6, transparent: true, opacity: 0.78 })
  );
  wall.position.set(1.55, 0.05, -1.15);
  wall.rotation.y = -0.08;
  addMesh(wall, STRUCTURES[3], new THREE.Vector3(1.72, 1.65, -0.7));

  const sinus = new THREE.Mesh(
    new THREE.SphereGeometry(0.76, 32, 20),
    new THREE.MeshStandardMaterial({ color: 0xf4d35e, roughness: 0.5, transparent: true, opacity: 0.86 })
  );
  sinus.scale.set(1.15, 0.88, 1.0);
  sinus.position.set(2.25, -0.12, -2.85);
  addMesh(sinus, STRUCTURES[4], new THREE.Vector3(2.55, 0.98, -2.85));

  const cautionMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.5, roughness: 0.4, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 18), cautionMaterial.clone());
  orbit.position.set(2.15, 1.18, -1.8);
  orbit.name = 'Orbit caution region';
  anatomyGroup.add(orbit);
  labels.push({ mesh: orbit, text: 'Orbit (caution)', position: new THREE.Vector3(2.55, 1.95, -1.75) });

  const skullBase = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.12, 7.5), cautionMaterial.clone());
  skullBase.position.set(0.55, 1.72, -1.05);
  skullBase.name = 'Skull base caution region';
  anatomyGroup.add(skullBase);
  labels.push({ mesh: skullBase, text: 'Skull base (caution)', position: new THREE.Vector3(0.4, 2.1, -0.1) });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 8), new THREE.MeshStandardMaterial({ color: 0x17324f, roughness: 0.9, side: THREE.DoubleSide }));
  floor.rotation.x = Math.PI / 2;
  floor.position.set(0.75, -1.6, -1.1);
  anatomyGroup.add(floor);

  return { scene, interactive, labels };
}
