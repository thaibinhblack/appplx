const actions = {

    loadMap: ({commit}) => {
        commit("loadMap")
    },
    resetFeatureLayer: ({commit},payload) => {
        commit("resetFeatureLayer",payload)
    },
    drawPoint: ({commit},payload) => {
        commit("drawPoint",payload)
    },
    drawCricle: ({commit},payload) => {
        commit("drawCricle",payload)
    },
    goToPoint: ({commit},payload) => {
        commit("goToPoint",payload)
    },
    loading: ({commit},payload) => {
        commit("loading",payload)
    }

}

export default actions