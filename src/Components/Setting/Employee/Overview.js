import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Calendar } from 'primereact/calendar';
import ProfileImg from '../../../Assets/Images/add-user.svg';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  getEmployee,
  getEmployeeCommission,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';
import Loader from 'Components/Common/Loader';
import { useParams } from 'react-router-dom';

export default function Overview() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    selectedEmployeeData,
    employeeLoading,
    getEmployeeCommissionData,
    getEmployeeCommissionLoading,
  } = useSelector(({ employee }) => employee);

  useEffect(() => {
    dispatch(getEmployee({ employee_id: id }))
      .then(res => {
        const empID = res?.payload?._id;
        dispatch(
          getEmployeeCommission({
            employee_id: empID,
          }),
        );
      })
      .catch(err => {
        console.error('Error in Fetching Profile Details');
      });
  }, []);

  const empTotalIncome = getEmployeeCommissionData?.data?.reduce(
    (total, item) => {
      return total + (item?.amount || 0);
    },
    0,
  );

  const incomeChart = {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: getEmployeeCommissionData?.date || [],
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
        data: getEmployeeCommissionData?.data?.map(item => item?.amount),
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
    <div className="overview_wrap p20">
      {(employeeLoading || getEmployeeCommissionLoading) && <Loader />}
      <div className="overview_profile_wrap p20 border radius15 mb25">
        <div className="profile_left">
          {selectedEmployeeData?.image ? (
            <img
              src={selectedEmployeeData?.image || ProfileImg}
              alt=""
              className="user_img"
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                fontSize: 'xxx-large',
                width: '100%',
                height: '100%',
              }}
            >
              {selectedEmployeeData?.first_name ||
              selectedEmployeeData?.last_name
                ? `${
                    selectedEmployeeData?.first_name.charAt(0).toUpperCase() ||
                    ''
                  }${
                    selectedEmployeeData?.last_name.charAt(0).toUpperCase() ||
                    ''
                  }`
                : 'UN'}
            </div>
          )}
        </div>
        <div className="profile_right">
          <h3 className="mb30 mb10-md mt-3 mt-sm-0">
            {selectedEmployeeData?.first_name || selectedEmployeeData?.last_name
              ? `${selectedEmployeeData?.first_name || ''} ${
                  selectedEmployeeData?.last_name || ''
                }`
              : '-'}
          </h3>
          <ul className="d-flex flex-wrap">
            <li>
              <h5>Location</h5>
              <h4>{selectedEmployeeData?.current_address || '-'}</h4>
            </li>
            <li>
              <h5>Email</h5>
              <h4>{selectedEmployeeData?.email_id || '-'}</h4>
            </li>
            <li>
              <h5>Mobile</h5>
              <h4>{selectedEmployeeData?.mobile_no || '-'}</h4>
            </li>
          </ul>
          <hr className="my5" />
          <ul className="d-flex flex-wrap">
            <li>
              <h5>Role</h5>
              <h4>{selectedEmployeeData?.role_name || '-'}</h4>
            </li>
            <li>
              <h5>Business Unit</h5>
              <h4>{selectedEmployeeData?.business_unit || '-'}</h4>
            </li>
            <li>
              <h5>Emp No</h5>
              <h4>{selectedEmployeeData?.emp_no || '-'}</h4>
            </li>
            <li>
              <h5>Joining Date</h5>
              <h4>
                {selectedEmployeeData?.joining_date
                  ? moment(selectedEmployeeData?.joining_date)?.format(
                      'DD-MM-YYYY',
                    )
                  : ''}
              </h4>
            </li>
          </ul>
        </div>
      </div>
      <Row>
        <Col lg={6}>
          <h4>Income</h4>
        </Col>
        <Col lg={6}>
          <div className="form_group date_select_wrapper text-end">
            {/* <Calendar
              id="Creat Date"
              placeholder="Select Date"
              showIcon
              dateFormat="dd-mm-yy"
              readOnlyInput
              selectionMode="range"
              onChange={e => setDates(e.value)}
              className="w-auto"
            /> */}
          </div>
        </Col>
        <Col lg={6}>
          <div className="overview_chart mt30 mb40">
            <HighchartsReact highcharts={Highcharts} options={incomeChart} />
          </div>
          <h4>Total Income ( This Year ) - ₹{empTotalIncome}</h4>
        </Col>
      </Row>
    </div>
  );
}
