import { stat } from "fs";

const state = {
    modal: {
        search: false,
        detail: {
            modal: false,
            detail: {}
        },
        back: false
    }
}

const getters = {
    search: (state) => {
        return state.modal.search
    },
    detail: (state) => {
        return state.modal.detail
    },
    back: (state) => {
        return state.modal.back
    }
}

const mutations = {
    updateSearch: (state,payload) => {
        state.modal.search = payload
    },
    updateModalDetail: (state,payload) => {
        
        state.modal.search = false
        state.modal.back = payload.back
        state.modal.detail.modal = payload.detail
    },
    updateDetail: (state,detail) => {
      
        state.modal.detail.detail = detail
    },
    backModal: (state) => {
        state.modal.search = true
        state.modal.back = false
        state.modal.detail.modal = false
    }
}

const actions = {
    updateSearch: ({commit},payload) => {
        commit("updateSearch",payload)
    },
    updateModalDetail: ({commit},payload) => {
        commit("updateModalDetail",payload)
    },
    updateDetail: ({commit},detail) => {
        console.log('detail',detail)
        commit("updateDetail",detail)
    },
    backModal: ({commit}) => {
        commit("backModal")
    }
}

export default {
    state,
    getters,
    mutations,
    getters,
    actions
}