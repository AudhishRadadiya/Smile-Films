import React, { memo, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Button, Col, Row } from 'react-bootstrap';
import Eyes from '../../../Assets/Images/eyes.svg';
import { useDispatch, useSelector } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import DowanloadIcon from '../../../Assets/Images/download-icon.svg';
import {
  getClientCompany,
  getTransactionList,
  setClientCompanyTransactionDate,
  setCompanyTransactionCurrentPage,
  setCompanyTransactionPageLimit,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

const CompanyTransactions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [previewModel, setPreviewModel] = useState(false);

  const {
    clientCompanyTransactionData,
    companyTransactionPageLimit,
    companyTransactionCurrentPage,
    clientCompanyTransactionDate,
    selectedClientCompanyData,
    clientCompanyTransactionPreviewData,
  } = useSelector(({ clientCompany }) => clientCompany);

  const fetchRequiredData = useCallback(
    (isPDF = false, isPreview = false) => {
      const startDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[0]
          ? moment(clientCompanyTransactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[1]
          ? moment(clientCompanyTransactionDate[1])?.format('YYYY-MM-DD')
          : '';

      dispatch(
        getTransactionList({
          start: companyTransactionCurrentPage,
          limit: companyTransactionPageLimit,
          search: '',
          start_date: startDate,
          end_date: endDate,
          client_company_id: id,
          pdf: isPDF,
          preview: isPreview,
        }),
      );
    },
    [
      clientCompanyTransactionDate,
      companyTransactionCurrentPage,
      companyTransactionPageLimit,
      dispatch,
      id,
    ],
  );

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const fetchPreviewData = useCallback(async () => {
    await fetchRequiredData(false, true);

    dispatch(
      getClientCompany({
        client_company_id: id,
      }),
    );
  }, [dispatch, fetchRequiredData, id]);

  const onPageChange = page => {
    if (page !== companyTransactionCurrentPage) {
      let pageIndex = companyTransactionCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(setCompanyTransactionCurrentPage(pageIndex));

      const startDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[0]
          ? moment(clientCompanyTransactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[1]
          ? moment(clientCompanyTransactionDate[1])?.format('YYYY-MM-DD')
          : '';

      dispatch(
        getTransactionList({
          start: pageIndex,
          limit: companyTransactionPageLimit,
          search: '',
          start_date: startDate,
          end_date: endDate,
          client_company_id: id,
        }),
      );
    }
  };

  const onPageRowsChange = page => {
    const updatedCurrentPageNumber = page === 0 ? 0 : 1;
    dispatch(setCompanyTransactionCurrentPage(updatedCurrentPageNumber));
    dispatch(setCompanyTransactionPageLimit(page));

    const pageValue =
      page === 0
        ? clientCompanyTransactionData?.totalRows
          ? clientCompanyTransactionData?.totalRows
          : 0
        : page;
    const prevPageValue =
      companyTransactionPageLimit === 0
        ? clientCompanyTransactionData?.totalRows
          ? clientCompanyTransactionData?.totalRows
          : 0
        : companyTransactionPageLimit;

    if (
      prevPageValue < clientCompanyTransactionData?.totalRows ||
      pageValue < clientCompanyTransactionData?.totalRows
    ) {
      const startDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[0]
          ? moment(clientCompanyTransactionDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        clientCompanyTransactionDate?.length && clientCompanyTransactionDate[1]
          ? moment(clientCompanyTransactionDate[1])?.format('YYYY-MM-DD')
          : '';

      dispatch(
        getTransactionList({
          start: updatedCurrentPageNumber,
          limit: page,
          search: '',
          start_date: startDate,
          end_date: endDate,
          client_company_id: id,
        }),
      );
    }
  };

  const handleClientCompanyTransactionDate = useCallback(
    e => {
      dispatch(setClientCompanyTransactionDate(e.value));

      if (e.value === null || e.value[1]) {
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
            start: companyTransactionCurrentPage,
            limit: companyTransactionPageLimit,
            search: '',
            start_date: startDate,
            end_date: endDate,
            client_company_id: id,
          }),
        );
      }
    },
    [companyTransactionCurrentPage, companyTransactionPageLimit, dispatch, id],
  );

  const entryDateTemplate = rowData => {
    const entryDate = rowData?.created_at
      ? moment(rowData.created_at).format('DD-MM-YYYY')
      : '';
    return <span> {entryDate}</span>;
  };

  const amountTemplate = rowData => {
    const entryDate = rowData?.total_amount ? `₹ ${rowData?.total_amount}` : '';
    return <span> {entryDate}</span>;
  };

  return (
    <div className="transaction_wrap">
      <div className="table_main_Wrapper rounded-0 border-0">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Transactions</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group date_select_wrapper text-end">
                      <Calendar
                        id="CompanyTransactionDate"
                        value={clientCompanyTransactionDate}
                        placeholder="Select Date Range"
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        showIcon
                        readOnlyInput
                        showButtonBar
                        onChange={e => {
                          handleClientCompanyTransactionDate(e);
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => {
                        fetchPreviewData();
                        setPreviewModel(true);
                      }}
                      to="/create-employee"
                      className="btn_border_dark"
                    >
                      <img src={Eyes} alt="" /> Preview
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper transaction_table_wrapper">
          <DataTable
            value={clientCompanyTransactionData?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="invoice_no" header="Invoice No" sortable></Column>
            <Column field="created_at" header="Entry Date" sortable></Column>
            <Column field="amount" header="Amount" sortable></Column>
          </DataTable>
          <CustomPaginator
            dataList={clientCompanyTransactionData?.list}
            pageLimit={companyTransactionPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={companyTransactionCurrentPage}
            totalCount={clientCompanyTransactionData?.totalRows}
          />
        </div>
      </div>
      <Dialog
        header={
          <h5 className="m-0 text-center">
            Customer Statement for{' '}
            {selectedClientCompanyData?.client_full_name
              ? selectedClientCompanyData?.client_full_name
              : ''}
          </h5>
        }
        visible={previewModel}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={() => setPreviewModel(false)}
      >
        <div className="customer_statement_wrap">
          <Row>
            <Col lg={6}>
              <h3>
                {selectedClientCompanyData?.company_name
                  ? selectedClientCompanyData?.company_name
                  : ''}
              </h3>
              <h3>
                {selectedClientCompanyData?.email_id
                  ? selectedClientCompanyData?.email_id
                  : ''}
              </h3>
            </Col>
            <Col lg={6}>
              <div className="text-end">
                <h3>
                  {selectedClientCompanyData?.email_id
                    ? selectedClientCompanyData?.email_id
                    : ''}
                </h3>
                {/* <h4 className="text_dark">01/08/2023 To 31/08/2023</h4> */}
                <h4 className="text_dark">
                  {clientCompanyTransactionDate?.length
                    ? `${
                        clientCompanyTransactionDate[0]
                          ? moment(clientCompanyTransactionDate[0])?.format(
                              'DD-MM-YYYY',
                            )
                          : ''
                      } To 
                ${
                  clientCompanyTransactionDate[1]
                    ? moment(clientCompanyTransactionDate[1])?.format(
                        'DD-MM-YYYY',
                      )
                    : ''
                }`
                    : ''}
                </h4>
              </div>
            </Col>
            <Col lg={12} className="my20">
              <h5>
                {selectedClientCompanyData?.client_full_name
                  ? selectedClientCompanyData?.client_full_name
                  : ''}
              </h5>
              <h5>
                {selectedClientCompanyData?.address
                  ? selectedClientCompanyData?.address
                  : ''}
              </h5>
            </Col>
          </Row>
          <div className="data_table_wrapper max_height">
            <DataTable
              value={clientCompanyTransactionPreviewData?.invoiceData || []}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column field="invoice_no" header="Invoice No" sortable></Column>
              <Column
                field="created_at"
                header="Entry Date"
                body={entryDateTemplate}
                sortable
              ></Column>
              <Column
                field="amount"
                header="Amount"
                body={amountTemplate}
                sortable
              ></Column>
            </DataTable>
          </div>
          <Row className="justify-content-end my20">
            <Col lg={6}>
              <div className="balance_box p20 border radius6">
                <ul>
                  {/* <li>
                    <label>Opening Balance</label>
                    <span>₹ 40,000</span>
                  </li> */}
                  <li>
                    <label>Credit Amount</label>
                    <span>
                      {clientCompanyTransactionPreviewData?.sum_total_amount
                        ? `₹ ${clientCompanyTransactionPreviewData?.sum_total_amount}`
                        : 0}
                    </span>
                  </li>
                  <li>
                    <label>Debit Amount</label>
                    <span>
                      {clientCompanyTransactionPreviewData?.sum_total_amount
                        ? `₹ ${clientCompanyTransactionPreviewData?.sum_total_amount}`
                        : 0}
                    </span>
                  </li>
                  <li>
                    <label>Closing Balance</label>
                    <span>
                      {clientCompanyTransactionPreviewData?.sum_total_amount
                        ? `₹ ${clientCompanyTransactionPreviewData?.sum_total_amount}`
                        : 0}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="text-end">
            <Button
              className="btn_primary"
              onClick={() => {
                fetchRequiredData(true, true);
              }}
            >
              <img src={DowanloadIcon} alt="DowanloadIcon" />
              Download
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default memo(CompanyTransactions);
