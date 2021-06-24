/**
 * 3D map renderer with orbit controls
 * 
 * TODO: 
 * resize: https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
 * render text objects: https://threejs.org/examples/#webgl_geometry_text_shapes
 * keyboard WASD controls: https://yomotsu.github.io/camera-controls/examples/keyboard.html
 * manipulation: https://threejs.org/examples/misc_controls_transform.html
 * snap to direction: https://yomotsu.github.io/camera-controls/examples/fit-and-padding.html
 * lines showing connections: https://threejs.org/examples/#webgl_lines_fat
 * sky shader: https://threejs.org/examples/#webgl_shaders_sky
 * create primitives with chamfers: 
 *    https://www.danielsieger.com/blog/2021/05/03/generating-primitive-shapes.html
 *    https://www.danielsieger.com/blog/2021/03/27/generating-spheres.html
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter';

import CameraControls from 'camera-controls';
CameraControls.install({ THREE: THREE });

import { GameFile } from '../formats';
import { NodonBase, ActorType, PlzRigidNode, PlzTpsCamera, PlzFieldConfigNode, NodonColor, PlzRigidNodeShape, PlzFieldConfigNodeShape } from '../objects';
import { lerp, degreesToRadians, downloadFile } from '../utils';

export class MapRenderer {

  game: GameFile = new GameFile(); // dummy game

  rootEl: HTMLElement;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  controls: CameraControls;
  composer: EffectComposer;
  ssaoPass: SSAOPass;
  shadowLight: THREE.DirectionalLight;
  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  mousePos = new THREE.Vector2(0, 0);
  objectMap = new Map<THREE.Object3D, NodonBase>();

  isSsaoEnabled = false;
  isShadowEnabled = false;
  shadowQuality = 4; // gbg uses shadowmaps that are roughly 8k, which would be quality 4

  onSelectNodon = (nodon: NodonBase) => {};

  constructor(rootEl: HTMLElement) {
    const bounds = rootEl.getBoundingClientRect();
    // set up scene and camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    const camera = new THREE.PerspectiveCamera(65, bounds.width / bounds.height, 0.1, 1000);
    camera.position.z = 5;
    // set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(bounds.width, bounds.height);
    rootEl.appendChild(renderer.domElement);
    rootEl.addEventListener('click', this.onMouseClick, false);
    // set up camera controls
    const controls = new CameraControls(camera, renderer.domElement);
    // set up post processing passes (enable with setSsaoEnabled())
    const composer = new EffectComposer(renderer);
    const ssaoPass = new SSAOPass(scene, camera, bounds.width, bounds.height);
    // set up ssao to look roughly the same as in GBG (it's a tad glitchy, though...)
    ssaoPass.kernelRadius = .1;
    ssaoPass.minDistance = 0.00005;
    ssaoPass.maxDistance = 0.0002;
    ssaoPass.enabled = false;
    composer.addPass(ssaoPass);
    // keep references to all the things
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.composer = composer;
    this.ssaoPass = ssaoPass;
    this.rootEl = rootEl;
  }

  loadGame(game: GameFile) {
    this.game = game;
    this.objectMap.clear();
    this.scene.clear();
    this.addLights();
    game.nodons.forEach(nodon => this.addNodon(nodon));
    // set defaults view setup
    // TODO: remove this
    this.setShadowEnabled(true);
    this.setShadowQuality(4);
    this.setSsaoEnabled(false); // should be true but its sloooow
    this.render();
  }

  // click to select nodon, useful for debugging, could eventually be used for edits
  onMouseClick = (e: MouseEvent) => {
    const bounds = this.rootEl.getBoundingClientRect();
    this.mousePos.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.mousePos.y = - ((e.clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length) {
      // first object is in front
      const object = intersects[0].object;
      // look up nodon tied to object
      const nodon = this.objectMap.get(object);
      console.log('Hit:', nodon);
      this.onSelectNodon(nodon);
    }
  }

  setShadowEnabled(enabled: boolean) {
    this.renderer.shadowMap.enabled = enabled;
    this.objectMap.forEach((nodon, mesh) => {
      mesh.castShadow = enabled;
      mesh.receiveShadow = enabled;
    });
    this.isShadowEnabled = enabled;
    this.shadowLight.castShadow = enabled;
  }

  setShadowQuality(quality: number) {
    this.shadowLight.shadow.mapSize.width = 2048 * quality;
    this.shadowLight.shadow.mapSize.height = 2048 * quality;
  }

  setSsaoEnabled(enabled: boolean) {
    this.ssaoPass.enabled = enabled;
    this.isSsaoEnabled = enabled;
  }

  render = () => {
    requestAnimationFrame(this.render);
    const delta = this.clock.getDelta();
	  this.controls.update(delta);
    if (this.isSsaoEnabled)
      this.composer.render();
    else
      this.renderer.render(this.scene, this.camera);
  }
  addLights() {
    // rough approximation of gbg's default lighting setup
    // hemi light for shadow + cieling ambient colors - in gbg these are tinted blue and brown respectively
    const hemiLight = new THREE.HemisphereLight(0xaab5c2, 0xd6cbc7, .75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
    // key directional light for sideways fill, slightly redish
    const keyLight = new THREE.DirectionalLight(0xffefef, .2);
    keyLight.position.set(-1, 1, 1);
    keyLight.position.multiplyScalar(30);
    this.scene.add(keyLight);
    // bright slightly redish sun light that casts shadows
    const shadowLight = new THREE.DirectionalLight(0xffefef, .5);
    shadowLight.position.set(-1.25, 1.75, 1);
    shadowLight.position.multiplyScalar(30);
    this.shadowLight = shadowLight;
    this.scene.add(shadowLight);
    this.setShadowQuality(this.shadowQuality)
    const d = 50;
    shadowLight.shadow.camera.left = - d;
    shadowLight.shadow.camera.right = d;
    shadowLight.shadow.camera.top = d;
    shadowLight.shadow.camera.bottom = - d;
    shadowLight.shadow.camera.far = 3500;
    shadowLight.shadow.bias = - 0.0;
  }

  addNodon(nodon: NodonBase) {
    if (nodon.type === ActorType.PlzFieldConfigNode)
      this.addWorldNodon(nodon as PlzFieldConfigNode);
    else if (nodon.type === ActorType.PlzTpsCamera)
      this.addCameraNodon(nodon as PlzTpsCamera);
    else
      this.addObjectNodon(nodon);
  }

  addWorldNodon(nodon: PlzFieldConfigNode) {
    let [x, y, z] = nodon.size;
    // TODO: different world types
    if (nodon.shape === PlzFieldConfigNodeShape.Plane) {
      const geometry = new THREE.PlaneGeometry(x, z);
      const material = new THREE.MeshLambertMaterial({ color: 0xfefefe });
      const object = new THREE.Mesh(geometry, material);
      object.rotation.x = -Math.PI / 2;
      this.objectMap.set(object, nodon);
      this.scene.add(object);
    } 
  }

  addCameraNodon(nodon: PlzTpsCamera) {
    // TODO: figure out camera positioning
    // const camera = new THREE.PerspectiveCamera(nodon.fov, window.innerWidth / window.innerHeight, 0.1, 1000);

    // let [x, y, z] = nodon.offsetDistance;
    // camera.position.x = x;
    // camera.position.y = -y;
    // camera.position.z = -z;

    // let [lookX, lookY, lookZ] = nodon.worldPosition;
    // camera.lookAt(new THREE.Vector3(lookX, lookY, lookZ));

    // this.controls = new CameraControls(camera, this.renderer.domElement);
    // this.camera = camera
  }

  addObjectNodon(nodon: NodonBase) {
    // dont render certain nodes
    // TODO: build full list of renderable nodes
    if (!nodon.type.startsWith('Plz'))
      return;
    if (nodon.type.includes('Camera'))
      return;

    const geometry = this.getNodonGeometry(nodon);
    const material = this.getNodonMaterial(nodon);
    const object = new THREE.Mesh(geometry, material);

    // world rotation is in degrees
    let [rX, rY, rZ] = nodon.worldRotation;
    object.rotation.x = degreesToRadians(rX);
    object.rotation.y = degreesToRadians(-rY); // inverted
    object.rotation.z = degreesToRadians(rZ);

    let [x, y, z] = nodon.worldPosition;
    object.position.x = x;
    object.position.y = y;
    object.position.z = -z; // inverted Z

    let [sX, sY, sZ] = nodon.worldSize;
    object.scale.x = sX;
    object.scale.y = sY;
    object.scale.z = sZ;

    object.renderOrder = nodon.canvasSortIndex;

    this.objectMap.set(object, nodon);
    this.scene.add(object);
  }

  getNodonGeometry(nodon: NodonBase) {
    if (nodon instanceof PlzRigidNode) {
      if(nodon.shape === PlzRigidNodeShape.Cylinder)
        return new THREE.CylinderGeometry(.5, .5, 1, 20);
      if(nodon.shape === PlzRigidNodeShape.Sphere)
        return new THREE.SphereGeometry(.5, 20, 20);
    }
    return new THREE.BoxGeometry(1, 1);
  }

  getNodonMaterial(nodon: NodonBase) {
    const color = this.getNodonColor(nodon);
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: .8,
      // shininess: .2
    });
  }

  getNodonColor(nodon: NodonBase) {
    // colors are approximated
    switch (nodon.colorIdx) {
      case NodonColor.Black: return 0x141414;
      case NodonColor.Blue: return 0x0771FF;
      case NodonColor.Brown: return 0xB97231;
      case NodonColor.Green: return 0x00AC00;
      case NodonColor.LightBlue: return 0x00D9FB;
      case NodonColor.LimeGreen: return 0x53ED00;
      case NodonColor.Orange: return 0xFF8900;
      case NodonColor.Pink: return 0xE95BDD;
      case NodonColor.Purple: return 0xBD00FF;
      case NodonColor.Red: return 0xFF3C3D;
      case NodonColor.White: return 0xfefeff;
      case NodonColor.Yellow: return 0xE4EB00;
      case NodonColor.Auto: 
      default:
        return 0xF7C801;
    }
  }

  async exportAs(filename: string) {
    const data = await this.getGltfData();
    downloadFile(data, filename, 'application/octet-stream');
  }

  // export the scene as a GLTF file
  // this can be loaded into blender with the gltf plugin
  getGltfData() {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const exporter = new GLTFExporter();
      const exportOptions: GLTFExporterOptions = {
        binary: true,
        onlyVisible: true,
      };
      exporter.parse(this.scene, resolve, exportOptions);
    });
  }
}