import * as Yup from 'yup';

export const validationGeneralBilling = Yup.object().shape({
  client_name: Yup.string().required('Client Name is required'),
  mobile_number: Yup.string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits'),
  account_id: Yup.string().required('Account is required'),
  due_date: Yup.string().required('Create date is required'),
  data_size: Yup.number().required('Data Size is required'),
  payment_method: Yup.string().required('Payment Method is required'),
  billing_inquiry: Yup.array()
    .min(1, 'Billing Items is Required')
    .required('Billing Items is Required'),
  conversation_rate: Yup.number()
    .required('Conversation Rate is required')
    .min(0, 'Conversation Rate must be greater than or equal to 0'),
  time: Yup.string().required('Time is required'),
});
