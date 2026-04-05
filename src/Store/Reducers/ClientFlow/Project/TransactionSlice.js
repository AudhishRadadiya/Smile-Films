import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  transactionList: {},
  transactionLoading: false,
  transactionSearchParam: '',
  transactionPageLimit: 10,
  transactionCurrentPage: 1,
  transactionDate: [],
};

export const getTransactionList = createAsyncThunk(
  'client_company/payment/transaction/list-transaction',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/payment/transaction/list-transaction', data)
        .then(res => {

          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
          };
          if (err === 0) {
            resolve({ data: newObj });
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

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionSearchParam: (state, action) => {
      state.transactionSearchParam = action.payload;
    },
    setTransactionPageLimit: (state, action) => {
      state.transactionPageLimit = action.payload;
    },
    setTransactionCurrentPage: (state, action) => {
      state.transactionCurrentPage = action.payload;
    },
    setTransactionDate: (state, action) => {
      state.transactionDate = action.payload;
    },
  },
  extraReducers: {
    [getTransactionList.pending]: state => {
      state.transactionLoading = true;
    },
    [getTransactionList.rejected]: state => {
      state.transactionList = {};
      state.transactionLoading = false;
    },
    [getTransactionList.fulfilled]: (state, action) => {
      state.transactionList = action.payload?.data;
      state.transactionLoading = false;
    },
  },
});

export const {
  setTransactionSearchParam,
  setTransactionPageLimit,
  setTransactionCurrentPage,
  setTransactionDate,
} = transactionSlice.actions;

export default transactionSlice.reducer;
