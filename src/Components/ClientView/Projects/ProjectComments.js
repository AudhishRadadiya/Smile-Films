import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { useDispatch, useSelector } from 'react-redux';
import {
  addClientComment,
  getClientCommentList,
  setIsAddClientComment,
} from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import { convertDate } from 'Helper/CommonHelper';
import { useFormik } from 'formik';
import { clientCommentSchema } from 'Schema/ClientFlow/ClientSchema';
import Loader from 'Components/Common/Loader';
import ProjectOrderNote from './ProjectOrderNote';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';

export default function ProjectComments() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    clientCommentData,
    isAddClientComment,
    clientCommentList,
    clientCommentLoading,
  } = useSelector(({ clientProject }) => clientProject);

  useEffect(() => {
    dispatch(getClientCommentList({ order_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (isAddClientComment) {
      dispatch(getClientCommentList({ order_id: id }));
    }
    if (isAddClientComment) {
      dispatch(setIsAddClientComment(false));
    }
  }, [isAddClientComment, dispatch, id]);

  const submitHandle = useCallback(
    values => {
      const payload = {
        ...values,
        order_id: id,
      };
      dispatch(addClientComment(payload));
      resetForm();
    },
    [dispatch],
  );

  const { values, errors, touched, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: clientCommentData,
      validationSchema: clientCommentSchema,
      onSubmit: submitHandle,
    });

  return (
    <div className="overview_wrap p20 p15-sm">
      {clientCommentLoading && <Loader />}
      <Row className="g-4">
        <Col md={5}>
          {/* <div className="project_wapper p20">
            <div className="d-flex flex-column h-100">
              <div>
                <h2>Wedding Works</h2>
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
                      Lorem Ipsum has been the industry's standard dummy text
                      ever since the
                    </p>
                  </li>
                  <li>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </li>
                </ul>
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
          </div> */}
          <ProjectOrderNote />
        </Col>
        <Col md={7}>
          <div className="comment_box_wrap">
            <div className="comment_box_inner">
              <ul>
                {clientCommentList &&
                  clientCommentList?.length > 0 &&
                  clientCommentList?.map((data, i) => {
                    return (
                      <li key={i}>
                        <div className="comment_img">
                          <img src={data?.user_image} alt="UserImg" />
                        </div>
                        <div className="comment_right">
                          <h5>
                            {data?.user_name}
                            <span className="text_grey fw_400 ms-1">
                              {convertDate(data.created_at)}
                            </span>
                          </h5>
                          <p>{data?.comment}</p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <div className="form_group mb-3">
                {/* <Editor
                  name="comment"
                  value={values?.comment}
                  onTextChange={e => setFieldValue('comment', e.textValue)}
                  style={{ height: '180px' }}
                  placeholder="Write here"
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  name="comment"
                  style={{ height: '235px' }}
                  value={values?.comment}
                  onChange={content => setFieldValue('comment', content)}
                />
                {touched?.comment && errors?.comment && (
                  <p className="text-danger">{errors?.comment}</p>
                )}
              </div>
              <div className="text-end">
                <Button className="btn_grey" onClick={handleSubmit}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
