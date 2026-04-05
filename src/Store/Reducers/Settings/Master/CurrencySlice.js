import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  currencyList: {},
  currencyLoading: false,
  isAddCurrency: false,
  isUpdateCurrency: false,
  isDeleteCurrency: false,
  currencyPageLimit: 10,
  currencyCurrentPage: 1,
  currencySearchParam: '',
  currencyData: {},
};

/**
 * @desc list-currency
 * @param (limit, start, isActive,search)
 */

export const getCurrencyList = createAsyncThunk(
  'currency/list-currency',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('currency/list-currency', data)
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
 * @desc add-currency
 */

export const addCurrency = createAsyncThunk('currency/add-currency', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('currency/add-currency', data)
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
});

/**
 * @desc edit-currency
 */

export const editCurrency = createAsyncThunk('currency/edit-currency', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('currency/edit-currency', data)
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
});

/**
 * @desc delete-currency
 */

export const deleteCurrency = createAsyncThunk(
  'currency/delete-currency',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('currency/delete-currency', data)
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
 * @desc get-currency
 * @param (currency_id)
 */

export const getCurrencyData = createAsyncThunk(
  'currency/get-currency',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('currency/get-currency', data)
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

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrencyCurrentPage: (state, action) => {
      state.currencyCurrentPage = action.payload;
    },
    setCurrencyPageLimit: (state, action) => {
      state.currencyPageLimit = action.payload;
    },
    setIsDeleteCurrency: (state, action) => {
      state.isDeleteCurrency = action.payload;
    },
    setIsUpdateCurrency: (state, action) => {
      state.isUpdateCurrency = action.payload;
    },
    setIsAddCurrency: (state, action) => {
      state.isAddCurrency = action.payload;
    },
    setCurrencySearchParam: (state, action) => {
      state.currencySearchParam = action.payload;
    },
    setCurrencyList: (state, action) => {
      state.currencyList = action.payload;
    },
  },
  extraReducers: {
    [getCurrencyList.pending]: state => {
      state.currencyLoading = true;
    },
    [getCurrencyList.rejected]: state => {
      state.currencyList = {};
      state.currencyLoading = false;
    },
    [getCurrencyList.fulfilled]: (state, action) => {
      state.currencyList = action.payload?.data;
      state.currencyLoading = false;
    },
    [addCurrency.pending]: state => {
      state.isAddCurrency = false;
      state.currencyLoading = true;
    },
    [addCurrency.rejected]: state => {
      state.isAddCurrency = false;
      state.currencyLoading = false;
    },
    [addCurrency.fulfilled]: state => {
      state.isAddCurrency = true;
      state.currencyLoading = false;
    },
    [editCurrency.pending]: state => {
      state.isUpdateCurrency = false;
      state.currencyLoading = true;
    },
    [editCurrency.rejected]: state => {
      state.isUpdateCurrency = false;
      state.currencyLoading = false;
    },
    [editCurrency.fulfilled]: state => {
      state.isUpdateCurrency = true;
      state.currencyLoading = false;
    },
    [deleteCurrency.pending]: state => {
      state.isDeleteCurrency = false;
      state.currencyLoading = true;
    },
    [deleteCurrency.rejected]: state => {
      state.isDeleteCurrency = false;
      state.currencyLoading = false;
    },
    [deleteCurrency.fulfilled]: state => {
      state.isDeleteCurrency = true;
      state.currencyLoading = false;
    },
    [getCurrencyData.pending]: state => {
      state.currencyLoading = true;
    },
    [getCurrencyData.rejected]: state => {
      state.currencyData = {};
      state.currencyLoading = false;
    },
    [getCurrencyData.fulfilled]: (state, action) => {
      state.currencyData = action.payload?.data;
      state.currencyLoading = false;
    },
  },
});

export const {
  setCurrencyCurrentPage,
  setCurrencyPageLimit,
  setIsAddCurrency,
  setIsUpdateCurrency,
  setIsDeleteCurrency,
  setCurrencySearchParam,
  setCurrencyList,
} = currencySlice.actions;

export default currencySlice.reducer;
