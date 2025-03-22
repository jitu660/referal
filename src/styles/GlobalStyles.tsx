import { Global, css } from "@emotion/react";
import { theme } from "./theme";

const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
    min-height: 100vh;
  }

  /* Custom scrollbar */
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background-color: ${theme.colors.gray[100]};
    border-radius: ${theme.radii.sm};
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.gray[300]};
    border-radius: ${theme.radii.sm};
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.colors.gray[400]};
  }

  a {
    color: ${theme.colors.primary[500]};
    text-decoration: none;
    transition: color ${theme.transitions.fast};
  }

  a:hover {
    color: ${theme.colors.primary[600]};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: ${theme.spacing[3]};
    font-weight: ${theme.fontWeights.semibold};
    line-height: 1.2;
  }

  p {
    margin-bottom: ${theme.spacing[4]};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    cursor: pointer;
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
