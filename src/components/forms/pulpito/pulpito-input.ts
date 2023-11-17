import { fallthrough, reflect, bindInitialAttrs } from "./utils/attribute-helpers";
import { eventHandler, handlerSetup } from "./utils/event-handler";

const INPUT_TYPES = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
];
const INPUT_TAGS = [
  // NOTE: "button" exists, but is basically superseded by typed inputs
  // Makes me wonder why even have different tags for these inputs
  "input",
  "datalist",
  "fieldset",
  "select",
  "textarea",
];

type InputTypeTuple = typeof INPUT_TYPES | "input";
type InputTag = typeof INPUT_TAGS[number];
type InputType = InputTypeTuple[number];
const InputType2InputTag = (t: InputType): InputTag => {
  switch (t) {
    case "datalist":
    case "fieldset":
    case "select":
    case "textarea":
      return t;
    default:
      return "input";
  }
};

const CHILDFUL_INPUT_TAGS: InputTag[] = [
  "datalist",
  "select",
  "fieldset",
];

export type FieldValue =
  | string
  | string[]
  | { [key: string]: FieldValue }
  | null;

export class PulpitoInput extends HTMLElement {
  // This API looks like a mess
  static formAssociated = true;
  declare elementInternals: ElementInternals;

  static get observedAttributes() {
    return ["type", "name", "disabled", "readOnly", "invalid"];
  }

  // I am pretty sure this should be hoisted, but ChatGPT begged to differ
  public inputElement: HTMLElement | undefined;
  private getFormElement(): HTMLElement {
    return this.inputElement!;
  }

  @reflect
  accessor type: InputType = "text";
  @reflect
  accessor name: string | undefined;
  @reflect @fallthrough(PulpitoInput.prototype.getFormElement)
  accessor disabled: boolean | undefined;
  @reflect @fallthrough(PulpitoInput.prototype.getFormElement)
  accessor readOnly: boolean | undefined;
  @reflect @fallthrough(PulpitoInput.prototype.getFormElement)
  accessor invalid: boolean | undefined;

  set value(val: FieldValue) {
    switch (this.type) {
      case "select":
      case "datalist":
        // If we receive a single string, search and select or throw
        // If we receive an array, clear, search all and select all, or throw
        // If we receive null, unselect all
        // If we receive object, throw
        if (
          typeof val === "object" &&
          !Array.isArray(val) &&
          val != null
        ) {
          // Object detected
          throw new TypeError(
            "Cannot assign object to selectlike field",
          );
        }

        // Deselect all
        getSelectedOptions(this.inputElement as HTMLSelectElement)
          .forEach((e) => e.selected = false);
        if (val != null) {
          // String or array detected
          const sel: string[] = (Array.isArray(val)) ? val : [val];

          for (const name of sel) {
            const option: HTMLOptionElement | null = this.inputElement!
              .querySelector(`[name="${name}"]`);

            if (option == null) {
              throw new RangeError("Option does not exist");
            }

            option.selected = true;
          }
        }
        break;
      case "fieldset":
        // Just throw if it's not an object
        if (
          typeof val !== "object" ||
          Array.isArray(val) ||
          val == null
        ) {
          throw new TypeError(
            "Attempting to set fieldset with non-object",
          );
        }

        // TODO: set fieldset children!
        break;
        // TODO: default behavior
    }
  }
  get value(): FieldValue {
    // NOTE: it would be more robust to return these values as an object
    //       that could be cast to more specific types
    // Most inputs return a string
    // Multi-choice inputs return a string[]
    // fieldsets return an object built by calling "value" in the children
    switch (this.type) {
      case "select":
      case "datalist": {
        // "select" and "datalist" can be multiple-choice inputs
        // If it's not, return a single string.
        // If nothing is selected, return a null
        // If multiple options are selected, return them as an array
        const selected: string[] = getSelectedOptions(
          this.inputElement as HTMLSelectElement,
        )
          .map((opt) => opt.value);

        if (selected.length == 1) {
          return selected[0];
        } else if (selected.length == 0) {
          return null;
        }

        return selected;
      }
      case "fieldset": {
        // Fieldsets contain other input fields. We will let them
        // handle themselves and return them as an object
        const fields: Record<string, FieldValue> = {};
        Array.from(this.inputElement?.children || []).forEach(
          (elem) => {
            if ("value" in elem && "name" in elem) {
              fields[elem.name as string] = elem.value as FieldValue;
            }
          },
        );

        return fields;
      }
      default:
        return (this.inputElement as unknown as { "value": FieldValue }).value;
    }
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

  render() {
    this.inputElement!.setAttribute("name", this.name || "");
    this.inputElement![
      this.value != null ? "setAttribute" : "removeAttribute"
    ]("value", this.value!.toString());
    this.inputElement![
      this.disabled ? "setAttribute" : "removeAttribute"
    ]("disabled", "");
    this.inputElement![
      this.readOnly ? "setAttribute" : "removeAttribute"
    ]("readonly", "");

    // If we expect the input to be childful, we attach a slot inside
    if (CHILDFUL_INPUT_TAGS.includes(this.type)) {
      this.append(document.createElement("slot"));
      Array.from(this.children).forEach((element) => {
        this.inputElement?.append(element);
      });
    }

    return this.inputElement;
  }

  reset(): void {
    this.inputElement = document.createElement(InputType2InputTag(this.type));
    this.value = "";
    this.invalid = false;

    // I guess it's because of these things that setters and getters are not
    // meant to have side effects
    this.disabled = (this.disabled);
    this.readOnly = (this.readOnly);
  }

  public attributeChangedCallback(
    name: string, oldValue: string, newValue: string
  ) {
    if (oldValue == newValue) {
      return;
    }

    if (name === "type") {
      const tag = InputType2InputTag(newValue);
      this.inputElement = document.createElement(tag);
      if (tag === "input") {
        this.inputElement.setAttribute("type", newValue)
      }
    }
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

function getSelectedOptions(selElem: HTMLSelectElement): HTMLOptionElement[] {
  // Why not use "selectedOptions"? Well, <datalist> doesn't implement it
  return Array.from(selElem.querySelectorAll("> option:selected"));
}

window.customElements.define("pulpito-input", PulpitoInput);
