import { createGlobalStyle } from "styled-components";

import abcdiatypeLight from "./assets/fonts/ABCDiatype-Light-Trial.woff";
import abcdiatypeRegular from "./assets/fonts/ABCDiatype-Regular-Trial.woff";
import abcdiatypeHeavy from "./assets/fonts/ABCDiatype-Heavy-Trial.woff";
import abcdiatypeUltra from "./assets/fonts/ABCDiatype-Ultra-Trial.woff";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-forest: #154C2C;
    --color-mint: #66D575;
    --color-brick: #AE340F;
    --color-sky: #B1EDFF;
    --color-lime: #E7F5A6;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url(${abcdiatypeLight}) format('woff');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url(${abcdiatypeRegular}) format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url(${abcdiatypeHeavy}) format('woff');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'ABCDiatype';
    src: url(${abcdiatypeUltra}) format('woff');
    font-weight: 800;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    overflow-x: clip;
    font-family: 'ABCDiatype', system-ui, -apple-system, sans-serif;
    hyphens: auto;
    word-break: normal;
    overflow-wrap: normal;
  }

  body {
    hyphens: auto;
    word-break: normal;
    overflow-wrap: normal;
    background-color: white;
  }

  #root h1 {
    font-size: 7rem;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    line-height: 1.1;
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
