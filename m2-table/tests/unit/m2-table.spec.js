import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import M2Table from "@/components/m2-table.vue";

const columnDefs = [
  {
    id: "id",
    label: "id",
    isSortable: true,
    isFilterable: false,
    isCellEditable: false
  },
  {
    id: "name",
    label: "name",
    isSortable: true,
    isFilterable: true,
    isCellEditable: true
  },
  {
    id: "description",
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
const HEADER_CELL = "[data-test-header-cell='true']";
const ROW_CELL = "[data-test-row-cell='true']";
const ROW = "[data-test-row='true']";
const SORT_ICON = "[data-test-header-cell__sort-icon='true']";
const FILTERABLE_COLUMN_LABEL = ".header-cell__name--filterable";
const FILTERABLE_COLUMN_INPUT = "[data-test-header-cell__input='true']";

const HEADER_CHECKBOX_CELL = "[data-test-header-cell--checkbox='true']";
const ROW_CHECKBOX_CELL = "[data-test-row-checkbox-cell='true']";
const BULK_ACTIONS_DROPDOWN = "[data-test-table-dropdown='true']";
const SEARCH_INPUT = "[data-test-table-search='true']";
const PAGINATION = "[data-test-pagination='true']";

describe("m2-table elements and options", () => {
  it("renders component elements correctly", () => {
    const wrapper = factory({ columnDefs, model });
    expect(wrapper.findAll(HEADER_CELL).length).to.equal(columnDefs.length);
    expect(wrapper.findAll(ROW).length).to.equal(model.length);
  });

  it("renders optional component elements correctly, when they are true", () => {
    const tableProps = {
      itemsPerPage: 10,
      isPaginated: true,
      isSelectable: true,
      hasGlobalSearch: true
    };

    const wrapper = factory({ tableProps, columnDefs, model });
    expect(wrapper.find(BULK_ACTIONS_DROPDOWN).exists()).to.be.true;
    expect(wrapper.find(SEARCH_INPUT).exists()).to.be.true;
    expect(wrapper.find(HEADER_CHECKBOX_CELL).exists()).to.be.true;
    expect(wrapper.findAll(ROW_CHECKBOX_CELL).length).to.equal(model.length);
    expect(wrapper.find(PAGINATION).exists()).to.be.true;
  });

  it("doesn't render optional component elements correctly, when they are false", () => {
    const tableProps = {
      isPaginated: false,
      isSelectable: false,
      hasGlobalSearch: false
    };

    const wrapper = factory({ tableProps, columnDefs, model });
    expect(wrapper.find(BULK_ACTIONS_DROPDOWN).exists()).to.be.false;
    expect(wrapper.find(SEARCH_INPUT).exists()).to.be.false;
    expect(wrapper.find(HEADER_CHECKBOX_CELL).exists()).to.be.false;
    expect(wrapper.findAll(ROW_CHECKBOX_CELL).length).to.equal(0);
    expect(wrapper.find(PAGINATION).exists()).to.be.false;
  });
});

describe("m2-table user interactions", () => {
  it("sorts columns correctly", () => {
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

  it("searches across columns correctly", () => {});
  it("handles pagination correctly", () => {});
  it("handles bulk actions correctly", () => {});
  it("allows inline editing", () => {});
});
