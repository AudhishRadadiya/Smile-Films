import React, { useState } from 'react';

import { Button, Col, Row } from 'react-bootstrap';
import DeleteIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { Calendar } from 'primereact/calendar';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

export default function CompanyOverview() {
  const [dates, setDates] = useState(null);

  const incomeChart = {
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

  return (
    <div className="company_overview_wrap p20 p15-sm">
      <div className="company_box p20 radius15 mb20">
        <div className="company_box_title mb25 flex-wrap gap-3 d-flex justify-content-between align-items-center">
          <h2>ABC Company</h2>
          <div className="title_right_wrapper">
            <ul>
              <li>
                <Button className="btn_border_dark">
                  <img src={DeleteIcon} alt="DeleteIcon" />
                  Delete
                </Button>
              </li>
              <li>
                <Button className="btn_primary">
                  <img src={EditIcon} alt="EditIcon" />
                  Edit
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="company_box_inner">
          <Row>
            <Col xl={4} md={6}>
              <ul>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Name</h5>
                  <h4>Mr. Kapil Kachhadiya</h4>
                </li>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Email</h5>
                  <h4>ankitparsurampuria@gmail.com</h4>
                </li>
                <li>
                  <h5 className="fw_400 text_grey mb5">Mobile</h5>
                  <h4>9013537809</h4>
                </li>
              </ul>
            </Col>
            <Col xl={4} md={6}>
              <ul>
                <li>
                  <h3 className="mt-3 mt-md-0">Billing Address</h3>
                  <p>
                    406 Dhara arcade, Near Mahadev Chowk Mota Varacha
                    Surat,Gujrat, 394101
                  </p>
                </li>
              </ul>
            </Col>
            <Col xl={4} md={6}>
              <h3 className="mt-3 mt-lg-0 mb-lg-4 mb-2">Other Details</h3>
              <ul className="border-0">
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Default Currency</h5>
                  <h4>INR</h4>
                </li>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Group Name</h5>
                  <h4>Trading General</h4>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>
      <Row>
        <Col lg={6}>
          <h4>Income</h4>
        </Col>
        <Col lg={6}>
          <div className="form_group date_select_wrapper text-end">
            <Calendar
              id="Creat Date"
              placeholder="Select Date"
              showIcon
              dateFormat="dd-mm-yy"
              readOnlyInput
              selectionMode="range"
              onChange={e => setDates(e.value)}
              className="w-auto"
            />
          </div>
        </Col>
        <Col lg={6}>
          <div className="overview_chart mt30 mb40">
            <HighchartsReact highcharts={Highcharts} options={incomeChart} />
          </div>
          <h4>Total Income ( This Year ) - ₹1,10,000.00</h4>
        </Col>
      </Row>
    </div>
  );
}
