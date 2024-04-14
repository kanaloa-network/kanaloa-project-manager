import { customElement } from "lit/decorators.js";
import { ModuleForm } from "../../commons";
import { html } from "lit";
import { KanaForm, Required, maxLengthPreprocessor } from "../../../forms/forms";
import { EqualsLength, Pattern } from "@lion/form-core";
import { ethers } from "ethers";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ERC721Form } from "../../erc721-form";

export const ERC721_MINT_FORM_TAG = 'erc721_mint-test'; // erc721_mint is not working
@customElement(ERC721_MINT_FORM_TAG)
export class ERC721MintForm extends ModuleForm {
    static formAssociated = true;

    constructor() {
        super();
    }

    static get moduleSignature(): string {
        return "0x5888a10baa117fa10229da1caf1f6221929b8728f7de5dc21a2a08a9df35c3a2";
    }

    get moduleSignature(): string {
        return ERC721MintForm.moduleSignature
    }
    
    get initializerABI(): Map<string, string> {
        return new Map([
            ["to", "address"],
            ["tokenId", "uint256"],
        ]);
    }
        
    public erc721Form: ERC721Form | null = null; 
    setParent(ref: ModuleForm): void {
        this.erc721Form = ref as ERC721Form;
    }

    formatHook(d: Record<string, any>): Record<string, any> {
        return d;
    }
    
    async compileModuleParameters(root: any): Promise<ModuleParameters | null> {
        const form = this.kanaForm;

        if (form == null) {
            return null;
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
            return null;
        }

        const model: any = form.modelValue;
        return {
            moduleSignature: this.moduleSignature,
            initParams: ethers.AbiCoder.defaultAbiCoder().encode(
                Array.from(this.initializerABI.values()),
                [ 
                    model.toAddress,
					1n
                ]
            )
        };
    }

    render() {
        return html`
            <hr>
            <h3>Basic mint for ERC721</h3>
            <kana-form>
                <form>
                    <div class="form-row">
                        <span>
                            <label>Receiver Address</label>
                            <br/>
                            <kana-input
                                label-sr-only="Receiver Address"
                                placeholder="0x0000000000000000000000000000000000000000"
                                name="toAddress"
                                .validators="${[
									new EqualsLength(40),
									new Pattern(/0x[A-Fa-f0-9]{38}/),
									new Required()
                                ]}"
                                .preprocessor=${maxLengthPreprocessor(40)}
                                ?readonly=${this.loadedRawData != null}
                            ></kana-input>
                        </span>
                    </div>
            </kana-form>

        `;
    }
    
}