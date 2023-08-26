<template>
  <div class="zdog">
    <div class="top">
      <canvas id="top"></canvas>
    </div>
    <div class="content">
      <canvas id="content"></canvas>
    </div>
    <el-button>Default</el-button>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>

<!--index.wxml-->
<view class="container">
  <view class="cont">
      <movable-area>
          <movable-view x="50vw" y="{{YY}}" direction="vertical" inertia damping="{{YYdamp}}">
              <canvas type="2d" id="canvasTop" />
          </movable-view>
      </movable-area>
      <canvas type="2d" id="canvasBottom" />
      <!-- <view class="show-text" wx:if="{{resDataStr!==''}}">{{resDataStr}}</view> -->
      <view class="btn-list">
          <button disabled="{{startAllStatus}}" bindtap="startAll">摇一摇</button>
      </view>
  </view>
</view>
// zdogDicesGame.js
import Zdog, {
  TAU
} from "zdog";

const optionsArr = [];
const optionDiceXY = [];
const topIllo = [];
const result = [];
const resultTranslate = [];
// const innerAudioContext = wx.createInnerAudioContext({
//   useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
// })
// innerAudioContext.src = "pages/audios/1.mp3" // 1.593
Page({
  data: {
    waitTime: "",
    xx: TAU / 7,
    yy: 0,
    YY: 0,
    targetArr: [{
        x: 0,
        y: 0,
        z: TAU / 4,
        random: "z"
      },
      {
        x: TAU / 4,
        y: 0,
        z: 0,
        random: "y"
      },
      {
        x: TAU / 4,
        y: 0,
        z: TAU / 4,
        random: "y"
      },
      {
        x: TAU / 4,
        y: 0,
        z: -TAU / 4,
        random: "y"
      },
      {
        x: TAU / 4,
        y: 0,
        z: TAU / 2,
        random: "y"
      },
      {
        x: TAU / 2,
        y: 0,
        z: 0,
        random: "z"
      },
    ],
    diceNum: 5,
    startAllStatus: false,
    YYdamp: 100,
    pixelRatio: wx.getSystemInfoSync().pixelRatio,
    volume: 0,
    volumeIcon: '/pages/audios/v.png',
    shakeStatus: false,
    shakeIcon: '/pages/audios/s.png'
    // resDataStr: ""
  },
  showMsg(msg) {
    wx.showModal({
      title: '提示',
      content: JSON.stringify(msg),
    })
  },
  onReady() {
    try {
      // canvas zdog图形 层级问题,先渲染的在底部
      this.initBottom()
      this.initTop()
      if (result.length > 0) {
        this.setData({
          YY: 108000
        })
      }
    } catch (err) {
      this.showMsg(err)
    }
  },
  onShareAppMessage() {
    return {
      title: 'OneMoreGame',
      path: '/pages/zdogGame/zdogGame?from=share',
      imageUrl: "/pages/audios/1.jpg"
    }
  },
  initTop() {
    wx.createSelectorQuery() //此方法等于获取页面所有节点
      .select('#canvasTop') //类似原生JS的选择器,这里根据id
      .fields({
        node: true,
        size: true
      }) //获取到的节点属性配置,node是否返回实例,size是否返回尺寸大小尺寸
      .exec((res) => { //获取之后的回调
        // Canvas 对象
        const element = res[0].node;
        element.width = res[0].width * this.data.pixelRatio;
        element.height = res[0].height * this.data.pixelRatio;
        const illo = new Zdog.Illustration({
          element,
          pixelRatio: this.data.pixelRatio,
          rotate: {
            x: this.data.xx,
            y: this.data.yy,
          },
          scale: {
            x: 2.5,
            y: 2.5,
            z: 2.5
          }
        });
        new Zdog.Cylinder({
          addTo: illo,
          diameter: 100,
          length: 70 * this.data.xx,
          stroke: true,
          color: '#ff0000',
          backface: '#ff0000'
        });
        illo.updateRenderGraph();
        topIllo[0] = illo;
      })
  },
  initBottom() {
    // 底部 
    try {
      wx.createSelectorQuery()
        .select('#canvasBottom') //类似原生JS的选择器,这里根据id
        .fields({
          node: true,
          size: true
        }) //获取到的节点属性配置,node是否返回实例,size是否返回尺寸大小尺寸
        .exec((res) => { //获取之后的回调
          // Canvas 对象
          const element = res[0].node;
          element.width = res[0].width * this.data.pixelRatio;
          element.height = res[0].height * this.data.pixelRatio;
          const illo = new Zdog.Illustration({
            element,
            pixelRatio: this.data.pixelRatio,
            translate: {
              z: 0
            },
            rotate: {
              x: this.data.xx,
              y: this.data.yy,
            },
          });
          new Zdog.Polygon({
            addTo: illo,
            radius: 128,
            sides: 60,
            stroke: 4.5,
            color: '#EA0',
            translate: {
              z: 1
            }
          });
          new Zdog.Polygon({
            addTo: illo,
            radius: 140,
            sides: 60,
            stroke: 15,
            color: '#000',
            fill: true,
            translate: {
              z: 0
            }
          });
          this.initCanvas(illo)
        })
    } catch (err) {
      this.showMsg(err)
    }
  },
  initCanvas(illo) {
    // 骰子
    const illustration = illo;
    let x = -58,
      y = 100,
      fix = 58,
      ty = -10;
    for (let index = 0; index < this.data.diceNum; index++) {
      let xx = index < 2 ? x + (index * fix) + fix / 2 : ((index - 2) * fix) + x;
      let yy = index > 1 ? index == 3 ? y + 15 : y - 15 : ty;
      let zz = index < 2 ? 35 + index : index == 3 ? 60 : 50 + index * 2;
      // 如果存在上一次结果 回显结果
      let resultStatus = result.length > 0;
      let numIdx = Math.floor(Math.random() * 6);
      let random = this.data.targetArr[resultStatus ? (result[index][0] - 1) : numIdx].random
      let rotateOptions = {
        x: this.data.targetArr[resultStatus ? (result[index][0] - 1) : numIdx].x,
        y: this.data.targetArr[resultStatus ? (result[index][0] - 1) : numIdx].y,
        z: this.data.targetArr[resultStatus ? (result[index][0] - 1) : numIdx].z,
        [random]: resultStatus ? result[index][1] : TAU / 36 * parseInt(Math.random() * 72),
      }
      optionDiceXY.push({
        xx,
        yy,
        zz
      })
      illustration['dice' + index] = new Zdog.Anchor({
        addTo: illo,
        translate: {
          x: resultStatus ? resultTranslate[index].x : xx,
          y: resultStatus ? resultTranslate[index].y : yy,
          z: resultStatus ? resultTranslate[index].z : zz
        },
        rotate: {
          ...rotateOptions
        },
        backface: false,
        scale: index <= 1 ? 0.78 : 0.85
      });
      // group describing the faces through rounded rectangles
      const faces = new Zdog.Group({
        addTo: illustration['dice' + index],
      });
      // due to the considerable stroke, it is possible to fake the dice using four faces only
      const face = new Zdog.Rect({
        addTo: faces,
        stroke: 25,
        width: 25,
        height: 25,
        color: "#fff",
        fill: true,
        translate: {
          z: -15,
        },
      });
      // rotate the faces around the center
      face.copy({
        rotate: {
          x: Zdog.TAU / 4,
        },
        translate: {
          y: 15,
        },
      });
      face.copy({
        rotate: {
          x: Zdog.TAU / 4,
        },
        translate: {
          y: -15,
        },
      });
      face.copy({
        translate: {
          z: 15,
        },
      });

      // include the dots repeating as many shapes/groups as possible
      // ! when copying an element be sure to reset the rotation/translation of the copied shape
      // 点数基本信息
      const one = new Zdog.Ellipse({
        diameter: 10,
        stroke: false,
        fill: true,
        color: "#ff0000",
        translate: {
          z: 25,
        },
      });
      // 1
      new Zdog.Ellipse({
        addTo: illustration['dice' + index],
        diameter: 15,
        stroke: false,
        fill: true,
        color: "#ff0000",
        translate: {
          z: 25,
        },
      });
      // 2
      const two = new Zdog.Group({
        addTo: illustration['dice' + index],
        rotate: {
          x: Zdog.TAU / 4,
        },
        translate: {
          y: 25,
        },
      });
      let twoArr = [
        [-10, 10],
        [10, -10]
      ]
      twoArr.forEach(item => {
        one.copy({
          addTo: two,
          color: "#000",
          translate: {
            x: item[0],
            y: item[1],
          },
        });
      })
      // 3
      const three = new Zdog.Group({
        addTo: illustration['dice' + index],
        rotate: {
          y: Zdog.TAU / 4,
        },
        translate: {
          x: 25,
        },
      });
      let threeArr = [
        [0, 0],
        [-10, 10],
        [10, -10]
      ]
      threeArr.forEach(item => {
        one.copy({
          addTo: three,
          color: "#000",
          translate: {
            x: item[0],
            y: item[1],
          },
        })
      });
      // 4
      const four = new Zdog.Group({
        addTo: illustration['dice' + index],
        rotate: {
          y: Zdog.TAU / 4,
        },
        translate: {
          x: -25,
        },
      });
      let fourArr = [
        [10, 10],
        [-10, -10],
        [-10, 10],
        [10, -10],
      ]
      fourArr.forEach(item => {
        one.copy({
          addTo: four,
          color: "#ff0000",
          translate: {
            x: item[0],
            y: item[1],
          },
        });
      })
      // 5
      const five = new Zdog.Group({
        addTo: illustration['dice' + index],
        rotate: {
          x: Zdog.TAU / 4,
        },
        translate: {
          y: -25,
        },
      });
      let fiveArr = [
        [0, 0],
        [10, 10],
        [-10, -10],
        [-10, 10],
        [10, -10],
      ];
      fiveArr.forEach(item => {
        one.copy({
          addTo: five,
          color: "#000",
          translate: {
            x: item[0],
            y: item[1],
          },
        });
      })
      // 6
      const six = new Zdog.Group({
        addTo: illustration['dice' + index],
        translate: {
          z: -25,
        },
      });
      let sixArr = [
        [0, 8],
        [0, -8],
        [-13, 8],
        [-13, -8],
        [13, 8],
        [13, -8]
      ]
      sixArr.forEach(item => {
        one.copy({
          addTo: six,
          color: "#000",
          translate: {
            x: item[0],
            y: item[1],
          },
        });
      })
    }
    optionsArr[0] = illustration;
    optionsArr[0].updateRenderGraph();
    this.setData({
      waitTime: Math.ceil(1.593 * 1000)
    })
  },
  startAll() {
    try {
      if (this.data.shakeStatus) return;
      const innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
      })
      innerAudioContext.src = "pages/audios/1.mp3" // 1.593
      this.start(innerAudioContext);
    } catch (err) {
      this.showMsg(err);
    }
  },
  start(innerAudioContext) {
    try {
      if (this.data.startAllStatus || !optionsArr[0]) {
        return
      };
      this.setData({
        startAllStatus: true,
        // resDataStr: "",
        YY: 108000,
        YYdamp: 200
      })
      // 开始摇骰子
      let num = 0;
      let waitTime = this.data.waitTime,
        loop = 25;
      let times = Math.ceil(waitTime / loop);
      // 播放音频
      innerAudioContext.play()
      // 滚动
      let ticker = 0;
      const cycleCount = 5;
      let item = optionsArr[0];
      let topItem = topIllo[0];
      let timer = setInterval(() => {
          if (num >= times) {
            // 出结果
            clearInterval(timer);
            let totalArr = [];
            // 随机一个数字
            for (let index = 0; index < this.data.diceNum; index++) {
              let resultNum = Math.floor(Math.random() * 6 + 1);
              // 判断最后一个是否和前面的都重合, 外加随机是否允许，如果重合就再来一次随机数
              // let nowResfilter = totalArr.filter(item => item == resultNum);
              // if (nowResfilter.length == (this.data.diceNum - 1) && Math.random() > 0.7) {
              //   resultNum = Math.floor(Math.random() * 6 + 1);
              // }
              totalArr.push(resultNum)
              //  this.data.targetArr.findIndex(item => item.num == resultNum)
              let diceIndex = resultNum - 1;
              // 显示结果骰子
              this.itemRunning(index, diceIndex, true)
            }
            item.rotate = {
              x: this.data.xx,
              y: this.data.yy,
            }
            topItem.rotate = {
              x: this.data.xx,
              y: this.data.yy,
            }
            item.updateRenderGraph();
            topItem.updateRenderGraph();
            // 完成了
            this.setData({
              startAllStatus: false,
              YYdamp: 100,
              // resDataStr: totalArr.join(', ')
            })
          } else {
            num += 1;
            for (let index = 0; index < this.data.diceNum; index++) {
              let idx = Math.floor(Math.random() * 6);
              this.itemRunning(index, idx)
            }
            // 整体晃动
            let progress = ticker / cycleCount;
            topIllo[1] = !topIllo[1];
            let tween = Zdog.easeInOut(progress % 1, 10);
            item.rotate.y = topIllo[1] ? tween * Zdog.TAU / 72 : tween * Zdog.TAU / 72 * -1;
            topItem.rotate.y = topIllo[1] ? tween * Zdog.TAU / 72 : tween * Zdog.TAU / 72 * -1;
            ticker++;
            topItem.updateRenderGraph()
            item.updateRenderGraph();
          }
        },
        loop);
    } catch (err) {
      console.log(err);
      this.setData({
        startAllStatus: false,
      })
    }
  },
  /**
   * 
   * @param {*} index 骰子
   * @param {*} idx 数字结果
   */
  itemRunning(index, idx, type) {
    let item = optionsArr[0];
    let sup = this.data.targetArr[idx].random;
    if (type) {
      item['dice' + index].rotate.x = this.data.targetArr[idx].x;
      item['dice' + index].rotate.y = this.data.targetArr[idx].y;
      item['dice' + index].rotate.z = this.data.targetArr[idx].z;
    } else {
      item['dice' + index].rotate.x += this.data.targetArr[idx].x;
      item['dice' + index].rotate.y += this.data.targetArr[idx].y;
      item['dice' + index].rotate.z += this.data.targetArr[idx].z;
    }
    // 摇摆方向
    item['dice' + index].rotate[sup] = Math.random() > 0.5 ? -TAU / 36 * parseInt(Math.random() * 72) : TAU / 36 * parseInt(Math.random() * 72);
    // 位移方向
    let runx = -5,
      runx2 = 5;
    let runz = -5,
      runz2 = 5;
    let runy = -10,
      runy2 = 5;
    if (index == 0 || index == 2) {
      runx = -10;
    } else if (index == 1 || index == 4) {
      runx2 = 10;
    } else if (index == 3) {
      runx = -5;
      runy = -20;
    }
    item['dice' + index].translate.x = optionDiceXY[index].xx + Math.ceil((Math.random() * (runx2 - runx + 1)) + runx);
    item['dice' + index].translate.y = optionDiceXY[index].yy + Math.ceil((Math.random() * (runy2 - runy + 1)) + runy);
    item['dice' + index].translate.z = optionDiceXY[index].zz + Math.ceil((Math.random() * (runz2 - runz + 1)) + runz);
    if (type) {
      result[index] = [idx + 1, item['dice' + index].rotate[sup]]
      resultTranslate[index] = {
        x: item['dice' + index].translate.x,
        y: item['dice' + index].translate.y,
        z: item['dice' + index].translate.z
      }
    }
  },
})