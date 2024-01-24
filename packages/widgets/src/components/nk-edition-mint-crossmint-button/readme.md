# nk-edition-mint-crossmint-button



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute           | Description                       | Type     | Default                        |
| --------------------------- | ------------------- | --------------------------------- | -------- | ------------------------------ |
| `collectionId` _(required)_ | `collection-id`     | Crossmint Collection Id           | `string` | `undefined`                    |
| `editionId` _(required)_    | `edition-id`        | Edition Id                        | `number` | `undefined`                    |
| `projectId` _(required)_    | `project-id`        | Crossmint Project Id              | `string` | `undefined`                    |
| `successLink`               | `success-link`      | Link on the success modal         | `string` | `''`                           |
| `successLinkText`           | `success-link-text` | Link text on the success modal    | `string` | `'here'`                       |
| `successMessage`            | `success-message`   | Body message on the success modal | `string` | `'Successfully minted an NFT'` |
| `successTitle`              | `success-title`     | Title on the success modal        | `string` | `'Success'`                    |


## Methods

### `openModal() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part                        | Description |
| --------------------------- | ----------- |
| `"crossmint-btn-container"` |             |


## Dependencies

### Depends on

- [nk-dialog](../nk-dialog)

### Graph
```mermaid
graph TD;
  nk-edition-mint-crossmint-button --> nk-dialog
  style nk-edition-mint-crossmint-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
