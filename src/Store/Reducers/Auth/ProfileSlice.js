import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveToken } from 'Helper/AuthTokenHelper';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  changePasswordLoading: false,
  isChangePassword: false,
  logoutLoading: false,
  isLogout: false,
  myProfileLoading: false,
  myProfileData: {},
  currentUser: {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    birth_date: '',
    gender: '',
    blood_group: '',
    marital_status: '',
    current_address: '',
    group_name: '',
    image: '',
  },
};

export const changepassword = createAsyncThunk(
  'profile/change-password',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('profile/change-password', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data });
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

export const logout = createAsyncThunk(
  'profile/logout',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('profile/logout', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data.data });
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

export const myProfile = createAsyncThunk(
  'profile/my-profile',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('profile/my-profile')
        .then(res => {
          const { data, err, msg } = res?.data;
          const updated = {
            ...data,
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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearCurrentUser: (state, action) => {
      state.currentUser = initialState.currentUser;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: {
    [changepassword.pending]: (state, action) => {
      state.changePasswordLoading = true;
      state.isChangePassword = false;
    },
    [changepassword.rejected]: (state, action) => {
      state.isChangePassword = false;
      state.changePasswordLoading = false;
    },
    [changepassword.fulfilled]: (state, action) => {
      state.isChangePassword = true;
      state.changePasswordLoading = false;
    },
    [logout.pending]: (state, action) => {
      state.logoutLoading = true;
      state.isLogout = false;
    },
    [logout.rejected]: (state, action) => {
      state.isLogout = false;
      state.logoutLoading = false;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLogout = true;
      state.logoutLoading = false;
    },
    [myProfile.pending]: (state, action) => {
      state.myProfileLoading = true;
      state.currentUser = {};
    },
    [myProfile.rejected]: (state, action) => {
      state.currentUser = {};
      state.myProfileLoading = false;
    },
    [myProfile.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
      state.myProfileLoading = false;
    },
  },
});
export const { clearCurrentUser, setCurrentUser } = profileSlice.actions;
export default profileSlice.reducer;
