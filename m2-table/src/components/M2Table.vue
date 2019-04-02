<template>
  <table class="m2-table">
    <thead class="m2-table__header">
      <tr class="m2-table__header-row">
        <th
          v-for="column in columns"
          class="m2-table__header-cell"
          :class="[{ 'm2-table__header-cell--active': sortKey == column.label}, column.cellClassNames]"
          :key="column.label"
        >
          <div class="m2-table__header-filter">
            <div class="m2-table__header-filter-text">
              <div
                v-if="column.filterText || column.isEditing"
                class="m2-table__header-filter-label"
              >{{column.label}}</div>
              <input
                v-if="column.isEditing"
                v-focus
                @keyup.enter="filterRows($event, column)"
                @blur="filterRows($event, column)"
                class="m2-table__header-filter-input"
                type="text"
              >
              <div
                v-else
                @click="onColumnHeaderClick(column)"
                class="m2-table__header-label"
                :class="{'m2-table__header-label--filterable': column.isFilterable}"
              >{{column.filterText || column.label}}</div>
            </div>
            <div
              v-if="column.isSortable"
              class="m2-table__header-sort-icon"
              :class="sortOrders[column.label] > 0 ? 'm2-table__header-sort-icon--asc' : 'm2-table__header-sort-icon--desc'"
              @click="sortBy(column)"
            ></div>
          </div>
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
          <div v-else @click="onCellClick(row, )" class="m2-table-cell--raw">{{row[column.label]}}</div>
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
    rawColumns: Array
  },

  data() {
    const sortOrders = {};
    const filteredRows = [...this.data];
    const columns = [...this.rawColumns];
    columns.forEach(column => {
      if (column.isSortable) {
        sortOrders[column.label] = 1;
      }

      if (column.isEditable) {
        //column.isEditing = false;
      }

      if (column.isFilterable) {
        column.filterText = "";
      }
    });

    return {
      filteredRows,
      sortOrders,
      columns,
      sortKey: ""
    };
  },

  computed: {
    // filteredRows() {
    //   const sortKey = this.sortKey;
    //   const filterKey = this.filterKey && this.filterKey.toLowerCase();
    //   const order = this.sortOrders[sortKey] || 1;
    //   let data = this.data;
    //   if (filterKey) {
    //     data = data.filter(row => {
    //       return Object.keys(row).some(function(key) {
    //         return (
    //           String(row[key])
    //             .toLowerCase()
    //             .indexOf(filterKey) > -1
    //         );
    //       });
    //     });
    //   }
    //   if (sortKey) {
    //     data = data.slice().sort(function(a, b) {
    //       a = a[sortKey];
    //       b = b[sortKey];
    //       return (a === b ? 0 : a > b ? 1 : -1) * order;
    //     });
    //   }
    //   return data;
    // }
  },

  // filters: {
  //   capitalize(str) {
  //     return str.charAt(0).toUpperCase() + str.slice(1);
  //   }
  // },

  methods: {
    onColumnHeaderClick(column) {
      if (column.isFilterable) {
        this.columns = this.columns.map(col => {
          col.isEditing = col.label === column.label;
          return col;
        });
      }
    },

    filterRows(event, column) {
      column.filterText = event.target.value;
      column.isEditing = false;
      this.filteredRows = this.data.filter(row => {
        return this.columns.every(column => {
          return (
            String(row[column.label]).search(
              new RegExp(column.filterText, "i")
            ) > -1
          );
        });
      });
    },

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
  },
  directives: {
    focus: {
      // directive definition
      inserted: function(el) {
        el.focus();
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
$table-sort-icon-size: 10px;

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
    display: flex;
    height: 60px;
    border-bottom: 2px solid $app-background-color__gray--alpha;
    border-top: 2px solid $app-background-color__gray--alpha;
  }

  &__header-cell {
    display: flex;
    align-items: center;
    font-weight: 700;
    width: $table-cell-width;
    padding: 10px 0px 10px 10px;
    text-align: left;

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

  &__header-filter {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__header-filter-text {
    width: 100%;
  }

  &__header-filter-label {
    font-size: 0.7rem;
    opacity: 0.7;
  }

  &__header-filter-input {
    width: 85%;
    height: 20px;
    border: 1px solid $app-background-color__gray--theta;
  }

  &__header-label {
    width: 85%;
    border: none;
    outline: none;
    padding: 3px;
    &--filterable {
      cursor: pointer;
      &:hover {
        border-radius: 4px;
        border: 1px solid $app-background-color__gray--theta;
      }
    }
  }

  &__header-sort-icon {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.5;

    &--desc {
      border-left: $table-sort-icon-size solid transparent;
      border-right: $table-sort-icon-size solid transparent;
      border-top: $table-sort-icon-size solid #fff;
    }

    &--asc {
      border-left: $table-sort-icon-size solid transparent;
      border-right: $table-sort-icon-size solid transparent;
      border-bottom: $table-sort-icon-size solid #fff;
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
    background-color: $app-background-color__gray--beta;
    color: $app-text-color--alpha;
  }

  &__row-cell {
    width: $table-cell-width;
    padding: 10px 0px 10px 10px;
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
