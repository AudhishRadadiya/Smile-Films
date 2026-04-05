import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  resetPassLoading: false,
};

/**
 * @desc Reset-password
 */

export const resetPassword = createAsyncThunk(
  'reset-password',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/reset-password', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data });
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

const ResetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,

  extraReducers: {
    [resetPassword.pending]: (state, action) => {
      state.resetPassLoading = true;
    },
    [resetPassword.rejected]: (state, action) => {
      state.resetPassLoading = false;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.resetPassLoading = false;
    },
  },
});

export default ResetPasswordSlice.reducer;
