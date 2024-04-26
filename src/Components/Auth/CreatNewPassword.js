import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import Loader from '../Common/Loader';
import { setLoading } from 'Store/Reducers/Auth/authSlice';

import LoginImg from '../../Assets/Images/login-img.png';
import { setPasswordSchema } from 'Schema/Auth/authSchema';
import { Password } from 'primereact/password';
import { getCompanyForForgot } from 'Helper/AuthTokenHelper';
import { resetPassword } from 'Store/Reducers/Auth/CreateResetPassSlice';

const setPasswordData = {
  newPassword: '',
  confirmPassword: '',
};
export default function CreatNewPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resetPassLoading } = useSelector(({ resetPass }) => resetPass);

  const dataForOTP = getCompanyForForgot();

  const submitHandle = useCallback(
    async values => {
      if (Object.keys(dataForOTP)?.length > 0) {
        let newObj = {
          user_email: dataForOTP?.user_email,
          company_id: dataForOTP?.company_id,
          password: values?.newPassword,
          confirm_password: values?.confirmPassword,
        };
        let res = await dispatch(resetPassword(newObj));
        if (res?.payload?.data?.err === 0) {
          navigate('/');
        }
      }
    },
    [dispatch],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: setPasswordData,
      validationSchema: setPasswordSchema,
      onSubmit: submitHandle,
    });

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  }, [dispatch]);
  return (
    <div className="login_wrapper">
      {resetPassLoading && <Loader />}
      <div className="login_box">
        <div className="login_form">
          <div className="login-inner d-flex flex-column h-100">
            <div className="login_form_inner mb-3">
              <h1 className="text-center d-block mb-3">Create New Password</h1>
              <p className="otp-text text-center">
                You need to just enter your new password
              </p>
              <div className="form_group">
                <label className="fw_400" htmlFor="NewPassword">
                  New Password
                </label>
                <Password
                  feedback={false}
                  id="newPassword"
                  placeholder="New Password"
                  className="w-100 input_wrap p-0"
                  name="newPassword"
                  value={values?.newPassword || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  toggleMask
                />
                {touched?.newPassword && errors?.newPassword && (
                  <p className="text-danger">{errors?.newPassword}</p>
                )}
              </div>
              <div className="form_group">
                <label className="fw_400" htmlFor="ConfirmPassword">
                  Confirm Password
                </label>
                <Password
                  feedback={false}
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-100 input_wrap p-0"
                  name="confirmPassword"
                  value={values?.confirmPassword || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  toggleMask
                />
                {touched?.confirmPassword && errors?.confirmPassword && (
                  <p className="text-danger">{errors?.confirmPassword}</p>
                )}
              </div>
              <div className="submit_btn mt90">
                <Button
                  className="btn_primary w-100 mb-3"
                  // onClick={() => navigate('/')}
                  onClick={handleSubmit}
                >
                  Verify Account
                </Button>
              </div>
            </div>
            {/* <div className="copyright text-center mt-3">
                <p className="m-0">@Copyright 2023 smilefilms</p>
              </div> */}
          </div>
        </div>
        <div className="login_img">
          <img src={LoginImg} alt="" />
        </div>
      </div>
    </div>
  );
}
