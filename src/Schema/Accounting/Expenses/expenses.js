import * as Yup from 'yup';

export const validationExpenses = Yup.object().shape({
  expense_date: Yup.string().required('Date is required'),
  expense_category: Yup.string().required('Expense Category is required'),
  payment_type: Yup.string().required('Payment Type is required'),
  payment_out_from: Yup.string().when('payment_type', value => {
    return value.includes('2') || value.includes('3')
      ? Yup.string().required('Please select a Payment out from')
      : Yup.string().notRequired();
  }),
});

export const validationAddExpensesItem = Yup.object().shape({
  item_name: Yup.string()
    .min(1, 'Item Name must be at least 1 characters')
    .max(100, 'Item Name cannot exceed 100 characters')
    .required('Item Name is required'),
  quantity: Yup.number().required('Quantity is required'),
  rate: Yup.number().required('Rate is required'),
});
