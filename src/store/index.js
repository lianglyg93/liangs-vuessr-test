/*
 * @Author: liangs
 * @Date: 2021-07-16 16:39:20
 * @LastEditors: liangs
 * @LastEditTime: 2021-07-16 16:57:46
 * @Description: file content
 */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      posts: [],
    }),
    mutations: {
      setPosts(state, data) {
        state.posts = data;
      },
    },
    actions: {
      //在服务端渲染期间务必让ation返回一个promise
      async getPosts({ commit }) {
        const { data } = await axios.get("https://cnodejs.org/api/v1/topics");
        commit("setPosts", data.data);
      },
    },
  });
};
