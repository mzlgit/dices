import Vue from 'vue'
import App from './App.vue'
import './style/reset.css'
import './style/common.scss'

import toast from './assets/toast'
Vue.use(toast)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  methods: {
    // 计算设备 是否居中
    reset() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let status = (width / height) < (1920 / 1080);
      if (status) {
        document.body.style.width = width + 'px';
        document.body.style.height = height + 'px';
      } else {
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }
  },
  mounted() {
    this.reset();
    window.addEventListener('resize', this.reset);
  }
}).$mount('#app')
