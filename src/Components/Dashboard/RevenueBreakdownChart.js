import moment from 'moment';
import Highcharts from 'highcharts';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { useDispatch, useSelector } from 'react-redux';
import { convertIntoNumber } from 'Helper/CommonHelper';
import HighchartsReact from 'highcharts-react-official';
import React, { memo, useCallback, useMemo } from 'react';
import variablePie from 'highcharts/modules/variable-pie.js';
import {
  getDashboardProjectTypeData,
  setRevenueBreakdownDate,
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

const RevenueBreakdownChart = () => {
  const dispatch = useDispatch();

  const { revenueBreakdownDate, dashboardProjectTypeData } = useSelector(
    ({ adminDashboard }) => adminDashboard,
  );

  const handleColorCode = useMemo(() => {
    const colors = [];
    if (dashboardProjectTypeData?.length) {
      for (let i = 0; i < dashboardProjectTypeData?.length; i++) {
        const colorIndex = i % color_code?.length;
        colors.push(color_code[colorIndex]);
      }
    }
    return colors;
  }, [dashboardProjectTypeData]);

  const revenueBreakdownChartOptionData = useMemo(() => {
    const amount = dashboardProjectTypeData?.map((item, i) => ({
      name: '',
      item_name: item?._id === 1 ? 'Editing' : 'Exposing',
      y: item?.count,
      item_value: convertIntoNumber(item?.calculated_percentage),
      color: handleColorCode[i],
    }));

    // const roundoptions = {
    //   chart: {
    //     type: 'variablepie',
    //   },
    //   title: {
    //     text: '',
    //     floating: false,
    //   },

    //   credits: {
    //     enabled: false,
    //   },
    //   series: [
    //     {
    //       size: '100%',
    //       innerSize: '0%',
    //       innerRadius: '90%',
    //       borderWidth: 2,
    //       borderColor: 'white',
    //       // data: [1, 2],
    //       data: amount || [],
    //       // colors: ['#8E7AF6', '#FEBD38'],
    //       colors: handleColorCode,
    //       dataLabels: {
    //         enabled: false,
    //       },
    //     },
    //   ],
    // };

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
          //   data: [1, 2],
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
      },
    };

    return options;
  }, [dashboardProjectTypeData, handleColorCode]);

  const handleRevenueBreakdownDate = useCallback(
    e => {
      const checkDate = e.value === null;
      dispatch(setRevenueBreakdownDate(e.value));

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
          getDashboardProjectTypeData({
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
                  <h3 className="mb-0">Revenue breakdown by</h3>
                </div>
              </Col>
              <Col sm={5}>
                <div className="date_select text-end">
                  {/* <Calendar
                    id=" ConsumptionDate"
                    value={date}
                    placeholder="Date Range"
                    showIcon
                    selectionMode="range"
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    onChange={e => setDate(e.value)}
                  /> */}
                  <Calendar
                    id="RevenueBreakdownDate"
                    value={revenueBreakdownDate}
                    placeholder="Select Date"
                    selectionMode="range"
                    dateFormat="dd-mm-yy"
                    onChange={e => {
                      handleRevenueBreakdownDate(e);
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
            <div className="pie_chart_inner">
              {dashboardProjectTypeData?.length ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={revenueBreakdownChartOptionData}
                />
              ) : (
                <span className="justify-content-end d-flex">
                  No Data Found
                </span>
              )}
            </div>
            <div className="pie_chart_value">
              <ul>
                {dashboardProjectTypeData?.map((item, i) => {
                  // const totalCountValue = dashboardProjectTypeData?.reduce(
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
                      <h3>{item?._id === 1 ? 'Editing' : 'Exposing'}</h3>
                    </li>
                  );
                })}
                {/* <li className="yellow_text">
                        <span>40%</span>
                        <h3>Photography</h3>
                      </li>
                      <li className="purple_text">
                        <span>60%</span>
                        <h3>Video editing</h3>
                      </li> */}
              </ul>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(RevenueBreakdownChart);
