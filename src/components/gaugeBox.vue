<template>
  <div class="gauge-box">
    <p class="title-tip">{{ title }}</p>
    <div class="box-content" id="gauge-main" ref="gaugeMain"></div>
  </div>
</template>

<script>
// 按需加载 echarts
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GaugeChart, CanvasRenderer]);

import { toCurPX } from "../assets/common.js";
export default {
  name: "gauge-box",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    status: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  watch: {
    status: {
      // 渲染视图
      handler: function (n) {
        if (n) {
          this.init();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.gaugeMain);
      this.setOptions();
      // 重新绘制
      window.addEventListener("resize", () => {
        if (!this.myChart) return;
        this.myChart.resize();
        this.setOptions();
      });
    },
    setOptions() {
      // 绘制图表
      let options = {
        series: [
          {
            min: 0,
            max: 50,
            center: ["50%", "45%"],
            radius: "85%",
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: toCurPX(30),
                color: [
                  [0.3, "#67e0e3"],
                  [0.7, "#37a2da"],
                  [1, "#fd666d"],
                ],
              },
            },
            pointer: {
              itemStyle: {
                color: "inherit",
              },
            },
            axisTick: {
              distance: toCurPX(-29),
              length: toCurPX(8),
              lineStyle: {
                color: "#fff",
                width: 2,
              },
            },
            splitLine: {
              distance: toCurPX(-30),
              length: toCurPX(30),
              lineStyle: {
                color: "#fff",
                width: toCurPX(4),
              },
            },
            axisLabel: {
              color: "inherit",
              distance: toCurPX(40),
              fontSize: toCurPX(14),
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
              color: "inherit",
              offsetCenter: [0, "80%"],
              fontSize: toCurPX(36)
            },
            data: [
              {
                value: +(Math.random() * 50).toFixed(2)
              },
            ],
          },
        ],
      }
      
      this.myChart.setOption(options);
    },
  },
};
</script>

<style lang="scss" scoped>
.gauge-box {
  width: 100%;
  height: 300px;
  box-sizing: border-box;
  // padding: 24px 15px;
  position: relative;
  top: -8px;

  .title-tip {
    font-size: 16px;
    font-weight: 500;
    color: #feffff;
    line-height: 16px;
    text-align: center;
    position: relative;
    top: -10px;
  }
  .box-content {
    width: 100%;
    height: 100%;
  }
}
</style>
