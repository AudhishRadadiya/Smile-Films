import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  devicesList: {},
  devicesLoading: false,
  isAddDevices: false,
  isUpdateDevices: false,
  isDeleteDevices: false,
  devicesPageLimit: 10,
  devicesCurrentPage: 1,
  devicesSearchParam: '',
  deviceData: {},
};

/**
 * @desc getDevicesList
 * @param (limit, start, isActive,search)
 */

export const getDevicesList = createAsyncThunk('/setting/device/list', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('/setting/device/list', data)
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
});

/**
 * @desc createDevice
 */

export const addDevices = createAsyncThunk('setting/device/create', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/device/create', data)
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
 * @desc updateDevice
 */

export const editDevices = createAsyncThunk('setting/device/edit', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/device/edit', data)
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
 * @desc deleteDevice
 */

export const deleteDevices = createAsyncThunk('setting/device/delete', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/device/delete', data)
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
 * @desc getDevice
 * @param (device_id)
 */

export const getDeviceData = createAsyncThunk('setting/device/get', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/device/get', data)
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

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevicesCurrentPage: (state, action) => {
      state.devicesCurrentPage = action.payload;
    },
    setDevicesPageLimit: (state, action) => {
      state.devicesPageLimit = action.payload;
    },
    setIsDeleteDevices: (state, action) => {
      state.isDeleteDevices = action.payload;
    },
    setIsUpdateDevices: (state, action) => {
      state.isUpdateDevices = action.payload;
    },
    setIsAddDevices: (state, action) => {
      state.isAddDevices = action.payload;
    },
    setDevicesSearchParam: (state, action) => {
      state.devicesSearchParam = action.payload;
    },
    setDevicesList: (state, action) => {
      state.devicesList = action.payload;
    },
  },
  extraReducers: {
    [getDevicesList.pending]: state => {
      state.devicesLoading = true;
    },
    [getDevicesList.rejected]: state => {
      state.devicesList = {};
      state.devicesLoading = false;
    },
    [getDevicesList.fulfilled]: (state, action) => {
      state.devicesList = action.payload?.data;
      state.devicesLoading = false;
    },
    [addDevices.pending]: state => {
      state.isAddDevices = false;
      state.devicesLoading = true;
    },
    [addDevices.rejected]: state => {
      state.isAddDevices = false;
      state.devicesLoading = false;
    },
    [addDevices.fulfilled]: state => {
      state.isAddDevices = true;
      state.devicesLoading = false;
    },
    [editDevices.pending]: state => {
      state.isUpdateDevices = false;
      state.devicesLoading = true;
    },
    [editDevices.rejected]: state => {
      state.isUpdateDevices = false;
      state.devicesLoading = false;
    },
    [editDevices.fulfilled]: state => {
      state.isUpdateDevices = true;
      state.devicesLoading = false;
    },
    [deleteDevices.pending]: state => {
      state.isDeleteDevices = false;
      state.devicesLoading = true;
    },
    [deleteDevices.rejected]: state => {
      state.isDeleteDevices = false;
      state.devicesLoading = false;
    },
    [deleteDevices.fulfilled]: state => {
      state.isDeleteDevices = true;
      state.devicesLoading = false;
    },
    [getDeviceData.pending]: state => {
      state.devicesLoading = true;
    },
    [getDeviceData.rejected]: state => {
      state.deviceData = {};
      state.devicesLoading = false;
    },
    [getDeviceData.fulfilled]: (state, action) => {
      state.deviceData = action.payload?.data;
      state.devicesLoading = false;
    },
  },
});

export const {
  setDevicesCurrentPage,
  setDevicesPageLimit,
  setIsAddDevices,
  setIsUpdateDevices,
  setIsDeleteDevices,
  setDevicesSearchParam,
  setDevicesList,
} = devicesSlice.actions;

export default devicesSlice.reducer;
