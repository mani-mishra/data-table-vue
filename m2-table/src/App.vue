<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Demo</router-link>|
      <router-link to="/about">description</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<!-- Add global styles here -->
<style lang="scss">
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 12px;
}

* {
  box-sizing: border-box;
}

.page {
  width: 1200px;
  margin: auto;

  &__header {
    font-size: 3rem;
    text-transform: uppercase;
    color: $app-text-color--beta;
  }
}
</style>
