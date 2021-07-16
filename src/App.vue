<template>
  <div id="app">
    <router-link to="/">首页</router-link>
    <router-link to="/about">about页面</router-link>

    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "hello",
      inputVal: "",
    };
  },
  methods: {
    handClick() {
      console.log("handClick");
    },
  },
};
</script>

<style lang="scss" scoped></style>
