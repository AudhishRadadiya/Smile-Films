import * as Yup from 'yup';

export const clientCommentSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

export const clientOrderNoteSchema = Yup.object().shape({
  order_note: Yup.string().required('Order Note required'),
});
