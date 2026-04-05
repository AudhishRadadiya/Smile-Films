import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  empTransactionList: {},
  empTransactionLoading: false,
  empTransactionSearchParam: '',
  empTransactionPageLimit: 10,
  empTransactionCurrentPage: 1,
  empTransactionDate: [],
};

export const getEmpTransactionList = createAsyncThunk(
  'employee/transaction/list-transaction',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/transaction/list-transaction', data)
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

const empTransactionSlice = createSlice({
  name: 'empTransaction',
  initialState,
  reducers: {
    setEmpTransactionSearchParam: (state, action) => {
      state.empTransactionSearchParam = action.payload;
    },
    setEmpTransactionPageLimit: (state, action) => {
      state.empTransactionPageLimit = action.payload;
    },
    setEmpTransactionCurrentPage: (state, action) => {
      state.empTransactionCurrentPage = action.payload;
    },
    setEmpTransactionDate: (state, action) => {
      state.empTransactionDate = action.payload;
    },
  },
  extraReducers: {
    [getEmpTransactionList.pending]: state => {
      state.empTransactionLoading = true;
    },
    [getEmpTransactionList.rejected]: state => {
      state.empTransactionList = {};
      state.empTransactionLoading = false;
    },
    [getEmpTransactionList.fulfilled]: (state, action) => {
      state.empTransactionList = action.payload?.data;
      state.empTransactionLoading = false;
    },
  },
});

export const {
  setEmpTransactionSearchParam,
  setEmpTransactionPageLimit,
  setEmpTransactionCurrentPage,
  setEmpTransactionDate,
} = empTransactionSlice.actions;

export default empTransactionSlice.reducer;
