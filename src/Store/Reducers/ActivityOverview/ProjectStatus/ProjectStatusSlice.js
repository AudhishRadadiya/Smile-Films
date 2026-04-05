import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  projectStatusList: {},
  totalItems: [],
};

/**
 * @desc list-project_status:
 */

export const getProjectStatusList = createAsyncThunk(
  'activity-overview/project-status/list-project_status',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/project-status/list-project_status', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const updated = data?.list?.map(item => {
            return {
              ...item,
            };
          });
          let newObj = {
            list: updated,
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

const ProjectStatusSlice = createSlice({
  name: 'projectStatus',
  initialState,
  reducers: {
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
  },
  extraReducers: {
    [getProjectStatusList.pending]: state => {
      state.projectStatusListLoading = true;
    },
    [getProjectStatusList.rejected]: state => {
      state.projectStatusList = {};
      state.projectStatusListLoading = false;
    },
    [getProjectStatusList.fulfilled]: (state, action) => {
      state.projectStatusList = action.payload;
      state.projectStatusListLoading = false;
    },
  },
});

export const { setTotalItems } = ProjectStatusSlice.actions;

export default ProjectStatusSlice.reducer;
