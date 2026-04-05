import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {};

/**
 * @desc employee/reporting/list-reporting:
 */

export const getReportingList = createAsyncThunk(
  'employee/reporting/list-reporting',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/reporting/list-reporting', payload)
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
 * @desc employee/reporting/list-order_no:
 */

export const getOrderList = createAsyncThunk(
  'employee/reporting/list-order_no',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/reporting/list-order_no', payload)
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
 * @desc employee/reporting/add-reporting:
 */

export const addReporting = createAsyncThunk(
  'employee/reporting/add-reporting',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/reporting/add-reporting', payload)
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
 * @desc employee/reporting/get-reporting:
 */

export const getReporting = createAsyncThunk(
  'employee/reporting/get-reporting',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/reporting/get-reporting', payload)
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
 * @desc employee/reporting/edit-reporting:
 */

export const editReporting = createAsyncThunk(
  'employee/reporting/edit-reporting',
  (payload, thunkAPI) => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/reporting/edit-reporting', payload)
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

const ReportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    setGetReportingData: (state, action) => {
      state.getReportingData = action.payload;
    },
  },
  extraReducers: {
    [getReportingList.pending]: state => {
      state.getReportingListLoading = true;
    },
    [getReportingList.rejected]: state => {
      state.getReportingListData = {};
      state.getReportingListLoading = false;
    },
    [getReportingList.fulfilled]: (state, action) => {
      state.getReportingListData = action.payload;
      state.getReportingListLoading = false;
    },
    [getOrderList.pending]: state => {
      state.getOrderListLoading = true;
    },
    [getOrderList.rejected]: state => {
      state.getOrderListData = {};
      state.getOrderListLoading = false;
    },
    [getOrderList.fulfilled]: (state, action) => {
      state.getOrderListData = action.payload;
      state.getOrderListLoading = false;
    },
    [addReporting.pending]: state => {
      state.addReportingLoading = true;
    },
    [addReporting.rejected]: state => {
      state.addReportingData = {};
      state.addReportingLoading = false;
    },
    [addReporting.fulfilled]: (state, action) => {
      state.addReportingData = action.payload;
      state.addReportingLoading = false;
    },
    [getReporting.pending]: state => {
      state.getReportingLoading = true;
    },
    [getReporting.rejected]: state => {
      state.getReportingData = {};
      state.getReportingLoading = false;
    },
    [getReporting.fulfilled]: (state, action) => {
      state.getReportingData = action.payload;
      state.getReportingLoading = false;
    },
    [editReporting.pending]: state => {
      state.editReportingLoading = true;
    },
    [editReporting.rejected]: state => {
      state.editReportingData = {};
      state.editReportingLoading = false;
    },
    [editReporting.fulfilled]: (state, action) => {
      state.editReportingData = action.payload;
      state.editReportingLoading = false;
    },
  },
});

export const { setGetReportingData } = ReportingSlice.actions;

export default ReportingSlice.reducer;
