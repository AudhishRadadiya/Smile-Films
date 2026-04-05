import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  subscriptionPlanList: {},
  subscriptionPlanLoading: false,
  selectedPlan: null,
};

export const getSubscriptionPlanList = createAsyncThunk(
  'subscription/list-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/list-subscription', data)
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

export const trialSubscription = createAsyncThunk(
  'subscription/add-trial-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/add-trial-subscription', data)
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

export const createSubscription = createAsyncThunk(
  'subscription/create-payment-intent',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/create-payment-intent', data)
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

const subscriptionPlanSlice = createSlice({
  name: 'subscriptionPlans',
  initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
  },
  extraReducers: {
    [getSubscriptionPlanList.pending]: state => {
      state.subscriptionPlanLoading = true;
    },
    [getSubscriptionPlanList.rejected]: state => {
      state.subscriptionPlanList = {};
      state.subscriptionPlanLoading = false;
    },
    [getSubscriptionPlanList.fulfilled]: (state, action) => {
      state.subscriptionPlanList = action.payload?.data;
      state.subscriptionPlanLoading = false;
    },
    [trialSubscription.pending]: state => {
      state.subscriptionPlanLoading = true;
    },
    [trialSubscription.rejected]: state => {
      state.selectedPlan = null;
      state.subscriptionPlanLoading = false;
    },
    [trialSubscription.fulfilled]: (state, action) => {
      state.selectedPlan = action.payload?.data;
      state.subscriptionPlanLoading = false;
    },
    [createSubscription.pending]: state => {
      state.subscriptionPlanLoading = true;
    },
    [createSubscription.rejected]: state => {
      state.selectedPlan = null;
      state.subscriptionPlanLoading = false;
    },
    [createSubscription.fulfilled]: (state, action) => {
      state.selectedPlan = action.payload?.data;
      state.subscriptionPlanLoading = false;
    },
  },
});

export const { setSelectedPlan } = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
