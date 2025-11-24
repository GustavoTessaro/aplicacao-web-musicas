import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadAuthFromSession = (): AuthState => {
  const sessionData = sessionStorage.getItem('authUser');
  if (sessionData) {
    const user = JSON.parse(sessionData);
    return { user, isAuthenticated: true };
  }
  return { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadAuthFromSession();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('authUser', JSON.stringify(action.payload));
      sessionStorage.setItem('lastLogin', new Date().toISOString());
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('authUser');
      sessionStorage.removeItem('lastLogin');
      sessionStorage.removeItem('lastPlaylist');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
