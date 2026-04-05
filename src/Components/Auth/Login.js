import React, { useCallback, useEffect } from 'react';
import LoginLogo from '../../Assets/Images/login-logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import HeadinImg from '../../Assets/Images/heading-gif.gif';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, setUserPermissions } from 'Store/Reducers/Auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import _ from 'lodash';
import {
  findUserCompanyList,
  setUserCompanyList,
} from 'Store/Reducers/Common/CommonSlice';
import {
  checkPermissionForLandingPage,
  emailRegex,
  isEmailComplete,
  isMobileComplete,
  mobileRegex,
} from 'Helper/CommonHelper';
import { toast } from 'react-toastify';
import NotificationEnablePopup from 'Components/Common/NotificationEnablePopup';
import { setAllowNotificationToggle } from 'Store/Reducers/Notification/NotificationSlice';

const loginData = {
  emailOrMobile: '',
  password: '',
  company: '',
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginLoading } = useSelector(({ auth }) => auth);
  const { commonLoading, userCompanyList } = useSelector(
    ({ common }) => common,
  );

  const loginModuleSchema = Yup.object().shape({
    emailOrMobile: Yup.string()
      .required('Email or mobile number is required')
      .test('is-valid', 'Invalid email or mobile number', function (value) {
        const { path, createError } = this;

        if (!value) {
          return false;
        }
        const isValidEmail = emailRegex.test(value);
        const isValidMobile = mobileRegex.test(value);
        if (!isValidEmail && !isValidMobile) {
          return createError({
            path,
            message: 'Invalid email or mobile number',
          });
        }
        return true;
      }),
    password: Yup.string().required('Password is required'),
    company: Yup.string().test(
      'is-required',
      'Company is required',
      function (value) {
        const { path, createError } = this;
        if (userCompanyList.length > 0 && !value) {
          return createError({ path, message: 'Company is required' });
        }
        return true;
      },
    ),
  });

  const submitHandle = useCallback(
    async values => {
      const company_id =
        userCompanyList?.length === 1
          ? userCompanyList[0]?.value
          : values?.company;

      const newObj = {
        username: values?.emailOrMobile,
        password: values?.password,
        company_id: company_id,
      };

      let res = await dispatch(login(newObj));

      const responseData = res?.payload?.data;

      if (responseData) {
        if (
          !responseData?.isSubscriptionActive
          // || responseData?.role
          //  || responseData?.role === 3 ||
          // responseData?.role === 4
        ) {
          navigate('/subscription-plans');
        } else {
          // const sortByCustomOrder = (arr, order) => {
          //   const orderMap = _.zipObject(order, _.range(order.length));
          //   return _.sortBy(arr, item => orderMap[item.name]);
          // };

          // const sortedPermissions = sortByCustomOrder(
          //   responseData?.permission,
          //   responseData?.role === 1 || responseData?.role === 2
          //     ? customAdminOrder
          //     : responseData?.role === 3
          //     ? customUserOrder
          //     : customClientOrder,
          // );

          // const findFirstPermissionData = sortedPermissions?.find(x => {
          //   const findObj = x?.permission?.find(y => y?.view === true);
          //   return findObj;
          // });

          // const findViewPermissionObj =
          //   findFirstPermissionData?.permission?.find(y => y?.view === true);

          // dispatch(setUserPermissions(sortedPermissions));

          // // window.location.href = '/home';
          // responseData?.role === 1 || responseData?.role === 2
          //   ? findViewPermissionObj?.path
          //     ? navigate(findViewPermissionObj?.path)
          //     : navigate('/home')
          //   : responseData?.role === 3
          //   ? navigate('/user-dashboard')
          //   : findViewPermissionObj?.path
          //   ? navigate(findViewPermissionObj?.path)
          //   : navigate('/client-dashboard');

          dispatch(
            setAllowNotificationToggle(
              responseData?.employee?.notification_enabled,
            ),
          );

          const checkedPermissionData =
            checkPermissionForLandingPage(responseData);

          dispatch(
            setUserPermissions(checkedPermissionData?.updated_permission),
          );
          navigate(checkedPermissionData?.path);

          if (!responseData?.employee?.notification_enabled) {
            toast(<NotificationEnablePopup />, {
              data: {
                title: 'Enable Notifications',
                content:
                  'Allow notifications to stay updated with important alerts.',
              },
              ariaLabel: 'Enable notifications prompt',
              className: 'w-100',
              autoClose: false,
              closeButton: false,
              closeOnClick: false,
              draggable: false,
            });
          }
        }
      }
    },
    [userCompanyList, dispatch, navigate],
  );

  const {
    errors,
    values,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: loginData,
    validationSchema: loginModuleSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => {
      dispatch(setUserCompanyList([]));
    };
  }, [dispatch]);

  const handleSearchInput = e => {
    const userNameValue = e.target.value;

    if (!isEmailComplete(userNameValue) && !isMobileComplete(userNameValue)) {
      return;
    }

    dispatch(findUserCompanyList({ username: userNameValue }))
      .then(response => {
        const companyData = response?.payload?.data;

        if (companyData?.length > 0 && companyData?.length === 1) {
          setFieldValue('company', companyData[0]?._id);
        } else {
          setFieldValue('company', '');
        }
      })
      .catch(error => {
        console.error('Error fetching package data:', error);
      });
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  // const footerContent = (
  //   <div className="footer_wrap d-flex justify-content-between align-items-center">
  //     <div className="footer_button">
  //       <Button className="btn_border_dark" onClick={onCancel}>
  //         Cancel
  //       </Button>
  //       <Button className="btn_primary" onClick={handleSubmit2} type="submit">
  //         Allow
  //       </Button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="login_wrapper">
      {(commonLoading || loginLoading) && <Loader />}
      <div className="login_box">
        <div className="login_form">
          <div className="login-inner d-flex flex-column h-100">
            <div className="login_form_inner mb-3">
              <div className="login_logo">
                <img src={LoginLogo} alt="" />
              </div>
              <h1>
                <img src={HeadinImg} alt="" /> Hi, Welcome Back!
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="form_group">
                  <label className="fw_400" htmlFor="emailOrMobile">
                    Email or Phone
                  </label>
                  <InputText
                    id="emailOrMobile"
                    autoFocus
                    autoComplete="off"
                    role="presentation"
                    placeholder="Email or Phone"
                    // type="email"
                    className="input_wrap"
                    name="emailOrMobile"
                    value={values?.emailOrMobile || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      debounceHandleSearchInput(e);
                      setFieldValue('emailOrMobile', e.target.value);
                    }}
                    validateOnly="true"
                    required
                  />
                  {touched?.emailOrMobile && errors?.emailOrMobile && (
                    <p className="text-danger">{errors?.emailOrMobile}</p>
                  )}
                </div>
                <div className="form_group mb-3">
                  <label className="fw_400" htmlFor="Pass">
                    Password
                  </label>
                  <Password
                    id="password"
                    placeholder="Password"
                    className="w-100  p-0"
                    name="password"
                    feedback={false}
                    value={values?.password || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    toggleMask
                  />
                  {touched?.password && errors?.password && (
                    <p className="text-danger">{errors?.password}</p>
                  )}
                </div>
                {userCompanyList?.length > 1 && (
                  <div className="form_group mb-3">
                    <label className="fw_400" htmlFor="Pass">
                      Select Company
                    </label>
                    <ReactSelectSingle
                      value={values?.company}
                      options={userCompanyList}
                      name="company"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Select Company"
                      className="w-100"
                    />
                    {touched?.company && errors?.company && (
                      <p className="text-danger">{errors?.company}</p>
                    )}
                  </div>
                )}
                <div className="align-items-center mb-sm-5 mb-3">
                  <div className="forgot_wrap text-end">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                </div>
                <div className="submit_btn">
                  <Button
                    type="submit"
                    // onClick={handleSubmit}
                    className="btn_primary w-100"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="login_img">
          <img src={LoginImg} alt="" />
        </div>
      </div>

      {/* <Dialog
        header={'Hii'}
        visible={true} //add state
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <h1>hello</h1>
      </Dialog> */}
    </div>
  );
}
