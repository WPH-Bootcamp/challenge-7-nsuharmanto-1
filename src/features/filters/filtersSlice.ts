import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type FiltersState = {
  category?: string;
  sort?: string;
  query?: string;
};

const initialState: FiltersState = {};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearFilters: (state) => {
      state.category = undefined;
      state.sort = undefined;
      state.query = undefined;
    }
  }
});

export const { setCategory, setSort, setQuery, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
