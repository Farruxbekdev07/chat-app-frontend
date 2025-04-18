import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

interface Message {
  id: string;
  text: string;
  uid: string;
  createdAt: number;
}

interface MessagesState {
  messages: Message[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};

// Async thunk: Xabarlarni yuklash
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async () => {
    const messagesRef = collection(firestore, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  }
);

// Async thunk: Yangi xabar yuborish
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ text, uid }: { text: string; uid: string }) => {
    const messagesRef = collection(firestore, "messages");
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
  reducers: {},
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

export default messagesSlice.reducer;
