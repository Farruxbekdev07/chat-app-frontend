import { Paper } from "@mui/material";
import styled from "styled-components";

const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid red;
`;

const ChatContainer = styled.div`
  height: calc(100vh - 64px);
  display: flex;
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

const InputContainer = styled.div`
  gap: 10px;
  display: flex;
  padding: 10px;
  align-items: end;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
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

export {
  ChatWrapper,
  ChatContainer,
  InputContainer,
  ChatInputWrapper,
  MessagesContainer,
};
