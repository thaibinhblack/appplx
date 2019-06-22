import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)



const state = {
    view: null,
    graphic: null,
    featureLayer: null,
    map: null
}


export default new Vuex.Store({
    state: state,
})