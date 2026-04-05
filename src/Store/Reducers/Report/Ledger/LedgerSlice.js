import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  ledgerData: {},
  ledgerEndDate: '',
  ledgerPageLimit: 10,
  ledgerStartDate: '',
  ledgerCurrentPage: 1,
  ledgerSearchParam: '',
  ledgerFinancialYearId: '',
  ledgerDataLoading: false,
  ledgerDate: '',
};

export const getLedgerData = createAsyncThunk('reports/ledger', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('reports/ledger', data)
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
});

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    setLedgerCurrentPage: (state, action) => {
      state.ledgerCurrentPage = action.payload;
    },
    setLedgerPageLimit: (state, action) => {
      state.ledgerPageLimit = action.payload;
    },
    setLedgerSearchParam: (state, action) => {
      state.ledgerSearchParam = action.payload;
    },
    setLedgerStartDate: (state, action) => {
      state.ledgerStartDate = action.payload;
    },
    setLedgerEndDate: (state, action) => {
      state.ledgerEndDate = action.payload;
    },
    setLedgerDate: (state, action) => {
      state.ledgerDate = action.payload;
    },
    setLedgerFinancialYearId: (state, action) => {
      state.ledgerFinancialYearId = action.payload;
    },
  },
  extraReducers: {
    [getLedgerData.pending]: state => {
      state.ledgerDataLoading = true;
    },
    [getLedgerData.rejected]: state => {
      state.ledgerData = {};
      state.ledgerDataLoading = false;
    },
    [getLedgerData.fulfilled]: (state, action) => {
      state.ledgerData = action.payload?.data;
      state.ledgerDataLoading = false;
    },
  },
});

export const {
  setLedgerFinancialYearId,
  setLedgerSearchParam,
  setLedgerCurrentPage,
  setLedgerPageLimit,
  setLedgerStartDate,
  setLedgerEndDate,
  setLedgerDate,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;
