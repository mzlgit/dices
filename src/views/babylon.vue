<template>
  <div class="index-page">
    <div class="content">
      <canvas id="renderCanvas" class="animate__animated animate__zoomInDown"></canvas>
    </div>
    <div class="btn-list">
      <button class="btn animate__animated animate__bounce" @click="upGaper">
        打开
      </button>
      <button class="btn animate__animated animate__bounce" @click="start">
        摇一摇
      </button>
      <button class="btn animate__animated animate__bounce" @click="downGaper">
        关闭
      </button>
    </div>
    <div class="back" @click="gaBack"></div>
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
      upStatus: false,
      downStatus: false,
      extrusion: null,
      animation1: null,
      animation2: null,
      music: null,
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
    gaBack() {
      this.$router.go(-1);
    },
    upGaper() {
      this.upStatus = true;
      if (!this.engine._renderingQueueLaunched) {
        this.engine.runRenderLoop(() => {
          this.scene.render();
          if (this.extrusion.position.y == 20) {
            this.upStatus = false;
            this.engine.stopRenderLoop();
          }
        });
      } else {
        if (!this.startStatus && this.extrusion.position.y == 20) {
          this.upStatus = false;
          this.engine.stopRenderLoop();
        }
      }
      this.extrusion.position.y == 20 ? "" : this.animation2.start();
    },
    downGaper() {
      this.downStatus = true;
      if (!this.engine._renderingQueueLaunched) {
        this.engine.runRenderLoop(() => {
          this.scene.render();
          if (this.extrusion.position.y == 0) {
            this.downStatus = false;
            this.engine.stopRenderLoop();
          }
        });
      } else {
        if (!this.startStatus && this.extrusion.position.y == 0) {
          this.downStatus = false;
          this.engine.stopRenderLoop();
        }
      }
      this.extrusion.position.y == 0 ? "" : this.animation1.start();
    },
    start() {
      if (this.startStatus) {
        return;
      } else {
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      }
      this.music.play();
      this.startStatus = true;
      this.sleepObj = {};
      let num = 0;
      this.extrusion.position.y == 0 ? "" : this.animation1.start();
      this.runTimer2 = setInterval(() => {
        num += 110;
        this.scene.meshes.forEach((item) => {
          if (item.name.indexOf("box") !== -1) {
            item.physicsBody.applyForce(
              new BABYLON.Vector3(100, 500, 0),
              new BABYLON.Vector3(0, 0, 0)
            );
          }
        });
        if (num >= 1000) {
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
                  // this.animation1.stop()
                  if (!this.upStatus && !this.downStatus) {
                    this.engine.stopRenderLoop();
                  }
                }
              }
            });
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
      this.scene.clearColor = new BABYLON.Color3(34 / 255, 25 / 255, 77 / 255);
      // this.scene.clearColor = BABYLON.Color3(34, 25, 77);
      // scene.useRightHandedSystem = true;
      // let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
      // let physicsPlugin = new BABYLON.CannonJSPlugin();
      // scene.enablePhysics(gravityVector, physicsPlugin);
      // scene.enablePhysics();
      const havokInstance = await HavokPhysics();
      // pass the engine to the plugin
      const hk = new BABYLON.HavokPlugin(true, havokInstance);
      // enable physics in the scene with a gravity
      this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);
      // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
      // let camera = new BABYLON.FreeCamera(
      //   "camera1",
      //   new BABYLON.Vector3(0, 5, -10),
      //   scene
      // );
      let camera = new BABYLON.ArcRotateCamera(
        "Camera",
        (4 * Math.PI) / 2,
        Math.PI / 4.8,
        30,
        BABYLON.Vector3(0, 0, 0),
        this.scene
      );
      // camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
      // Target the camera to scene origin
      camera.setTarget(BABYLON.Vector3.Zero());
      // Attach the camera to the canvas
      // camera.attachControl(this.canvas, false);
      // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
      let light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        this.scene
      );
      // light.specular = BABYLON.Color3.White();
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
      let mat = new BABYLON.StandardMaterial("mat", this.scene);

      // mat.diffuseTexture = new BABYLON.Texture(
      //   require("../images/1.webp"),
      //   scene
      // );
      // mat.diffuseTexture.hasAlpha = true;
      // mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
      mat.useAlphaFromDiffuseTexture = true;
      mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
      mat.alpha = 0;
      // mat.backFaceCulling = false;
      // mat.disableLighting = true;
      extrusion.material = mat;
      extrusion.position.y = 0;
      extrusion.actionManager = new BABYLON.ActionManager(this.scene);
      extrusion.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickUpTrigger,
          (event) => {
            console.log(extrusion.position, event);
          }
        )
      );
      let highY = 20,
        times = 10;
      let extrusion2 = extrusion.clone();
      extrusion2.material = mat.clone();
      extrusion2.scaling = new BABYLON.Vector3(1.12, 1.12, 1.12);
      extrusion2.material.alpha = 1;
      extrusion2.position.y = highY;
      this.extrusion = extrusion2;

      //Create a scaling animation
      let animation = new BABYLON.Animation(
        "ySlide",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );
      let animation2 = new BABYLON.Animation(
        "ySlide",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );
      // Animation keys
      let keys = [],
        keys2 = [];
      //At the animation key 0, the value of scaling is "1"
      for (let index = 0; index <= times; index++) {
        keys.push({
          frame: index,
          value: highY - index * (highY / times),
        });
        keys2.push({
          frame: index,
          value: index * (highY / times),
        });
      }
      //Adding keys to the animation object
      animation.setKeys(keys);
      animation2.setKeys(keys2);
      this.animation1 = new BABYLON.AnimationGroup("my group");
      this.animation2 = new BABYLON.AnimationGroup("my group 2");
      this.animation1.addTargetedAnimation(animation, extrusion2);
      this.animation2.addTargetedAnimation(animation2, extrusion2);

      const mat2 = new BABYLON.StandardMaterial("mat2");
      const texture = new BABYLON.Texture(
        new URL("../image/dices.png", import.meta.url).href
      );
      mat2.diffuseTexture = texture;

      let columns = 6;
      let rows = 1;

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
      // let sphere = BABYLON.MeshBuilder.CreateBox(
      //   "box",
      //   { size: 1, segments: 32 },
      //   this.scene
      // );

      // Move the sphere upward at 4 units

      // Our built-in 'ground' shape.
      let ground = BABYLON.MeshBuilder.CreateCylinder(
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
        { mass: 5, restitution: 0.75 },
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

      let sphere2 = sphere.clone("box2");
      let sphere3 = sphere.clone("box3");
      let sphere4 = sphere.clone("box4");
      let sphere5 = sphere.clone("box5");
      sphere.position.y = 4;
      sphere2.position.y = 6;
      sphere3.position.y = 8;
      sphere4.position.y = 10;
      sphere5.position.y = 12;
      // return scene;
      // this.createScene().then((scene) => {
      this.music = new BABYLON.Sound(
        "Violons",
        new URL("../audio/1.mp3", import.meta.url).href,
        this.scene,
        null,
        {
          loop: false,
        }
      );

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
  width: 100%;
  height: 100%;
  background: rgb(34, 25, 77);
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;

    // padding: 10% auto 0;
    canvas {
      width: 100%;
      height: 100%;
    }
  }

  .btn-list {
    position: absolute;
    bottom: 10vh;
    left: 50%;
    transform: translate(-50%, 0);
    width: 80vw;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      display: inline-block;
      width: 25vw;
    }
  }
}
</style>