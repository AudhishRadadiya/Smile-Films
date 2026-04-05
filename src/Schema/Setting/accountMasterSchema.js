import { emailRegex } from 'Helper/CommonHelper';
import * as Yup from 'yup';

export const accountSchema = Yup.object().shape({
  account_name: Yup.string()
    .min(1, 'Account Name must be at least 1 characters')
    .max(100, 'Account Name cannot exceed 100 characters')
    .required('Account Name is required'),
  group_name: Yup.string().required('Group Name is required'),
  balance_method: Yup.string().required('Balance Method is required'),
  opening_balance: Yup.number()
    .max(10000000, 'Opening balance should be maximum 10000000')
    .notRequired(),
  type: Yup.number().oneOf([1, 2, null], 'Invalid option').nullable(),
  country: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  //area: Yup.string().required('Area is required'),
  //pincode: Yup.number().required('Pincode is required'),
  email_id: Yup.string()
    .matches(emailRegex, 'Invalid email address')
    .notRequired(),
  mobile_no: Yup.string().matches(
    /^\d{10}$/,
    'Mobile Number must be a 10-digit number',
  ),
  //email_id: Yup.string().email('Invalid email').required('Email is required'),
  //mobile_no: Yup.string().matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number').required('Mobile Number is required'),
});

export const groupSchema = Yup.object().shape({
  // group_under: Yup.string().required('Group Under is required'),
  group_name: Yup.string()
    .min(1, 'Group Name must be at least 1 characters')
    .max(100, 'Group Name cannot exceed 100 characters')
    .required('Group Name is required'),
  group_header: Yup.string().required('Group Header is required'),
});
