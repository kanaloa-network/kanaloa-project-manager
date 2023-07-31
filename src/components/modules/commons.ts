import { LitElement, css } from "lit";
import { formCssCommon } from "../forms";

export type ModuleParams = { name: string, value: string, form: typeof LitElement };

export class ModuleForm extends LitElement {

    static get styles() {
        return formCssCommon;
    }
    
}