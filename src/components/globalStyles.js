import { createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
  }
  .darkCard {
    background: ${props => props.theme.cardBackground};
    color: ${props => props.theme.cardText};
  }
  .footerText {
    color: ${props => props.theme.cardText};
  }
  `
