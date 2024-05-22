import { customElement } from "lit/decorators.js";
import { ModuleForm } from "../../commons";
import { html } from "lit";
import { KanaForm, Required, maxNumberPreprocessor } from "../../../forms/forms";
import { MinNumber, MaxNumber, Validator } from "@lion/form-core";
import { Contract, MaxUint256, ethers } from "ethers";
import { ModuleParameters } from "src/api/kanaloa-project-registry";
import { ERC721Form } from "../../erc721-form";
import { KanaloaAPI } from "../../../../api/kanaloa-ethers";
import { ContractPage } from "src/pages/contract-page";

class NotMintedYet extends Validator {
    static get validatorName() {
        return 'NotMintedYet';
    }
  
    execute(modelValue: any) {
        try {
			// check if modelValue.tokenId is not minted yet

            return true;
        } catch (err) {
            return true;
        }
    }
}

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
        return new Map();
    }
        
    public erc721Form: ERC721Form | null = null; 
    setParent(ref: ModuleForm): void {
        this.erc721Form = ref as ERC721Form;
    }

    load(): Record<string, any> {
        return [];
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
                []
            )
        };
    }

	async actionHandler(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.isValid() == false) {
            return;
        }

        const signer = await KanaloaAPI.signer;
        const contract = 
            new Contract(
                ((this.getRootNode() as ShadowRoot).host as ContractPage).contract!,
                ["function mint(address to, uint256 tokenId)"],
                signer
            );
        const params = [];
        const tokenId = (this.modelValue as any)["tokenId"];

        if (tokenId === null || tokenId === "") {
            // TODO: give some warning about this being required
            return;
        } 

		params.push(await signer?.getAddress())
		params.push(tokenId);
        
        // TODO: block interaction on submit
        // TODO: unlock and clear on return
        await contract["mint"](...params);
    }

    render() {
        const isInstalled = 
            ((this.getRootNode() as ShadowRoot).host as ContractPage)
                .modulesList
                .value?.onchainModules[this.moduleSignature] != null;
                
        return html`
            <hr>
            <h3>Basic mint for ERC721</h3>
            <kana-form @submit="${(ev: Event) => ev.preventDefault()}">
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
									new NotMintedYet({ 
                                        getMessage: () => "This token ID is already minted, please try to mint another ID." 
                                    })
                                    // new Required() // it's not really required, at least in the usual sense
                                ]}"
                                .preprocessor=${maxNumberPreprocessor(MaxUint256)}
                                ?readonly=${!isInstalled}
                            ></kana-input-amount>
                        </span>
                    </div>
                    <div class="form-row">
                        <kana-button-submit @click=${this.actionHandler} ?disabled=${!isInstalled}>
                            Mint
                        </kana-button-submit>
                    </div>
                </form>
            </kana-form>
            ${
                (!isInstalled) ? 
                    html`
                        <div>
                            <small>
                                This module will be installed. 
                                Related functionality will be enabled
                                after the installation is completed.
                            </small>
                        </div>
                    ` : 
                    ""
            }
        `;
    }
}