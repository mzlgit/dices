<template>
  <div class="map-box">
    <div class="map-content" id="map"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
import guangdongJson from "../assets/guangdong.json";
export default {
  name: "map-show",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  watch: {
    status: {
      handler: function (n) {
        if (n) {
          this.init();
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    // 防止内存泄露
    if (!this.myChart) {
      return;
    }
    this.myChart.dispose();
    this.myChart = null;
  },

  methods: {
    // 根据城市名获取坐标
    changeRankData(city = [], data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let geoCoord = city.filter((item) => {
          return item.properties.name.indexOf(data[i].city) !== -1;
        });
        let index = i > 4 ? 0 : (50 - (i*10));
        if (geoCoord.length) {
          res.push({
            name: data[i].city,
            value: geoCoord[0].properties.centroid.concat(data[i].value, index),
          });
        }
      }
      return res;
    },
    init() {
      this.myChart = echarts.init(document.getElementById("map"));
      this.setOptions();
      // 重新绘制
      window.addEventListener("resize", () => {
        if (!this.myChart) return;
        this.myChart.resize();
        this.setOptions();
      });
    },
    setOptions() {
      echarts.registerMap("guangdong", guangdongJson);
      let mapFeatures = echarts.getMap("guangdong").geoJson.features;
      // 图表配置项
      let option = {
        geo: {
          // 2D地图坐标系
          show: true, // 不显示地图，用于为动效散点提供2D地图坐标系
          map: "guangdong",
          roam: false, // 禁用缩放、拖拽
          layoutCenter: ["50%", "50%"], // 地图中心位置
          layoutSize: "125%", // 控制地图尺寸（地图的宽度和高度都会改变）
          aspectScale: 1.5, // 控制地图长宽比（此值越小地图越窄，越大地图越宽）
          zlevel: 1,
          itemStyle: {
            color: "rgba(46,102,248, 0.8)",
            opacity: 1,
            borderWidth: 0.5,
            borderColor: "rgba(0,230,230, 0.8)",
            // shadowOffsetX: 0,
            shadowOffsetY: 2.3,
            shadowColor: "rgba(0,56,199, 1)",
            shadowBlur: 0,
          },
          emphasis: {
            disabled: false, //是否可以被选中
            label: {
              show: false,
            },
            itemStyle: {
              color: "#DAA33B",
            },
          },
          label: {
            show: false,
          },
          shading: "lambert",
          tooltip: {
            formatter: (opt) => {
              let name = opt.name;
              let arr = this.data.filter(
                (item) => name.indexOf(item.city) !== -1
              );
              let val = arr.length ? arr[0].value : 0;
              return `<span class='name'>${name}</span><br/><span class='num'>${val}</span>`;
            },
          },
        },
        tooltip: {
          show: true,
          position: "top",
          className: "map-tip",
        },
        series: [
          {
            // 动效散点图层，使用2D地图坐标系
            type: "effectScatter",
            coordinateSystem: "geo",
            silent: true,
            zlevel: 2,
            rippleEffect: {
              //涟漪特效
              period: 3, //动画时间，值越小速度越快
              brushType: "fill", //波纹绘制方式 stroke, fill
              scale: 8, //波纹圆环最大限制，值越大波纹越大
            },
            symbol: "circle",
            symbolSize: function (val) {
              //圆环大小  根据val[3]去判断是否需要显示 散点图
              if(val[3] !== 0) {
                let num = val[3] / 8;
                return num;
              }
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            tooltip: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: "#17FEB9",
              },
            },
            data: this.changeRankData(mapFeatures, this.data),
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.map-box {
  width: 820px;
  height: 560px;
  margin: 0 auto;
  //pointer-events: none;
  transform: scale;
  .map-content {
    widows: 820px;
    height: 560px;
  }
}
</style>
<style>
.map-box .map-tip {
  display: none;
  width: 120px !important;
  height: 88px !important;
  background-color: unset !important;
  box-shadow: unset !important;
  padding: 0 !important;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../img/city-tip.png");
}
.map-box .map-tip .name {
  display: inline-block;
  width: 120px;
  height: 12px;
  line-height: 12px;
  font-size: 18px;
  text-align: center;
  color: rgba(245, 173, 33, 0.6);
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
}
.map-box .map-tip .num {
  display: inline-block;
  width: 120px;
  height: 24px;
  line-height: 24px;
  font-size: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
}
.map-box .map-tip div {
  display: none !important;
}
</style>
