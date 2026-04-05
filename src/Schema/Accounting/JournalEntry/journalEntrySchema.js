import * as Yup from 'yup';

export const validationSchemaJournalEntry = Yup.object().shape({
  payment_type: Yup.string().required('Payment Type is required'),
  payment_group: Yup.string().when('payment_type', value => {
    return ['2', '3'].includes(...value)
      ? Yup.string().required('Please select a Payment Group')
      : Yup.string().notRequired();
  }),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark cannot exceed 1000 characters'),
  create_date: Yup.date().required('Create Date is required'),

  // journalEntryData: Yup.array().of(
  //   Yup.object().shape({
  //     client_name: Yup.string().required('Client Name is required'),

  //     //   debit: Yup.number().when('crdb', {
  //     //     is: 'CR',
  //     //     then: Yup.number().required('Debit is required'),
  //     //     otherwise: Yup.number().notRequired(),
  //     //   }),

  //     //   credit: Yup.number().when('crdb', {
  //     //     is: 'DB',
  //     //     then: Yup.number().required('Credit is required'),
  //     //     otherwise: Yup.number().notRequired(),
  //     //   }),
  //   }),
  // ),
});
