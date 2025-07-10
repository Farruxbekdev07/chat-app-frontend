import { combineReducers } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import messagesSlice from "./messagesSlice";

const rootReducers = combineReducers({
  auth: authSlice,
  message: messagesSlice,
});

export default rootReducers;
