import { configureStore } from '@reduxjs/toolkit';
import claimsReducer from '../features/claims/ClaimsSlice';
import { authReducer } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    claims: claimsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
