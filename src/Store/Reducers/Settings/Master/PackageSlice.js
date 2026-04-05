import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  packageList: {},
  packageLoading: false,
  isAddPackage: false,
  isUpdatePackage: false,
  isDeletePackage: false,
  packagePageLimit: 10,
  packageCurrentPage: 1,
  packageSearchParam: '',
  packageData: {},
};

/**
 * @desc Package list
 * @param (limit, start, isActive,search)
 */

export const getPackageList = createAsyncThunk(
  'setting-master/package/list',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting-master/package/list', data)
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
 * @desc Create package
 */

export const addPackage = createAsyncThunk(
  'setting-master/package/create',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting-master/package/create', data)
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
 * @desc Edit package
 */

export const editPackage = createAsyncThunk(
  'setting-master/package/edit',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting-master/package/edit', data)
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
 * @desc Remove package
 */

export const deletePackage = createAsyncThunk(
  'setting-master/packae/remove',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting-master/packae/remove', data)
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
 * @desc Single package
 *  * @param (package_id)
 */

export const getPackageData = createAsyncThunk(
  'setting-master/package/get-single',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting-master/package/get-single', data)
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

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setPackageCurrentPage: (state, action) => {
      state.packageCurrentPage = action.payload;
    },
    setPackagePageLimit: (state, action) => {
      state.packagePageLimit = action.payload;
    },
    setIsDeletePackage: (state, action) => {
      state.isDeletePackage = action.payload;
    },
    setIsUpdatePackage: (state, action) => {
      state.isUpdatePackage = action.payload;
    },
    setIsAddPackage: (state, action) => {
      state.isAddPackage = action.payload;
    },
    setPackageSearchParam: (state, action) => {
      state.packageSearchParam = action.payload;
    },
    setPackageList: (state, action) => {
      state.packageList = action.payload;
    },
  },
  extraReducers: {
    [getPackageList.pending]: state => {
      state.packageLoading = true;
    },
    [getPackageList.rejected]: state => {
      state.packageList = {};
      state.packageLoading = false;
    },
    [getPackageList.fulfilled]: (state, action) => {
      state.packageList = action.payload?.data;
      state.packageLoading = false;
    },
    [addPackage.pending]: state => {
      state.isAddPackage = false;
      state.packageLoading = true;
    },
    [addPackage.rejected]: state => {
      state.isAddPackage = false;
      state.packageLoading = false;
    },
    [addPackage.fulfilled]: state => {
      state.isAddPackage = true;
      state.packageLoading = false;
    },
    [editPackage.pending]: state => {
      state.isUpdatePackage = false;
      state.packageLoading = true;
    },
    [editPackage.rejected]: state => {
      state.isUpdatePackage = false;
      state.packageLoading = false;
    },
    [editPackage.fulfilled]: state => {
      state.isUpdatePackage = true;
      state.packageLoading = false;
    },
    [deletePackage.pending]: state => {
      state.isDeletePackage = false;
      state.packageLoading = true;
    },
    [deletePackage.rejected]: state => {
      state.isDeletePackage = false;
      state.packageLoading = false;
    },
    [deletePackage.fulfilled]: state => {
      state.isDeletePackage = true;
      state.packageLoading = false;
    },
    [getPackageData.pending]: state => {
      state.packageLoading = true;
    },
    [getPackageData.rejected]: state => {
      state.packageData = {};
      state.packageLoading = false;
    },
    [getPackageData.fulfilled]: (state, action) => {
      state.packageData = action.payload?.data;
      state.packageLoading = false;
    },
  },
});

export const {
  setPackageCurrentPage,
  setPackagePageLimit,
  setIsAddPackage,
  setIsUpdatePackage,
  setIsDeletePackage,
  setPackageSearchParam,
  setPackageList,
} = packageSlice.actions;

export default packageSlice.reducer;
