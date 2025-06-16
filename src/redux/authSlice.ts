// packages
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// /src/redux/authSlice.ts
import { auth } from "../firebase/config";

interface AuthState {
  uid: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  uid: null,
  loading: false,
  error: null,
};

export const loginWithPhone = createAsyncThunk(
  "auth/loginWithPhone",
  async (phone: string, { rejectWithValue }) => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      window.confirmationResult = confirmation;
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (code: string, { rejectWithValue }) => {
    try {
      const result = await window.confirmationResult.confirm(code);
      return result.user.uid;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.uid = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.uid = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
