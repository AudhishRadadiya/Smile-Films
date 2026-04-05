import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  dropdownGroupList: {},
  groupLoading: false,
  isAddGroup: false,
  isUpdateGroup: false,
  isDeleteGroup: false,
  // groupPageLimit: 10,
  // groupCurrentPage: 1,
  groupSearchParam: '',
  selectedGroupData: {},
  dropdownListGroup: [],
  groupList: [],
};

/**
 * @desc dropdown-list-account-group
 */

export const getDropdownGroupList = createAsyncThunk(
  'group/dropdown-list-account-group',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .get('group/dropdown-list-account-group')
        .then(res => {
          const { data, msg, err } = res?.data;
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
 * @desc add-group
 */

export const addGroup = createAsyncThunk('group/add-group', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('group/add-group', data)
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
});

/**
 * @desc edit-group
 */

export const editGroup = createAsyncThunk('group/edit-group', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('group/edit-group', data)
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
});

/**
 * @desc delete-group
 */

export const deleteGroup = createAsyncThunk('group/delete-group', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('group/delete-group', data)
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
});

/**
 * @desc get-group
 */

export const getGroup = createAsyncThunk('group/get-group', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('group/get-group', data)
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
});

/**
 * @desc list-group-under
 * @param (limit, start, isActive,search)
 */

export const getDropdownListGroup = createAsyncThunk(
  'group/dropdown-list-group',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('group/dropdown-list-group', data)
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
 * @desc list-group
 * @param (limit, start, isActive,search)
 */

export const getGroupList = createAsyncThunk('group/list-group', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('group/list-group', data)
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

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    /* setGroupCurrentPage: (state, action) => {
      state.groupCurrentPage = action.payload;
    }, */
    /*    setGroupPageLimit: (state, action) => {
      state.groupPageLimit = action.payload;
    }, */
    setIsDeleteGroup: (state, action) => {
      state.isDeleteGroup = action.payload;
    },
    setIsUpdateGroup: (state, action) => {
      state.isUpdateGroup = action.payload;
    },
    setIsAddGroup: (state, action) => {
      state.isAddGroup = action.payload;
    },
    setGroupSearchParam: (state, action) => {
      state.groupSearchParam = action.payload;
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },
  },
  extraReducers: {
    [getDropdownGroupList.pending]: state => {
      state.groupLoading = true;
    },
    [getDropdownGroupList.rejected]: state => {
      state.dropdownGroupList = {};
      state.groupLoading = false;
    },
    [getDropdownGroupList.fulfilled]: (state, action) => {
      state.dropdownGroupList = action.payload;
      state.groupLoading = false;
    },
    [addGroup.pending]: state => {
      state.isAddGroup = false;
      state.groupLoading = true;
    },
    [addGroup.rejected]: state => {
      state.isAddGroup = false;
      state.groupLoading = false;
    },
    [addGroup.fulfilled]: state => {
      state.isAddGroup = true;
      state.groupLoading = false;
    },
    [editGroup.pending]: state => {
      state.isUpdateGroup = false;
      state.groupLoading = true;
    },
    [editGroup.rejected]: state => {
      state.isUpdateGroup = false;
      state.groupLoading = false;
    },
    [editGroup.fulfilled]: state => {
      state.isUpdateGroup = true;
      state.groupLoading = false;
    },
    [deleteGroup.pending]: state => {
      state.isDeleteGroup = false;
      state.groupLoading = true;
    },
    [deleteGroup.rejected]: state => {
      state.isDeleteGroup = false;
      state.groupLoading = false;
    },
    [deleteGroup.fulfilled]: state => {
      state.isDeleteGroup = true;
      state.groupLoading = false;
    },
    [getGroup.pending]: state => {
      state.selectedGroupData = {};
      state.groupLoading = true;
    },
    [getGroup.rejected]: state => {
      state.selectedGroupData = {};
      state.groupLoading = false;
    },
    [getGroup.fulfilled]: (state, action) => {
      state.selectedGroupData = action?.payload;
      state.groupLoading = false;
    },
    [getDropdownListGroup.pending]: state => {
      state.dropdownListGroup = {};
      state.groupLoading = true;
    },
    [getDropdownListGroup.rejected]: state => {
      state.dropdownListGroup = {};
      state.groupLoading = false;
    },
    [getDropdownListGroup.fulfilled]: (state, action) => {
      state.dropdownListGroup = action.payload?.data;
      state.groupLoading = false;
    },
    [getGroupList.pending]: state => {
      state.groupLoading = true;
    },
    [getGroupList.rejected]: state => {
      state.groupList = {};
      state.groupLoading = false;
    },
    [getGroupList.fulfilled]: (state, action) => {
      state.groupList = action.payload?.data?.list;
      state.groupLoading = false;
    },
  },
});

export const {
  // setGroupCurrentPage,
  // setGroupPageLimit,
  setIsAddGroup,
  setIsUpdateGroup,
  setIsDeleteGroup,
  setGroupSearchParam,
  setGroupList,
} = groupSlice.actions;

export default groupSlice.reducer;
