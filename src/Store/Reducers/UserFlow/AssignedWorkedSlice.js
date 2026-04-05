import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';

let initialState = {
  assignedWorkLoading: false,
  assignedWorkedSearchParam: '',
  assignedWorkedCurrentPage: 1,
  assignedWorkedPageLimit: 10,
  activeTabData: {
    activeTabIndex: 0,
    activeTabObj: {},
  },
  assignedWorkList: [],
  assignedWorkedStatus: [],
  selectedAssignedProjectStatusFilter: 'running',
  selectedAssignedProjectFilter: 'all',

  assignedWorkItemsList: [],
  assignedWorkItemsLoading: false,
  assignedWorkEditingEventList: [],
  assignedWorkEventListLoading: false,
  checkerCommentItemLoading: false,
  assignedWorkEditItemLoading: false,
  assignedWorkEditOrderLoading: false,
  assignWorkedEditingData: {},
  assignWorkedExposingData: {
    order_status: 1,
  },
};

/**
 * @desc get-Assigned-Work-List :
 */

export const getAssignedWorkList = createAsyncThunk(
  'employee/assigned-work/list-assigned-work',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/assigned-work/list-assigned-work', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          let updated = [];

          if (data?.list?.length) {
            updated = data?.list?.map(item => {
              return {
                ...item,
                create_date: item?.create_date
                  ? moment(item?.create_date)?.format('DD-MM-YYYY')
                  : '',
                due_date: item?.due_date
                  ? moment(item?.due_date)?.format('DD-MM-YYYY')
                  : '',
                data_size: convertIntoNumber(item?.data_size),
                item_name:
                  item?.item_name?.length === 1
                    ? item?.item_name[0]
                    : item?.item_name?.join(', '),
                step: item?.step ? item?.step : 0,
              };
            });
          }

          const newObj = {
            list: updated,
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
 * @desc get-Assigned-Work-editing-items :
 */

export const getAssignedWorkListItems = createAsyncThunk(
  '/employee/assigned-work/list-items',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/list-items', payload)
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
 * @desc Assigned-Work-editing // get-checker_comment-list :
 */

export const getCheckerCommentList = createAsyncThunk(
  '/employee/assigned-work/list-checker_comment',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/list-checker_comment', payload)
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
 * @desc Assigned-Work-editing // add-checker_comment-list :
 */

export const addCheckerCommentItem = createAsyncThunk(
  '/employee/assigned-work/add-checker_comment',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/add-checker_comment', payload)
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
 * @desc Assigned-Work-editing // edit-item :
 */

export const assignedWorkEditItem = createAsyncThunk(
  '/employee/assigned-work/edit-item',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/edit-item', payload)
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
 * @desc assigned-Worked-editing // event-list :
 */

export const assignedWorkedEditingEventList = createAsyncThunk(
  '/employee/assigned-work/list-event-detail',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/list-event-detail', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
            total_row_hour: data?.total_row_hour
              ? data?.total_row_hour
              : '00:00:00',
            final_output_hour: data?.final_output_hour
              ? data?.final_output_hour
              : '00:00:00',
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
 * @desc assigned-Worked-editing // add-event-detail :
 */

export const assignedWorkedEditingAddEventDetail = createAsyncThunk(
  '/employee/assigned-work/add-event-detail',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/add-event-detail', payload)
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
 * @desc assigned-Worked-editing // edit-event-detail :
 */

export const assignedWorkedEditingEditEventDetail = createAsyncThunk(
  '/employee/assigned-work/update-event-detail',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/update-event-detail', payload)
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
 * @desc assigned-Worked-editing // delete-event-detail :
 */

export const assignedWorkedEditingDeleteEventDetail = createAsyncThunk(
  '/employee/assigned-work/delete-event-detail',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/delete-event-detail', payload)
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
 * @desc assigned-Worked // Edit-Order :
 */

export const assignedWorkedEditOrder = createAsyncThunk(
  '/employee/assigned-work/edit-order',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/employee/assigned-work/edit-order', payload)
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

const assignedWorkedSlice = createSlice({
  name: 'assignedWorked',
  initialState,
  reducers: {
    setAssignedWorkedCurrentPage: (state, action) => {
      state.assignedWorkedCurrentPage = action.payload;
    },
    setAssignedWorkedPageLimit: (state, action) => {
      state.assignedWorkedPageLimit = action.payload;
    },
    setAssignedWorkedSearchParam: (state, action) => {
      state.assignedWorkedSearchParam = action.payload;
    },
    setAssignedWorkedStatus: (state, action) => {
      state.assignedWorkedStatus = action.payload;
    },

    setSelectedAssignedProjectStatusFilter: (state, action) => {
      state.selectedAssignedProjectStatusFilter = action.payload;
    },
    setSelectedAssignedProjectFilter: (state, action) => {
      state.selectedAssignedProjectFilter = action.payload;
    },

    setActiveTabData: (state, action) => {
      state.activeTabData = action.payload;
    },
    setAssignWorkedEditingData: (state, action) => {
      state.assignWorkedEditingData = action.payload;
    },
    setAssignWorkedExposingData: (state, action) => {
      state.assignWorkedExposingData = action.payload;
    },
  },
  extraReducers: {
    [getAssignedWorkList.pending]: state => {
      state.assignedWorkLoading = true;
    },
    [getAssignedWorkList.rejected]: state => {
      state.assignedWorkList = [];
      state.assignedWorkLoading = false;
    },
    [getAssignedWorkList.fulfilled]: (state, action) => {
      state.assignedWorkList = action.payload;
      state.assignedWorkLoading = false;
    },
    [getAssignedWorkListItems.pending]: state => {
      state.assignedWorkItemsLoading = true;
    },
    [getAssignedWorkListItems.rejected]: state => {
      state.assignedWorkItemsList = [];
      state.assignedWorkItemsLoading = false;
    },
    [getAssignedWorkListItems.fulfilled]: (state, action) => {
      state.assignedWorkItemsList = action.payload;
      state.assignedWorkItemsLoading = false;
    },

    [getCheckerCommentList.pending]: state => {
      state.checkerCommentItemLoading = true;
    },
    [getCheckerCommentList.rejected]: state => {
      // state.assignedWorkItemsList = [];
      state.checkerCommentItemLoading = false;
    },
    [getCheckerCommentList.fulfilled]: (state, action) => {
      // state.assignedWorkItemsList = action.payload;
      state.checkerCommentItemLoading = false;
    },
    [addCheckerCommentItem.pending]: state => {
      state.checkerCommentItemLoading = true;
    },
    [addCheckerCommentItem.rejected]: state => {
      // state.assignedWorkItemsList = [];
      state.checkerCommentItemLoading = false;
    },
    [addCheckerCommentItem.fulfilled]: (state, action) => {
      // state.assignedWorkItemsList = action.payload;
      state.checkerCommentItemLoading = false;
    },

    [assignedWorkEditItem.pending]: state => {
      state.assignedWorkEditItemLoading = true;
    },
    [assignedWorkEditItem.rejected]: state => {
      // state.assignedWorkItemsList = [];
      state.assignedWorkEditItemLoading = false;
    },
    [assignedWorkEditItem.fulfilled]: (state, action) => {
      // state.assignedWorkItemsList = action.payload;
      state.assignedWorkEditItemLoading = false;
    },

    [assignedWorkedEditingEventList.pending]: state => {
      state.assignedWorkEventListLoading = true;
    },
    [assignedWorkedEditingEventList.rejected]: state => {
      state.assignedWorkEditingEventList = [];
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingEventList.fulfilled]: (state, action) => {
      state.assignedWorkEditingEventList = action.payload;
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingAddEventDetail.pending]: state => {
      state.assignedWorkEventListLoading = true;
    },
    [assignedWorkedEditingAddEventDetail.rejected]: state => {
      // state.assignedWorkEditingEventList = [];
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingAddEventDetail.fulfilled]: (state, action) => {
      // state.assignedWorkEditingEventList = action.payload;
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingEditEventDetail.pending]: state => {
      state.assignedWorkEventListLoading = true;
    },
    [assignedWorkedEditingEditEventDetail.rejected]: state => {
      // state.assignedWorkEditingEventList = [];
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingEditEventDetail.fulfilled]: (state, action) => {
      // state.assignedWorkEditingEventList = action.payload;
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingDeleteEventDetail.pending]: state => {
      state.assignedWorkEventListLoading = true;
    },
    [assignedWorkedEditingDeleteEventDetail.rejected]: state => {
      // state.assignedWorkEditingEventList = [];
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditingDeleteEventDetail.fulfilled]: (state, action) => {
      // state.assignedWorkEditingEventList = action.payload;
      state.assignedWorkEventListLoading = false;
    },
    [assignedWorkedEditOrder.pending]: state => {
      state.assignedWorkEditOrderLoading = true;
    },
    [assignedWorkedEditOrder.rejected]: state => {
      // state.assignedWorkEditingEventList = [];
      state.assignedWorkEditOrderLoading = false;
    },
    [assignedWorkedEditOrder.fulfilled]: (state, action) => {
      // state.assignedWorkEditingEventList = action.payload;
      state.assignedWorkEditOrderLoading = false;
    },
  },
});

export const {
  setAssignedWorkedCurrentPage,
  setAssignedWorkedPageLimit,
  setAssignedWorkedSearchParam,
  setAssignedWorkedStatus,
  setActiveTabData,
  setAssignWorkedEditingData,
  setAssignWorkedExposingData,
  setSelectedAssignedProjectStatusFilter,
  setSelectedAssignedProjectFilter,
} = assignedWorkedSlice.actions;

export default assignedWorkedSlice.reducer;
