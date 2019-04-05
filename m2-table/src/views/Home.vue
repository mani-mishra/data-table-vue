<template>
  <div>
    <TileSpinner v-if="isLoading"></TileSpinner>
    <div class="page">
      <h1 class="page__header">Payments</h1>
      <m2-table :tableProps="tapbleProps" :model="payments" :columnDefs="gridColumns"></m2-table>
    </div>
  </div>
</template>

<script>
import M2Table from "@/components/m2-table.vue";
import TileSpinner from "@/components/spinner.vue";

import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    M2Table,
    TileSpinner
  },

  mounted() {
    this.$store.dispatch("getPayments");
  },

  computed: {
    ...mapGetters(["payments", "isLoading"])
  },

  data: () => ({
    tapbleProps: {
      itemsPerPage: 10,
      isPaginated: true,
      isSelectable: true,
      rowActions: [
        {
          id: "ACTION_A",
          name: "action a",
          callback(row) {
            console.log(row);
          }
        },
        {
          id: "ACTION_B",
          name: "action b",
          callback(row) {
            console.log(row);
          }
        }
      ]
    },

    gridColumns: [
      // {
      //   id: "id",
      //   label: "UUID",
      //   isSortable: true,
      //   isFilterable: true,
      //   isCellEditable: false,
      //   cellClassNames: "m2-table__cell--large"
      // },
      {
        id: "name",
        label: "Name",
        isSortable: true,
        isFilterable: true,
        isCellEditable: false
      },
      {
        id: "description",
        label: "Description",
        isSortable: true,
        isFilterable: true,
        isCellEditable: true,
        cellClassNames: "m2-table__cell--xl"
      },
      {
        id: "date",
        label: "Date (Local)",
        isSortable: true,
        isFilterable: false,
        isCellEditable: false,
        transform(val) {
          const dateObj = new Date(val);
          return `${dateObj.toLocaleDateString()}, ${dateObj.toLocaleTimeString()}`;
        }
      },
      {
        id: "amount",
        label: "Amount",
        isSortable: true,
        isFilterable: false,
        isCellEditable: false,
        transform(val) {
          return `$ ${val}`;
        },
        cellClassNames: "m2-table__cell--xs"
      }
    ]
  })
};
</script>
