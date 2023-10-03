import { eventHandler, handlerSetup } from "./utils/event-handler";

export class PulpitoForm extends HTMLElement {
  public readonly form: HTMLFormElement;
  public fields: Set<any>;

  constructor() {
    super();
    const self = this.attachShadow({ mode: "open" });
    this.form = document.createElement("form");
    this.fields = new Set<any>();

    // Append the  contents of the previous lightDOM
    self.append(this.form);
    Array.from(this.children).forEach((e) => this.form.append(e));

    handlerSetup(this);
  }

  // When an input connects, add it to the data object
  @eventHandler("input-connected", { capture: true })
  public handleInputConnected(e: CustomEvent<any>) {
    this.fields.add(e.detail);
    e.stopPropagation();
  }

  // When an input disconnects, remove it from the data object
  @eventHandler("input-disconnected", { capture: true })
  public handleInputDisonnected(e: CustomEvent<any>) {
    this.fields.delete(e.detail);
    e.stopPropagation();
  }
}

window.customElements.define("pulpito-form", PulpitoForm);
