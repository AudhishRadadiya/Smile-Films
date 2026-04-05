import React, { useEffect, useCallback } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ColumnGroup } from 'primereact/columngroup';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getEmpTransactionList,
  setEmpTransactionCurrentPage,
  setEmpTransactionDate,
  setEmpTransactionPageLimit,
  setEmpTransactionSearchParam,
} from 'Store/Reducers/UserFlow/MyFinance/EmpTransactionSlice';

export default function EmpTransaction() {
  const dispatch = useDispatch();
  const {
    empTransactionDate,
    empTransactionList,
    empTransactionLoading,
    empTransactionPageLimit,
    empTransactionCurrentPage,
    empTransactionSearchParam,
  } = useSelector(({ empTransaction }) => empTransaction);

  useEffect(() => {
    const startDate =
      empTransactionDate?.length && empTransactionDate[0]
        ? moment(empTransactionDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      empTransactionDate?.length && empTransactionDate[1]
        ? moment(empTransactionDate[1])?.format('YYYY-MM-DD')
        : '';

    dispatch(
      getEmpTransactionList({
        start: empTransactionCurrentPage,
        limit: empTransactionPageLimit,
        search: empTransactionSearchParam?.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );
  }, []);

  const TransactionDateTemplate = data => {
    return moment(data?.payment_date)?.format('DD-MM-YYYY');
  };

  const TypeTemplate = data => {
    return data?.type === 1 ? 'Debit' : 'Credit';
  };

  const PaymentTypeTemplate = data => {
    return (
      { 1: 'Cash', 2: 'Bank', 3: 'Cheque' }[data?.payment_type ?? 0] ||
      'Unknown'
    );
  };

  const onPageChange = page => {
    if (page !== empTransactionCurrentPage) {
      let pageIndex = empTransactionCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setEmpTransactionCurrentPage(pageIndex));

      const startDate =
        empTransactionDate?.length && empTransactionDate[0]
          ? moment(empTransactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        empTransactionDate?.length && empTransactionDate[1]
          ? moment(empTransactionDate[1])?.format('YYYY-MM-DD')
          : '';

      getEmpTransactionList(
        pageIndex,
        empTransactionPageLimit,
        empTransactionSearchParam?.trim(),
        startDate,
        endDate,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setEmpTransactionCurrentPage(page === 0 ? 0 : 1));
    dispatch(setEmpTransactionPageLimit(page));
    const pageValue =
      page === 0
        ? empTransactionList?.totalRows
          ? empTransactionList?.totalRows
          : 0
        : page;
    const prevPageValue =
      empTransactionPageLimit === 0
        ? empTransactionList?.totalRows
          ? empTransactionList?.totalRows
          : 0
        : empTransactionPageLimit;

    if (
      prevPageValue < empTransactionList?.totalRows ||
      pageValue < empTransactionList?.totalRows
    ) {
      const startDate =
        empTransactionDate?.length && empTransactionDate[0]
          ? moment(empTransactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        empTransactionDate?.length && empTransactionDate[1]
          ? moment(empTransactionDate[1])?.format('YYYY-MM-DD')
          : '';

      getEmpTransactionList(
        page === 0 ? 0 : 1,
        page,
        empTransactionSearchParam?.trim(),
        startDate,
        endDate,
      );
    }
  };

  const calculateTotalAmount = useCallback(() => {
    return (
      empTransactionList?.list?.reduce((total, transaction) => {
        return (
          total + (transaction?.amount ? parseFloat(transaction?.amount) : 0)
        );
      }, 0) || 0
    );
  }, [empTransactionList]);

  const handleTransactionDate = useCallback(
    e => {
      dispatch(setEmpTransactionDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setEmpTransactionCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';
        dispatch(
          getEmpTransactionList({
            start: 1,
            limit: empTransactionPageLimit,
            search: empTransactionSearchParam?.trim(),
            start_date: startDate,
            end_date: endDate,
          }),
        );
      }
    },
    [dispatch, empTransactionPageLimit, empTransactionSearchParam],
  );

  const TransactionFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={7} />
        <Column footer={`₹ ${calculateTotalAmount()}`} />
      </Row>
    </ColumnGroup>
  );

  const handleSearchInput = (e, date, pageLimit) => {
    dispatch(setEmpTransactionCurrentPage(1));

    const startDate =
      date?.length && date[0] ? moment(date[0])?.format('YYYY-MM-DD') : '';
    const endDate =
      date?.length && date[1] ? moment(date[1])?.format('YYYY-MM-DD') : '';

    dispatch(
      getEmpTransactionList({
        start: 1,
        limit: empTransactionPageLimit,
        search: e.target.value?.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const CreateAmountTemplate = rowData => {
    return rowData?.amount || '0';
  };

  return (
    <div className="main_Wrapper">
      {empTransactionLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col lg={3}>
              <div className="page_title">
                <h3 className="m-0">Transaction</h3>
              </div>
            </Col>
            <Col lg={9}>
              <div className="right_filter_wrapper">
                <ul className="payment_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={empTransactionDate}
                        placeholder="Select Date Range"
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        onChange={e => {
                          handleTransactionDate(e);
                        }}
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
                        value={empTransactionSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            empTransactionPageLimit,
                            empTransactionDate,
                          );
                          dispatch(
                            setEmpTransactionSearchParam(e.target.value),
                          );
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
            value={empTransactionList?.list || []}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={
              empTransactionList?.list?.length && TransactionFooterGroup
            }
          >
            <Column field="payment_no" header="Payment No" sortable></Column>
            <Column field="account_name" header="Account Name"></Column>
            <Column
              field="payment_receive_in"
              header="Payment Receive In"
            ></Column>
            <Column field="client_name" header="Client Name"></Column>
            <Column
              field="payment_date"
              header="Payment Date"
              body={TransactionDateTemplate}
              sortable
            ></Column>
            <Column field="type" header="Type" body={TypeTemplate}></Column>
            <Column
              field="payment_type"
              header="Payment Type"
              body={PaymentTypeTemplate}
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              body={CreateAmountTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={empTransactionList?.list || []}
            pageLimit={
              !empTransactionList?.totalRows ||
              empTransactionList?.totalRows === 0
                ? 0
                : empTransactionPageLimit
            }
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={
              !empTransactionList?.totalRows ||
              empTransactionList?.totalRows === 0
                ? 0
                : empTransactionCurrentPage
            }
            totalCount={empTransactionList?.totalRows}
          />
        </div>
      </div>
    </div>
  );
}
