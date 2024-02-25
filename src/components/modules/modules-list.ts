import { ERC20_FORM_TAG, ERC20Form } from "./erc20-form";
import { ERC20_MINT_BURN_FORM_TAG, ERC20MintBurnForm } from "./plugins/erc20/erc20-mint-burn-form";
import { ModuleParams } from "./commons";

export const BASIC_MODULES = [
    { 
        name: "ERC20", 
        value: "erc20", 
        signature: ERC20Form.moduleSignature, 
        customElement: ERC20_FORM_TAG 
    },
    //{ name: "ERC721", value: "erc721", customElement: ERC20_FORM_TAG }
] as ModuleParams[];
export type BasicModule = (typeof BASIC_MODULES)[number]["value"]; 

export const PLUGIN_MODULES: Record<BasicModule, ModuleParams[]> = {
    "erc20": [
        { 
            name: "Mint/burn and variable supply", 
            value: "erc20_mint-burn",
            signature: ERC20MintBurnForm.moduleSignature,
            customElement: ERC20_MINT_BURN_FORM_TAG 
        },
    ]
};

export function getModulesFor(module: BasicModule): ModuleParams[] {
    return PLUGIN_MODULES[module] || [];
}

export const getAllModules: () => ModuleParams[] = () => [
     ...BASIC_MODULES,
     ...Object.values(PLUGIN_MODULES).flatMap((p) => p)
]