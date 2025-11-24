import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from './playlistSlice';

interface MusicState {
  searchResults: Music[];
  popularSongs: Music[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MusicState = {
  searchResults: [],
  popularSongs: [],
  isLoading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<Music[]>) => {
      state.searchResults = action.payload;
    },
    setPopularSongs: (state, action: PayloadAction<Music[]>) => {
      state.popularSongs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSearchResults, setPopularSongs, setLoading, setError } = musicSlice.actions;
export default musicSlice.reducer;
