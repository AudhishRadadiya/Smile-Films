import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  subscriptionStatusList: {},
  subscriptionStatusLoading: false,
  selectedStatus: null,
};

export const getSubscriptionStatusList = createAsyncThunk(
  'subscription/subscription_status',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/subscription_status', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
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

const subscriptionStatusSlice = createSlice({
  name: 'subscriptionStatus',
  initialState,
  reducers: {},
  extraReducers: {
    [getSubscriptionStatusList.pending]: state => {
      state.subscriptionStatusLoading = true;
    },
    [getSubscriptionStatusList.rejected]: state => {
      state.subscriptionStatusList = {};
      state.subscriptionStatusLoading = false;
    },
    [getSubscriptionStatusList.fulfilled]: (state, action) => {
      state.subscriptionStatusList = action.payload?.data;
      state.subscriptionStatusLoading = false;
    },
  },
});

export const {} = subscriptionStatusSlice.actions;

export default subscriptionStatusSlice.reducer;
