import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import { GameFile } from './formats';
import { ActorType, PlzRigidNode, NodonColor, PlzRigidNodeShape } from './objects';
// import levelUrl from '../demofiles/lgctpbfile_mygame_5.bin'; // flappy bird
// import levelUrl from '../demofiles/lgctpbfile_mygame_10.bin'; // excitebike
// import levelUrl from '../demofiles/lgctpbfile_mygame_6.bin'; // mariokart
import levelUrl from '../demofiles/lgctpbfile_mygame_3.bin'; // mariokart

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement, window);
controls.enablePan = true;

scene.add( new THREE.AmbientLight( 0x555555 ) );
const light = new THREE.SpotLight( 0xffffff, 1 );
light.position.set( 0, 500, 2000 );
light.castShadow = true;
scene.add( light );

const materialMap = new Map<NodonColor, THREE.Material>();
materialMap.set(NodonColor.Auto,      new THREE.MeshPhongMaterial({ color: 0xeeeeee, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Black,     new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Blue,      new THREE.MeshPhongMaterial({ color: 0x0000ff, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Brown,     new THREE.MeshPhongMaterial({ color: 0x964b00, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Green,     new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.LightBlue, new THREE.MeshPhongMaterial({ color: 0x222250, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.LimeGreen, new THREE.MeshPhongMaterial({ color: 0x225022, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Orange,    new THREE.MeshPhongMaterial({ color: 0xff5022, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Pink,      new THREE.MeshPhongMaterial({ color: 0x502200, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Purple,    new THREE.MeshPhongMaterial({ color: 0x500050, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Red,       new THREE.MeshPhongMaterial({ color: 0xff0000, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.White,     new THREE.MeshPhongMaterial({ color: 0xeeeeee, flatShading: true, shininess: .2 }));
materialMap.set(NodonColor.Yellow,    new THREE.MeshPhongMaterial({ color: 0x505000, flatShading: true, shininess: .2 }));

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();


(async () => {
  const game = await GameFile.fromUrl(levelUrl);
  console.log(game.meta);
  (window as any).game = game;

  game.nodons.forEach(nodon => {
    if (nodon.type === ActorType.PlzEasyCamera)
      return false;

    let geometry: any;

    if (nodon instanceof PlzRigidNode) {
      if (nodon.shape === PlzRigidNodeShape.Box)
        geometry = new THREE.BoxGeometry(1, 1);
      else if (nodon.shape === PlzRigidNodeShape.Cylinder)
        geometry = new THREE.CylinderGeometry(.5, .5, 1, 20);
      else if (nodon.shape === PlzRigidNodeShape.Sphere)
        geometry = new THREE.SphereGeometry();
    }
    else {
      geometry = new THREE.BoxGeometry();
    }

    const material = materialMap.get(nodon.colorIdx);
    const object = new THREE.Mesh(geometry, material);

    object.renderOrder = nodon.canvasSortIndex;

    // world rotation is in degrees
    let [rX, rY, rZ] = nodon.worldRotation;
    object.rotation.x = rX * (Math.PI / 180);
    object.rotation.y = -rY * (Math.PI / 180); // inverted
    object.rotation.z = rZ * (Math.PI / 180);

    let [x, y, z] = nodon.worldPosition;
    object.position.x = x;
    object.position.y = y;
    object.position.z = -z; // inverted Z

    let [sX, sY, sZ] = nodon.worldSize;
    object.scale.x = sX;
    object.scale.y = sY;
    object.scale.z = sZ;
    
    scene.add(object);
  });

})();