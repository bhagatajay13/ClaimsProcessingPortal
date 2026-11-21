
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UserRole } from './permissions';

interface AuthState {
  role: UserRole;
}

const initialState: AuthState = {
  role: 'ADMIN',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;

export const authReducer = authSlice.reducer;
export default authReducer;
