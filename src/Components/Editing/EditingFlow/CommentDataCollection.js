import {
  addComment,
  clearCommentList,
  getCommentList,
  getOrderNote,
  setIsAddComment,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { Editor } from 'primereact/editor';
import React, { useCallback, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { commentSchema } from 'Schema/Editing/editingSchema';
import { convertDate } from 'Helper/CommonHelper';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';

export default function CommentDataCollection() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { commentData, isAddComment, commentList, orderNoteList } = useSelector(
    ({ editing }) => editing,
  );
  useEffect(() => {
    dispatch(getCommentList({ order_id: id }));
    dispatch(getOrderNote({ order_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (isAddComment) {
      dispatch(getCommentList({ order_id: id }));
    }
    if (isAddComment) {
      dispatch(setIsAddComment(false));
    }
  }, [isAddComment, dispatch, id]);

  const submitHandle = useCallback(
    values => {
      const payload = {
        ...values,
        order_id: id,
      };
      dispatch(addComment(payload));
      resetForm();
      dispatch(clearCommentList());
    },
    [dispatch],
  );

  const { values, errors, touched, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: commentData,
      validationSchema: commentSchema,
      onSubmit: submitHandle,
    });

  return (
    <Col xxl={4} xl={5}>
      <div className="comment_box_wrap radius15 border mt-xl-0 mt-4">
        <div className="comment_box_title py15 px20 border-bottom">
          <h6 className="m-0">Comments</h6>
        </div>
        <div className="comment_box_inner p20 p15-xs">
          {/* <h2 className="mb15">Wedding Works</h2>
          <Link to="" className="text_light_Blue mb15 d-block">
            https://www.example.nl.examplelogin.nl/mail/login/
          </Link>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p> */}

          <ul>
            {commentList &&
              commentList?.length > 0 &&
              commentList?.map((data, i) => {
                return (
                  <li key={i}>
                    <div className="comment_img">
                      <img src={data?.user_image} alt="UserImg" />
                    </div>
                    <div className="comment_right">
                      <h5>
                        {data?.user_name}
                        <span className="text_grey ms-1">
                          {' '}
                          {convertDate(data.created_at)}
                          {/* 6 day ago */}
                        </span>
                      </h5>
                      <div
                        className="editor_text_wrapper"
                        dangerouslySetInnerHTML={{ __html: data?.comment }}
                      />
                    </div>
                  </li>
                );
              })}

            {/* <li>
              <div className="comment_img">
                <img src={UserImg} alt="UserImg" />
              </div>
              <div className="comment_right">
                <h5>
                  Rajesh Singhania
                  <span className="text_grey ms-1">6 day ago</span>
                </h5>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </li> */}
          </ul>
          <div className="form_group mb-3">
            {/* <Editor
              name="comment"
              value={values?.comment}
              onTextChange={e => setFieldValue('comment', e.textValue)}
              style={{ height: '80px' }}
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
          <Button className="btn_primary" onClick={handleSubmit}>
            Comment
          </Button>
        </div>
      </div>
    </Col>
  );
}
