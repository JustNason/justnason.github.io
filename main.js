import * as THREE from "three";
import { Wireframe } from "three/addons/lines/Wireframe.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { WireframeGeometry2 } from "three/addons/lines/WireframeGeometry2.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const title = document.getElementById("title");

title.style.marginTop = (window.innerHeight / 2 - 100).toString() + "px";

console.log("hello");
const container = document.getElementById("container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / 1600,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({
  canvas: container,
  antialias: true,
});
renderer.setSize(window.innerWidth, 1600);
renderer.setAnimationLoop(animation);
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85,
);
const filmPass = new FilmPass(0.5, false);
bloomPass.threshold = 0;
bloomPass.strength = 0.5;
bloomPass.radius = 0.3;

//const outputPass = new OutputPass();
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(filmPass);
//composer.addPass( outputPass );

scene.add(new THREE.AmbientLight(0xcccccc));

const mouse = new THREE.Vector2;


const raycaster = new THREE.Raycaster();


window.addEventListener("resize", onWindowResize);
document.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener("mousedown", (event) => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    clickedObject.rotation.x ++;
  }
})

const box_geometry_1 = new THREE.BoxGeometry(1, 1, 1);
const box_wireframe_1 = new WireframeGeometry2(box_geometry_1);
const box_material = new LineMaterial({
  color: 0xff0000,
  linewidth: 4,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});
const cube = new Wireframe(box_wireframe_1, box_material);
scene.add(cube);

const box_geometry_2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const box_wireframe_2 = new WireframeGeometry2(box_geometry_2);
const box_material_2 = new LineMaterial({
  color: 0x00ff00,
  linewidth: 4,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});
const cube_2 = new Wireframe(box_wireframe_2, box_material_2);
scene.add(cube_2);
cube_2.position.x = 1.5;

const box_geometry_3 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const box_wireframe_3 = new WireframeGeometry2(box_geometry_3);
const box_material_3 = new LineMaterial({
  color: 0x0000ff,
  linewidth: 4,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});
const cube_3 = new Wireframe(box_wireframe_3, box_material_3);
scene.add(cube_3);
cube_3.position.x = -1.5;

function addStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const posArr = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    posArr[i * 3] = THREE.MathUtils.randFloatSpread(2000);
    posArr[i * 3 + 1] = THREE.MathUtils.randFloatSpread(2000);
    posArr[i * 3 + 2] = THREE.MathUtils.randFloatSpread(500) - 500;
  }

  starsGeometry.setAttribute("position", new THREE.BufferAttribute(posArr, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xbdbdbd,
    size: 2,
    sizeAttenuation: true,
  });

  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

function loadEarth() {
  const gltfLoader = new GLTFLoader();
  const url = "Models/Earth/scene.gltf";
  gltfLoader.load(url, (gltf) => {
    const root = gltf.scene;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('Models/Earth/textures/Material.002_diffuse.jpeg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const newMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.1
    });
    root.traverse((o) => {
      if (o.isMesh) {
        o.material = newMaterial;
                // Optional: set the side property for visibility
        o.material.side = THREE.DoubleSide;
      }
    });
    scene.add(root);
    root.scale.set(0.02,0.02,0.02)
    root.position.z = -2;
    root.position.y = -3;
    root.rotation.x = -2.3;
  });
}

loadEarth();
addStars();

//const pointlight = new THREE.PointLight(0xffffff, 1, 0, .1);
//pointlight.position.z = 2;
//pointlight.position.y = 1;
//scene.add(pointlight)

camera.position.z = 4;

let camera_offset = 0;

function animation(time) {
  cube.rotation.x = -(window.scrollY / 250) - 1.0;
  cube.rotation.z = -(window.scrollY / 250) - 1.0;
  camera.position.y = -(window.scrollY / 500) - 1.5;
  cube_2.rotation.y = window.scrollY / 250 - 0.3;
  cube_2.rotation.x = -(window.scrollY / 250) - 0.3;
  cube_3.rotation.y = -(window.scrollY / 250) - 0.6;
  cube_3.rotation.x = -(window.scrollY / 250) - 0.6;

  //   camera.position.x = (mouse_x - (window.innerWidth / 2)) / 10000;
  //   camera.position.y = (mouse_y / 10000) + camera_offset;
  console.log(camera.position.x);
  //starField.rotation.x += 0.01

  composer.render();
}

function onWindowResize() {
  const windowHalfX = window.innerWidth / 2;

  camera.aspect = window.innerWidth / 1600;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, 1600);

  title.style.marginTop = (window.innerHeight / 2 - 100).toString() + "px";
}
