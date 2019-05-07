## Introduction

A VueJS application showing a data-table component in action.

## Features

- App is scaffolded using vue cli and follows recommended vue style guide and vue eslint rules
- Client side pagination is done via a generic pagination component
- Case insensitive text search across all columns
- Filtering and sorting of columns
- Inline editing of row fields
- VueX is used for state management with Firebase Realtime Database as persistent data store
- Rows can be selected individually or in bulk and actions can be performed on them
- Active filters can be reset
- Sass is used for writing modular CSS using BEM conventions

## Running App

`m2-table` is the Vue app. After cloning the repo locally, run
`cd data-table-vue/m2-table`

and follow the steps at [m2-table readme](m2-table/README.md)

This app is also deployed at https://m2-table.surge.sh

## API Documentation

[`m2-table`](m2-table/src/components/m2-table.vue) is the main component. It accepts 3 properties like below

```html
<m2-table
  :tableProps="tableProps"
  :model="model"
  :columnDefs="columnDefs"
></m2-table>
```

#### tableProps

An object having properties which defines the behaviour of table.

| Key               | Required | Data Type | Description                                                     |
| ----------------- | -------- | --------- | --------------------------------------------------------------- |
| `isPaginated`     | no       | boolean   | Whether pagination elements and functionality is needed         |
| `itemsPerPage`    | no       | boolean   | Items to show per page, should be provided in addition to above |
| `isSelectable`    | no       | boolean   | Is any row selectable                                           |
| `hasGlobalSearch` | no       | boolean   | For text search across all columns                              |
| `rowActions`      | no       | array     | List of objects defining row action (see below)                 |

#### tableProps.rowActions

An array of objects defining row action. Object structure as follows

| Key       | Required | Data Type | Description                                                         |
| --------- | -------- | --------- | ------------------------------------------------------------------- |
| `id`      | yes      | string    | A unique string to identify b/w row actions                         |
| `name`    | yes      | string    | Label to be disaplyed for action dropdown menu                      |
| `handler` | yes      | function  | Handler function which will be called on selecting that action menu |

#### columnDefs

An array of column defintion objects. Object structure as follows

| Key              | Required | Data Type | Description                                |
| ---------------- | -------- | --------- | ------------------------------------------ |
| `id`             | yes      | string    | A unique string to identify b/w columns    |
| `name`           | yes      | string    | Column header string                       |
| `isSortable`     | no       | boolean   | Whether column is sortable or not          |
| `isFilterable`   | no       | boolean   | Whether column is filterable or not        |
| `isCellEditable` | no       | boolean   | Whether row cell is inline editable or not |

#### model

An array of data objects which will be displayed per row in table

## Workflow Examples

### Column Filtering and Sorting

![filtering sorting](https://user-images.githubusercontent.com/3315240/55681564-57abc080-5945-11e9-8404-bf1899aa571c.gif)

### Inline Editing

![editing](https://user-images.githubusercontent.com/3315240/55681781-04873d00-5948-11e9-8337-9271f1982dc9.gif)

### Search

![searching](https://user-images.githubusercontent.com/3315240/55681602-cc7efa80-5945-11e9-8570-0d86aa7fc379.gif)

### Pagination

![pagination](https://user-images.githubusercontent.com/3315240/55681654-765e8700-5946-11e9-88a2-d532f0554ae5.gif)

### Responsiveness

![responsiveness](https://user-images.githubusercontent.com/3315240/55681830-7fe8ee80-5948-11e9-9125-e90300467275.gif)

### Bulk Actions

![bulk-actions](https://user-images.githubusercontent.com/3315240/55681804-28e31980-5948-11e9-834e-5eb92a23aa5b.gif)
