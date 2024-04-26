import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DataTable } from 'primereact/datatable';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import OrderRightImg from '../../Assets/Images/order-right-img.png';
import Highcharts from 'highcharts';
import RevenueIcon from '../../Assets/Images/revenue-icon.svg';
import ReceivedIcon from '../../Assets/Images/received-icon.svg';
import OrdersIcon from '../../Assets/Images/orders-icon.svg';
import CompletedOrdersIcon from '../../Assets/Images/completed-orders-icon.svg';
import UserImg from '../../Assets/Images/user-img.jpg';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';
variablePie(Highcharts);

export const QuotationData = [
  {
    id: '#54261',
    position: 'Photography',
    project_assignees: '100',
    project_pending: '50',
    project_completed: '50',
    next_due_date: '14/07/2023',
  },
  {
    id: '#54261',
    position: 'Photography',
    project_assignees: '100',
    project_pending: '50',
    project_completed: '50',
    next_due_date: '14/07/2023',
  },
  {
    id: '#54261',
    position: 'Photography',
    project_assignees: '100',
    project_pending: '50',
    project_completed: '50',
    next_due_date: '14/07/2023',
  },
  {
    id: '#54261',
    position: 'Photography',
    project_assignees: '100',
    project_pending: '50',
    project_completed: '50',
    next_due_date: '14/07/2023',
  },
  {
    id: '#54261',
    position: 'Photography',
    project_assignees: '100',
    project_pending: '50',
    project_completed: '50',
    next_due_date: '14/07/2023',
  },
];

