import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  companyList: {},
  companyLoading: false,
  isAddCompany: false,
  isUpdateCompany: false,
  isDeleteCompany: false,
  companyPageLimit: 10,
  companyCurrentPage: 1,
  companySearchParam: '',
  selectedCompanyData: {},
  companyData: {
    company_logo: '',
    number: '',
    company_name: '',
    legal_name: '',
    employee_code: '',
    business_type: '',
    director_name: '',
    website: '',
    email_id: '',
    mobile_no: '',
    pan_no: '',
    admin_password: '',
    tan_no: '',
    gst_no: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pin_code: '',
    bank_adress: '',
    bank_name: '',
    branch_name: '',
    ifsc_code: '',
    account_no: '',
    iban_no: '',
    swift_code: '',
    upi_code: '',
    isActive: true,
  },
  addSelectedCompanyData: {},
  updateSelectedCompanyData: {},
  isGetInitialValues: {
    add: false,
    update: false,
  },
};

/**
 * @desc list-company
 * @param (limit, start, isActive,search)
 */

export const getCompanyList = createAsyncThunk('company/list-company', data => {
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
});

/**
 * @desc add-company
 */

export const addCompany = createAsyncThunk('company/add-company', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('company/add-company', data)
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
 * @desc edit-company
 */

export const editCompany = createAsyncThunk('company/edit-company', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('company/edit-company', data)
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
 * @desc delete-company
 */

export const deleteCompany = createAsyncThunk(
  'company/delete-company',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('company/delete-company', data)
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
 * @desc get-company
 */

export const getCompany = createAsyncThunk('company/get-company', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('company/get-company', data)
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

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyCurrentPage: (state, action) => {
      state.companyCurrentPage = action.payload;
    },
    setCompanyPageLimit: (state, action) => {
      state.companyPageLimit = action.payload;
    },
    setIsDeleteCompany: (state, action) => {
      state.isDeleteCompany = action.payload;
    },
    setIsUpdateCompany: (state, action) => {
      state.isUpdateCompany = action.payload;
    },
    setIsAddCompany: (state, action) => {
      state.isAddCompany = action.payload;
    },
    setCompanySearchParam: (state, action) => {
      state.companySearchParam = action.payload;
    },
    setCompanyList: (state, action) => {
      state.companyList = action.payload;
    },
    setAddSelectedCompanyData: (state, action) => {
      state.addSelectedCompanyData = action.payload;
    },
    setIsGetInitialValues: (state, action) => {
      state.isGetInitialValues = action.payload;
    },
    clearAddSelectedCompanyData: state => {
      state.addSelectedCompanyData = initialState.companyData;
    },
    setUpdateSelectedCompanyData: (state, action) => {
      state.updateSelectedCompanyData = action.payload;
    },
    clearUpdateSelectedCompanyData: state => {
      state.updateSelectedCompanyData = initialState.companyData;
    },
  },
  extraReducers: {
    [getCompanyList.pending]: state => {
      state.companyList = {};
      state.companyLoading = true;
    },
    [getCompanyList.rejected]: state => {
      state.companyList = {};
      state.companyLoading = false;
    },
    [getCompanyList.fulfilled]: (state, action) => {
      state.companyList = action.payload;
      state.companyLoading = false;
    },
    [addCompany.pending]: state => {
      state.isAddCompany = false;
      state.companyLoading = true;
    },
    [addCompany.rejected]: state => {
      state.isAddCompany = false;
      state.companyLoading = false;
    },
    [addCompany.fulfilled]: state => {
      state.isAddCompany = true;
      state.companyLoading = false;
    },
    [editCompany.pending]: state => {
      state.isUpdateCompany = false;
      state.companyLoading = true;
    },
    [editCompany.rejected]: state => {
      state.isUpdateCompany = false;
      state.companyLoading = false;
    },
    [editCompany.fulfilled]: state => {
      state.isUpdateCompany = true;
      state.companyLoading = false;
    },
    [deleteCompany.pending]: state => {
      state.isDeleteCompany = false;
      state.companyLoading = true;
    },
    [deleteCompany.rejected]: state => {
      state.isDeleteCompany = false;
      state.companyLoading = false;
    },
    [deleteCompany.fulfilled]: state => {
      state.isDeleteCompany = true;
      state.companyLoading = false;
    },
    [getCompany.pending]: state => {
      state.selectedCompanyData = {};
      state.companyLoading = true;
    },
    [getCompany.rejected]: state => {
      state.selectedCompanyData = {};
      state.companyLoading = false;
    },
    [getCompany.fulfilled]: (state, action) => {
      state.selectedCompanyData = action?.payload;
      state.companyLoading = false;
    },
  },
});

export const {
  setCompanyCurrentPage,
  setCompanyPageLimit,
  setIsAddCompany,
  setIsUpdateCompany,
  setIsDeleteCompany,
  setCompanySearchParam,
  setCompanyList,
  setAddSelectedCompanyData,
  setIsGetInitialValues,
  clearAddSelectedCompanyData,
  setUpdateSelectedCompanyData,
  clearUpdateSelectedCompanyData,
} = companySlice.actions;

export default companySlice.reducer;
