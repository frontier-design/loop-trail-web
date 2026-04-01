import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-forest: #154C44;
    --color-mint: #66D575;
    --color-brick: #D2401F;
    --color-sky: #332E5F;
    --color-lime: #EBF0C3;
    /* Lime on brick ≈3.96:1 (fails WCAG AA for UI copy). White passes (~4.67:1). */
    --color-on-brick: #ffffff;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url('/fonts/ABCDiatype-Light-Trial.woff') format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url('/fonts/ABCDiatype-Regular-Trial.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url('/fonts/ABCDiatype-Heavy-Trial.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url('/fonts/ABCDiatype-Ultra-Trial.woff') format('woff');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--color-forest);
  }

  html {
    overflow-x: clip;
    font-family: 'ABCDiatype', system-ui, -apple-system, sans-serif;
    hyphens: none;
    word-break: normal;
    overflow-wrap: normal;
  }

  body {
    hyphens: none;
    word-break: normal;
    overflow-wrap: normal;
    background-color: white;
  }

  #root h1 {
    font-size: 7rem;
    text-transform: uppercase;
    letter-spacing: -0.025em;
    line-height: 1;
    margin-bottom: 1.5rem;
    font-weight: 800;
  }

  #root h2 {
    font-size: 5rem;
    line-height: 1.1;
    letter-spacing: -0.025em;
    hyphens: none;
    overflow-wrap: normal;
    word-break: normal;
  }

  p {
    font-size: 1.3rem;
    line-height: 1.5;
    margin-bottom: 1.5rem; 
  }

  p:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 768px) {
    p {
      font-size: 1.25rem;
    }

    #root h1 {
      font-size: 3em;
    }

    #root h2 {
      font-size: 2rem;
    }
  }
 

`;

export default GlobalStyle;
