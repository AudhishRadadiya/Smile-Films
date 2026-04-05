import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  clientHistoryLoading: false,
  clientDeletedHistory: [],
  clientCompanyDetailLoading: false,
  clientCompanyDetails: [],
  clientManageHistoryLoading: false,
  clientCashFlowData: {},
  clientCashFlowDataLoading: false,
  paidPaymentData: {},
  upComingPaymentData: {},
};

/**
 * @desc get client company details
 */

export const getClientCompanyDetail = createAsyncThunk(
  'client_company/dashboard/client-company-detail',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/dashboard/client-company-detail', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
          } else {
            toast.error(msg);
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

/**
 * @desc get deleted history
 */

export const getDeletedHistory = createAsyncThunk(
  'client_company/dashboard/deleted-history',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/dashboard/deleted-history', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
          } else {
            toast.error(msg);
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

/**
 * @desc manage deleted history
 */

export const manageDeletedHistory = createAsyncThunk(
  'client_company/dashboard/add-deleted-history',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/dashboard/add-deleted-history', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
          } else {
            toast.error(msg);
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

/**
 * @desc get cash flow data
 */

export const getCashFlowData = createAsyncThunk(
  'client_company/dashboard/cash-flow',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/dashboard/cash-flow')
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
          } else {
            toast.error(msg);
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

const clientDashboardSlice = createSlice({
  name: 'clientDashboard',
  initialState,
  reducers: {
    setUpComingPaymentData: (state, action) => {
      state.upComingPaymentData = action.payload;
    },
    setPaidPaymentData: (state, action) => {
      state.paidPaymentData = action.payload;
    },
  },
  extraReducers: {
    [getClientCompanyDetail.pending]: state => {
      state.clientCompanyDetails = [];
      state.clientCompanyDetailLoading = true;
    },
    [getClientCompanyDetail.rejected]: state => {
      state.clientCompanyDetails = [];
      state.clientCompanyDetailLoading = false;
    },
    [getClientCompanyDetail.fulfilled]: (state, action) => {
      state.clientCompanyDetails = action.payload;
      state.clientCompanyDetailLoading = false;
    },
    [getDeletedHistory.pending]: state => {
      state.clientDeletedHistory = [];
      state.clientHistoryLoading = true;
    },
    [getDeletedHistory.rejected]: state => {
      state.clientDeletedHistory = [];
      state.clientHistoryLoading = false;
    },
    [getDeletedHistory.fulfilled]: (state, action) => {
      state.clientDeletedHistory = action.payload;
      state.clientHistoryLoading = false;
    },
    [manageDeletedHistory.pending]: state => {
      // state.clientManageDeletedHistory = {};
      state.clientManageHistoryLoading = true;
    },
    [manageDeletedHistory.rejected]: state => {
      // state.clientManageDeletedHistory = {};
      state.clientManageHistoryLoading = false;
    },
    [manageDeletedHistory.fulfilled]: (state, action) => {
      // state.clientManageDeletedHistory = action.payload;
      state.clientManageHistoryLoading = false;
    },
    [getCashFlowData.pending]: state => {
      state.clientCashFlowData = {};
      state.clientCashFlowDataLoading = true;
    },
    [getCashFlowData.rejected]: state => {
      state.clientCashFlowData = {};
      state.clientCashFlowDataLoading = false;
    },
    [getCashFlowData.fulfilled]: (state, action) => {
      state.clientCashFlowData = action.payload;
      state.clientCashFlowDataLoading = false;
    },
  },
});

export const { setUpComingPaymentData, setPaidPaymentData } =
  clientDashboardSlice.actions;

export default clientDashboardSlice.reducer;
