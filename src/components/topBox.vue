<template>
  <div class="top-box">
    <count-to
      class="value"
      ref="countTo"
      separator=""
      :start-val="oldNum"
      :end-val="data.value"
      :duration="1000"
    ></count-to>
    <p class="value-desc">{{ data.desc }}</p>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  name: "top-box",
  components: {
    countTo,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      oldNum: 0
    }
  },
  watch: {
    'data.value': {
      handler: function(n, o) {
        this.oldNum = o
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top-box {
  width: 274px;
  height: 118px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @include set-bg-img;
  background-image: url("../img/num-bg.png");
  .value {
    height: 48px;
    font-size: 48px;
    font-weight: bold;
    color: #7dd8fd;
  }
  .value-desc {
    height: 16px;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    color: #fff;
    line-height: 16px;
    margin-top: 10px;
  }
}
.top-box + .top-box {
  margin-left: 20px;
}
</style>

