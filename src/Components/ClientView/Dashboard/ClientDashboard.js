import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import Carousel from 'react-bootstrap/Carousel';
import ClientDashboardImg from '../../../Assets/Images/client_dashboard_img.png';
import DeadlineIcon from '../../../Assets/Images/deadline-calender.svg';
import TopRightBlue from '../../../Assets/Images/top-right-blue.svg';
import TopRightGreen from '../../../Assets/Images/top-right-green.svg';
import PayableCalender from '../../../Assets/Images/payable-calender.svg';
import BlueChat from '../../../Assets/Images/blue_chat.png';
import GreenChat from '../../../Assets/Images/green_chat.png';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const QuotationData = [
  {
    order_no: '#54261',
    due_date: '10/06/2023',
    amount: '₹ 2,00,000',
  },
  {
    order_no: '#54261',
    due_date: '10/06/2023',
    amount: '₹ 2,50,000',
  },
  {
    order_no: '#54261',
    due_date: '10/06/2023',
    amount: '₹ 1,40,000',
  },
];

export default function ClientDashboard() {
  const [date, setDate] = useState();

  const Revenuechat = {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: false,
      labels: {
        style: {
          color: '#7B7B7B',
        },
      },
      lineColor: '#D7D7D7',
      lineWidth: 1,
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610, 15020,
        ],
        color: '#373AA5',
        pointWidth: 10,
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
        },
      ],
    },
  };

  return (
    <div className="main_Wrapper">
      <Row className="g-4 mb20">
        <Col lg={6}>
          <div className="client_dashbord_wrap">
            <Row className="justify-content-between h-100 align-items-center">
              <Col sm={7}>
                <div className="dashboard_text">
                  <h2 className="mb-3">Hello, Chirag Sondagar</h2>
                  <h3>Smile Films</h3>
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
                <div className="client_delet_left">
                  <div className="slider_wrapper">
                    <Carousel interval={null}>
                      <Carousel.Item>
                        <Carousel.Caption>
                          <div className="slider_inner_wrap">
                            <ul>
                              <li>
                                <span>Order No :</span>
                                <h4>#56123</h4>
                              </li>
                              <li>
                                <span>Couple Name :</span>
                                <h4>Kapil & Krupa</h4>
                              </li>
                              <li>
                                <span>Data Size :</span>
                                <h4>280 GB</h4>
                              </li>
                            </ul>
                          </div>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <Carousel.Caption>
                          <div className="slider_inner_wrap">
                            <ul>
                              <li>
                                <span>Order No :</span>
                                <h4>#56123</h4>
                              </li>
                              <li>
                                <span>Couple Name :</span>
                                <h4>Kapil & Krupa</h4>
                              </li>
                              <li>
                                <span>Data Size :</span>
                                <h4>280 GB</h4>
                              </li>
                            </ul>
                          </div>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <Carousel.Caption>
                          <div className="slider_inner_wrap">
                            <ul>
                              <li>
                                <span>Order No :</span>
                                <h4>#56123</h4>
                              </li>
                              <li>
                                <span>Couple Name :</span>
                                <h4>Kapil & Krupa</h4>
                              </li>
                              <li>
                                <span>Data Size :</span>
                                <h4>280 GB</h4>
                              </li>
                            </ul>
                          </div>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </div>
                </div>
                <div className="client_delet_right">
                  <div className="delete_btn_wrap mt-0 p-0 text-end">
                    <Button className="btn_border_dark">Keep Project</Button>
                    <Button className="btn_primary">Confirm Delete</Button>
                  </div>
                </div>
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
                    <h2 className="m-0">₹ 50,000</h2>
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
                    3 Invoice
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
                    <h4 className="m-0 fw_500">Payable</h4>
                    <h2 className="m-0">₹ 1,50,000</h2>
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
                    5 Invoice
                  </h4>
                </div>
              </div>
            </Col>
            <Col lg={4}>
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
            </Col>
            <Col lg={8}>
              <div className="chat-inner-wrap mb-0">
                <div className="chat_header">
                  <Row className="justify-content-between">
                    <Col sm={6} className="col-6">
                      <div className="chat_header_text">
                        <h3 className="mb-0">Cash Flow</h3>
                      </div>
                    </Col>
                    <Col sm={4} className="col-6">
                      <div className="date_select text-end">
                        <Calendar
                          id=" ConsumptionDate"
                          value={date}
                          placeholder="Date Range"
                          showIcon
                          selectionMode="range"
                          dateFormat="dd-mm-yy"
                          readOnlyInput
                          onChange={e => setDate(e.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="chat_box">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={Revenuechat}
                  />
                </div>
              </div>
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
                        <h2 className="m-0 text-end">₹ 5,90,000</h2>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="data_table_wrapper max_height overflow-hidden">
                  <DataTable
                    value={QuotationData}
                    sortField="price"
                    sortOrder={1}
                    rows={10}
                  >
                    <Column
                      field="order_no"
                      header="Order No"
                      sortable
                    ></Column>
                    <Column
                      field="due_date"
                      header="Due Date"
                      sortable
                    ></Column>
                    <Column field="amount" header="Amount" sortable></Column>
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
            <div className="activity_inner">
              <h5 className="m-0 fw_600">Project No. #56894</h5>
              <p>
                Couple Name : Kapil & Krupa, You Receive Quotation Updates
                Please check and take necessary Action.
              </p>
              <div className="d-flex justify-content-between gap-2">
                <h6 className="m-0 text_gray">Wednesday at 9:42 AM</h6>
                <h6 className="m-0 text_gray">Jun 05, 2024</h6>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
