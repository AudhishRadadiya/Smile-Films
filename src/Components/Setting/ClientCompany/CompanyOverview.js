import React, { memo, useCallback, useEffect, useMemo } from 'react';
import Highcharts from 'highcharts';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import { thousandSeparator } from 'Helper/CommonHelper';
import DeleteIcon from '../../../Assets/Images/trash.svg';
import { getClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getCashFlowData } from 'Store/Reducers/ClientFlow/Dashboard/ClientDashboardSlice';

const CompanyOverview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedClientCompanyData } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { clientCashFlowData } = useSelector(
    ({ clientDashboard }) => clientDashboard,
  );

  const fetchRequiredData = useCallback(() => {
    dispatch(
      getClientCompany({
        client_company_id: id,
      }),
    );
    dispatch(getCashFlowData());
  }, [dispatch, id]);

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const calculateTotalIncome = useMemo(() => {
    const calculatedIncome = clientCashFlowData?.data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.amount,
      0,
    );

    return calculatedIncome;
  }, [clientCashFlowData]);

  const clientCompanyOverviewIncomeData = useMemo(() => {
    let clientCompanyIncomeData = [];

    if (clientCashFlowData?.data?.length > 0) {
      clientCompanyIncomeData = clientCashFlowData?.data?.map(item => {
        return item?.amount;
      });
    }

    const incomeChart = {
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
          text: 'Number of Income',
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
          data: clientCompanyIncomeData,
          color: '#373AA5',
          pointWidth: 10,
          name: 'Income',
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

    return incomeChart;
  }, [clientCashFlowData]);

  return (
    <div className="company_overview_wrap p20 p15-sm">
      <div className="company_box p20 radius15 mb20">
        <div className="company_box_title mb25 flex-wrap gap-3 d-flex justify-content-between align-items-center">
          <h2>{selectedClientCompanyData?.company_name}</h2>
          {/* <div className="title_right_wrapper">
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
          </div> */}
        </div>
        <div className="company_box_inner">
          <Row>
            <Col xl={4} md={6}>
              <ul>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Name</h5>
                  <h4>{selectedClientCompanyData?.client_full_name}</h4>
                </li>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Email</h5>
                  <h4>{selectedClientCompanyData?.email_id}</h4>
                </li>
                <li>
                  <h5 className="fw_400 text_grey mb5">Mobile</h5>
                  <h4>{selectedClientCompanyData?.mobile_no?.join(', ')}</h4>
                </li>
              </ul>
            </Col>
            <Col xl={4} md={6}>
              <ul>
                <li>
                  <h3 className="mt-3 mt-md-0">Billing Address</h3>
                  <p>{selectedClientCompanyData?.address}</p>
                </li>
              </ul>
            </Col>
            <Col xl={4} md={6}>
              <h3 className="mt-3 mt-lg-0 mb-lg-4 mb-2">Other Details</h3>
              <ul className="border-0">
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Default Currency</h5>
                  <h4>{selectedClientCompanyData?.currency || '-'}</h4>
                </li>
                <li className="mb20">
                  <h5 className="fw_400 text_grey mb5">Group Name</h5>
                  <h4>{selectedClientCompanyData?.group_name || '-'}</h4>
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
          {/*<div className="form_group date_select_wrapper text-end">
            <Calendar
              id=" ConsumptionDate"
              value={clientCompanyIncomeDate}
              placeholder="Select Date Range"
              showIcon
              selectionMode="range"
              dateFormat="dd-mm-yy"
              readOnlyInput
              showButtonBar
              onChange={e => {
                handleClientCompanyProfileDate(e);
              }}
            />
          </div>*/}
        </Col>
        <Col lg={6}>
          <div className="overview_chart mt30 mb40">
            <HighchartsReact
              highcharts={Highcharts}
              options={clientCompanyOverviewIncomeData}
            />
          </div>
          <h4>{`Total Income ( This Year ) - ₹${
            calculateTotalIncome ? calculateTotalIncome : 0
          }`}</h4>
        </Col>
      </Row>
    </div>
  );
};

export default memo(CompanyOverview);
