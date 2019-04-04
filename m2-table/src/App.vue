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
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,500");
html {
  font-size: 16px;
  font-weight: 400;
}

body {
  font-family: "Open Sans", sans-serif;
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
    text-transform: uppercase;
  }
}
</style>
