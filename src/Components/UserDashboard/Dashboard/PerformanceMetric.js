import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { thousandSeparator } from 'Helper/CommonHelper';

const PerformanceMetric = () => {
  const { userPerformanceReportData } = useSelector(
    ({ userDashboard }) => userDashboard,
  );

  const performanceReportOptionData = useMemo(() => {
    let performanceData = [];

    if (userPerformanceReportData?.data?.length > 0) {
      performanceData = userPerformanceReportData?.data?.map(item => {
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
        categories: userPerformanceReportData?.date || [],
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
          text: 'Performance Metrics',
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
          data: performanceData,
          color: '#55A9F8',
          pointWidth: 10,
          name: 'Performance',
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
  }, [userPerformanceReportData]);

  return (
    <>
      <Col xl={4} md={6}>
        <div className="chat-inner-wrap m-0 h-100">
          <div className="chat_header">
            <Row className="justify-content-between">
              <Col md={6}>
                <div className="chat_header_text">
                  <h4 className="mb-0">Performance Metrics</h4>
                </div>
              </Col>
              {/* <Col md={6}>
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
              options={performanceReportOptionData}
            />
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(PerformanceMetric);
