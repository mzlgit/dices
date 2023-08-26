<template>
  <div class="right-box">
    <div class="box-title">{{ data.title }}</div>
    <div class="box-content">
      <div class="box-content-desc">
        <p>关键词</p>
        <p>搜索趋势</p>
      </div>
      <div class="box-content-cont">
        <div class="box-content-cont-wrp" :style="{'animation-duration': (data.data.length)*1.5+'s'}">
          <div class="cont-item" v-for="(item, idx) in data.data" :key="idx">
            <span class="no">No.{{ idx + 1 }}</span>
            <span class="text">{{ item.text }}</span>
            <span class="status" :class="{ up: item.status == 1 }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "right-box",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.right-box {
  width: 468px;
  height: 263px;
  box-sizing: border-box;
  padding: 24px 15px;
  @include set-bg-img;
  background-image: url("../img/right1.png");
  .box-title {
    width: 282px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #feffff;
    line-height: 28px;
    text-align: left;
    padding: 0px 15px;
    margin-bottom: 20px;
    @include set-bg-img;
    background-image: url("../img/left-title.png");
  }
  .box-content-desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 12px;
    margin-bottom: 10px;
    p {
      height: 12px;
      font-size: 10px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #00eacb;
      line-height: 12px;
      padding: 0 14px;
    }
  }
  .box-content-cont {
    padding-top: 0 10px;
    height: 158px;
    overflow: hidden;
    .box-content-cont-wrp {
      animation: run linear infinite alternate;
      animation-delay: 5s;
    }
  }
  @keyframes run {
    0% {
      transform: translate3d(0,0%,0);
    }
    100% {
      transform: translate3d(0, calc(-100% + 156px), 0);
    }
  }
  .cont-item {
    width: 433px;
    min-height: 26px;
    padding: 0px 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba($color: #163053, $alpha: 0);
    &:nth-child(odd) {
      background-color: rgba($color: #163053, $alpha: 0.8);
    }
    span {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #fff;
    }
    .text {
      height: unset;
      min-height: 26px;
      word-break: break-all;
      white-space: pre-wrap;
      padding: 2px 0;
    }
    .no {
      margin-right: 20px;
    }
    .status {
      width: 10px;
      height: 10px;
      @include set-bg-img;
      background-image: url("../img/down.png");
      margin-left: auto;
      margin-right: 16px;
      &.up {
        background-image: url("../img/up.png");
      }
    }
  }
}
</style>
