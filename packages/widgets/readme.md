# NiftyKit Diamond Widgets


NiftyKit Diamond Widgets are set of Web Components designed to help users create the perfect mint page. It's flexible, and modern browser compatible, ships with the latest [WalletConnect 2.0](https://docs.walletconnect.com/2.0).

**🚧 Warning! This repository is still beta. 🚧** 

This repository is still work-in-progress, API structures are subjected to change. We will keep you posted on breaking changes on our Discord.

## Basic Usage

The widgets work with any HTML, whether it's loaded in Webflow or Wordpress, as long as you have control over the HTML, you can embed the widget.

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <title>My Mint Page</title>
    <script type="module" src="https://sdk.niftykit.com/widgets/widgets.esm.js"></script>
  </head>
  <body>
    <nk-diamond collection-id="clg9wuwjd00019e384ck7vauc">
      <nk-connect-wallet-button>
        Connect Wallet
      </nk-connect-wallet-button>
      <nk-is-connected>
        <h3>
          <nk-drop-supply-text /> Minted
        </h3>
        <h3>
          Mint Price: <nk-drop-price-text />
        </h3>
        <nk-drop-mint-button success-title="Success!" success-message="You did it!">
          Mint NFT
        </nk-drop-mint-button>
      </nk-is-connected>
    </nk-diamond>
  </body>
</html>
```

## Available Components

* [`<nk-diamond />`](./src/components/nk-diamond/readme.md)
* [`<nk-connect-wallet-button />`](./src/components/nk-connect-wallet-button/readme.md)
* [`<nk-drop-supply-text />`](./src/components/nk-drop-supply-text/readme.md)
* [`<nk-drop-price-text />`](./src/components/nk-drop-price-text/readme.md)
* [`<nk-drop-mint-button />`](./src/components/nk-drop-mint-button/readme.md)
* [`<nk-drop-mint-crossmint-button />`](./src/components/nk-drop-crossmint-winter-button/readme.md)
* [`<nk-drop-mint-winter-button />`](./src/components/nk-drop-mint-winter-button/readme.md)
* [`<nk-is-connected />`](./src/components/nk-is-connected/readme.md)
* [`<nk-is-not-connected />`](./src/components/nk-is-not-connected/readme.md)
* [`<nk-is-holder />`](./src/components/nk-is-holder/readme.md)


## Example of overriding styles:
  
Add any overrides inside a `style` tag in your html `head`.

```html
<style>
    nk-connect-wallet-button::part(wallet-btn-container) {  
        margin: 20px auto;  
        display: block;  
    }
    nk-connect-wallet-button::part(wallet-btn) {  
        width: 300px;
        height: 50px;
        background: #553d9d;  
    }
    nk-drop-mint-button::part(mint-btn) {
        height: 80px;
        background: #553d9d;
        border-radius: 40px;
    }
    nk-drop-mint-button::part(mint-text) {
        font-size: 36px;
    }
    nk-drop-mint-button::part(mint-dropdown-icon) {
        width: 32px;
        height: 32px;
        fill: black;
    }
</style>
```