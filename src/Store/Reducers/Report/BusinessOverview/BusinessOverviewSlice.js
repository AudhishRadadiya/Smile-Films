import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  profitAndLossReportData: {},
  profitLossReportDateRange: [],
  balanceSheetReportData: {},
  balanceSheetReportDateRange: [],
  tradingReportData: {},
  tradingReportDateRange: [],
  profitLossStartDate: '',
  profitLossEndDate: '',
  tradingStartDate: '',
  tradingEndDate: '',
  balanceSheetStartDate: '',
  balanceSheetEndDate: '',
};

export const getProfitLossReportData = createAsyncThunk(
  'reports/profit-loss',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('reports/profit-loss-report', data)
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

export const getBalanceSheetReportData = createAsyncThunk(
  'reports/balance-sheet-report',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('reports/balance-sheet-report', data)
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

export const getTradingReportData = createAsyncThunk(
  'reports/trading-report',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('reports/trading-report', data)
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

const businessOverviewReportsSlice = createSlice({
  name: 'businessOverviewReports',
  initialState,
  reducers: {
    setProfitLossReportDateRange: (state, action) => {
      state.profitLossReportDateRange = action.payload;
    },
    setBalanceSheetReportDateRange: (state, action) => {
      state.balanceSheetReportDateRange = action.payload;
    },
    setTradingReportDateRange: (state, action) => {
      state.tradingReportDateRange = action.payload;
    },
    setProfitLossStartDate: (state, action) => {
      state.profitLossStartDate = action.payload;
    },
    setProfitLossEndDate: (state, action) => {
      state.profitLossEndDate = action.payload;
    },
    setTradingStartDate: (state, action) => {
      state.tradingStartDate = action.payload;
    },
    setTradingEndDate: (state, action) => {
      state.tradingEndDate = action.payload;
    },
    setBalanceSheetStartDate: (state, action) => {
      state.balanceSheetStartDate = action.payload;
    },
    setBalanceSheetEndDate: (state, action) => {
      state.balanceSheetEndDate = action.payload;
    },
  },
  extraReducers: {
    [getProfitLossReportData.pending]: state => {
      state.businessOverviewLoading = true;
    },
    [getProfitLossReportData.rejected]: state => {
      state.profitAndLossReportData = {};
      state.businessOverviewLoading = false;
    },
    [getProfitLossReportData.fulfilled]: (state, action) => {
      state.profitAndLossReportData = action.payload?.data;
      state.businessOverviewLoading = false;
    },
    [getBalanceSheetReportData.pending]: state => {
      state.businessOverviewLoading = true;
    },
    [getBalanceSheetReportData.rejected]: state => {
      state.balanceSheetReportData = {};
      state.businessOverviewLoading = false;
    },
    [getBalanceSheetReportData.fulfilled]: (state, action) => {
      state.balanceSheetReportData = action.payload?.data;
      state.businessOverviewLoading = false;
    },
    [getTradingReportData.pending]: state => {
      state.businessOverviewLoading = true;
    },
    [getTradingReportData.rejected]: state => {
      state.tradingReportData = {};
      state.businessOverviewLoading = false;
    },
    [getTradingReportData.fulfilled]: (state, action) => {
      state.tradingReportData = action.payload?.data;
      state.businessOverviewLoading = false;
    },
  },
});

export const {
  setProfitLossReportDateRange,
  setBalanceSheetReportDateRange,
  setTradingReportDateRange,
  setProfitLossStartDate,
  setProfitLossEndDate,
  setTradingStartDate,
  setTradingEndDate,
  setBalanceSheetStartDate,
  setBalanceSheetEndDate,
} = businessOverviewReportsSlice.actions;

export default businessOverviewReportsSlice.reducer;
