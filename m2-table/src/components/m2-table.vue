<template>
  <div class="m2-table-container">
    <table class="m2-table">
      <thead class="m2-table__header">
        <tr class="m2-table__header-row">
          <th
            v-for="column in columns"
            :class="[
              { 'm2-table__header-cell--active': sortKey == column.id },
              column.cellClassNames
            ]"
            :key="column.id"
            class="m2-table__header-cell"
          >
            <div class="m2-table__header-filter">
              <div class="m2-table__header-filter-text">
                <div
                  v-if="column.filterText || column.isEditing"
                  class="m2-table__header-filter-label"
                >
                  {{ column.label }}
                </div>
                <input
                  v-if="column.isEditing"
                  v-focus
                  @keyup.enter="filterRows($event, column)"
                  @blur="filterRows($event, column)"
                  :value="column.filterText"
                  class="m2-table__header-filter-input"
                  type="text"
                />
                <div
                  v-else
                  @click="onColumnHeaderClick(column)"
                  class="m2-table__header-label"
                  :class="{
                    'm2-table__header-label--filterable': column.isFilterable
                  }"
                >
                  {{ column.filterText || column.label }}
                </div>
              </div>
              <div
                v-if="column.isSortable"
                class="m2-table__header-sort-icon"
                :class="
                  sortOrders[column.id] > 0
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
        <tr
          class="m2-table__row"
          v-for="(row, rowIndex) in paginatedRows"
          :key="row.id"
        >
          <td
            class="m2-table__row-cell"
            :class="column.cellClassNames"
            v-for="column in columns"
            :key="column.id"
          >
            <input
              v-focus
              v-if="`${row.id}_${column.id}` === currentEditingCellId"
              @keyup.enter="saveCellData($event, column, row, rowIndex)"
              @focusout="currentEditingCellId = ''"
              class="m2-table__row-cell-input"
              type="text"
              :value="row[column.id]"
            />
            <div
              v-else
              @click="onCellClick(row, column)"
              class="m2-table__row-cell-label truncate"
              :class="{ 'm2-table__row-cell--editable': column.isCellEditable }"
              :title="row[column.id]"
            >
              {{ row[column.id] | runTransforms(column) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <M2Pagination
      v-if="paginatedRows.length"
      :currentPage="page"
      :pageSize="pageSize"
      :totalCount="filteredRows.length"
      v-on:pageChanged="page = $event"
    ></M2Pagination>
  </div>
</template>

<script>
import M2Pagination from "@/components/m2-pagination.vue";
export default {
  name: "M2Table",
  components: {
    M2Pagination
  },

  props: {
    tableProps: {
      typpe: Object,
      default: () => ({
        itemsPerPage: 10,
        isPaginated: true
      })
    },

    model: {
      type: Array,
      required: true
    },

    columnDefs: {
      type: Array,
      required: true
    }
  },

  data() {
    const sortOrders = {};
    const columns = [...this.columnDefs];
    columns.forEach(column => {
      if (column.isSortable) {
        sortOrders[column.id] = 1;
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
      currentEditingCellId: "",
      page: 1
    };
  },

  computed: {
    pageSize() {
      return Math.min(this.tableProps.itemsPerPage, this.filteredRows.length);
    },

    paginatedRows() {
      const startIndex = (this.page - 1) * this.tableProps.itemsPerPage;
      const endIndex = startIndex + this.tableProps.itemsPerPage;
      return this.filteredRows.slice(startIndex, endIndex);
    },

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
            String(row[column.id]).search(new RegExp(column.filterText, "i")) >
            -1
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
        this.currentEditingCellId = `${row.id}_${column.id}`;
      }
    },

    saveCellData(event, column, row, rowIndex) {
      this.currentEditingCellId = "";
      const oldValue = row[column.id];
      const newValue = event.target.value;
      if (oldValue !== newValue) {
        this.$store.dispatch("updatePayments", {
          row: { ...row, [column.id]: newValue },
          rowIndex
        });
      }
    },

    onColumnHeaderClick(column) {
      if (column.isFilterable) {
        this.columns = this.columns.map(col => {
          col.isEditing = col.id === column.id;
          return col;
        });
      }
    },

    filterRows(event, column) {
      this.columns = this.columns.map(col => {
        if (col.id === column.id) {
          col.isEditing = false;
          column.filterText = event.target.value;
        }
        return col;
      });
      this.page = 1;
    },

    sortBy(column) {
      if (column.isSortable) {
        const key = column.id;
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      }
    }
  },

  filters: {
    runTransforms: (value, column) => {
      if (typeof column.transform === "function") {
        return column.transform(value);
      } else {
        return value;
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
$table-cell-width: 25%;
$table-sort-icon-size: 10px;

.m2-table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: auto;
  table-layout: fixed;

  box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.2);

  // header elements
  &__header {
    background-color: $app-background-color__gray--gamma;
    color: $app-text-color--alpha;
    font-weight: 700;
    //text-transform: capitalize;
  }

  &__header-row {
    height: 60px;
    border-bottom: 2px solid $app-background-color__gray--alpha;
    border-top: 2px solid $app-background-color__gray--alpha;
  }

  &__header-cell {
    width: $table-cell-width;
    padding: 2px 10px;
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
    width: 85%;
  }

  &__header-filter-label {
    font-size: 0.8rem;
    font-weight: 700;
    opacity: 0.7;
  }

  &__header-filter-input {
    width: 85%;
    height: 25px;
    border-radius: 4px;
    font-weight: 700;
    border: 1px solid $app-background-color__gray--theta;
    background-color: $color-black;
    color: $color-white;
  }

  &__header-label {
    width: 85%;
    border: none;
    outline: none;
    padding: 3px;
    &--filterable {
      cursor: pointer;
      &:hover {
        border-radius: 3px;
        border: 1px solid $color-black;
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
  }

  // row elements
  &__row {
    background-color: $app-background-color__gray--beta;
    color: $app-text-color--alpha;
  }

  &__row-cell {
    padding: 5px 0 0 5px;
    text-align: left;
    &--editable {
      cursor: pointer;
      &:hover {
        border-radius: 3px;
        border: 1px solid $color-black;
      }
    }
  }

  &__row-cell-label {
    padding: 5px;
    height: 40px;
  }

  &__row-cell-input {
    font-size: 0.9rem;
    width: 90%;
    height: 30px;
    border: 1px solid $color-black;
    background-color: $color-black;
    color: $color-white;
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

  .truncate {
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
