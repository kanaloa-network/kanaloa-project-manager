import { eventHandler, handlerSetup } from "./utils/event-handler";
import { PulpitoBase } from "./pulpito-base";

export class PulpitoForm extends PulpitoBase {  
  public readonly form: HTMLFormElement;
  public fields: Set<HTMLElement>;

  public value = "";

  protected getInnerElement(): HTMLElement {
    return this.form;
  }

  constructor() {
    super();
    
    this.form = document.createElement("form");
    this.fields = new Set<HTMLElement>();

    // Append the  contents of the previous lightDOM
    Array.from(this.children).forEach((e) => this.form.append(e));
    this.append(this.form);
    
    //handlerSetup(this);
  }

  // When an input connects, add it to the data object
  @eventHandler("input-connected", { capture: true })
  public handleInputConnected(e: CustomEvent<any>) {
    this.fields.add(e.detail);
    console.log("added")
    e.stopPropagation();
  }

  // When an input disconnects, remove it from the data object
  @eventHandler("input-disconnected", { capture: true })
  public handleInputDisconnected(e: CustomEvent<any>) {
    this.fields.delete(e.detail);
    console.log("removed")
    e.stopPropagation();
  }
}

window.customElements.define("pulpito-form", PulpitoForm);
