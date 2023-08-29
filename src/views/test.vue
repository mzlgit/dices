// You have to create a function called createScene. This function must return a BABYLON.Scene object
// You can reference the following variables: scene, canvas
// You must at least define a camera
// More info here: https://github.com/BabylonJS/Babylon.js/wiki/The-Playground

var createScene = function() {
	var scene = new BABYLON.Scene(engine);
  var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
  light0.diffuse = new BABYLON.Color3(1, 1, 1);
  light0.specular = new BABYLON.Color3(1, 1, 1);
  light0.groundColor = new BABYLON.Color3(0, 0, 0);

  var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 15, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas);

  scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  var sourceMat = new BABYLON.StandardMaterial("sourceMat", scene);
  sourceMat.wireframe = true;
  sourceMat.backFaceCulling = false;

  var a = BABYLON.Mesh.CreateSphere("sphere", 36, 9.2, scene);
  var b = BABYLON.Mesh.CreateBox("box", 4, scene);

  a.scaling.x = 0.6;
  a.scaling.z = 0.6;
  a.scaling.y = 0.6;

  a.visibility = 0;
  b.visibility = 0;

  var s1 = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.6, scene);
  var s11 = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
  s11.visibility = 0;
  s1.visibility = 0;
  s11.position.x = -2;

  var s6 = new Array(6);

  for (var i = 1; i <= 6; ++i) {
    s6[i] = s1.clone();
    s6[i].position.x = 2;
    if (i <= 3) {
      s6[i].position.z = -0.8;
    }
    else {
      s6[i].position.z = 0.8;
    }
  }

  s6[1].position.y = 1.2;
  s6[2].position.y = 0;
  s6[3].position.y = -1.2;
  s6[4].position.y = 1.2;
  s6[5].position.y = 0;
  s6[6].position.y = -1.2;

  //
  var s2 = new Array(2);
  for (var i = 1; i <= 2; i++) {
    s2[i] = s1.clone();
    s2[i].position.y = -2;
  }

  s2[1].position.z = 0.8;
  s2[1].position.x = 1.1;

  s2[2].position.z = -0.8;
  s2[2].position.x = -1.1;
  //

  var s3 = new Array(3);
  for (var i = 1; i <= 3; i++) {
    s3[i] = s1.clone();
    s3[i].position.z = -2;
  }


  s3[1].position.x = 1.1;
  s3[1].position.y = 0.9;

  s3[2].position.x = 0;
  s3[2].position.y = 0;

  s3[3].position.x = -1.1;
  s3[3].position.y = -0.9;

  var s4 = new Array(4);

  for (var i = 1; i <= 4; ++i) {
    s4[i] = s1.clone();
    s4[i].position.z = 2;
    if (i <= 2) {
      s4[i].position.x = -0.8;
    }
    else {
      s4[i].position.x = 0.8;
    }
  }

  s4[1].position.y = 1.2;
  s4[2].position.y = -1.2;
  s4[3].position.y = 1.2;
  s4[4].position.y = -1.2;



  var s5 = new Array(5);
  for (var i = 1; i <= 5; i++) {
    s5[i] = s1.clone();
    s5[i].position.y = 2;
  }

  s5[1].position.z = -0.8;
  s5[1].position.x = -1.2;
  s5[2].position.z = 0.8;
  s5[2].position.x = -1.2;
  s5[3].position.z = 0.8;
  s5[3].position.x = 1.2;
  s5[4].position.z = -0.8;
  s5[4].position.x = 1.2;
  s5[5].position.x = 0;

  var arrayOfMeshes = s6;

  arrayOfMeshes = arrayOfMeshes.concat(s11).concat(s2).concat(s3).concat(s4).concat(s5);

  var mergedMeshes = BABYLON.Mesh.MergeMeshes(arrayOfMeshes);

  mergedMeshes.visibility = 0;

  var aCSG = BABYLON.CSG.FromMesh(a);
  var bCSG = BABYLON.CSG.FromMesh(b);
  var s1CSG = BABYLON.CSG.FromMesh(mergedMeshes);


  // Set up a MultiMaterial
  var mat0 = new BABYLON.StandardMaterial("mat0", scene);
  var mat3 = new BABYLON.StandardMaterial("mat3", scene);

//   mat0.diffuseTexture = new BABYLON.Texture('assets/images/dicematerial.png', scene)
  mat0.specularColor = new BABYLON.Color3(0, 0, 0);
  mat0.backFaceCulling = false;

  mat3.diffuseColor = new BABYLON.Color3.White();
  mat3.specularColor = new BABYLON.Color3(0, 0, 0);
  mat3.backFaceCulling = false;

  var multiMat = new BABYLON.MultiMaterial("multiMat", scene);
  multiMat.subMaterials.push(mat0, mat0, mat3);

  var subCSG1 = bCSG.intersect(aCSG);
  var subCSG2 = subCSG1.subtract(s1CSG);

  var newMesh = subCSG2.toMesh("csg", multiMat, scene, true);



	return scene;
};