import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import Loader from '../Common/Loader';
import { setLoading } from 'Store/Reducers/Auth/authSlice';

import LoginImg from '../../Assets/Images/login-img.png';
import { verifyOTP } from 'Store/Reducers/Auth/VerifyEmailSlice';
import { forgotPassword } from 'Store/Reducers/Auth/forgotPasswordSlice';
import { getCompanyForForgot } from 'Helper/AuthTokenHelper';

export default function EmailVarification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { otpLoading } = useSelector(({ verifyEmail }) => verifyEmail);
  const dataForOTP = getCompanyForForgot();

  const submitHandle = useCallback(
    async values => {
      let otpValue = values?.join('');
      if (Object.keys(dataForOTP)?.length > 0) {
        let newObj = {
          user_email: dataForOTP?.user_email,
          company_id: dataForOTP?.company_id,
          otp: otpValue,
        };
        let res = await dispatch(verifyOTP(newObj));
        if (res?.payload?.data?.err === 0) {
          navigate('/creat-new-password');
        }
      }
    },
    [dispatch],
  );

  const inputRefs = [];
  const initialValues = [...Array(4)].map(() => '');

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: submitHandle,
  });
  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && values[index] === '') {
      const previousIndex = index - 1;
      if (inputRefs[previousIndex]) {
        inputRefs[previousIndex].focus();
      }
    }
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    handleChange({ target: { value, name: index.toString() } });

    const nextIndex = index + 1;
    if (nextIndex < 4 && value !== '') {
      inputRefs[nextIndex].focus();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  }, [dispatch]);

  return (
    <div className="login_wrapper">
      {otpLoading && <Loader />}
      <div className="login_box">
        <div className="login_form">
          <div className="login-inner d-flex flex-column h-100">
            <div className="login_form_inner mb-3">
              <h1 className="text-center d-block">Email Varification</h1>
              <p className="text-center">
                We sent a code to {dataForOTP?.user_email}
              </p>
              <div className="form_group mb-5 text-center">
                <label className="mb-3 fw_500" htmlFor="email">
                  Write Code
                </label>
                <div className="otp_wrapper">
                  {[...Array(4)].map((_, index) => (
                    <InputText
                      key={index}
                      type="text"
                      maxLength={1}
                      value={values[index]}
                      onChange={event => handleInputChange(event, index)}
                      onKeyDown={event => handleKeyDown(event, index)}
                      ref={ref => (inputRefs[index] = ref)}
                      //   className="input_wrap"
                    />
                  ))}
                </div>
              </div>
              <div className="submit_btn">
                <Button
                  className="btn_primary w-100 mb-3"
                  // onClick={() => navigate('/creat-new-password')}
                  onClick={handleSubmit}
                >
                  Continue
                </Button>
              </div>
              <div className="resend_text text-center mt-3">
                <p className="m-0">
                  Don't receive the email?{' '}
                  <Button
                    className="fw_600 btn_transparent text_dark"
                    onClick={() => {
                      if (dataForOTP) {
                        dispatch(forgotPassword({ user_email: dataForOTP }));
                      }
                    }}
                  >
                    Click to Resend
                  </Button>
                </p>
              </div>
            </div>
            <div className="copyright text-center mt-3">
              <p className="m-0">@Copyright 2023 smilefilms</p>
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
