import * as Yup from 'yup';

export const editingDataCollectionSchema = Yup.object().shape({
  editing_inquiry: Yup.array()
    .min(1, 'Editing Items is Required')
    .required('Editing Items is Required'),
});

export const commentSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

export const editingQuotationSchema = Yup.object().shape({
  quotation_name: Yup.string().required('Quotation Name is required'),
  sub_total: Yup.number().required('sub Total is required'),
  total_amount: Yup.number().required('Total amount is required'),
  editing_inquiry: Yup.array()
    .min(1, 'Editing Items is Required')
    .required('Editing Items is Required'),
});
