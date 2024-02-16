import { 
    AbstractProvider, Addressable, Contract, Signer, ethers 
} from "ethers";
import { KanaloaEthers, requireConnection } from "./kanaloa-ethers";
import KanaloaAddressBook from "kanaloa-address-book.json";

const projectDataStruct: string = 
    "address project, address deployer, string description";
export const PROJECT_REGISTRY_ADDRESS: string = 
    KanaloaAddressBook["KanaloaProjectRegistry"];
export const KANA_ADDRESS: string = KanaloaAddressBook["KANA"];
export const PROJECT_REGISTRY_ABI = [
    "function newProject("
        + "string projectName, string abbreviation, "
        + "string description, address payment"
    + ") returns (address)",
    `event ProjectDeployed(${projectDataStruct})`,
    `function getProject(string name) view returns (tuple(${projectDataStruct}))`,
    `function newContract(`
        + `string name, string project, `
        + `tuple(bytes32, bytes)[] genesisModules, address payment`
    + `) returns (address)`
]


export interface ProjectConfigProps {
    projectName: string;
    abbreviation: string;
    description: string;
}

export interface ProjectData {
    address: string,
    project: string;
    deployer: string;
    description: string;
}

export interface ModuleParameters {
    moduleSignature: string,
    initParams: string
}

export interface NewContractConfigProps {
    name: string,
    project: string,
    genesisModules: ModuleParameters[],
    payment: string
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
    
    const tx = await (
        await projectRegistry.newProject(
            params.projectName,
            params.abbreviation,
            params.description,
            KANA_ADDRESS
        )
    ).wait();

    return (await projectRegistry.getProject(params.projectName)).project;
}

export async function newContract(
    params: NewContractConfigProps,
    signer: Signer
): Promise<string | Addressable> {
    const projectRegistry = getRegistryContract(signer);

    const tx = await (
        await projectRegistry.newContract(
            params.name,
            params.project,
            params.genesisModules.map(
                (m) => [ m.moduleSignature, m.initParams ]
            ),
            KanaloaAddressBook.KANA
        )
    ).wait();

    return tx;
}

export async function getProjects(
    provider: AbstractProvider
): Promise<any[]> {
    const importedProjects: ProjectData[] = 
        JSON.parse(localStorage.getItem("kanaloa.imported_projects") || "[]");

    return importedProjects;
}

export class ProjectRegistry {
    parent: KanaloaEthers;
    constructor(parent: KanaloaEthers) {
        this.parent = parent;
    }

    async getProjects(): Promise<ProjectData[]> {
        return await getProjects(this.parent.wallet);
    }

    // Rework requireconnection
    //@requireConnection
    async newProject(projectParams: ProjectConfigProps) {
        const project: string | Addressable = await newProject(
            projectParams, this.parent.signer!
        );

        localStorage.setItem(
            "kanaloa.imported_projects", 
            JSON.stringify(
                [ 
                    ...(await getProjects(this.parent.wallet)),
                    {
                        address: project,
                        project: projectParams.projectName,
                        deployer: await this.parent.signer!.getAddress(),
                        description: projectParams.description
                    } as ProjectData
                ]
            )
        );

        return project;
    }

    async newContract(contractParams: NewContractConfigProps) {
        await newContract(contractParams, this.parent.signer!);

    }
}