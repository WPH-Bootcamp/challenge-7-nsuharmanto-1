import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from './userTypes';

type UserState = {
  isLoggedIn: boolean;
  user: UserInfo | null;
};

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfo>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      // Untuk update data user setelah update profile
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;