import _ from 'lodash';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import CompanySidebar from '../CompanySidebar';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { useDispatch, useSelector } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import EditIcon from '../../../Assets/Images/edit.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import {
  getAccountHistoryList,
  setAccountHistoryCurrentPage,
  setAccountHistoryPageLimit,
  setAccountHistorySearchParam,
} from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnGroup } from 'primereact/columngroup';
import moment from 'moment';
import { getChangeFinancialYearList } from 'Store/Reducers/Settings/Master/ChangeFinancialYearSlice';
import { setIsGetInitialValuesReceiptPayment } from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';

const AccountHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    accountHistoryList,
    accountHistoryCurrentPage,
    accountHistoryPageLimit,
    accountHistoryLoading,
    accountHistorySearchParam,
  } = useSelector(({ account }) => account);

  const { isGetInitialValuesReceiptPayment } = useSelector(
    ({ receiptAndPayment }) => receiptAndPayment,
  );

  const { changeYearList } = useSelector(
    ({ changeFinancialYear }) => changeFinancialYear,
  );

  const { id: selectedAccountId } = useParams();

  const [financialYear, setFinancialYear] = useState('');

  const getAccountHistoryListAPI = useCallback(
    (
      start = 1,
      limit = 10,
      search = '',
      accountId = '',
      financialYearId = financialYear,
    ) => {
      dispatch(
        getAccountHistoryList({
          start: start,
          limit: limit,
          search: search?.trim(),
          account_id: accountId,
          financial_year_id: financialYearId,
        }),
      );
    },
    [dispatch, financialYear],
  );

  const getChangeFinancialYearListApi = useCallback(
    (start = 0, limit = 0, search = '') => {
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
          financialYearList.find(item => item.default === true)?._id;

        if (selectedFinancialYear) {
          setFinancialYear(selectedFinancialYear);
          getAccountHistoryListAPI(
            accountHistoryCurrentPage,
            accountHistoryPageLimit,
            accountHistorySearchParam,
            selectedAccountId,
            selectedFinancialYear,
          );
        }
      });
    },
    [
      accountHistoryCurrentPage,
      accountHistoryPageLimit,
      accountHistorySearchParam,
      dispatch,
      getAccountHistoryListAPI,
      selectedAccountId,
    ],
  );

  useEffect(() => {
    getChangeFinancialYearListApi();
  }, []);

  const onPageChange = useCallback(
    page => {
      if (page !== accountHistoryCurrentPage) {
        let pageIndex = accountHistoryCurrentPage;
        if (page?.page === 'Prev') pageIndex--;
        else if (page?.page === 'Next') pageIndex++;
        else pageIndex = page;
        dispatch(setAccountHistoryCurrentPage(pageIndex));
        getAccountHistoryListAPI(
          pageIndex,
          accountHistoryPageLimit,
          accountHistorySearchParam,
          selectedAccountId,
          financialYear,
        );
      }
    },
    [
      dispatch,
      getAccountHistoryListAPI,
      accountHistoryCurrentPage,
      accountHistoryPageLimit,
      accountHistorySearchParam,
      selectedAccountId,
      financialYear,
    ],
  );

  const onPageRowsChange = page => {
    dispatch(setAccountHistoryCurrentPage(page === 0 ? 0 : 1));
    dispatch(setAccountHistoryPageLimit(page));
    const pageValue =
      page === 0
        ? accountHistoryList?.totalRows
          ? accountHistoryList?.totalRows
          : 0
        : page;
    const prevPageValue =
      accountHistoryPageLimit === 0
        ? accountHistoryList?.totalRows
          ? accountHistoryList?.totalRows
          : 0
        : accountHistoryPageLimit;
    if (
      prevPageValue < accountHistoryList?.totalRows ||
      pageValue < accountHistoryList?.totalRows
    ) {
      getAccountHistoryListAPI(
        page === 0 ? 0 : 1,
        page,
        accountHistorySearchParam,
        selectedAccountId,
        financialYear,
      );
    }
  };

  const handleSearchInput = e => {
    dispatch(setAccountHistoryCurrentPage(1));
    getAccountHistoryListAPI(
      1,
      accountHistoryPageLimit,
      e.target.value?.trim(),
      selectedAccountId,
      financialYear,
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [financialYear],
  );

  const calculateTotalAmount = useCallback(
    filterType => {
      return (
        accountHistoryList?.list?.reduce((total, item) => {
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
    [accountHistoryList],
  );

  const TotalFooter =
    accountHistoryList?.list?.length > 0 ? (
      <ColumnGroup>
        <Row>
          <Column footer="Total Amount" colSpan={2} />
          <Column footer={`${calculateTotalAmount('credit')}`} />
          <Column footer={`${calculateTotalAmount('debit')}`} />
        </Row>
      </ColumnGroup>
    ) : null;

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

  const dateBodyTemplate = date => {
    const updateFormat = moment(new Date(date)).format('DD-MM-YYYY');
    return <span>{updateFormat}</span>;
  };

  const actionBodyTemplate = row => {
    return (
      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            dispatch(
              setIsGetInitialValuesReceiptPayment({
                ...isGetInitialValuesReceiptPayment,
                edit: false,
              }),
            );
            navigate(`/edit-receipt-payment/${row?.receipt_id || ''}`);
          }}
        />
      </div>
    );
  };

  const OpeningBalanceHeader = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        fontWeight: '500',
        marginRight: '1rem',
      }}
    >
      Opening Balance:{' '}
      {accountHistoryList?.accountBalance?.opening_balance || 0} {''}
      {accountHistoryList?.accountBalance?.opening_balance_type === 1
        ? 'CR'
        : 'DB'}
    </div>
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
      setFinancialYear(data);
      getAccountHistoryListAPI(
        1,
        accountHistoryPageLimit,
        accountHistorySearchParam,
        selectedAccountId,
        data,
      );
    },
    [
      accountHistoryPageLimit,
      accountHistorySearchParam,
      getAccountHistoryListAPI,
      selectedAccountId,
    ],
  );

  return (
    <div className="main_Wrapper">
      {accountHistoryLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Account History</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
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
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={accountHistorySearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(
                                setAccountHistorySearchParam(e.target.value),
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
                value={accountHistoryList?.list || []}
                rows={10}
                footerColumnGroup={TotalFooter}
                header={OpeningBalanceHeader}
              >
                <Column
                  field="transaction_date"
                  header="Transaction Date"
                  body={e => dateBodyTemplate(e?.transaction_date)}
                ></Column>
                <Column field="receiver_name" header="Receiver Name"></Column>
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
                  field="current_balance"
                  header="Current Balance"
                  sortable
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={accountHistoryList?.list}
                pageLimit={accountHistoryPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={accountHistoryCurrentPage}
                totalCount={accountHistoryList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AccountHistory);
