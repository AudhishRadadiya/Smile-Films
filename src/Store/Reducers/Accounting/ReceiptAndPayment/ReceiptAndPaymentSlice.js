import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  receiptPaymentNo: {},
  receiptPaymentList: {},
  receiptPaymentDetails: {},
  receiptAndPaymentDate: '',
  companyWiseInvoiceList: [],
  receiptAndPaymentPageLimit: 10,
  receiptAndPaymentCurrentPage: 1,
  receiptAndPaymentSearchParam: '',
  receiptPaymentLoading: false,
  receiptPaymentNoLoading: false,
  addEditPaymentReceiptLoading: false,
  listCompanyWiseInvoiceLoading: false,

  isGetInitialValuesReceiptPayment: {
    add: false,
    edit: false,
    view: false,
  },
  addReceiptPaymentData: {},
  editReceiptPaymentData: {},
  viewReceiptPaymentData: {},
  receiptPaymentInitial: {
    type: '',
    amount: '',
    remark: '',
    payment_no: '',
    client_name: '',
    payment_type: '',
    account_id: '',
    remaining_balance: '',
    current_balance: 0,
    client_current_balance: 0,
    payment_receive_in: '',
    opening_balance_type: '',
    payment_date: new Date(),
    // balance: 0,
    // opening_balance: 0,
    total_paid_amount: 0,
    total_selected_invoices: 0,
    // account_list: [],
    payment_receiveIn_list: [],
    client_company_list: [],
    invoice_receipt_info: [],
  },
};

/**
 * @desc receipt and payment - listing :
 */

