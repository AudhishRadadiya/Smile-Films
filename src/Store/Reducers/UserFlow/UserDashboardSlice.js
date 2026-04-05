import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';

let initialState = {
  userAnnouncementList: [],
  userAnnouncementLoading: false,
  userHolidayList: [],
  userHolidayLoading: false,
  userUpcomingProjectsList: {},
  userUpcomingProjectLoading: false,
  userOngoingProjectsList: {},
  userOngoingProjectLoading: false,
  userPerformanceReportData: {},
  userPerformanceReportLoading: false,
  userProjectStatusData: {},
  userProjectStatusLoading: false,
  approachDeadlineData: {},
  currentWorkingData: {},
  recentCompletedData: {},
  userCheckReportingDayData: {},
  userCheckReportingDayLoading: false,
};

/**
 * @desc check-reporting-day
 */

export const getCheckReportingDay = createAsyncThunk(
  'employee/dashboard/check-reporting-day',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/check-reporting-day')
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
 * @desc get-announcement
 */

export const getUserAnnouncementList = createAsyncThunk(
  'employee/dashboard/get-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/get-announcement')
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
 * @desc get-holiday
 */

export const getUserHolidayList = createAsyncThunk(
  'employee/dashboard/get-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/get-holiday')
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
 * @desc get upcoming projects
 */

export const getUpcomingProjects = createAsyncThunk(
  'employee/dashboard/upcoming-projects',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/upcoming-projects', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updatedList = data?.list?.map(item => {
            return {
              ...item,
              create_date: item?.create_date
                ? moment((item?.create_date).split('T')[0]).format('DD-MM-YYYY')
                : '',
              due_date: item?.due_date
                ? moment((item?.due_date).split('T')[0]).format('DD-MM-YYYY')
                : '-',
            };
          });

          const updatedData = {
            ...data,
            list: updatedList,
          };

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
 * @desc get ongoing projects
 */

export const getOngoingProjects = createAsyncThunk(
  'employee/dashboard/ongoing-projects',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/ongoing-projects', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updatedList = data?.list?.map(item => {
            return {
              ...item,
              data_size: convertIntoNumber(item?.data_size),
              due_date: item?.due_date
                ? moment(item?.due_date?.split('T')[0]).format('DD-MM-YYYY')
                : '',
            };
          });

          const updatedProjectsData = {
            ...data,
            list: updatedList,
          };

          if (err === 0) {
            resolve(updatedProjectsData);
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
 * @desc get performance report
 */

export const getPerformanceReport = createAsyncThunk(
  'employee/dashboard/performance-report',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/performance-report')
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
 * @desc get project status
 */

export const getProjectStatus = createAsyncThunk(
  'employee/dashboard/project-status',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/dashboard/project-status')
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            if (data?.deadline_project?.length) {
              dispatch(setApproachDeadlineData(data?.deadline_project[0]));
            }
            if (data?.ongoing_project?.length) {
              dispatch(setCurrentWorkingData(data?.ongoing_project[0]));
            }
            if (data?.completed_project?.length) {
              dispatch(setRecentCompletedData(data?.completed_project[0]));
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

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    setApproachDeadlineData: (state, action) => {
      state.approachDeadlineData = action.payload;
    },
    setCurrentWorkingData: (state, action) => {
      state.currentWorkingData = action.payload;
    },
    setRecentCompletedData: (state, action) => {
      state.recentCompletedData = action.payload;
    },
  },
  extraReducers: {
    [getUserAnnouncementList.pending]: state => {
      state.userAnnouncementList = {};
      state.userAnnouncementLoading = true;
    },
    [getUserAnnouncementList.rejected]: state => {
      state.userAnnouncementList = {};
      state.userAnnouncementLoading = false;
    },
    [getUserAnnouncementList.fulfilled]: (state, action) => {
      state.userAnnouncementList = action.payload?.data;
      state.userAnnouncementLoading = false;
    },
    [getUserHolidayList.pending]: state => {
      state.userHolidayList = {};
      state.userHolidayLoading = true;
    },
    [getUserHolidayList.rejected]: state => {
      state.userHolidayList = {};
      state.userHolidayLoading = false;
    },
    [getUserHolidayList.fulfilled]: (state, action) => {
      state.userHolidayList = action.payload?.data;
      state.userHolidayLoading = false;
    },
    [getUpcomingProjects.pending]: state => {
      state.userUpcomingProjectsList = {};
      state.userUpcomingProjectLoading = true;
    },
    [getUpcomingProjects.rejected]: state => {
      state.userUpcomingProjectsList = {};
      state.userUpcomingProjectLoading = false;
    },
    [getUpcomingProjects.fulfilled]: (state, action) => {
      state.userUpcomingProjectsList = action.payload;
      state.userUpcomingProjectLoading = false;
    },

    [getOngoingProjects.pending]: state => {
      state.userOngoingProjectsList = {};
      state.userOngoingProjectLoading = true;
    },
    [getOngoingProjects.rejected]: state => {
      state.userOngoingProjectsList = {};
      state.userOngoingProjectLoading = false;
    },
    [getOngoingProjects.fulfilled]: (state, action) => {
      state.userOngoingProjectsList = action.payload;
      state.userOngoingProjectLoading = false;
    },
    [getPerformanceReport.pending]: state => {
      state.userPerformanceReportData = {};
      state.userPerformanceReportLoading = true;
    },
    [getPerformanceReport.rejected]: state => {
      state.userPerformanceReportData = {};
      state.userPerformanceReportLoading = false;
    },
    [getPerformanceReport.fulfilled]: (state, action) => {
      state.userPerformanceReportData = action.payload;
      state.userPerformanceReportLoading = false;
    },
    [getProjectStatus.pending]: state => {
      state.userProjectStatusData = {};
      state.userProjectStatusLoading = true;
    },
    [getProjectStatus.rejected]: state => {
      state.userProjectStatusData = {};
      state.userProjectStatusLoading = false;
    },
    [getProjectStatus.fulfilled]: (state, action) => {
      state.userProjectStatusData = action.payload;
      state.userProjectStatusLoading = false;
    },
    [getCheckReportingDay.pending]: state => {
      state.userCheckReportingDayData = {};
      state.userCheckReportingDayLoading = true;
    },
    [getCheckReportingDay.rejected]: state => {
      state.userCheckReportingDayData = {};
      state.userCheckReportingDayLoading = false;
    },
    [getCheckReportingDay.fulfilled]: (state, action) => {
      state.userCheckReportingDayData = action.payload;
      state.userCheckReportingDayLoading = false;
    },
  },
});

export const {
  setApproachDeadlineData,
  setCurrentWorkingData,
  setRecentCompletedData,
  setUserCheckReportingDayData,
} = userDashboardSlice.actions;

export default userDashboardSlice.reducer;
