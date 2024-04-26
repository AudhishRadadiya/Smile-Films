import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Editor } from 'primereact/editor';
import { useCallback, useEffect, useState } from 'react';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addClientOrderNote,
  getClientOrderNote,
  setIsAddClientOrderNote,
} from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import { useFormik } from 'formik';
import { clientOrderNoteSchema } from 'Schema/ClientFlow/ClientSchema';
import Loader from 'Components/Common/Loader';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';

export default function ProjectOrderNote() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    ClientOrderNoteList,
    clientOrderNoteData,
    clientOrderNoteLoading,
    isAddClientOrderNote,
  } = useSelector(({ clientProject }) => clientProject);

  useEffect(() => {
    dispatch(getClientOrderNote({ order_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (isAddClientOrderNote) {
      dispatch(getClientOrderNote({ order_id: id }));
      dispatch(setIsAddClientOrderNote());
    }
  }, [dispatch, id, isAddClientOrderNote]);

  const [visible, setVisible] = useState(false);

  const onCancel = useCallback(() => {
    resetForm();
    setVisible(false);
  }, []);

  const submitHandle = useCallback(
    values => {
      const payload = {
        ...values,
        order_id: id,
      };
      dispatch(addClientOrderNote(payload));
      resetForm();
      setVisible(false);
    },
    [dispatch],
  );

  const { values, errors, touched, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: clientOrderNoteData,
      validationSchema: clientOrderNoteSchema,
      onSubmit: submitHandle,
    });

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="project_wapper p20">
        {clientOrderNoteLoading && <Loader />}
        <div className="d-flex flex-column h-100">
          <div
            className="editor_text_wrapper"
            dangerouslySetInnerHTML={{
              __html: ClientOrderNoteList?.order_note,
            }}
          >
            {/* <h2>Wedding Works</h2>
            <ul className="wedding-work-wrap">
              <li>
                <Link to="/" className="link_text_blue">
                  <p>https://www.example.nl.examplelogin.nl/mail/login/</p>
                </Link>
              </li>
              <li>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </li>
              <li>
                <p>
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the
                </p>
              </li>
              <li>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </li>
            </ul> */}
          </div>
          <div class="delete_btn_wrap mt-auto p-0 text-end">
            <Button
              className="btn_primary filter_btn"
              onClick={() => setVisible(true)}
            >
              <img src={PlusIcon} alt="PlusIcon" /> Create
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        className="modal_Wrapper quotation_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
        footer={footerContent}
      >
        <div className="form_group">
          {/* <Editor
            name="order_note"
            value={values?.order_note}
            onTextChange={e => setFieldValue('order_note', e.textValue)}
            style={{ height: '500px' }}
            placeholder="Write here"
          /> */}
          <ReactQuill
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            name="order_note"
            style={{ height: '235px' }}
            value={values?.order_note}
            onChange={content => setFieldValue('order_note', content)}
          />
          {touched?.order_note && errors?.order_note && (
            <p className="text-danger">{errors?.order_note}</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
