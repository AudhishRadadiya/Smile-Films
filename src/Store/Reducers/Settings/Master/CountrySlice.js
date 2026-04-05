import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  countryList: {},
  countryLoading: false,
  isAddCountry: false,
  isUpdateCountry: false,
  isDeleteCountry: false,
  countryPageLimit: 10,
  countryCurrentPage: 1,
  countrySearchParam: '',
  activeIndex: 0,
  countryData: {},
};

/**
 * @desc list-country
 * @param (limit, start, isActive)
 */

export const getCountryList = createAsyncThunk(
  'location/country/list-country',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/country/list-country', data)
        .then(res => {

          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
            pageNo: data?.pageNo ?data?.pageNo : '',
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
 * @desc add-country
 */

export const addCountry = createAsyncThunk(
  'location/country/add-country',
  data => {
    return new Promise((resolve, reject) => {
      const obj = {
        country: data.country,
        isActive: data.isActive,
      };
      axios
        .post('location/country/add-country', obj)
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
 * @desc edit-country
 */

export const editCountry = createAsyncThunk(
  'location/country/edit-country',
  data => {
    return new Promise((resolve, reject) => {
      const obj = {
        country: data?.country,
        country_id: data?.country_id,
        isActive: data?.isActive,
      };
      axios
        .post('location/country/edit-country', obj)
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
 * @desc delete-country
 */

export const deleteCountry = createAsyncThunk(
  'location/country/delete-country',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/country/delete-country', data)
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
 * @desc get-country
 * @param (country_id)
 */

export const getCountryData = createAsyncThunk(
  'location/country/get-country',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('location/country/get-country', data)
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

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCountryCurrentPage: (state, action) => {
      state.countryCurrentPage = action.payload;
    },
    setCountryPageLimit: (state, action) => {
      state.countryPageLimit = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setIsDeleteCountry: (state, action) => {
      state.isDeleteCountry = action.payload;
    },
    setIsUpdateCountry: (state, action) => {
      state.isUpdateCountry = action.payload;
    },
    setIsAddCountry: (state, action) => {
      state.isAddCountry = action.payload;
    },
    setCountrySearchParam: (state, action) => {
      state.countrySearchParam = action.payload;
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setCountryList: (state, action) => {
      state.countryList = action.payload;
    },
  },
  extraReducers: {
    [getCountryList.pending]: state => {
      state.countryLoading = true;
    },
    [getCountryList.rejected]: state => {
      state.countryList = {};
      state.countryLoading = false;
    },
    [getCountryList.fulfilled]: (state, action) => {
      state.countryList = action.payload?.data;
      state.countryLoading = false;
    },
    [addCountry.pending]: state => {
      state.isAddCountry = false;
      state.countryLoading = true;
    },
    [addCountry.rejected]: state => {
      state.isAddCountry = false;
      state.countryLoading = false;
    },
    [addCountry.fulfilled]: state => {
      state.isAddCountry = true;
      state.countryLoading = false;
    },
    [editCountry.pending]: state => {
      state.isUpdateCountry = false;
      state.countryLoading = true;
    },
    [editCountry.rejected]: state => {
      state.isUpdateCountry = false;
      state.countryLoading = false;
    },
    [editCountry.fulfilled]: state => {
      state.isUpdateCountry = true;
      state.countryLoading = false;
    },
    [deleteCountry.pending]: state => {
      state.isDeleteCountry = false;
      state.countryLoading = true;
    },
    [deleteCountry.rejected]: state => {
      state.isDeleteCountry = false;
      state.countryLoading = false;
    },
    [deleteCountry.fulfilled]: state => {
      state.isDeleteCountry = true;
      state.countryLoading = false;
    },
    [getCountryData.pending]: state => {
      state.countryLoading = true;
    },
    [getCountryData.rejected]: state => {
      state.countryData = {};
      state.countryLoading = false;
    },
    [getCountryData.fulfilled]: (state, action) => {
      state.countryData = action.payload?.data;
      state.countryLoading = false;
    },
  },
});

export const {
  setCountryCurrentPage,
  setCountryPageLimit,
  setIsAddCountry,
  setIsUpdateCountry,
  setIsDeleteCountry,
  setCountrySearchParam,
  setActiveIndex,
  setCountryList,
} = locationSlice.actions;

export default locationSlice.reducer;
