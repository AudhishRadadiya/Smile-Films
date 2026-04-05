import { emailRegex, mobileRegex } from 'Helper/CommonHelper';
import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  // email: Yup.string().email('Invalid email').required('Email is required'),
  // email: Yup.string()
  //   .matches(emailRegex, 'Invalid email address')
  //   .required('Email is required'),

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
        return createError({ path, message: 'Invalid email or mobile number' });
      }
      return true;
    }),
  password: Yup.string().required('Password is required'),
  company: Yup.string().required('Company is required'),
});

export const forgetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, 'Invalid email address')
    .required('Email is required'),
});

export const setPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const changePasswordSchema = Yup.object().shape({
  old_password: Yup.string().required('Old Password is required'),
  new_password: Yup.string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
