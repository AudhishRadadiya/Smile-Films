import React, { memo, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import CompleteIcon from '../../Assets/Images/complete-green.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExposingStep,
  addInvoice,
  editExposingOrder,
  getExposingDetails,
  setExposerCompletedData,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import {
  AssignedWorkedExposingStatus,
  getSeverityStatus,
} from 'Helper/CommonList';
import { Tag } from 'primereact/tag';

const ExposingCompleted = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    exposingLoading,
    getExposingStepData,
    exposingDetailsData,
    exposerCompletedData,
    editExposingOrderLoading,
  } = useSelector(({ exposing }) => exposing);

  const { orderLoading } = useSelector(({ editing }) => editing);

  const fetchAllData = useCallback(() => {
    dispatch(getExposingDetails({ order_id: id }))
      .then(response => {
        const responseData = response.payload;

        const updatedData = {
          ...responseData,
          ...(responseData?.client_confirmation_at && {
            client_confirmation_date: moment(
              responseData?.client_confirmation_at,
            ).format('MM-DD-YYYY'),
            client_confirmation_time: moment(
              responseData?.client_confirmation_at,
            ).format('hh:mm:ss A'),
          }),
          mobile_no: Array.isArray(responseData?.mobile_no)
            ? responseData?.mobile_no?.join(', ')
            : responseData?.mobile_no,
        };

        dispatch(setExposerCompletedData(updatedData));
        return { updatedData };
      })
      .catch(error => {
        console.error('Error fetching details data:', error);
      });
  }, [dispatch, id]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitHandle = useCallback(
    value => {
      if (value?.final_work) {
        const payloadObj = {
          order_id: id,
          final_work: value?.final_work,
        };

        handleFinalWorkAndConfirmation(payloadObj);
      }
    },
    [id],
  );

  const { values, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: exposerCompletedData,
      onSubmit: submitHandle,
    });

  const handleFinalWorkAndConfirmation = payload => {
    dispatch(editExposingOrder(payload))
      .then(response => {
        if (getExposingStepData?.step < 6) {
          let payload = {
            order_id: id,
            step: 6,
          };
          dispatch(addExposingStep(payload));
        }

        dispatch(getExposingDetails({ order_id: id }))
          .then(response => {
            const responseData = response?.payload;

            // check the condition if one time converted the bill.
            // if (!responseData?.is_billing) {
            //   dispatch(
            //     addInvoice({
            //       order_id: id,
            //       quotation_id: responseData?.quotation_id,
            //     }),
            //   );
            // }

            const updatedData = {
              ...responseData,
              ...(responseData?.client_confirmation_at && {
                client_confirmation_date: moment(
                  responseData?.client_confirmation_at,
                ).format('MM-DD-YYYY'),
                client_confirmation_time: moment(
                  responseData?.client_confirmation_at,
                ).format('hh:mm:ss A'),
              }),
            };

            dispatch(setExposerCompletedData(updatedData));
            return { updatedData };
          })
          .catch(error => {
            console.error('Error fetching details :', error);
          });
      })
      .catch(error => {
        console.error('Error edit order :', error);
      });
  };

  const handleConfirmation = useCallback(() => {
    // const payloadObj = {
    //   order_id: id,
    //   ...(isConfirmation
    //     ? { sent_confirmation: true }
    //     : { final_work: values?.final_work }),
    // };

    const payloadObj = {
      order_id: id,
      sent_confirmation: true,
    };

    handleFinalWorkAndConfirmation(payloadObj);
  }, [id]);

  const statusItemTemplate = option => {
    return (
      <Tag value={option?.label} severity={getSeverityStatus(option?.label)} />
    );
  };

  const handleProjectStatusChange = e => {
    setFieldValue('order_status', e.value);
    let payload = {
      order_id: id,
      project_status: e.value,
    };
    dispatch(editExposingOrder(payload))
      .then(response => {
        const exposingOrderResponse = response?.payload;
        return { exposingOrderResponse };
      })
      .then(({ exposingOrderResponse }) => {
        dispatch(getExposingDetails({ order_id: id })).then(res => {
          const exposingData = res?.payload;

          // check the condition if one time converted the bill.
          if (
            e?.value === 6 &&
            exposingOrderResponse?.data?.err === 0 &&
            exposingData?.is_billing === false
          ) {
            dispatch(
              addInvoice({
                order_id: id,
                quotation_id: exposingData?.quotation_id,
              }),
            );
          }
        });
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      });
  };

  return (
    <>
      {(exposingLoading || editExposingOrderLoading || orderLoading) && (
        <Loader />
      )}
      <div className="main_Wrapper">
        <div className="processing_main bg-white radius15 border">
          <div className="billing_details">
            <div className="mb30">
              <div className="process_order_wrap p-0 pb-3">
                <Row className="align-items-center">
                  <Col className="col-6">
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setExposingSelectedProgressIndex(5));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Completed </h2>
                      </div>
                    </div>
                  </Col>
                  <Col className="col-6">
                    <div className="text-end">
                      <Link to="/exposing" className="btn_border_dark">
                        Exit Page
                      </Link>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job_company mt-3">
                <Row className="gy-3">
                  <Col lg={4}>
                    <div class="date_number mb-3 mb-lg-0">
                      <ul>
                        <li>
                          <h6>Order No.</h6>
                          <h4>{values?.inquiry_no}</h4>
                        </li>
                        <li>
                          <h6>Create Date</h6>
                          <h4>
                            {moment(values?.create_date)?.format('DD-MM-YYYY')}
                          </h4>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="order-details-wrapper p10 border radius15  mb-3 mb-md-0">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Job</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Dates :</span>
                            <h5>
                              {values?.start_date &&
                                values?.end_date &&
                                `${moment(values?.start_date)?.format(
                                  'DD-MM-YYYY',
                                )} To ${moment(values?.end_date)?.format(
                                  'DD-MM-YYYY',
                                )}`}
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Venue :</span>
                            <h5>{values?.venue}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="order-details-wrapper p10 border radius15">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Company</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Company Name :</span>
                            <h5>{values?.company_name}</h5>
                          </div>
                          <div className="order-date">
                            <span>Client Name :</span>
                            <h5>{values?.client_full_name}</h5>
                          </div>
                        </div>
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Phone No :</span>
                            <h5>{values?.mobile_no}</h5>
                          </div>
                          <div className="order-date">
                            <span>Email :</span>
                            <h5>{values?.email_id}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="completed_wrapper">
              <div className="complete_img text-center">
                <img src={CompleteIcon} alt="completeicon" />
                <h2>Current Status Of This Project</h2>
              </div>
              <div className="d-sm-flex align-items-center justify-content-center mb-3">
                <h5 className="m-0 me-sm-2 mb-sm-0 mb-2">Project Status</h5>
                <div className="form_group">
                  <ReactSelectSingle
                    value={values?.order_status}
                    options={AssignedWorkedExposingStatus}
                    itemTemplate={statusItemTemplate}
                    onChange={e => {
                      handleProjectStatusChange(e);
                    }}
                    valueTemplate={statusItemTemplate}
                    placeholder="Project Status"
                    className="w-100"
                    disabled={!exposingDetailsData?.final_work}
                  />
                </div>
              </div>
              <div className="data-submit-wrapper">
                <div className="data_inner">
                  <div className="form_group mb-3">
                    <InputTextarea
                      id="FinalWork"
                      placeholder="Past link here"
                      className="input_wrap"
                      rows={6}
                      name="final_work"
                      value={values?.final_work}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="delete_btn_wrap justify-content-center text-center">
                    <Button
                      className="btn_border_dark me-2"
                      onClick={() => setFieldValue('final_work', '')}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn_primary"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!values?.final_work?.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                <div className="request_send text-center">
                  {!values?.sent_confirmation ? (
                    <>
                      <button
                        className="btn_yellow"
                        onClick={handleConfirmation}
                      >
                        Send Confirmation Request{' '}
                      </button>
                      <h5 className="mb-0 mt-3 fw_400">
                        Get Data Received Confection From Client
                      </h5>
                    </>
                  ) : values?.client_confirmation ? (
                    <h5 className="mb-0 mt-3 fw_400 text_green">
                      {`Data Received Confirmed by Client on ${
                        values?.client_confirmation_date
                          ? values?.client_confirmation_date
                          : ''
                      } at ${
                        values?.client_confirmation_time
                          ? values?.client_confirmation_time
                          : ''
                      }`}
                    </h5>
                  ) : (
                    <h5 className="mb-0 mt-3 fw_400 text_yellow">
                      Data confirmation request sent to client, awaiting
                      approval.
                    </h5>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(ExposingCompleted);
