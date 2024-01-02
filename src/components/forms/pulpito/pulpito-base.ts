import { fallthrough, reflect, bindInitialAttrs } from "./utils/attribute-helpers";
import { eventHandler, handlerSetup } from "./utils/event-handler";

export type FieldValue =
  | string
  | string[]
  | { [key: string]: FieldValue }
  | null;

export type PreprocessingRule<T extends FieldValue> = (value: T) => T;
export type ValidationRule<T extends FieldValue> = 
  (value: T) => Promise<string | Element | undefined>;

export interface FieldSchema<T extends FieldValue> {
    type: string;
    preprocessing: Array<T>
    validation: Array<ValidationRule<T>>;
    defaultValue?: T;
    children: Record<string, FieldSchema<FieldValue>>;
}

export abstract class PulpitoBase extends HTMLElement {
    public inputElement: HTMLElement | undefined;
    private getInputElement(): HTMLElement {
      return this.inputElement!;
    }

    @reflect
    accessor name: string | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputElement)
    accessor disabled: boolean | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputElement)
    accessor readOnly: boolean | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputElement)
    accessor invalid: boolean | undefined;
    
    abstract accessor value: FieldValue;

    // This API looks like a mess
    static formAssociated = true;
    declare elementInternals: ElementInternals;

    static get observedAttributes(): Array<string> {
        return ["name", "disabled", "readOnly", "invalid"];
    }

    constructor() {
        super();
        this.elementInternals = this.attachInternals();
    
        this.attachShadow({ mode: "open" });
        
        handlerSetup(this);
    }

    @bindInitialAttrs
    connectedCallback() {
      this.shadowRoot!.innerHTML = "";
      this.shadowRoot!.append(this.inputElement!);
      this.dispatchEvent(new CustomEvent("input-connected", {
        detail: this,
        bubbles: true,
        composed: true
      }));
    }
  
    disconnectedCallback() {
      this.dispatchEvent(new CustomEvent("input-disconnected", {
        detail: this,
        bubbles: true,
        composed: true
      }));
    }
  
    // The following event handlers prevent fieldsets from registering
    // themselves into a top level form.
    @eventHandler("input-disconnected", { capture: true })
    public handleInputDisconnected(e: CustomEvent<any>) {
        e.stopPropagation();
    }

    @eventHandler("input-connected", { capture: true })
    public handleInputConnected(e: CustomEvent<any>) {
        e.stopPropagation();
    }
}