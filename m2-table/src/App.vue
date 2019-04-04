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
html {
  font-size: 16px;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-white;
  background-color: $color-black;
}

* {
  box-sizing: border-box;
}

.page {
  width: 80%;
  margin: auto;

  &__header {
    font-size: 2rem;
    text-transform: uppercase;
  }
}
</style>
