import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import Loader from '../Common/Loader';
import LoginImg from '../../Assets/Images/login-img.png';
import { forgetPasswordSchema } from 'Schema/Auth/authSchema';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { forgotPassword } from 'Store/Reducers/Auth/forgotPasswordSlice';
import { saveCompanyForForgot } from 'Helper/AuthTokenHelper';
import { isEmailComplete } from 'Helper/CommonHelper';
import { findUserCompanyList } from 'Store/Reducers/Common/CommonSlice';

const forgetPasswordData = {
  email: '',
  company_id: '',
};
export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear;

  const { forgotPassloading } = useSelector(
    ({ forgotPassword }) => forgotPassword,
  );
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
          user_email: values?.email,
          company_id: company_id,
        };
        saveCompanyForForgot({
          user_email: values?.email,
          company_id: company_id,
        });
        let res = await dispatch(forgotPassword(newObj));
        if (res?.payload?.data) {
          navigate('/email-varification');
        }
      }
    },
    [dispatch, userCompanyList, navigate],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: forgetPasswordData,
      validationSchema: forgetPasswordSchema,
      onSubmit: submitHandle,
    });

  useEffect(() => {
    const isComplete = isEmailComplete(values?.email);
    if (values?.email !== '' && isComplete) {
      dispatch(
        findUserCompanyList({
          username: values?.email,
        }),
      );
    }
  }, [values?.email, dispatch]);
  return (
    <div className="login_wrapper">
      {forgotPassloading || (commonLoading && <Loader />)}
      <div className="login_box">
        <div className="login_form">
          <div className="login-inner d-flex flex-column h-100">
            <div className="login_form_inner mb-3">
              <h1 className="text-center d-block">Forgot Password</h1>

              <div className="form_group mb-5">
                <label className="mb-3 fw_500" htmlFor="email">
                  Email Address
                </label>
                <InputText
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  className="input_wrap"
                  name="email"
                  value={values?.email || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.email && errors?.email && (
                  <p className="text-danger">{errors?.email}</p>
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
                    placeholder="Project Status"
                    className="w-100"
                  />
                </div>
              )}
              <div className="submit_btn">
                <Button
                  className="btn_primary w-100 mb-3"
                  // onClick={() => navigate('/email-varification')}
                  onClick={handleSubmit}
                >
                  Reset Password
                </Button>
                <Button
                  className="btn_border w-100"
                  onClick={() => navigate('/')}
                >
                  Back
                </Button>
              </div>
            </div>
            <div className="copyright text-center mt-3">
              <p className="m-0">
                @Copyright {currentYear && currentYear} smilefilms
              </p>
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
