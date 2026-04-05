import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthToken } from 'Helper/AuthTokenHelper';
import { toast } from 'react-toastify';

let initialState = {
  notificationList: {},
  notificationListLoading: false,
  notificationCurrentPage: 1,
  notificationPageLimit: 0,
  allowNotificationToggle: false,
  notificationPermissionDialogVisible: false,
};

export const getNotificationList = createAsyncThunk(
  'notification/list-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/list-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            // toast.success(data?.msg)
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

export const clearNotification = createAsyncThunk(
  'notification/clear-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/clear-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            toast.success(data?.msg);
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

export const readNotification = createAsyncThunk(
  'notification/read-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/read-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            toast.success(data?.msg);
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

export const readSingleNotification = createAsyncThunk(
  'notification/read-single-notification',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/read-single-notification', payload)
        .then(({ data }) => {
          if (data?.err === 0) {
            toast.success(data?.msg);
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

export const notificationSubscribe = createAsyncThunk(
  'notification/subscribe',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const userPreferences = getAuthToken();

    try {
      // 🔔 Ask for permission
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          const { notification } = getState();
          const currentToggle = notification.allowNotificationToggle;

          dispatch(setNotificationPermissionDialogVisible(true));
          dispatch(setAllowNotificationToggle(!currentToggle));
          toast.error('Notification permission denied');
          return rejectWithValue('Notification permission denied');
        }
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          'BCeg1rAUATzfsJNPuo_et94TLD8BSx-IW16fMvyZ-QeZdnaCAsZGb_3KFZzwQdTks42xnFUoxO5rFhuxFUFw1LE',
      });

      const { data } = await axios.post(
        '/notification/subscribe',
        subscription,
      );

      if (data?.err === 0) {
        toast.success(data?.msg);

        localStorage.setItem(
          'UserPreferences',
          window.btoa(
            JSON.stringify({
              ...userPreferences,
              employee: {
                ...userPreferences?.employee,
                notification_enabled: true,
              },
            }),
          ),
        );

        return data?.data;
      } else {
        toast.error(data?.msg);
        return rejectWithValue(data?.msg);
      }
    } catch (error) {
      toast.error(error?.message || 'Subscription failed');
      return rejectWithValue(error?.message || 'Subscription failed');
    }
  },
);

export const notificationUnSubscribe = createAsyncThunk(
  'notification/unsubscribe',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const userPreferences = getAuthToken();

    try {
      // 🔔 Ask for permission if not already granted
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          const { notification } = getState();
          const currentToggle = notification.allowNotificationToggle;

          dispatch(setNotificationPermissionDialogVisible(true));
          dispatch(setAllowNotificationToggle(!currentToggle));
          toast.error('Notification permission denied');
          return rejectWithValue('Notification permission denied');
        }
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          'BCeg1rAUATzfsJNPuo_et94TLD8BSx-IW16fMvyZ-QeZdnaCAsZGb_3KFZzwQdTks42xnFUoxO5rFhuxFUFw1LE',
      });

      const { data } = await axios.post(
        '/notification/unsubscribe',
        subscription,
      );

      if (data?.err === 0) {
        toast.success(data?.msg);

        localStorage.setItem(
          'UserPreferences',
          window.btoa(
            JSON.stringify({
              ...userPreferences,
              employee: {
                ...userPreferences?.employee,
                notification_enabled: false,
              },
            }),
          ),
        );

        return data?.data;
      } else {
        toast.error(data?.msg);
        return rejectWithValue(data?.msg);
      }
    } catch (error) {
      toast.error(error?.message || 'Unsubscription failed');
      return rejectWithValue(error?.message || 'Unsubscription failed');
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationList: (state, action) => {
      state.notificationList = action.payload;
    },
    setAllowNotificationToggle: (state, action) => {
      state.allowNotificationToggle = action.payload;
    },
    setNotificationPermissionDialogVisible: (state, action) => {
      state.notificationPermissionDialogVisible = action.payload;
    },
  },
  extraReducers: {
    [getNotificationList.pending]: state => {
      state.notificationListLoading = true;
    },
    [getNotificationList.rejected]: state => {
      state.notificationList = {};
      state.notificationListLoading = false;
    },
    [getNotificationList.fulfilled]: (state, action) => {
      state.notificationList = action.payload?.data;
      state.notificationListLoading = false;
    },
    [clearNotification.pending]: state => {
      state.notificationListLoading = true;
    },
    [clearNotification.rejected]: state => {
      state.notificationListLoading = false;
    },
    [clearNotification.fulfilled]: (state, action) => {
      state.notificationList = action.payload?.data;
      state.notificationListLoading = false;
    },
    [readNotification.pending]: state => {
      state.notificationListLoading = true;
    },
    [readNotification.rejected]: state => {
      state.notificationListLoading = false;
    },
    [readNotification.fulfilled]: (state, action) => {
      state.notificationListLoading = false;
    },
    [readSingleNotification.pending]: state => {
      state.notificationListLoading = true;
    },
    [readSingleNotification.rejected]: state => {
      state.notificationListLoading = false;
    },
    [readSingleNotification.fulfilled]: (state, action) => {
      state.notificationListLoading = false;
    },
  },
});

export const {
  setNotificationList,
  setAllowNotificationToggle,
  setNotificationPermissionDialogVisible,
} = notificationSlice.actions;

export default notificationSlice.reducer;
