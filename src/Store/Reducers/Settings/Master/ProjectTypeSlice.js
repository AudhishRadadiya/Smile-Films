import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  projectTypeList: {},
  projectTypeLoading: false,
  isAddProjectType: false,
  isUpdateProjectType: false,
  isDeleteProjectType: false,
  projectTypePageLimit: 10,
  projectTypeCurrentPage: 1,
  projectTypeSearchParam: '',
  projectTypeData: {},
};

/**
 * @desc project_type_list
 * @param (limit, start, isActive,search)
 */

export const getProjectTypeList = createAsyncThunk(
  'setting/project_type/list',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/project_type/list', data)
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
 * @desc project_type_create
 */

export const addProjectType = createAsyncThunk(
  'setting/project_type/create',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/project_type/create', data)
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
 * @desc project_type_edit
 */

export const editProjectType = createAsyncThunk(
  'setting/project_type/edit',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/project_type/edit', data)
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
 * @desc project_type_delete
 */

export const deleteProjectType = createAsyncThunk(
  'setting/project_type/delete',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/project_type/delete', data)
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
 * @desc project_type_get
 *  * @param (project_type_id)
 */

export const getProjectType = createAsyncThunk(
  'setting/project_type/get',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/project_type/get', data)
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

const projectTypeSlice = createSlice({
  name: 'projectType',
  initialState,
  reducers: {
    setProjectTypeCurrentPage: (state, action) => {
      state.projectTypeCurrentPage = action.payload;
    },
    setProjectTypePageLimit: (state, action) => {
      state.projectTypePageLimit = action.payload;
    },
    setIsDeleteProjectType: (state, action) => {
      state.isDeleteProjectType = action.payload;
    },
    setIsUpdateProjectType: (state, action) => {
      state.isUpdateProjectType = action.payload;
    },
    setIsAddProjectType: (state, action) => {
      state.isAddProjectType = action.payload;
    },
    setProjectTypeSearchParam: (state, action) => {
      state.projectTypeSearchParam = action.payload;
    },
    setProjectTypeList: (state, action) => {
      state.projectTypeList = action.payload;
    },
  },
  extraReducers: {
    [getProjectTypeList.pending]: state => {
      state.projectTypeLoading = true;
    },
    [getProjectTypeList.rejected]: state => {
      state.projectTypeList = {};
      state.projectTypeLoading = false;
    },
    [getProjectTypeList.fulfilled]: (state, action) => {
      state.projectTypeList = action.payload?.data;
      state.projectTypeLoading = false;
    },
    [addProjectType.pending]: state => {
      state.isAddProjectType = false;
      state.projectTypeLoading = true;
    },
    [addProjectType.rejected]: state => {
      state.isAddProjectType = false;
      state.projectTypeLoading = false;
    },
    [addProjectType.fulfilled]: state => {
      state.isAddProjectType = true;
      state.projectTypeLoading = false;
    },
    [editProjectType.pending]: state => {
      state.isUpdateProjectType = false;
      state.projectTypeLoading = true;
    },
    [editProjectType.rejected]: state => {
      state.isUpdateProjectType = false;
      state.projectTypeLoading = false;
    },
    [editProjectType.fulfilled]: state => {
      state.isUpdateProjectType = true;
      state.projectTypeLoading = false;
    },
    [deleteProjectType.pending]: state => {
      state.isDeleteProjectType = false;
      state.projectTypeLoading = true;
    },
    [deleteProjectType.rejected]: state => {
      state.isDeleteProjectType = false;
      state.projectTypeLoading = false;
    },
    [deleteProjectType.fulfilled]: state => {
      state.isDeleteProjectType = true;
      state.projectTypeLoading = false;
    },
    [getProjectType.pending]: state => {
      state.projectTypeData = {};
      state.projectTypeLoading = true;
    },
    [getProjectType.rejected]: state => {
      state.projectTypeData = {};
      state.projectTypeLoading = false;
    },
    [getProjectType.fulfilled]: (state, action) => {
      state.projectTypeData = action.payload?.data;
      state.projectTypeLoading = false;
    },
  },
});

export const {
  setProjectTypeCurrentPage,
  setProjectTypePageLimit,
  setIsAddProjectType,
  setIsUpdateProjectType,
  setIsDeleteProjectType,
  setProjectTypeSearchParam,
  setProjectTypeList,
} = projectTypeSlice.actions;

export default projectTypeSlice.reducer;
