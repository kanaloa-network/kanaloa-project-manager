import { 
    AbstractProvider, Eip1193Provider, BrowserProvider, ethers, Signer, AddressLike 
} from "ethers";
import { AvatarResult } from "ethers/types/providers/ens-resolver";
import { LitElement } from "lit";
import { ProjectRegistry } from "./kanaloa-project-registry";

declare module window {
    export const ethereum: Eip1193Provider | undefined;
}

export function requireConnection(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    if (
        typeof descriptor.value != "function"
        || target.readOnly
    ) {
        return descriptor;
    }


    let original = descriptor.value;
    descriptor.value =
        async (...args: unknown[]): Promise<unknown> => {
            if (GlobalKanaloaEthers.signer != undefined) {
                // We are already connected
                return original.apply(target, args)
            }

            // We have a BrowserProvider, but the wallet is not 
            // connected yet. Request permission from the user
            return GlobalKanaloaEthers
                .requestSigner()
                .then(
                    () => original.apply(target, args)
                )
            // TODO: catch and show some error message to the user
        }
    
        return descriptor;
}

const walletChangedEvent: CustomEvent = 
    new CustomEvent("wallet-changed");

function requestUpdateSubscribers(ev: Event) {
    (ev.target as LitElement).requestUpdate();
}

export class KanaloaEthers {
    private subscribedElements: Set<LitElement> = new Set<LitElement>();

    projectRegistry: ProjectRegistry;

    wallet: BrowserProvider | AbstractProvider;
    _signer?: Signer;
    get signer(): Signer | undefined {
        return this._signer;
    }
    set signer(value: Signer | undefined) {
        this._signer = value;

        if (value == undefined) {
            return;
        }

        let address = 
            value.getAddress()
                .then((add) => {
                    this._address = add;
                    this.subscribedElements.forEach(
                        (elem) => elem.dispatchEvent(walletChangedEvent)
                     );
                    }
                )            
    }
    
    _address?: AddressLike;
    get address(): AddressLike | undefined {
        return this._address;
    }

    _avatar?: AvatarResult;
    get avatar(): AvatarResult | undefined {
        return this._avatar;
    }

    constructor() {
        this.projectRegistry = new ProjectRegistry(this);
        
        if (window.ethereum != null) {
            this.wallet = new ethers.BrowserProvider(window.ethereum);

            (this.wallet as BrowserProvider)
                .listAccounts()
                .then(
                    // if this returns results, we have permission to connect
                    () => {
                        return (this.wallet as BrowserProvider).getSigner();
                    }
                )
                .then(
                    (acc) => {
                        this.signer = acc;
                    }
                );

            // TODO: perform event hooking here
        } else {
            // Defaults to connecting to Ethereum mainnet via INFURA or
            // something like that, I dunno.
            this.wallet = ethers.getDefaultProvider("mainnet");
        }
    }

    async requestSigner(): Promise<Signer> {
        if (this.readOnly) {
            throw new Error(
                "KanaloaEthers: attempting to connect to read-only provider"
            );
        }

        return (this.wallet as BrowserProvider)
            .getSigner(0)
            .then(
                (acc: Signer) => {
                    this.signer = acc;
                    return acc;
                }
            )
    }

    subscribe(elem: LitElement) {
        elem.addEventListener(walletChangedEvent.type, requestUpdateSubscribers);
        this.subscribedElements.add(elem);
    }

    unsubscribe(elem: LitElement) {
        elem.removeEventListener(walletChangedEvent.type, requestUpdateSubscribers);
        this.subscribedElements.delete(elem);
    }

    get readOnly() {
        return !(this.wallet instanceof BrowserProvider);
    }
}

export const GlobalKanaloaEthers = new KanaloaEthers();