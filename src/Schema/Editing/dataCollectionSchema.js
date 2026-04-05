import * as Yup from 'yup';

export const dataCollectionSchema = Yup.object().shape({
  inquiry_no: Yup.number().required('Inquiry No. is required'),
  create_date: Yup.date().required('Create date is required'),
  client_company_id: Yup.string().required('Client Company is required'),
  couple_name: Yup.string()
    .min(2, 'Company Name must be at least 2 characters')
    .max(100, 'Company Name cannot exceed 100 characters')
    .trim()
    .required('Couple Name is required'),
  data_size: Yup.number().required('Data Size is required'),
  data_size_type: Yup.string().required('Data Size Type is required'),
  data_collection_source: Yup.array().min(
    1,
    'Data Collection Source is required',
  ),
  editing_inquiry: Yup.array()
    .min(1, 'Editing Items is Required')
    .required('Editing Items is Required'),
  project_type: Yup.string().required('Project type is required'),
  editing_second: Yup.number().required('Total Second is required'),
  editing_minute: Yup.number().required('Total Minute is required'),
  editing_hour: Yup.number().required('Total Hours is required'),
});
