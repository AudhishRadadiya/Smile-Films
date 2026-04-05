import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  companyPermissionList: {},
  companyPermissionLoading: false,
  companyPageLimit: 10,
  companyCurrentPage: 1,
  companySearchParam: '',
  moduleList: [],
  allModuleList: [],
  selectedModuleList: {
    permission: [],
    isActive: true,
    company_name: '',
    company_id: '',
  },
  updateCompanyList: {},
  isAddUpdateCompany: false,
};

/**
 * @desc list-company
 * @param (limit, start, isActive,search)
 */

export const getCompanyPermissionList = createAsyncThunk(
  'company/list-company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company/list-company', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const updated = {
            ...data,
            list: data?.list ? data?.list : [],
            totalRows: data?.totalRows ? data?.totalRows : 0,
            pageNo: data?.pageNo ? data?.pageNo : '',
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

/**
 * @desc edit-company
 */

export const editCompanyPermission = createAsyncThunk(
  'roles_permission/company-permission',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/company-permission', data)
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
 * @desc get-company-roles
 */

export const getCompanyRoles = createAsyncThunk(
  'roles_permission/get-company-roles',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('roles_permission/get-company-roles', data)
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

const CompanyAndPermissionSlice = createSlice({
  name: 'companyPermission',
  initialState,
  reducers: {
    setCompanyCurrentPage: (state, action) => {
      state.companyCurrentPage = action.payload;
    },
    setCompanyPageLimit: (state, action) => {
      state.companyPageLimit = action.payload;
    },
    setIsAddUpdateCompany: (state, action) => {
      state.isAddUpdateCompany = action.payload;
    },
    setCompanySearchParam: (state, action) => {
      state.companySearchParam = action.payload;
    },
    clearSetUpdateCompanyList: (state, action) => {
      state.updateCompanyList = initialState.selectedModuleList;
    },
    setUpdateCompanyList: (state, action) => {
      state.updateCompanyList = action.payload;
    },
  },
  extraReducers: {
    [getCompanyPermissionList.pending]: state => {
      state.companyPermissionList = {};
      state.companyPermissionLoading = true;
    },
    [getCompanyPermissionList.rejected]: state => {
      state.companyPermissionList = {};
      state.companyPermissionLoading = false;
    },
    [getCompanyPermissionList.fulfilled]: (state, action) => {
      state.companyPermissionList = action.payload;
      state.companyPermissionLoading = false;
    },
    [editCompanyPermission.pending]: state => {
      state.isAddUpdateCompany = false;
      state.companyPermissionLoading = true;
    },
    [editCompanyPermission.rejected]: state => {
      state.isAddUpdateCompany = false;
      state.companyPermissionLoading = false;
    },
    [editCompanyPermission.fulfilled]: state => {
      state.isAddUpdateCompany = true;
      state.companyPermissionLoading = false;
    },
    [getModuleList.pending]: state => {
      state.moduleList = [];
      state.companyPermissionLoading = true;
    },
    [getModuleList.rejected]: state => {
      state.moduleList = [];
      state.companyPermissionLoading = false;
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
      state.companyPermissionLoading = false;
    },
    [getCompanyRoles.pending]: state => {
      state.selectedModuleList = {};
      state.companyPermissionLoading = true;
    },
    [getCompanyRoles.rejected]: state => {
      state.selectedModuleList = {};
      state.companyPermissionLoading = false;
    },
    [getCompanyRoles.fulfilled]: (state, action) => {
      state.selectedModuleList = action.payload;
      state.companyPermissionLoading = false;
    },
  },
});

export const {
  setCompanyCurrentPage,
  setCompanyPageLimit,
  setIsAddUpdateCompany,
  setCompanySearchParam,
  setUpdateCompanyList,
  clearSetUpdateCompanyList,
} = CompanyAndPermissionSlice.actions;

export default CompanyAndPermissionSlice.reducer;
