import { LitElement } from "lit";
import { KanaForm, formCssCommon } from "../forms/forms";
import { property } from "lit/decorators.js";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { Contract, ethers } from "ethers";
import { LionForm } from "@lion/form";
 // Why does this need a rel path?
import { KanaloaAPI } from "../../api/kanaloa-ethers";

export type ModuleParams = { 
    name: string, 
    value: string,
    signature: string,
    customElement: string
};

export abstract class ModuleForm extends LitElement {
    static formAssociated = true;

    @property({ type: Boolean })
    declare enabled: boolean;

    constructor() {
        super();
    }

    static get styles() {
        return formCssCommon;
    }

    get modelValue(): Record<string, string> {
        return (this.shadowRoot?.querySelector("kana-form") as KanaForm).modelValue;
    }

    get kanaForm(): KanaForm {
        return this.shadowRoot!.querySelector("kana-form")!;
    }
    
    setParent(ref: ModuleForm) {
        // Do nothing by default
    }

    loadedRawData: ethers.BytesLike | undefined;
    async load(from: ethers.AddressLike) {

        this.kanaForm.disabled = true;
        
        const module: Contract = new Contract(
            (await from) as string, [ 
                "function peek(bytes32 signature) view returns (bytes memory)",
            ], KanaloaAPI.wallet
        );

        this.loadedRawData = await module.peek(this.moduleSignature);
        const result = ethers.AbiCoder.defaultAbiCoder().decode(
            Array.from(this.initializerABI.values()),
            this.loadedRawData!
        );

        Array.from(this.initializerABI.keys()).forEach(
            (k: string, i: number) => {
                const elem: LionForm | null | undefined = 
                    this.shadowRoot?.querySelector(`[name=${k}]`);
                if (elem == null) {
                    return;
                }
                elem.modelValue = result[i];
            }
        );

        this.kanaForm.disabled = false;
    }

    abstract get moduleSignature(): string;
    abstract get initializerABI(): Map<string, string>;
    abstract compileModuleParameters(root: any): Promise<ModuleParameters | null>; 
    
}