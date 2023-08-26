<template>
  <div id="app">
    <div class="top">
      <!-- 头部信息展示 -->
      <div class="left-desc">
        <div class="date-timing">{{ time }}</div>
        <div class="date-detail">
          <p>{{ date }}</p>
          <p>{{ weekday }}</p>
        </div>
      </div>
      <div class="top-title">物遥系统</div>
      <div class="top-date">
        <div class="date-timing">{{ time }}</div>
        <div class="date-detail">
          <p>{{ date }}</p>
          <p>{{ weekday }}</p>
        </div>
      </div>
    </div>
    <div class="cont">
      <div class="left-box">
        <!-- 左侧展示数据 -->
        <left-top-box
          v-for="(box, idx) in boxData"
          :title="box.title"
          :data="box.data"
          :maxNum="box.maxNum"
          :key="idx + 100"
          class="item-box-wrapper"
        ></left-top-box>
      </div>
      <div class="content-box">
        <!-- 中间展示数据 -->
        <div class="content-box-top content-box-top2">
          <!-- 展示相关总数 -->
          <top-box
            class="content-box-top-item"
            v-for="(item, idx) in topBoxData1"
            :data="item"
            :key="idx"
          ></top-box>
        </div>

        <div class="content-box-top">
          <!-- 展示相关总数 -->
          <top-box
            class="content-box-top-item"
            v-for="(item, idx) in topBoxData"
            :data="item"
            :key="idx"
          ></top-box>
        </div>
        <!-- 广东省企业分布 -->
        <div class="content-box-cont">
          <p class="content-box-cont-title">设备分布</p>
          <div class="content-box-cont-show-num">
            <map-top-box
              class="map-box-item"
              v-for="(mapBox, idx) in mapTopData.slice(0, 5)"
              :key="idx + 1000"
              :data="mapBox"
            ></map-top-box>
          </div>
          <div class="content-box-cont-show-map1">
            <!-- 地图展示组件 -->
            <!-- <my-map :data="mapTopData" :status="mapBoxDataStatus"></my-map> -->
          </div>
        </div>
        <!-- <div class="content-box-top">
          <line-box-big
          :status="lineBoxDataStatus"
          class="item-box-wrapper"
          :data="lineBoxData4"
          >
          </line-box-big>
        </div> -->
        <div class="content-box-cont content-box-cont2">
          <p class="content-box-cont-title">近两日能耗比</p>
          <div class="content-box-cont-show-num">
            <gauge-box title="昨日的能耗比"></gauge-box>
            <gauge-box title="今日的能耗比"></gauge-box>
          </div>
        </div>
      </div>
      <div class="right-box">
        <!-- 右侧展示数据 -->
        <!-- <right-box :data="rightBoxData" class="item-box-wrapper"></right-box> -->
        <!-- barBox -->
        <line-box
          :status="lineBoxDataStatus"
          class="item-box-wrapper"
          :data="lineBoxData"
        ></line-box>
        <line-box
          :status="lineBoxDataStatus"
          class="item-box-wrapper"
          :data="lineBoxData2"
        ></line-box>
        <line-box
          :status="lineBoxDataStatus"
          class="item-box-wrapper"
          :data="lineBoxData3"
        ></line-box>
        <!-- <bar-box
          :status="barBoxDataStatus"
          :data="barBoxData"
          class="item-box-wrapper"
        ></bar-box> -->
        <!-- pieBox -->
        <!-- <pie-box :data="pieBoxData" class="item-box-wrapper"></pie-box> -->
      </div>
    </div>
  </div>
</template>

<script>
import LeftTopBox from "@/components/leftTopBox.vue"; //左侧数据展示组件
import TopBox from "@/components/topBox.vue"; // 中间总数展示组件
import MapTopBox from "@/components/mapTopBox.vue"; // 广东省数据展示组件
// import MyMap from "@/components/map.vue";
import LineBox from "@/components/lineBox.vue";
// import LineBoxBig from "@/components/lineBoxBig.vue";
// import RightBox from "@/components/rightBox.vue";
// import BarBox from "@/components/barBox.vue"; // 柱状图
// import PieBox from "@/components/pieBox.vue"; // 圆饼图
import gaugeBox from "@/components/gaugeBox.vue"; // 圆饼图
// 时间显示
const weekday = require("dayjs/plugin/weekday");
import dayjs from "dayjs";
dayjs.extend(weekday);
//
import { getWeekday } from "@/assets/common.js";

