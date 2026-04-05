import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  generalBillingLoading: false,
  addGeneralBillingLoading: false,
  editGeneralBillingLoading: false,
  generalBillingDetailLoading: false,
  generalBillingPageLimit: 10,
  generalBillingCurrentPage: 1,
  generalBillingSearchParam: '',
  generalBillingDate: '',
  generalBillingStartDate: '',
  generalBillingEndDate: '',
  generalBillingList: {},
  addGeneralBillingData: {},
  viewGeneralBillingData: {},
  editGeneralBillingData: {},
  isGetInitialValuesGeneralBilling: {
    add: false,
    edit: false,
    view: false,
  },
  generalBillingInitial: {
    client_name: '',
    mobile_number: '',
    account_id: '',
    due_date: null,
    time: null,
    data_size: '',
    payment_method: '',
    billing_inquiry: [],
    currency: '',
    sub_total: 0,
    discount: 0,
    tax_percentage: 0,
    tax: 0,
    total_amount: 0,
    conversation_rate: 1,
    description: '',
    billing_items: [],
    selected_currency: null,
    general_billing_no: '',
  },
  generalBillingNoLoading: false,
  generalBillingNo: '',
  companyData: {},
};

/**
 * @desc General Billing - listing :
 */

export const getGeneralBillingList = createAsyncThunk(
  'general/billing/list-billing',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('general/billing/list-billing', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
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
 * @desc General Billing - get Billing Number :
 */

export const getGeneralBillingNumber = createAsyncThunk(
  'general/billing/billing-number',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('general/billing/billing-number', payload)
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
 * @desc General Billing - Add details :
 */

export const addGeneralBilling = createAsyncThunk(
  'general/billing/add-billing',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('general/billing/add-billing', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
            toast.success(msg);
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
 * @desc General Billing - Edit details :
 */

export const editGeneralBilling = createAsyncThunk(
  'general/billing/edit-billing',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('general/billing/edit-billing', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
            toast.success(msg);
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
 * @desc General Billing - Delete details :
 */

// export const deleteGeneralBilling = createAsyncThunk(
//   'account/general/billing/delete-general/billing',
//   data => {
//     return new Promise((resolve, reject) => {
//       axios
//         .post('account/general/billing/delete-general/billing', data)
//         .then(({ data }) => {
//           if (data?.err === 0) {
//             resolve({ data: data?.data });
//           } else {
//             toast.error(data?.msg);
//             reject(data);
//           }
//         })
//         .catch(errors => {
//           toast.error(errors);
//           reject(errors);
//         });
//     });
//   },
// );

/**
 * @desc General Billing - get details :
 */

export const getGeneralBillingDetail = createAsyncThunk(
  'general/billing/get-billing',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('general/billing/get-billing', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            if (payload?.pdf === true) {
              window.open(data?.link, '_blank');
            }
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

const GeneralBillingSlice = createSlice({
  name: 'generalBilling',
  initialState,
  reducers: {
    setGeneralBillingLoading: (state, action) => {
      state.generalBillingLoading = action.payload;
    },
    setGeneralBillingSearchParam: (state, action) => {
      state.generalBillingSearchParam = action.payload;
    },
    setGeneralBillingPageLimit: (state, action) => {
      state.generalBillingPageLimit = action.payload;
    },
    setGeneralBillingCurrentPage: (state, action) => {
      state.generalBillingCurrentPage = action.payload;
    },
    setGeneralBillingDate: (state, action) => {
      state.generalBillingDate = action.payload;
    },
    setIsGetInitialValuesGeneralBilling: (state, action) => {
      state.isGetInitialValuesGeneralBilling = action.payload;
    },
    setAddGeneralBillingData: (state, action) => {
      state.addGeneralBillingData = action.payload;
    },
    setClearAddGeneralBillingData: state => {
      state.addGeneralBillingData = initialState.generalBillingInitial;
    },
    setEditGeneralBillingData: (state, action) => {
      state.editGeneralBillingData = action.payload;
    },
    setClearEditGeneralBillingData: state => {
      state.editGeneralBillingData = initialState.generalBillingInitial;
    },
    setViewGeneralBillingData: (state, action) => {
      state.viewGeneralBillingData = action.payload;
    },
    setClearViewEditGeneralBillingData: state => {
      state.viewGeneralBillingData = initialState.generalBillingInitial;
    },
    setGeneralBillingStartDate: (state, action) => {
      state.generalBillingStartDate = action.payload;
    },
    setGeneralBillingEndDate: (state, action) => {
      state.generalBillingEndDate = action.payload;
    },
  },

  extraReducers: {
    [getGeneralBillingList.pending]: state => {
      state.generalBillingLoading = true;
    },
    [getGeneralBillingList.rejected]: state => {
      state.generalBillingList = {};
      state.generalBillingLoading = false;
    },
    [getGeneralBillingList.fulfilled]: (state, action) => {
      state.generalBillingList = action.payload;
      state.generalBillingLoading = false;
    },
    [getGeneralBillingNumber.pending]: state => {
      state.generalBillingNoLoading = true;
    },
    [getGeneralBillingNumber.rejected]: state => {
      state.generalBillingNo = '';
      state.generalBillingNoLoading = false;
    },
    [getGeneralBillingNumber.fulfilled]: (state, action) => {
      state.generalBillingNo = action.payload;
      state.generalBillingNoLoading = false;
    },
    [addGeneralBilling.pending]: state => {
      state.addGeneralBillingLoading = true;
    },
    [addGeneralBilling.rejected]: state => {
      state.addGeneralBillingLoading = false;
    },
    [addGeneralBilling.fulfilled]: (state, action) => {
      state.addGeneralBillingLoading = false;
    },
    [editGeneralBilling.pending]: state => {
      state.editGeneralBillingLoading = true;
    },
    [editGeneralBilling.rejected]: state => {
      state.editGeneralBillingLoading = false;
    },
    [editGeneralBilling.fulfilled]: (state, action) => {
      state.editGeneralBillingLoading = false;
    },
    [getGeneralBillingDetail.pending]: state => {
      state.generalBillingDetailLoading = true;
    },
    [getGeneralBillingDetail.rejected]: state => {
      state.generalBillingDetailLoading = false;
    },
    [getGeneralBillingDetail.fulfilled]: (state, action) => {
      state.generalBillingDetailLoading = false;
    },
    // [deleteGeneralBilling.pending]: state => {
    //   state.generalBillingLoading = true;
    // },
    // [deleteGeneralBilling.rejected]: state => {
    //   state.generalBillingList = {};
    //   state.generalBillingLoading = false;
    // },
    // [deleteGeneralBilling.fulfilled]: (state, action) => {
    //   state.generalBillingList = action.payload?.data;
    //   state.generalBillingLoading = false;
    // },
  },
});

export const {
  setGeneralBillingLoading,
  setGeneralBillingSearchParam,
  setGeneralBillingPageLimit,
  setGeneralBillingCurrentPage,
  setGeneralBillingDate,
  setIsGetInitialValuesGeneralBilling,
  setAddGeneralBillingData,
  setClearAddGeneralBillingData,
  setEditGeneralBillingData,
  setClearEditGeneralBillingData,
  setViewGeneralBillingData,
  setClearViewEditGeneralBillingData,
  setGeneralBillingStartDate,
  setGeneralBillingEndDate,
} = GeneralBillingSlice.actions;

export default GeneralBillingSlice.reducer;
