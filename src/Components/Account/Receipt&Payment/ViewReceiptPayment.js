import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import DownloadIcon from '../../../Assets/Images/download-icon.svg';

export const paymentData = [
  {
    invoice_date: '27/07/2023',
    invoice_no: '#58974',
    order_date: '#60974',
    couple_name: 'Jasmin & Ryan',
    incoice_amount: '₹ 20,000',
    amount_paid: '₹ 20,000',
  },
  {
    invoice_date: '27/07/2023',
    invoice_no: '#58974',
    order_date: '#60974',
    couple_name: 'Kapil & Krupa',
    incoice_amount: '₹ 25,000',
    amount_paid: '₹ 25,000',
  },
  {
    invoice_date: '27/07/2023',
    invoice_no: '#58974',
    order_date: '#60974',
    couple_name: 'Denial & Charmy',
    incoice_amount: '₹ 15,000',
    amount_paid: '₹ 10,000',
  },
];

export const paymentDetailsData = [
  {
    invoice_date: '27/07/2023',
    invoice_no: '#58974',
    invoice_amount: '₹ 20,000',
    amount_paid: '₹ 30,000',
    balance: '₹ 5,000',
  },
  {
    invoice_date: '16/06/2023',
    invoice_no: '#58974',
    invoice_amount: '₹ 25,000',
    amount_paid: '₹ 500',
    balance: '₹ 5,000',
  },
  {
    invoice_date: '20/06/2023',
    invoice_no: '#58974',
    invoice_amount: '₹ 15,000',
    amount_paid: '₹ 2,500',
    balance: '₹ 5,000',
  },
];

export default function Payment() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate('');

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={5} />
        <Column footer="₹ 45,000" />
      </Row>
    </ColumnGroup>
  );

  const paymentfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer="₹ 45,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border">
        <div className="billing_heading">
          <Row className="align-items-center gy-3">
            <Col sm={3}>
              <div class="page_title">
                <h3 class="m-0">Payment</h3>
              </div>
            </Col>
            <Col sm={9}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => setVisible(true)}
                  >
                    <img src={ShowIcon} alt="" /> Preview
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => navigate('/create-receipt-payment')}
                  >
                    <img src={EditIcon} alt="" /> Edit
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => navigate('/receipt-payment')}
                  >
                    Exit Page
                  </Button>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="p20 p10-sm border-bottom">
          <div className="client_pyment_wrapper">
            <Row className="g-3">
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5>Payment No</h5>
                  <h4>#564892</h4>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5>Create Date</h5>
                  <h4>30/06/2023</h4>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5>Type</h5>
                  <h4>Payment</h4>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row className="g-3">
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Company</h5>
                  <h5>ABC Company</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Client Name</h5>
                  <h5>Kapil Karchadiya</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Payment Type</h5>
                  <h5>Bank</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Payment Receive In</h5>
                  <h5>HDFC Bank</h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row className="g-3">
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Group</h5>
                  <h5>Clint Group</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Current Client balance</h5>
                  <h5>₹ 15,000.00</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Amount</h5>
                  <h5>₹ 00.00</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Balance</h5>
                  <h5>₹ 15,000.00</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Remark</h5>
                  <h5>No Comments</h5>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between align-items-center">
            <Col lg={6}>
              <div className="Receipt_Payment_head_wrapper mb-3 mb-lg-0">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Settle invoice with this payment</h3>
                </div>
                <div className="Receipt_Payment_invoice_txt">
                  <h5 className="m-0">1 invoices Selected</h5>
                </div>
              </div>
            </Col>
            <Col xl={2} lg={4}>
              <div className="form_group">
                <InputText
                  id="search"
                  placeholder="Search"
                  type="search"
                  className="input_wrap small search_wrap"
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper max_height">
          <DataTable
            value={paymentData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={footerGroup}
          >
            <Column
              field="invoice_date"
              header="Invoice Date"
              sortable
            ></Column>
            <Column field="invoice_no" header="Invoice No." sortable></Column>
            <Column field="order_date" header="Order No." sortable></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="incoice_amount"
              header="Invoice Amount"
              sortable
            ></Column>
            <Column field="amount_paid" header="Amount Paid" sortable></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        header={
          <div className="dialog_logo">
            <img src={LogoImg} alt="" />
          </div>
        }
        className="modal_Wrapper payment_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Receipt Voucher</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <div className="voucher_head">
              <h5>Smile Films</h5>
            </div>
            <Row className="justify-content-between gy-3">
              <Col sm={5}>
                <div className="user_bank_details">
                  <h5>
                    Paid to : <span>Kapil</span>
                  </h5>
                </div>
                <div className="user_bank_details">
                  <h5>
                    Payment From : <span>HDFC Bank</span>
                  </h5>
                </div>
              </Col>
              <Col sm={5}>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Payment No <span>#52123</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Payment Date <span>20 May 20219</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={paymentDetailsData}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={paymentfooterGroup}
            >
              <Column
                field="invoice_date"
                header="Invoice Date"
                sortable
              ></Column>
              <Column field="invoice_no" header="Invoice No." sortable></Column>
              <Column
                field="invoice_amount"
                header="Invoice Amount"
                sortable
              ></Column>
              <Column
                field="amount_paid"
                header="Amount Paid"
                sortable
              ></Column>
              <Column field="balance" header="Balance" sortable></Column>
            </DataTable>
          </div>
          <div className="delete_btn_wrap">
            <button className="btn_primary" onClick={() => setVisible(false)}>
              <img src={DownloadIcon} alt="downloadicon" /> Download
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
