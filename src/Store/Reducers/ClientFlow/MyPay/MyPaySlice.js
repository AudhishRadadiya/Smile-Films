import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  getPaymentDetailListData: {},
  getPaymentDetailListLoading: false,
  clientPaymentCurrentPage: 1,
  clientPaymentPageLimit: 10,
  clientPaymentSearchParam: '',
  // clientPaymentStartDate: '',
  // clientPaymentEndDate: '',
  clientPaymentDate: '',
  clientPaymentStatus: [],
};

/**
 * @desc client_company/payment_detail/list-payment_detail:
 */

export const getPaymentDetailList = createAsyncThunk(
  'client_company/payment_detail/list-payment_detail',
  (payload, thunkAPI) => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/payment_detail/list-payment_detail', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
            amount_due: data?.amount_due ? data?.amount_due : 0,
            amount_paid: data?.amount_paid ? data?.amount_paid : 0,
          };

          if (err === 0) {
            resolve(newObj);
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

const MyPaySlice = createSlice({
  name: 'myPay',
  initialState,
  reducers: {
    setclientPaymentCurrentPage: (state, action) => {
      state.clientPaymentCurrentPage = action.payload;
    },
    setclientPaymentPageLimit: (state, action) => {
      state.clientPaymentPageLimit = action.payload;
    },
    setclientPaymentSearchParam: (state, action) => {
      state.clientPaymentSearchParam = action.payload;
    },
    // setclientPaymentStartDate: (state, action) => {
    //   state.clientPaymentStartDate = action.payload;
    // },
    // setclientPaymentEndDate: (state, action) => {
    //   state.clientPaymentEndDate = action.payload;
    // },
    setclientPaymentStatus: (state, action) => {
      state.clientPaymentStatus = action.payload;
    },
    setClientPaymentDate: (state, action) => {
      state.clientPaymentDate = action.payload;
    },
  },
  extraReducers: {
    [getPaymentDetailList.pending]: state => {
      state.getPaymentDetailListLoading = true;
    },
    [getPaymentDetailList.rejected]: state => {
      state.getPaymentDetailListData = {};
      state.getPaymentDetailListLoading = false;
    },
    [getPaymentDetailList.fulfilled]: (state, action) => {
      state.getPaymentDetailListData = action.payload;
      state.getPaymentDetailListLoading = false;
    },
  },
});

export const {
  setclientPaymentCurrentPage,
  setclientPaymentPageLimit,
  setclientPaymentSearchParam,
  // setclientPaymentStartDate,
  // setclientPaymentEndDate,
  setclientPaymentStatus,
  setClientPaymentDate,
} = MyPaySlice.actions;

export default MyPaySlice.reducer;
