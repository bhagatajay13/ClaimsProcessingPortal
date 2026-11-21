import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Claim } from '../../types/claims';
import { generateClaims } from './claimsService';

interface ClaimsState {
  claims: Claim[];
  selectedClaim: Claim | null;
}

const initialState: ClaimsState = {
  claims: generateClaims(20000),
  selectedClaim: null,
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    selectClaim: (state, action: PayloadAction<Claim>) => {
      state.selectedClaim = action.payload;
    },

    deleteClaim: (state, action: PayloadAction<string>) => {
      state.claims = state.claims.filter(
        claim => claim.id !== action.payload
      );
    },

    assignClaim: (
      state,
      action: PayloadAction<{ id: string; assignedTo: string }>
    ) => {
      const claim = state.claims.find(
        item => item.id === action.payload.id
      );

      if (claim) {
        claim.assignedTo = action.payload.assignedTo;
      }
    },

    updateClaim: (state, action: PayloadAction<Claim>) => {
      const index = state.claims.findIndex(
        claim => claim.id === action.payload.id
      );

      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    },
  },
});

export const {
  selectClaim,
  deleteClaim,
  assignClaim,
  updateClaim,
} = claimsSlice.actions;

export default claimsSlice.reducer;
