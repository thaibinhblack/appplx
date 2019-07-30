import { stat } from "fs";

const getters = {
    loading: (state) => {
        return state.loading
    },
    map: (state) => {
        return state.map
    },
    view: (state) => {
        return state.view
    },
    featureLayer: (state) => {
        state.featureLayer
    },
    listPetro: (state) => {
        return state.listPetro
    }
}
export default getters