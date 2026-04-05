import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  paymentNo: '',
  addJournalEntryData: {},
  getJournalEntryData: {},
  editJournalEntryData: {},
  listJournalEntryData: {},
  deleteJournalEntryData: {},
  journalEntryCurrentPage: 1,
  journalEntryPageLimit: 10,
  journalEntrySearchParam: '',
  journalEntryStartDate: '',
  journalEntryEndDate: '',
  date: '',

  isGetInitialValuesJournalEntry: {
    add: false,
    update: false,
    view: false,
  },
  createJournalEntryData: {},
  viewJournalEntryData: {},
  updateJournalEntryData: {},
  journalEntryInitialData: {
    payment_no: '',
    create_date: new Date(),
    payment_type: '',
    payment_group: '',
    remark: '',
    payment_group_list: [],
    account_list: [],
    journalEntryData: [
      {
        account_id: '',
        transaction_type: 'CR',
        credit: 0,
        debit: 0,
      },
      {
        account_id: '',
        transaction_type: 'DB',
        credit: 0,
        debit: 0,
      },
    ],
  },
};

/**
 * @desc account/journal_entry/payment-no:
 */

export const getPaymentNo = createAsyncThunk(
  'account/journal_entry/payment-no',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/payment-no')
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
 * @desc account/journal_entry/add-journal-entry
 */

export const addJournalEntry = createAsyncThunk(
  'account/journal_entry/add-journal-entry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/add-journal-entry', data)
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
 * @desc account/journal_entry/get-journal-entry
 */

export const getJournalEntry = createAsyncThunk(
  'account/journal_entry/get-journal-entry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/get-journal-entry', data)
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
 * @desc account/journal_entry/edit-journal-entry
 */

export const editJournalEntry = createAsyncThunk(
  'account/journal_entry/edit-journal-entry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/edit-journal-entry', data)
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
 * @desc account/journal_entry/list-journal-entry
 */

export const listJournalEntry = createAsyncThunk(
  'account/journal_entry/list-journal-entry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/list-journal-entry', data)
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
 * @desc account/journal_entry/delete-journal-entry
 */

export const deleteJournalEntry = createAsyncThunk(
  'account/journal_entry/delete-journal-entry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/journal_entry/delete-journal-entry', data)
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

const JournalEntrySlice = createSlice({
  name: 'journalEntry',
  initialState,
  reducers: {
    setJournalEntryCurrentPage: (state, action) => {
      state.journalEntryCurrentPage = action.payload;
    },
    setJournalEntryPageLimit: (state, action) => {
      state.journalEntryPageLimit = action.payload;
    },
    setJournalEntrySearchParam: (state, action) => {
      state.journalEntrySearchParam = action.payload;
    },
    setJournalEntryStartDate: (state, action) => {
      state.journalEntryStartDate = action.payload;
    },
    setJournalEntryEndDate: (state, action) => {
      state.journalEntryEndDate = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setIsGetInitialValuesJournalEntry: (state, action) => {
      state.isGetInitialValuesJournalEntry = action.payload;
    },
    setCreateJournalEntryData: (state, action) => {
      state.createJournalEntryData = action.payload;
    },
    setClearCreateJournalEntryData: state => {
      state.createJournalEntryData = initialState.journalEntryInitialData;
    },
    setUpdateJournalEntryData: (state, action) => {
      state.updateJournalEntryData = action.payload;
    },
    setClearUpdateJournalEntryData: state => {
      state.updateJournalEntryData = initialState.journalEntryInitialData;
    },
    setViewJournalEntryData: (state, action) => {
      state.viewJournalEntryData = action.payload;
    },
    setClearViewJournalEntryData: state => {
      state.viewJournalEntryData = initialState.journalEntryInitialData;
    },
  },
  extraReducers: {
    [getPaymentNo.pending]: state => {
      state.paymentNoLoading = true;
    },
    [getPaymentNo.rejected]: state => {
      state.paymentNo = '';
      state.paymentNoLoading = false;
    },
    [getPaymentNo.fulfilled]: (state, action) => {
      state.paymentNo = action.payload;
      state.paymentNoLoading = false;
    },
    [addJournalEntry.pending]: state => {
      state.addJournalEntryLoading = true;
    },
    [addJournalEntry.rejected]: state => {
      state.addJournalEntryData = {};
      state.addJournalEntryLoading = false;
    },
    [addJournalEntry.fulfilled]: (state, action) => {
      state.addJournalEntryData = action.payload;
      state.addJournalEntryLoading = false;
    },
    [getJournalEntry.pending]: state => {
      state.getJournalEntryLoading = true;
    },
    [getJournalEntry.rejected]: state => {
      state.getJournalEntryData = {};
      state.getJournalEntryLoading = false;
    },
    [getJournalEntry.fulfilled]: (state, action) => {
      state.getJournalEntryData = action.payload;
      state.getJournalEntryLoading = false;
    },
    [editJournalEntry.pending]: state => {
      state.editJournalEntryLoading = true;
    },
    [editJournalEntry.rejected]: state => {
      state.editJournalEntryData = {};
      state.editJournalEntryLoading = false;
    },
    [editJournalEntry.fulfilled]: (state, action) => {
      state.editJournalEntryData = action.payload;
      state.editJournalEntryLoading = false;
    },
    [listJournalEntry.pending]: state => {
      state.listJournalEntryLoading = true;
    },
    [listJournalEntry.rejected]: state => {
      state.listJournalEntryData = {};
      state.listJournalEntryLoading = false;
    },
    [listJournalEntry.fulfilled]: (state, action) => {
      state.listJournalEntryData = action.payload;
      state.listJournalEntryLoading = false;
    },
    [deleteJournalEntry.pending]: state => {
      state.deleteJournalEntryLoading = true;
    },
    [deleteJournalEntry.rejected]: state => {
      state.deleteJournalEntryData = {};
      state.deleteJournalEntryLoading = false;
    },
    [deleteJournalEntry.fulfilled]: (state, action) => {
      state.deleteJournalEntryData = action.payload;
      state.deleteJournalEntryLoading = false;
    },
  },
});

export const {
  setJournalEntryCurrentPage,
  setJournalEntryPageLimit,
  setJournalEntrySearchParam,
  setJournalEntryStartDate,
  setJournalEntryEndDate,
  setDate,
  setIsGetInitialValuesJournalEntry,
  setCreateJournalEntryData,
  setClearCreateJournalEntryData,
  setUpdateJournalEntryData,
  setClearUpdateJournalEntryData,
  setViewJournalEntryData,
  setClearViewJournalEntryData,
} = JournalEntrySlice.actions;

export default JournalEntrySlice.reducer;
