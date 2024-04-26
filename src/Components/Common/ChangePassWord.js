import { changePasswordSchema } from 'Schema/Auth/authSchema';
import { changepassword } from 'Store/Reducers/Auth/ProfileSlice';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const changePasswordData = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};
export default function ChangePassWord({
  changePasswordModal,
  setChangePasswordModal,
}) {
  const dispatch = useDispatch();

  const submitHandle = useCallback(
    async values => {
      dispatch(changepassword(values));
      setChangePasswordModal(false);
    },
    [dispatch],
  );
  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: changePasswordData,
      validationSchema: changePasswordSchema,
      onSubmit: submitHandle,
    });
  return (
    <Dialog
      header="Change Password"
      visible={changePasswordModal}
      draggable={false}
      className="modal_Wrapper modal_small modal_no_padding"
      onHide={() => setChangePasswordModal(false)}
    >
      <div className="stock_transfer_modal_wrapper">
        <div className="stock_transfer_top_wrap px-3">
          <div className="form_group mb-3">
            <label htmlFor="OldPassword">
              Old Password <span className="text-danger">*</span>
            </label>
            <Password
              placeholder="Old Password"
              name="old_password"
              className="w-100  p-0"
              value={values?.old_password || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              toggleMask
            />
            {touched?.old_password && errors?.old_password && (
              <p className="text-danger">{errors?.old_password}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="NewPassword">
              New Password <span className="text-danger">*</span>
            </label>
            <Password
              placeholder="New Password"
              name="new_password"
              className="w-100 p-0"
              value={values?.new_password || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              toggleMask
            />
            {touched?.new_password && errors?.new_password && (
              <p className="text-danger">{errors?.new_password}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="ConfirmPassword">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <Password
              placeholder="Confirm Password*"
              name="confirm_password"
              className="w-100 p-0"
              value={values?.confirm_password || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              toggleMask
            />
            {touched?.confirm_password && errors?.confirm_password && (
              <p className="text-danger">{errors?.confirm_password}</p>
            )}
          </div>
        </div>
      </div>
      <div className="button_group d-flex justify-content-end px-3">
        <Button
          className="btn_primary ms-3"
          onClick={handleSubmit}
          type="submit"
        >
          Change Password
        </Button>
      </div>
    </Dialog>
  );
}
