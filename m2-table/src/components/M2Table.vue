<template>
  <table class="m2-table">
    <thead class="m2-table__header">
      <tr class="m2-table__header-row">
        <th
          class="m2-table__header-cell"
          :class="[{ 'm2-table__header-cell--active': sortKey == column.label}, column.cellClassNames]"
          :key="column.label"
          v-for="column in columns"
          contenteditable="true"
        >
          {{ column.label | capitalize }}
          <span
            v-if="column.isSortable"
            class="m2-table__header-sort-icon"
            :class="sortOrders[column.label] > 0 ? 'm2-table__header-sort-icon--asc' : 'm2-table__header-sort-icon--desc'"
            @click="sortBy(column)"
          ></span>
        </th>
      </tr>
    </thead>
    <tbody class="m2-table__body">
      <tr class="m2-table__row" v-for="row in filteredRows" :key="row.ID">
        <td
          class="m2-table__row-cell"
          :class="column.cellClassNames"
          v-for="column in columns"
          :key="column.label"
        >
          <div v-if="row.isEditing" class="m2-table-cell--editable">
            <EditableCell :value="row[column.label]"></EditableCell>
          </div>
          <div v-else @dblclick="onClick(row)" class="m2-table-cell--raw">{{row[column.label]}}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import EditableCell from "@/components/editable-cell.vue";

export default {
  name: "m2-table",
  components: {
    EditableCell
  },
  props: {
    columnData: Object,
    data: Array,
    columns: Array
  },

  data() {
    const sortOrders = {};
    this.columns.forEach(column => {
      if (column.isSortable) {
        sortOrders[column.label] = 1;
      }

      if (column.isEditable) {
        column.isEditing = false;
      }
    });

    return {
      sortOrders,
      sortKey: ""
    };
  },

  computed: {
    filteredRows() {
      const sortKey = this.sortKey;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      let data = this.data;
      if (filterKey) {
        data = data.filter(row => {
          return Object.keys(row).some(function(key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            );
          });
        });
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    }
  },

  filters: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },

  methods: {
    onClick(row) {
      row.isEditing = true;
      //this.sortKey = column.label;
    },

    sortBy(column) {
      if (column.isSortable) {
        const key = column.label;
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$table-color__gray--beta: #222;
$table-color__gray__gamma: #d7d7d7;

$table-cell-width: 240px;

.m2-table {
  height: 100%;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  // header elements
  &__header {
    background-color: $table-color__gray--beta;
    color: $app-text-color--alpha;
    font-size: 1.1rem;
  }

  &__header-row {
    display: block;
    position: relative;
  }

  &__header-cell {
    font-weight: 700;
    width: $table-cell-width;
    padding: 10px 20px;
    text-align: left;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &--active {
      color: $app-text-color--alpha;

      .m2-table__header-sort-icon {
        opacity: 1;
      }
    }
  }

  &__header-sort-icon {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.5;

    &--desc {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #fff;
    }

    &--asc {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #fff;
    }
  }
  // body
  &__body {
    display: block;
    overflow: auto;
    width: 100%;
    height: 65vh;
    font-size: 1rem;
  }

  // row elements
  &__row {
    background-color: $app-background-color__gray--alpha;
    color: $app-text-color--alpha;
  }

  &__row-cell {
    width: $table-cell-width;
    padding: 10px 20px;
    text-align: left;
  }

  &__cell {
    &--xs {
      width: #{$table-cell-width * 0.5};
    }

    &--small {
      width: #{$table-cell-width * 0.75};
    }

    &--large {
      width: #{$table-cell-width * 1.25};
    }

    &--xl {
      width: #{$table-cell-width * 2};
    }
  }
}
</style>
