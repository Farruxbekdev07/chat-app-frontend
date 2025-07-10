// redux/store/messagesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatUser {
  uid: string;
  fullName: string;
  username: string;
}

interface MessagesState {
  selectedUser: ChatUser | null;
}

const initialState: MessagesState = {
  selectedUser: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<ChatUser>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = messagesSlice.actions;
export default messagesSlice.reducer;
