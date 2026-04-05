import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Col, Row, Table } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import EmailIcon from '../../../Assets/Images/email-icon.svg';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfitLossReportData,
  setProfitLossEndDate,
  setProfitLossStartDate,
} from 'Store/Reducers/Report/BusinessOverview/BusinessOverviewSlice';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { getChangeFinancialYearList } from 'Store/Reducers/Settings/Master/ChangeFinancialYearSlice';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import Loader from 'Components/Common/Loader';

const ReportTable = React.memo(({ title, groups, total, netProfit }) => {
  return (
    <Col
      md={6}
      xs={12}
      className="d-flex flex-column justify-content-between border border-[#808080] border-1"
    >
      <div>
        <div className="profit-income-title">
          <h5 className="m-0">{title}</h5>
        </div>

        {groups?.map((group, gIdx) => (
          <Table className="account_table" key={gIdx}>
            {/* <thead>
              <tr>
                <th colSpan={2}>{group?._id}</th>
              </tr>
            </thead> */}
            <tbody>
              {group.children?.map((child, cIdx) => (
                <React.Fragment key={cIdx}>
                  <tr>
                    <td></td>
                    <td className="fw-bold text-danger px-0">{child._id}</td>
                  </tr>
                  {child.payments?.map((data, idx) => (
                    <tr key={idx}>
                      <td className="col-3 text-end">{data?.amount}</td>
                      <td className="px-0">
                        <Link
                          to={`/account-history-reports/${data?.account_id}`}
                          className="hover_text"
                        >
                          {data?.account_name}
                        </Link>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="text-end fw-bold text-nowrap">
                      ₹ {child?.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        ))}
      </div>

      <div className="bg-white">
        <div className="profit_data d-flex justify-content-between">
          <h5 className="m-0">
            {title === 'Income' ? 'Gross Profit GP' : 'Net Profit NP'}
          </h5>
          <h5 className="m-0">
            ₹ {title === 'Income' ? total.toFixed(2) : netProfit}
          </h5>
        </div>
        <div className="table-bottom d-flex justify-content-end bg-white">
          <h5 className="m-0 fw-bold">
            <span className="pe-2">Total</span> ₹ {total.toFixed(2)}
          </h5>
        </div>
      </div>
    </Col>
  );
});

const ProfitAndLoss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    profitAndLossReportData,
    businessOverviewLoading,
    profitLossStartDate,
    profitLossEndDate,
  } = useSelector(({ businessOverviewReports }) => businessOverviewReports);

  const { changeYearList } = useSelector(
    ({ changeFinancialYear }) => changeFinancialYear,
  );

  const [financialYear, setFinancialYear] = useState('');
  const [startDateForm, setStartDateForm] = useState(null);
  const [endDateForm, setEndDateForm] = useState(null);

  const formattedDateRange = useMemo(() => {
    if (profitLossStartDate && profitLossEndDate) {
      return `${moment(profitLossStartDate).format('DD-MM-YYYY')} to ${moment(
        profitLossEndDate,
      ).format('DD-MM-YYYY')}`;
    }
    return moment().format('DD-MM-YYYY');
  }, [profitLossStartDate, profitLossEndDate]);

  const fetchRequiredData = useCallback(
    (startDate = '', endDate = '', financialYearId = financialYear) => {
      dispatch(
        getProfitLossReportData({
          start_date: startDate,
          end_date: endDate,
          financial_year_id: financialYearId,
        }),
      );
    },
    [dispatch, financialYear],
  );

  // const getChangeFinancialYearListApi = useCallback(
  //   (startDate = '', endDate = '') => {
  //     dispatch(getChangeFinancialYearList()).then(response => {
  //       const financialYearList = response?.payload?.data?.list || [];

  //       const selectedFinancialYear = financialYearList.find(
  //         item => item.default === true,
  //       )?._id;

  //       if (selectedFinancialYear) {
  //         setFinancialYear(selectedFinancialYear);
  //       }
  //       fetchRequiredData(startDate, endDate, selectedFinancialYear);
  //     });
  //   },
  //   [dispatch, fetchRequiredData],
  // );

  useEffect(() => {
    const startDate =
      profitLossStartDate && moment(profitLossStartDate).format('YYYY-MM-DD');
    const endDate =
      profitLossEndDate && moment(profitLossEndDate).format('YYYY-MM-DD');

    // getChangeFinancialYearListApi(startDate || '', endDate || '');

    fetchRequiredData(startDate, endDate, '');
  }, []);

  const handleDate = useCallback(
    (e, dateType) => {
      if (e?.value !== null) {
        if (dateType === 'start' && !profitLossEndDate) {
          // toast.error('Please select end date');
          return;
        }
        if (dateType === 'end' && !profitLossStartDate) {
          // toast.error('Please select start date');
          return;
        }

        fetchRequiredData(
          dateType === 'start'
            ? moment(e.value)?.format('YYYY-MM-DD')
            : profitLossStartDate,
          dateType === 'end'
            ? moment(e.value)?.format('YYYY-MM-DD')
            : profitLossEndDate,
          financialYear,
        );
      }
    },
    [profitLossEndDate, profitLossStartDate, fetchRequiredData, financialYear],
  );

  const handleClearDate = useCallback(() => {
    fetchRequiredData('', '', financialYear);
  }, [fetchRequiredData, financialYear]);

  const { income, expense } = profitAndLossReportData;

  const groupByGroupName = useCallback(data => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const map = new Map();

    for (const item of data) {
      if (!map.has(item.group_name)) {
        map.set(item.group_name, {
          _id: item.group_name,
          children: new Map(),
          totalAmount: 0,
        });
      }

      const group = map.get(item.group_name);

      if (!group.children.has(item.child_name)) {
        group.children.set(item.child_name, {
          _id: item.child_name,
          payments: [],
          totalAmount: 0,
        });
      }

      const child = group.children.get(item.child_name);

      child.payments.push({
        account_id: item.account_id,
        account_name: item.account_name,
        amount: item.totalAmount,
      });

      child.totalAmount += item.totalAmount;
      group.totalAmount += item.totalAmount;
    }

    return Array.from(map.values()).map(group => ({
      ...group,
      children: Array.from(group.children.values()),
    }));
  }, []);

  const PLIncome = useMemo(
    () => groupByGroupName(income),
    [income, groupByGroupName],
  );
  const PLExpense = useMemo(
    () => groupByGroupName(expense),
    [expense, groupByGroupName],
  );

  const totalIncome = useMemo(
    () => PLIncome?.reduce((sum, g) => sum + g.totalAmount, 0) ?? 0,
    [PLIncome],
  );

  const totalExpense = useMemo(
    () => PLExpense?.reduce((sum, g) => sum + g.totalAmount, 0) ?? 0,
    [PLExpense],
  );

  const netProfit = useMemo(
    () => (totalIncome - totalExpense).toFixed(2),
    [totalIncome, totalExpense],
  );

  const financialYearOptions = useMemo(() => {
    return (changeYearList?.list || []).map(item => {
      const startYear = new Date(item.start_date).getFullYear();
      const endYear = new Date(item.end_date).getFullYear();
      return {
        label: `${startYear} - ${endYear}`,
        value: item._id,
      };
    });
  }, [changeYearList]);

  const handleSelectFinancialYear = useCallback(
    data => {
      const startDate =
        profitLossStartDate && moment(profitLossStartDate).format('YYYY-MM-DD');
      const endDate =
        profitLossEndDate && moment(profitLossEndDate).format('YYYY-MM-DD');
      setFinancialYear(data);
      fetchRequiredData(startDate || '', endDate || '', data);
    },
    [profitLossEndDate, profitLossStartDate, fetchRequiredData],
  );

  return (
    <div className="main_Wrapper">
      {businessOverviewLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="back_page">
                <div className="btn_as_text d-flex align-items-center">
                  <Button
                    className="btn_transparent pe-3"
                    onClick={() => navigate('/reports')}
                  >
                    <img src={ArrowIcon} alt="ArrowIcon" />
                  </Button>
                  <div className="page_title d-flex align-items-center">
                    <h2 className="m-0 pe-2">Profit & Loss</h2>
                    <span>As of {formattedDateRange}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper">
                <ul className="expenses_ul">
                  <li>
                    <ReactSelectSingle
                      id="financial_year"
                      filter
                      value={financialYear}
                      options={financialYearOptions}
                      onChange={e => handleSelectFinancialYear(e.value)}
                      placeholder="Select Financial Year"
                    />
                  </li>
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id="profitLossStartDate"
                        value={startDateForm}
                        placeholder="Select Start Date"
                        showIcon
                        showButtonBar
                        dateFormat="dd-mm-yy"
                        onChange={e => {
                          setStartDateForm(e?.value);

                          dispatch(
                            setProfitLossStartDate(
                              e.value
                                ? moment(e.value)?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );

                          handleDate(e, 'start');
                        }}
                        onClearButtonClick={e => {
                          setStartDateForm('');
                          setEndDateForm('');
                          dispatch(setProfitLossStartDate(''));
                          dispatch(setProfitLossEndDate(''));
                          handleClearDate();
                        }}
                        readOnlyInput
                      />
                    </div>
                  </li>
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id="profitLossEndDate"
                        value={endDateForm}
                        placeholder="Select End Date"
                        showIcon
                        showButtonBar
                        dateFormat="dd-mm-yy"
                        disabled={!startDateForm}
                        minDate={startDateForm && new Date(startDateForm)}
                        onChange={e => {
                          setEndDateForm(e?.value);

                          dispatch(
                            setProfitLossEndDate(
                              e.value
                                ? moment(e.value)?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );

                          handleDate(e, 'end');
                        }}
                        readOnlyInput
                      />
                    </div>
                  </li>
                  <li>
                    <Button className="btn_border_dark filter_btn">
                      <img src={PdfIcon} alt="PdfIcon" /> Save As PDF
                    </Button>
                  </li>
                  <li>
                    <button className="btn_border_dark">
                      <img src={EmailIcon} alt="EmailIcon" /> Send Email
                    </button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <div className="table_profit_loss">
          <ReportTable
            title="Income"
            groups={PLIncome}
            total={totalIncome}
            netProfit={netProfit}
          />
          <ReportTable
            title="Expense"
            groups={PLExpense}
            total={totalExpense}
            netProfit={netProfit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
