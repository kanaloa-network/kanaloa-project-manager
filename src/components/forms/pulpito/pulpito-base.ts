export class PulpitoBase extends HTMLElement {

    public inputElement: HTMLElement | undefined;
    private getInputlement(): HTMLElement {
      return this.inputElement!;
    }

    @reflect
    accessor name: string | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputlement)
    accessor disabled: boolean | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputlement)
    accessor readOnly: boolean | undefined;
    @reflect @fallthrough(PulpitoBase.prototype.getInputlement)
    accessor invalid: boolean | undefined;

    // This API looks like a mess
    static formAssociated = true;
    declare elementInternals: ElementInternals;

    static get observedAttributes() {
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