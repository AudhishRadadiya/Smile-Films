import { memo, useCallback, useEffect, useState } from 'react';
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
import {
  getLedgerData,
  setLedgerCurrentPage,
  setLedgerEndDate,
  setLedgerSearchParam,
  setLedgerStartDate,
} from 'Store/Reducers/Report/Ledger/LedgerSlice';
import { useParams } from 'react-router-dom';
import { ColumnGroup } from 'primereact/columngroup';
import { convertIntoNumber } from 'Helper/CommonHelper';

const Ledger = () => {
  const dispatch = useDispatch();
  const { id: paramAccountID } = useParams();

  const [startDateForm, setStartDateForm] = useState(null);
  const [endDateForm, setEndDateForm] = useState(null);

  const {
    ledgerData,
    ledgerEndDate,
    ledgerPageLimit,
    ledgerStartDate,
    ledgerCurrentPage,
    ledgerSearchParam,
    ledgerDataLoading,
  } = useSelector(({ ledger }) => ledger);

  const getLedgerDataAPI = useCallback(
    (
      start = 1,
      limit = 10,
      search = '',
      start_date = '',
      end_date = '',
      account_id = paramAccountID || '',
    ) => {
      dispatch(
        getLedgerData({
          start: start,
          limit: limit,
          search: search?.trim(),
          start_date: start_date,
          end_date: end_date,
          account_id: account_id,
        }),
      );
    },
    [dispatch, paramAccountID],
  );

  useEffect(() => {
    getLedgerDataAPI();
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
    );
  };

  const handleClearDate = useCallback(() => {
    dispatch(setLedgerCurrentPage(1));

    getLedgerDataAPI(
      1,
      ledgerPageLimit,
      ledgerSearchParam?.trim(),
      '',
      '',
      paramAccountID,
    );
  }, [
    dispatch,
    getLedgerDataAPI,
    ledgerPageLimit,
    ledgerSearchParam,
    paramAccountID,
  ]);

  const handleDate = useCallback(
    (e, dateType) => {
      if (e?.value !== null) {
        if (dateType === 'start' && !ledgerEndDate) {
          // toast.error('Please select end date');
          return;
        }
        if (dateType === 'end' && !ledgerStartDate) {
          // toast.error('Please select start date');
          return;
        }
        dispatch(setLedgerCurrentPage(1));

        getLedgerDataAPI(
          1,
          ledgerPageLimit,
          ledgerSearchParam?.trim(),
          dateType === 'start'
            ? moment(e.value)?.format('YYYY-MM-DD')
            : ledgerStartDate,
          dateType === 'end'
            ? moment(e.value)?.format('YYYY-MM-DD')
            : ledgerEndDate,
          paramAccountID,
        );
      }
    },
    [
      dispatch,
      getLedgerDataAPI,
      ledgerPageLimit,
      ledgerSearchParam,
      ledgerStartDate,
      ledgerEndDate,
      paramAccountID,
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

  // const currentBalanceTemplate = data => {
  //   return (
  //     <div>{`${
  //       Math.abs(
  //         data?.current_balance % 1 !== 0
  //           ? data?.current_balance?.toFixed(2)
  //           : data?.current_balance || 0,
  //       ) || ''
  //     } ${
  //       data?.current_balance ? (data?.current_balance > 0 ? 'CR' : 'DB') : 0
  //     }`}</div>
  //   );
  // };

  const openingBalanceTemplate = data => {
    return (
      <div>{`${
        Math.abs(
          data?.opening_balance % 1 !== 0
            ? data?.opening_balance?.toFixed(2)
            : data?.opening_balance || 0,
        ) || ''
      } ${
        data?.opening_balance ? (data?.opening_balance > 0 ? 'CR' : 'DB') : 0
      }`}</div>
    );
  };

  const coupleNameTemplate = data => {
    return <div>{data?.couple_name || '-'}</div>;
  };

  const AccountNameTemplate = data => {
    return (
      <div>
        {data?.receiver_name || '-'}

        <p className="mb-0 mt-2 text-[1px]">{data?.description || ''}</p>
      </div>
    );
  };

  const closingBalanceTemplate = data => {
    const closingBal = data.current_balance || 0;
    const amt = data.amount || 0;

    const closingAmount =
      data.amount_type === 1 ? closingBal + amt : closingBal - amt;

    const finalAmount = Math.abs(closingAmount) || 0;

    const openingBalanceType = ledgerData?.accountBalance?.opening_balance_type;

    return (
      <div>
        {openingBalanceType === 1
          ? `${finalAmount.toFixed(2)} CR`
          : `${finalAmount.toFixed(2)} DB`}
      </div>
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
          {opening_balance_type === 1 ? 'CR' : 'DB'}
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
          <Column footer="Total Amount" colSpan={6} />
          <Column footer={`${calculateTotalAmount('credit').toFixed(2)}`} />
          <Column footer={`${calculateTotalAmount('debit').toFixed(2)}`} />
          <Column footer="" colSpan={1} />
        </Row>
      </ColumnGroup>
    ) : null;

  return (
    <div className="main_Wrapper">
      {ledgerDataLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="page_title">
                <h4 className="m-0 mb-2">
                  Ledger: {ledgerData?.accountBalance?.account_name || ''}
                </h4>
                <h4 className="m-0">
                  Group: {ledgerData?.accountBalance?.group_name || ''}
                </h4>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper mt-2 mt-lg-0">
                <ul className="entry_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id="ledgerStartDate"
                        value={startDateForm}
                        placeholder="Select Start Date"
                        showIcon
                        showButtonBar
                        dateFormat="dd-mm-yy"
                        onChange={e => {
                          setStartDateForm(e?.value);

                          dispatch(
                            setLedgerStartDate(
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
                          dispatch(setLedgerStartDate(''));
                          dispatch(setLedgerEndDate(''));
                          handleClearDate();
                        }}
                        readOnlyInput
                      />
                    </div>
                  </li>
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id="ledgerEndDate"
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
                            setLedgerEndDate(
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
            <Column field="add_from" header="Type" sortable></Column>
            <Column
              field="receiver_name"
              header="Account Name"
              body={AccountNameTemplate}
              sortable
            ></Column>
            <Column field="payment_no" header="Payment No" sortable></Column>
            <Column
              field="couple_name"
              header="Couple Name"
              body={coupleNameTemplate}
              sortable
            ></Column>
            <Column
              field="opening_balance"
              header="Opening Balance"
              body={openingBalanceTemplate}
              sortable
            ></Column>
            {/* <Column
              field="current_balance"
              header="Current Balance"
              body={currentBalanceTemplate}
              sortable
            ></Column> */}
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
              field="closing_balance"
              header="Closing Balance"
              body={closingBalanceTemplate}
              sortable
            ></Column>
            {/* <Column header="Description" field="description"></Column> */}
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

export default memo(Ledger);
