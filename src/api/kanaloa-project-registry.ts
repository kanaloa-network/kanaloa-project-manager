import { 
    AbstractProvider, Addressable, Contract, Signer 
} from "ethers";
import { KanaloaEthers, requireConnection } from "./kanaloa-ethers";

const projectDataStruct: string = 
    "address project, address deployer, int visibility, string description";
export const PROJECT_REGISTRY_ADDRESS: string = "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1";
export const PROJECT_REGISTRY_ABI = [
    "function newProject("
        + "string projectName, string abbreviation, "
        + "string description, int visibility) returns (address)",
    `event ProjectDeployed(${projectDataStruct})`,
    `function getALLTheProjects() view returns (tuple(${projectDataStruct})[])`
]

export interface ProjectConfigProps {
    projectName: string;
    abbreviation: string;
    description: string;
    visibility: number;
}

function getRegistryContract(provider: Signer | AbstractProvider): Contract {
    return new Contract(
        PROJECT_REGISTRY_ADDRESS, 
        PROJECT_REGISTRY_ABI, 
        provider
    )
}

export async function newProject(
    params: ProjectConfigProps, signer: Signer
): Promise<string | Addressable>  {
    const projectRegistry = getRegistryContract(signer);
    
    return await projectRegistry.newProject(
        params.projectName,
        params.abbreviation,
        params.description,
        params.visibility
    );
}

export async function getALLTheProjects(
    provider: AbstractProvider
): Promise<any[]> {
    const projectRegistry = getRegistryContract(provider);
    return await projectRegistry.getALLTheProjects();
}

export class ProjectRegistry {
    parent: KanaloaEthers;
    constructor(parent: KanaloaEthers) {
        this.parent = parent;
    }

    async getProjects() {
        return await getALLTheProjects(this.parent.wallet)
    }

    // Rework requireconnection
    //@requireConnection
    async newProject(projectParams: ProjectConfigProps) {
        return await newProject(projectParams, this.parent.signer!)
    }
}