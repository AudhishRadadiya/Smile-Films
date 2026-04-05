import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  purchaseInvoiceLoading: false,
  purchaseInvoiceNoLoading: false,
  addPurchaseInvoiceLoading: false,
  editPurchaseInvoiceLoading: false,
  purchaseInvoiceDetailLoading: false,
  purchaseInvoicePageLimit: 10,
  purchaseInvoiceCurrentPage: 1,
  purchaseInvoiceSearchParam: '',

  purchaseInvoiceNo: '',
  purchaseInvoiceList: {},
  purchaseInvoiceDate: '',
  // purchaseInvoiceDate: [],

  isGetInitialValuesPurchaseInvoice: {
    add: false,
    update: false,
    view: false,
  },
  addPurchaseInvoiceData: {},
  viewPurchaseInvoiceData: {},
  updatePurchaseInvoiceData: {},
  purchaseInvoiceInitial: {
    purchase_invoice_no: '',
    create_date: new Date(),
    client_company_list: [],
    purchase_items: [],
    client_company_id: '',
    client_company: '',
    amount: '',
    terms_condition: '',
    sub_total: 0,
    discount: '',
    total_amount: 0,
    company_logo: '',
  },
  purchaseInvoiceStartDate: '',
  purchaseInvoiceEndDate: '',
};

/**
 * @desc Purchase Invoice - listing :
 */

