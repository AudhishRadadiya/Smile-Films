import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Column } from 'primereact/column';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import {
  getLedgerData,
  setLedgerCurrentPage,
  setLedgerDate,
  setLedgerEndDate,
  setLedgerFinancialYearId,
  setLedgerSearchParam,
  setLedgerStartDate,
} from 'Store/Reducers/Report/Ledger/LedgerSlice';
import { getChangeFinancialYearList } from 'Store/Reducers/Settings/Master/ChangeFinancialYearSlice';
import { useParams } from 'react-router-dom';
import { ColumnGroup } from 'primereact/columngroup';
import { convertIntoNumber } from 'Helper/CommonHelper';

const AccountHistoryReports = () => {
  const dispatch = useDispatch();
  const { id: paramAccountID } = useParams();

  const {
    ledgerData,
    ledgerDate,
    ledgerEndDate,
    ledgerPageLimit,
    ledgerStartDate,
    ledgerCurrentPage,
    ledgerSearchParam,
    ledgerDataLoading,
    ledgerFinancialYearId,
  } = useSelector(({ ledger }) => ledger);

  const { changeYearList } = useSelector(
    ({ changeFinancialYear }) => changeFinancialYear,
  );

  const getLedgerDataAPI = useCallback(
    (
      start = 1,
      limit = 10,
      search = '',
      start_date = '',
      end_date = '',
      account_id = '',
      financialYearId = ledgerFinancialYearId,
    ) => {
      dispatch(
        getLedgerData({
          start: start,
          limit: limit,
          search: search?.trim(),
          start_date: start_date,
          end_date: end_date,
          account_id: account_id,
          financial_year_id: financialYearId,
        }),
      );
    },
    [dispatch, ledgerFinancialYearId],
  );

  const getChangeFinancialYearListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getChangeFinancialYearList({
          start: start,
          limit: limit,
          search: search?.trim(),
          isActive: '',
        }),
      ).then(response => {
        const financialYearList = response?.payload?.data?.list || {};

        const selectedFinancialYear =
          Object.keys(financialYearList).length > 0 &&
          financialYearList?.find(item => item.default === true)?._id;

        if (selectedFinancialYear) {
          dispatch(setLedgerFinancialYearId(selectedFinancialYear));
        }
        getLedgerDataAPI(
          ledgerCurrentPage,
          ledgerPageLimit,
          ledgerSearchParam,
          ledgerStartDate,
          ledgerEndDate,
          paramAccountID,
          selectedFinancialYear,
        );
      });
    },
    [
      dispatch,
      getLedgerDataAPI,
      ledgerCurrentPage,
      ledgerPageLimit,
      ledgerSearchParam,
      ledgerStartDate,
      ledgerEndDate,
      paramAccountID,
    ],
  );

  useEffect(() => {
    getChangeFinancialYearListApi();
  }, []);

  const onPageChange = page => {
    if (page !== ledgerCurrentPage) {
      let pageIndex = ledgerCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setLedgerCurrentPage(pageIndex));
      getLedgerDataAPI(
        pageIndex,
        ledgerPageLimit,
        ledgerSearchParam,
        ledgerStartDate,
        ledgerEndDate,
        paramAccountID,
        ledgerFinancialYearId,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setLedgerCurrentPage(page === 0 ? 0 : 1));
    dispatch(setLedgerCurrentPage(page));
    const pageValue =
      page === 0 ? (ledgerData?.totalRows ? ledgerData?.totalRows : 0) : page;
    const prevPageValue =
      ledgerPageLimit === 0
        ? ledgerData?.totalRows
          ? ledgerData?.totalRows
          : 0
        : ledgerPageLimit;
    if (
      prevPageValue < ledgerData?.totalRows ||
      pageValue < ledgerData?.totalRows
    ) {
      getLedgerDataAPI(
        page === 0 ? 0 : 1,
        page,
        ledgerSearchParam,
        ledgerStartDate,
        ledgerEndDate,
        paramAccountID,
        ledgerFinancialYearId,
      );
    }
  };

  const handleSearchInput = e => {
    dispatch(setLedgerCurrentPage(1));
    getLedgerDataAPI(
      1,
      ledgerPageLimit,
      e.target.value?.trim(),
      ledgerStartDate,
      ledgerEndDate,
      paramAccountID,
      ledgerFinancialYearId,
    );
  };

  const handleDate = useCallback(
    e => {
      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setLedgerCurrentPage(1));

        getLedgerDataAPI(
          1,
          ledgerPageLimit,
          ledgerSearchParam?.trim(),
          e.value?.[0] ? moment(e.value?.[0])?.format('YYYY-MM-DD') : '',
          e.value?.[1] ? moment(e.value?.[1])?.format('YYYY-MM-DD') : '',
          paramAccountID,
          ledgerFinancialYearId,
        );
      }
    },
    [
      dispatch,
      getLedgerDataAPI,
      paramAccountID,
      ledgerFinancialYearId,
      ledgerPageLimit,
      ledgerSearchParam,
    ],
  );
  const debounceHandleSearchInput = useCallback(
    _.debounce(e => {
      handleSearchInput(e);
    }, 800),
    [ledgerEndDate, ledgerStartDate],
  );

  const TransactionDateTemplate = data => {
    return moment(data.transaction_date)?.format('DD-MM-YYYY');
  };

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
      dispatch(setLedgerFinancialYearId(data));

      getLedgerDataAPI(
        1,
        ledgerPageLimit,
        ledgerSearchParam,
        ledgerStartDate,
        ledgerEndDate,
        paramAccountID,
        data,
      );
    },
    [
      dispatch,
      getLedgerDataAPI,
      paramAccountID,
      ledgerEndDate,
      ledgerPageLimit,
      ledgerSearchParam,
      ledgerStartDate,
    ],
  );

  const creditBodyTemplate = rowData => {
    return (
      <div className="text-success">
        {rowData?.amount_type === 1 ? rowData?.amount : ''}
      </div>
    );
  };

  const debitBodyTemplate = rowData => {
    return (
      <div className="text-danger">
        {rowData?.amount_type === 2 ? rowData?.amount : ''}
      </div>
    );
  };

  const currentBalanceTemplate = data => {
    return (
      <div>{`${
        Math.abs(
          data?.current_balance % 1 !== 0
            ? data?.current_balance?.toFixed(2)
            : data?.current_balance || 0,
        ) || ''
      } ${
        data?.current_balance ? (data?.current_balance > 0 ? 'CR' : 'DB') : ''
      }`}</div>
    );
  };

  const OpeningBalanceHeader = () => {
    const opening_balance = ledgerData?.accountBalance?.opening_balance || 0;
    const current_balance = ledgerData?.accountBalance?.current_balance || 0;
    const opening_balance_type =
      ledgerData?.accountBalance?.opening_balance_type;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          fontWeight: '500',
          marginRight: '1rem',
          gap: '1rem',
        }}
      >
        <span className="gap-3">
          Opening Balance: {opening_balance || 0}{' '}
          {opening_balance_type === 1 ? 'CR' : 'DB'}
        </span>

        <span>
          Current Balance:{' '}
          {Math.abs(
            convertIntoNumber(
              current_balance % 1 !== 0
                ? current_balance?.toFixed(2)
                : current_balance || 0,
            ),
          )}{' '}
          {current_balance > 0 ? 'CR' : 'DB'}
        </span>
      </div>
    );
  };

  const calculateTotalAmount = useCallback(
    filterType => {
      return (
        ledgerData?.list?.reduce((total, item) => {
          const amount = parseFloat(item?.amount || '0');
          const isCredit = item?.amount_type === 1;

          if (filterType === 'credit' && isCredit) {
            return total + amount;
          }

          if (filterType === 'debit' && !isCredit) {
            return total + amount;
          }

          return total;
        }, 0) || 0
      );
    },
    [ledgerData],
  );

  const TotalFooter =
    ledgerData?.list?.length > 0 ? (
      <ColumnGroup>
        <Row>
          <Column footer="Total Amount" colSpan={4} />
          <Column footer={`${calculateTotalAmount('credit')}`} />
          <Column footer={`${calculateTotalAmount('debit')}`} />
        </Row>
      </ColumnGroup>
    ) : null;

  const descriptionBodyTemplate = rowData => {
    if (!rowData || !rowData.add_from) return '';

    switch (rowData.add_from) {
      case 'Journal Entry':
        return `Journal Entry #${rowData.journal_entry_payment_no || ''} - ${
          rowData.journal_entry_remark || 'No remarks'
        }`;

      case 'Receipt & Payment':
        return `Receipt #${rowData.receipt_payment_payment_no || ''} from ${
          rowData.receipt_payment_client_name || 'Unknown Client'
        } - ${rowData.receipt_payment_remark || 'No remarks'}`;

      case 'billing':
        return `Employee earns ${
          rowData.employee_commision_percentage || 0
        }% commission on '${
          rowData.employee_commission_item_name || 'item'
        }' (Invoice #${rowData.employee_commission_invoice_no || ''})`;

      default:
        return '';
    }
  };

  return (
    <div className="main_Wrapper">
      {ledgerDataLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">Account History Reports</h3>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper mt-2 mt-lg-0">
                <ul className="entry_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id="ledgerDate"
                        value={ledgerDate}
                        placeholder="Select Date Range"
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        onChange={e => {
                          dispatch(setLedgerDate(e?.value));

                          dispatch(
                            setLedgerStartDate(
                              e.value?.[0]
                                ? moment(e.value?.[0])?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );
                          dispatch(
                            setLedgerEndDate(
                              e.value?.[1]
                                ? moment(e.value?.[1])?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );

                          handleDate(e);
                        }}
                        readOnlyInput
                      />
                    </div>
                  </li>
                  <li>
                    <ReactSelectSingle
                      id="financial_year"
                      filter
                      value={ledgerFinancialYearId}
                      options={financialYearOptions}
                      onChange={e => handleSelectFinancialYear(e.value)}
                      placeholder="Select Financial Year"
                    />
                  </li>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={ledgerSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setLedgerSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={ledgerData ? ledgerData?.list : []}
            header={OpeningBalanceHeader}
            footerColumnGroup={TotalFooter}
            rows={10}
          >
            <Column
              field="transaction_date"
              header="Transaction Date"
              sortable
              body={TransactionDateTemplate}
            ></Column>
            <Column
              field="receiver_name"
              header="Receiver Name"
              sortable
            ></Column>
            <Column field="add_from" header="Type" sortable></Column>
            <Column
              field="current_balance"
              header="Current Balance"
              body={currentBalanceTemplate}
              sortable
            ></Column>
            <Column
              field="amount_type"
              header="Credit"
              body={creditBodyTemplate}
            ></Column>
            <Column
              field="amount_type"
              header="Debit"
              body={debitBodyTemplate}
            ></Column>
            <Column
              header="Description"
              body={descriptionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={ledgerData?.list}
            pageLimit={ledgerPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={ledgerCurrentPage}
            totalCount={ledgerData?.totalRows}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AccountHistoryReports);
