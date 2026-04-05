import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  referenceList: {},
  referenceLoading: false,
  isAddReference: false,
  isUpdateReference: false,
  isDeleteReference: false,
  referencePageLimit: 10,
  referenceCurrentPage: 1,
  referenceSearchParam: '',
  referenceData: {},
};

/**
 * @desc getReferenceList
 * @param (limit, start, isActive,search)
 */

export const getReferenceList = createAsyncThunk(
  'setting/reference/list',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/reference/list', data)
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
 * @desc createReference
 */

export const addReference = createAsyncThunk(
  'setting/reference/create',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/reference/create', data)
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
 * @desc updateReference
 */

export const editReference = createAsyncThunk(
  'setting/reference/edit',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/reference/edit', data)
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
 * @desc deleteReference
 */

export const deleteReference = createAsyncThunk(
  'setting/reference/delete',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/reference/delete', data)
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
 * @desc getReference
 * @param (reference_id)
 */

export const getReferenceData = createAsyncThunk(
  'setting/reference/get',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/reference/get', data)
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

const referencesSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {
    setReferenceCurrentPage: (state, action) => {
      state.referenceCurrentPage = action.payload;
    },
    setReferencePageLimit: (state, action) => {
      state.referencePageLimit = action.payload;
    },
    setIsDeleteReference: (state, action) => {
      state.isDeleteReference = action.payload;
    },
    setIsUpdateReference: (state, action) => {
      state.isUpdateReference = action.payload;
    },
    setIsAddReference: (state, action) => {
      state.isAddReference = action.payload;
    },
    setReferenceSearchParam: (state, action) => {
      state.referenceSearchParam = action.payload;
    },
    setReferenceList: (state, action) => {
      state.referenceList = action.payload;
    },
  },
  extraReducers: {
    [getReferenceList.pending]: state => {
      state.referenceLoading = true;
    },
    [getReferenceList.rejected]: state => {
      state.referenceList = {};
      state.referenceLoading = false;
    },
    [getReferenceList.fulfilled]: (state, action) => {
      state.referenceList = action.payload?.data;
      state.referenceLoading = false;
    },
    [addReference.pending]: state => {
      state.isAddReference = false;
      state.referenceLoading = true;
    },
    [addReference.rejected]: state => {
      state.isAddReference = false;
      state.referenceLoading = false;
    },
    [addReference.fulfilled]: state => {
      state.isAddReference = true;
      state.referenceLoading = false;
    },
    [editReference.pending]: state => {
      state.isUpdateReference = false;
      state.referenceLoading = true;
    },
    [editReference.rejected]: state => {
      state.isUpdateReference = false;
      state.referenceLoading = false;
    },
    [editReference.fulfilled]: state => {
      state.isUpdateReference = true;
      state.referenceLoading = false;
    },
    [deleteReference.pending]: state => {
      state.isDeleteReference = false;
      state.referenceLoading = true;
    },
    [deleteReference.rejected]: state => {
      state.isDeleteReference = false;
      state.referenceLoading = false;
    },
    [deleteReference.fulfilled]: state => {
      state.isDeleteReference = true;
      state.referenceLoading = false;
    },
    [getReferenceData.pending]: state => {
      state.referenceLoading = true;
    },
    [getReferenceData.rejected]: state => {
      state.referenceData = {};
      state.referenceLoading = false;
    },
    [getReferenceData.fulfilled]: (state, action) => {
      state.referenceData = action.payload?.data;
      state.referenceLoading = false;
    },
  },
});

export const {
  setReferenceCurrentPage,
  setReferencePageLimit,
  setIsAddReference,
  setIsUpdateReference,
  setIsDeleteReference,
  setReferenceSearchParam,
  setReferenceList,
} = referencesSlice.actions;

export default referencesSlice.reducer;
