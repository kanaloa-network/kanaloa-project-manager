import { css, unsafeCSS } from 'lit';
export const colorVariables = css `
    :host {
        /* Primary colors */
        --primary-color: #514983;
        --primary-light-color: #8274b3;
        --primary-dark-color: #2a2b4f;

        /* Highlighted colors */
        --highlighted-color: #EA3757;
        --highlighted-light-color: #ff6a84;
        --highlighted-dark-color: #b30033;

        /* Background colors */
        --background-color: #261F47;
        --background-light-color: #4a3b6a;
        --background-dark-color: #17102e;
    
        /* Foreground colors */
        --foreground-color: #ffffff;
        --foreground-light-color: #f1f1f1;
        --foreground-dark-color: #d0d0d0;
    }
`;
/* NOTE: despite the spooky "unsafeCSS" name, it's actually safe in this context */
export function interactiveComponent(shade = "" /* Shade.VANILLA */) {
    return css `
        :host {
            background-color: var(--primary${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
}
export function interactiveComponentHighlight(shade = "" /* Shade.VANILLA */) {
    return css `
        :host {
            background-color: var(--highlighted${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
}
export function background(shade = "" /* Shade.VANILLA */) {
    return css `
        :host {
            background-color: var(--background${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
}
export function foreground(shade = "" /* Shade.VANILLA */) {
    return css `
        :host {
            background-color: var(--foreground${unsafeCSS(shade)}-color);
            color: var(--background${unsafeCSS(shade)}-color);
        }
    `;
}
//# sourceMappingURL=common-styles.js.map