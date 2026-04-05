import * as Yup from 'yup';

export const announcementSchema = Yup.object().shape({
  announcement_title: Yup.string().required('Announcement Title is required'),
  announcement: Yup.string().required('Announcement is required'),
  hide_after: Yup.string().required('Hide after is required'),
});

export const holidaySchema = Yup.object().shape({
  holiday_date: Yup.string().required('Holiday Date is required'),
  holiday_name: Yup.string()
    .max(50, 'Holiday Name should be maximum 50')
    .required('Holiday Name is required'),
});

export const inquirySchema = Yup.object().shape({
  inquiry_no: Yup.string().required('Inquiry No is required'),
  create_date: Yup.string().required('Create Date is required'),
  client_company_id: Yup.string().required('Client Company is required'),
  inquiry_type: Yup.number().required('Please select an inquiry type'),
  couple_name: Yup.string().required('Please enter couple name'),
  editing_inquiry: Yup.array().when('inquiry_type', {
    is: 1,
    then: () => Yup.array().min(1, 'Editing Inquiry Item is Required'),
    otherwise: () => Yup.array(),
  }),
  exposing_inquiry: Yup.array().when('inquiry_type', {
    is: 2,
    then: () => Yup.array().min(1, 'Exposing Inquiry Item is Required'),
    otherwise: () => Yup.array(),
  }),
});

export const deletedHistorySchema = Yup.object().shape({
  no_of_files_deleting: Yup.number()
    .min(1, 'No of file minimum 1 required')
    .max(10000000, 'No of file should be maximum 10000000')
    .required('No of file is required'),
  description: Yup.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .notRequired(),
});
