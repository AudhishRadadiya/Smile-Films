import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';

let initialState = {
  clientCompanyList: {},
  clientCompanyLoading: false,
  selectCountry: '',
  selectState: '',
  isAddClientCompany: false,
  isUpdateClientCompany: false,
  isDeleteClientCompany: false,
  clientCompanyPageLimit: 10,
  clientCompanyCurrentPage: 1,
  clientCompanySearchParam: '',
  selectedClientCompanyData: {},
  // clientCompanyIncomeDate: [],
  clientCompanyTransactionData: {},
  clientCompanyTransactionPreviewData: {},
  companyTransactioLoading: false,
  companyTransactionCurrentPage: 1,
  companyTransactionPageLimit: 10,
  clientCompanyTransactionDate: [],

  companyInvoiceLoading: false,
  companyActivityInvoiceData: {},
  invoiceStatus: [],
  activityInvoiceCurrentPage: 1,
  activityInvoicePageLimit: 10,

  companyProjectLoading: false,
  companyActivityProjectsData: {},
  projectStatus: [],
  activityProjectsCurrentPage: 1,
  activityProjectsPageLimit: 10,

  companyQuotationLoading: false,
  companyActivityQuotationData: {},
  quotesStatus: [],
  activityQuotesCurrentPage: 1,
  activityQuotesPageLimit: 10,

  companyLedgerStatementData: [],
  companyLedgerLoading: false,
};

/**
 * @desc list-client_company
 * @param (limit, start, isActive,search)
 */

export const getClientCompanyList = createAsyncThunk(
  'client_company/list-client_company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/list-client_company', data)
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

/**
 * @desc createProduct
 */

