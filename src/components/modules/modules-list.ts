import { ERC20_FORM_TAG } from "./erc20-form";
import { ModuleParams } from "./commons";

export const getBasicModules: () => ModuleParams[] = () => [
    { name: "ERC20", value: "erc20", customElement: ERC20_FORM_TAG },
    { name: "ERC721", value: "erc721", customElement: ERC20_FORM_TAG }
]

export const getAllModules: () => ModuleParams[] = () => [
    ...getBasicModules()
]