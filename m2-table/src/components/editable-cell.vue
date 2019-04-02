<template>
  <div class="editable-cell">
    <input class="editable-cell__input" @change="onChange" type="text" :value="value">
  </div>
</template>

<script>
export default {
  name: "editable-cell",
  props: {
    value: String
  },
  data() {
    return value;
  },
  methods: {
    onChange(event) {
      console.log(event);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.editable-cell {
  &__input {
    font-size: 1em;
  }
}
</style>