<template>
  <div class="component-wrapper" @click="isDropdownOpen = false">
    <div class="component-item m2-table-actions">
      <button
        class="m2-table-actions__item m2-table-actions__button"
        :class="{ 'm2-table-actions__button--disabled': !selectedRows.length }"
        @click.stop="toggleDropdown"
      >
        <div class="m2-table-actions__button-label">
          {{ selectedRows.length }} row(s) selected
        </div>
        <div
          class="chevron"
          :class="isDropdownOpen ? 'chevron--up' : ' chevron--down'"
        ></div>
      </button>
      <transition name="slide">
        <ul v-if="isDropdownOpen" class="m2-table__dropdown-list">
          <li
            class="m2-table__dropdown-list-items"
            v-for="action in tableProps.rowActions"
            :key="action.id"
            @click="onActionClick(action)"
          >
            {{ action.name }}
          </li>
        </ul>
      </transition>

      <transition name="fade">
        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="m2-table-actions__item m2-table-actions__button"
        >
          Reset Filters
        </button>
      </transition>
      <!-- bind input event too for handling both touch screens-->
      <input
        v-if="tableProps.hasGlobalSearch"
        v-model="searchText"
        @input="searchText = $event.target.value"
        class="m2-table-actions__item m2-table__search"
        placeholder="Search"
      />
    </div>

    <M2Pagination
      v-if="paginatedRows.length"
      :currentPage="page"
      :pageSize="pageSize"
      :totalCount="filteredRows.length"
      v-on:pageChanged="page = $event"
      class="component-item component-item--mobile-only"
    ></M2Pagination>

    <div class="component-item m2-table-container">
      <table class="m2-table">
        <thead class="m2-table__header">
          <tr class="m2-table__header-row">
            <th
              v-if="tableProps.isSelectable"
              class="header-cell header-cell--checkbox"
            >
              <input
                id="select-all"
                type="checkbox"
                class="m2-checkbox"
                @click="onSelectAll"
                v-model="isSelectAll"
              />
              <label for="select-all" class="m2-checkbox__label"></label>
            </th>
            <th
              v-for="column in columns"
              :class="[
                { 'header-cell--active': sortKey == column.id },
                column.cellClassNames
              ]"
              :key="column.id"
              class="header-cell"
            >
              <div class="header-cell__content">
                <div class="header-cell__name-wrapper">
                  <div
                    v-if="column.isEditing || column.filterText"
                    class="header-cell__name--mini"
                  >
                    {{ column.label }}
                  </div>

                  <input
                    v-if="column.isEditing"
                    v-focus
                    @keyup.enter="filterRows($event, column)"
                    @blur="filterRows($event, column)"
                    :value="column.filterText"
                    class="header-cell__input"
                    type="text"
                  />
                  <div
                    v-else
                    @click="onColumnHeaderClick(column)"
                    class="header-cell__name"
                    :class="{
                      'header-cell__name--filterable': column.isFilterable,
                      'header-cell__name--active':
                        column.isEditing || column.filterText
                    }"
                  >
                    {{ column.filterText || column.label }}
                  </div>
                </div>

                <div
                  v-if="column.isSortable"
                  class="chevron header-cell__sort-icon"
                  :class="
                    sortOrders[column.id] > 0 ? 'chevron--up' : 'chevron--down'
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
              v-if="tableProps.isSelectable"
              class="m2-table__row-cell m2-table__row-checkbox-cell"
            >
              <input
                type="checkbox"
                class="m2-checkbox"
                :id="row.id"
                :value="row.id"
                v-model="selectedRows"
                @change="updateSelectall()"
              />
              <label :for="row.id" class="m2-checkbox__label"></label>
            </td>
            <td
              :data-label="column.label"
              class="m2-table__row-cell"
              :class="column.cellClassNames"
              v-for="column in columns"
              :key="column.id"
            >
              <div class="m2-table__row-cell-wrapper">
                <input
                  v-focus
                  v-if="`${row.id}_${column.id}` === currentEditingCellId"
                  @keyup.enter="saveCellData($event, column, row, rowIndex)"
                  @focusout="currentEditingCellId = ''"
                  class="m2-table__row-cell-input"
                  type="text"
                  :value="row[column.id]"
                />
                <div class="m2-table__row-cell-label-container" v-else>
                  <div
                    class="m2-table__row-cell-label truncate"
                    :class="{
                      'm2-table__row-cell--editable': column.isCellEditable
                    }"
                  >
                    {{ row[column.id] | runTransforms(column) }}
                  </div>
                  <svg
                    v-if="column.isCellEditable"
                    @click="onCellClick(row, column)"
                    viewBox="0 0 512 512"
                    width="16px"
                    height="16px"
                    class="m2-table__row-cell-edit-icon"
                  >
                    <path
                      d="M64 368v80h80l235.727-235.729-79.999-79.998L64 368zm377.602-217.602c8.531-8.531 8.531-21.334 0-29.865l-50.135-50.135c-8.531-8.531-21.334-8.531-29.865 0l-39.468 39.469 79.999 79.998 39.469-39.467z"
                    ></path>
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <M2Pagination
      v-if="paginatedRows.length"
      :currentPage="page"
      :pageSize="pageSize"
      :totalCount="filteredRows.length"
      v-on:pageChanged="page = $event"
      class="component-item"
    ></M2Pagination>
  </div>
