type Decorator = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => any;
  
export function handlerSetup(target: any) {
    for (const handler of target._eventHandlers) {
        target.addEventListener(
            handler.event, handler.handler, handler.options
        );
    }
}
  
export function eventHandler(
    eventName: string,
    options?: AddEventListenerOptions,
): Decorator {
    return (target: any, _, descriptor: PropertyDescriptor) => {
        if (target._eventHandlers == null) {
            Object.defineProperty(
                target,
                "_eventHandlers",
                {
                    enumerable: false,
                    value: [],
                },
            );
        }
        target._eventHandlers.push({
            handler: descriptor.value,
            event: eventName,
            options: options,
        });
    };
  }
  