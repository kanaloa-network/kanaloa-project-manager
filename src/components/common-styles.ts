import { css, CSSResult, unsafeCSS } from 'lit';

export const enum Shade {
    VANILLA = "",
    LIGHT = "-light",
    DARK = "-dark"
}

export const colorVariables = css`
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
        --background-light-color: #000;
        --background-dark-color: #17102e;
    
        /* Foreground colors */
        --foreground-color: #fff;
        --foreground-light-color: #fff;
        --foreground-dark-color: #fff;
    }
`;

export const headerStyles = css`
    h1 {
        font-size: 3rem;
        display: block;
        width: 100%;
    }

    h2 {
        font-size: 2rem;
        margin: 0.5rem 0 0.5rem;
    }

    h3 {
        font-size: 1.5rem;
        margin: 0;
    }

    hr {
        border: none;
        height: 2px;
        background-color: var(--background-light-color);
        margin: 0.5rem 0 1rem;
    }
`;

/* NOTE: despite the spooky "unsafeCSS" name, it's actually safe in this context */

export function interactiveComponent(shade: Shade = Shade.VANILLA): CSSResult {
    return css`
        :host {
            background-color: var(--primary${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
} 

export function interactiveComponentHighlight(
    shade: Shade = Shade.VANILLA
): CSSResult {
    return css`
        :host {
            background-color: var(--highlighted${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
}

export function background(shade: Shade = Shade.VANILLA): CSSResult { 
    return css`
        :host {
            background-color: var(--background${unsafeCSS(shade)}-color);
            color: var(--foreground${unsafeCSS(shade)}-color);
        }
    `;
}

export function foreground(shade: Shade = Shade.VANILLA): CSSResult { 
    return css`
        :host {
            background-color: var(--foreground${unsafeCSS(shade)}-color);
            color: var(--background${unsafeCSS(shade)}-color);
        }
    `;
}
