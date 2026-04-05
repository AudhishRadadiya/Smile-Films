import React, { memo, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { thousandSeparator } from 'Helper/CommonHelper';

const CashFlow = () => {
  const { clientCashFlowData } = useSelector(
    ({ clientDashboard }) => clientDashboard,
  );

  const cashFlowOptionsData = useMemo(() => {
    let cashFlowData = [];

    if (clientCashFlowData?.data?.length > 0) {
      cashFlowData = clientCashFlowData?.data?.map(item => {
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
        categories: clientCashFlowData?.date || [],
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
          text: 'Cash',
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
          data: cashFlowData,
          color: '#373AA5',
          pointWidth: 10,
          name: 'Cash Flow',
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
            '<div> <br> <br>' +
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
  }, [clientCashFlowData]);

  return (
    <>
      <div className="chat-inner-wrap mb-0">
        <div className="chat_header">
          <Row className="justify-content-between">
            <Col sm={6} className="col-6">
              <div className="chat_header_text">
                <h3 className="mb-0">Cash Flow</h3>
              </div>
            </Col>
            {/* <Col sm={4} className="col-6">
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
            options={cashFlowOptionsData}
          />
        </div>
      </div>
    </>
  );
};

export default memo(CashFlow);
