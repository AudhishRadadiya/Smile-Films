import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  otpLoading: false,
};

/**
 * @desc Verify-OTP
 */

export const verifyOTP = createAsyncThunk(
  'verify-otp',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/verify-otp', data)
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

const VerifyEmailSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.otpLoading = action.payload;
    },
  },

  extraReducers: {
    [verifyOTP.pending]: (state, action) => {
      state.loginLoading = true;
    },
    [verifyOTP.rejected]: (state, action) => {
      state.loginLoading = false;
    },
    [verifyOTP.fulfilled]: (state, action) => {
      state.loginLoading = false;
    },
  },
});

export const { setLoading } = VerifyEmailSlice.actions;

export default VerifyEmailSlice.reducer;
