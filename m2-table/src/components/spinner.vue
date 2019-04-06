<template>
  <div v-if="isLoading">
    <div class="spinner">
      <div class="spinner__rect spinner__rect--1"></div>
      <div class="spinner__rect spinner__rect--2"></div>
      <div class="spinner__rect spinner__rect--3"></div>
      <div class="spinner__rect spinner__rect--4"></div>
      <div class="spinner__rect spinner__rect--5"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TileSpinner",
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: this.loading
    };
  }
};
</script>

<style scoped lang="scss">
.spinner {
  display: flex;
  justify-content: space-between;
  margin: 100px auto;
  width: 60px;
  height: 50px;
  text-align: center;
  font-size: 16px;

  &__rect {
    background-color: $color-primary;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;

    &--2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }

    &--3 {
      -webkit-animation-delay: -1s;
      animation-delay: -1s;
    }

    &--4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }

    &--5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
  }
}
@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
