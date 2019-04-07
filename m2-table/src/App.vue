<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<!-- Add global styles here -->
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,500,700");
html {
  font-size: 16px;
  font-weight: 400;
}

body {
  font-family: "Open Sans", sans-serif;
  position: relative;
  min-height: 100%;
  top: 0px;
}

* {
  box-sizing: border-box;
}

.page {
  max-width: $app-width;
  width: 80%;
  margin: auto;

  &__header {
    color: $color-gray;
    text-transform: uppercase;
  }
}

.truncate {
  width: 98%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Vue enter/exit transition classes
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter,
.slide-leave-to {
  transform: scaleY(0);
}
</style>
