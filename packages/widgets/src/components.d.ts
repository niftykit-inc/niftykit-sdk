/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface NkConnectWalletButton {
    }
    interface NkDialog {
        "buttonText": string;
        "dialogTitle": string;
        "open": boolean;
    }
    interface NkDiamond {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
    }
    interface NkDropMintButton {
        "mint": (quantity: number) => Promise<void>;
        /**
          * Image url for the success modal
         */
        "successImageUrl"?: string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage": string;
        /**
          * Align text on the success modal (default: left)
         */
        "successTextAlign"?: string;
        /**
          * Title on the success modal
         */
        "successTitle": string;
    }
    interface NkDropMintCrossmintButton {
        /**
          * Crossmint Collection Id
         */
        "collectionId": string;
        "openModal": () => Promise<void>;
        /**
          * Crossmint Project Id
         */
        "projectId": string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage": string;
        /**
          * Title on the success modal
         */
        "successTitle": string;
    }
    interface NkDropMintWinterButton {
        "openModal": () => Promise<void>;
        /**
          * Winter Project Id
         */
        "projectId": string;
        /**
          * Body message on the success modal
         */
        "successMessage": string;
        /**
          * Title on the success modal
         */
        "successTitle": string;
    }
    interface NkDropPriceText {
    }
    interface NkDropSupplyText {
    }
    interface NkEditionMintButton {
        /**
          * Edition ID
         */
        "editionId": number;
        "mint": (quantity: number) => Promise<void>;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage": string;
        /**
          * Title on the success modal
         */
        "successTitle": string;
    }
    interface NkEditionMintCrossmintButton {
        /**
          * Crossmint Collection Id
         */
        "collectionId": string;
        /**
          * Edition Id
         */
        "editionId": number;
        "openModal": () => Promise<void>;
        /**
          * Crossmint Project Id
         */
        "projectId": string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage": string;
        /**
          * Title on the success modal
         */
        "successTitle": string;
    }
    interface NkEditionPriceText {
        /**
          * Edition ID
         */
        "editionId": number;
    }
    interface NkEditionSupplyText {
        /**
          * Edition ID
         */
        "editionId": number;
    }
    interface NkIsConnected {
    }
    interface NkIsHolder {
        /**
          * Holding a specific Token ID
         */
        "tokenId"?: string;
    }
    interface NkIsNotConnected {
    }
    interface NkLoading {
    }
    interface NkProMintButton {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
        /**
          * Public Key
         */
        "publicKey": string;
        "unique"?: boolean;
    }
}
declare global {
    interface HTMLNkConnectWalletButtonElement extends Components.NkConnectWalletButton, HTMLStencilElement {
    }
    var HTMLNkConnectWalletButtonElement: {
        prototype: HTMLNkConnectWalletButtonElement;
        new (): HTMLNkConnectWalletButtonElement;
    };
    interface HTMLNkDialogElement extends Components.NkDialog, HTMLStencilElement {
    }
    var HTMLNkDialogElement: {
        prototype: HTMLNkDialogElement;
        new (): HTMLNkDialogElement;
    };
    interface HTMLNkDiamondElement extends Components.NkDiamond, HTMLStencilElement {
    }
    var HTMLNkDiamondElement: {
        prototype: HTMLNkDiamondElement;
        new (): HTMLNkDiamondElement;
    };
    interface HTMLNkDropMintButtonElement extends Components.NkDropMintButton, HTMLStencilElement {
    }
    var HTMLNkDropMintButtonElement: {
        prototype: HTMLNkDropMintButtonElement;
        new (): HTMLNkDropMintButtonElement;
    };
    interface HTMLNkDropMintCrossmintButtonElement extends Components.NkDropMintCrossmintButton, HTMLStencilElement {
    }
    var HTMLNkDropMintCrossmintButtonElement: {
        prototype: HTMLNkDropMintCrossmintButtonElement;
        new (): HTMLNkDropMintCrossmintButtonElement;
    };
    interface HTMLNkDropMintWinterButtonElement extends Components.NkDropMintWinterButton, HTMLStencilElement {
    }
    var HTMLNkDropMintWinterButtonElement: {
        prototype: HTMLNkDropMintWinterButtonElement;
        new (): HTMLNkDropMintWinterButtonElement;
    };
    interface HTMLNkDropPriceTextElement extends Components.NkDropPriceText, HTMLStencilElement {
    }
    var HTMLNkDropPriceTextElement: {
        prototype: HTMLNkDropPriceTextElement;
        new (): HTMLNkDropPriceTextElement;
    };
    interface HTMLNkDropSupplyTextElement extends Components.NkDropSupplyText, HTMLStencilElement {
    }
    var HTMLNkDropSupplyTextElement: {
        prototype: HTMLNkDropSupplyTextElement;
        new (): HTMLNkDropSupplyTextElement;
    };
    interface HTMLNkEditionMintButtonElement extends Components.NkEditionMintButton, HTMLStencilElement {
    }
    var HTMLNkEditionMintButtonElement: {
        prototype: HTMLNkEditionMintButtonElement;
        new (): HTMLNkEditionMintButtonElement;
    };
    interface HTMLNkEditionMintCrossmintButtonElement extends Components.NkEditionMintCrossmintButton, HTMLStencilElement {
    }
    var HTMLNkEditionMintCrossmintButtonElement: {
        prototype: HTMLNkEditionMintCrossmintButtonElement;
        new (): HTMLNkEditionMintCrossmintButtonElement;
    };
    interface HTMLNkEditionPriceTextElement extends Components.NkEditionPriceText, HTMLStencilElement {
    }
    var HTMLNkEditionPriceTextElement: {
        prototype: HTMLNkEditionPriceTextElement;
        new (): HTMLNkEditionPriceTextElement;
    };
    interface HTMLNkEditionSupplyTextElement extends Components.NkEditionSupplyText, HTMLStencilElement {
    }
    var HTMLNkEditionSupplyTextElement: {
        prototype: HTMLNkEditionSupplyTextElement;
        new (): HTMLNkEditionSupplyTextElement;
    };
    interface HTMLNkIsConnectedElement extends Components.NkIsConnected, HTMLStencilElement {
    }
    var HTMLNkIsConnectedElement: {
        prototype: HTMLNkIsConnectedElement;
        new (): HTMLNkIsConnectedElement;
    };
    interface HTMLNkIsHolderElement extends Components.NkIsHolder, HTMLStencilElement {
    }
    var HTMLNkIsHolderElement: {
        prototype: HTMLNkIsHolderElement;
        new (): HTMLNkIsHolderElement;
    };
    interface HTMLNkIsNotConnectedElement extends Components.NkIsNotConnected, HTMLStencilElement {
    }
    var HTMLNkIsNotConnectedElement: {
        prototype: HTMLNkIsNotConnectedElement;
        new (): HTMLNkIsNotConnectedElement;
    };
    interface HTMLNkLoadingElement extends Components.NkLoading, HTMLStencilElement {
    }
    var HTMLNkLoadingElement: {
        prototype: HTMLNkLoadingElement;
        new (): HTMLNkLoadingElement;
    };
    interface HTMLNkProMintButtonElement extends Components.NkProMintButton, HTMLStencilElement {
    }
    var HTMLNkProMintButtonElement: {
        prototype: HTMLNkProMintButtonElement;
        new (): HTMLNkProMintButtonElement;
    };
    interface HTMLElementTagNameMap {
        "nk-connect-wallet-button": HTMLNkConnectWalletButtonElement;
        "nk-dialog": HTMLNkDialogElement;
        "nk-diamond": HTMLNkDiamondElement;
        "nk-drop-mint-button": HTMLNkDropMintButtonElement;
        "nk-drop-mint-crossmint-button": HTMLNkDropMintCrossmintButtonElement;
        "nk-drop-mint-winter-button": HTMLNkDropMintWinterButtonElement;
        "nk-drop-price-text": HTMLNkDropPriceTextElement;
        "nk-drop-supply-text": HTMLNkDropSupplyTextElement;
        "nk-edition-mint-button": HTMLNkEditionMintButtonElement;
        "nk-edition-mint-crossmint-button": HTMLNkEditionMintCrossmintButtonElement;
        "nk-edition-price-text": HTMLNkEditionPriceTextElement;
        "nk-edition-supply-text": HTMLNkEditionSupplyTextElement;
        "nk-is-connected": HTMLNkIsConnectedElement;
        "nk-is-holder": HTMLNkIsHolderElement;
        "nk-is-not-connected": HTMLNkIsNotConnectedElement;
        "nk-loading": HTMLNkLoadingElement;
        "nk-pro-mint-button": HTMLNkProMintButtonElement;
    }
}
declare namespace LocalJSX {
    interface NkConnectWalletButton {
    }
    interface NkDialog {
        "buttonText"?: string;
        "dialogTitle"?: string;
        "open"?: boolean;
    }
    interface NkDiamond {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
    }
    interface NkDropMintButton {
        /**
          * Image url for the success modal
         */
        "successImageUrl"?: string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage"?: string;
        /**
          * Align text on the success modal (default: left)
         */
        "successTextAlign"?: string;
        /**
          * Title on the success modal
         */
        "successTitle"?: string;
    }
    interface NkDropMintCrossmintButton {
        /**
          * Crossmint Collection Id
         */
        "collectionId": string;
        /**
          * Crossmint Project Id
         */
        "projectId": string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage"?: string;
        /**
          * Title on the success modal
         */
        "successTitle"?: string;
    }
    interface NkDropMintWinterButton {
        /**
          * Winter Project Id
         */
        "projectId": string;
        /**
          * Body message on the success modal
         */
        "successMessage"?: string;
        /**
          * Title on the success modal
         */
        "successTitle"?: string;
    }
    interface NkDropPriceText {
    }
    interface NkDropSupplyText {
    }
    interface NkEditionMintButton {
        /**
          * Edition ID
         */
        "editionId": number;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage"?: string;
        /**
          * Title on the success modal
         */
        "successTitle"?: string;
    }
    interface NkEditionMintCrossmintButton {
        /**
          * Crossmint Collection Id
         */
        "collectionId": string;
        /**
          * Edition Id
         */
        "editionId": number;
        /**
          * Crossmint Project Id
         */
        "projectId": string;
        /**
          * Link on the success modal
         */
        "successLink"?: string;
        /**
          * Link text on the success modal
         */
        "successLinkText"?: string;
        /**
          * Body message on the success modal
         */
        "successMessage"?: string;
        /**
          * Title on the success modal
         */
        "successTitle"?: string;
    }
    interface NkEditionPriceText {
        /**
          * Edition ID
         */
        "editionId": number;
    }
    interface NkEditionSupplyText {
        /**
          * Edition ID
         */
        "editionId": number;
    }
    interface NkIsConnected {
    }
    interface NkIsHolder {
        /**
          * Holding a specific Token ID
         */
        "tokenId"?: string;
    }
    interface NkIsNotConnected {
    }
    interface NkLoading {
    }
    interface NkProMintButton {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
        /**
          * Public Key
         */
        "publicKey": string;
        "unique"?: boolean;
    }
    interface IntrinsicElements {
        "nk-connect-wallet-button": NkConnectWalletButton;
        "nk-dialog": NkDialog;
        "nk-diamond": NkDiamond;
        "nk-drop-mint-button": NkDropMintButton;
        "nk-drop-mint-crossmint-button": NkDropMintCrossmintButton;
        "nk-drop-mint-winter-button": NkDropMintWinterButton;
        "nk-drop-price-text": NkDropPriceText;
        "nk-drop-supply-text": NkDropSupplyText;
        "nk-edition-mint-button": NkEditionMintButton;
        "nk-edition-mint-crossmint-button": NkEditionMintCrossmintButton;
        "nk-edition-price-text": NkEditionPriceText;
        "nk-edition-supply-text": NkEditionSupplyText;
        "nk-is-connected": NkIsConnected;
        "nk-is-holder": NkIsHolder;
        "nk-is-not-connected": NkIsNotConnected;
        "nk-loading": NkLoading;
        "nk-pro-mint-button": NkProMintButton;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "nk-connect-wallet-button": LocalJSX.NkConnectWalletButton & JSXBase.HTMLAttributes<HTMLNkConnectWalletButtonElement>;
            "nk-dialog": LocalJSX.NkDialog & JSXBase.HTMLAttributes<HTMLNkDialogElement>;
            "nk-diamond": LocalJSX.NkDiamond & JSXBase.HTMLAttributes<HTMLNkDiamondElement>;
            "nk-drop-mint-button": LocalJSX.NkDropMintButton & JSXBase.HTMLAttributes<HTMLNkDropMintButtonElement>;
            "nk-drop-mint-crossmint-button": LocalJSX.NkDropMintCrossmintButton & JSXBase.HTMLAttributes<HTMLNkDropMintCrossmintButtonElement>;
            "nk-drop-mint-winter-button": LocalJSX.NkDropMintWinterButton & JSXBase.HTMLAttributes<HTMLNkDropMintWinterButtonElement>;
            "nk-drop-price-text": LocalJSX.NkDropPriceText & JSXBase.HTMLAttributes<HTMLNkDropPriceTextElement>;
            "nk-drop-supply-text": LocalJSX.NkDropSupplyText & JSXBase.HTMLAttributes<HTMLNkDropSupplyTextElement>;
            "nk-edition-mint-button": LocalJSX.NkEditionMintButton & JSXBase.HTMLAttributes<HTMLNkEditionMintButtonElement>;
            "nk-edition-mint-crossmint-button": LocalJSX.NkEditionMintCrossmintButton & JSXBase.HTMLAttributes<HTMLNkEditionMintCrossmintButtonElement>;
            "nk-edition-price-text": LocalJSX.NkEditionPriceText & JSXBase.HTMLAttributes<HTMLNkEditionPriceTextElement>;
            "nk-edition-supply-text": LocalJSX.NkEditionSupplyText & JSXBase.HTMLAttributes<HTMLNkEditionSupplyTextElement>;
            "nk-is-connected": LocalJSX.NkIsConnected & JSXBase.HTMLAttributes<HTMLNkIsConnectedElement>;
            "nk-is-holder": LocalJSX.NkIsHolder & JSXBase.HTMLAttributes<HTMLNkIsHolderElement>;
            "nk-is-not-connected": LocalJSX.NkIsNotConnected & JSXBase.HTMLAttributes<HTMLNkIsNotConnectedElement>;
            "nk-loading": LocalJSX.NkLoading & JSXBase.HTMLAttributes<HTMLNkLoadingElement>;
            "nk-pro-mint-button": LocalJSX.NkProMintButton & JSXBase.HTMLAttributes<HTMLNkProMintButtonElement>;
        }
    }
}
