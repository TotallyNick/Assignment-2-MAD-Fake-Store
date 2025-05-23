import { createSlice } from '@reduxjs/toolkit';
import { signInUser, signUpUser, updateUserProfile } from '../services/api';

const initialState = {
  user: null,
  token: null,
  loggedIn: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const payload = action.payload || {};
      if (payload.name && payload.email && payload.token) {
        state.user = { id: payload.id, name: payload.name, email: payload.email,token: payload.token };
        state.token = payload.token;
        state.loggedIn = true;
        state.error = null;
      } else {
        state.error = 'Unexpected login response';
      }
    },
    logout(state) {
      return initialState;
    },
    updateSuccess(state, action) {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        state.error = null;
      }
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateSuccess, setAuthError } = authSlice.actions;

export const login = ({ email, password }) => async (dispatch) => {
  try {
    const response = await signInUser({ email, password });
    dispatch(loginSuccess(response));
  } catch (err) {
    dispatch(setAuthError(err.message));
  }
};

export const signup = ({ name, email, password }) => async (dispatch) => {
  try {
    const response = await signUpUser({ name, email, password });
    dispatch(loginSuccess(response));
  } catch (err) {
    dispatch(setAuthError(err.message));
  }
};

export const updateProfile = ({ name, email, password }) => async (dispatch) => {
  try {
    await updateUserProfile({ name, email, password });
    dispatch(updateSuccess({ name, email }));
  } catch (err) {
    dispatch(setAuthError(err.message));
  }
};

export default authSlice.reducer;