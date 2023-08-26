<template>
  <div class="bar-box">
    <div class="box-title">{{ data.title }}</div>
    <div class="box-content" id="bar-main"></div>
  </div>
</template>

<script>
// 按需加载
import * as echarts from "echarts/core";
import { GridComponent, TooltipComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, TooltipComponent, BarChart, CanvasRenderer]);

import { toCurPX } from "../assets/common";

export default {
  name: "bar-box",
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
  },
  data() {
    return {
      myChart: null,
    };
  },
  watch: {
    status: {
      handler: function (n) {
        if (n) this.init();
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("bar-main"));
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
        // 折线颜色设置
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#7EFCBC", // 100% 处的颜色
            },
            {
              offset: 1,
              color: "#4073F9", // 0% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        grid: {
          // 图表距离边框的距离，可用百分比和数字（px）配置
          top: "4%",
          left: "0%",
          right: "8%",
          bottom: "2%",
          containLabel: true,
        },
        tooltip: {
          show: false,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: this.data.xAxis,
          // splitLine: {
          //   show: false,
          // },
          // 刻度数值显示
          axisLabel: {
            fontSize: toCurPX(12),
            showMinLabel: true,
            interval: 0, // 显示全部单位
            color: "rgba(173,203,252, 0.6)",
          },
          // base线样式
          axisLine: {
            show: false,
            lineStyle: {
              // color: "rgba(88,146,173, 0.8)"
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          min: 0, // 配置 Y 轴刻度最小值
          // max: 250, // 配置 Y 轴刻度最大值
          // splitNumber: 5,  // 配置 Y 轴数值间隔
          // 分割线样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#284059",
              width: 1,
            },
          },
          // 刻度数值样式
          axisLine: {
            lineStyle: {
              color: "rgba(173,203,252, 0.5)",
            },
          },
          // y轴刻度数值的大小
          axisLabel: {
            fontSize: toCurPX(10),
          },
        },
        series: [
          {
            data: this.data.yAxis,
            type: "bar",
            symbol: "circle", //y轴节点形状
            barWidth: "45%",
          },
        ],
      };
      // 设置参数
      this.myChart.setOption(options);
    },
  },
};
</script>

<style lang="scss" scoped>
.bar-box {
  width: 468px;
  height: 286px;
  box-sizing: border-box;
  padding: 24px 15px;
  @include set-bg-img;
  background-image: url("../img/right2.png");
  .box-title {
    width: 282px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #feffff;
    line-height: 28px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 22px;
    @include set-bg-img;
    background-image: url("../img/left-title.png");
  }
  .box-content {
    width: 448px;
    height: 200px;
  }
}
</style>
