import * as Yup from 'yup';

export const exposingOrderFormSchema = Yup.object().shape({
  selected_exposing_order_item: Yup.array()
    .min(1, 'Exposing Items is Required')
    .required('Exposing Items is Required'),
  delivery_date: Yup.string().required('Delivery Date is required'),
  venue: Yup.string().required('Venue is required'),
});

export const exposingQuotationSchema = Yup.object().shape({
  selected_exposing_order_item: Yup.array()
    .min(1, 'Exposing Items is Required')
    .required('Exposing Items is Required'),
  quotation_name: Yup.string().required('Quotation name is required'),
});
