import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  subscriptionList: {},
  subscriptionLoading: false,
  isAddSubscription: false,
  isUpdateSubscription: false,
  isDeleteSubscription: false,
  subscriptionPageLimit: 10,
  subscriptionCurrentPage: 1,
  subscriptionSearchParam: '',
  subscriptionData: {},
};

export const getSubscriptionList = createAsyncThunk(
  'subscription/list-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/list-subscription', data)
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

export const addSubscription = createAsyncThunk(
  'subscription/add-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/add-subscription', data)
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

export const editSubscription = createAsyncThunk(
  'subscription/edit-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/edit-subscription', data)
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

export const deleteSubscription = createAsyncThunk(
  'subscription/delete-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('subscription/delete-subscription', data)
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

export const getSubscription = createAsyncThunk(
  '/subscription/get-subscription',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('/subscription/get-subscription', data)
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

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionCurrentPage: (state, action) => {
      state.subscriptionCurrentPage = action.payload;
    },
    setSubscriptionPageLimit: (state, action) => {
      state.subscriptionPageLimit = action.payload;
    },
    setIsDeleteSubscription: (state, action) => {
      state.isDeleteSubscription = action.payload;
    },
    setIsUpdateSubscription: (state, action) => {
      state.isUpdateSubscription = action.payload;
    },
    setIsAddSubscription: (state, action) => {
      state.isAddSubscription = action.payload;
    },
    setSubscriptionSearchParam: (state, action) => {
      state.subscriptionSearchParam = action.payload;
    },
    setSubscriptionList: (state, action) => {
      state.subscriptionList = action.payload;
    },
  },
  extraReducers: {
    [getSubscriptionList.pending]: state => {
      state.subscriptionLoading = true;
    },
    [getSubscriptionList.rejected]: state => {
      state.subscriptionList = {};
      state.subscriptionLoading = false;
    },
    [getSubscriptionList.fulfilled]: (state, action) => {
      state.subscriptionList = action.payload?.data;
      state.subscriptionLoading = false;
    },
    [addSubscription.pending]: state => {
      state.isAddSubscription = false;
      state.subscriptionLoading = true;
    },
    [addSubscription.rejected]: state => {
      state.isAddSubscription = false;
      state.subscriptionLoading = false;
    },
    [addSubscription.fulfilled]: state => {
      state.isAddSubscription = true;
      state.subscriptionLoading = false;
    },
    [editSubscription.pending]: state => {
      state.isUpdateSubscription = false;
      state.subscriptionLoading = true;
    },
    [editSubscription.rejected]: state => {
      state.isUpdateSubscription = false;
      state.subscriptionLoading = false;
    },
    [editSubscription.fulfilled]: state => {
      state.isUpdateSubscription = true;
      state.subscriptionLoading = false;
    },
    [deleteSubscription.pending]: state => {
      state.isDeleteSubscription = false;
      state.subscriptionLoading = true;
    },
    [deleteSubscription.rejected]: state => {
      state.isDeleteSubscription = false;
      state.subscriptionLoading = false;
    },
    [deleteSubscription.fulfilled]: state => {
      state.isDeleteSubscription = true;
      state.subscriptionLoading = false;
    },
    [getSubscription.pending]: state => {
      state.subscriptionData = {};
      state.subscriptionLoading = true;
    },
    [getSubscription.rejected]: state => {
      state.subscriptionData = {};
      state.subscriptionLoading = false;
    },
    [getSubscription.fulfilled]: (state, action) => {
      state.subscriptionData = action.payload?.data;
      state.subscriptionLoading = false;
    },
  },
});

export const {
  setSubscriptionCurrentPage,
  setSubscriptionPageLimit,
  setSubscriptionSearchParam,
  setIsAddSubscription,
  setIsUpdateSubscription,
  setIsDeleteSubscription,
  setSubscriptionList,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
