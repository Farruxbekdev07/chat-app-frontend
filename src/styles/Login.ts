"use client";

import { pxToRem } from "src/utils";
// packages
import styled from "styled-components";

const StyledLogin = styled.div`
  .grid-container {
    width: 100%;
    min-height: 100vh;
    height: fit-content;
    padding: ${pxToRem(50)} 0;
  }

  .special-label {
    background-color: rgb(53 53 53);
  }
  .phone-input {
    width: 100%;
    background: transparent;
  }
  .country-list {
    background-color: ${({ theme }) => theme.palette.divider};
  }
  .country-list .country {
    background-color: ${({ theme }) => theme.palette.divider} !important;

    &:hover {
      background-color: rgb(53 53 53) !important;
    }
  }
  .country-list .highlight {
    background-color: rgb(53 53 53) !important;
  }
  .country-list .country .dial-code {
    color: white;
  }
`;

export { StyledLogin };
