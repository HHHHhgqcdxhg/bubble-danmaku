import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'

import {Config} from "../../common/config/config";
import {TemplatesText} from "../../main/loadTemplate";
import {GiftInfo} from "../scripts/@type/giftInfo";
import {DanmakuHandler, DanmakuWrapper, SendGiftWrapper} from "../scripts/DanmakuHandler";

Vue.use(Vuex)

const state = {
    config: new Config(),
    templates: new TemplatesText(),
    gifts: new Map<number, GiftInfo>(),
    dev: false,
    configPath: "../../../../config"
}

const mutations = {
    SET_CONFIG(state, config: Config) {
        state.config = config;
    },
    SET_TEMPLATES(state, templates: TemplatesText) {
        state.templates = templates;
    },
    SET_GIFTS(state, gifts: Map<number, GiftInfo>) {
        state.gifts = gifts;
    },
    SET_IF_DEV(state, dev) {
        state.dev = dev;
    },
    SET_CONFIG_PATH(state, configPath) {
        state.configPath = configPath;
    },
}

const getters = {
    hasComboId: (state) => (comboId) => {
        return state.comboMap.has(comboId)
    }
}

const actions = {
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [
        createPersistedState(),
        createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})
