import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  employeeList: {},
  employeeLoading: false,
  isAddEmployee: false,
  isUpdateEmployee: false,
  isDeleteEmployee: false,
  employeePageLimit: 10,
  employeeCurrentPage: 1,
  employeeSearchParam: '',
  uploadfileLoading: false,
  isUploadFile: false,
  getEmployeeNumberData: '',
  getEmployeeNumberLoading: false,
  employeeData: {
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_no: '',
    birth_date: '',
    gender: 1,
    blood_group: '',
    marital_status: '',
    type: 1,
    current_address: '',
    country: '',
    state: '',
    city: '',
    group_name: '',
    opening_balance_type: 1,
    opening_balance: 0,
    image: '',
    bank_first_name: '',
    bank_last_name: '',
    bank_name: '',
    account_type: '',
    account_no: '',
    ifsc_code: '',
    company_name: '',
    user_email_id: '',
    original_password: '',
    password: '',
    emp_no: '',
    joining_date: '',
    role: '',
    isChecker: false,
    editing_package: '',
    salary_type: 2,
    salary_amount: '',
    isActive: true,
  },
  addSelectedEmployeeData: {},
  updateSelectedEmployeeData: {},
  isGetInitialValuesEmployee: {
    add: false,
    update: false,
  },
};

/**
 * @desc list-employee
 * @param (limit, start, isActive,search)
 */

export const getEmployeeList = createAsyncThunk(
  'company-setting/employee/list-employee',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/list-employee', data)
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
 * @desc add-employee
 */

export const addEmployee = createAsyncThunk(
  'company-setting/employee/add-employee',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/add-employee', data)
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
          toast.error(errors.response.data.msg);
          reject(errors);
        });
    });
  },
);

/**
 * @desc edit-employee
 */

export const editEmployee = createAsyncThunk(
  'company-setting/employee/edit-employee',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/edit-employee', data)
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
 * @desc delete-employee
 */

export const deleteEmployee = createAsyncThunk(
  'company-setting/employee/delete-employee',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/delete-employee', data)
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
 * @desc get-employee
 */

export const getEmployee = createAsyncThunk(
  'company-setting/employee/get-employee',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/get-employee', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const updated = {
            ...data,
            joining_date: new Date(data?.joining_date),
            birth_date: new Date(data?.birth_date),
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

export const uploadFile = createAsyncThunk('upload-file', file => {
  return new Promise((resolve, reject) => {
    if (file) {
      let body = new FormData();
      body.append('file', file);
      const headers = { 'Content-Type': 'multipart/form-data' };

      axios
        .post('upload-file', body, {
          headers: headers,
        })
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
    }
  });
});

/**
 * @desc company-setting/employee/get-employee-commission:
 */
export const getEmployeeCommission = createAsyncThunk(
  'company-setting/employee/get-employee-commission',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/get-employee-commission', payload)
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
          toast.error(errors.message);
          reject(errors);
        });
    });
  },
);

/**
 * @desc company-setting/employee/get-employee-no:
 */
