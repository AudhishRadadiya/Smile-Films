import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  billingDetail: {},
  billingListData: {},
  billingCurrentPage: 1,
  billingPageLimit: 10,
  billingSearchParam: '',
  billingItemType: '',
  billingPaymentCompleted: 0,
  billingPaymentStatus: '',
  billingData: {},
  updateBillingData: {},
  listEmployeeCommissionData: {},
  billingListCheckboxs: {
    editing: false,
    exposing: false,
    paymentCompleted: false,
  },
};

/**
 * @desc account/billing/list-billing
 */

export const getBillingList = createAsyncThunk(
  'account/billing/list-billing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/billing/list-billing', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updated = [];
          if (data?.list?.length) {
            updated = data?.list?.map(item => {
              return {
                ...item,

                item_name:
                  item?.item_name?.length === 1
                    ? item?.item_name[0]
                    : item?.item_name?.join(', '),
                step: item?.step ? item?.step : 0,

                item_type:
                  item?.item_type && item?.item_type === 1
                    ? 'Editing'
                    : 'Exposing',

                invoice_date: moment(item?.due_date)?.format('DD-MM-YYYY'),

                payment_status:
                  item?.payment_status && item?.payment_status === 1
                    ? 'Due'
                    : item?.payment_status === 2
                    ? 'Partial'
                    : 'Completed',
              };
            });
          }
          const newObj = {
            list: updated,
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
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

/**
 * @desc account/billing/get-billing-detail
 */

export const getBillingData = createAsyncThunk(
  'account/billing/get-billing-detail',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/billing/get-billing-detail', data)
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
 * @desc account/billing/update-invoice
 */

export const updateBilling = createAsyncThunk(
  'account/billing/update-invoice',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/billing/update-invoice', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            toast.success(msg);
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
 * @desc account/billing/list-employee-commission
 */

export const listEmployeeCommission = createAsyncThunk(
  'account/billing/list-employee-commission',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/billing/list-employee-commission', data)
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

const BillingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBillingCurrentPage: (state, action) => {
      state.billingCurrentPage = action.payload;
    },
    setBillingPageLimit: (state, action) => {
      state.billingPageLimit = action.payload;
    },
    setBillingSearchParam: (state, action) => {
      state.billingSearchParam = action.payload;
    },
    setBillingItemType: (state, action) => {
      state.billingItemType = action.payload;
    },
    setBillingPaymentCompleted: (state, action) => {
      state.billingPaymentCompleted = action.payload;
    },
    setBillingPaymentStatus: (state, action) => {
      state.billingPaymentStatus = action.payload;
    },
    setBillingListCheckboxs: (state, action) => {
      state.billingListCheckboxs = action.payload;
    },
    setBillingDetail: (state, action) => {
      state.billingDetail = action.payload;
    },
  },
  extraReducers: {
    [getBillingList.pending]: state => {
      state.billingListLoading = true;
    },
    [getBillingList.rejected]: state => {
      state.billingListData = {};
      state.billingListLoading = false;
    },
    [getBillingList.fulfilled]: (state, action) => {
      state.billingListData = action.payload;
      state.billingListLoading = false;
    },
    [getBillingData.pending]: state => {
      state.billingDataLoading = true;
    },
    [getBillingData.rejected]: state => {
      state.billingData = {};
      state.billingDataLoading = false;
    },
    [getBillingData.fulfilled]: (state, action) => {
      state.billingData = action.payload;
      state.billingDataLoading = false;
    },
    [updateBilling.pending]: state => {
      state.updateBillingLoading = true;
    },
    [updateBilling.rejected]: state => {
      state.updateBillingData = {};
      state.updateBillingLoading = false;
    },
    [updateBilling.fulfilled]: (state, action) => {
      state.updateBillingData = action.payload;
      state.updateBillingLoading = false;
    },
    [listEmployeeCommission.pending]: state => {
      state.listEmployeeCommissionLoading = true;
    },
    [listEmployeeCommission.rejected]: state => {
      state.listEmployeeCommissionData = {};
      state.listEmployeeCommissionLoading = false;
    },
    [listEmployeeCommission.fulfilled]: (state, action) => {
      state.listEmployeeCommissionData = action.payload;
      state.listEmployeeCommissionLoading = false;
    },
  },
});

export const {
  setBillingDetail,
  setBillingCurrentPage,
  setBillingPageLimit,
  setBillingSearchParam,
  setBillingItemType,
  setBillingPaymentStatus,
  setBillingPaymentCompleted,
  setBillingListCheckboxs,
} = BillingSlice.actions;

export default BillingSlice.reducer;
