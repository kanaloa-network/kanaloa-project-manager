import { 
    AbstractProvider, Contract, Signer, ethers 
} from "ethers";
import { KanaloaEthers, requireConnection } from "./kanaloa-ethers";
import KanaloaAddressBook from "kanaloa-address-book.json";
import { ModuleOps, ModuleParameters } from "./kanaloa-project-registry";

export const PAYMENTS_PROCESSOR_ADDRESS: string = 
    KanaloaAddressBook["PaymentsProcessor"];
export const PAYMENTS_PROCESSOR_ABI = [
    "function getOperationCost("
        + "uint8 op, address target, bytes32 info, address token, address client"
    + ") view returns (uint256)",
    "function calculateNewContractInvoice(" 
        + "address target, tuple(bytes32, bytes)[] genesisModules, "
        + "address payment, address client" 
    + ") view returns (tuple(bool, uint256))",
    "function calculateModifyContractInvoice(" 
        + "address target, tuple(uint8, tuple(bytes32, bytes))[] moduleOperations, "
        + "address payment, address client" 
    + ") view returns (tuple(bool, uint256))",
]

export enum TaxableOperations {
    ENABLED = 0,
    NEW_PROJECT = 1,
    NEW_CONTRACT = 2,
    NEW_MODULE = 3,
    EDIT_CONTRACT = 4,
    EDIT_MODULE = 5
}

export interface TaxablePayload {
    target?: string,
    payload?: ModuleParameters[] | [ModuleOps, ModuleParameters][],
    token: string,
    client: string
}

function getPaymentsProcessorContract(
    provider: Signer | AbstractProvider
): Contract {
    return new Contract(
        PAYMENTS_PROCESSOR_ADDRESS,
        PAYMENTS_PROCESSOR_ABI, 
        provider
    )
}

export async function calculateInvoice(
    mode: TaxableOperations, params: TaxablePayload, wallet: AbstractProvider
): Promise<bigint | undefined>  {
    const paymentsProcessor = getPaymentsProcessorContract(wallet);
    const serialize = (mode == TaxableOperations.NEW_CONTRACT) ?
        (p: ModuleParameters) => 
            [p.moduleSignature, p.initParams] :
        (p: [ModuleOps, ModuleParameters]) => 
            [p[0], [p[1].moduleSignature, p[1].initParams]]
    const [success, cost]: [boolean, bigint] =
        (mode == TaxableOperations.NEW_PROJECT) ?
            [true, await paymentsProcessor.getOperationCost(
                TaxableOperations.NEW_PROJECT, 
                ethers.ZeroAddress, ethers.ZeroHash,
                params.token, params.client
            )] : await paymentsProcessor[
                    (mode == TaxableOperations.NEW_CONTRACT) ? 
                        "calculateNewContractInvoice"
                        : "calculateModifyContractInvoice"
            ](
                        params.target!,
                        params.payload!.map(serialize as any),
                        params.token,
                        params.client
            );

    return (success) ? cost : undefined;
}

export class PaymentsProcessor {
    parent: KanaloaEthers;
    constructor(parent: KanaloaEthers) {
        this.parent = parent;
    }

    async calculateInvoice(
        mode: TaxableOperations, params: TaxablePayload
    ): Promise<bigint | undefined> {
        return await calculateInvoice(mode, params, this.parent.wallet);
    }

    async requestAllowance(
        amount: bigint, payment: string = KanaloaAddressBook["KANA"]
    ): Promise<boolean> {
        const token: Contract = new Contract(
            payment, [ 
                "function allowance(address owner, address spender) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)"
            ], (await this.parent.signer)!
        );

        const allowance: bigint = 
            await token.allowance(
                await (await this.parent.signer)!.getAddress(), 
                PAYMENTS_PROCESSOR_ADDRESS
            );

        if (allowance < amount) {
            try {
                await (
                    await token.approve(PAYMENTS_PROCESSOR_ADDRESS, amount)
                ).wait()
            } catch (err) {
                return false;
            }
        }
            
        return true;
    }

}