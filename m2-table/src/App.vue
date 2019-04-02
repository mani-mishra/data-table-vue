<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Demo</router-link>|
      <router-link to="/about">Description</router-link>
    </div>
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
  background: linear-gradient(180deg, #006b8c 0%, #182e43 100%);
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
    //text-align: left;
  }
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
