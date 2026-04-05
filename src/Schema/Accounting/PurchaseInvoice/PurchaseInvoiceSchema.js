import * as Yup from 'yup';

export const validationPurchaseInvoice = Yup.object().shape({
  client_company_id: Yup.string().required('Company is required'),
  create_date: Yup.string().required('Created Date is required'),
});

export const validationAddPurchaseInvoiceItem = Yup.object().shape({
  item_name: Yup.string()
    .min(1, 'Item Name must be at least 1 characters')
    .max(100, 'Item Name cannot exceed 100 characters')
    .required('Item Name is required'),
  quantity: Yup.number().required('Quantity is required'),
  rate: Yup.number().required('Rate is required'),
});
