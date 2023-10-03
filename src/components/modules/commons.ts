import { LitElement } from "lit";
import { formCssCommon } from "../forms/forms";

export type ModuleParams = { 
    name: string, 
    value: string, 
    customElement: string,
    instance?: ModuleForm 
};

export class ModuleForm extends LitElement {
    static formAssociated = true;


    constructor() {
        super();
    }

    static get styles() {
        return formCssCommon;
    }
    
}