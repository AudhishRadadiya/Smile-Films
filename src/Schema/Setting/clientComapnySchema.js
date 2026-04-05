import { emailRegex } from 'Helper/CommonHelper';
import * as Yup from 'yup';

export const clientCompanySchema = Yup.object().shape({
  company_name: Yup.string()
    .min(1, 'Company Name must be at least 1 characters')
    .max(100, 'Company Name cannot exceed 100 characters')
    .required('Company Name is required'),
  client_full_name: Yup.string()
    .min(1, 'Client Full Name must be at least 1 characters')
    .max(100, 'Client Full Name cannot exceed 100 characters')
    .required('Client Full Name is required'),
  email_id: Yup.string()
    .trim()
    .matches(emailRegex, 'Invalid email address')
    .required('Email is required'),
  // mobile_no: Yup.string()
  //   .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
  //   .required('Mobile Number is required'),
  mobile_no: Yup.array().of(
    Yup.object().shape({
      mobile_no: Yup.string().required('Phone Number is required'),
    }),
  ),
  group_name: Yup.string().required('Group Name is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pin_code: Yup.string().max(10, 'Pincode should be maximum 10').notRequired(),
  reference: Yup.string().required('Reference is required'),
  type: Yup.string().required('Type is required'),
  currency: Yup.string().required('Currency is required'),
  // address: Yup.string()
  //   .min(5, 'Address must be at least 5 characters')
  //   .max(200, 'Address cannot exceed 200 characters')
  //   .required('Address is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .notRequired(),
  opening_balance: Yup.number()
    .max(10000000, 'Opening Balance should be maximum 10000000')
    .notRequired(),
  credits_limits: Yup.number()
    .max(10000000, 'Credit Limit should be maximum 10000000')
    .notRequired(),
});

export const clientCompanyInInquirySchema = Yup.object().shape({
  company_name: Yup.string()
    .min(1, 'Company Name must be at least 1 characters')
    .max(100, 'Company Name cannot exceed 100 characters')
    .required('Company Name is required'),
  client_full_name: Yup.string()
    .min(1, 'Client Full Name must be at least 1 characters')
    .max(100, 'Client Full Name cannot exceed 100 characters')
    .required('Client Full Name is required'),
  email_id: Yup.string()
    .trim()
    .matches(emailRegex, 'Invalid email address')
    .required('Email is required'),
  mobile_no: Yup.array().of(
    Yup.object().shape({
      mobile_no: Yup.string().required('Phone Number is required'),
    }),
  ),
  group_name: Yup.string().required('Group Name is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pin_code: Yup.string().max(10, 'Pincode should be maximum 10').notRequired(),
  reference: Yup.string().required('Reference is required'),
  type: Yup.string().required('Type is required'),
  currency: Yup.string().required('Currency is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .notRequired(),
  opening_balance: Yup.number()
    .max(10000000, 'Opening Balance should be maximum 10000000')
    .notRequired(),
  credits_limits: Yup.number()
    .max(10000000, 'Credit Limit should be maximum 10000000')
    .notRequired(),
});
