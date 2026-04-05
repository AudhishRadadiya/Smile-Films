import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  announcementList: {},
  announcementLoading: false,
  isAddAnnouncement: false,
  isUpdateAnnouncement: false,
  isDeleteAnnouncement: false,
  announcementPageLimit: 10,
  announcementCurrentPage: 1,
  announcementSearchParam: '',
  selectedAnnouncementData: {
    announcement_title: '',
    announcement: '',
    hide_after: '',
  },
};

/**
 * @desc list-announcement
 * @param (limit, start, isActive,search)
 */

export const getAnnouncementList = createAsyncThunk(
  'activity-overview/announcement/list-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/announcement/list-announcement', data)
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
 * @desc add-announcement
 */

export const addAnnouncement = createAsyncThunk(
  'activity-overview/announcement/add-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/announcement/add-announcement', data)
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
 * @desc edit-announcement
 */

export const editAnnouncement = createAsyncThunk(
  'activity-overview/announcement/edit-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/announcement/edit-announcement', data)
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
 * @desc delete-announcement
 */

export const deleteAnnouncement = createAsyncThunk(
  'activity-overview/announcement/delete-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/announcement/delete-announcement', data)
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

export const getAnnouncement = createAsyncThunk(
  'activity-overview/announcement/get-announcement',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/announcement/get-announcement', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const utcDate = new Date(data?.hide_after);

          const localDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds(),
          );
          const updated = {
            ...data,

            hide_after: localDate,
          };
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

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    setAnnouncementCurrentPage: (state, action) => {
      state.announcementCurrentPage = action.payload;
    },
    setAnnouncementPageLimit: (state, action) => {
      state.announcementPageLimit = action.payload;
    },
    setIsDeleteAnnouncement: (state, action) => {
      state.isDeleteAnnouncement = action.payload;
    },
    setIsUpdateAnnouncement: (state, action) => {
      state.isUpdateAnnouncement = action.payload;
    },
    setIsAddAnnouncement: (state, action) => {
      state.isAddAnnouncement = action.payload;
    },
    setAnnouncementSearchParam: (state, action) => {
      state.announcementSearchParam = action.payload;
    },
    setAnnouncementList: (state, action) => {
      state.announcementList = action.payload;
    },
    clearSelectedAnnouncementData: (state, action) => {
      state.selectedAnnouncementData = initialState.selectedAnnouncementData;
    },
  },
  extraReducers: {
    [getAnnouncementList.pending]: state => {
      state.announcementLoading = true;
    },
    [getAnnouncementList.rejected]: state => {
      state.announcementList = {};
      state.announcementLoading = false;
    },
    [getAnnouncementList.fulfilled]: (state, action) => {
      state.announcementList = action.payload?.data;
      state.announcementLoading = false;
    },
    [addAnnouncement.pending]: state => {
      state.isAddAnnouncement = false;
      state.announcementLoading = true;
    },
    [addAnnouncement.rejected]: state => {
      state.isAddAnnouncement = false;
      state.announcementLoading = false;
    },
    [addAnnouncement.fulfilled]: state => {
      state.isAddAnnouncement = true;
      state.announcementLoading = false;
    },
    [editAnnouncement.pending]: state => {
      state.isUpdateAnnouncement = false;
      state.announcementLoading = true;
    },
    [editAnnouncement.rejected]: state => {
      state.isUpdateAnnouncement = false;
      state.announcementLoading = false;
    },
    [editAnnouncement.fulfilled]: state => {
      state.isUpdateAnnouncement = true;
      state.announcementLoading = false;
    },
    [deleteAnnouncement.pending]: state => {
      state.isDeleteAnnouncement = false;
      state.announcementLoading = true;
    },
    [deleteAnnouncement.rejected]: state => {
      state.isDeleteAnnouncement = false;
      state.announcementLoading = false;
    },
    [deleteAnnouncement.fulfilled]: state => {
      state.isDeleteAnnouncement = true;
      state.announcementLoading = false;
    },
    [getAnnouncement.pending]: state => {
      state.selectedAnnouncementData = {};
      state.announcementLoading = true;
    },
    [getAnnouncement.rejected]: state => {
      state.selectedAnnouncementData = {};
      state.announcementLoading = false;
    },
    [getAnnouncement.fulfilled]: (state, action) => {
      state.selectedAnnouncementData = action.payload;
      state.announcementLoading = false;
    },
  },
});

export const {
  setAnnouncementCurrentPage,
  setAnnouncementPageLimit,
  setIsAddAnnouncement,
  setIsUpdateAnnouncement,
  setIsDeleteAnnouncement,
  setAnnouncementSearchParam,
  setAnnouncementList,
  clearSelectedAnnouncementData,
} = announcementSlice.actions;

export default announcementSlice.reducer;
