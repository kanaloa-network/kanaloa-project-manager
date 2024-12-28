import { customElement } from "lit/decorators.js";
import { ModuleForm } from "../../commons";
import { css, html } from "lit";
import { KanaForm, KanaInputAmount, Required, maxNumberPreprocessor } from "../../../forms/forms";
import { MinNumber, MaxNumber, Validator } from "@lion/form-core";
import { Contract, MaxUint256, ethers } from "ethers";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ERC20Form } from "../../erc20-form";
import { ContractPage } from "src/pages/contract-page";
import { KanaloaAPI } from "../../../../api/kanaloa-ethers";

class EqualOrMoreThan extends Validator {
    static get validatorName() {
        return 'EqualOrMoreThan';
    }
  
    execute(modelValue: any, small: ERC20Form) {
        try {
            return !(BigInt(modelValue) >= BigInt(small.modelValue?._supply))
        } catch (err) {
            return true;
        }
    }
  }

export const ERC20_MINT_BURN_FORM_TAG = 'erc20_mint-burn';
@customElement(ERC20_MINT_BURN_FORM_TAG)
export class ERC20MintBurnForm extends ModuleForm {
    static formAssociated = true;

    static override get styles() {
        return [
            ...super.styles,
            css`
                kana-button-submit {
                    width: 100%;
                }
            `
        ];
    }

    constructor() {
        super();
    }

    static get moduleSignature(): string {
        return "0x264bdde0a47811926d745d16b77330d8c0af6d379e622ae352a063a311402a23";
    }

    get moduleSignature(): string {
        return ERC20MintBurnForm.moduleSignature
    }
    
    get initializerABI(): Map<string, string> {
        return new Map([
            ["maxSupply", "uint256"], 
        ]);
    }
        
    public erc20Form: ERC20Form | null = null; 
    setParent(ref: ModuleForm): void {
        this.erc20Form = ref as ERC20Form;
    }

    formatHook(d: Record<string, any>): Record<string, any> {
        if (this.erc20Form == null) {
            return d;
        }
        d["maxSupply"] = 
            Number( // Ensures Lion will not cry with its validator
                d["maxSupply"] / 10n ** BigInt(
                    this.erc20Form.modelValue?._decimals || 18
                )
            );
        return d;
    }
    
    protected isValid(): boolean {
        const form = this.kanaForm;

        if (form == null) {
            return false;
        }

        form.formElements.forEach(
            // Whomst, in their right mind, caches validation results? 
            (el) => el.validate({ clearCurrentResult: true })
        );
        form.validate({ clearCurrentResult: true });
        if ((form as KanaForm).hasFeedbackFor.includes('error')) {
            const firstFormElWithError = (form as KanaForm).formElements.find(
                    (el: any) => el.hasFeedbackFor.includes('error'),
            );
            firstFormElWithError.focus();
            return false;
        }

        return true;
    }

    async compileModuleParameters(root: any): Promise<ModuleParameters | null> {
        const form = this.kanaForm;

        if (form == null) {
            return null;
        }

        if (this.isValid() == false) {
            return null;
        }

        const model: any = form.modelValue;
        return {
            moduleSignature: this.moduleSignature,
            initParams: ethers.AbiCoder.defaultAbiCoder().encode(
                Array.from(this.initializerABI.values()),
                [ 
                    BigInt(
                        model.maxSupply
                    ) * 10n ** BigInt(
                        root[ERC20Form.moduleSignature]?._decimals
                    )
                ]
            )
        };
    }

    async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.isValid() == false) {
            return;
        }

        const action = (ev.target as HTMLElement).getAttribute("value") || "";
        const signer = await KanaloaAPI.signer;
        const contract = 
            new Contract(
                ((this.getRootNode() as ShadowRoot).host as ContractPage).contract!,
                [ 
                    `function ${action}(` +
                        `${(action == "mint") ? "address to, " : ""}` +
                        `uint256 amount` +
                    `)` 
                ],
                signer
            );
        const params = [];
        const amount = (this.modelValue as any)[`${action}Amount`];

        if (amount == null || amount == "" || amount == 0) {
            // TODO: give some warning about this being required
            return;
        } 

        if (action == "mint") {
            params.push(await signer?.getAddress())
        }
        params.push(amount);
        
        // TODO: block interaction on submit
        // TODO: unlock and clear on return
        await contract[action](...params);
    }

    render() {
        const isInstalled = 
            ((this.getRootNode() as ShadowRoot).host as ContractPage)
                .modulesList
                .value?.onchainModules[this.moduleSignature] != null;
        return html`
            <hr>
            <h3>Basic mint and burn for ERC20</h3>
            <kana-form @submit="${(ev: Event) => ev.preventDefault()}">
                <form @submit=${(ev: Event) => ev.preventDefault()}>
                    <div class="form-row">
                        <span>
                            <label>Maximum supply</label>
                            <br/>
                            <kana-input-amount
                                label-sr-only="Maximum supply"
                                placeholder="21000000"
                                name="maxSupply"
                                .validators="${[
                                    new MinNumber(1),
                                    new MaxNumber(MaxUint256),
                                    new Required(),
                                    new EqualOrMoreThan(
                                        this.erc20Form,
                                        { 
                                            getMessage: 
                                                () => "Maximum supply cannot be lower than total supply" 
                                        }
                                    )
                                ]}"
                                .modelValue=${21000000}
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                ?readonly=${this.loadedRawData != null}
                            ></kana-input-amount>
                        </span>
                    </div>
                    <div class="form-row">
                        <span>
                            <label>Mint amount</label>
                            <br>
                            <kana-input-amount
                                label-sr-only="Mint amount"
                                placeholder="100000"
                                name="mintAmount"
                                .validators="${[
                                    new MinNumber(1),
                                    new MaxNumber(MaxUint256),
                                    // new EqualOrMoreThan(
                                    //     this.erc20Form, 
                                    //     // TODO: fix this so it checks total supply + mint <= max supply
                                    //     { 
                                    //         getMessage: 
                                    //             () => "Mint amount cannot be larger than maximum supply" 
                                    //     }
                                    // )
                                ]}"
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                ?readonly=${!isInstalled}
                            ></kana-input-amount>
                            <br>
                            <kana-button-submit
                                @click=${this.actionHandler}
                                name="supplyAction"
                                value="mint"
                                ?disabled=${!isInstalled}
                            >
                                Mint
                            </kana-button-submit>
                        </span>
                        <span>
                            <label>Burn amount</label>
                            <br>
                            <kana-input-amount
                                label-sr-only="Burn amount"
                                placeholder="100000"
                                name="burnAmount"
                                .validators="${[
                                    new MinNumber(1),
                                    new MaxNumber(MaxUint256),
                                    // new EqualOrMoreThan(
                                    //     this.erc20Form, 
                                    //     // TODO: fix this so it checks total supply - burn >= 0
                                    //     { 
                                    //         getMessage: 
                                    //             () => "Burn amount cannot be larger than total supply" 
                                    //     }
                                    // )
                                ]}"
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                ?readonly=${!isInstalled}
                            ></kana-input-amount>
                            <br>
                            <kana-button-submit
                                @click=${this.actionHandler}
                                name="supplyAction"
                                value="burn"
                                ?disabled=${!isInstalled}
                            >
                                Burn
                            </kana-button-submit>
                        </span>
                    </div>
            </kana-form>

        `;
    }
    
}