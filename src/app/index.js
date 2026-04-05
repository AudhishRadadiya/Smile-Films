import React, { Suspense, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
// import Routes from 'routes/index';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { REACT_APP_APIURL } from 'Helper/Environment';
import {
  clearToken,
  getAuthToken,
  setAuthToken,
  socketDataSend,
} from 'Helper/AuthTokenHelper';
import { useDispatch, useSelector } from 'react-redux';
import {
  permissions,
  setCurrentActiveUser,
  setIsLogin,
} from 'Store/Reducers/Auth/authSlice';
import route from 'Configs/RoutesConfig';
import PrivateRoute from 'Configs/PrivateRoute';
import PublicRoute from 'Configs/PublicRoute';
import Loader from 'Components/Common/Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { createPopper } from '@popperjs/core';
import 'react-quill/dist/quill.snow.css';
import '../Assets/scss/Style.scss';
import AuthLayout from 'Components/Common/AuthLayout';
import UserDashboard from 'Components/UserDashboard/Dashboard/UserDashboard';
import { socket } from 'socket';
import {
  setChatMessageCount,
  setUserID,
} from 'Store/Reducers/Editing/EditingFlow/ChatSlice';
import {
  getNotificationList,
  setAllowNotificationToggle,
} from 'Store/Reducers/Notification/NotificationSlice';
import { toast } from 'react-toastify';
import NotificationEnablePopup from 'Components/Common/NotificationEnablePopup';

const AccessDenied = React.lazy(() => import('Components/Common/AccessDenied'));
const NotFound = React.lazy(() => import('Components/Common/NotFound'));

axios.defaults.baseURL = REACT_APP_APIURL;

export function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const notificationPermission = Cookies.get('notificationPermissionNotAllow');
  const popcorn = document.querySelector('#popcorn');
  const tooltip = document.querySelector('#tooltip');
  createPopper(popcorn, tooltip, {
    placement: 'top',
  });

  const { notificationCurrentPage } = useSelector(
    ({ notification }) => notification,
  );

  let UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) {
    UserPreferences = JSON.parse(window?.atob(UserPreferences));
    dispatch(setIsLogin(true));
    setAuthToken(UserPreferences?.token);
  }

  useEffect(() => {
    let UserPreferences = getAuthToken();

    if (
      UserPreferences &&
      !UserPreferences?.employee?.notification_enabled &&
      !Boolean(notificationPermission)
    ) {
      toast(<NotificationEnablePopup />, {
        data: {
          title: 'Enable Notifications',
          content: 'Allow notifications to stay updated with important alerts.',
        },
        ariaLabel: 'Enable notifications prompt',
        className: 'w-100',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      });
    }

    dispatch(
      setAllowNotificationToggle(
        UserPreferences?.employee?.notification_enabled,
      ),
    );

    if (UserPreferences) {
      dispatch(permissions());
      dispatch(setCurrentActiveUser(UserPreferences));
      dispatch(setUserID(UserPreferences?.employee?._id)); // userId use for chat
    }
  }, [dispatch]);

  const check_condition =
    UserPreferences?.role === 3 &&
    UserPreferences?.type?.toLowerCase() === 'employee';

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const { status } = error?.response?.data || {};

      if (status === 401 || status === 500) {
        clearToken();
        window.location.href = '/';
      } else if (status === 406 || status === 404) {
        clearToken();
        window.location.href = '/';
      }
      return Promise.reject(error);
    },
  );

  const updateSocketData = useCallback(
    res => {
      const { data, en } = res;
      if (en === 'MESSAGE_COUNT') {
        dispatch(setChatMessageCount(data?.count));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(setUserID(UserPreferences?.employee?._id)); // userId use for chat

    socket.on('connect', () => {
      console.log('socket is connected');
    });

    if (UserPreferences?.employee?._id) {
      socketDataSend(UserPreferences?.employee?._id);
    }

    return () => {
      socket.off('connect', () => {
        socketDataSend(UserPreferences?.employee?._id);
      });
    };
  }, [dispatch, UserPreferences]);

  useEffect(() => {
    socket.on('notification received', res => {
      dispatch(
        getNotificationList({
          start: notificationCurrentPage,
          limit: 5,
        }),
      );
    });

    socket.on('res', res => {
      updateSocketData(res);
    });
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Helmet
          titleTemplate="%s - Twist Media"
          defaultTitle="Twist Media"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="Twist Media application" />
        </Helmet>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* {route.map(
              ({ isPrivate, component: Component, path, role }, index) => (
                <Route
                  exact
                  key={index}
                  path={path}
                  element={
                    isPrivate ? (
                      <PrivateRoute>
                        <AuthLayout />
                        <Component role={role} />
                      </PrivateRoute>
                    ) : (
                      <PublicRoute>
                        <Component />
                      </PublicRoute>
                    )
                  }
                />
              ),
            )} */}

            {route.map(
              ({ isPrivate, component: Component, path, role }, index) => {
                return isPrivate ? (
                  <Route element={<AuthLayout />} key={index}>
                    <Route
                      exact
                      path={path}
                      element={
                        <PrivateRoute>
                          {path === '/dashboard' ? (
                            check_condition ? (
                              <UserDashboard role={role} />
                            ) : (
                              <Component role={role} />
                            )
                          ) : (
                            <Component role={role} />
                          )}
                        </PrivateRoute>
                      }
                    />
                  </Route>
                ) : (
                  <Route
                    exact
                    key={index}
                    path={path}
                    element={
                      <PublicRoute>
                        <Component />
                      </PublicRoute>
                    }
                  />
                );
              },
            )}
            <Route path="/*" element={<NotFound />} />
            <Route path="/access-denied" element={<AccessDenied />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