// api
// import {
// getTopThreeData,
// getLeftThreeData,
// getRightOneData,
// getRightTwoData,
// getRightThreeData,
// getRightFourData,
// getMapData,
// } from "./api";

export default {
  name: "App",
  components: {
    LeftTopBox,
    TopBox,
    MapTopBox,
    LineBox,
    gaugeBox,
    // LineBoxBig
    // RightBox,
    // MyMap,
    // BarBox,
    // PieBox,
  },
  data() {
    return {
      // 左侧数据
      boxData: [
        {
          title: "昨日用水量排行",
          maxNum: 0,
          data: [],
        },
        {
          title: "昨日用电量排行",
          maxNum: 0,
          data: [],
        },
        {
          title: "昨日能耗比排行",
          maxNum: 0,
          data: [],
        },
      ],
      topBoxData1: {
        water: {
          value: 12200,
          desc: "总水量(吨)",
        },
        electricity: {
          value: 11120,
          desc: "总电量(千瓦)",
        },
      },
      // 中间部分总数
      topBoxData: {
        allUsers: {
          value: 0,
          desc: "设备总数",
        },
        allOffers: {
          value: 0,
          desc: "在线设备",
        },
        company: {
          value: 0,
          desc: "故障设备",
        },
      },
      // right-box -上周热词
      rightBoxData: {
        title: "上周热词",
        data: [],
      },
      // 柱状图数据
      barBoxData: {
        title: "设备城市TOP8",
        xAxis: [],
        yAxis: [],
      },
      barBoxDataStatus: false,
      // 饼状图数据
      pieBoxData: {
        title: "用户分布",
        pieData1: [],
        pieData2: [],
      },
      // 折线图数据
      lineBoxDataStatus: false,
      lineBoxData: {
        title: "近一年用水量趋势",
        xAxis: [],
        yAxis: [],
      },
      lineBoxData2: {
        title: "近一年用电量趋势",
        xAxis: [],
        yAxis: [],
      },
      lineBoxData3: {
        title: "近一年能耗比趋势",
        xAxis: [],
        yAxis: [],
      },
      lineBoxData4: {
        title: "近一年能耗比趋势",
        xAxis: [],
        yAxis: [],
      },
      // 展示广东省前数据
      mapBoxDataStatus: false,
      mapTopData: [],
      timer: null,
      date: "",
      time: "",
      weekday: "",
      apiTimeout: 3000, // 接口轮询时间
      apiTimeoutTimer: null,
    };
  },
  created() {
    try {
      // 显示时间
      this.getTime();
      // 获取数据
      // left-one  left-two data
      this.getLeftOneDataMethod();
      // // left-three data
      this.getLeftThreeDataMethod();
      // // right-one data
      this.getRightOneDataMethod();
      // // right-two data
      this.getRightTwoDataMethod();
      // // mid-one data
      this.getTopThreeDataMethod();
      // // mid-two data map
      this.getMapDataMethod();
    } catch (err) {
      console.log("created err:", err);
    }
    // this.apiTimeoutTimer = setInterval(() => {
    //   // 定时轮询
    //   this.apiDataUpdate();
    // }, this.apiTimeout);
  },
  methods: {
    apiDataUpdate() {
      // 添加需要 定时获取数据的 接口
      // mid-one data
      // this.getTopThreeDataMethod();
      // mid-two data map
      // this.getMapDataMethod();
    },
    getTime() {
      // 初始化时间
      this.time = dayjs().format("HH:mm:ss");
      this.date = dayjs().format("YYYY-MM-DD");
      let day = dayjs().weekday();
      this.weekday = getWeekday(day);
      // requestAnimationFrame(this.getTime)
      // 时间定时更新 1000ms
      this.timer = setInterval(() => {
        this.time = dayjs().format("HH:mm:ss");
        this.date = dayjs().format("YYYY-MM-DD");
        let day = dayjs().weekday();
        this.weekday = getWeekday(day);
      }, 1000);
    },
    async getLeftOneDataMethod() {
      try {
        // 返回数据
        this.boxData[0].data = [
          { city: "天真大学不存在", value: 5754 },
          { city: "快乐大学不存在", value: 1733 },
          { city: "学习大学不存在", value: 1291 },
          { city: "吃饭大学不存在", value: 447 },
          { city: "就业大学不存在", value: 156 },
        ];
        this.boxData[0].maxNum = 5800;
        this.boxData[1].data = [
          { city: "骑车大学不存在", value: 16937 },
          { city: "汽车大学不存在", value: 10769 },
          { city: "游泳大学不存在", value: 6779 },
          { city: "爬山大学不存在", value: 554 },
          { city: "徒步大学不存在", value: 342 },
        ];
        this.boxData[1].maxNum = 17000;
        this.boxData[2].data = [
          { city: "骑车大学不存在", value: 16937 },
          { city: "汽车大学不存在", value: 10769 },
          { city: "游泳大学不存在", value: 6779 },
          { city: "爬山大学不存在", value: 554 },
          { city: "徒步大学不存在", value: 342 },
        ];
        this.boxData[2].maxNum = 17000;
      } catch (err) {
        console.log("getLeftOneDataMethod err:", err);
        this.$toast(err.message);
      }
    },
    async getLeftThreeDataMethod() {
      try {
        // 获取折线图 left-three data
        // 处理数据
        let x = [];
        let y = [];
        let res = {
          data: [
            {
              year: 2022,
              month: 6,
              deliveryNum: (Math.random() * 8808).toFixed(3),
            },
            {
              year: 2022,
              month: 7,
              deliveryNum: (Math.random() * 2222).toFixed(3),
            },
            {
              year: 2022,
              month: 8,
              deliveryNum: (Math.random() * 2222).toFixed(3),
            },
            {
              year: 2022,
              month: 9,
              deliveryNum: (Math.random() * 11629).toFixed(5),
            },
            {
              year: 2022,
              month: 10,
              deliveryNum: (Math.random() * 1129).toFixed(4),
            },
            {
              year: 2022,
              month: 11,
              deliveryNum: (Math.random() * 11029).toFixed(5),
            },
            {
              year: 2022,
              month: 12,
              deliveryNum: (Math.random() * 6029).toFixed(4),
            },
            {
              year: 2023,
              month: 1,
              deliveryNum: (Math.random() * 6029).toFixed(4),
            },
            {
              year: 2023,
              month: 2,
              deliveryNum: (Math.random() * 1029).toFixed(4),
            },
            {
              year: 2023,
              month: 3,
              deliveryNum: (Math.random() * 1029).toFixed(4),
            },
            {
              year: 2023,
              month: 4,
              deliveryNum: (Math.random() * 1029).toFixed(4),
            },
            {
              year: 2023,
              month: 5,
              deliveryNum: (Math.random() * 1029).toFixed(4),
            },
          ],
        };
        if (res.data.length) {
          res.data.forEach((item) => {
            x.push(item.month + "月");
            y.push(item.deliveryNum);
          });
        }
        this.lineBoxData.xAxis = x;
        this.lineBoxData.yAxis = y;
        let yy = [];
        y.forEach((y) => {
          yy.push((Math.random() * y*4).toFixed(y.length));
        });
        this.lineBoxData2.xAxis = x;
        this.lineBoxData2.yAxis = yy;
        this.lineBoxData3.xAxis = x;
        let yy2 = [];
        y.forEach((y, idx) => {
          let res = yy[idx] / y
          yy2.push(res.toFixed(y.length));
        });
        this.lineBoxData3.yAxis = yy2;
        // 渲染视图
        setTimeout(() => {
          this.lineBoxDataStatus = true;
        }, 100);
      } catch (err) {
        console.log("getLeftThreeDataMethod err:", err);
        this.$toast(err.message);
      }
    },
    async getRightOneDataMethod() {
      try {
        // right-one data
        let res = {
          data: [
            {
              thisWeekWord: "产品经理",
              thisWeekNum: 2,
              lastWeekWord: "产品经理",
              lastWeekNum: 1,
              searchTrend: -1,
            },
            {
              thisWeekWord: "产品助理",
              thisWeekNum: 3,
              lastWeekWord: "产品助理",
              lastWeekNum: 2,
              searchTrend: -1,
            },
            {
              thisWeekWord: "网络推广专员",
              thisWeekNum: 223,
              lastWeekWord: "网络推广专员",
              lastWeekNum: 3,
              searchTrend: -1,
            },
            {
              thisWeekWord: "UI设计",
              thisWeekNum: 33,
              lastWeekWord: "UI设计",
              lastWeekNum: 4,
              searchTrend: -1,
            },
            {
              thisWeekWord: "运营助理",
              thisWeekNum: 7,
              lastWeekWord: "运营助理",
              lastWeekNum: 5,
              searchTrend: -1,
            },
            {
              thisWeekWord: "产品专员",
              thisWeekNum: 35,
              lastWeekWord: "产品专员",
              lastWeekNum: 6,
              searchTrend: -1,
            },
            {
              thisWeekWord: "软件测试",
              thisWeekNum: 6,
              lastWeekWord: "软件测试",
              lastWeekNum: 7,
              searchTrend: 1,
            },
          ],
        };
        if (res.data.length) {
          res.data.forEach((item) => {
            item.text = item.lastWeekWord;
            item.status = item.searchTrend;
          });
        }
        this.rightBoxData.data = res.data;
      } catch (err) {
        console.log("getRightOneDataMethod err:", err);
        this.$toast(err.message);
      }
    },
    async getRightTwoDataMethod() {
      try {
        let res = {
          data: [
            { deliveryIndustry: "机械", amount: 22697 },
            { deliveryIndustry: "互联网", amount: 17303 },
            { deliveryIndustry: "交通", amount: 8912 },
            { deliveryIndustry: "专业服务", amount: 6960 },
            { deliveryIndustry: "房地产", amount: 4827 },
            { deliveryIndustry: "消费品", amount: 4211 },
            { deliveryIndustry: "金融", amount: 3272 },
            { deliveryIndustry: "教育培训", amount: 2916 },
          ],
        };
        // 处理数据
        let x = [];
        let y = [];
        if (res.data.length) {
          res.data.forEach((item) => {
            x.push(item.deliveryIndustry);
            y.push(item.amount);
          });
        }
        this.barBoxData.xAxis = x;
        this.barBoxData.yAxis = y;
        setTimeout(() => {
          this.barBoxDataStatus = true;
        }, 1000);
      } catch (err) {
        console.log("getRightTwoDataMethod err:", err);
        this.$toast(err.message);
      }
    },
    async getTopThreeDataMethod() {
      try {
        // 获取三个总数 数据
        // let topThreeData = await getTopThreeData();
        this.topBoxData.allUsers.value = 122976;
        this.topBoxData.allOffers.value = 9541;
        this.topBoxData.company.value = 4179;
      } catch (err) {
        console.log("getTopThreeDataMethod err:", err);
        this.$toast(err.message);
      }
    },
    getMapDataMethod() {
      try {
        let res = {
          data: [
            { city: "东莞市", cityEnterpriseNum: 2360 },
            { city: "中山市", cityEnterpriseNum: 65 },
            { city: "云浮市", cityEnterpriseNum: 4 },
            { city: "佛山市", cityEnterpriseNum: 12387 },
            { city: "广州市", cityEnterpriseNum: 778 },
            { city: "惠州市", cityEnterpriseNum: 11098 },
            { city: "揭阳市", cityEnterpriseNum: 4 },
            { city: "梅州市", cityEnterpriseNum: 6 },
            { city: "汕头市", cityEnterpriseNum: 15 },
            { city: "汕尾市", cityEnterpriseNum: 4 },
            { city: "江门市", cityEnterpriseNum: 18 },
            { city: "河源市", cityEnterpriseNum: 12 },
            { city: "深圳市", cityEnterpriseNum: 572 },
            { city: "清远市", cityEnterpriseNum: 13 },
            { city: "湛江市", cityEnterpriseNum: 6 },
            { city: "潮州市", cityEnterpriseNum: 7 },
            { city: "珠海市", cityEnterpriseNum: 8790 },
            { city: "肇庆市", cityEnterpriseNum: 10 },
            { city: "茂名市", cityEnterpriseNum: 6 },
            { city: "阳江市", cityEnterpriseNum: 6 },
            { city: "韶关市", cityEnterpriseNum: 6 },
          ],
        };
        if (res.data.length) {
          res.data.forEach((item) => {
            item.value = item.cityEnterpriseNum;
          });
        }
        res.data.sort((a, b) => {
          return b.value - a.value;
        });
        this.mapTopData = res.data;
        setTimeout(() => {
          this.mapBoxDataStatus = true;
        }, 1000);
      } catch (err) {
        console.log("getMapDataMethod err:", err);
        this.$toast(err.message);
      }
    },
  },
  beforeDestroy() {
    // 清除定时器
    this.timer && clearInterval(this.timer);
    this.apiTimeoutTimer && clearInterval(this.apiTimeoutTimer);
  },
};
</script>

<style lang="scss" scoped>
@import "./style/app.scss";
</style>
