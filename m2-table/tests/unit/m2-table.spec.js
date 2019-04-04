import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import M2Table from "@/components/m2-table.vue";

const columnDefs = [
  {
    label: "id",
    isSortable: true,
    isFilterable: false,
    isCellEditable: false
  },
  {
    label: "name",
    isSortable: true,
    isFilterable: true,
    isCellEditable: true
  },
  {
    label: "description",
    isSortable: false,
    isFilterable: true,
    isCellEditable: false
  }
];
const model = [
  {
    id: "A",
    name: "Seinfeld",
    description: "ABC"
  },
  {
    id: "B",
    name: "Elaine",
    description: "abc"
  },
  {
    id: "C",
    name: "Kramer",
    description: "def"
  }
];

const factory = (values = {}) => {
  return shallowMount(M2Table, {
    propsData: { ...values }
  });
};

// Element Selectors
const HEADER_CELL = ".m2-table__header-cell";
const ROW_CELL = ".m2-table__row-cell";
const ROW = ".m2-table__row";
const SORT_ICON = ".m2-table__header-sort-icon";
const FILTERABLE_COLUMN_LABEL = ".m2-table__header-label--filterable";
const FILTERABLE_COLUMN_INPUT = ".m2-table__header-filter-input";

describe("m2-table.vue", () => {
  it("renders table correctly", () => {
    const wrapper = factory({ columnDefs, model });
    expect(wrapper.findAll(HEADER_CELL).length).to.equal(columnDefs.length);
    expect(wrapper.findAll(ROW).length).to.equal(model.length);
  });

  it("sorts column correctly", () => {
    const wrapper = factory({ columnDefs, model });
    let tableRows = wrapper.findAll(ROW);
    const sortIcon = wrapper.findAll(SORT_ICON);
    const expectedSortableColumnsNumber = columnDefs.filter(
      col => col.isSortable
    ).length;

    expect(sortIcon.length).to.equal(expectedSortableColumnsNumber);
    // verify that for first column order is correct by default
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows.at(i);
      expect(
        row
          .findAll(ROW_CELL)
          .at(0)
          .text()
      ).to.equal(model[i][columnDefs[0].label]);
    }

    // sort the first column
    sortIcon.at(0).trigger("click");
    tableRows = wrapper.findAll(ROW);

    // now the order should be reveresed
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows.at(i);
      expect(
        row
          .findAll(ROW_CELL)
          .at(0)
          .text()
      ).to.equal(model[tableRows.length - i - 1][columnDefs[0].label]);
    }
  });

  it("filters columns correctly", () => {
    const wrapper = factory({ columnDefs, model });
    let tableRows = wrapper.findAll(ROW);
    const filterableColumns = wrapper.findAll(FILTERABLE_COLUMN_LABEL);
    const expectedFilterableColumnsNumber = columnDefs.filter(
      col => col.isFilterable
    ).length;
    const column1 = filterableColumns.at(0);
    const column2 = filterableColumns.at(1);

    // verify that all cells are rendered for 3rd column
    expect(filterableColumns.length).to.equal(expectedFilterableColumnsNumber);

    expect(tableRows.length).to.equal(model.length);

    // filter 3rd column for text "ab", should return 2 results
    column2.trigger("click");
    let filterInput = wrapper.find(FILTERABLE_COLUMN_INPUT);
    filterInput.setValue("ab");
    filterInput.trigger("keyup.enter");

    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(2);

    // filter 2nd column for text "sein", should return 1 result
    column1.trigger("click");
    filterInput = wrapper.find(FILTERABLE_COLUMN_INPUT);
    filterInput.setValue("sein");
    filterInput.trigger("keyup.enter");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(1);
  });
});
