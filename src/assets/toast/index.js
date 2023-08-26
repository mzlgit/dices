import Toast from './toast';

let VueToast;
let currentToast;

function install(Vue, options = {}) {
  if (VueToast) return;
  VueToast = Vue.extend(Toast);


  Vue.prototype.$toast = function (message, toastOptions = {}) {
    if(!currentToast){
      currentToast = new VueToast(options);
      currentToast.$mount();
      document.body.appendChild(currentToast.$el);
    }
    // 传入的参数为字符串,取已配置的options
    currentToast.show(message,toastOptions);
  }
}

export default {
  install
}