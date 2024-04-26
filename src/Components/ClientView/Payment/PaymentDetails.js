import React, { useState, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import FilterIcon from '../../../Assets/Images/filter.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import LogoImg from '../../../Assets/Images/logo.svg';

export const PaymentData = [
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Partial',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'In Progress',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Due',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Completed',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'In Progress',
  },
  {
    order_no: '#56123',
    invoice_no: '#56123',
    invoice_date: '15/06/2023',
    couple_name: 'Kapil & Krupa',
    item_type: 'Exposing',
    bill_amount: '₹ 33,000',
    payment_due_date: '1/07/2023',
    status: 'Partial',
  },
];

export const BillViewData = [
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
];

export default function PaymentDetails() {
  const op = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);
  const [date, setDate] = useState();
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  const onPageChange = page => {
    let pageIndex = currentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    setCurrentPage(pageIndex);
  };

  const onPageRowsChange = page => {
    setCurrentPage(page === 0 ? 0 : 1);
    setPageLimit(page);
  };

  const statusBodyTemplate = product => {
    return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
  };

  const getSeverity = product => {
    switch (product.status) {
      case 'Partial':
        return 'info';

      case 'In Progress':
        return 'primary';

      case 'Pending':
        return 'warning';

      case 'Due':
        return 'danger';

      case 'Completed':
        return 'success';

      default:
        return null;
    }
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

  const BillfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer="₹ 60,000" />
      </Row>
    </ColumnGroup>
  );

  const BillSlipTemplate = () => {
    return (
      <>
        <Button
          className="btn_as_text link_text_blue text-decoration-none"
          onClick={() => setVisible(true)}
        >
          Preview
        </Button>
      </>
    );
  };

  return (
    <div className="main_Wrapper">
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
                        value={date}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        onChange={e => setDate(e.value)}
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
                      />
                    </div>
                  </li>
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
                    <h2 className="m-0">₹ 1,50,000</h2>
                  </div>
                </li>
                <li>
                  <div className="amount_status amount_due">
                    <h4>Total Amount Due</h4>
                    <h2 className="m-0">₹ 2,00,000</h2>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper amount_table_wrap">
          <DataTable
            value={PaymentData}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="order_no" header="Order No." sortable></Column>
            <Column field="invoice_no" header="Invoice No." sortable></Column>
            <Column
              field="invoice_date"
              header="Invoice Date"
              sortable
            ></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column field="item_type" header="Item Type" sortable></Column>
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
            dataList={PaymentData}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={PaymentData?.length}
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
          <h2>Quotation</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>Smile Films</h5>
                </div>
                <div className="user_bank_details">
                  <p>
                    406 DHARA ARCADE, NEAR MAHADEV CHOWK MOTA VARACHHA SURAT
                    GUJARAT 394101
                  </p>
                </div>
              </Col>
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>Quotation Wedding Shooting</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No <span>52123</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date <span>20 May 20219</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={BillViewData}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={BillfooterGroup}
            >
              <Column field="item" header="Item" sortable></Column>
              <Column field="qty" header="Qty" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="quotation-wrapper amount_condition mt20">
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="pb10">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div className="condition-content">
                    <ul>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                    </ul>
                  </div>
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
                        <h5 className="text-end">₹ 33,000</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
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
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">₹ 33,000</h5>
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
              onClick={() => setVisible(false)}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
