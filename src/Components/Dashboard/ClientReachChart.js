import React, { memo, useCallback, useMemo } from 'react';
import moment from 'moment';
import Highcharts from 'highcharts';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import variablePie from 'highcharts/modules/variable-pie.js';
import { convertIntoNumber, thousandSeparator } from 'Helper/CommonHelper';
import {
  getDashboardClientChartData,
  setClientReachDate,
} from 'Store/Reducers/Dashboard/AdminDashboardSlice';

variablePie(Highcharts);

const color_code = [
  '#FBCF4F',
  '#C1AFE8',
  '#ED701E',
  '#0094FF',
  '#A8E9FF',
  '#58f2b0',
  '#dfa8f1',
  '#9492ff',
  '#322972',
  '#29725C',
  '#FF5C5C',
  '#8E5FF5',
  '#F5B85B',
  '#1EB4B2',
  '#DCDCDC',
];

const ClientReachChart = () => {
  const dispatch = useDispatch();

  const { clientReachDate, dashboardClientChartData } = useSelector(
    ({ adminDashboard }) => adminDashboard,
  );

  const handleColorCode = useMemo(() => {
    const colors = [];
    if (dashboardClientChartData?.length) {
      for (let i = 0; i < dashboardClientChartData?.length; i++) {
        const colorIndex = i % color_code?.length;
        colors.push(color_code[colorIndex]);
      }
    }
    return colors;
  }, [dashboardClientChartData]);

  const clientChartOptionData = useMemo(() => {
    const amount = dashboardClientChartData?.map((item, i) => ({
      name: '',
      item_name: item?._id,
      y: item?.count,
      item_value: convertIntoNumber(item?.calculated_percentage),
      color: handleColorCode[i],
    }));

    const options = {
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
          data: amount || [],
          //   colors: ['#3AABFF', '#C6CFFD '],
          colors: handleColorCode,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b>{point.item_name}</b>: {point.item_value}%',
        // formatter: function () {
        //   // return `${this.point.name} value: ${this.point.y}`;
        // },
      },
    };

    return options;
  }, [dashboardClientChartData, handleColorCode]);

  const handleClientReachDate = useCallback(
    e => {
      const checkDate = e.value === null;
      dispatch(setClientReachDate(e.value));

      const startDate =
        e.value?.length && e.value[0]
          ? moment(e.value[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        e.value?.length && e.value[1]
          ? moment(e.value[1])?.format('YYYY-MM-DD')
          : '';

      if (checkDate || (startDate && endDate)) {
        dispatch(
          getDashboardClientChartData({
            start_date: checkDate ? '' : startDate,
            end_date: checkDate ? '' : endDate,
          }),
        );
      }
    },
    [dispatch],
  );

  return (
    <>
      <Col xxl={12} md={6}>
        <div className="chat-inner-wrap">
          <div className="chat_header">
            <Row className="g-2">
              <Col sm={7}>
                <div className="chat_header_text">
                  <h3 className="mb-0">Client Reach by</h3>
                </div>
              </Col>
              <Col sm={5}>
                <div className="date_select text-end">
                  <Calendar
                    id="ClientReachDate"
                    value={clientReachDate}
                    placeholder="Select Date"
                    selectionMode="range"
                    dateFormat="dd-mm-yy"
                    onChange={e => {
                      handleClientReachDate(e);
                    }}
                    readOnlyInput
                    showButtonBar
                    showIcon
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="chat_box piechart_wrapper">
            <div className="pie_chart_value order-1 order-sm-0">
              <ul>
                {dashboardClientChartData?.map((item, i) => {
                  // const totalCountValue = dashboardClientChartData?.reduce(
                  //   (acc, cur) => {
                  //     return acc + cur?.count;
                  //   },
                  //   0,
                  // );

                  // const itemPercentage = (item?.count / totalCountValue) * 100;
                  return (
                    <li>
                      <span style={{ color: color_code[i] }}>{`${
                        item?.calculated_percentage
                          ? convertIntoNumber(item?.calculated_percentage)
                          : 0
                      } %`}</span>
                      <h3>{item?._id}</h3>
                    </li>
                  );
                })}
                {/* <li className="blue_text">
                  <span>70%</span>
                  <h3>Reference</h3>
                </li>
                <li className="light_purple_text">
                  <span>30%</span>
                  <h3>Direct</h3>
                </li> */}
              </ul>
            </div>
            <div className="pie_chart_inner">
              {dashboardClientChartData?.length ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={clientChartOptionData}
                />
              ) : (
                <span className="justify-content-start d-flex">
                  No Data Found
                </span>
              )}
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(ClientReachChart);
