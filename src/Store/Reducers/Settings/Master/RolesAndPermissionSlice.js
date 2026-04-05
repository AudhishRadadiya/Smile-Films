import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  roleList: {},
  roleLoading: false,
  isAddUpdateRole: false,
  isDeleteRole: false,
  rolePageLimit: 10,
  roleCurrentPage: 1,
  roleSearchParam: '',
  moduleList: [],
  allModuleList: [],
  selectedModuleList: {
    permission: [],
    isActive: true,
    role_name: '',
    role_id: '',
  },
  addRoleList: {},
  updateRoleList: {},
};

/**
 * @desc list-roles
 * @param (limit, start, isActive,search)
 */

export const getRoleList = createAsyncThunk(
  'roles_permission/list-roles',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/list-roles', data)
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
 * @desc add-roles
 */

export const addRoles = createAsyncThunk('roles_permission/add-roles', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('roles_permission/add-roles', data)
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
 * @desc edit-roles
 */

export const editRoles = createAsyncThunk(
  'roles_permission/edit-roles',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/edit-roles', data)
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
 * @desc delete-roles
 */

export const deleteRoles = createAsyncThunk(
  'roles_permission/delete-roles',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/delete-roles', data)
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
 * @desc get-modules
 */

export const getModuleList = createAsyncThunk(
  'roles_permission/get-modules',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/get-modules', data)
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
 * @desc get-roles
 */

export const getRoles = createAsyncThunk('roles_permission/get-roles', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('roles_permission/get-roles', data)
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

const RolesAndPermissionSlice = createSlice({
  name: 'rolesAndPermission',
  initialState,
  reducers: {
    setRoleCurrentPage: (state, action) => {
      state.roleCurrentPage = action.payload;
    },
    setRolePageLimit: (state, action) => {
      state.rolePageLimit = action.payload;
    },
    seIsDeleteRole: (state, action) => {
      state.isDeleteRole = action.payload;
    },
    setIsAddUpdateRole: (state, action) => {
      state.isAddUpdateRole = action.payload;
    },
    setRoleSearchParam: (state, action) => {
      state.roleSearchParam = action.payload;
    },
    setRoleList: (state, action) => {
      state.roleList = action.payload;
    },
    clearSetUpdateRoleList: (state, action) => {
      state.updateRoleList = initialState.selectedModuleList;
    },
    clearSetAddRoleList: (state, action) => {
      state.addRoleList = initialState.selectedModuleList;
    },
    setUpdateRoleList: (state, action) => {
      state.updateRoleList = action.payload;
    },
    setAddRoleList: (state, action) => {
      state.addRoleList = action.payload;
    },
  },
  extraReducers: {
    [getRoleList.pending]: state => {
      state.roleLoading = true;
    },
    [getRoleList.rejected]: state => {
      state.roleList = {};
      state.roleLoading = false;
    },
    [getRoleList.fulfilled]: (state, action) => {
      state.roleList = action.payload?.data;
      state.roleLoading = false;
    },
    [addRoles.pending]: state => {
      state.isAddUpdateRole = false;
      state.roleLoading = true;
    },
    [addRoles.rejected]: state => {
      state.isAddUpdateRole = false;
      state.roleLoading = false;
    },
    [addRoles.fulfilled]: state => {
      state.isAddUpdateRole = true;
      state.roleLoading = false;
    },
    [editRoles.pending]: state => {
      state.isAddUpdateRole = false;
      state.roleLoading = true;
    },
    [editRoles.rejected]: state => {
      state.isAddUpdateRole = false;
      state.roleLoading = false;
    },
    [editRoles.fulfilled]: state => {
      state.isAddUpdateRole = true;
      state.roleLoading = false;
    },
    [deleteRoles.pending]: state => {
      state.isDeleteRole = false;
      state.roleLoading = true;
    },
    [deleteRoles.rejected]: state => {
      state.isDeleteRole = false;
      state.roleLoading = false;
    },
    [deleteRoles.fulfilled]: state => {
      state.isDeleteRole = true;
      state.roleLoading = false;
    },
    [getModuleList.pending]: state => {
      state.moduleList = [];
      state.roleLoading = true;
    },
    [getModuleList.rejected]: state => {
      state.moduleList = [];
      state.roleLoading = false;
    },
    [getModuleList.fulfilled]: (state, action) => {
      let updatedList = action.payload?.data?.filter(mainModule => {
        // Remove submodules with name "All" because it's used for only show profile and setting's first page
        if (mainModule.name !== 'All') {
          return {
            ...mainModule,
            isSelectedAll: false,
          };
        }
      });

      state.moduleList = {
        permission: updatedList,
      };
      state.allModuleList = action.payload.data;
      state.roleLoading = false;
    },
    [getRoles.pending]: state => {
      state.selectedModuleList = {};
      state.roleLoading = true;
    },
    [getRoles.rejected]: state => {
      state.selectedModuleList = {};
      state.roleLoading = false;
    },
    [getRoles.fulfilled]: (state, action) => {
      state.selectedModuleList = action.payload;
      state.roleLoading = false;
    },
  },
});

export const {
  setRoleCurrentPage,
  setRolePageLimit,
  setIsAddUpdateRole,
  seIsDeleteRole,
  setRoleSearchParam,
  setRoleList,
  setAddRoleList,
  setUpdateRoleList,
  clearSetAddRoleList,
  clearSetUpdateRoleList,
} = RolesAndPermissionSlice.actions;

export default RolesAndPermissionSlice.reducer;