export const addClientCompany = createAsyncThunk(
  'client_company/add-client_company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/add-client_company', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc edit-client_company
 */

export const editClientCompany = createAsyncThunk(
  'client_company/edit-client_company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/edit-client_company', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc delete-client_company
 */

export const deleteClientCompany = createAsyncThunk(
  'client_company/delete-client_company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/delete-client_company', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc get-client_company
 */

export const getClientCompany = createAsyncThunk(
  'client_company/get-client_company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/get-client_company', data)
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
 * @desc get-list-transaction
 */

export const getTransactionList = createAsyncThunk(
  'client_company/list-transaction',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/list-transaction', payload)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updatedList = {};

          if (data?.link) {
            window.open(data?.link);
          } else {
            const updatedListData = data?.list?.map(item => {
              return {
                ...item,
                created_at: item?.created_at
                  ? moment(item?.created_at?.split('T')[0]).format('DD-MM-YYYY')
                  : '',
              };
            });

            updatedList = {
              ...data,
              list: updatedListData,
            };
          }

          if (err === 0) {
            if (payload?.preview && !payload?.pdf) {
              dispatch(setClientCompanyTransactionPreviewData(data));
              resolve(data);
            } else if (!payload?.preview && !payload?.pdf) {
              dispatch(setClientCompanyTransactionData(updatedList));
              resolve(updatedList);
            }
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
 * @desc get-list-invoice
 */

export const getInvoiceList = createAsyncThunk(
  'client_company/list-invoice',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/list-invoice', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updatedListData = data?.list?.map(item => {
            return {
              ...item,
              created_at: item?.created_at
                ? moment(item?.created_at?.split('T')[0]).format('DD-MM-YYYY')
                : '',
            };
          });

          const updatedList = {
            ...data,
            list: updatedListData,
          };

          if (err === 0) {
            resolve(updatedList);
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
 * @desc get-list-project
 */

export const getProjectList = createAsyncThunk(
  'client_company/list-project',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/list-project', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updatedListData = data?.list?.map(item => {
            return {
              ...item,
              create_date: item?.create_date
                ? moment(item?.create_date?.split('T')[0]).format('DD-MM-YYYY')
                : '',
            };
          });

          const updatedList = {
            ...data,
            list: updatedListData,
          };

          if (err === 0) {
            resolve(updatedList);
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
 * @desc get-list-quotation
 */

export const getQuotationList = createAsyncThunk(
  'client_company/list-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/list-quotation', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updatedListData = data?.list?.map(item => {
            return {
              ...item,
              created_at: item?.created_at
                ? moment(item?.created_at?.split('T')[0]).format('DD-MM-YYYY')
                : '',
            };
          });

          const updatedList = {
            ...data,
            list: updatedListData,
          };

          if (err === 0) {
            resolve(updatedList);
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
 * @desc get-client_company-ledger(Statement)
 */

export const getClientCompanyLedgerList = createAsyncThunk(
  'client_company/ledger',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/ledger', payload)
        .then(res => {
          dispatch(setCompanyLedgerLoading(true));
          const { data, err, msg } = res?.data;

          let allStatementData = [];

          if (data?.link) {
            window.open(data?.link);
          } else {
            let amount = 0;

            const updatedStatementList = data?.map((item, i) => {
              const Obj = {
                ...item,
                serial_no: i !== 0 && i,
                debit_amount: item?.type === 2 ? item?.amount : '-',
                credit_amount: item?.type === 1 ? item?.amount : '-',
                balance:
                  item?.type === 1
                    ? convertIntoNumber(Math.abs(item?.amount + amount))
                    : convertIntoNumber(Math.abs(item?.amount - amount)),
                created_at: item?.created_at
                  ? i !== 0 &&
                    moment(item?.created_at?.split('T')[0]).format('DD-MM-YYYY')
                  : '',
              };

              item?.type === 2
                ? (amount -= item?.amount)
                : (amount += item?.amount);
              return Obj;
            });

            const closingBalanceObj = {
              voucher: 'Closing Balance',
              amount: convertIntoNumber(Math.abs(amount)),
              type: amount > 0 ? 1 : 2,
              debit_amount:
                amount < 0 ? convertIntoNumber(Math.abs(amount)) : '-',
              credit_amount:
                amount > 0 ? convertIntoNumber(Math.abs(amount)) : '-',
              balance: convertIntoNumber(Math.abs(amount)),
            };

            allStatementData = [...updatedStatementList, closingBalanceObj];
          }

          if (err === 0) {
            if (!payload?.pdf) {
              dispatch(setCompanyLedgerStatementData(allStatementData));
              resolve(allStatementData);
            }
            dispatch(setCompanyLedgerLoading(false));
          } else {
            toast.error(msg);
            reject(data);
            dispatch(setCompanyLedgerLoading(false));
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
          dispatch(setCompanyLedgerLoading(false));
        });
    });
  },
);

const clientCompanySlice = createSlice({
  name: 'clientCompany',
  initialState,
  reducers: {
    setSelectCountry: (state, action) => {
      state.selectCountry = action.payload;
    },
    setSelectState: (state, action) => {
      state.selectState = action.payload;
    },
    setClientCompanyCurrentPage: (state, action) => {
      state.clientCompanyCurrentPage = action.payload;
    },
    setClientCompanyPageLimit: (state, action) => {
      state.clientCompanyPageLimit = action.payload;
    },
    setIsDeleteClientCompany: (state, action) => {
      state.isDeleteClientCompany = action.payload;
    },
    setIsUpdateClientCompany: (state, action) => {
      state.isUpdateClientCompany = action.payload;
    },
    setIsAddClientCompany: (state, action) => {
      state.isAddClientCompany = action.payload;
    },
    setClientCompanySearchParam: (state, action) => {
      state.clientCompanySearchParam = action.payload;
    },
    setClientCompanyList: (state, action) => {
      state.clientCompanyList = action.payload;
    },
    // setClientCompanyIncomeDate: (state, action) => {
    //   state.clientCompanyIncomeDate = action.payload;
    // },
    setClientCompanyTransactionDate: (state, action) => {
      state.clientCompanyTransactionDate = action.payload;
    },
    setCompanyTransactionPageLimit: (state, action) => {
      state.companyTransactionPageLimit = action.payload;
    },
    setCompanyTransactionCurrentPage: (state, action) => {
      state.companyTransactionCurrentPage = action.payload;
    },
    setClientCompanyTransactionData: (state, action) => {
      state.clientCompanyTransactionData = action.payload;
    },
    setClientCompanyTransactionPreviewData: (state, action) => {
      state.clientCompanyTransactionPreviewData = action.payload;
    },

    setInvoiceStatus: (state, action) => {
      state.invoiceStatus = action.payload;
    },
    setActivityInvoiceCurrentPage: (state, action) => {
      state.activityInvoiceCurrentPage = action.payload;
    },
    setActivityInvoicePageLimit: (state, action) => {
      state.activityInvoicePageLimit = action.payload;
    },

    setProjectStatus: (state, action) => {
      state.projectStatus = action.payload;
    },
    setActivityProjectsCurrentPage: (state, action) => {
      state.activityProjectsCurrentPage = action.payload;
    },
    setActivityProjectsPageLimit: (state, action) => {
      state.activityProjectsPageLimit = action.payload;
    },

    setQuotesStatus: (state, action) => {
      state.quotesStatus = action.payload;
    },
    setActivityQuotesCurrentPage: (state, action) => {
      state.activityQuotesCurrentPage = action.payload;
    },
    setActivityQuotesPageLimit: (state, action) => {
      state.activityQuotesPageLimit = action.payload;
    },
    setCompanyLedgerStatementData: (state, action) => {
      state.companyLedgerStatementData = action.payload;
    },
    setCompanyLedgerLoading: (state, action) => {
      state.companyLedgerLoading = action.payload;
    },
  },
  extraReducers: {
    [getClientCompanyList.pending]: state => {
      state.clientCompanyList = {};
      state.clientCompanyLoading = true;
    },
    [getClientCompanyList.rejected]: state => {
      state.clientCompanyList = {};
      state.clientCompanyLoading = false;
    },
    [getClientCompanyList.fulfilled]: (state, action) => {
      state.clientCompanyList = action.payload?.data;
      state.clientCompanyLoading = false;
    },
    [addClientCompany.pending]: state => {
      state.isAddClientCompany = false;
      state.clientCompanyLoading = true;
    },
    [addClientCompany.rejected]: state => {
      state.isAddClientCompany = false;
      state.clientCompanyLoading = false;
    },
    [addClientCompany.fulfilled]: state => {
      state.isAddClientCompany = true;
      state.clientCompanyLoading = false;
    },
    [editClientCompany.pending]: state => {
      state.isUpdateClientCompany = false;
      state.clientCompanyLoading = true;
    },
    [editClientCompany.rejected]: state => {
      state.isUpdateClientCompany = false;
      state.clientCompanyLoading = false;
    },
    [editClientCompany.fulfilled]: state => {
      state.isUpdateClientCompany = true;
      state.clientCompanyLoading = false;
    },
    [deleteClientCompany.pending]: state => {
      state.isDeleteClientCompany = false;
      state.clientCompanyLoading = true;
    },
    [deleteClientCompany.rejected]: state => {
      state.isDeleteClientCompany = false;
      state.clientCompanyLoading = false;
    },
    [deleteClientCompany.fulfilled]: state => {
      state.isDeleteClientCompany = true;
      state.clientCompanyLoading = false;
    },
    [getClientCompany.pending]: state => {
      state.selectedClientCompanyData = {};
      state.clientCompanyLoading = true;
    },
    [getClientCompany.rejected]: state => {
      state.selectedClientCompanyData = {};
      state.clientCompanyLoading = false;
    },
    [getClientCompany.fulfilled]: (state, action) => {
      state.selectedClientCompanyData = action.payload?.data;
      state.clientCompanyLoading = false;
    },
    [getTransactionList.pending]: state => {
      // state.clientCompanyTransactionData = {};
      state.companyTransactioLoading = true;
    },
    [getTransactionList.rejected]: state => {
      // state.clientCompanyTransactionData = {};
      state.companyTransactioLoading = false;
    },
    [getTransactionList.fulfilled]: (state, action) => {
      // state.clientCompanyTransactionData = action.payload;
      state.companyTransactioLoading = false;
    },
    [getInvoiceList.pending]: state => {
      state.companyActivityInvoiceData = {};
      state.companyInvoiceLoading = true;
    },
    [getInvoiceList.rejected]: state => {
      state.companyActivityInvoiceData = {};
      state.companyInvoiceLoading = false;
    },
    [getInvoiceList.fulfilled]: (state, action) => {
      state.companyActivityInvoiceData = action.payload;
      state.companyInvoiceLoading = false;
    },
    [getProjectList.pending]: state => {
      state.companyActivityProjectsData = {};
      state.companyProjectLoading = true;
    },
    [getProjectList.rejected]: state => {
      state.companyActivityProjectsData = {};
      state.companyProjectLoading = false;
    },
    [getProjectList.fulfilled]: (state, action) => {
      state.companyActivityProjectsData = action.payload;
      state.companyProjectLoading = false;
    },
    [getQuotationList.pending]: state => {
      state.companyActivityQuotationData = {};
      state.companyQuotationLoading = true;
    },
    [getQuotationList.rejected]: state => {
      state.companyActivityQuotationData = {};
      state.companyQuotationLoading = false;
    },
    [getQuotationList.fulfilled]: (state, action) => {
      state.companyActivityQuotationData = action.payload;
      state.companyQuotationLoading = false;
    },
    [getClientCompanyLedgerList.pending]: state => {
      // state.companyLedgerStatementData = [];
      state.companyLedgerLoading = true;
    },
    [getClientCompanyLedgerList.rejected]: state => {
      // state.companyLedgerStatementData = [];
      state.companyLedgerLoading = false;
    },
    [getClientCompanyLedgerList.fulfilled]: (state, action) => {
      // state.companyLedgerStatementData = action.payload;
      state.companyLedgerLoading = false;
    },
  },
});

export const {
  setClientCompanyCurrentPage,
  setClientCompanyPageLimit,
  setSelectState,
  setSelectCountry,
  setIsAddClientCompany,
  setIsUpdateClientCompany,
  setIsDeleteClientCompany,
  setClientCompanySearchParam,
  setClientCompanyList,
  // setClientCompanyIncomeDate,
  setClientCompanyTransactionDate,
  setCompanyTransactionPageLimit,
  setCompanyTransactionCurrentPage,
  setInvoiceStatus,
  setActivityInvoiceCurrentPage,
  setActivityInvoicePageLimit,
  setProjectStatus,
  setActivityProjectsCurrentPage,
  setActivityProjectsPageLimit,
  setQuotesStatus,
  setActivityQuotesCurrentPage,
  setActivityQuotesPageLimit,
  setClientCompanyTransactionData,
  setClientCompanyTransactionPreviewData,
  setCompanyLedgerStatementData,
  setCompanyLedgerLoading,
} = clientCompanySlice.actions;

export default clientCompanySlice.reducer;
