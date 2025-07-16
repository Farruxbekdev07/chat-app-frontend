import { Paper } from "@mui/material";

import { pxToRem } from "src/utils";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  width: inherit;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${pxToRem(15)};

  .no-messages {
    color: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${pxToRem(18)};
  }
`;

const ChatInputWrapper = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  border: "none",
  // borderRadius: pxToRem(25),
  // boxShadow: theme.shadows[2],
  backgroundColor: "transparent",
  padding: `${pxToRem(5)} ${pxToRem(10)}`,
}));

export { ChatContainer, ChatInputWrapper, MessagesContainer };
