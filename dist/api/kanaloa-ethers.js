import { BrowserProvider, ethers } from "ethers";
import { ProjectRegistry } from "./kanaloa-project-registry";
export function requireConnection(target, propertyKey, descriptor) {
    if (typeof descriptor.value != "function"
        || target.readOnly) {
        return descriptor;
    }
    let original = descriptor.value;
    descriptor.value =
        async (...args) => {
            if (GlobalKanaloaEthers.signer != undefined) {
                // We are already connected
                return original.apply(target, args);
            }
            // We have a BrowserProvider, but the wallet is not 
            // connected yet. Request permission from the user
            return GlobalKanaloaEthers
                .requestSigner()
                .then(() => original.apply(target, args));
            // TODO: catch and show some error message to the user
        };
    return descriptor;
}
const walletChangedEvent = new CustomEvent("wallet-changed");
function requestUpdateSubscribers(ev) {
    ev.target.requestUpdate();
}
export class KanaloaEthers {
    subscribedElements = new Set();
    projectRegistry;
    wallet;
    _signer;
    get signer() {
        return this._signer;
    }
    set signer(value) {
        this._signer = value;
        if (value == undefined) {
            return;
        }
        let address = value.getAddress()
            .then((add) => {
            this._address = add;
            this.subscribedElements.forEach((elem) => elem.dispatchEvent(walletChangedEvent));
        });
    }
    _address;
    get address() {
        return this._address;
    }
    _avatar;
    get avatar() {
        return this._avatar;
    }
    constructor() {
        this.projectRegistry = new ProjectRegistry(this);
        if (window.ethereum != null) {
            this.wallet = new ethers.BrowserProvider(window.ethereum);
            this.wallet
                .listAccounts()
                .then(
            // if this returns results, we have permission to connect
            () => {
                return this.wallet.getSigner();
            })
                .then((acc) => {
                this.signer = acc;
            });
            // TODO: perform event hooking here
        }
        else {
            // Defaults to connecting to Ethereum mainnet via INFURA or
            // something like that, I dunno.
            this.wallet = ethers.getDefaultProvider("mainnet");
        }
    }
    async requestSigner() {
        if (this.readOnly) {
            throw new Error("KanaloaEthers: attempting to connect to read-only provider");
        }
        return this.wallet
            .getSigner(0)
            .then((acc) => {
            this.signer = acc;
            return acc;
        });
    }
    subscribe(elem) {
        elem.addEventListener(walletChangedEvent.type, requestUpdateSubscribers);
        this.subscribedElements.add(elem);
    }
    unsubscribe(elem) {
        elem.removeEventListener(walletChangedEvent.type, requestUpdateSubscribers);
        this.subscribedElements.delete(elem);
    }
    get readOnly() {
        return !(this.wallet instanceof BrowserProvider);
    }
}
export const GlobalKanaloaEthers = new KanaloaEthers();
//# sourceMappingURL=kanaloa-ethers.js.map