# nk-drop-mint-button



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type     | Default                        |
| ---------------- | ----------------- | ----------- | -------- | ------------------------------ |
| `successMessage` | `success-message` |             | `string` | `'Successfully minted an NFT'` |
| `successTitle`   | `success-title`   |             | `string` | `'Success'`                    |


## Methods

### `mint(quantity: number) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part                   | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `"mint-btn"`           | Button for selecting the number of items and triggering the mint action. |
| `"mint-btn-container"` | Containing element wrapper for the mint button.                          |
| `"mint-dropdown-icon"` | Icon for the mint button.                                                |
| `"mint-text"`          | Descriptive button text for the user action.                             |


## Examples of overriding styles:

    nk-drop-mint-button::part(mint-btn-container) {  
        width: 300px;  
        height: 42px;  
    }  
  
    nk-drop-mint-button::part(mint-btn) {  
        height: 42px;  
        background: red;  
    }  
  
    nk-drop-mint-button::part(mint-text) {  
        font-size: 18px;  
    }  
  
    nk-drop-mint-button::part(mint-dropdown-icon) {  
        width: 32px;  
        height: 32px;  
        fill: black;  
    }  

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
