<template>
  <table class="m2-table">
    <thead class="m2-table__header">
      <tr class="m2-table__header-row">
        <th
          v-for="column in columns"
          :class="[
            { 'm2-table__header-cell--active': sortKey == column.label },
            column.cellClassNames
          ]"
          :key="column.label"
          class="m2-table__header-cell"
        >
          <div class="m2-table__header-filter">
            <div class="m2-table__header-filter-text">
              <div
                v-if="column.filterText || column.isEditing"
                class="m2-table__header-filter-label"
              >{{ column.label }}</div>
              <input
                v-if="column.isEditing"
                v-focus
                @keyup.enter="filterRows($event, column)"
                @blur="filterRows($event, column)"
                :value="column.filterText"
                class="m2-table__header-filter-input"
                type="text"
              >
              <div
                v-else
                @click="onColumnHeaderClick(column)"
                class="m2-table__header-label"
                :class="{
                  'm2-table__header-label--filterable': column.isFilterable
                }"
              >{{ column.filterText || column.label }}</div>
            </div>
            <div
              v-if="column.isSortable"
              class="m2-table__header-sort-icon"
              :class="
                sortOrders[column.label] > 0
                  ? 'm2-table__header-sort-icon--asc'
                  : 'm2-table__header-sort-icon--desc'
              "
              @click="sortBy(column)"
            ></div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="m2-table__body">
      <tr class="m2-table__row" v-for="(row, rowIndex) in filteredRows" :key="row.id">
        <td
          class="m2-table__row-cell"
          :class="column.cellClassNames"
          v-for="column in columns"
          :key="column.label"
        >
          <input
            v-focus
            v-if="`${row.id}_${column.label}` === currentEditingCellId"
            @keyup.enter="saveCellData($event, column, row, rowIndex)"
            class="m2-table__row-cell-input"
            type="text"
            :value="row[column.label]"
          >
          <div
            v-else
            @click="onCellClick(row, column)"
            class="m2-table-cell"
            :class="{ 'm2-table__row-cell--editable': column.isCellEditable }"
          >{{ row[column.label] }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "m2-table",
  props: {
    model: Array,
    columnDefs: Array
  },

  data() {
    const sortOrders = {};
    const columns = [...this.columnDefs];
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
      sortOrders,
      columns,
      sortKey: "",
      currentEditingCellId: ""
    };
  },

  computed: {
    filteredRows() {
      const sortKey = this.sortKey;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      const columns = this.columns;
      let data = this.model;
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

      data = data.filter(row => {
        return columns.every(column => {
          return (
            String(row[column.label]).search(
              new RegExp(column.filterText, "i")
            ) > -1
          );
        });
      });

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

  methods: {
    onCellClick(row, column) {
      if (column.isCellEditable) {
        this.currentEditingCellId = `${row.id}_${column.label}`;
      }
    },

    saveCellData(event, column, row, rowIndex) {
      this.currentEditingCellId = "";
      const oldValue = row[column.label];
      const newValue = event.target.value;
      if (oldValue !== newValue) {
        this.$store.dispatch("updatePayments", {
          row: { ...row, [column.label]: newValue },
          rowIndex
        });
      }
    },

    onColumnHeaderClick(column) {
      if (column.isFilterable) {
        this.columns = this.columns.map(col => {
          col.isEditing = col.label === column.label;
          return col;
        });
      }
    },

    filterRows(event, column) {
      this.columns = this.columns.map(col => {
        if (col.label === column.label) {
          col.isEditing = false;
          column.filterText = event.target.value;
        }
        return col;
      });
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
$table-cell-width: 240px;
$table-sort-icon-size: 10px;

.m2-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.2);
  // header elements
  &__header {
    background-color: $app-background-color__gray--gamma;
    color: $app-text-color--alpha;
    font-size: 1rem;
  }

  &__header-row {
    height: 60px;
    border-bottom: 2px solid $app-background-color__gray--alpha;
    border-top: 2px solid $app-background-color__gray--alpha;
  }

  &__header-cell {
    font-weight: 700;
    min-width: $table-cell-width;
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
    background-color: $app-background-color__gray--beta;
    color: $app-text-color--alpha;
  }

  &__header-label {
    width: 85%;
    border: none;
    outline: none;
    padding: 2px;
    &--filterable {
      cursor: pointer;
      &:hover {
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

  &__body {
    width: 100%;
    font-size: 0.9rem;
  }

  // row elements
  &__row {
    background-color: $app-background-color__gray--beta;
    color: $app-text-color--alpha;
  }

  &__row-cell {
    min-width: $table-cell-width;
    padding: 10px 0px 10px 10px;
    text-align: left;
    &--editable {
      cursor: pointer;
      &:hover {
        border: 1px solid $app-background-color__gray--theta;
      }
    }
  }

  &__row-cell-input {
    width: 85%;
    height: 25px;
    border: 1px solid $app-background-color__gray--theta;
  }

  &__cell {
    &--xs {
      min-width: #{$table-cell-width * 0.5};
    }

    &--small {
      min-width: #{$table-cell-width * 0.75};
    }

    &--large {
      min-width: #{$table-cell-width * 1.25};
    }

    &--xl {
      min-width: #{$table-cell-width * 2};
    }
  }
}
</style>
