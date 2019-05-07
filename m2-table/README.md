# m2-table

## Project setup

```
yarn install
```

Firebase config of the deployed site is checked in to make it easier to play around app locally.

Ideally one should follow https://firebase.google.com/docs/database/web/start to get web credentials and update config in [firebase/index.js](src/firebase/index.js)

Import sample JSON in below structure

```js
{
  "3471DA17-401F-9633-BF81-4CADA6FD5C79": {
    "id": "3471DA17-401F-9633-BF81-4CADA6FD5C79",
    "name": "Kyra Lester",
    "description": "Curabitur dictum. Phasellus in",
    "date": "2017-07-23T04:24:49-07:00",
    "amount": 345.54
  },
  "9F5C9912-936A-FB85-1EDB-9DA87BE7FF1E": {
    "id": "9F5C9912-936A-FB85-1EDB-9DA87BE7FF1E",
    "name": "Buckminster Alvarado",
    "description": "dui, in sodales elit erat vitae risus. Duis a mi",
    "date": "2018-11-08T05:44:15-08:00",
    "amount": 677.08
  },
  // and so on
}

```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your unit tests

```
yarn run test-ci
```

### Tests and watch for development

```
yarn run test-dev
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
