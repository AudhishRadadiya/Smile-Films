import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AssignedWorkedStatusFilterList } from 'Helper/CommonList';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  clientReachDate: [],
  adminDashboardLoading: false,
  adminDashClientChartLoading: false,
  dashboardClientChartData: [],
  adminDashDeletedHistoryLoading: false,
  dashboardDeletedHistoryData: {},
  adminDashProjectTypeLoading: false,
  dashboardProjectTypeData: [],
  adminDashOrderStatusLoading: false,
  dashboardOrderStatusData: [],
  adminDashboardCountLoading: false,
  dashboardCountData: {},
  adminDashRevenueLoading: false,
  dashboardRevenueData: {},
  adminDashTeamPerformanceLoading: false,
  dashboardTeamPerformanceData: [],
};

/**
 * @desc get dashboard client reach data
 */

export const getDashboardClientChartData = createAsyncThunk(
  'admin/dashboard/client-reach',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/client-reach', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const totalCountValue = data?.reduce((acc, cur) => {
            return acc + cur?.count;
          }, 0);

          const updatedData = data?.map(item => {
            const itemPercentage = (item?.count / totalCountValue) * 100;
            return {
              ...item,
              calculated_percentage: itemPercentage,
            };
          });

          if (err === 0) {
            resolve(updatedData);
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
 * @desc get dashboard deleted-history Data
 */

export const getDashboardDeletedHistoryData = createAsyncThunk(
  'admin/dashboard/deleted-history',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/deleted-history', data)
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
 * @desc get dashboard project type data
 */

export const getDashboardProjectTypeData = createAsyncThunk(
  'admin/dashboard/project-type',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/project-type', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const totalCountValue = data?.reduce((acc, cur) => {
            return acc + cur?.count;
          }, 0);

          const updatedData = data?.map(item => {
            const itemPercentage = (item?.count / totalCountValue) * 100;
            return {
              ...item,
              calculated_percentage: itemPercentage,
            };
          });

          if (err === 0) {
            resolve(updatedData);
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
 * @desc get dashboard order status data
 */

export const getDashboardOrderStatusData = createAsyncThunk(
  'admin/dashboard/order-status',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/order-status', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updated = data?.map((item, i) => {
            const findObj = AssignedWorkedStatusFilterList?.find(
              value => value?.value === item?._id,
            );

            return {
              ...item,
              order_status: findObj?.label,
            };
          });

          if (err === 0) {
            resolve(updated);
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
 * @desc get dashboard count data
 */

export const getDashboardCountData = createAsyncThunk(
  'admin/dashboard/dashboard-count',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/dashboard-count', data)
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
 * @desc get dashboard revenue chart data
 */

export const getDashboardRevenueChartData = createAsyncThunk(
  'admin/dashboard/revenue-chart',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/revenue-chart', data)
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
 * @desc get dashboard team performance data
 */

export const getDashboardTeamPerformanceData = createAsyncThunk(
  'admin/dashboard/team-performance',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/dashboard/team-performance', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updated = data?.map(item => {
            return {
              ...item,
              due_date: item?.due_date
                ? moment(item.due_date?.split('T')[0]).format('DD-MM-YYYY')
                : '-',
            };
          });

          if (err === 0) {
            resolve(updated);
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

const AdminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setAdminDashboardLoading: (state, action) => {
      state.adminDashboardLoading = action.payload;
    },
    setClientReachDate: (state, action) => {
      state.clientReachDate = action.payload;
    },
    setRevenueBreakdownDate: (state, action) => {
      state.revenueBreakdownDate = action.payload;
    },
  },
  extraReducers: {
    [getDashboardClientChartData.pending]: state => {
      state.adminDashClientChartLoading = true;
    },
    [getDashboardClientChartData.rejected]: state => {
      state.dashboardClientChartData = [];
      state.adminDashClientChartLoading = false;
    },
    [getDashboardClientChartData.fulfilled]: (state, action) => {
      state.dashboardClientChartData = action.payload;
      state.adminDashClientChartLoading = false;
    },

    [getDashboardDeletedHistoryData.pending]: state => {
      state.adminDashDeletedHistoryLoading = true;
    },
    [getDashboardDeletedHistoryData.rejected]: state => {
      state.dashboardDeletedHistoryData = {};
      state.adminDashDeletedHistoryLoading = false;
    },
    [getDashboardDeletedHistoryData.fulfilled]: (state, action) => {
      state.dashboardDeletedHistoryData = action.payload;
      state.adminDashDeletedHistoryLoading = false;
    },

    [getDashboardProjectTypeData.pending]: state => {
      state.adminDashProjectTypeLoading = true;
    },
    [getDashboardProjectTypeData.rejected]: state => {
      state.dashboardProjectTypeData = [];
      state.adminDashProjectTypeLoading = false;
    },
    [getDashboardProjectTypeData.fulfilled]: (state, action) => {
      state.dashboardProjectTypeData = action.payload;
      state.adminDashProjectTypeLoading = false;
    },

    [getDashboardOrderStatusData.pending]: state => {
      state.adminDashOrderStatusLoading = true;
    },
    [getDashboardOrderStatusData.rejected]: state => {
      state.dashboardOrderStatusData = [];
      state.adminDashOrderStatusLoading = false;
    },
    [getDashboardOrderStatusData.fulfilled]: (state, action) => {
      state.dashboardOrderStatusData = action.payload;
      state.adminDashOrderStatusLoading = false;
    },

    [getDashboardCountData.pending]: state => {
      state.adminDashboardCountLoading = true;
    },
    [getDashboardCountData.rejected]: state => {
      state.dashboardCountData = {};
      state.adminDashboardCountLoading = false;
    },
    [getDashboardCountData.fulfilled]: (state, action) => {
      state.dashboardCountData = action.payload;
      state.adminDashboardCountLoading = false;
    },

    [getDashboardRevenueChartData.pending]: state => {
      state.adminDashRevenueLoading = true;
    },
    [getDashboardRevenueChartData.rejected]: state => {
      state.dashboardRevenueData = {};
      state.adminDashRevenueLoading = false;
    },
    [getDashboardRevenueChartData.fulfilled]: (state, action) => {
      state.dashboardRevenueData = action.payload;
      state.adminDashRevenueLoading = false;
    },

    [getDashboardTeamPerformanceData.pending]: state => {
      state.adminDashTeamPerformanceLoading = true;
    },
    [getDashboardTeamPerformanceData.rejected]: state => {
      state.dashboardTeamPerformanceData = [];
      state.adminDashTeamPerformanceLoading = false;
    },
    [getDashboardTeamPerformanceData.fulfilled]: (state, action) => {
      state.dashboardTeamPerformanceData = action.payload;
      state.adminDashTeamPerformanceLoading = false;
    },
  },
});

export const {
  setClientReachDate,
  setRevenueBreakdownDate,
  setAdminDashboardLoading,
} = AdminDashboardSlice.actions;

export default AdminDashboardSlice.reducer;
