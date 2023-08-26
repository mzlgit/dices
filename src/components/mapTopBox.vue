<template>
  <div class="map-top-box">
    <p class="value-desc">{{ data.city }}</p>
    <count-to
      class="value"
      ref="countTo"
      separator=""
      :start-val="oldNum"
      :end-val="data.value"
      :duration="1000"
    ></count-to>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  name: "map-top-box",
  components: {
    countTo
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
.map-top-box {
  width: 113px;
  height: 98px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @include set-bg-img;
  background-image: url("../img/five-city.png");
  .value-desc {
    color: #22a7f3;
    font-size: 10px;
    margin-bottom: 8px;
  }
  .value {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 14px;
  }
}
</style>
