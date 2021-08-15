import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html{
        --grey: #aaaaaa;
        --teal: #08ffbd;
        --gray: var(--grey, #aaaaaa);
    }

    * {
        box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    body {
        width: 100%;
        height: 90vh;
        padding: 0;
        margin: 0;
        background: #192d38; /* Old browsers */
        background: -moz-radial-gradient(
            center,
            ellipse cover,
            #192d38 0%,
            #211f2f 100%
        ); /* FF3.6-15 */
        background: -webkit-radial-gradient(
            center,
            ellipse cover,
            #192d38 0%,
            #211f2f 100%
        ); /* Chrome10-25,Safari5.1-6 */
        background: radial-gradient(
            ellipse at center,
            #192d38 0%,
            #211f2f 100%
        ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#192d38', endColorstr='#211f2f',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: white;
        font-weight: 300;
    }

    input,
    label,
    button {
        font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
    }

    label {
        padding-right: 18px;
        display: inline-block;
        width: 150px;

        .label-extra-info {
            opacity: .7;
        }
    }

    input {
        font-size: 17px;
        background: #211f2f;
        color: white;
        width: 50px;
        padding: 0.3ch 5px;
        max-height: 40px;
        border: 1px solid #666;
    }

    fieldset {
        margin-bottom: 20px;
        border: none;
        margin: 0;
        padding: 5px 0;
    }

    button {
        background: transparent;
        color: var(--teal);
        padding: 4px 30px 5px;
        border-radius: 1000px;
        border: 1px solid var(--teal);
        font-size: 16px;
        margin: 20px 0 0;
        cursor: pointer;
        transition: 0.35s all;

        &:hover {
            background: var(--teal);
            color: black;
        }
    }

    [type="reset"] {
        color: var(--grey);
        border: 1px solid var(--grey);

        &:hover {
            background: var(--grey);
            color: black;
        }
    }

`;
