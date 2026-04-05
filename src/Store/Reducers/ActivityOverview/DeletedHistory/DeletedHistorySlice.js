import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';

let initialState = {
  isCompletedProject: false,
  addDeletedHistoryLoading: false,
  deletedHistoryListLoading: false,
  deletedHistoryList: {},
  completedDeletedHistoryList: {},
  selectedDeletedHistory: {},

  deletedHistoryPageLimit: 10,
  deletedHistoryCurrentPage: 1,
  deletedHistorySearchParam: '',
};

/**
 * @desc list-deleted_history:
 */

export const getDeletedHistoryList = createAsyncThunk(
  'activity-overview/deleted_history/list-deleted_history',
  (payload, { dispatch, getState }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/deleted_history/list-deleted_history', payload)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updatedList = { 
            ...data, 
            pageNo: data?.pageNo ? data?.pageNo : '', 
            totalRows: data?.totalRows ? data?.totalRows : 0, 
          };
          const { deletedHistory } = getState();

          if (payload?.completed_project) {
            let updatedCompletedList = [];

            // if (Object.keys(deletedHistory?.selectedDeletedHistory)?.length) {
            if (data?.list?.length) {
            updatedCompletedList = data?.list?.map(item => {
              const matchDataObject =
                Object.keys(deletedHistory?.selectedDeletedHistory)?.length &&
                deletedHistory?.selectedDeletedHistory?._id === item?._id;

              return {
                ...item,
                create_date: item.create_date
                  ? moment(item.create_date?.split('T')[0]).format('DD-MM-YYYY')
                  : '',
                last_modify_date: item.last_modify_date
                  ? moment(item.last_modify_date?.split('T')[0]).format(
                      'DD-MM-YYYY',
                    )
                  : '',
                data_size: convertIntoNumber(item.data_size),
                is_disabled: matchDataObject
                  ? matchDataObject
                    ? false
                    : true
                  : false,
                select_completed_history: matchDataObject ? true : false,
              };
            });
          }
            // } else {
            //   updatedCompletedList = data?.list?.map(item => {
            //     return {
            //       ...item,
            //       create_date: item.create_date
            //         ? moment(item.create_date?.split('T')[0]).format(
            //             'DD-MM-YYYY',
            //           )
            //         : '',
            //       last_modify_date: item.last_modify_date
            //         ? moment(item.last_modify_date?.split('T')[0]).format(
            //             'DD-MM-YYYY',
            //           )
            //         : '',
            //       data_size: convertIntoNumber(item.data_size),
            //       is_disabled: false,
            //       select_completed_history: false,
            //     };
            //   });
            // }

            updatedList = {
              ...updatedList,
              list: updatedCompletedList,
            };
          } else {

            let updatedDeletedList = [];

            if (data?.list?.length) {
            updatedDeletedList = data?.list?.map(item => {
              return {
                ...item,
                create_date: item.create_date
                  ? moment(item.create_date?.split('T')[0]).format('DD-MM-YYYY')
                  : '',
                delete_date: item.delete_date
                  ? moment(item.delete_date?.split('T')[0]).format('DD-MM-YYYY')
                  : '',
              };
            });
          }

            updatedList = {
              ...updatedList,
              list: updatedDeletedList,
            };
          }

          if (err === 0) {
            if (payload?.completed_project) {
              dispatch(setCompletedDeletedHistoryList(updatedList));
            } else {
              dispatch(setDeletedHistoryList(updatedList));
            }
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
 * @desc add-deleted_history:
 */

export const addDeletedHistory = createAsyncThunk(
  'activity-overview/deleted_history/add-deleted_history',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/deleted_history/add-deleted_history', payload)
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

const DeletedHistorySlice = createSlice({
  name: 'deletedHistory',
  initialState,
  reducers: {
    setDeletedHistoryListLoading: (state, action) => {
      state.deletedHistoryListLoading = action.payload;
    },
    setDeletedHistoryCurrentPage: (state, action) => {
      state.deletedHistoryCurrentPage = action.payload;
    },
    setDeletedHistoryPageLimit: (state, action) => {
      state.deletedHistoryPageLimit = action.payload;
    },
    setDeletedHistorySearchParam: (state, action) => {
      state.deletedHistorySearchParam = action.payload;
    },
    setIsCompletedProject: (state, action) => {
      state.isCompletedProject = action.payload;
    },
    setDeletedHistoryList: (state, action) => {
      state.deletedHistoryList = action.payload;
    },
    setCompletedDeletedHistoryList: (state, action) => {
      state.completedDeletedHistoryList = action.payload;
    },
    setSelectedDeletedHistory: (state, action) => {
      state.selectedDeletedHistory = action.payload;
    },
  },
  extraReducers: {
    [getDeletedHistoryList.pending]: state => {
      state.deletedHistoryListLoading = true;
    },
    [getDeletedHistoryList.rejected]: state => {
      state.deletedHistoryListLoading = false;
    },
    [getDeletedHistoryList.fulfilled]: (state, action) => {
      state.deletedHistoryListLoading = false;
    },
    [addDeletedHistory.pending]: state => {
      state.addDeletedHistoryLoading = true;
    },
    [addDeletedHistory.rejected]: state => {
      state.addDeletedHistoryLoading = false;
    },
    [addDeletedHistory.fulfilled]: (state, action) => {
      state.addDeletedHistoryLoading = false;
    },
  },
});

export const {
  setIsCompletedProject,
  setDeletedHistoryPageLimit,
  setDeletedHistoryCurrentPage,
  setDeletedHistorySearchParam,
  setDeletedHistoryListLoading,
  setDeletedHistoryList,
  setCompletedDeletedHistoryList,
  setSelectedDeletedHistory,
} = DeletedHistorySlice.actions;

export default DeletedHistorySlice.reducer;
