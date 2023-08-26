<template>
  <div class="index-page">
    <div class="content">
      <canvas id="renderCanvas"></canvas>
    </div>
    <button @click="start">start</button>
  </div>
</template>

<script>
// import * as CANNON from "cannon-es";
import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";
// import "babylonjs-loaders";
export default {
  name: "index-page",
  components: {},
  data() {
    return {
      scene: null,
      engine: null,
      canvas: null,
      positionObj: {},
      sleepObj: {},
      runTimer2: null,
      startStatus: false,
    };
  },
  created() {},
  mounted() {
    try {
      this.init();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    start() {
      if (this.startStatus) {
        return
      } else {
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      }
      this.startStatus = true;
      this.sleepObj = {};
      let num = 0;
      this.runTimer2 = setInterval(() => {
        num += 100;
        this.scene.meshes.forEach((item) => {
          if (item.name.indexOf("box") !== -1) {
            item.physicsBody.applyForce(
              new BABYLON.Vector3(100, 500, 0),
              new BABYLON.Vector3(0, 0, 0)
            );
          }
        });
        if (num == 1000) {
          clearInterval(this.runTimer2);
          let timer = setInterval(() => {
            this.scene.meshes.forEach((item) => {
              if (item.name.indexOf("box") !== -1) {
                if (this.positionObj[item.name]) {
                  if (
                    this.positionObj[item.name]._x === item.position.x &&
                    this.positionObj[item.name]._y === item.position.y &&
                    this.positionObj[item.name]._z === item.position.z
                  ) {
                    console.log("stop");
                    this.sleepObj[item.name] = true;
                  } else {
                    let position = JSON.parse(JSON.stringify(item.position));
                    this.positionObj[item.name] = position;
                  }
                } else {
                  let position = JSON.parse(JSON.stringify(item.position));
                  this.positionObj[item.name] = position;
                }
                if (Object.keys(this.sleepObj).length == 5) {
                  clearInterval(timer);
                  this.startStatus = false;
                  this.engine.stopRenderLoop();
                }
              }
            });
            // this.engine.stopRenderLoop();
          }, 100);
        }
      }, 100);
    },
    init() {
      // window.CANNON = CANNON;
      // Get the canvas DOM element
      this.canvas = document.getElementById("renderCanvas");
      // Load the 3D engine
      this.engine = new BABYLON.Engine(this.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        adaptToDeviceRatio: true,
      });
      // this.engine.setHardwareScalingLevel(0.1);
      // CreateScene function that creates and return the scene
      this.createScene();
    },
    async createScene() {
      // Create a basic BJS Scene object
      this.scene = new BABYLON.Scene(this.engine);
      // scene.useRightHandedSystem = true;
      // var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
      // var physicsPlugin = new BABYLON.CannonJSPlugin();
      // scene.enablePhysics(gravityVector, physicsPlugin);
      // scene.enablePhysics();
      const havokInstance = await HavokPhysics();
      // pass the engine to the plugin
      const hk = new BABYLON.HavokPlugin(true, havokInstance);
      // enable physics in the scene with a gravity
      this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);
      // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
      // var camera = new BABYLON.FreeCamera(
      //   "camera1",
      //   new BABYLON.Vector3(0, 5, -10),
      //   scene
      // );
      var camera = new BABYLON.ArcRotateCamera(
        "Camera",
        (4 * Math.PI) / 2,
        Math.PI / 4.8,
        26,
        BABYLON.Vector3(0, 0, 0),
        this.scene
      );
      // camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
      // Target the camera to scene origin
      camera.setTarget(BABYLON.Vector3.Zero());
      // Attach the camera to the canvas
      camera.attachControl(this.canvas, false);
      // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
      var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        this.scene
      );
      let r = 4;
      const myShape = [new BABYLON.Vector3(0, r, 0)];
      for (let index = 1; index < r; index += 0.1) {
        myShape.push(
          new BABYLON.Vector3(
            index,
            Math.sqrt(Math.abs(r * r - index * index)),
            0
          )
        );
      }
      for (let index = r; index >= 0; index -= 0.1) {
        myShape.push(
          new BABYLON.Vector3(
            index,
            -Math.sqrt(Math.abs(r * r - index * index)),
            0
          )
        );
      }
      for (let index = 1; index < r; index += 0.1) {
        myShape.push(
          new BABYLON.Vector3(
            -index,
            -Math.sqrt(Math.abs(r * r - index * index)),
            0
          )
        );
      }
      for (let index = r; index >= 0; index -= 0.1) {
        myShape.push(
          new BABYLON.Vector3(
            -index,
            Math.sqrt(Math.abs(r * r - index * index)),
            0
          )
        );
      }
      const myPath = [];
      for (let i = 0; i < r * 2; i++) {
        const point = new BABYLON.Vector3(0, i, 0);
        myPath.push(point);
      }
      for (let i = 0; i < 2; i++) {
        const point = new BABYLON.Vector3(0, r * 2, 0);
        myPath.push(point);
      }

      //Update extrusion scale and rotation
      let extrusion = BABYLON.MeshBuilder.ExtrudeShape("airWall", {
        shape: myShape,
        path: myPath,
        closeShape: true,
        // closePath: true,
        // scale: 0.5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      });
      var mat = new BABYLON.StandardMaterial("mat", this.scene);

      // mat.diffuseTexture = new BABYLON.Texture(
      //   require("../images/1.webp"),
      //   scene
      // );
      // mat.diffuseTexture.hasAlpha = true;
      mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
      mat.useAlphaFromDiffuseTexture = true;
      mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
      mat.alpha = 0.01;
      extrusion.material = mat;
      extrusion.position.y = 0;

      // let wall = BABYLON.MeshBuilder.ExtrudeShape("wall", {
      //   shape: myShape,
      //   path: myPath,
      //   closeShape: true,
      //   closePath: false,
      //   // scale: 0.5,
      //   sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      // });
      // let extrusionPhysics = new BABYLON.PhysicsImpostor(
      //   extrusion,
      //   BABYLON.PhysicsImpostor.MeshImpostor,
      //   { mass: 0, restitution: 0.75 },
      //   scene
      // );
      const mat2 = new BABYLON.StandardMaterial("mat2");
      const texture = new BABYLON.Texture(require("../images/dices.png"));
      mat2.diffuseTexture = texture;

      var columns = 6;
      var rows = 1;

      const faceUV = new Array(6);

      for (let i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(
          i / columns,
          0,
          (i + 1) / columns,
          1 / rows
        );
      }

      const options = {
        size: 1.25,
        faceUV: faceUV,
        wrap: true,
        radius: 0.5,
      };

      const sphere = BABYLON.MeshBuilder.CreateBox("box", options);
      sphere.material = mat2;
      // var sphere = BABYLON.MeshBuilder.CreateBox(
      //   "box",
      //   { size: 1, segments: 32 },
      //   this.scene
      // );

      // Move the sphere upward at 4 units
      sphere.position.y = 4;

      // Our built-in 'ground' shape.
      var ground = BABYLON.MeshBuilder.CreateCylinder(
        "ground",
        {
          width: 30,
          height: 0.1,
          diameterTop: 9,
          diameterBottom: 10,
          tessellation: 50,
          faceColors: [
            new BABYLON.Color3.Random(),
            new BABYLON.Color3.Random(),
            new BABYLON.Color3.Random(),
          ],
        },
        this.scene
      );
      ground.material = new BABYLON.StandardMaterial("mat" + ground.name);
      ground.alpha = 0.5;
      new BABYLON.PhysicsAggregate(
        sphere,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 0.75 },
        this.scene
      );
      new BABYLON.PhysicsAggregate(
        extrusion,
        BABYLON.PhysicsShapeType.MESH,
        { mass: 0, restitution: 0.75 },
        this.scene
      );

      // Create a static box shape.
      new BABYLON.PhysicsAggregate(
        ground,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0 },
        this.scene
      );

      var sphere2 = sphere.clone();
      var sphere3 = sphere.clone();
      var sphere4 = sphere.clone();
      var sphere5 = sphere.clone();
      sphere2.name = "box2";
      sphere3.name = "box3";
      sphere4.name = "box4";
      sphere5.name = "box5";
      sphere2.position.y = 2;
      sphere2.position.x = 0.5;
      // return scene;
      // this.createScene().then((scene) => {
      console.log(this.scene);
      this.engine.runRenderLoop(() => {
        if (this.scene) {
          this.scene.render();
        }
      });
      // });
      // the canvas/window resize event handler
      window.addEventListener("resize", function () {
        this.engine.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.index-page {
  padding: 0 !important;
  height: calc(100%);
  background: hsl(250, 50%, 20%);
  .content {
    width: 100%;
    height: 100%;
    // padding: 10% auto 0;
    canvas {
      width: 100%;
      height: 100%;
    }
  }
  button {
    position: absolute;
    top: 20px;
    left: 20px;
  }
}
</style>