export default function Dashboard() {
  const [date, setDate] = useState();

  const NewSalesOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [
        'Progress',
        'Pending',
        'Completed',
        'Delayed',
        'Delivered',
        'Rework',
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
        text: 'Number of Orders',
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
        data: [171533, 165174, 155157, 161454, 154610, 15020],
        color: '#FE8D3D',
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
        text: 'Number of Orders',
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

  const roundoptions = {
    chart: {
      type: 'variablepie',
    },
    title: {
      text: '',
      floating: false,
    },

    credits: {
      enabled: false,
    },
    series: [
      {
        size: '100%',
        innerSize: '0%',
        innerRadius: '90%',
        borderWidth: 2,
        borderColor: 'white',
        data: [1, 2],
        colors: ['#8E7AF6', '#FEBD38'],
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  const roundtooptions = {
    chart: {
      type: 'variablepie',
    },
    title: {
      text: '',
      floating: false,
    },

    credits: {
      enabled: false,
    },
    series: [
      {
        size: '100%',
        innerSize: '0%',
        innerRadius: '90%',
        borderWidth: 2,
        borderColor: 'white',
        data: [1, 2],
        colors: ['#3AABFF', '#C6CFFD '],
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  const ConfectionTemplet = () => {
    return (
      <div className="employee_name">
        <img src={UserImg} alt="userimg" />
        <h5>Samantha Deo</h5>
      </div>
    );
  };

  return (
    <div className="main_Wrapper">
      <Row className="g-3">
        <Col xxl={9}>
          <div className="order-list-wrapper mb20">
            <Row>
              <Col lg={10}>
                <div className="order-left-box">
                  <Row className="gy-4">
                    <Col md={3} className="col-6">
                      <div className="order-details-text text-center orange_text">
                        <h2 className="mb-0">₹ 5,00,000</h2>
                        <img src={RevenueIcon} alt="" />
                        <h4 className="fw_500">Total revenue generated</h4>
                        <h6 className="mb-0">Jan, 2023</h6>
                      </div>
                    </Col>
                    <Col md={3} className="col-6">
                      <div className="order-details-text text-center purpul_text">
                        <h2 className="mb-0">5000</h2>
                        <img src={ReceivedIcon} alt="" />
                        <h4 className="fw_500">Total inquiries received</h4>
                        <h6 className="mb-0">Jan, 2023</h6>
                      </div>
                    </Col>
                    <Col md={3} className="col-6">
                      <div className="order-details-text text-center light_orange_text">
                        <h2 className="mb-0">2000</h2>
                        <img src={OrdersIcon} alt="" />
                        <h4 className="fw_500">Total active Orders</h4>
                        <h6 className="mb-0">Jan, 2023</h6>
                      </div>
                    </Col>
                    <Col md={3} className="col-6">
                      <div className="order-details-text text-center yellow_text">
                        <h2 className="mb-0">6000</h2>
                        <img src={CompletedOrdersIcon} alt="" />
                        <h4 className="fw_500">Total completed Orders</h4>
                        <h6 className="mb-0">Jan, 2023</h6>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={2}>
                <div className="order-right-img">
                  <img src={OrderRightImg} alt="" />
                </div>
              </Col>
            </Row>
          </div>
          <div className="chat_wrapper">
            <Row className="g-3">
              <Col lg={5}>
                <div className="chat-inner-wrap">
                  <div className="chat_header">
                    <Row className="g-2">
                      <Col sm={6}>
                        <div className="chat_header_text">
                          <h3 className="mb-0">Order Status</h3>
                        </div>
                      </Col>
                      <Col sm={6}>
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
                      options={NewSalesOptions}
                    />
                  </div>
                </div>
              </Col>
              <Col lg={7}>
                <div className="chat-inner-wrap">
                  <div className="chat_header">
                    <Row className="justify-content-between g-2">
                      <Col sm={6}>
                        <div className="chat_header_text">
                          <h3 className="mb-0">Total Revenue</h3>
                        </div>
                      </Col>
                      <Col sm={4}>
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
            </Row>
          </div>
          <div className="table_main_Wrapper h-auto overflow-hidden">
            <div className="top_filter_wrap">
              <Row className="justify-content-between g-2 align-items-center">
                <Col sm={6}>
                  <div className="page_title">
                    <h3 className="m-0">Team Performance</h3>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="table_top_wrap">
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search Employee here"
                        type="search"
                        className="input_wrap small search_wrap"
                      />
                    </div>
                    <div className="date_select text-end ms-3">
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
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper max_height Exposing_table">
              <DataTable
                value={QuotationData}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="employee_name"
                  header="Employee name"
                  sortable
                  body={ConfectionTemplet}
                ></Column>
                <Column field="id" header="ID" sortable></Column>
                <Column field="position" header="Position" sortable></Column>
                <Column
                  field="project_assignees"
                  header="Project Assignees"
                  sortable
                ></Column>
                <Column
                  field="project_pending"
                  header="Project Pending"
                  sortable
                ></Column>
                <Column
                  field="project_completed"
                  header="Project  Completed"
                  sortable
                ></Column>
                <Column
                  field="next_due_date"
                  header="Next Due Date"
                  sortable
                ></Column>
              </DataTable>
            </div>
          </div>
        </Col>
        <Col xxl={3}>
          <Row>
            <Col xxl={12} md={6}>
              <div className="chat-inner-wrap">
                <div className="chat_header">
                  <Row className="g-2">
                    <Col sm={7}>
                      <div className="chat_header_text">
                        <h3 className="mb-0">Revenue breakdown by</h3>
                      </div>
                    </Col>
                    <Col sm={5}>
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
                <div className="chat_box piechart_wrapper">
                  <div className="pie_chart_inner">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={roundoptions}
                    />
                  </div>
                  <div className="pie_chart_value">
                    <ul>
                      <li className="yellow_text">
                        <span>40%</span>
                        <h3>Photography</h3>
                      </li>
                      <li className="purple_text">
                        <span>60%</span>
                        <h3>Video editing</h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
            <Col xxl={12} md={6}>
              <div className="chat-inner-wrap">
                <div className="chat_header">
                  <Row className="g-2">
                    <Col sm={7}>
                      <div className="chat_header_text">
                        <h3 className="mb-0">Revenue breakdown by</h3>
                      </div>
                    </Col>
                    <Col sm={5}>
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
                <div className="chat_box piechart_wrapper">
                  <div className="pie_chart_value order-1 order-sm-0">
                    <ul>
                      <li className="blue_text">
                        <span>70%</span>
                        <h3>Reference</h3>
                      </li>
                      <li className="light_purple_text">
                        <span>30%</span>
                        <h3>Direct</h3>
                      </li>
                    </ul>
                  </div>
                  <div className="pie_chart_inner">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={roundtooptions}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col xxl={12} md={6}>
              <div className="chat-inner-wrap mb-0 storage_back overflow-hidden">
                <div className="chat_header">
                  <div className="chat_header_text">
                    <h3 className="mb-0">Storage</h3>
                  </div>
                </div>
                <div className="chat_box">
                  <div className="storge_details">
                    <p className="mb-2 text-black">
                      Order no <span className="text_blue_dark">#51238</span>{' '}
                      have no activity seems 10 months, Do you want to Delete
                      this Orders Data ?
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
                </div>
                <div className="chat_box">
                  <div className="storge_details">
                    <p className="mb-2 text-black">
                      Order no <span className="text_blue">#51238</span> have no
                      activity seems 10 months, Do you want to Delete this
                      Orders Data ?
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
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
