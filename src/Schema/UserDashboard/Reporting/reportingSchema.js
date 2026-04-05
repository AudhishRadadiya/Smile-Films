import * as Yup from 'yup';

export const validationSchemaReporting = Yup.object().shape({
  event_name: Yup.array().when('eventNamesOption', {
    is: value => value && value.length > 0,
    then: () => Yup.string().required('Please select an Event Name'),
    otherwise: () => Yup.string().notRequired(),
  }),

  create_date: Yup.string().required('Create date is required'),
  order_no: Yup.string().required('Order number is required'),
  item_name: Yup.string().required('Item names are required'),
  working_hour: Yup.string().required('Working hour is required'),
  work_describe: Yup.string()
    .required('Work description is required')
    .min(2, 'Work description must be at least 2 characters')
    .max(250, 'Work description cannot exceed 250 characters'),
});
