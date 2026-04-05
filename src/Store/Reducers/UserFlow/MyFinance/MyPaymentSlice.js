import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  myPayList: {},
  myPayDetails: {},
  myPayListLoading: false,
  myPaymentCurrentPage: 1,
  myPaymentPageLimit: 10,
  myPaymentYear: String(moment().year()),
  myPaymentMonth: String(moment().month() + 1),
  myPaymentPreview: false,
};

export const getListMyPay = createAsyncThunk(
  'employee/my_pay/list-my_pay',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/my_pay/list-my_pay', data)
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

export const getDetailsMyPay = createAsyncThunk(
  'employee/details/list-my_pay',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/my_pay/list-my_pay', payload)
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

const MyPaymentSlice = createSlice({
  name: 'myPayment',
  initialState,
  reducers: {
    setMyPayList: (state, action) => {
      state.myPayList = action.payload;
    },
    setMyPaymentCurrentPage: (state, action) => {
      state.myPaymentCurrentPage = action.payload;
    },
    setMyPaymentPageLimit: (state, action) => {
      state.myPaymentPageLimit = action.payload;
    },
    setMyPaymentYear: (state, action) => {
      state.myPaymentYear = action.payload;
    },
    setMyPaymentMonth: (state, action) => {
      state.myPaymentMonth = action.payload;
    },
    setMyPaymentPreview: (state, action) => {
      state.myPaymentPreview = action.payload;
    },
    setMyPayDetails: (state, action) => {
      state.myPayDetails = action.payload;
    },
  },
  extraReducers: {
    [getListMyPay.pending]: state => {
      state.myPayListLoading = true;
    },
    [getListMyPay.rejected]: state => {
      state.myPayList = {};
      state.myPayListLoading = false;
    },
    [getListMyPay.fulfilled]: (state, action) => {
      state.myPayList = action?.payload?.data;
      state.myPayListLoading = false;
    },

    [getDetailsMyPay.pending]: state => {
      state.myPayListLoading = true;
    },
    [getDetailsMyPay.rejected]: state => {
      state.myPayDetails = {};
      state.myPayListLoading = false;
    },
    [getDetailsMyPay.fulfilled]: (state, action) => {
      state.myPayDetails = action?.payload?.data;
      state.myPayListLoading = false;
    },
  },
});

export const {
  setMyPayList,
  setMyPaymentCurrentPage,
  setMyPaymentPageLimit,
  setMyPaymentYear,
  setMyPaymentMonth,
  setMyPaymentPreview,
  setMyPayDetails,
} = MyPaymentSlice.actions;

export default MyPaymentSlice.reducer;
