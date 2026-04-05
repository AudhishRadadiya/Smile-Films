import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import FilterIcon from '../../../Assets/Images/filter.svg';
import { MultiSelect } from 'primereact/multiselect';

import CustomPaginator from 'Components/Common/CustomPaginator';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';

import {
  setclientPaymentCurrentPage,
  setclientPaymentPageLimit,
  setclientPaymentSearchParam,
  setclientPaymentStartDate,
  setclientPaymentEndDate,
  setclientPaymentStatus,
  getPaymentDetailList,
  setClientPaymentDate,
} from 'Store/Reducers/ClientFlow/MyPay/MyPaySlice';
import { ClientPaymentStatusList } from 'Helper/CommonList';

import _ from 'lodash';
import moment from 'moment';
import { getClientBilling } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import Loader from 'Components/Common/Loader';
import { getAssignedWorkList } from 'Store/Reducers/UserFlow/MyFinance/MyPay/MyFinance';

export default function PaymentDetails() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const {
    getPaymentDetailListData,
    clientPaymentCurrentPage,
    clientPaymentPageLimit,
    clientPaymentSearchParam,
    clientPaymentStartDate,
    clientPaymentEndDate,
    clientPaymentStatus,
    getPaymentDetailListLoading,
    clientPaymentDate,
  } = useSelector(({ myPay }) => myPay);
  const { selectedClientBillingData, clientBillingLoading } = useSelector(
    ({ clientProject }) => clientProject,
  );

  const getPaymentDetailListApi = useCallback(
    (
      start = 1,
      limit = 10,
      search = '',
      start_date = '',
      end_date = '',
      payment_status = '',
    ) => {
      dispatch(
        getPaymentDetailList({
          start: start,
          limit: limit,
          search: search?.trim(),
          start_date: start_date,
          end_date: end_date,
          payment_status: payment_status,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const startDate =
      clientPaymentDate?.length && clientPaymentDate[0]
        ? moment(clientPaymentDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      clientPaymentDate?.length && clientPaymentDate[1]
        ? moment(clientPaymentDate[1])?.format('YYYY-MM-DD')
        : '';

    getPaymentDetailListApi(
      clientPaymentCurrentPage,
      clientPaymentPageLimit,
      clientPaymentSearchParam,
      startDate,
      endDate,
      clientPaymentStatus,
    );
  }, []);

  const onPageChange = page => {
    if (page !== clientPaymentCurrentPage) {
      let pageIndex = clientPaymentCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setclientPaymentCurrentPage(pageIndex));

      const startDate =
        clientPaymentDate?.length && clientPaymentDate[0]
          ? moment(clientPaymentDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        clientPaymentDate?.length && clientPaymentDate[1]
          ? moment(clientPaymentDate[1])?.format('YYYY-MM-DD')
          : '';

      getPaymentDetailList(
        pageIndex,
        clientPaymentPageLimit,
        clientPaymentSearchParam?.trim(),
        startDate,
        endDate,
        clientPaymentStatus,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setclientPaymentCurrentPage(page === 0 ? 0 : 1));
    dispatch(setclientPaymentPageLimit(page));
    const pageValue =
      page === 0
        ? getPaymentDetailListData?.totalRows
          ? getPaymentDetailListData?.totalRows
          : 0
        : page;
    const prevPageValue =
      clientPaymentPageLimit === 0
        ? getPaymentDetailListData?.totalRows
          ? getPaymentDetailListData?.totalRows
          : 0
        : clientPaymentPageLimit;
    if (
      prevPageValue < getPaymentDetailListData?.totalRows ||
      pageValue < getPaymentDetailListData?.totalRows
    ) {
      const startDate =
        clientPaymentDate?.length && clientPaymentDate[0]
          ? moment(clientPaymentDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        clientPaymentDate?.length && clientPaymentDate[1]
          ? moment(clientPaymentDate[1])?.format('YYYY-MM-DD')
          : '';

      getPaymentDetailList(
        page === 0 ? 0 : 1,
        page,
        clientPaymentSearchParam?.trim(),
        startDate,
        endDate,
        clientPaymentStatus,
      );
    }
  };

  const getSeverity = product => {
    switch (product) {
      case 'Partial':
        return 'primary';

      case 'Completed':
        return 'success';

      case 'Due':
        return 'danger';

      default:
        return null;
    }
  };
  const statusItemTemplate = option => {
    return <Tag value={option.label} severity={getSeverity(option.label)} />;
  };

  const statusBodyTemplate = data => {
    return (
      <Tag
        value={
          data?.status === 1
            ? 'Due'
            : data?.status === 2
            ? 'Partial'
            : data?.status === 3
            ? 'Completed'
            : ''
        }
        severity={getSeverity(
          data?.status === 1
            ? 'Due'
            : data?.status === 2
            ? 'Partial'
            : data?.status === 3
            ? 'Completed'
            : '',
        )}
      ></Tag>
    );
  };

  const PaymentItemNameTemplate = product => {
    return (
      <>
        <div className="item_name_wrapper">
          <Button
            className="btn_as_text"
            placeholder="bottom"
            tooltip="Wedding, Teaser, Pre-Wedding"
            type="button"
            label="Wedding, Teaser, Pre-Wedding"
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </>
    );
  };

  const InvoiceDateTemplete = data => {
    return moment(data?.invoice_date).format('DD-MM-YYYY');
  };

  const ItemTypeTemplate = data => {
    return data?.item_type === 1
      ? 'Editing'
      : data?.item_type === 2
      ? 'Exposing'
      : '';
  };

  const BillfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`₹ ${
            selectedClientBillingData?.sub_total
              ? selectedClientBillingData?.sub_total
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );

  const DueDateTemplate = data => {
    return '-';
  };

  const CoupleNameTemplate = data => {
    return data?.item_type === 1
      ? data?.couple_name || ''
      : data?.item_type === 2
      ? '-'
      : '';
  };

  const BillSlipTemplate = data => {
    return (
      <>
        <Button
          className="btn_as_text link_text_blue text-decoration-none"
          onClick={() => {
            setVisible(true);
            dispatch(getClientBilling({ invoice_id: data?._id }));
          }}
        >
          Preview
        </Button>
      </>
    );
  };

  const handleDate = useCallback(
    e => {
      dispatch(setClientPaymentDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setclientPaymentCurrentPage(1));
        const sendData = {
          start: clientPaymentCurrentPage,
          limit: clientPaymentPageLimit,
          search: clientPaymentSearchParam?.trim(),
          start_date: e.value?.[0]
            ? moment(e.value?.[0])?.format('YYYY-MM-DD')
            : '',
          end_date: e.value?.[1]
            ? moment(e.value?.[1])?.format('YYYY-MM-DD')
            : '',
          payment_status: clientPaymentStatus,
        };

        dispatch(getPaymentDetailList(sendData));
      }
    },
    [
      dispatch,
      clientPaymentCurrentPage,
      clientPaymentPageLimit,
      clientPaymentSearchParam,
      clientPaymentStatus,
    ],
  );

  const onChangeMultiSelector = e => {
    dispatch(setclientPaymentStatus(e.value));

    getPaymentDetailListApi(
      clientPaymentCurrentPage,
      clientPaymentPageLimit,
      clientPaymentSearchParam,
      clientPaymentStartDate,
      clientPaymentEndDate,
      e.value,
    );
  };

  const handleSearchInput = (e, date) => {
    dispatch(setclientPaymentCurrentPage(1));

    const startDate =
      date?.length && date[0] ? moment(date[0])?.format('YYYY-MM-DD') : '';
    const endDate =
      date?.length && date[1] ? moment(date[1])?.format('YYYY-MM-DD') : '';

    getPaymentDetailListApi(
      clientPaymentCurrentPage,
      clientPaymentPageLimit,
      e.target.value?.trim(),
      startDate,
      endDate,
      clientPaymentStatus,
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {(getPaymentDetailListLoading || clientBillingLoading) && <Loader />}

      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col lg={3}>
              <div className="page_title">
                <h3 className="m-0">Payment Details</h3>
              </div>
            </Col>
            <Col lg={9}>
              <div className="right_filter_wrapper">
                <ul className="payment_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={clientPaymentDate}
                        placeholder="Select Date Range"
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        onChange={e => {
                          handleDate(e);
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
                        value={clientPaymentSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setclientPaymentSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  {/* <li>
                    <Button
                      className="btn_border filter_btn"
                      onClick={e => op.current.toggle(e)}
                    >
                      <img src={FilterIcon} alt="" /> Filter by Status
                    </Button>
                    <OverlayPanel
                      className="payment-status-overlay"
                      ref={op}
                      hideCloseIcon
                    >
                      <div className="overlay_body payment-status">
                        <div className="overlay_select_filter_row">
                          <div className="filter_row w-100">
                            <Row>
                              <Col sm={12}>
                                <div className="payment_status_wrap mb-2">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="p-tag p-component p-tag-info">
                                      Partial
                                    </span>
                                  </div>
                                </div>
                              </Col>
                              <Col sm={12}>
                                <div className="payment_status_wrap">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="p-tag p-component p-tag-danger">
                                      Due
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </OverlayPanel>
                  </li> */}
                  <li className="inquiry_multeselect w-auto">
                    <MultiSelect
                      options={ClientPaymentStatusList}
                      value={clientPaymentStatus}
                      name="items"
                      onChange={e => {
                        onChangeMultiSelector(e);
                      }}
                      placeholder="Filter by Status"
                      className="btn_primary w-100"
                      itemTemplate={statusItemTemplate}
                    />
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="amount_wrapper p20 p15-sm border-bottom">
          <Row>
            <Col xl={4} md={6}>
              <ul>
                <li>
                  <div className="amount_status amount_paid">
                    <h4>Amount Paid</h4>
                    <h2 className="m-0">{`₹ ${
                      getPaymentDetailListData?.amount_paid || 0
                    }`}</h2>
                  </div>
                </li>
                <li>
                  <div className="amount_status amount_due">
                    <h4>Total Amount Due</h4>
                    <h2 className="m-0">{`₹ ${
                      getPaymentDetailListData?.amount_due || 0
                    }`}</h2>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper amount_table_wrap">
          <DataTable
            value={
              getPaymentDetailListData ? getPaymentDetailListData?.list : []
            }
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="order_no" header="Order No." sortable></Column>
            <Column field="invoice_no" header="Invoice No." sortable></Column>
            <Column
              field="invoice_date"
              header="Invoice Date"
              body={InvoiceDateTemplete}
              sortable
            ></Column>
            <Column
              field="couple_name"
              header="Couple Name"
              body={CoupleNameTemplate}
              sortable
            ></Column>
            <Column
              field="item_type"
              header="Item Type"
              body={ItemTypeTemplate}
              sortable
            ></Column>
            <Column
              field="item_names"
              header="Item Names"
              sortable
              body={PaymentItemNameTemplate}
            ></Column>
            <Column field="bill_amount" header="Bill Amount" sortable></Column>
            <Column
              field="payment_due_date"
              header="Payment Due Date"
              body={DueDateTemplate}
              sortable
            ></Column>
            <Column
              field="bill_slip"
              header="Bill Slip"
              sortable
              body={BillSlipTemplate}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={statusBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={getPaymentDetailListData?.list}
            pageLimit={clientPaymentPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={clientPaymentCurrentPage}
            totalCount={getPaymentDetailListData?.totalRows}
          />
        </div>
      </div>

      <Dialog
        header={
          <div className="dialog_logo">
            <img src={LogoImg} alt="" />
          </div>
        }
        className="modal_Wrapper payment_dialog quotation_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Invoice</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>
                    {selectedClientBillingData?.company_name
                      ? selectedClientBillingData?.company_name
                      : ''}
                  </h5>
                </div>
                <div className="user_bank_details">
                  <p>
                    {selectedClientBillingData?.company_address
                      ? selectedClientBillingData?.company_address
                      : ''}
                  </p>
                </div>
              </Col>
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>Quotation Wedding Shooting</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Invoice No
                    <span>
                      {selectedClientBillingData?.invoice_no
                        ? selectedClientBillingData?.invoice_no
                        : ''}
                    </span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date{' '}
                    <span>
                      {selectedClientBillingData?.created_at
                        ? moment(selectedClientBillingData?.created_at).format(
                            'DD-MM-YYYY',
                          )
                        : ''}
                    </span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={
                selectedClientBillingData?.quotation_detail
                  ? selectedClientBillingData?.quotation_detail
                  : []
              }
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={BillfooterGroup}
            >
              <Column field="item_name" header="Item" sortable></Column>
              <Column field="quantity" header="Qty" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="quotation-wrapper amount_condition mt20">
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="pb10">
                    <h5 className="m-0">Terms & Condition</h5>
                  </div>
                  <div
                    className="condition-content"
                    dangerouslySetInnerHTML={{
                      __html: selectedClientBillingData?.terms_condition
                        ? selectedClientBillingData?.terms_condition
                        : '',
                    }}
                  ></div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text-end">{`₹ ${
                          selectedClientBillingData?.sub_total
                            ? selectedClientBillingData?.sub_total
                            : 0
                        }`}</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">{`₹ ${
                          selectedClientBillingData?.discount
                            ? selectedClientBillingData?.discount
                            : 0
                        }`}</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">{`₹ ${
                          selectedClientBillingData?.tax
                            ? selectedClientBillingData?.tax
                            : 0
                        }`}</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">{`₹ ${
                          selectedClientBillingData?.total_amount
                            ? selectedClientBillingData?.total_amount
                            : 0
                        }`}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="delete_btn_wrap">
            <button
              className="btn_border_dark"
              onClick={() => {
                setVisible(false);
                dispatch(
                  getClientBilling({
                    invoice_id: selectedClientBillingData?._id,
                    pdf: true,
                  }),
                );
              }}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