</template>

<script>
import M2Pagination from "@/components/m2-pagination.vue";
import { mapGetters } from "vuex";

export default {
  name: "M2Table",
  components: {
    M2Pagination
  },

  props: {
    tableProps: {
      type: Object,
      default: () => ({
        itemsPerPage: 0,
        isPaginated: false,
        isSelectable: false,
        rowActions: [],
        hasGlobalSearch: false
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

      if (column.isFilterable) {
        column.filterText = "";
      }
    });

    return {
      sortOrders,
      columns,
      sortKey: "",
      searchText: "",
      currentEditingCellId: "",
      page: 1,
      isSelectAll: false,
      isDropdownOpen: false,
      selectedRows: []
    };
  },

  computed: {
    ...mapGetters(["isLoading"]),

    hasActiveFilters() {
      return this.searchText || this.columns.some(col => col.filterText);
    },

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
      const searchText = this.searchText && this.searchText.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      const columns = this.columns;

      let data = this.model;
      if (searchText) {
        data = data.filter(row => {
          return Object.keys(row).some(key => {
            return String(row[key]).search(new RegExp(searchText, "i")) > -1;
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
        data = data.slice().sort((a, b) => {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }

      return data;
    }
  },

  methods: {
    onActionClick(action) {
      this.isDropdownOpen = false;
      if (typeof action.handler === "function") {
        action.handler(this.selectedRows);
      }
    },

    onSelectAll() {
      this.isSelectAll = !this.isSelectAll;
      this.selectedRows = [];
      if (this.isSelectAll) {
        this.paginatedRows.forEach(row => {
          this.selectedRows.push(row.id);
        });
      }
    },

    updateSelectall() {
      this.isSelectAll = this.selectedRows.length == this.paginatedRows.length;
    },

    onCellClick(row, column) {
      if (column.isCellEditable) {
        this.currentEditingCellId = `${row.id}_${column.id}`;
      }
    },

    saveCellData(event, column, row) {
      this.currentEditingCellId = "";
      const oldValue = row[column.id];
      const newValue = event.target.value;
      if (oldValue !== newValue) {
        this.$store.dispatch("updatePayments", {
          row: { ...row, [column.id]: newValue }
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
    },

    resetFilters() {
      this.columns = this.columns.map(col => {
        col.filterText = "";
        return col;
      });
      this.page = 1;
      this.searchText = "";
    },

    toggleDropdown() {
      if (this.selectedRows.length) {
        this.isDropdownOpen = !this.isDropdownOpen;
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
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$table-width: 80%;
$table-cell-width: 20%;
$table-sort-icon-size: 10px;
$table-checkbox-column-width: 50px;
$table-row-cell-height: 50px;

.component-wrapper {
  display: flex;
  flex-direction: column;
}

.component-item {
  &--mobile-only {
    display: none;
  }
  // &:nth-child(1) {
  //   order: 2;
  // }
  // &:nth-child(2) {
  //   order: 3;
  // }
  // &:nth-child(3) {
  //   order: 4;
  // }
}

.chevron {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 5px;
  cursor: pointer;

  &--down {
    border-left: $table-sort-icon-size solid transparent;
    border-right: $table-sort-icon-size solid transparent;
    border-top: $table-sort-icon-size solid $color-white;
  }

  &--up {
    border-left: $table-sort-icon-size solid transparent;
    border-right: $table-sort-icon-size solid transparent;
    border-bottom: $table-sort-icon-size solid $color-white;
  }
}

// styles for default resolution
.header-cell {
  width: $table-cell-width;
  padding: 2px 10px;
  text-align: left;
  user-select: none;

  &__sort-icon {
    opacity: 0.5;
  }

  &--active {
    color: $color-white;

    .header-cell__sort-icon {
      opacity: 1;
    }
  }

  &--checkbox {
    width: $table-checkbox-column-width;
    .m2-checkbox__label:before {
      border-color: $color-white;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__name-wrapper {
    width: 85%;
  }

  &__name {
    width: 85%;
    border: none;
    outline: none;
    padding: 3px;

    &--filterable {
      cursor: pointer;
      &:hover {
        border-radius: 3px;
        border: 1px solid $color-border;
      }
    }

    &--mini {
      font-size: 0.8rem;
      font-weight: 700;
      opacity: 0.7;
    }
  }

  &__input {
    width: 85%;
    height: 30px;
    border-radius: 4px;
    font-weight: 500;
    border: 1px solid $color-border;
    background-color: $color-primary;
    color: $color-white;
  }
}

.m2-table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: auto;
  table-layout: fixed;

  &__dropdown-list {
    position: absolute;
    width: 200px;
    margin: 0;
    padding: 0;
    list-style-type: none;
    transform-origin: top;
    transition: transform 0.4s ease-in-out;
    overflow: hidden;
    top: 100px;
    z-index: 2;
  }
  &__dropdown-list-items {
    cursor: pointer;
    padding: 10px;
    background-color: $color-white;
    border-bottom: 1px solid $color-border;
    border-left: 3px solid $color-border;
  }

  &__search {
    width: 20%;
    border-radius: 2px;
    border: 2px solid $color-border;
    font-size: 1rem;
    color: $color-gray;
    &::-webkit-input-placeholder {
      opacity: 0.7;
      padding-left: 4px;
    }
  }

  // header elements
  &__header {
    background-color: $color-primary;
    color: $color-white;
    font-weight: 500;
  }

  &__header-row {
    height: 60px;
  }

  &__body {
    width: 100%;
    background-color: $color-white;
    color: $color-secondary;
  }

  // row elements
  &__row {
    border-top: 1px solid $color-border;
    &:nth-child(even) {
      background-color: $color-gray--alpha;
    }
  }

  &__row-cell {
    height: $table-row-cell-height;
    text-align: left;
    &--editable {
      width: 85%;
    }
  }

  &__row-cell-wrapper {
    height: 100%;
  }

  &__row-cell-label {
    padding: 5px;
    //height: 40px;
  }

  &__row-cell-edit-icon {
    vertical-align: middle;
    cursor: pointer;
    color: $color-gray;
  }
  &__row-cell-label-container {
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__row-cell-input {
    font-size: 0.9rem;
    width: 85%;
    height: 100%;
    border-radius: 4px;
    color: $color-secondary;
  }

  &__row-checkbox-cell {
    display: flex;
    justify-content: center;
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

.m2-table-actions {
  display: flex;
  justify-content: space-between;
  height: 35px;
  margin-bottom: 10px;

  &__item {
    display: flex;
    align-items: center;
  }

  &__button {
    color: $color-white;
    background-color: $color-ternary;
    border-radius: 3px;
    padding: 6px 12px;
    font-size: 1rem;
    box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.2);
    transition: display 0s linear 0.33s, opacity 0.33s linear;
    cursor: pointer;

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      outline: none;
      user-select: none;
    }
  }
}

$breakpoint-a: 1100px;
$breakpoint-b: 768px;

@media (min-width: $breakpoint-b) and (max-width: $breakpoint-a) {
  $table-cell-width--a: 160px;
  .m2-table-container {
    overflow-x: auto;
  }

  .m2-table {
    width: $breakpoint-a;
    &__cell {
      &--xs {
        width: #{$table-cell-width--a * 0.5};
      }

      &--small {
        width: #{$table-cell-width--a * 0.75};
      }

      &--large {
        width: #{$table-cell-width--a * 1.25};
      }

      &--xl {
        width: #{$table-cell-width--a * 2};
      }
    }
  }
}
@media screen and (max-width: $breakpoint-b) {
  $margin-between-blocks: 15px;
  $cell-height: 60px;

  .component-item {
    &--mobile-only {
      display: flex;
      margin-bottom: 10px;
    }
    // &:nth-child(3) {
    //   order: 1;
    //   margin-bottom: 10px;
    // }
  }

  .header-cell {
    width: auto;
    height: $cell-height;
    border-bottom: 1px solid $color-border;

    &__content {
      justify-content: space-between;
      align-items: unset;
    }

    &__name {
      margin-top: 10px;
      &--active {
        margin: 0;
      }
    }

    &__sort-icon {
      margin-top: 10px;
      margin-left: 0;
      margin-right: 10px;
    }
    &--checkbox {
      display: flex;
      align-items: center;
    }
  }

  .m2-table-actions {
    height: 100%;
    flex-direction: column;

    &__item {
      height: 40px;
      width: 100%;
      margin-bottom: 5px;
    }
  }

  .m2-table {
    .truncate {
      width: auto;
    }

    &__header {
      display: block;
      margin-bottom: $margin-between-blocks;
    }

    &__header-row {
      display: flex;
      flex-direction: column;
      height: auto;
      border-left: 1px solid $color-border;
      border-right: 1px solid $color-border;
    }

    &__row {
      display: block;
      border-left: 1px solid $color-border;
      border-right: 1px solid $color-border;
      border-bottom: 3px solid $color-border;
      margin-bottom: $margin-between-blocks;
    }

    &__row-cell-wrapper {
      display: flex;
    }

    &__row-cell {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: auto;
      height: $cell-height;
      padding-left: 10px;
      border-bottom: 1px solid $color-border;
      &::before {
        content: attr(data-label);
        font-weight: 700;
        font-size: 1rem;
      }
    }

    &__row-cell-input {
      width: 100%;
      height: unset;
      margin-right: 8px;
    }

    &__row-checkbox-cell {
      display: flex;
      justify-content: center;
    }

    &__row-cell-label {
      padding: 0px;
    }

    &__row-cell-label-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    &__row-cell-edit-icon {
      margin-right: 10px;
    }

    &__cell {
      &--xs {
        width: auto;
      }

      &--small {
        width: auto;
      }

      &--large {
        width: auto;
      }

      &--xl {
        width: auto;
      }
    }
  }
}
</style>
