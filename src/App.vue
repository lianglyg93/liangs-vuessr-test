<template>
  <div id="app">
    <h3>{{ message }} - {{inputVal}}</h3>
    <input type="text" v-model="inputVal" />
    <button @click="handClick">按钮</button>
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
