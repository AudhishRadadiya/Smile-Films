import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Carousel from 'react-bootstrap/Carousel';
import { DataTable } from 'primereact/datatable';
import { useDispatch, useSelector } from 'react-redux';
import BlueChat from '../../../Assets/Images/blue_chat.png';
import GreenChat from '../../../Assets/Images/green_chat.png';
import TopRightBlue from '../../../Assets/Images/top-right-blue.svg';
import TopRightGreen from '../../../Assets/Images/top-right-green.svg';
import DeadlineIcon from '../../../Assets/Images/deadline-calender.svg';
import PayableCalender from '../../../Assets/Images/payable-calender.svg';
import ClientDashboardImg from '../../../Assets/Images/client_dashboard_img.png';
import {
  getCashFlowData,
  getDeletedHistory,
  manageDeletedHistory,
  setPaidPaymentData,
  setUpComingPaymentData,
} from 'Store/Reducers/ClientFlow/Dashboard/ClientDashboardSlice';
import moment from 'moment';
import CashFlow from './CashFlow';
import Loader from 'Components/Common/Loader';
import { getAuthToken } from 'Helper/AuthTokenHelper';
import { convertIntoNumber } from 'Helper/CommonHelper';
import { getPaymentDetailList } from 'Store/Reducers/ClientFlow/MyPay/MyPaySlice';
import { getProjectList } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const userData = getAuthToken();

  const [index, setIndex] = useState(0);

  const {
    clientDeletedHistory,
    clientManageHistoryLoading,
    paidPaymentData,
    upComingPaymentData,
  } = useSelector(({ clientDashboard }) => clientDashboard);
  const { clientProjectList } = useSelector(
    ({ clientProject }) => clientProject,
  );

  const getRequiredData = useCallback(() => {
    dispatch(getDeletedHistory());
    dispatch(getCashFlowData());
    dispatch(getPaymentDetailList({ start: 0, limit: 0, payment_status: [1] }))
      .then(res => {
        const UpComingPayment = res?.payload;
        return { UpComingPayment };
      })
      .then(({ UpComingPayment }) => {
        dispatch(
          getPaymentDetailList({ start: 0, limit: 0, payment_status: [3] }),
        ).then(response => {
          const paidPaymentData = response.payload;
          dispatch(setUpComingPaymentData(UpComingPayment));
          dispatch(setPaidPaymentData(paidPaymentData));
        });
      });
    dispatch(getProjectList({ start: 0, limit: 0 }));
  }, [dispatch]);

  useEffect(() => {
    getRequiredData();
  }, []);

  const handleSelect = selectedIndex => {
    setIndex(selectedIndex);
  };

  const handleKeepProject = useCallback(() => {
    const currentDeletedHistoryData = clientDeletedHistory?.list[index];

    const payload = {
      keep_project: true,
      order_id: currentDeletedHistoryData?._id,
    };

    dispatch(manageDeletedHistory(payload)).then(response => {
      const data = response?.payload;
      if (data) {
        dispatch(getDeletedHistory());
      }
    });
  }, [clientDeletedHistory, dispatch, index]);

  const handleConfirmDelete = useCallback(() => {
    const currentDeletedHistoryData = clientDeletedHistory?.list[index];

    const payload = {
      keep_project: false,
      order_id: currentDeletedHistoryData?._id,
    };

    dispatch(manageDeletedHistory(payload)).then(response => {
      const data = response?.payload;
      if (data) {
        dispatch(getDeletedHistory());
      }
    });
  }, [clientDeletedHistory, dispatch, index]);

  const createdDateTemplate = rowData => {
    return rowData?.invoice_date
      ? moment(rowData?.invoice_date).format('DD-MM-YYYY')
      : '-';
  };

  return (
    <>
      {clientManageHistoryLoading && <Loader />}
      <div className="main_Wrapper">
        <Row className="g-4 mb20">
          <Col lg={6}>
            <div className="client_dashbord_wrap">
              <Row className="justify-content-between h-100 align-items-center">
                <Col sm={7}>
                  <div className="dashboard_text">
                    <h2 className="mb-3">
                      {userData?.employee?.client_full_name}
                    </h2>
                    <h3>{userData?.employee?.company_name}</h3>
                  </div>
                </Col>
                <Col xl={4} lg={5} md={3} sm={4}>
                  <div className="client_dashbord_img text-end">
                    <img src={ClientDashboardImg} alt="ClientDashboardImg" />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={6}>
            <div className="delete_project_wrapper radius15">
              <h2>Give Confirmation For Delete Project </h2>
              <div className="delete_project_inner">
                <div className="client_delet_project">
                  {clientDeletedHistory?.list?.length && (
                    <>
                      <div className="client_delet_left">
                        <div className="slider_wrapper">
                          <Carousel
                            interval={null}
                            activeIndex={index}
                            onSelect={handleSelect}
                          >
                            {clientDeletedHistory?.list?.map(item => {
                              return (
                                <Carousel.Item>
                                  <Carousel.Caption>
                                    <div className="slider_inner_wrap">
                                      <ul>
                                        <li>
                                          <span>Order No :</span>
                                          <h4>
                                            {item?.inquiry_no
                                              ? item?.inquiry_no
                                              : '-'}
                                          </h4>
                                        </li>
                                        <li>
                                          <span>Couple Name :</span>
                                          <h4>
                                            {item?.couple_name
                                              ? item?.couple_name
                                              : '-'}
                                          </h4>
                                        </li>
                                        <li>
                                          <span>Data Size :</span>
                                          <h4>
                                            {item?.data_size
                                              ? `${convertIntoNumber(
                                                  item?.data_size,
                                                )} GB`
                                              : '-'}
                                          </h4>
                                        </li>
                                      </ul>
                                    </div>
                                  </Carousel.Caption>
                                </Carousel.Item>
                              );
                            })}
                          </Carousel>
                        </div>
                      </div>
                      <div className="client_delet_right">
                        <div className="delete_btn_wrap mt-0 p-0 text-end">
                          <Button
                            className="btn_border_dark"
                            onClick={handleKeepProject}
                          >
                            Keep Project
                          </Button>
                          <Button
                            className="btn_primary"
                            onClick={handleConfirmDelete}
                          >
                            Confirm Delete
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="g-4">
          <Col xl={9}>
            <Row className="g-3">
              <Col lg={4} sm={6}>
                <div className="working_box client_working_box p20 radius15 border">
                  <div className="working_box_title_wrap">
                    <div className="working_img">
                      <img src={DeadlineIcon} alt="DeadlineIcon" />
                    </div>
                    <div className="working_title d-flex justify-content-between">
                      <h4 className="m-0 fw_500">Due Payment</h4>
                      <h2 className="m-0">{`₹ ${
                        upComingPaymentData?.amount_due
                          ? upComingPaymentData?.amount_due
                          : 0
                      }`}</h2>
                    </div>
                  </div>
                  <div className="date_box radius15 py10 mt20">
                    <div className="working_box_chat">
                      <img src={BlueChat} alt="BlueChat" />
                    </div>
                    <h4 className="m-0 text_blue_color fw_400">
                      <span>
                        <img src={TopRightBlue} alt="" />
                      </span>
                      {upComingPaymentData?.totalRows
                        ? upComingPaymentData?.totalRows
                        : 0}{' '}
                      Invoice
                    </h4>
                  </div>
                </div>
              </Col>
              <Col lg={4} sm={6}>
                <div className="working_box client_working_box p20 radius15 border">
                  <div className="working_box_title_wrap">
                    <div className="working_img">
                      <img src={PayableCalender} alt="PayableCalender" />
                    </div>
                    <div className="working_title d-flex justify-content-between">
                      <h4 className="m-0 fw_500">Paid Payment</h4>
                      <h2 className="m-0">{`₹ ${
                        paidPaymentData?.amount_paid
                          ? paidPaymentData?.amount_paid
                          : 0
                      }`}</h2>
                    </div>
                  </div>
                  <div className="date_box radius15 py10 mt20">
                    <div className="working_box_chat">
                      <img src={GreenChat} alt="GreenChat" />
                    </div>
                    <h4 className="m-0 text_green_color fw_400">
                      <span>
                        <img src={TopRightGreen} alt="" />
                      </span>
                      {paidPaymentData?.totalRows
                        ? paidPaymentData?.totalRows
                        : 0}{' '}
                      Invoice
                    </h4>
                  </div>
                </div>
              </Col>
              {/* <Col lg={4}>
                <div className="working_box client_working_box p20 radius15 border mb20">
                  <div className="working_box_title_wrap">
                    <div className="working_img">
                      <img src={DeadlineIcon} alt="DeadlineIcon" />
                    </div>
                    <div className="working_title d-flex justify-content-between">
                      <h4 className="m-0 fw_500">Receivable</h4>
                      <h2 className="m-0">₹ 2,00,000</h2>
                    </div>
                  </div>
                  <div className="date_box radius15 py10 mt20">
                    <div className="working_box_chat">
                      <img src={BlueChat} alt="BlueChat" />
                    </div>
                    <h4 className="m-0 text_blue_color fw_400">
                      <span>
                        <img src={TopRightBlue} alt="" />
                      </span>
                      6 Invoice
                    </h4>
                  </div>
                </div>
              </Col> */}
              <Col lg={8}>
                <CashFlow />
              </Col>
              <Col lg={4}>
                <div className="table_main_Wrapper overflow-hidden">
                  <div className="top_filter_wrap">
                    <Row className="g-2">
                      <Col className="col-7">
                        <div className="page_title">
                          <h3 className="m-0">Upcoming Payment</h3>
                        </div>
                      </Col>
                      <Col className="col-5">
                        <div className="page_title">
                          <h2 className="m-0 text-end">{`₹ ${
                            upComingPaymentData?.amount_due
                              ? upComingPaymentData?.amount_due
                              : 0
                          }`}</h2>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="data_table_wrapper max_height overflow-hidden">
                    <DataTable
                      value={upComingPaymentData?.list || []}
                      sortField="price"
                      sortOrder={1}
                      rows={10}
                    >
                      <Column
                        field="invoice_no"
                        header="Order No"
                        sortable
                      ></Column>
                      <Column
                        field="invoice_date"
                        header="Created Date"
                        sortable
                        body={createdDateTemplate}
                      ></Column>
                      <Column
                        field="bill_amount"
                        header="Amount"
                        sortable
                      ></Column>
                    </DataTable>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xl={3}>
            <div className="activity_wrap bg-white radius15 overflow-hidden border h-100">
              <div className="activity_header py15 px20 border-bottom">
                <h3 className="m-0">Activity</h3>
              </div>
              {clientProjectList?.length &&
                clientProjectList?.map(item => {
                  return (
                    <div className="activity_inner">
                      <h5 className="m-0 fw_600 mb-2">
                        Project No. :{' '}
                        {item?.inquiry_no ? item?.inquiry_no : '-'}
                      </h5>
                      <div>
                        Couple Name :{' '}
                        {item?.couple_name ? item?.couple_name : '-'}
                      </div>
                      <div>
                        Data Size :{' '}
                        {item?.data_size
                          ? convertIntoNumber(item?.data_size)
                          : '-'}
                      </div>
                      <div>
                        Item Name : {item?.item_name ? item?.item_name : '-'}
                      </div>

                      <div className="d-flex justify-content-between gap-2">
                        {/* <h6 className="m-0 text_gray">Wednesday at 9:42 AM</h6> */}
                        <h6 className="m-0 text_gray">
                          {item?.create_date ? item?.create_date : ''}
                        </h6>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
