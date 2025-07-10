import { Paper } from "@mui/material";
import styled from "styled-components";

const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;

  .no-messages {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
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
  display: "flex",
  alignItems: "center",
  padding: "5px 10px",
  borderRadius: "25px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  flex: 1,
}));

export {
  ChatWrapper,
  ChatContainer,
  InputContainer,
  MessagesContainer,
  ChatInputWrapper,
};
