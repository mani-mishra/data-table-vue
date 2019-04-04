<template>
  <div class="page">
    <h1 class="page__header">Payments</h1>
    <div class="m2-table__container">
      <m2-table :model="payments" :columnDefs="gridColumns"></m2-table>
    </div>
  </div>
</template>

<script>
import M2Table from "@/components/m2-table.vue";
import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    M2Table
  },

  mounted() {
    this.$store.dispatch("getPayments");
  },

  computed: {
    ...mapGetters(["payments"])
  },

  data: () => ({
    gridColumns: [
      {
        label: "id",
        isSortable: true,
        isFilterable: true,
        isCellEditable: false,
        cellClassNames: "m2-table__cell--large"
      },
      {
        label: "name",
        isSortable: true,
        isFilterable: true,
        isCellEditable: false
      },
      {
        label: "description",
        isSortable: false,
        isFilterable: true,
        isCellEditable: true,
        cellClassNames: "m2-table__cell--xl"
      },
      {
        label: "date",
        isSortable: true,
        isFilterable: false,
        isCellEditable: false
      },
      {
        label: "amount",
        isSortable: false,
        isFilterable: false,
        isCellEditable: false,
        cellClassNames: "m2-table__cell--xs"
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
.m2-table {
  &__container {
    height: 85vh;
  }
}
</style>
