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
import {
  getTransactionList,
  setTransactionCurrentPage,
  setTransactionDate,
  setTransactionPageLimit,
  setTransactionSearchParam,
} from 'Store/Reducers/ClientFlow/Project/TransactionSlice';
import Loader from 'Components/Common/Loader';
import CustomPaginator from 'Components/Common/CustomPaginator';

export default function Transaction() {
  const dispatch = useDispatch();
  const {
    transactionDate,
    transactionList,
    transactionLoading,
    transactionPageLimit,
    transactionCurrentPage,
    transactionSearchParam,
  } = useSelector(({ transaction }) => transaction);

  useEffect(() => {
    const startDate =
      transactionDate?.length && transactionDate[0]
        ? moment(transactionDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      transactionDate?.length && transactionDate[1]
        ? moment(transactionDate[1])?.format('YYYY-MM-DD')
        : '';

    dispatch(
      getTransactionList({
        start: transactionCurrentPage,
        limit: transactionPageLimit,
        search: transactionSearchParam?.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );
  }, []);

  const TransactionDateTemplate = data => {
    return moment(data?.created_at)?.format('DD-MM-YYYY');
  };

  const onPageChange = page => {
    if (page !== transactionCurrentPage) {
      let pageIndex = transactionCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setTransactionCurrentPage(pageIndex));

      const startDate =
        transactionDate?.length && transactionDate[0]
          ? moment(transactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        transactionDate?.length && transactionDate[1]
          ? moment(transactionDate[1])?.format('YYYY-MM-DD')
          : '';

      getTransactionList(
        pageIndex,
        transactionPageLimit,
        transactionSearchParam?.trim(),
        startDate,
        endDate,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setTransactionCurrentPage(page === 0 ? 0 : 1));
    dispatch(setTransactionPageLimit(page));
    const pageValue =
      page === 0
        ? transactionList?.totalRows
          ? transactionList?.totalRows
          : 0
        : page;
    const prevPageValue =
      transactionPageLimit === 0
        ? transactionList?.totalRows
          ? transactionList?.totalRows
          : 0
        : transactionPageLimit;

    if (
      prevPageValue < transactionList?.totalRows ||
      pageValue < transactionList?.totalRows
    ) {
      const startDate =
        transactionDate?.length && transactionDate[0]
          ? moment(transactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        transactionDate?.length && transactionDate[1]
          ? moment(transactionDate[1])?.format('YYYY-MM-DD')
          : '';

      getTransactionList(
        page === 0 ? 0 : 1,
        page,
        transactionSearchParam?.trim(),
        startDate,
        endDate,
      );
    }
  };

  const calculateTotalAmount = useCallback(() => {
    return (
      transactionList?.list?.reduce((total, transaction) => {
        return (
          total + (transaction?.amount ? parseFloat(transaction?.amount) : 0)
        );
      }, 0) || 0
    );
  }, [transactionList]);

  const handleTransactionDate = useCallback(
    e => {
      dispatch(setTransactionDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setTransactionCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';
        dispatch(
          getTransactionList({
            start: 1,
            limit: transactionPageLimit,
            search: transactionSearchParam?.trim(),
            start_date: startDate,
            end_date: endDate,
          }),
        );
      }
    },
    [dispatch, transactionPageLimit, transactionSearchParam],
  );

  const TransactionFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={2} />
        <Column footer={`₹ ${calculateTotalAmount()}`} />
      </Row>
    </ColumnGroup>
  );

  const handleSearchInput = (e, date, pageLimit) => {
    dispatch(setTransactionCurrentPage(1));

    const startDate =
      date?.length && date[0] ? moment(date[0])?.format('YYYY-MM-DD') : '';
    const endDate =
      date?.length && date[1] ? moment(date[1])?.format('YYYY-MM-DD') : '';

    dispatch(
      getTransactionList({
        start: 1,
        limit: transactionPageLimit,
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
      {transactionLoading && <Loader />}
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
                        value={transactionDate}
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
                        value={transactionSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            transactionPageLimit,
                            transactionDate,
                          );
                          dispatch(setTransactionSearchParam(e.target.value));
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
            value={transactionList?.list || []}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={
              transactionList?.list?.length && TransactionFooterGroup
            }
          >
            <Column field="invoice_no" header="Invoice No" sortable></Column>
            <Column
              field="created_at"
              header="Entry Date"
              body={TransactionDateTemplate}
              sortable
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              body={CreateAmountTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={transactionList?.list || []}
            pageLimit={
              !transactionList?.totalRows || transactionList?.totalRows === 0
                ? 0
                : transactionPageLimit
            }
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={
              !transactionList?.totalRows || transactionList?.totalRows === 0
                ? 0
                : transactionCurrentPage
            }
            totalCount={transactionList?.totalRows}
          />
        </div>
      </div>
    </div>
  );
}