export const getPurchaseInvoiceList = createAsyncThunk(
  'account/purchase_invoice/list-purchase_invoice',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/list-purchase_invoice', payload)
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
 * @desc Purchase Invoice - get Invoice Number :
 */

export const getPurchaseInvoiceNumber = createAsyncThunk(
  'account/purchase_invoice/purchase_invoice-no',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/purchase_invoice-no', payload)
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
 * @desc Purchase Invoice - Add details :
 */

export const addPurchaseInvoice = createAsyncThunk(
  'account/purchase_invoice/add-purchase_invoice',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/add-purchase_invoice', payload)
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
 * @desc Purchase Invoice - Edit details :
 */

export const editPurchaseInvoice = createAsyncThunk(
  'account/purchase_invoice/edit-purchase_invoice',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/edit-purchase_invoice', payload)
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
 * @desc Purchase Invoice - Delete details :
 */

export const deletePurchaseInvoice = createAsyncThunk(
  'account/purchase_invoice/delete-purchase_invoice',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/delete-purchase_invoice', data)
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

/**
 * @desc Purchase Invoice - get details :
 */

export const getPurchaseInvoiceDetail = createAsyncThunk(
  'account/purchase_invoice/get-purchase_invoice',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/purchase_invoice/get-purchase_invoice', payload)
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

const PurchaseInvoiceSlice = createSlice({
  name: 'purchaseInvoice',
  initialState,
  reducers: {
    setPurchaseInvoiceLoading: (state, action) => {
      state.purchaseInvoiceLoading = action.payload;
    },
    setPurchaseInvoiceSearchParam: (state, action) => {
      state.purchaseInvoiceSearchParam = action.payload;
    },
    setPurchaseInvoicePageLimit: (state, action) => {
      state.purchaseInvoicePageLimit = action.payload;
    },
    setPurchaseInvoiceCurrentPage: (state, action) => {
      state.purchaseInvoiceCurrentPage = action.payload;
    },
    setPurchaseInvoiceDate: (state, action) => {
      state.purchaseInvoiceDate = action.payload;
    },
    setIsGetInitialValuesPurchaseInvoice: (state, action) => {
      state.isGetInitialValuesPurchaseInvoice = action.payload;
    },
    setAddPurchaseInvoiceData: (state, action) => {
      state.addPurchaseInvoiceData = action.payload;
    },
    setClearAddPurchaseInvoiceData: state => {
      state.addPurchaseInvoiceData = initialState.purchaseInvoiceInitial;
    },
    setUpdatePurchaseInvoiceData: (state, action) => {
      state.updatePurchaseInvoiceData = action.payload;
    },
    setClearUpdatePurchaseInvoiceData: state => {
      state.updatePurchaseInvoiceData = initialState.purchaseInvoiceInitial;
    },
    setViewPurchaseInvoiceData: (state, action) => {
      state.viewPurchaseInvoiceData = action.payload;
    },
    setClearViewEditPurchaseInvoiceData: state => {
      state.viewPurchaseInvoiceData = initialState.purchaseInvoiceInitial;
    },
    setPurchaseInvoiceStartDate: (state, action) => {
      state.purchaseInvoiceStartDate = action.payload;
    },
    setPurchaseInvoiceEndDate: (state, action) => {
      state.purchaseInvoiceEndDate = action.payload;
    },
  },

  extraReducers: {
    [getPurchaseInvoiceList.pending]: state => {
      state.purchaseInvoiceLoading = true;
    },
    [getPurchaseInvoiceList.rejected]: state => {
      state.purchaseInvoiceList = {};
      state.purchaseInvoiceLoading = false;
    },
    [getPurchaseInvoiceList.fulfilled]: (state, action) => {
      state.purchaseInvoiceList = action.payload;
      state.purchaseInvoiceLoading = false;
    },
    [getPurchaseInvoiceNumber.pending]: state => {
      state.purchaseInvoiceNoLoading = true;
    },
    [getPurchaseInvoiceNumber.rejected]: state => {
      state.purchaseInvoiceNo = '';
      state.purchaseInvoiceNoLoading = false;
    },
    [getPurchaseInvoiceNumber.fulfilled]: (state, action) => {
      state.purchaseInvoiceNo = action.payload;
      state.purchaseInvoiceNoLoading = false;
    },
    [addPurchaseInvoice.pending]: state => {
      state.addPurchaseInvoiceLoading = true;
    },
    [addPurchaseInvoice.rejected]: state => {
      state.addPurchaseInvoiceLoading = false;
    },
    [addPurchaseInvoice.fulfilled]: (state, action) => {
      state.addPurchaseInvoiceLoading = false;
    },
    [editPurchaseInvoice.pending]: state => {
      state.editPurchaseInvoiceLoading = true;
    },
    [editPurchaseInvoice.rejected]: state => {
      state.editPurchaseInvoiceLoading = false;
    },
    [editPurchaseInvoice.fulfilled]: (state, action) => {
      state.editPurchaseInvoiceLoading = false;
    },
    [getPurchaseInvoiceDetail.pending]: state => {
      state.purchaseInvoiceDetailLoading = true;
    },
    [getPurchaseInvoiceDetail.rejected]: state => {
      state.purchaseInvoiceDetailLoading = false;
    },
    [getPurchaseInvoiceDetail.fulfilled]: (state, action) => {
      state.purchaseInvoiceDetailLoading = false;
    },
    [deletePurchaseInvoice.pending]: state => {
      state.purchaseInvoiceLoading = true;
    },
    [deletePurchaseInvoice.rejected]: state => {
      state.purchaseInvoiceList = {};
      state.purchaseInvoiceLoading = false;
    },
    [deletePurchaseInvoice.fulfilled]: (state, action) => {
      state.purchaseInvoiceList = action.payload?.data;
      state.purchaseInvoiceLoading = false;
    },
  },
});

export const {
  setPurchaseInvoiceLoading,
  setPurchaseInvoiceSearchParam,
  setPurchaseInvoicePageLimit,
  setPurchaseInvoiceCurrentPage,
  setPurchaseInvoiceDate,
  setIsGetInitialValuesPurchaseInvoice,
  setAddPurchaseInvoiceData,
  setClearAddPurchaseInvoiceData,
  setUpdatePurchaseInvoiceData,
  setClearUpdatePurchaseInvoiceData,
  setViewPurchaseInvoiceData,
  setClearViewEditPurchaseInvoiceData,
  setPurchaseInvoiceStartDate,
  setPurchaseInvoiceEndDate,
} = PurchaseInvoiceSlice.actions;

export default PurchaseInvoiceSlice.reducer;
