import React, { useCallback, useEffect } from 'react';
import Logo from '../../Assets/Images/logo.svg';
import LoginImg from '../../Assets/Images/login-img.png';
import HeadinImg from '../../Assets/Images/heading-gif.gif';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import { loginSchema } from 'Schema/Auth/authSchema';
import { login, setUserPermissions } from 'Store/Reducers/Auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import _ from 'lodash';
import {
  findUserCompanyList,
  setUserCompanyList,
} from 'Store/Reducers/Common/CommonSlice';
import { isEmailComplete } from 'Helper/CommonHelper';

const loginData = {
  email: '',
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

  const submitHandle = useCallback(
    async values => {
      if (userCompanyList?.length > 0) {
        let company_id =
          userCompanyList?.length === 1
            ? userCompanyList[0]?.value
            : values?.company;
        let newObj = {
          username: values?.email,
          password: values?.password,
          company_id: company_id,
        };
        let res = await dispatch(login(newObj));
        const responseData = res?.payload?.data;

        if (responseData) {
          dispatch(setUserPermissions(responseData?.permission));
          // window.location.href = '/home';
          responseData?.role === 1 || responseData?.role === 2
            ? navigate('/home')
            : responseData?.role === 3
            ? navigate('/user-dashboard')
            : navigate('/client-dashboard');
        }
      }
    },
    [userCompanyList, dispatch, navigate],
  );

  const {
    setFieldValue,
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: loginData,
    validationSchema: loginSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    return () => {
      dispatch(setUserCompanyList([]));
    };
  }, [dispatch]);

  const handleSearchInput = e => {
    const email = e.target.value;
    if (isEmailComplete(email)) {
      dispatch(findUserCompanyList({ username: email }))
        .then(response => {
          const companyData = response?.payload?.data;

          if (companyData?.length > 0 && companyData?.length === 1) {
            setFieldValue('company', companyData[0]?._id);
          }
        })
        .catch(error => {
          console.error('Error fetching package data:', error);
        });
    }
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="login_wrapper">
      {(commonLoading || loginLoading) && <Loader />}
      <div className="login_box">
        <div className="login_form">
          <div className="login-inner d-flex flex-column h-100">
            <div className="login_form_inner mb-3">
              <div className="login_logo">
                <img src={Logo} alt="" />
              </div>
              <h1>
                <img src={HeadinImg} alt="" /> Hi, Welcome Back!
              </h1>
              <div className="form_group">
                <label className="fw_400" htmlFor="email">
                  Email or Phone
                </label>
                <InputText
                  id="email"
                  autoFocus
                  autoComplete="off"
                  role="presentation"
                  placeholder="Email or Phone"
                  type="email"
                  className="input_wrap"
                  name="email"
                  value={values?.email || ''}
                  onBlur={handleBlur}
                  onChange={e => {
                    debounceHandleSearchInput(e);
                    setFieldValue('email', e.target.value);
                  }}
                  validateOnly="true"
                  required
                />
                {touched?.email && errors?.email && (
                  <p className="text-danger">{errors?.email}</p>
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
                  className="btn_primary w-100"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="login_img">
          <img src={LoginImg} alt="" />
        </div>
      </div>
    </div>
  );
}