export const getEmployeeNumber = createAsyncThunk(
  'company-setting/employee/get-employee-no',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('company-setting/employee/get-employee-no', payload)
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
          toast.error(errors.message);
          reject(errors);
        });
    });
  },
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeCurrentPage: (state, action) => {
      state.employeeCurrentPage = action.payload;
    },
    setEmployeePageLimit: (state, action) => {
      state.employeePageLimit = action.payload;
    },
    setIsDeleteEmployee: (state, action) => {
      state.isDeleteEmployee = action.payload;
    },
    setIsUpdateEmployee: (state, action) => {
      state.isUpdateEmployee = action.payload;
    },
    setIsAddEmployee: (state, action) => {
      state.isAddEmployee = action.payload;
    },
    setEmployeeSearchParam: (state, action) => {
      state.employeeSearchParam = action.payload;
    },
    setClientCompanyList: (state, action) => {
      state.employeeList = action.payload;
    },
    setAddSelectedEmployeeData: (state, action) => {
      state.addSelectedEmployeeData = action.payload;
    },
    setIsGetInitialValuesEmployee: (state, action) => {
      state.isGetInitialValuesEmployee = action.payload;
    },
    clearAddSelectedEmployeeData: state => {
      state.addSelectedEmployeeData = initialState.employeeData;
    },
    setUpdateSelectedEmployeeData: (state, action) => {
      state.updateSelectedEmployeeData = action.payload;
    },
    clearUpdateSelectedEmployeeData: state => {
      state.updateSelectedEmployeeData = initialState.employeeData;
    },
  },
  extraReducers: {
    [getEmployeeList.pending]: state => {
      state.employeeList = {};
      state.employeeLoading = true;
    },
    [getEmployeeList.rejected]: state => {
      state.employeeList = {};
      state.employeeLoading = false;
    },
    [getEmployeeList.fulfilled]: (state, action) => {
      state.employeeList = action.payload;
      state.employeeLoading = false;
    },
    [addEmployee.pending]: state => {
      state.isAddEmployee = false;
      state.employeeLoading = true;
    },
    [addEmployee.rejected]: state => {
      state.isAddEmployee = false;
      state.employeeLoading = false;
    },
    [addEmployee.fulfilled]: state => {
      state.isAddEmployee = true;
      state.employeeLoading = false;
    },
    [editEmployee.pending]: state => {
      state.isUpdateEmployee = false;
      state.employeeLoading = true;
    },
    [editEmployee.rejected]: state => {
      state.isUpdateEmployee = false;
      state.employeeLoading = false;
    },
    [editEmployee.fulfilled]: state => {
      state.isUpdateEmployee = true;
      state.employeeLoading = false;
    },
    [deleteEmployee.pending]: state => {
      state.isDeleteEmployee = false;
      state.employeeLoading = true;
    },
    [deleteEmployee.rejected]: state => {
      state.isDeleteEmployee = false;
      state.employeeLoading = false;
    },
    [deleteEmployee.fulfilled]: state => {
      state.isDeleteEmployee = true;
      state.employeeLoading = false;
    },
    [getEmployee.pending]: state => {
      state.selectedEmployeeData = {};
      state.employeeLoading = true;
    },
    [getEmployee.rejected]: state => {
      state.selectedEmployeeData = {};
      state.employeeLoading = false;
    },
    [getEmployee.fulfilled]: (state, action) => {
      state.selectedEmployeeData = action?.payload;
      state.employeeLoading = false;
    },
    [uploadFile.pending]: state => {
      state.isUploadFile = false;
      state.uploadfileLoading = true;
    },
    [uploadFile.rejected]: state => {
      state.isUploadFile = false;
      state.uploadfileLoading = false;
    },
    [uploadFile.fulfilled]: state => {
      state.isUploadFile = true;
      state.uploadfileLoading = false;
    },
    [getEmployeeCommission.pending]: state => {
      state.getEmployeeCommissionLoading = true;
    },
    [getEmployeeCommission.rejected]: state => {
      state.getEmployeeCommissionData = {};
      state.getEmployeeCommissionLoading = false;
    },
    [getEmployeeCommission.fulfilled]: (state, action) => {
      state.getEmployeeCommissionData = action.payload;
      state.getEmployeeCommissionLoading = false;
    },
    [getEmployeeNumber.pending]: state => {
      state.getEmployeeNumberLoading = true;
    },
    [getEmployeeNumber.rejected]: state => {
      state.getEmployeeNumberData = '';
      state.getEmployeeNumberLoading = false;
    },
    [getEmployeeNumber.fulfilled]: (state, action) => {
      state.getEmployeeNumberData = action.payload;
      state.getEmployeeNumberLoading = false;
    },
  },
});

export const {
  setEmployeeCurrentPage,
  setEmployeePageLimit,
  setIsAddEmployee,
  setIsUpdateEmployee,
  setIsDeleteEmployee,
  setEmployeeSearchParam,
  setClientCompanyList,
  setAddSelectedEmployeeData,
  setIsGetInitialValuesEmployee,
  clearAddSelectedEmployeeData,
  setUpdateSelectedEmployeeData,
  clearUpdateSelectedEmployeeData,
} = employeeSlice.actions;

export default employeeSlice.reducer;
