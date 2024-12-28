import { LitElement } from "lit";
import { KanaForm, formCssCommon } from "../forms/forms";
import { property, state } from "lit/decorators.js";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ethers } from "ethers";
import { LionForm } from "@lion/form";
import { eventHandler, handlerSetup } from "../../utils/event-handler";

export type ModuleParams = { 
    name: string, 
    signature: string,
    customElement: string
};

export abstract class ModuleForm extends LitElement {
    static formAssociated = true;

    @property({ type: Boolean })
    declare enabled: boolean;

    constructor() {
        super();
        handlerSetup(this);
    }

    static get styles() {
        return formCssCommon;
    }

    get modelValue(): Record<string, any> | undefined {
        return this.kanaForm?.modelValue;
    }

    get kanaForm(): KanaForm | undefined {
        return this.shadowRoot?.querySelector("kana-form") || undefined;
    }
    
    @eventHandler("model-value-changed", { capture: true })
    modelUpdated() {
        if (
            this.kanaForm == null ||
            this.kanaForm.hasFeedbackFor.find((e) => e == "error")
        ) {
            return;
        }
        this.dispatchEvent(
            new CustomEvent(
                "payload-modified",
                { bubbles: true, composed: true }
            )
        );
    }

    setParent(ref: ModuleForm) {
        // Do nothing by default
    }

    @state()
    loadedRawData: ethers.BytesLike | undefined;
    load(rawData: ethers.BytesLike) {
        this.loadedRawData = rawData;
        const result = ethers.AbiCoder.defaultAbiCoder().decode(
            Array.from(this.initializerABI.values()),
            this.loadedRawData!
        );

        const data = this.formatHook(
            Array.from(this.initializerABI.keys())
                .map((v, i) => ({ [v]: result[i] }))
                .reduce(
                    // Efficiency was clearly not what I was worried about here
                    // At this stage I prefer to occupy my mind with more
                    // trascendental matters than programming. Like anime booba
                    (d, c) => ({ ...d, ...c }), {}
                )
        );

        Object.entries(data).forEach(([k, v]: [string, any]) => {
            const elem: LionForm | null | undefined = 
                this.shadowRoot?.querySelector(`[name=${k}]`);
            if (elem == null) {
                return;
            }
            elem.modelValue = v;
        });

        return data;
    }

    /*
     * Compare the given byteslike with the stored loadedRawData.
     * Returns false if they differ, or true if they are the same picture
     */
    asUpstream(local: ethers.BytesLike): boolean {
        return local == this.loadedRawData;
    }
    
    formatHook(d: Record<string, any>): Record<string, any> {
        return d;
    }

    abstract get moduleSignature(): string;
    abstract get initializerABI(): Map<string, string>;
    abstract compileModuleParameters(root: any): Promise<ModuleParameters | null>; 
}