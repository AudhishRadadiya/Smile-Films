import React, { memo, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import CompleteIcon from '../../Assets/Images/complete-green.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  editExposingOrder,
  getExposingDetails,
  setExposerCompletedData,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';

const ExposingCompleted = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exposingLoading, editExposingOrderLoading, exposerCompletedData } =
    useSelector(({ exposing }) => exposing);

  const fetchAllData = useCallback(() => {
    dispatch(getExposingDetails({ order_id: id || '66177ff0ce1cf55c9b9a5e40' }))
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

  const { values } = useFormik({
    enableReinitialize: true,
    initialValues: exposerCompletedData,
    // onSubmit: submitHandle,
  });

  const handleConfirmation = useCallback(
    isConfirmation => {
      const payloadObj = {
        order_id: id,
        ...(isConfirmation
          ? { sent_confirmation: true }
          : { final_work: values?.final_work }),
      };

      dispatch(editExposingOrder(payloadObj))
        .then(response => {
          dispatch(
            getExposingDetails({ order_id: id || '66177ff0ce1cf55c9b9a5e40' }),
          )
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
    },
    [dispatch, id, values],
  );

  return (
    <>
      {exposingLoading || (editExposingOrderLoading && <Loader />)}
      <div className="main_Wrapper">
        <div className="processing_main bg-white radius15 border">
          {/* <div className="billing_heading">
            <div className="processing_bar_wrapper">
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Order Form</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Quotation</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Quotes Approve</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Assign to Exposer</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Overview</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap current">
                <h4 className="m-0 active">Completed</h4>
                <span className="line"></span>
              </div>
            </div>
          </div> */}
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
                          <h6>Creat Date</h6>
                          <h4>{values?.create_date}</h4>
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
                                `${values?.start_date} To ${values?.end_date}`}
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
                <h2>This Project is Completed</h2>
              </div>
              <div className="data-submit-wrapper">
                <h5>Data Submit</h5>
                <div className="data_inner">
                  <Link to="/">
                    <p>{values?.final_work}</p>
                  </Link>
                  <div className="delete_btn_wrap justify-content-center text-center">
                    <button className="btn_border_dark me-2">Cancel</button>
                    <button
                      className="btn_primary"
                      onClick={() => handleConfirmation(false)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="request_send text-center">
                  {!values?.sent_confirmation ? (
                    <>
                      <button
                        className="btn_yellow"
                        onClick={() => handleConfirmation(true)}
                      >
                        Send Confirmation Request{' '}
                      </button>
                      <h5 className="mb-0 mt-3 fw_400">
                        Get Data Received Confection From Client
                      </h5>
                    </>
                  ) : values?.client_confirmation ? (
                    <h5 className="mb-0 mt-3 fw_400 text_yellow">
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
