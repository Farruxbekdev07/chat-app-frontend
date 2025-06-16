import {
  query,
  addDoc,
  getDocs,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// firebase folder
import { db } from "../firebase/config";

interface Message {
  id: string;
  uid: string;
  text: string;
  createdAt: number;
}

interface MessagesState {
  loading: boolean;
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};

// Async thunk: Xabarlarni yuklash
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async () => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  }
);

export const listenToMessages = createAsyncThunk(
  "messages/listenToMessages",
  async (_, { dispatch }) => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      dispatch(setMessages(messages));
    });
  }
);

// Async thunk: Yangi xabar yuborish
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ text, uid }: { text: string; uid: string }) => {
    const messagesRef = collection(db, "messages");
    const docRef = await addDoc(messagesRef, {
      text,
      uid,
      createdAt: Date.now(),
    });
    return { id: docRef.id, text, uid, createdAt: Date.now() };
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
