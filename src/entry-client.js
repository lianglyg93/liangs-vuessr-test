/*
 * @Author: liangs
 * @Date: 2021-07-12 12:49:57
 * @LastEditors: liangs
 * @LastEditTime: 2021-07-16 17:26:34
 * @Description: file content
 */
import { createApp } from "./app";

// 客户端特定引导逻辑……

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
  app.$mount("#app");
});
