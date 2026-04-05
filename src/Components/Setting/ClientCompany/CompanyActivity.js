import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { BillingStatusList } from 'Helper/CommonList';
import LogoImg from '../../../Assets/Images/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import EyesIcon from '../../../Assets/Images/eyes.svg';
import { convertIntoNumber } from 'Helper/CommonHelper';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getInvoiceList,
  getProjectList,
  getQuotationList,
  getClientCompanyList,
  setActivityQuotesPageLimit,
  setActivityQuotesCurrentPage,
  setActivityInvoicePageLimit,
  setActivityInvoiceCurrentPage,
  setActivityProjectsPageLimit,
  setActivityProjectsCurrentPage,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getClientBilling } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

const getSeverity = product => {
  switch (product) {
    case 'Partial':
      return 'primary';
    case 'Due':
      return 'danger';
    case 'Completed':
      return 'success';
    default:
      return null;
  }
};

const CompanyActivity = () => {
  const op = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const {
    clientCompanyList,
    setInvoiceStatus,
    companyActivityInvoiceData,
    activityInvoiceCurrentPage,
    activityInvoicePageLimit,
    setProjectStatus,
    companyActivityProjectsData,
    activityProjectsCurrentPage,
    activityProjectsPageLimit,
    setQuotesStatus,
    companyActivityQuotationData,
    activityQuotesCurrentPage,
    activityQuotesPageLimit,
  } = useSelector(({ clientCompany }) => clientCompany);

  const { selectedClientBillingData } = useSelector(
    ({ clientProject }) => clientProject,
  );

  const fetchRequiredData = useCallback(() => {
    dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 3,
      }),
    );
    dispatch(
      getInvoiceList({
        start: activityInvoiceCurrentPage,
        limit: activityInvoicePageLimit,
        search: '',
        invoice_status: [],
        client_company_id: id,
      }),
    );
    dispatch(
      getProjectList({
        start: activityProjectsCurrentPage,
        limit: activityProjectsPageLimit,
        search: '',
        order_status: [],
        client_company_id: id,
      }),
    );
    dispatch(
      getQuotationList({
        start: activityQuotesCurrentPage,
        limit: activityQuotesPageLimit,
        search: '',
        quotation_status: [],
        client_company_id: id,
      }),
    );
  }, [
    id,
    dispatch,
    activityInvoiceCurrentPage,
    activityInvoicePageLimit,
    activityProjectsCurrentPage,
    activityProjectsPageLimit,
    activityQuotesCurrentPage,
    activityQuotesPageLimit,
  ]);

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const updatedQuotationList = useMemo(() => {
    const updatedData = companyActivityQuotationData?.list?.map(item => {
      const findClientObj = clientCompanyList?.list?.find(
        company => company?._id === item?.client_company_id,
      );

      return {
        ...item,
        client_company_data: findClientObj,
      };
    });

    return { ...companyActivityQuotationData, list: updatedData };
  }, [clientCompanyList, companyActivityQuotationData]);

  const activityInvoicePageChange = page => {
    if (page !== activityInvoiceCurrentPage) {
      let pageIndex = activityInvoiceCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(setActivityInvoiceCurrentPage(pageIndex));
      dispatch(
        getInvoiceList({
          start: pageIndex,
          limit: activityInvoicePageLimit,
          search: '',
          invoice_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const activityInvoicePageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setActivityInvoiceCurrentPage(updatedCurrentPage));
    dispatch(setActivityInvoicePageLimit(page));

    const pageValue =
      page === 0
        ? companyActivityInvoiceData?.totalRows
          ? companyActivityInvoiceData?.totalRows
          : 0
        : page;
    const prevPageValue =
      activityInvoicePageLimit === 0
        ? companyActivityInvoiceData?.totalRows
          ? companyActivityInvoiceData?.totalRows
          : 0
        : activityInvoicePageLimit;

    if (
      prevPageValue < companyActivityInvoiceData?.totalRows ||
      pageValue < companyActivityInvoiceData?.totalRows
    ) {
      dispatch(
        getInvoiceList({
          start: updatedCurrentPage,
          limit: page,
          search: '',
          invoice_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const activityProjectsPageChange = page => {
    if (page !== activityProjectsCurrentPage) {
      let pageIndex = activityProjectsCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(setActivityProjectsCurrentPage(pageIndex));
      dispatch(
        getProjectList({
          start: pageIndex,
          limit: activityProjectsPageLimit,
          search: '',
          order_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const activityProjectsPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setActivityProjectsCurrentPage(updatedCurrentPage));
    dispatch(setActivityProjectsPageLimit(page));

    const pageValue =
      page === 0
        ? companyActivityProjectsData?.totalRows
          ? companyActivityProjectsData?.totalRows
          : 0
        : page;
    const prevPageValue =
      activityProjectsPageLimit === 0
        ? companyActivityProjectsData?.totalRows
          ? companyActivityProjectsData?.totalRows
          : 0
        : activityProjectsPageLimit;

    if (
      prevPageValue < companyActivityProjectsData?.totalRows ||
      pageValue < companyActivityProjectsData?.totalRows
    ) {
      dispatch(
        getProjectList({
          start: updatedCurrentPage,
          limit: page,
          search: '',
          order_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const activityQuotationPageChange = page => {
    if (page !== activityQuotesCurrentPage) {
      let pageIndex = activityQuotesCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(setActivityQuotesCurrentPage(pageIndex));
      dispatch(
        getQuotationList({
          start: pageIndex,
          limit: activityQuotesPageLimit,
          search: '',
          quotation_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const activityQuotationPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setActivityQuotesCurrentPage(updatedCurrentPage));
    dispatch(setActivityQuotesPageLimit(page));

    const pageValue =
      page === 0
        ? companyActivityQuotationData?.totalRows
          ? companyActivityQuotationData?.totalRows
          : 0
        : page;
    const prevPageValue =
      activityQuotesPageLimit === 0
        ? companyActivityQuotationData?.totalRows
          ? companyActivityQuotationData?.totalRows
          : 0
        : activityQuotesPageLimit;

    if (
      prevPageValue < companyActivityQuotationData?.totalRows ||
      pageValue < companyActivityQuotationData?.totalRows
    ) {
      dispatch(
        getQuotationList({
          start: updatedCurrentPage,
          limit: page,
          search: '',
          quotation_status: [],
          client_company_id: id,
        }),
      );
    }
  };

  const statusBodyTemplate = product => {
    const Status = BillingStatusList?.find(
      item => item?.value === product?.status,
    );
    return (
      <Tag
        value={Status?.label}
        className="cursor_pointer"
        severity={getSeverity(Status?.label)}
      ></Tag>
    );
  };

  const viewBodyTemplate = data => {
    return (
      <>
        <Button
          className="btn_border_dark"
          onClick={() => {
            setVisible(true);
            dispatch(getClientBilling({ invoice_id: data?._id }));
          }}
        >
          <img src={EyesIcon} alt="EyesIcon" />
          View
        </Button>
      </>
    );
  };

  const inquiryTypeTemplate = rowData => {
    const inquiryType = rowData?.inquiry_type === 1 ? 'Editing' : 'Exposing';
    return <span>{inquiryType}</span>;
  };

  const itemNameTemplate = rowData => {
    const itemNames = rowData?.item_name?.length
      ? rowData?.item_name?.join(', ')
      : '';
    return <span>{itemNames}</span>;
  };

  const dataSizeTemplate = rowData => {
    const dataSize = rowData?.data_size
      ? convertIntoNumber(rowData?.data_size)
      : '';
    return <span>{dataSize}</span>;
  };

  const statusTemplate = rowData => {
    const status = rowData?.status === 1 ? 'Pending' : 'Approved';
    return (
      <div>
        <span>{status}</span>
      </div>
    );
  };

  const companyNameTemplate = rowData => {
    return (
      <div>
        <span>{rowData?.client_company_data?.company_name}</span>
      </div>
    );
  };

  const clientNameTemplate = rowData => {
    return (
      <div>
        <span>{rowData?.client_company_data?.client_full_name}</span>
      </div>
    );
  };

  return (
    <div className="company_activity_wrap p30 p20-md p15-sm">
      <div className="accordion_wrapper activity_accordion_wrapper">
        <Accordion activeIndex={0}>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Invoice</span>
                {/* <div className="title_right_wrapper">
                  <ul>
                    <li>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div> */}
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={companyActivityInvoiceData?.list || []}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column field="created_at" header="Date" sortable></Column>
                  <Column
                    field="invoice_no"
                    header="Invoice No"
                    sortable
                  ></Column>
                  <Column
                    field="order_no"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="amount" header="Amount" sortable></Column>
                  <Column
                    field="status"
                    header="Payment Status"
                    sortable
                    body={statusBodyTemplate}
                  ></Column>
                  <Column
                    field="view"
                    header=""
                    body={viewBodyTemplate}
                    style={{ width: '8%' }}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={companyActivityInvoiceData?.list}
                  pageLimit={activityInvoicePageLimit}
                  onPageChange={activityInvoicePageChange}
                  onPageRowsChange={activityInvoicePageRowsChange}
                  currentPage={activityInvoiceCurrentPage}
                  totalCount={companyActivityInvoiceData?.totalRows}
                />
              </div>
            </div>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Projects</span>
                {/* <div className="title_right_wrapper">
                  <ul>
                    <li>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div> */}
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={companyActivityProjectsData?.list || []}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column
                    field="inquiry_no"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="create_date" header="Date" sortable></Column>
                  <Column
                    field="couple_name"
                    header="Couple Name"
                    sortable
                  ></Column>
                  <Column
                    field="inquiry_type"
                    header="Inquiry Type"
                    sortable
                    body={inquiryTypeTemplate}
                  ></Column>
                  <Column
                    field="item_name"
                    header="Item Names"
                    sortable
                    body={itemNameTemplate}
                  ></Column>
                  <Column
                    field="project_type"
                    header="Project Type"
                    sortable
                  ></Column>
                  <Column
                    field="data_size"
                    header="Data Size"
                    body={dataSizeTemplate}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={companyActivityProjectsData?.list}
                  pageLimit={activityProjectsPageLimit}
                  onPageChange={activityProjectsPageChange}
                  onPageRowsChange={activityProjectsPageRowsChange}
                  currentPage={activityProjectsCurrentPage}
                  totalCount={companyActivityProjectsData?.totalRows}
                />
              </div>
            </div>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Quotes</span>
                {/* <div className="title_right_wrapper">
                  <ul>
                    <li>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div> */}
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={updatedQuotationList?.list || []}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column
                    field="order_no"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="created_at" header="Date" sortable></Column>
                  <Column
                    field="company_name"
                    header="Company Name"
                    sortable
                    body={companyNameTemplate}
                  ></Column>
                  <Column
                    field="client_full_name"
                    header="Client Name"
                    sortable
                    body={clientNameTemplate}
                  ></Column>
                  <Column
                    field="quotation_name"
                    header="Quotation Name"
                    sortable
                  ></Column>
                  <Column
                    field="total_amount"
                    header="Total Amount"
                    sortable
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusTemplate}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={updatedQuotationList?.list}
                  pageLimit={activityQuotesPageLimit}
                  onPageChange={activityQuotationPageChange}
                  onPageRowsChange={activityQuotationPageRowsChange}
                  currentPage={activityQuotesCurrentPage}
                  totalCount={updatedQuotationList?.totalRows}
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
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
};
export default memo(CompanyActivity);
