import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Calendar } from 'primereact/calendar';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAnnouncement,
  clearSelectedAnnouncementData,
  deleteAnnouncement,
  editAnnouncement,
  getAnnouncement,
  getAnnouncementList,
  setIsAddAnnouncement,
  setIsDeleteAnnouncement,
  setIsUpdateAnnouncement,
} from 'Store/Reducers/ActivityOverview/announcementSlice';
import { useFormik } from 'formik';

import Loader from 'Components/Common/Loader';
import Holiday from './Holiday';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { announcementSchema } from 'Schema/ActivityOverview/activityOverviewSchema';
import { getHolidayList } from 'Store/Reducers/ActivityOverview/holidaySlice';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { getFormattedDate } from 'Helper/CommonList';
export default function Announcement({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    announcementList,
    announcementCurrentPage,
    announcementPageLimit,
    isAddAnnouncement,
    isUpdateAnnouncement,
    isDeleteAnnouncement,
    announcementSearchParam,
    announcementLoading,
    selectedAnnouncementData,
  } = useSelector(({ announcement }) => announcement);
  const { holidayCurrentPage, holidaySearchParam, holidayPageLimit, year } =
    useSelector(({ holiday }) => holiday);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    dispatch(
      getAnnouncementList({
        start: announcementCurrentPage,
        limit: announcementPageLimit,
        isActive: '',
        search: announcementSearchParam,
      }),
    );
    dispatch(
      getHolidayList({
        start: holidayCurrentPage,
        limit: holidayPageLimit,
        isActive: '',
        year: year,
        search: holidaySearchParam,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (isAddAnnouncement || isUpdateAnnouncement || isDeleteAnnouncement) {
      dispatch(
        getAnnouncementList({
          start: announcementCurrentPage,
          limit: announcementPageLimit,
          isActive: '',
          search: announcementSearchParam,
        }),
      );
    }
    if (isUpdateAnnouncement) {
      dispatch(setIsUpdateAnnouncement(false));
    }
    if (isAddAnnouncement) {
      dispatch(setIsAddAnnouncement(false));
    }
    if (isDeleteAnnouncement) {
      dispatch(setIsDeleteAnnouncement(false));
    }
  }, [
    isAddAnnouncement,
    isUpdateAnnouncement,
    isDeleteAnnouncement,
    dispatch,
    announcementCurrentPage,
    announcementPageLimit,
    announcementSearchParam,
  ]);

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      announcement_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteAnnouncement(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      let payload = {
        ...values,
        hide_after: getFormattedDate(values?.hide_after),
      };
      if (values?._id) {
        payload = {
          ...payload,
          announcement_id: values?._id,
        };
        dispatch(editAnnouncement(payload));
      } else {
        dispatch(addAnnouncement(payload));
      }
      resetForm();
      dispatch(clearSelectedAnnouncementData());
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedAnnouncementData,
    validationSchema: announcementSchema,
    onSubmit: submitHandle,
  });

  return (
    <div className="main_Wrapper">
      {announcementLoading && <Loader />}
      <div className="bg-white p20 p15-xs border radius15">
        <Row className="g-4">
          <Col xxl={5} lg={6}>
            <div className="announcement_box bg_light_blue border radius15 overflow-auto h-100">
              <div className="announcement_title py15 px20">
                <h3 className="m-0">Announcement</h3>
              </div>
              <div className="announcement_list_wrap">
                <ul>
                  {announcementList?.list?.map((item, index) => {
                    return (
                      <li key={index}>
                        <div className="d-flex align-items-center justify-content-between mb15">
                          <h5 className="m-0">{item?.announcement_title}</h5>
                          <ul className="d-flex justify-content-end align-items-center">
                            {is_edit_access && (
                              <li className="me-2">
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    dispatch(
                                      getAnnouncement({
                                        announcement_id: item?._id,
                                      }),
                                    );
                                  }}
                                >
                                  <img src={EditIcon} alt="EditIcon" />
                                </Button>
                              </li>
                            )}
                            {is_delete_access && (
                              <li>
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    setDeleteId(item?._id);
                                    setDeletePopup(true);
                                  }}
                                >
                                  <img src={TrashIcon} alt="EditIcon" />
                                </Button>
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* <p>{item?.announcement}</p> */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.announcement,
                          }}
                          className="editor_text_wrapper"
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text_light">
                            {item?.announcement_time}
                          </h6>
                          <h6 className="text_light">
                            {item?.announcement_date}
                          </h6>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Col>
          <Col xxl={7} lg={6}>
            <div className="announcement_create border radius15 mb20">
              <div className="py15 px20 border-bottom">
                <h3 className="m-0">Announcement Create</h3>
              </div>
              <div className="announcement_create_titile p20 p15-xs border-bottom">
                <div className="form_group mb-3">
                  <label>Write Title</label>
                  <InputText
                    id="WriteTitle"
                    placeholder="Write Title"
                    type="text"
                    className="input_wrap"
                    value={values?.announcement_title || ''}
                    name="announcement_title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                  />
                  {touched?.announcement_title &&
                    errors?.announcement_title && (
                      <p className="text-danger">
                        {errors?.announcement_title}
                      </p>
                    )}
                </div>
                {/* <Editor
                  name="announcement"
                  value={values?.announcement}
                  onTextChange={e => setFieldValue('announcement', e.textValue)}
                  style={{ height: '200px' }}
                  placeholder="Write here"
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  name="announcement"
                  style={{ height: '235px' }}
                  value={values?.announcement}
                  onChange={content => setFieldValue('announcement', content)}
                />
                {touched?.announcement && errors?.announcement && (
                  <p className="text-danger">{errors?.announcement}</p>
                )}
              </div>
              {is_create_access && (
                <div className="announcement_create_footer p15">
                  <Row className="g-3">
                    <Col xl={5} sm={6}>
                      <div className="form_group date_select_wrapper d-flex flex-wrap align-items-center">
                        <label
                          htmlFor="HideAfter"
                          className="me-2 text-nowrap mb-0"
                        >
                          Hide After
                        </label>
                        <Calendar
                          id="HideAfter"
                          placeholder="Date"
                          showIcon
                          dateFormat="dd-mm-yy"
                          name="hide_after"
                          readOnlyInput
                          value={values?.hide_after || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          minDate={new Date()}
                          showButtonBar
                        />
                        {touched?.hide_after && errors?.hide_after && (
                          <p className="text-danger">{errors?.hide_after}</p>
                        )}
                      </div>
                    </Col>
                    <Col xl={7} sm={6}>
                      <div className="text-end">
                        <Button
                          className="btn_border_dark me-2"
                          onClick={() => {
                            dispatch(clearSelectedAnnouncementData());
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="btn_primary" onClick={handleSubmit}>
                          Post
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            <Holiday hasAccess={hasAccess} />
          </Col>
        </Row>
      </div>

      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
