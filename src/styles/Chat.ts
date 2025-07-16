import { Paper } from "@mui/material";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  width: inherit;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;

  .no-messages {
    color: white;
    height: 100%;
    display: flex;
    font-size: 18px;
    align-items: center;
    justify-content: center;
  }
`;

const ChatInputWrapper = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: "flex",
  padding: "5px 10px",
  alignItems: "center",
  borderRadius: "25px",
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
}));

export { ChatContainer, ChatInputWrapper, MessagesContainer };
