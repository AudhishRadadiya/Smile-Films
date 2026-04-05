import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  cityLoading: false,
  cityList: {},
  selectedCity: {},
  isAddCity: false,
  isUpdateCity: false,
  isDeleteCity: false,
  cityData: {},
  citySearchParam: '',
  cityPageLimit: 10,
  cityCurrentPage: 1,
  selectCountryForCity: {
    country: '',
    isActive: false,
  },
  selectStateForCity: {
    state: '',
    isActive: false,
  },
};

/**
 * @desc list-city
 * @param (limit, start, isActive)
 */

export const getCityList = createAsyncThunk('location/city/list-city', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/city/list-city', data)
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
 * @desc add-city
 * @param (limit, start, isActive)
 */

export const addCity = createAsyncThunk('location/city/add-city', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/city/add-city', data)
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
 * @desc get-city
 * @param (limit, start, isActive)
 */

export const getCityById = createAsyncThunk('location/city/get-city', id => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/city/get-city', { city_id: id })
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
 * @desc edit-city
 * @param (limit, start, isActive)
 */

export const editCity = createAsyncThunk('location/city/edit-city', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/city/edit-city', data)
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
 * @desc delete-city
 * @param (limit, start, isActive)
 */

export const deleteCity = createAsyncThunk('location/city/delete-city', id => {
  return new Promise((resolve, reject) => {
    axios
      .post('location/city/delete-city', { city_id: id })
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

const CitySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCityCurrentPage: (state, action) => {
      state.cityCurrentPage = action.payload;
    },
    setCityPageLimit: (state, action) => {
      state.cityPageLimit = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setIsAddCity: (state, action) => {
      state.isAddCity = action.payload;
    },
    setIsUpdateCity: (state, action) => {
      state.isUpdateCity = action.payload;
    },
    setIsDeleteCity: (state, action) => {
      state.isDeleteCity = action.payload;
    },
    setCitySearchParam: (state, action) => {
      state.citySearchParam = action.payload;
    },
    setSelectCountryForCity: (state, action) => {
      state.selectCountryForCity = action.payload;
    },
    setSelectStateForCity: (state, action) => {
      state.selectStateForCity = action.payload;
    },
    setCityList: (state, action) => {
      state.cityList = action.payload;
    },
  },
  extraReducers: {
    [getCityList.pending]: state => {
      state.cityLoading = true;
    },
    [getCityList.rejected]: state => {
      state.cityList = {};
      state.cityLoading = false;
    },
    [getCityList.fulfilled]: (state, action) => {
      state.cityList = action.payload?.data;
      state.cityLoading = false;
    },
    [addCity.pending]: state => {
      state.isAddCity = false;
      state.cityLoading = true;
    },
    [addCity.rejected]: state => {
      state.isAddCity = false;
      state.cityLoading = false;
    },
    [addCity.fulfilled]: (state, action) => {
      state.isAddCity = true;
      state.cityLoading = false;
    },
    [editCity.pending]: state => {
      state.isUpdateCity = false;
      state.cityLoading = true;
    },
    [editCity.rejected]: state => {
      state.isUpdateCity = false;
      state.cityLoading = false;
    },
    [editCity.fulfilled]: state => {
      state.isUpdateCity = true;
      state.cityLoading = false;
    },
    [getCityById.pending]: state => {
      state.cityData = {};
      state.cityLoading = true;
    },
    [getCityById.rejected]: state => {
      state.cityData = {};
      state.cityLoading = false;
    },
    [getCityById.fulfilled]: (state, action) => {
      state.cityData = action.payload.data;
      state.cityLoading = false;
    },
    [deleteCity.pending]: state => {
      state.isDeleteCity = false;
      state.cityLoading = true;
    },
    [deleteCity.rejected]: state => {
      state.isDeleteCity = false;
      state.cityLoading = false;
    },
    [deleteCity.fulfilled]: state => {
      state.isDeleteCity = true;
      state.cityLoading = false;
    },
  },
});

export const {
  setCityCurrentPage,
  setCityPageLimit,
  setIsAddCity,
  setIsUpdateCity,
  setIsDeleteCity,
  setCitySearchParam,
  setSelectCountryForCity,
  setSelectStateForCity,
  setCityList,
} = CitySlice.actions;
export default CitySlice.reducer;
