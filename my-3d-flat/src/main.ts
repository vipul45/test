import * as BABYLON from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.9, 0.9, 0.9); // Light grey background

  // Camera Setup
  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 15, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Create Rooms
  const room1 = BABYLON.MeshBuilder.CreateBox("Room1", { width: 5, height: 3, depth: 5 }, scene);
  const room2 = BABYLON.MeshBuilder.CreateBox("Room2", { width: 5, height: 3, depth: 5 }, scene);
  const room3 = BABYLON.MeshBuilder.CreateBox("Room3", { width: 5, height: 3, depth: 5 }, scene);
  const hall = BABYLON.MeshBuilder.CreateBox("Hall", { width: 8, height: 3, depth: 5 }, scene);
  const kitchen = BABYLON.MeshBuilder.CreateBox("Kitchen", { width: 5, height: 3, depth: 5 }, scene);

  // Position Rooms
  room1.position.set(-6, 0, 0);
  room2.position.set(-2, 0, 0);
  room3.position.set(4, 0, 0);
  kitchen.position.set(0, 0, 0);

  // Create Walls
  const wall1 = BABYLON.Mesh.CreatePlane("Wall1", 10, scene);
  const wall2 = BABYLON.Mesh.CreatePlane("Wall2", 10, scene);
  const wall3 = BABYLON.Mesh.CreatePlane("Wall3", 10, scene);
  const wall4 = BABYLON.Mesh.CreatePlane("Wall4", 10, scene);

  // Position Walls
  wall1.position.set(-1, 1.5, 5);
  wall1.rotation.y = Math.PI / 2;
  wall2.position.set(5, 1.5, 5);
  wall2.rotation.y = Math.PI / 2;
  wall3.position.set(0, 1.5, 10);
  wall4.position.set(0, 1.5, -5);

  // Create Doors
  const door1 = BABYLON.MeshBuilder.CreateBox("Door1", { width: 1, height: 2, depth: 0.2 }, scene);
  const door2 = BABYLON.MeshBuilder.CreateBox("Door2", { width: 1, height: 2, depth: 0.2 }, scene);
  const door3 = BABYLON.MeshBuilder.CreateBox("Door3", { width: 1, height: 2, depth: 0.2 }, scene);

  // Position Doors
  door1.position.set(-4, 1, 0);
  door2.position.set(2, 1, 0);
  door3.position.set(0, 1, 5); 

  // Create Furniture (Basic Boxes for now)
  const bed1 = BABYLON.MeshBuilder.CreateBox("Bed1", { width: 2, height: 0.5, depth: 3 }, scene);
  const bed2 = BABYLON.MeshBuilder.CreateBox("Bed2", { width: 2, height: 0.5, depth: 3 }, scene);
  const bed3 = BABYLON.MeshBuilder.CreateBox("Bed3", { width: 2, height: 0.5, depth: 3 }, scene);
  const sofa = BABYLON.MeshBuilder.CreateBox("Sofa", { width: 3, height: 0.5, depth: 2 }, scene);
  const kitchenCabinet = BABYLON.MeshBuilder.CreateBox("KitchenCabinet", { width: 2, height: 1.5, depth: 1 }, scene);
  const kitchenCounter = BABYLON.MeshBuilder.CreateBox("KitchenCounter", { width: 3, height: 1, depth: 1 }, scene);

  // Position Furniture
  bed1.position.set(-6, 0.25, 2.5); 
  bed2.position.set(-2, 0.25, 2.5); 
  bed3.position.set(4, 0.25, 2.5); 
  sofa.position.set(0, 0.25, 0);  
  kitchenCabinet.position.set(1, 0.75, 2.5); 
  kitchenCounter.position.set(-1, 0.5, 2.5); 

  // Create Materials
  const skyBlueMaterial = new BABYLON.StandardMaterial("SkyBlue", scene);
  skyBlueMaterial.diffuseColor = BABYLON.Color3.FromHexString("#87CEEB"); // Sky Blue
  const whiteMaterial = new BABYLON.StandardMaterial("White", scene);
  whiteMaterial.diffuseColor = BABYLON.Color3.White();
  const redMaterial = new BABYLON.StandardMaterial("Red", scene);
  redMaterial.diffuseColor = BABYLON.Color3.Red();

  // Apply Materials
  wall1.material = skyBlueMaterial;
  wall2.material = skyBlueMaterial;
  wall3.material = skyBlueMaterial;
  wall4.material = skyBlueMaterial;

  // Create and Position Ceiling
  const ceiling = BABYLON.MeshBuilder.CreatePlane("Ceiling", { width: 10, height: 10 }, scene);
  ceiling.position.set(0, 3, 5);
  ceiling.rotation.x = -Math.PI / 2;
  ceiling.material = whiteMaterial;

  // Create and Position Floor
  const floor = BABYLON.MeshBuilder.CreatePlane("Floor", { width: 10, height: 10 }, scene);
  floor.position.set(0, 0, 5);
  floor.material = redMaterial;

  // Click Handlers for Doors
  const transitionHandler = (targetPosition: BABYLON.Vector3) => {
    BABYLON.Animation.CreateAndStartAnimation('cameraAnimation', camera, 'position', 60, 100, camera.position.clone(), targetPosition.clone(), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    BABYLON.Animation.CreateAndStartAnimation('cameraAnimation', camera, 'target', 60, 100, camera.target.clone(), targetPosition.clone(), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  
  };

  door1.actionManager = new BABYLON.ActionManager(scene);
  door1.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => transitionHandler(room1.position)));

  door2.actionManager = new BABYLON.ActionManager(scene);
  door2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => transitionHandler(room2.position)));

  door3.actionManager = new BABYLON.ActionManager(scene);
  door3.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => transitionHandler(room3.position)));

  // Initial Camera Position
  camera.setTarget(hall.getBoundingInfo().boundingBox.centerWorld);
  camera.radius = 10;

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});