import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';

export const JournalData = [
  {
    item_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
];

export default function PaymentExpense() {
  const JournalFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={3} />
        <Column footer="₹ 25,000" />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border h-100">
        <div className="billing_heading">
          <Row className="align-items-center g-2">
            <Col sm={4}>
              <div class="page_title">
                <h3 class="m-0">Expense</h3>
              </div>
            </Col>
            <Col sm={8}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Link className="btn_border_dark filter_btn">
                    <img src={TrashIcon} alt="TrashIcon" /> Delete
                  </Link>
                </li>
                <li>
                  <Link
                    className="btn_border_dark filter_btn"
                    to="/create-expenses"
                  >
                    <img src={EditIcon} alt="" /> Edit
                  </Link>
                </li>
                <li>
                  <Link to="/expenses" className="btn_border_dark filter_btn">
                    Exit Page
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="p20 p10-sm border-bottom">
          <div className="client_pyment_wrapper">
            <Row>
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
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row className="g-3">
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Expense Category</h5>
                  <h5>Expense (Direct)</h5>
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
                  <h5 className="text_gray">Payment Out From</h5>
                  <h5>HDFC Bank</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Amount</h5>
                  <h5>₹ 45,000</h5>
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
          <Row className="justify-content-between align-items-center g-2">
            <Col lg={4} md={5}>
              <div className="Receipt_Payment_head_wrapper">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Add Expense Items</h3>
                </div>
              </div>
            </Col>
            <Col xxl={2} xl={3} lg={4} md={5}>
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
            value={JournalData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={JournalFooterGroup}
          >
            <Column field="item_name" header="Item Name" sortable></Column>
            <Column field="quantity" header="Quantity" sortable></Column>
            <Column field="rate" header="Rate" sortable></Column>
            <Column field="amount_paid" header="Amount Paid" sortable></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
