import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  forgotPassloading: false,
};

/**
 * @desc Forget-password
 */

export const forgotPassword = createAsyncThunk(
  'forgot-password',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/forgot-password', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data.data });
            toast.success(data?.msg);
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

const ForgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.forgotPassloading = action.payload;
    },
  },

  extraReducers: {
    [forgotPassword.pending]: (state, action) => {
      state.forgotPassloading = true;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.forgotPassloading = false;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.forgotPassloading = false;
    },
  },
});

export const { setLoading } = ForgotPasswordSlice.actions;

export default ForgotPasswordSlice.reducer;
