import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin:0;
    padding:0;
    font:inherit;
    color:inherit;
    font-family: Pretendard;
  }
  *, :after, :before {
    box-sizing:border-box;
  }
  :root {
    -webkit-tap-highlight-color:transparent;
    -webkit-text-size-adjust:100%;
    text-size-adjust:100%;
    cursor:default;
    line-height:1.5;
    overflow-wrap:break-word;
    word-break:break-word;
    tab-size:4;
    width: 100%;
    height: 100%;
  }
  html {
    height:100%;
    font-size: 62.5%;
  }
  body {
    height: 100%;
  }
  #root {
    width: 100%;
    height: 100%;

  }
  img, picture, video, canvas, svg {
    display: block;
    max-width:100%;
  }
  button {
    padding: 0;
    background:none;
    border:0;
    cursor:pointer;
    outline: none;
  }
  button:focus {
    outline: none;
  }
  a {
    text-decoration:none
  }
  table {
    border-collapse:collapse;
    border-spacing:0
  }
  input {
    outline: none;
  }
  li {
    list-style: none;
  }
`;

export default GlobalStyles;
