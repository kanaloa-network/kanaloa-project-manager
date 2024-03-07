type Decorator = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => any;
  
export const reflect: Decorator = function (target, name, properties) {
    const getter = properties.get;
    const setter = properties.set;
    if (getter == null || setter == null) {
        throw new TypeError(
            `Property ${name} does not have a getter or setter.`,
        );
    }
  
    properties.get = function (this: typeof target) {
        const attr = getter.call(this);
  
        // Object values are the "authoritative" value for the attribute.
        if (typeof attr !== "undefined") {
            return attr;
        }
  
        // If there is no set value in the object, try element attributes.
        if (this.hasAttribute(name)) {
            return this.getAttribute(name);
        }
  
        // If everything else fails, it's not set
        return undefined;
    };
    properties.set = function (this: typeof target, val: unknown) {
        const currentValue: unknown = this[name];
        if (currentValue !== val) {
            if (val != null) {
                this.setAttribute(name, String(val));
            } else {
                this.removeAttribute(name);
            }
        }

        setter.call(this, val);
    };
  };
  
export function fallthrough(elementProvider: () => HTMLElement): Decorator {
    return function (target: any, name: string, descriptor: PropertyDescriptor) {
        const originalSetter = descriptor.set;
        const originalGetter = descriptor.get;
  
        if (originalSetter == null || originalGetter == null) {
            throw new TypeError(
                `Property ${name} does not have a getter or setter.`
            );
        }
  
        descriptor.set = function (value: unknown) {
            // Call the original setter
            originalSetter.call(this, value);
  
            // Get the HTMLElement dynamically by invoking the provider function
            const elem = elementProvider.call(this);
  
            // Reflect the property change to the HTMLElement as an attribute
            if (value != null) {
                elem.setAttribute(name, String(value));
            } else {
                elem.removeAttribute(name);
            }
        };
  
        return descriptor;
    };
}
  
export const bindInitialAttrs: Decorator = function (target, _, descriptor) {
    // Capture the original connectedCallback
    const originalConnectedCallback = descriptor.value;
    
    // Define a new connectedCallback
    descriptor.value = function(this: typeof target) {
        const observedAttributes = this.constructor.observedAttributes;
        console.log("hello there")
        // Loop through all observed attributes
        for (const attr of observedAttributes) {
            // Check if the attribute is defined on the element
            if (this.hasAttribute(attr)) {
                // Assign the attribute value to the object's property
                const value = this.getAttribute(attr);
                this[attr] = value;
            }
        }

        // Replace the connectedCallback with the original one
        this.connectedCallback = originalConnectedCallback;

        // Call the original connectedCallback
        originalConnectedCallback.apply(this);
    };

    return descriptor;
  };