import { expect } from "chai";
import sinon from "sinon";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import M2Table from "@/components/m2-table.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

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
    // inline editing
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
    name: "Jerry Seinfeld",
    description: "abcd"
  },
  {
    id: "B",
    name: "Geroge Costanza",
    description: "def"
  },
  {
    id: "C",
    name: "Elaine Benes",
    description: "abc"
  },
  {
    id: "D",
    name: "Cosmo Kramer",
    description: "def"
  }
];

const factory = (values = {}) => {
  return shallowMount(M2Table, {
    propsData: { ...values }
  });
};

const deepFactory = (values = {}) => {
  return mount(M2Table, {
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
const ROW_CELL_EDIT_ICON = "[data-test-row-cell-edit-icon='true']";
const ROW_CELL_EDITABLE = "[data-test-row-cell--editable='true']";
const ROW_CELL_INPUT = "[data-test-row-cell-input='true']";
const HEADER_CHECKBOX_CELL = "[data-test-header-cell--checkbox='true']";
const ROW_CHECKBOX_CELL = "[data-test-row-checkbox-cell='true']";
const BULK_ACTIONS_DROPDOWN = "[data-test-table-dropdown='true']";
const SEARCH_INPUT = "[data-test-table-search='true']";
const PAGINATION = "[data-test-pagination='true']";
const PAGINATION_TEXT = "[data-test-pagination__text='true']";
const PAGINATION_CONTROL = "[data-test-pagination__control='true']";
const RESET_FILTERS = "[data-test-table-reset-filters='true']";

describe("m2-table renders", () => {
  it("base elements", () => {
    const wrapper = factory({ columnDefs, model });
    expect(wrapper.findAll(HEADER_CELL).length).to.equal(columnDefs.length);
    expect(wrapper.findAll(ROW).length).to.equal(model.length);
  });

  it("optional elements, when they are true", () => {
    const tableProps = {
      itemsPerPage: 10,
      isPaginated: true,
      isSelectable: true,
      hasGlobalSearch: true
    };

    const localColumnDefs = columnDefs.map(col => ({
      ...col,
      isSortable: true,
      isFilterable: true,
      isCellEditable: true
    }));
    const wrapper = factory({ tableProps, columnDefs: localColumnDefs, model });
    expect(wrapper.find(BULK_ACTIONS_DROPDOWN).exists()).to.be.true;
    expect(wrapper.find(SEARCH_INPUT).exists()).to.be.true;
    expect(wrapper.find(HEADER_CHECKBOX_CELL).exists()).to.be.true;
    expect(wrapper.findAll(ROW_CHECKBOX_CELL).length).to.equal(model.length);
    expect(wrapper.findAll(SORT_ICON).length).to.equal(localColumnDefs.length);
    expect(wrapper.findAll(FILTERABLE_COLUMN_LABEL).length).to.equal(
      localColumnDefs.length
    );
    expect(wrapper.findAll(ROW_CELL_EDIT_ICON).length).to.equal(
      localColumnDefs.length * model.length
    );
    expect(wrapper.find(PAGINATION).exists()).to.be.true;
  });

  it("doesn't render optional elements, when they are false", () => {
    const tableProps = {
      isPaginated: false,
      isSelectable: false,
      hasGlobalSearch: false
    };

    const localColumnDefs = columnDefs.map(col => ({
      ...col,
      isSortable: false,
      isFilterable: false,
      isCellEditable: false
    }));
    const wrapper = factory({ tableProps, columnDefs: localColumnDefs, model });
    expect(wrapper.find(BULK_ACTIONS_DROPDOWN).exists()).to.be.false;
    expect(wrapper.find(SEARCH_INPUT).exists()).to.be.false;
    expect(wrapper.find(HEADER_CHECKBOX_CELL).exists()).to.be.false;
    expect(wrapper.findAll(ROW_CHECKBOX_CELL).length).to.equal(0);
    expect(wrapper.findAll(SORT_ICON).length).to.equal(0);
    expect(wrapper.findAll(FILTERABLE_COLUMN_LABEL).length).to.equal(0);
    expect(wrapper.findAll(ROW_CELL_EDIT_ICON).length).to.equal(0);
    expect(wrapper.find(PAGINATION).exists()).to.be.false;
  });
});

describe("m2-table correctly", () => {
  let actions;
  let store;
  let updatePaymentsStub;

  beforeEach(() => {
    updatePaymentsStub = sinon.stub();
    actions = {
      updatePayments: updatePaymentsStub
    };
    store = new Vuex.Store({
      actions
    });
  });

  it("sorts applicable columns", () => {
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

  it("filters applicable columns", () => {
    const wrapper = factory({ columnDefs, model });
    let tableRows = wrapper.findAll(ROW);
    let resetEl = wrapper.find(RESET_FILTERS);
    const filterableColumns = wrapper.findAll(FILTERABLE_COLUMN_LABEL);
    const expectedFilterableColumnsNumber = columnDefs.filter(
      col => col.isFilterable
    ).length;
    const column1 = filterableColumns.at(0);
    const column2 = filterableColumns.at(1);

    // verify that all cells are rendered for 3rd column
    expect(filterableColumns.length).to.equal(expectedFilterableColumnsNumber);
    expect(resetEl.exists()).to.be.false;
    expect(tableRows.length).to.equal(model.length);

    // filter 3rd column for text "ab", should return 2 results
    column2.trigger("click");
    let filterInput = wrapper.find(FILTERABLE_COLUMN_INPUT);
    filterInput.setValue("ab");
    filterInput.trigger("keyup.enter");

    tableRows = wrapper.findAll(ROW);
    resetEl = wrapper.find(RESET_FILTERS);
    expect(tableRows.length).to.equal(2);
    expect(resetEl.exists()).to.be.true;

    // filter 2nd column for text "sein", should return 1 result
    column1.trigger("click");
    filterInput = wrapper.find(FILTERABLE_COLUMN_INPUT);
    filterInput.setValue("sein");
    filterInput.trigger("keyup.enter");
    tableRows = wrapper.findAll(ROW);
    resetEl = wrapper.find(RESET_FILTERS);
    expect(tableRows.length).to.equal(1);
    expect(resetEl.exists()).to.be.true;

    resetEl.trigger("click");
    resetEl = wrapper.find(RESET_FILTERS);
    tableRows = wrapper.findAll(ROW);
    expect(resetEl.exists()).to.be.false;
    expect(tableRows.length).to.equal(model.length);
  });

  it("searches across all columns head", () => {
    const tableProps = {
      hasGlobalSearch: true
    };

    const wrapper = factory({ tableProps, columnDefs, model });
    const searchEl = wrapper.find(SEARCH_INPUT);

    let tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(model.length);

    // searching against 2nd column
    searchEl.setValue("jerry");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(1);

    // searching against 2nd column
    searchEl.setValue("cosmo");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(1);

    // searching against 3rd column
    searchEl.setValue("def");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(2);
  });

  it("performs pagination", () => {
    const itemsPerPage = 2;
    const tableProps = {
      itemsPerPage,
      isPaginated: true
    };

    const wrapper = deepFactory({ tableProps, columnDefs, model });
    const paginationEl = wrapper.find(PAGINATION);
    const paginationTextEl = paginationEl.find(PAGINATION_TEXT);
    const paginationControlEl = paginationEl.find(PAGINATION_CONTROL);

    // should have 4 control elements, 2 for chevrons and 2 for pages
    expect(paginationControlEl.findAll("a").length).to.equal(4);

    // should show only first 2 items
    let tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(2);
    expect(
      tableRows
        .at(0)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[0].id);
    expect(
      tableRows
        .at(1)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[1].id);

    expect(paginationTextEl.text()).to.equal(
      `Showing 1 - ${itemsPerPage} of ${model.length} results`
    );

    // click on page number 2
    paginationControlEl
      .findAll("a")
      .at(2)
      .trigger("click");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(2);
    expect(
      tableRows
        .at(0)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[2].id);
    expect(
      tableRows
        .at(1)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[3].id);

    expect(paginationTextEl.text()).to.equal(
      `Showing 3 - 4 of ${model.length} results`
    );

    // click on left chevron
    paginationControlEl
      .findAll("a")
      .at(0)
      .trigger("click");
    tableRows = wrapper.findAll(ROW);
    expect(tableRows.length).to.equal(2);
    expect(
      tableRows
        .at(0)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[0].id);
    expect(
      tableRows
        .at(1)
        .findAll(ROW_CELL)
        .at(0)
        .text()
    ).to.equal(model[1].id);

    expect(paginationTextEl.text()).to.equal(
      `Showing 1 - ${itemsPerPage} of ${model.length} results`
    );
  });

  it("supports inline editing", () => {
    const propsData = {
      columnDefs,
      model
    };
    const wrapper = shallowMount(M2Table, { propsData, store, localVue });
    const firstRow = wrapper.findAll(ROW).at(0);

    // 2nd column i.e. name field is editable
    expect(firstRow.find(ROW_CELL_EDITABLE).text()).to.equal(model[0].name);
    firstRow.find(ROW_CELL_EDIT_ICON).trigger("click");
    firstRow.find(ROW_CELL_INPUT).setValue("updated value");
    firstRow.find(ROW_CELL_INPUT).trigger("keyup.enter");
    // verify that action is dispatched to the store
    expect(updatePaymentsStub.calledOnce).to.be.true;
  });
});
