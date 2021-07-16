/*
 * @Author: liangs
 * @Date: 2021-07-16 11:41:13
 * @LastEditors: liangs
 * @LastEditTime: 2021-07-16 16:24:04
 * @Description: file content
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";

Vue.use(VueRouter);

export const createRouter = () => {
  const router = new VueRouter({
    mode: "history", //兼容前后端
    routes: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/pages/About"),
      },
      {
        path: "/posts",
        name: "posts",
        component: () => import("@/pages/Posts"),
      },
      {
        path: "*",
        name: "404",
        component: () => import("@/pages/404"),
      },
    ],
  });

  return router;
};
