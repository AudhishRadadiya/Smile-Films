import { checkWordLimit, convertIntoNumber } from 'Helper/CommonHelper';
import { deletedHistorySchema } from 'Schema/ActivityOverview/activityOverviewSchema';
import {
  addDeletedHistory,
  getDeletedHistoryList,
} from 'Store/Reducers/ActivityOverview/DeletedHistory/DeletedHistorySlice';
import { getDashboardDeletedHistoryData } from 'Store/Reducers/Dashboard/AdminDashboardSlice';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { memo, useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const StorageList = () => {
  const dispatch = useDispatch();

  const [showDeletedHistoryPopup, setShowDeletedHistoryPopup] = useState(false);
  const [deletedData, setDeletedData] = useState({});

  const { dashboardDeletedHistoryData } = useSelector(
    ({ adminDashboard }) => adminDashboard,
  );

  const submitHandle = useCallback(
    (value, { resetForm }) => {
      dispatch(
        addDeletedHistory({
          order_id: deletedData?._id,
          no_of_files_deleting: value?.no_of_files_deleting,
          describe: value?.description,
        }),
      )
        .then(res => {
          setShowDeletedHistoryPopup(false);
          dispatch(getDashboardDeletedHistoryData());
          setDeletedData({});
          resetForm();
        })
        .catch(err => {
          console.error('error', err);
        });
    },
    [dispatch, deletedData],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: '',
      no_of_files_deleting: '',
    },
    validationSchema: deletedHistorySchema,
    onSubmit: submitHandle,
  });

  const footerContent = (
    <div className="footer_button">
      <Button
        className="btn_border_dark"
        onClick={() => {
          setShowDeletedHistoryPopup(false);
          setDeletedData({});
          resetForm();
        }}
      >
        Cancel
      </Button>
      <Button className="btn_primary" onClick={handleSubmit} type="submit">
        Confirm
      </Button>
    </div>
  );

  return (
    <>
      <Col xxl={12} md={6}>
        <div className="chat-inner-wrap mb-0 storage_back overflow-hidden">
          <div className="chat_header">
            <div className="chat_header_text">
              <h3 className="mb-0">Storage</h3>
            </div>
          </div>
          <div className="chat_boxs">
            {dashboardDeletedHistoryData?.list?.map(item => {
              return (
                <div className="chat_box">
                  <div className="storge_details">
                    <p className="mb-2 text-black">
                      Order no{' '}
                      <span className="text_blue_dark">{item?.inquiry_no}</span>{' '}
                      have no activity seems 3 months, Do you want to Delete
                      this Orders Data ?
                    </p>
                    <Row>
                      <Col sm={6}>
                        <div className="storge_details">
                          <h5 className="mb-0">
                            Data Size: {convertIntoNumber(item?.data_size)}GB
                          </h5>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="delete_btn text-end">
                          {/* <button className="btn_primary">Delete</button> */}
                          <Button
                            className="btn_primary"
                            onClick={() => {
                              setDeletedData(item);
                              setShowDeletedHistoryPopup(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <div className="chat_box">
            <div className="storge_details">
              <p className="mb-2 text-black">
                Order no <span className="text_blue">#51238</span> have no
                activity seems 10 months, Do you want to Delete this Orders Data
                ?
              </p>
              <Row>
                <Col sm={6}>
                  <div className="storge_details">
                    <h5 className="mb-0">Data Size: 280GB</h5>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="delete_btn text-end">
                    <button className="btn_primary">Delete</button>
                  </div>
                </Col>
              </Row>
            </div>
          </div> */}
        </div>
      </Col>
      <Dialog
        header={'Delete Confirmation'}
        visible={showDeletedHistoryPopup}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => {
          setShowDeletedHistoryPopup(false);
          setDeletedData({});
          resetForm();
        }}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="no_of_files_deleting" l>
                  No of file Deleting{' '}
                  <span className="text-danger fs-6">*</span>
                </label>
                <InputNumber
                  id="no_of_files_deleting"
                  placeholder="No of file deleting"
                  name="no_of_files_deleting"
                  value={values?.no_of_files_deleting}
                  onChange={e => {
                    if (!e.value || checkWordLimit(e.value, 8)) {
                      setFieldValue(
                        'no_of_files_deleting',
                        e.value ? e.value : '',
                      );
                    }
                  }}
                  maxLength="8"
                  onBlur={handleBlur}
                  useGrouping={false}
                />
                {touched?.no_of_files_deleting &&
                  errors?.no_of_files_deleting && (
                    <p className="text-danger">
                      {errors?.no_of_files_deleting}
                    </p>
                  )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="description">Write the Description</label>
                <InputText
                  id="description"
                  name="description"
                  value={values?.description}
                  onChange={handleChange}
                  placeholder="Project Type"
                  onBlur={handleBlur}
                  className="input_wrap"
                />
                {touched?.description && errors?.description && (
                  <p className="text-danger">{errors?.description}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </>
  );
};

export default memo(StorageList);
