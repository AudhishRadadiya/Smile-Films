import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ProfileImg from '../../Assets/Images/profile-img.svg';
import InfoIcon from '../../Assets/Images/Info-icon.svg';
import InfoSuccess from '../../Assets/Images/info-success.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExposingStep,
  editExposingItems,
  getExposingDetails,
  getExposingItems,
  getExposingStep,
  setExposerOverviewData,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import Loader from 'Components/Common/Loader';
import { useFormik } from 'formik';
import moment from 'moment';
import UserIcon from '../../Assets/Images/add-user.svg';

const ExposingOverview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowNext, setIsShowNext] = useState(true);
  const [confirmation, setConfirmation] = useState({
    confirmationRowData: {},
    confirmationModal: false,
  });

  const {
    exposingItemsLoading,
    exposingLoading,
    exposerOverviewData,

    getExposingStepData,
    exposingDetailsData,
    exposingItemsData,
    assignExposingEmployeeList,
  } = useSelector(({ exposing }) => exposing);

  const fetchAllData = useCallback(() => {
    dispatch(getExposingItems({ order_id: id }))
      .then(response => {
        const overviewTableData = response.payload;
        return { overviewTableData };
      })
      .then(({ overviewTableData }) => {
        dispatch(getExposingDetails({ order_id: id }))
          .then(response => {
            const responseData = response.payload;

            const overviewAlldata = {
              ...responseData,
              mobile_no: Array.isArray(responseData?.mobile_no)
                ? responseData?.mobile_no?.join(', ')
                : responseData?.mobile_no,
              overviewTableList: overviewTableData,
            };

            const isAssignEmployeeConfirmation = overviewTableData?.every(
              item => {
                return item?.admin_confirmation;
              },
            );

            if (isAssignEmployeeConfirmation) {
              setIsShowNext(false);
            } else {
              setIsShowNext(true);
            }

            dispatch(setExposerOverviewData(overviewAlldata));
            return { overviewTableData, responseData, overviewAlldata };
          })
          .catch(error => {
            console.error('Error fetching Items data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching Items data:', error);
      });
  }, [dispatch, id]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitHandle = useCallback(
    value => {
      if (getExposingStepData?.step < 5) {
        let payload = {
          order_id: id,
          step: 5,
        };
        dispatch(addExposingStep(payload))
          .then(response => {
            dispatch(getExposingStep({ order_id: id }));
            dispatch(setExposingSelectedProgressIndex(6));
          })
          .catch(errors => {
            console.error('Add Status:', errors);
          });
      } else {
        dispatch(setExposingSelectedProgressIndex(6));
      }
    },
    [dispatch, getExposingStepData, id],
  );

  const { values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: exposerOverviewData,
    onSubmit: submitHandle,
  });

  const ConfectionTemplet = rowData => {
    const formattedDate =
      rowData?.admin_confirmation_at &&
      moment(rowData?.admin_confirmation_at).format('MM-DD-YYYY');
    const formattedTime =
      rowData?.admin_confirmation_at &&
      moment(rowData?.admin_confirmation_at).format('hh:mm:ss A');
    const updatedOrderDate = rowData?.order_date
      ? moment(rowData?.order_date).format('DD-MM-YYYY')
      : '';
    return (
      <div className="assigned_exposer">
        {rowData?.admin_confirmation ? (
          <span className="btn_as_text">
            <div className="confection_text">
              <img src={InfoSuccess} alt="" />
              <h6 className="m-0 text_green">
                {`Data Received from ${rowData?.data_submitted_by} Confirmed on ${formattedDate} at ${formattedTime}`}
              </h6>
            </div>
          </span>
        ) : rowData?.sent_confirmation ? (
          <Button
            className="btn_as_text"
            onClick={() => {
              setConfirmation({
                confirmationRowData: {
                  ...rowData,
                  order_date: updatedOrderDate,
                },
                confirmationModal: true,
              });
            }}
          >
            <div className="confection_text">
              <img src={InfoIcon} alt="" />
              <h6 className="m-0 text_yellow">
                Please Give Confirmation that you Received Data
              </h6>
            </div>
          </Button>
        ) : (
          '-'
        )}
      </div>
    );
  };

  const AssignBodyTemplet = rowData => {
    return (
      <ul className="assign-body-wrap">
        {rowData?.employeeData?.map(item => {
          return (
            <li>
              <div
                className={`${
                  item?.is_freelancer === true ? 'bg_orange' : ''
                } assign-profile-wrapper`}
              >
                <div className="assign_profile">
                  <img src={item?.image ? item?.image : UserIcon} alt="" />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">{item?.employee_name}</h5>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const packageWithItemNameTemplate = data => {
    const packageWithItem = `${
      data?.package_name ? data?.package_name + ' -' : ''
    } ${data?.item_name ? data?.item_name : ''}`;

    return packageWithItem;
  };

  const eventDateTemplate = rowData => {
    // const updatedDate = moment(rowData?.order_date)?.format('DD-MM-YYYY');
    const orderStartDate = rowData?.order_start_date
      ? moment(rowData?.order_start_date).format('DD-MM-YYYY')
      : '';

    const orderEndDate = rowData?.order_end_date
      ? moment(rowData?.order_end_date).format('DD-MM-YYYY')
      : '';

    return (
      <span>
        {orderStartDate
          ? orderStartDate + (orderEndDate ? ' To ' + orderEndDate : '')
          : orderEndDate
          ? ' To ' + orderEndDate
          : ''}
      </span>
    );
  };

  const dateSizeBodyTemplet = rowData => {
    return <span>{`${rowData?.data_size ? rowData?.data_size : 0} GB`}</span>;
  };

  const handleConfirmation = useCallback(() => {
    if (Object.keys(confirmation?.confirmationRowData)?.length > 0) {
      const payload = {
        item_status_id: confirmation?.confirmationRowData?.item_status_id,
        admin_confirmation: true,
      };

      dispatch(editExposingItems(payload))
        .then(response => {
          dispatch(getExposingItems({ order_id: id }))
            .then(response => {
              const overviewTableData = response.payload;

              const overviewAlldata = {
                ...exposerOverviewData,
                overviewTableList: overviewTableData,
              };

              const isAssignEmployeeConfirmation = overviewTableData?.every(
                item => {
                  return item?.sent_confirmation && item?.admin_confirmation;
                },
              );

              if (isAssignEmployeeConfirmation) {
                setIsShowNext(false);
              } else {
                setIsShowNext(true);
              }

              dispatch(setExposerOverviewData(overviewAlldata));
            })
            .catch(error => {
              console.error(error);
            });
          setConfirmation({
            confirmationRowData: {},
            confirmationModal: false,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [confirmation, dispatch, exposerOverviewData, id]);

  return (
    <>
      {(exposingItemsLoading || exposingLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="processing_main">
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
              <div className="verifide_wrap current">
                <h4 className="m-0 active">Overview</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap next">
                <h4 className="m-0">Completed</h4>
                <span className="line"></span>
              </div>
            </div>
          </div> */}
          {/* <div className="billing_details"> */}
          <div className="mb25">
            <div className="process_order_wrap p-0 pb-3">
              <Row className="align-items-center">
                <Col sm={6}>
                  <div className="back_page">
                    <div className="btn_as_text d-flex align-items-center">
                      {/* <Link to="/assign-to-exposer">
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Link> */}
                      <Button
                        className="btn_transparent"
                        onClick={() => {
                          dispatch(setExposingSelectedProgressIndex(4));
                        }}
                      >
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </Button>
                      <h2 className="m-0 ms-2 fw_500">Overview</h2>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="date_number">
                    <ul className="justify-content-end">
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
              </Row>
            </div>
            <Row>
              <Col lg={8}>
                <div className="job_company mt-3">
                  <Row className="g-3 g-sm-4">
                    <Col md={6}>
                      <div className="order-details-wrapper p10 border radius15">
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
                    <Col md={6}>
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
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height Exposing_table border radius15">
            <DataTable
              value={values?.overviewTableList}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column
                field="item_name"
                header="Item Name"
                sortable
                body={packageWithItemNameTemplate}
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column
                field="event_date"
                header="Event Date"
                sortable
                body={eventDateTemplate}
              ></Column>
              <Column
                field="assigned_exposer"
                header="Assigned Exposer"
                sortable
                body={AssignBodyTemplet}
              ></Column>
              <Column
                field="date_size"
                header="Date Size"
                sortable
                body={dateSizeBodyTemplet}
              ></Column>
              <Column
                field="assigned_freelancer_exposer"
                header="Give Data Confirmation to Employee"
                sortable
                body={ConfectionTemplet}
              ></Column>
            </DataTable>
          </div>
          {/* <div class="delete_btn_wrap mt-4 p-0 text-end">
              <Link to="/exposing" class="btn_border_dark">
                Exit Page
              </Link>
              <Link to="/completed" class="btn_primary">
                Save
              </Link>
            </div> */}
          <div className="btn_group text-end mt20">
            <Button
              onClick={() => {
                navigate('/exposing');
              }}
              className="btn_border_dark"
            >
              Exit Page
            </Button>

            <Button
              onClick={handleSubmit}
              type="submit"
              className="btn_primary ms-2"
              disabled={isShowNext}
            >
              Next
            </Button>
          </div>
          {/* </div> */}
        </div>
        {/* conformation popup */}
        <Dialog
          className="modal_Wrapper conformation_dialog"
          visible={confirmation?.confirmationModal}
          onHide={() =>
            setConfirmation({
              confirmationRowData: {},
              confirmationModal: false,
            })
          }
          draggable={false}
          header="Data Received Confirmation"
        >
          <div className="delete_popup_wrapper conformation_wrapper">
            <div class="details_box pt10">
              <div class="details_box_inner">
                <div class="order-date">
                  <h5>Employee Name :</h5>
                  <h4>
                    {confirmation?.confirmationRowData?.data_submitted_by}
                  </h4>
                </div>
                <div class="order-date">
                  <h5>Order No :</h5>
                  <h4>{values?.inquiry_no}</h4>
                </div>
                <div class="order-date">
                  <h5>Event Date :</h5>
                  <h4>{confirmation?.confirmationRowData?.order_date}</h4>
                </div>
              </div>
              <div class="details_box_inner">
                <div class="order-date">
                  <h5>Item Name :</h5>
                  <h4>{confirmation?.confirmationRowData?.item_name}</h4>
                </div>
                <div class="order-date">
                  <h5>Quantity :</h5>
                  <h4>{confirmation?.confirmationRowData?.quantity}</h4>
                </div>
                <div class="order-date">
                  <h5>Data Size :</h5>
                  <h4>
                    {confirmation?.confirmationRowData?.data_size
                      ? confirmation?.confirmationRowData?.data_size
                      : 0}{' '}
                    GB
                  </h4>
                </div>
              </div>
            </div>
            <div className="conformation_msg">
              <p>
                Please confirm that you've received all the data for this order.
                from your Employee, Click <span>'Confirm'</span> if you've
                received the data.
              </p>
            </div>
            <div className="delete_btn_wrap justify-content-center">
              <button
                className="btn_border_dark me-2"
                onClick={() =>
                  setConfirmation({
                    confirmationRowData: {},
                    confirmationModal: false,
                  })
                }
              >
                Cancel
              </button>
              <button className="btn_green" onClick={handleConfirmation}>
                Confirmed
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default memo(ExposingOverview);
