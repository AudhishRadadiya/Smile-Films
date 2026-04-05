import { GSTRegex, emailRegex, panNoRegex } from 'Helper/CommonHelper';
import * as Yup from 'yup';

export const companySchema = Yup.object().shape({
  company_id: Yup.string().notRequired(),
  company_name: Yup.string()
    .min(1, 'Company Name must be at least 1 characters')
    .max(100, 'Company Name cannot exceed 100 characters')
    .required('Company Name is required'),
  company_logo: Yup.string().required('Company Logo is required'),
  legal_name: Yup.string()
    .min(1, 'Legal Name must be at least 1 characters')
    .max(100, 'Legal Name cannot exceed 100 characters')
    .required('Legal Name is required'),
  employee_code: Yup.string()
    .min(2, 'Employee Code must be at least 2 characters')
    .max(10, 'Employee Code cannot exceed 10 characters')
    .required('Employee Code is required'),
  business_type: Yup.string().required('Business Type is required'),
  director_name: Yup.string()
    .min(1, 'Director Name must be at least 1 characters')
    .max(100, 'Director Name cannot exceed 100 characters')
    .required('Director Name is required'),
  email_id: Yup.string()
    .matches(emailRegex, 'Invalid email address')
    .required('Email is required'),
  mobile_no: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
    .required('Mobile Number is required'),
  pan_no: Yup.string()
    .matches(panNoRegex, 'Invalid PAN Number')
    .required('PAN Number is required'),
  gst_no: Yup.string()
    .matches(GSTRegex, 'Invalid GST Number')
    .required('GST Number is required'),
  admin_password: Yup.string().when('company_id', value => {
    const checkValidation = value.some(id => !id);
    return checkValidation
      ? Yup.string().required('Admin Password is required')
      : Yup.string().notRequired();
  }),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .required('Address is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pin_code: Yup.string().required('Pin Code is required'),
});
