import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveToken } from 'Helper/AuthTokenHelper';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCurrentUser } from './ProfileSlice';
import { setActiveTabs } from '../Common/CommonSlice';

let initialState = {
  list: [],
  loginLoading: false,
  isLogin: false,
  userPermissions: [],
  currentActiveUser: {},
};

export const login = createAsyncThunk('login', (data, { dispatch }) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/user/login', data)
      .then(response => {
        const { data, err, msg } = response?.data;

        if (data?.role === 2) {
          data['switch_user'] = 'Admin';
        } else if (data?.role === 3 && data?.is_admin) {
          data['switch_user'] = 'Employee';
        }

        if (err === 0) {
          resolve({ data: data });
          toast.success(msg);
          dispatch(
            setActiveTabs({
              tabs: [],
              currentTab: {},
            }),
          );
          saveToken(data);
          dispatch(permissions());
          dispatch(setCurrentActiveUser(data));
          dispatch(setCurrentUser(data?.employee));
        } else {
          toast.error(msg);
          reject(data);
        }
      })
      .catch(errors => {
        toast.error(errors.response?.data?.msg);
        reject(errors);
      });
  });
});

export const permissions = createAsyncThunk(
  'permissions',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/user/get-permissions')

        .then(({ data }) => {
          if (data?.err === 0) {
            resolve(data?.data);
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
    },
    setCurrentActiveUser: (state, action) => {
      state.currentActiveUser = action.payload;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loginLoading = true;
      state.isLogin = false;
    },
    [login.rejected]: (state, action) => {
      state.isLogin = false;
      state.loginLoading = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLogout = false;
      state.isLogin = true;
      state.loginLoading = false;
    },
    [permissions.pending]: (state, action) => {
      state.userPermissions = [];
      state.loginLoading = true;
    },
    [permissions.rejected]: (state, action) => {
      state.userPermissions = [];
      state.loginLoading = false;
    },
    [permissions.fulfilled]: (state, action) => {
      state.userPermissions = action.payload;
      state.loginLoading = false;
    },
  },
});

export const {
  setLoading,
  setIsLogin,
  setUserPermissions,
  setCurrentActiveUser,
} = authSlice.actions;

export default authSlice.reducer;
