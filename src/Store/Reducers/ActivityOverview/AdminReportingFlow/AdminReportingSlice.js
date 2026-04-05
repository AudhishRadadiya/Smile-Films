import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  reportingPageLimit: 10,
  reportingCurrentPage: 1,
  nonReportingCurrentPage: 1,
  nonReportingPageLimit: 10,
  getEmployeeReportingListData: [],
  getEmployeeReportingListLoading: false,
  getEmployeeReportingData: [],
  getEmployeeReportingLoading: false,
};

/**
 * @desc activity-overview/employee_reporting/list-employee_reporting:
 */
export const getEmployeeReportingList = createAsyncThunk(
  'employee_reporting/list-employee_reporting',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          'activity-overview/employee_reporting/list-employee_reporting',
          payload,
        )
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
          toast.error(errors.message);
          reject(errors);
        });
    });
  },
);

/**
 * @desc activity-overview/employee_reporting/get-employee_reporting:
 */
export const getEmployeeReporting = createAsyncThunk(
  'employee_reporting/get-employee_reporting',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          'activity-overview/employee_reporting/get-employee_reporting',
          payload,
        )
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
          toast.error(errors.message);
          reject(errors);
        });
    });
  },
);

const AdminReportingSlice = createSlice({
  name: 'adminReporting',
  initialState,
  reducers: {
    setReportingCurrentPage: (state, action) => {
      state.reportingCurrentPage = action.payload;
    },
    setReportingPageLimit: (state, action) => {
      state.reportingPageLimit = action.payload;
    },
    setNonReportingCurrentPage: (state, action) => {
      state.nonReportingCurrentPage = action.payload;
    },
    setNonReportingPageLimit: (state, action) => {
      state.nonReportingPageLimit = action.payload;
    },
  },
  extraReducers: {
    [getEmployeeReportingList.pending]: state => {
      state.getEmployeeReportingListLoading = true;
    },
    [getEmployeeReportingList.rejected]: state => {
      state.getEmployeeReportingListData = {};
      state.getEmployeeReportingListLoading = false;
    },
    [getEmployeeReportingList.fulfilled]: (state, action) => {
      state.getEmployeeReportingListData = action.payload;
      state.getEmployeeReportingListLoading = false;
    },
    [getEmployeeReporting.pending]: state => {
      state.getEmployeeReportingLoading = true;
    },
    [getEmployeeReporting.rejected]: state => {
      state.getEmployeeReportingData = {};
      state.getEmployeeReportingLoading = false;
    },
    [getEmployeeReporting.fulfilled]: (state, action) => {
      state.getEmployeeReportingData = action.payload;
      state.getEmployeeReportingLoading = false;
    },
  },
});

export const {
  setReportingCurrentPage,
  setReportingPageLimit,
  setNonReportingPageLimit,
  setNonReportingCurrentPage,
} = AdminReportingSlice.actions;

export default AdminReportingSlice.reducer;
