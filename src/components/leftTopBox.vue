<template>
  <div class="left-top-box">
    <div class="box-title">{{ title }}</div>
    <div class="box-content">
      <div class="box-content-item" v-for="(item, idx) in data" :key="idx">
        <span class="index" :class="['index' + (idx + 1)]"
          >TOP{{ idx + 1 }}</span
        >
        <span class="city">{{ item.city }}</span>
        <div class="item-line">
          <div class="item-line-base"></div>
          <div
            class="item-line-active"
            :style="{ width: status ? (item.value / maxNum) * 100 + '%' : '' }"
          ></div>
        </div>
        <count-to
          class="value"
          ref="countTo"
          separator=""
          :start-val="0"
          :end-val="item.value"
          :duration="1000"
        ></count-to>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  name: "left-top-box",
  components: {
    countTo,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    maxNum: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      status: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.status = true;
    }, 100);
  },
};
</script>

<style lang="scss" scoped>
.left-top-box {
  width: 468px;
  height: 300px;
  padding: 20px 15px;
  @include set-bg-img;
  background-image: url("../img/left-box-bg.png");
  .box-title {
    width: 282px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #feffff;
    line-height: 28px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 32px;
    @include set-bg-img;
    background-image: url("../img/left-title.png");
  }
  .box-content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding-left: 8px;
    .box-content-item {
      width: 430px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 26px;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        display: inline-block;
      }
      .index {
        font-size: 14px;
        font-weight: 400;
        font-style: italic;
        font-family: Impact;
        color: #adccfc;
        align-self: center;
        height: 30px;
        width: 40px;
        line-height: 26px;
        padding-right: 2px;
        &.index1 {
          background: linear-gradient(
            -51deg,
            #fbe8a3 0.146484375%,
            #f7ce34 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        &.index2 {
          background: linear-gradient(
            -51deg,
            #f6f6f6 0.4150390625%,
            #969595 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        &.index3 {
          background: linear-gradient(-51deg, #f6c897 0%, #b98d5b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .city {
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        font-style: italic;
        color: #adccfc;
        white-space: nowrap;
        width: 88px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-line {
        width: 240px;
        height: 10px;
        position: relative;
        .item-line-base {
          width: 240px;
          height: 10px;
          position: relative;
          background: rgba($color: #4a9cea, $alpha: 0.6);
        }
        .item-line-active {
          width: 0;
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0;
          height: 10px;
          transition: all 0.3s ease-in-out;
          background-image: linear-gradient(90deg, #4073f9 0%, #7efcbc 100%);
        }
      }
      .value {
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
