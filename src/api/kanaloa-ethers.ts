import { 
    AbstractProvider, Eip1193Provider, BrowserProvider, 
    ethers, Signer, AddressLike, EnsResolver
} from "ethers";
import { AvatarResult } from "ethers/lib.commonjs/providers/ens-resolver";
import { LitElement } from "lit";
import { ProjectRegistry } from "./kanaloa-project-registry";
import { PaymentsProcessor } from "./payments-processor";
import KanaloaAddressBook from "kanaloa-address-book.json";

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
            if (KanaloaAPI.signer != undefined) {
                // We are already connected
                return original.apply(target, args)
            }

            // We have a BrowserProvider, but the wallet is not 
            // connected yet. Request permission from the user
            return KanaloaAPI
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

    readonly KANA_TOKEN = KanaloaAddressBook.KANA;

    projectRegistry: ProjectRegistry;
    paymentsProcessor: PaymentsProcessor;

    wallet: BrowserProvider | AbstractProvider;
    private _signer: Promise<Signer | undefined>;
    get signer(): Promise<Signer | undefined> {
        return this._signer;
    }
    set signer(value: Promise<Signer | undefined>) {
        this._signer = value;

        if (value == undefined) {
            return;
        }

        value.then(() => {
            this.subscribedElements.forEach(
                (elem) => elem.dispatchEvent(walletChangedEvent)
            );
        });       
    }

    _avatar?: AvatarResult;
    get avatar(): AvatarResult | undefined {
        return this._avatar;
    }

    constructor() {
        this.projectRegistry = new ProjectRegistry(this);
        this.paymentsProcessor = new PaymentsProcessor(this);
        
        if (window.ethereum != null) {
            this.wallet = new ethers.BrowserProvider(window.ethereum);

            this._signer = 
                (this.wallet as BrowserProvider)
                    .listAccounts()
                    .then(
                        // if this returns results, we have permission to connect
                        () => {
                            return (this.wallet as BrowserProvider).getSigner();
                        }
                ) as Promise<Signer | undefined>;
            this.signer = this._signer;

            // TODO: perform event hooking here
        } else {
            // Defaults to connecting to Ethereum mainnet via INFURA or
            // something like that, I dunno.
            this.wallet = ethers.getDefaultProvider("mainnet");
            this._signer = new Promise((res) => res(undefined));
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
                    return acc;
                }
            );
    }

    async switchChain(): Promise<undefined> {
        const chainId = "0xa86a";

        return (this.wallet as BrowserProvider).send("wallet_switchEthereumChain", [{ chainId: chainId }])
            .catch(error => {
                if (error !== undefined && error.message.includes("Unrecognized chain ID")) {
                    return this.addChain();
                }
            });
    }

    async addChain() : Promise<undefined> {
        const chain = {
            chainId: "0xa86a",
            chainName: "Avalanche",
            nativeCurrency: {
                name: "AVAX Token",
                symbol: "AVAX",
                decimals: 18
            },
            rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://snowtrace.io"],
        };

        return (this.wallet as BrowserProvider).send("wallet_addEthereumChain", [chain]);
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

export const KanaloaAPI = new KanaloaEthers();