<template>
  <div class="index">
    <div class="nav">
      <div class="game-item-list">
        <div
          class="game-item"
          v-for="(item, idx) in list"
          :key="idx"
          @click="go(item)"
        >
          <img :src="item.img" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <h3>Happy Hour</h3>
    </div>
    <div class="bg-wrap"></div>
  </div>
</template>
<script>
export default {
  name: "index-page",
  components: {},
  data() {
    return {
      list: [
        // {
        //   name: "zdog",
        //   path: "zdog",
        //   img: new URL('../image/d1.jpg', import.meta.url).href,
        // },
        {
          name: "babylon",
          path: "babylon",
          img: new URL("../image/d2.jpg", import.meta.url).href,
        },
      ],
    };
  },
  methods: {
    go(item) {
      this.$router.push({
        path: item.path
      })
    }
  }
};
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100%;

  .bg-wrap {
    width: 100vw;
    height: 100vh;
    @include set-bg-img;
    background-size: 200% 100%;
    background-image: url("../image/icon.jpg");
    filter: blur(10px);
    position: absolute;
  }

  .nav {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    color: #fff;
    width: 100%;

    h3 {
      margin-top: 12vh;
      height: 40px;
      font-size: 32px;
      text-align: center;
      font-weight: bold;
      font-style: italic;
      // text-shadow: 1px -1px #fff;
    }

    .game-item-list {
      display: flex;
      justify-content: center;
      align-items: center;

      .game-item {
        width: 44%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
          width: 66%;
          border-radius: 50%;
        }

        p {
          margin-top: 6px;
          font-size: 16px;
          text-align: center;
        }
      }
    }
  }
}
</style>
