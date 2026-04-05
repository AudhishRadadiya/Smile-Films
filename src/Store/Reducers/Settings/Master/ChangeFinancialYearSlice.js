import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  changeYearList: {},
  changeYearLoading: false,
  isAddChangeFinancialYear: false,
  isUpdateChangeFinancialYear: false,
  isDeleteChangeFinancialYear: false,
  changeYearPageLimit: 10,
  changeYearCurrentPage: 1,
  changeYearSearchParam: '',
  changeFinancialYear: {},
};

/**
 * @desc getChangeFinancialYearList
 * @param (start, limit, search, isActive)
 */

export const getChangeFinancialYearList = createAsyncThunk(
  '/financial_year/list-financial_year',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/financial_year/list-financial_year', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve({ data: data });
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
 * @desc getChangeFinancialYearData
 * @param (financial_id)
 */

export const getChangeFinancialYearData = createAsyncThunk(
  'financial_year/get-financial_year',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('financial_year/get-financial_year', payload)
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
 * @desc createChangeFinancialYear
 */

export const addChangeFinancialYear = createAsyncThunk(
  'financial_year/add-financial_year',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('financial_year/add-financial_year', payload)
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
 * @desc updateChangeFinancialYear
 */

export const updateChangeFinancialYear = createAsyncThunk(
  'financial_year/edit-financial_year',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('financial_year/edit-financial_year', payload)
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
 * @desc deleteChangeFinancialYear
 * @param (financial_id)
 */

export const deleteChangeFinancialYear = createAsyncThunk(
  'financial_year/delete-financial_year',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('financial_year/delete-financial_year', payload)
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

const changeFinancialYearSlice = createSlice({
  name: 'changeFinancialYear',
  initialState,
  reducers: {
    setChangeYearCurrentPage: (state, action) => {
      state.changeYearCurrentPage = action.payload;
    },
    setChangeYearPageLimit: (state, action) => {
      state.changeYearPageLimit = action.payload;
    },
    setIsDeleteChangeFinancialYear: (state, action) => {
      state.isDeleteChangeFinancialYear = action.payload;
    },
    setIsUpdateChangeFinancialYear: (state, action) => {
      state.isUpdateChangeFinancialYear = action.payload;
    },
    setIsAddChangeFinancialYear: (state, action) => {
      state.isAddChangeFinancialYear = action.payload;
    },
    setChangeYearSearchParam: (state, action) => {
      state.changeYearSearchParam = action.payload;
    },
    setChangeYearList: (state, action) => {
      state.changeYearList = action.payload;
    },
  },
  extraReducers: {
    [getChangeFinancialYearList.pending]: state => {
      state.changeYearLoading = true;
    },
    [getChangeFinancialYearList.rejected]: state => {
      state.changeYearList = [];
      state.changeYearLoading = false;
    },
    [getChangeFinancialYearList.fulfilled]: (state, action) => {
      state.changeYearList = action.payload?.data;
      state.changeYearLoading = false;
    },
    [getChangeFinancialYearData.pending]: state => {
      state.changeYearLoading = true;
    },
    [getChangeFinancialYearData.rejected]: state => {
      state.changeFinancialYear = {};
      state.changeYearLoading = false;
    },
    [getChangeFinancialYearData.fulfilled]: (state, action) => {
      state.changeFinancialYear = action.payload?.data;
      state.changeYearLoading = false;
    },
    [addChangeFinancialYear.pending]: state => {
      state.isAddChangeFinancialYear = false;
      state.changeYearLoading = true;
    },
    [addChangeFinancialYear.rejected]: state => {
      state.isAddChangeFinancialYear = false;
      state.changeYearLoading = false;
    },
    [addChangeFinancialYear.fulfilled]: state => {
      state.isAddChangeFinancialYear = true;
      state.changeYearLoading = false;
    },
    [updateChangeFinancialYear.pending]: state => {
      state.isUpdateChangeFinancialYear = false;
      state.changeYearLoading = true;
    },
    [updateChangeFinancialYear.rejected]: state => {
      state.isUpdateChangeFinancialYear = false;
      state.changeYearLoading = false;
    },
    [updateChangeFinancialYear.fulfilled]: state => {
      state.isUpdateChangeFinancialYear = true;
      state.changeYearLoading = false;
    },
    [deleteChangeFinancialYear.pending]: state => {
      state.isDeleteChangeFinancialYear = false;
      state.changeYearLoading = true;
    },
    [deleteChangeFinancialYear.rejected]: state => {
      state.isDeleteChangeFinancialYear = false;
      state.changeYearLoading = false;
    },
    [deleteChangeFinancialYear.fulfilled]: state => {
      state.isDeleteChangeFinancialYear = true;
      state.changeYearLoading = false;
    },
  },
});

export const {
  setChangeYearList,
  setChangeYearSearchParam,
  setIsAddChangeFinancialYear,
  setIsUpdateChangeFinancialYear,
  setIsDeleteChangeFinancialYear,
  setChangeYearPageLimit,
  setChangeYearCurrentPage,
} = changeFinancialYearSlice.actions;

export default changeFinancialYearSlice.reducer;
