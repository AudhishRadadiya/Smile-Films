import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import ReactSelectSingle from '../../Common/ReactSelectSingle';

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

export default function RecordReceiptAndPayment() {
  const [date, setDate] = useState();
  const [typeSelect, setTypeSelect] = useState([]);
  const [paymentSelect, setPaymentSelect] = useState([]);
  const [companySelect, setCompanySelect] = useState([]);
  const [receiveSelect, setReceiveSelect] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={6} />
        <Column footer="₹ 45,000" />
      </Row>
    </ColumnGroup>
  );

  const stateHandleChange = e => {
    setTypeSelect(e.value);
  };

  const statePaymentChange = e => {
    setPaymentSelect(e.value);
  };

  const stateCompanyChange = e => {
    setCompanySelect(e.value);
  };

  const stateReceiveChange = e => {
    setReceiveSelect(e.value);
  };

  const Type = [
    { label: 'Receipt', value: 'Receipt' },
    { label: 'Payment', value: 'Payment' },
  ];
  const payment = [
    { label: 'Case', value: 'Case' },
    { label: 'Bank', value: 'Bank' },
    { label: 'Cheque', value: 'Cheque' },
  ];
  const Company = [
    { label: 'ABC Company', value: 'ABC Company' },
    { label: 'CDE Company', value: 'CDE Company' },
    { label: 'EFG Company', value: 'EFG Company' },
    { label: 'HIJ Company', value: 'HIJ Company' },
    { label: 'KLM Company', value: 'KLM Company' },
  ];
  const Receive = [
    { label: 'ABC Company', value: 'ABC Company' },
    { label: 'CDE Company', value: 'CDE Company' },
    { label: 'EFG Company', value: 'EFG Company' },
    { label: 'HIJ Company', value: 'HIJ Company' },
    { label: 'KLM Company', value: 'KLM Company' },
  ];

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border">
        <div className="billing_heading">
          <Row className="align-items-center gy-3">
            <Col sm={6}>
              <div class="page_title">
                <h3 class="m-0">Record Receipt / Payment</h3>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Link
                    to="/receipt-payment"
                    className="btn_border_dark filter_btn"
                  >
                    Exit Page
                  </Link>
                </li>
                <li>
                  <Link
                    to="/receipt-payment"
                    className="btn_primary filter_btn"
                  >
                    Save
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="p20 p10-sm border-bottom">
          <Row>
            <Col lg={9}>
              <Row>
                <Col lg={4}>
                  <Row>
                    <Col xl={6} lg={12} md={6}>
                      <div className="form_group mb-3">
                        <label>Payment No</label>
                        <InputText
                          placeholder="#564892"
                          className="input_wrap"
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={12} md={6}>
                      <div className="form_group mb-3">
                        <label>Create Date</label>
                        <div className="date_select text-end">
                          <Calendar
                            value={date}
                            placeholder="30/06/2023"
                            onChange={e => setDate(e.value)}
                            showIcon
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Type</label>
                    <ReactSelectSingle
                      filter
                      value={typeSelect}
                      options={Type}
                      onChange={e => {
                        stateHandleChange(e);
                      }}
                      placeholder="Select Type"
                    />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Payment Type</label>
                    <ReactSelectSingle
                      filter
                      value={paymentSelect}
                      options={payment}
                      onChange={e => {
                        statePaymentChange(e);
                      }}
                      placeholder="Select Payment Type"
                    />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Company</label>
                    <ReactSelectSingle
                      filter
                      value={companySelect}
                      options={Company}
                      onChange={e => {
                        stateCompanyChange(e);
                      }}
                      placeholder="Select Payment Type"
                    />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Client Name</label>
                    <InputText
                      placeholder="Client  Name"
                      className="input_wrap"
                    />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Payment Receive In</label>
                    <ReactSelectSingle
                      filter
                      value={receiveSelect}
                      options={Receive}
                      onChange={e => {
                        stateReceiveChange(e);
                      }}
                      placeholder="Select Group"
                    />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Amount</label>
                    <InputText placeholder="₹ 00.00" className="input_wrap" />
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Current Client Balance</label>
                    <div className="balance_info">
                      <h2>₹ 15,000.00</h2>
                    </div>
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Balance</label>
                    <div className="balance_info">
                      <h2>₹ 15,000.00</h2>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <div className="form_group mb-3">
                <label htmlFor="Remark">Remark</label>
                <InputTextarea
                  placeholder="Write here"
                  id="Remark"
                  className="input_wrap"
                  rows={6}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between align-items-center">
            <Col lg={6}>
              <div className="Receipt_Payment_head_wrapper mb-3 mb-lg-0">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Settle invoice with this payment</h3>
                </div>
                <div className="Receipt_Payment_invoice_txt">
                  <h5 className="m-0">3 invoices Selected</h5>
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
            onSelectionChange={e => setSelectedProducts(e.value)}
            dataKey="id"
            selection={selectedProducts}
            footerColumnGroup={footerGroup}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
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
    </div>
  );
}
