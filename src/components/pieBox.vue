<template>
  <div class="pie-box">
    <div class="box-title">{{ data.title }}</div>
    <div class="box-content">
      <div id="pie-main"></div>
      <div id="pie-main2"></div>
    </div>
  </div>
</template>

<script>
// 按需加载
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);
import { toCurPX } from "../assets/common";
export default {
  name: "pie-box",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          pieData1: [],
          pieData2: []
        };
      },
    }
  },
  data() {
    return {
      timer1: null,
      timer2: null,
      myChart1: null,
      myChart2: null,
    };
  },
  watch: {
    'data.pieData1': {
      handler: function (n, o) {
        // 判断 是否初始化，是否更新视图
        if(n.length && o && o.length == 0) {
          // 初始化
          if (n) this.init();
        } else if (n.length && o && o.length) {
          // 已存在视图
          let status = this.checkStatus(n, o);
          if(status) {
            // 是否需要更细视图
            this.setOptions();
          }
        }
      },
      immediate: true,
    },
    'data.pieData2': {
      handler: function (n, o) {
        if (n.length && o && o.length) {
          // 已存在视图
          let status = this.checkStatus(n, o);
          if(status) {
            // 是否需要更细视图
            this.setOptions();
          }
        }
      },
      immediate: true,
    }
  },
  methods: {

    init() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart1 = echarts.init(document.getElementById("pie-main"));
      this.myChart2 = echarts.init(document.getElementById("pie-main2"));
      this.setOptions();
      // 重新绘制
      window.addEventListener("resize", () => {
        if (!this.myChart1) return;
        if (!this.myChart2) return;
        this.myChart1.resize();
        this.myChart2.resize();
        this.setOptions();
      });
    },
    checkStatus(arrNew, arrOld) {
      let target = false;
      for(let i = 0; i< arrNew.length; i++) {
        if(arrNew[i].value !== arrOld[i].value) {
          target = true;
          break;
        }
      }
      return target;
    },
    setOptions() {
      let seriesOpts = {
        name: "Radius Mode",
        type: "pie",
        radius: ["45%", "85%"],
        center: ["48%", "40%"],
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          itemStyle: {
            borderDashOffset: 5,
            shadowBlur: 10,
          },
          label: {
            show: true,
            fontSize: toCurPX(16),
            formatter: function (opt) {
              return (
                "{a|" +
                opt.data.value +
                "}{b|" +
                "%}\n" +
                "{c|" +
                opt.data.name +
                "}"
              );
            },
            rich: {
              a: {
                color: "rgba(253,253,255, 0.9)",
                fontSize: toCurPX(24),
                fontWeight: "bold",
                padding: [0, 0, 0, 0],
              },
              b: {
                color: "rgba(253,253,255, 0.9)",
                fontSize: toCurPX(16),
                padding: [8, 0, 0, 4],
              },
              c: {
                color: "rgba(253,253,255, 0.9)",
                fontSize: toCurPX(16),
                padding: [4, 0, 0, 0],
                width: "",
              },
            },
          },
        },
        labelLine: {
          show: false,
        },
      };
      let pieData1 = this.data.pieData1;
      let pieData2 = this.data.pieData2;
      // })
      let opt1 = {
        // 折线颜色设置
        color: ["#1A89FF", "#FEB413", "#06DBFB", "#FE691F"],
        textStyle: {
          color: "#545659",
          fontSize: 12,
          rich: {
            a: {
              // 设置模型name的样式
              color: "rgba(253,253,255, 0.8)",
              fontSize: toCurPX(10),
              padding: [0, 0, 0, 2],
              width: toCurPX(40),
              verticalAlign: "middle",
              // align: "left",
            },
            b: {
              // 设置value的样式
              color: "#58B9F8",
              fontSize: toCurPX(10),
              padding: [0, 0, 0, 0],
              // width: 10,
              // align: "right",
            },
          },
        },
        legend: {
          selectedMode: false,
          bottom: "4%",
          icon: "circle",
          itemWidth: toCurPX(8),
        },
        itemStyle: {
          normal: {
            //饼状图阴影，值越大阴影亮度越高
            shadowBlur: 200,
            shadowColor: "red",
          },
        },
        // series: [data],
      };
      // 数据源控制
      let pieLegend1 = {
        orient: "horizontal",
        formatter: function (name) {
          let val = pieData1.filter((item) => item.name == name)[0].value;
          return "{a|" + name + "}{b|" + val + "%}";
        },
      };
      let pieLegend2 = {
        orient: "vertical",
        formatter: function (name) {
          let val = pieData2.filter((item) => item.name == name)[0].value;
          return "{a|" + name + "}{b|" + val + "%}";
        },
      };
      // series data
      let series1 = {
        ...seriesOpts,
        radius: ["40%", "75%"],
        data: pieData1,
      };
      let series2 = {
        ...seriesOpts,
        radius: ["50%", "90%"],
        center: ["50%", "40%"],
        data: pieData2,
      };
      // echarts option
      let myChart1Opt = {
        ...opt1,
        legend: {
          ...opt1.legend,
          ...pieLegend1,
        },
        series: [series1],
      };

      let myChart2Opt = {
        ...opt1,
        legend: {
          ...opt1.legend,
          ...pieLegend2,
        },
        series: [series2],
      };
      // setOption
      this.myChart1.setOption(myChart1Opt);
      this.myChart2.setOption(myChart2Opt);
      //设置默认选中高亮部分
      let len1 = pieData1.length;
      let len2 = pieData2.length;
      // 取消定时 取消高亮
      this.timer1 && clearInterval(this.timer1);
      this.hideIndex(this.myChart1, len1);
      this.timer2 && clearInterval(this.timer2);
      this.hideIndex(this.myChart2, len2);
      // 自动轮播
      this.showIndex(this.myChart1, len1, "timer1", 2000);
      this.showIndex(this.myChart2, len2, "timer2", 3000);
    },
    hideIndex(chart, len) {
      for (let i = 0; i < len; i++) {
        chart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: i,
        });
      }
    },
    showIndex(chart, len, timer, duration) {
      let i = 0;
      //设置默认选中高亮部分
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: i,
      });
      this[timer] = setInterval(function () {
        i++;
        if (i == len) {
          i = 0;
        }
        chart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: i == 0 ? len - 1 : i - 1,
        });
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: i == len ? 0 : i,
        }); //设置默认选中高亮部分
      }, duration);
    },
  },
};
</script>

<style lang="scss" scoped>
.pie-box {
  width: 468px;
  height: 382px;
  box-sizing: border-box;
  padding: 24px 15px;
  @include set-bg-img;
  background-image: url("../img/user-bg.png");
  .box-title {
    width: 282px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #feffff;
    line-height: 28px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 26px;
    @include set-bg-img;
    background-image: url("../img/left-title.png");
  }
  .box-content {
    width: 438px;
    height: 288px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    pointer-events: none;
    > div {
      height: 288px;
    }
    #pie-main {
      width: 239px;
    }
    #pie-main2 {
      width: 179px;
    }
  }
}
</style>
