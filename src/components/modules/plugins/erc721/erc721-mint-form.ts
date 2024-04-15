import { customElement } from "lit/decorators.js";
import { ModuleForm } from "../../commons";
import { html } from "lit";
import { KanaForm, Required, maxNumberPreprocessor } from "../../../forms/forms";
import { MinNumber, MaxNumber } from "@lion/form-core";
import { MaxUint256, ethers } from "ethers";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ERC721Form } from "../../erc721-form";
import { KanaloaAPI } from "../../../../api/kanaloa-ethers";

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
                    await (await KanaloaAPI.signer)!.getAddress(),
					model.tokenId
                ]
            )
        };
    }

	async submitHandler(ev: Event) {
		// TODO
	}

    render() {
        return html`
            <hr>
            <h3>Basic mint for ERC721</h3>
            <kana-form @submit="${this.submitHandler}">
				<form @submit=${(ev: Event) => ev.preventDefault()}>
                    <div class="form-row">
                        <span>
                            <label>Token ID</label>
                            <br/>
                            <kana-input-amount
                                label-sr-only="Token ID"
                                placeholder="0"
                                name="tokenId"
                                .validators="${[
									new MinNumber(0),
                                    new MaxNumber(MaxUint256),
									new Required()
                                ]}"
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                ?readonly=${this.loadedRawData != null}
                            ></kana-input-amount>
                        </span>
                    </div>
					<div class="form-row">
						<kana-button-submit>Mint</kana-button-submit>
					</div>
				</form>
            </kana-form>
        `;
    }
    
}