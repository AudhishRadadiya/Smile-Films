import * as Yup from 'yup';

export const receiptPaymentSchema = Yup.object().shape({
  type: Yup.string().required('Please select a Type'),
  account_id: Yup.string().required('Please select a Account'),
  payment_type: Yup.string().required('Please select a Payment Type'),
  // payment_receive_in: Yup.string().when('payment_type', value => {
  //   return value.includes('2') || value.includes('3')
  //     ? Yup.string().required('Please select a Payment Group')
  //     : Yup.string().notRequired();
  // }),
  payment_receive_in: Yup.string().required('Please select a Payment Group'),
  amount: Yup.string().required('Amount is required'),
});
