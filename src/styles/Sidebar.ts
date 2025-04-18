"use client";

// packages
import styled from "styled-components";

// helper functions
import { pxToRem } from "src/utils";

// variables
const drawerWidth = 350;

const SidebarWrapper = styled.div`
  width: 25%;
  min-width: ${pxToRem(280)};
  max-width: ${pxToRem(drawerWidth)};
  background: ${({ theme }) => theme.palette.background.paper};
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
`;

const DrawerContainer = styled.div`
  .drawer {
    flex: 1;
    flex-shrink: 0;
    min-width: ${pxToRem(280)};
    max-width: ${pxToRem(drawerWidth)};

    .MuiDrawer-paper {
      box-sizing: border-box;
      width: ${pxToRem(drawerWidth)};
    }
  }
`;

export { SidebarWrapper, DrawerContainer };
