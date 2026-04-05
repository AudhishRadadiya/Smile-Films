import * as Yup from 'yup';

export const editingEventSchema = Yup.object().shape({
  event_name: Yup.string()
    .min(1, 'Event Name must be at least 1 characters')
    .max(150, 'Event Name cannot exceed 150 characters')
    .required('Event Name is required'),
  event_date: Yup.string().required('Event Date is required'),
  event_item_info: Yup.array().of(
    Yup.object().shape({
      event_item_name: Yup.string().required('Raw Item Name is required'),
      // event_hour: Yup.string()
      //   .required('Raw Item Time is required')
      //   .test('is-valid', 'Please enter valid Raw Item Time', function (value) {
      //     const check_date_time = checkDateTime(value);

      //     if (!check_date_time) {
      //       return false;
      //     }
      //     return true;
      //   }),
      event_hour: Yup.number().notRequired(),
      event_minute: Yup.number().notRequired(),
      event_second: Yup.number().notRequired(),
    }),
  ),
  total_raw_hours: Yup.string().required('Total Item Raw Hours is required'),
  // final_output_hours: Yup.string().test(function (value) {
  //   const { path, createError } = this;

  //   const check_date_time = checkDateTime(value);

  //   if (value && !check_date_time) {
  //     // return false;
  //     return createError({ path, message: 'Please enter valid Final Hours' });
  //   }
  //   return true;
  // }),
  final_output_hour: Yup.number().notRequired(),
  final_output_minute: Yup.number().notRequired(),
  final_output_second: Yup.number().notRequired(),
});
