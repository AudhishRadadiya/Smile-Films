import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  stateLoading: false,
  stateList: {},
  isAddState: false,
  isUpdateState: false,
  isDeleteState: false,
  stateData: {},
  stateSearchParam: '',
  statePageLimit: 10,
  stateCurrentPage: 1,
  selectCountryForState: {
    country: '',
    isActive: false,
  },
};

/**
 * @desc list-state
 * @param (limit, start, isActive)
 */

export const getStateList = createAsyncThunk(
  'location/state/list-state',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/state/list-state', data)
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
 * @desc add-state
 * @param (limit, start, isActive)
 */

export const addState = createAsyncThunk('location/state/add-state', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/state/add-state', data)
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
});

/**
 * @desc get-state
 * @param (state_id)
 */

export const getStateById = createAsyncThunk(
  'location/state/get-state',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/state/get-state', data)
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
 * @desc edit-state
 * @param (limit, start, isActive)
 */

export const editState = createAsyncThunk('location/state/edit-state', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/state/edit-state', data)
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
});

/**
 * @desc delete-state
 * @param (limit, start, isActive)
 */

export const deleteState = createAsyncThunk(
  'location/state/delete-state',
  id => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/state/delete-state', { state_id: id })
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

const StateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setStateCurrentPage: (state, action) => {
      state.stateCurrentPage = action.payload;
    },
    setStatePageLimit: (state, action) => {
      state.statePageLimit = action.payload;
    },
    setIsAddState: (state, action) => {
      state.isAddState = action.payload;
    },
    setIsUpdateState: (state, action) => {
      state.isUpdateState = action.payload;
    },
    setIsDeleteState: (state, action) => {
      state.isDeleteState = action.payload;
    },
    setStateSearchParam: (state, action) => {
      state.stateSearchParam = action.payload;
    },
    setSelectCountryForState: (state, action) => {
      state.selectCountryForState = action.payload;
    },
    setStateList: (state, action) => {
      state.stateList = action.payload;
    },
  },
  extraReducers: {
    [getStateList.pending]: state => {
      state.stateLoading = true;
    },
    [getStateList.rejected]: state => {
      state.stateList = {};
      state.stateLoading = false;
    },
    [getStateList.fulfilled]: (state, action) => {
      state.stateList = action.payload?.data;
      state.stateLoading = false;
    },
    [addState.pending]: state => {
      state.isAddState = false;
      state.stateLoading = true;
    },
    [addState.rejected]: state => {
      state.isAddState = false;
      state.stateLoading = false;
    },
    [addState.fulfilled]: (state, action) => {
      state.isAddState = true;
      state.stateLoading = false;
    },
    [editState.pending]: state => {
      state.isUpdateState = false;
      state.stateLoading = true;
    },
    [editState.rejected]: state => {
      state.isUpdateState = false;
      state.stateLoading = false;
    },
    [editState.fulfilled]: state => {
      state.isUpdateState = true;
      state.stateLoading = false;
    },
    [getStateById.pending]: state => {
      state.stateLoading = true;
    },
    [getStateById.rejected]: state => {
      state.stateData = {};
      state.stateLoading = false;
    },
    [getStateById.fulfilled]: (state, action) => {
      state.stateData = action.payload.data;
      state.stateLoading = false;
    },
    [deleteState.pending]: state => {
      state.isDeleteState = false;
      state.stateLoading = true;
    },
    [deleteState.rejected]: state => {
      state.isDeleteState = false;
      state.stateLoading = false;
    },
    [deleteState.fulfilled]: state => {
      state.isDeleteState = true;
      state.stateLoading = false;
    },
  },
});

export const {
  setStateCurrentPage,
  setStatePageLimit,
  setIsAddState,
  setIsUpdateState,
  setIsDeleteState,
  setStateSearchParam,
  setSelectCountryForState,
  setStateList,
} = StateSlice.actions;

export default StateSlice.reducer;
