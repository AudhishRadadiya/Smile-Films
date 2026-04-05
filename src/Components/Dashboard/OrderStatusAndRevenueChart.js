import React, { memo, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';
import { useSelector } from 'react-redux';
import { thousandSeparator } from 'Helper/CommonHelper';

variablePie(Highcharts);

const OrderStatusAndRevenueChart = () => {
  const { dashboardOrderStatusData, dashboardRevenueData } = useSelector(
    ({ adminDashboard }) => adminDashboard,
  );

  const salesOptionsData = useMemo(() => {
    let salesSatatusData = [];

    if (dashboardOrderStatusData?.length > 0) {
      salesSatatusData = dashboardOrderStatusData?.map(category => {
        return category?.count;
      });
    }

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: [
          'Initial',
          'Library Done',
          'IN Progress',
          'IN Checking',
          'Exporting',
          'Completed',
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
          text: 'Order Status',
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
          // data: [171533, 165174, 155157, 161454, 154610, 15020],
          data: salesSatatusData,
          color: '#FE8D3D',
          pointWidth: 10,
        },
      ],

      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.x +
            '</b>: ' +
            thousandSeparator(this.y) +
            '</div>'
          );
        },
      },

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

    return options;
  }, [dashboardOrderStatusData]);

  const revenueOptionsData = useMemo(() => {
    let revenueData = [];

    if (dashboardRevenueData?.data?.length > 0) {
      revenueData = dashboardRevenueData?.data?.map(item => {
        return item?.amount;
      });
    }

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: dashboardRevenueData?.date || [],
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
          text: 'Total Revenue',
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
          data: revenueData,
          color: '#373AA5',
          pointWidth: 10,
          name: 'Revenue',
        },
      ],
      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span class="tooltip-x">' +
            this.x +
            '</span>' +
            '</div>' +
            '<div> <br>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.series.name +
            '</b>:' +
            thousandSeparator(this.y) +
            '</div>'
          );
        },
      },
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

    return options;
  }, [dashboardRevenueData]);

  return (
    <>
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
                  {/* <Col sm={6}>
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
                  </Col> */}
                </Row>
              </div>
              <div className="chat_box">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={salesOptionsData}
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
                  {/* <Col sm={4}>
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
                  </Col> */}
                </Row>
              </div>
              <div className="chat_box">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={revenueOptionsData}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default memo(OrderStatusAndRevenueChart);
