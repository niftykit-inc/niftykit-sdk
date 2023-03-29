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
    interface NkDiamond {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
    }
    interface NkDropMintButton {
        "mint": () => Promise<void>;
    }
}
declare global {
    interface HTMLNkConnectWalletButtonElement extends Components.NkConnectWalletButton, HTMLStencilElement {
    }
    var HTMLNkConnectWalletButtonElement: {
        prototype: HTMLNkConnectWalletButtonElement;
        new (): HTMLNkConnectWalletButtonElement;
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
    interface HTMLElementTagNameMap {
        "nk-connect-wallet-button": HTMLNkConnectWalletButtonElement;
        "nk-diamond": HTMLNkDiamondElement;
        "nk-drop-mint-button": HTMLNkDropMintButtonElement;
    }
}
declare namespace LocalJSX {
    interface NkConnectWalletButton {
    }
    interface NkDiamond {
        /**
          * Collection ID
         */
        "collectionId": string;
        "isDev"?: boolean;
    }
    interface NkDropMintButton {
    }
    interface IntrinsicElements {
        "nk-connect-wallet-button": NkConnectWalletButton;
        "nk-diamond": NkDiamond;
        "nk-drop-mint-button": NkDropMintButton;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "nk-connect-wallet-button": LocalJSX.NkConnectWalletButton & JSXBase.HTMLAttributes<HTMLNkConnectWalletButtonElement>;
            "nk-diamond": LocalJSX.NkDiamond & JSXBase.HTMLAttributes<HTMLNkDiamondElement>;
            "nk-drop-mint-button": LocalJSX.NkDropMintButton & JSXBase.HTMLAttributes<HTMLNkDropMintButtonElement>;
        }
    }
}
