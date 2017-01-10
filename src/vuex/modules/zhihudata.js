import * as types from '../zhihu-types.js'
import axios from 'axios'
var moment = require('moment');

const state = {
    NewsLatest: {},
    time: moment(),
    LoadingOne: false,
    LoadingTwo: true,
    NewsDetail: {},
    Themes: {},
    ThemesList: {}
}

const getters = {
    [types.DONE_NEWS_LATEST]: state => {
        return state.NewsLatest
    },
    [types.DONE_LOADING_ONE]: state => {
        return state.LoadingOne
    },
    [types.DONE_NEWS_DETAIL]: state => {
        return state.NewsDetail
    },
    [types.DONE_LOADING_TWO]: state => {
        return state.LoadingTwo
    },
    [types.DONE_THEMES]: state => {
        return state.Themes
    },
    [types.DONE_THEMES_LIST]: state => {
        return state.ThemesList
    }
}

const mutations = {
    [types.TOGGLE_NEWS_LATEST](state, all) {
        state.NewsLatest = all
        state.LoadingTwo = false
    },
    [types.TOGGLE_NEWS_LATEST_MORE](state, all) {
        all.stories.map(function (item) {
            return state.NewsLatest.stories.push(item)
        })
        state.time.subtract(1, "days")
        state.LoadingOne = false
    },
    [types.TOGGLE_NEWS_DETAIL](state, all) {
        String.prototype.replaceAll = function (s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        }
        all.body = all.body.replaceAll('src=\"', 'src=\"http://lovestreet.leanapp.cn/zhihu/resource?url= ')
        state.NewsDetail = all
        state.LoadingTwo = false
    },
    [types.TOGGLE_THEMES](state, all) {
        state.Themes = all
        state.LoadingTwo = false
    },
    [types.TOGGLE_THEMES_LIST](state, all) {
        state.ThemesList = all
    }
}

const actions = {
    [types.FECTH_NEWS_LATEST]({commit}) {
        state.LoadingTwo = true
        axios.get('http://lovestreet.leanapp.cn/zhihu/news/latest')
            .then(res => {
                commit(types.TOGGLE_NEWS_LATEST, res.data, console.log('news lastets:', res.data))
            }).catch(err => console.log(err))
    },
    [types.FECTH_NEWS_LATEST_MORE]({commit}) {
        state.LoadingOne = true
        var now = state.time.format("YYYYMMDD")
        console.log("日期：", now)
        axios.get('http://lovestreet.leanapp.cn/zhihu/before/' + now)
            .then(res => {
                commit(types.TOGGLE_NEWS_LATEST_MORE, res.data, console.log('TOGGLE_NEWS_LATEST_MORE:', res.data))
            }).catch(err => console.log(err))
    },
    [types.FETCH_NEWS_DETAIL]({commit}, id) {
        state.LoadingTwo = true
        axios.get('http://lovestreet.leanapp.cn/zhihu/news/' + id)
            .then(res => {
                commit(types.TOGGLE_NEWS_DETAIL, res.data)
            }).catch(err => console.log(err))
    },
    [types.FETCH_THEMES]({commit}) {
        state.LoadingTwo = true
        axios.get('http://lovestreet.leanapp.cn/zhihu/themes')
            .then(res => {
                commit(types.TOGGLE_THEMES, res.data)
            }).catch(err => console.log(err))
    },
    [types.FETCH_THEMES_list]({commit}, id) {
        axios.get('http://lovestreet.leanapp.cn/zhihu/themes/' + id)
            .then(res => {
                commit(types.TOGGLE_THEMES_LIST, res.data)
            }).catch(err => console.log(err))
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