export const getReceiptPaymentlist = createAsyncThunk(
  'account/receipt_payment/list-receipt-payment',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/list-receipt-payment', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          let updatedList = [];
          if (data?.list?.length) {
            updatedList = data?.list?.map(item => {
              return {
                ...item,
                payment_date: moment(item.payment_date).format('DD-MM-YYYY'),
              };
            });
          }

          const updatedData = {
            list: updatedList,
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
          };

          if (err === 0) {
            resolve(updatedData);
          } else {
            toast.error(msg);
            reject(updatedData);
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
 * @desc receipt and payment - payment number :
 */

export const getReceiptPaymentNumber = createAsyncThunk(
  'account/receipt_payment/payment-no',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/payment-no')
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
 * @desc receipt and payment - list Company Wise Invoice :
 */

export const listCompanyWiseInvoice = createAsyncThunk(
  'account/receipt_payment/list-company-wise-invoice',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/list-company-wise-invoice', payload)
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
 * @desc receipt and payment - add payment receipt:
 */

export const addPaymentReceipt = createAsyncThunk(
  'account/receipt_payment/add-payment-receipt',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/add-payment-receipt', payload)
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
 * @desc receipt and payment - edit payment receipt :
 */

export const editPaymentReceipt = createAsyncThunk(
  'account/receipt_payment/edit-payment-receipt',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/edit-payment-receipt', payload)
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
 * @desc receipt and payment - get payment receipt :
 */

export const getReceiptPaymentDetails = createAsyncThunk(
  'account/receipt_payment/get-receipt-payment-details',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/get-receipt-payment-details', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (data?.link) {
            window.open(data?.link);
          }

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
 * @desc receipt and payment - delete payment receipt :
 */

export const deleteReceiptPayment = createAsyncThunk(
  'account/receipt_payment/delete-payment-receipt',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/receipt_payment/delete-payment-receipt', payload)
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

const ReceiptAndPaymentSlice = createSlice({
  name: 'receiptAndPayment',
  initialState,
  reducers: {
    setReceiptPaymentLoading: (state, action) => {
      state.receiptPaymentLoading = action.payload;
    },
    setReceiptAndPaymentSearchParam: (state, action) => {
      state.receiptAndPaymentSearchParam = action.payload;
    },
    setReceiptAndPaymentPageLimit: (state, action) => {
      state.receiptAndPaymentPageLimit = action.payload;
    },
    setReceiptAndPaymentCurrentPage: (state, action) => {
      state.receiptAndPaymentCurrentPage = action.payload;
    },
    setReceiptAndPaymentDate: (state, action) => {
      state.receiptAndPaymentDate = action.payload;
    },
    setIsGetInitialValuesReceiptPayment: (state, action) => {
      state.isGetInitialValuesReceiptPayment = action.payload;
    },
    setAddReceiptPaymentData: (state, action) => {
      state.addReceiptPaymentData = action.payload;
    },
    setClearAddReceiptPaymentData: state => {
      state.addReceiptPaymentData = initialState.receiptPaymentInitial;
    },
    setEditReceiptPaymentData: (state, action) => {
      state.editReceiptPaymentData = action.payload;
    },
    setClearEditReceiptPaymentData: state => {
      state.editReceiptPaymentData = initialState.receiptPaymentInitial;
    },
    setViewReceiptPaymentData: (state, action) => {
      state.viewReceiptPaymentData = action.payload;
    },
    setClearViewEditReceiptPaymentData: state => {
      state.viewReceiptPaymentData = initialState.receiptPaymentInitial;
    },
  },
  extraReducers: {
    [getReceiptPaymentlist.pending]: state => {
      state.receiptPaymentLoading = true;
    },
    [getReceiptPaymentlist.rejected]: state => {
      state.receiptPaymentList = [];
      state.receiptPaymentLoading = false;
    },
    [getReceiptPaymentlist.fulfilled]: (state, action) => {
      state.receiptPaymentList = action.payload;
      state.receiptPaymentLoading = false;
    },
    [getReceiptPaymentNumber.pending]: state => {
      state.receiptPaymentNoLoading = true;
    },
    [getReceiptPaymentNumber.rejected]: state => {
      state.receiptPaymentNo = '';
      state.receiptPaymentNoLoading = false;
    },
    [getReceiptPaymentNumber.fulfilled]: (state, action) => {
      state.receiptPaymentNo = action.payload;
      state.receiptPaymentNoLoading = false;
    },
    [listCompanyWiseInvoice.pending]: state => {
      state.listCompanyWiseInvoiceLoading = true;
    },
    [listCompanyWiseInvoice.rejected]: state => {
      state.companyWiseInvoiceList = [];
      state.listCompanyWiseInvoiceLoading = false;
    },
    [listCompanyWiseInvoice.fulfilled]: (state, action) => {
      state.companyWiseInvoiceList = action.payload;
      state.listCompanyWiseInvoiceLoading = false;
    },
    [addPaymentReceipt.pending]: state => {
      state.addEditPaymentReceiptLoading = true;
    },
    [addPaymentReceipt.rejected]: state => {
      state.addEditPaymentReceiptLoading = false;
    },
    [addPaymentReceipt.fulfilled]: (state, action) => {
      state.addEditPaymentReceiptLoading = false;
    },
    [editPaymentReceipt.pending]: state => {
      state.addEditPaymentReceiptLoading = true;
    },
    [editPaymentReceipt.rejected]: state => {
      state.addEditPaymentReceiptLoading = false;
    },
    [editPaymentReceipt.fulfilled]: (state, action) => {
      state.addEditPaymentReceiptLoading = false;
    },
    [getReceiptPaymentDetails.pending]: state => {
      state.addEditPaymentReceiptLoading = true;
    },
    [getReceiptPaymentDetails.rejected]: state => {
      state.receiptPaymentDetails = {};
      state.addEditPaymentReceiptLoading = false;
    },
    [getReceiptPaymentDetails.fulfilled]: (state, action) => {
      state.receiptPaymentDetails = action.payload;
      state.addEditPaymentReceiptLoading = false;
    },
    [deleteReceiptPayment.pending]: state => {
      state.addEditPaymentReceiptLoading = true;
    },
    [deleteReceiptPayment.rejected]: state => {
      state.addEditPaymentReceiptLoading = false;
    },
    [deleteReceiptPayment.fulfilled]: (state, action) => {
      state.addEditPaymentReceiptLoading = false;
    },
  },
});

export const {
  setReceiptPaymentLoading,
  setReceiptAndPaymentSearchParam,
  setReceiptAndPaymentPageLimit,
  setReceiptAndPaymentCurrentPage,
  setReceiptAndPaymentDate,
  setIsGetInitialValuesReceiptPayment,
  setAddReceiptPaymentData,
  setClearAddReceiptPaymentData,
  setEditReceiptPaymentData,
  setClearEditReceiptPaymentData,
  setViewReceiptPaymentData,
  setClearViewEditReceiptPaymentData,
} = ReceiptAndPaymentSlice.actions;

export default ReceiptAndPaymentSlice.reducer;
