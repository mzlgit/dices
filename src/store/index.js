import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sysBgc: '',
    def_id: null,
  },
  getters: {
  },
  mutations: {
    setSysBgc(state, sysBgc) {
      state.sysBgc = sysBgc
    },
    setDef_id(state, def_id) {
      state.def_id = def_id
    }
  },
  actions: {
  },
  modules: {
  }
})
