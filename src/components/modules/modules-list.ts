import { ERC20_FORM_TAG, ERC20Form } from "./erc20-form";
import { ERC721_FORM_TAG, ERC721Form } from "./erc721-form";
import { ERC20_MINT_BURN_FORM_TAG, ERC20MintBurnForm } from "./plugins/erc20/erc20-mint-burn-form";
import { ERC721_MINT_FORM_TAG, ERC721MintForm } from "./plugins/erc721/erc721-mint-form";
import { ModuleParams } from "./commons";

export const BASIC_MODULES = [
    { 
        name: "ERC20", 
        signature: ERC20Form.moduleSignature, 
        customElement: ERC20_FORM_TAG 
    },
    {
        name: "ERC721",
        signature: ERC721Form.moduleSignature,
        customElement: ERC721_FORM_TAG
    }
] as ModuleParams[];
export type BasicModule = (typeof BASIC_MODULES)[number]["signature"]; 

export const PLUGIN_MODULES: Record<BasicModule, ModuleParams[]> = {
    [ERC20Form.moduleSignature]: [
        { 
            name: "Mint/burn and variable supply", 
            signature: ERC20MintBurnForm.moduleSignature,
            customElement: ERC20_MINT_BURN_FORM_TAG 
        },
    ],
    [ERC721Form.moduleSignature]: [
        { 
            name: "Mint NFT", 
            signature: ERC721MintForm.moduleSignature,
            customElement: ERC721_MINT_FORM_TAG 
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