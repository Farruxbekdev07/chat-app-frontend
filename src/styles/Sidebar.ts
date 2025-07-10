"use client";

// packages
import styled from "styled-components";

// helper functions
import { pxToRem } from "src/utils";

// variables
const drawerWidth = 350;

const SidebarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 25%;
  min-width: ${pxToRem(280)};
  max-width: ${pxToRem(drawerWidth)};
  background: ${({ theme }) => theme.palette.background.paper};
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
`;

const DrawerContainer = styled.div`
  .drawer {
    width: 100%;
    min-width: ${pxToRem(280)};
    max-width: ${pxToRem(drawerWidth)};
    border: 1px solid red;

    .MuiDrawer-paper {
      box-sizing: border-box;
      border: 1px solid blue;
      width: ${pxToRem(drawerWidth)};
      /* width: 100%; */
    }
  }
`;

export { SidebarWrapper, DrawerContainer };
