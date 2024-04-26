import React, { useState, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { Calendar } from 'primereact/calendar';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';

export const InvoiceData = [
  {
    item_name: 'Laptop',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_name: 'Laptop',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_name: 'Laptop',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
];

export default function CreatePurchaseInvoice() {
  const [subTotal, setSubTotal] = useState(false);
  const [invoicetempSelect, setInvoiceTempSelect] = useState([]);
  const [date, setDate] = useState();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId] = useState('');

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={3} />
        <Column footer="₹ 33,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const stateInvoiceTempChange = e => {
    setInvoiceTempSelect(e.value);
  };

  const InvoiceTemp = [
    { label: 'ABC Company', value: 'abc company' },
    { label: 'BCD Company', value: 'bcd company' },
    { label: 'EFG Company', value: 'efg company' },
  ];

  const handleDelete = useCallback(async => {
    setDeletePopup(false);
  }, []);

  const ActionTemplet = () => {
    return (
      <div className="dropdown_action_wrap">
        <Button
          onClick={() => {
            setDeletePopup(true);
          }}
          className="btn_transparent"
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border">
        <div className="billing_heading">
          <Row className="align-items-center gy-3">
            <Col sm={6}>
              <div class="page_title">
                <h3 class="m-0">Record Purchase Invoice</h3>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Link
                    to="/purchase-invoice"
                    className="btn_border_dark filter_btn"
                  >
                    Exit Page
                  </Link>
                </li>
                <li>
                  <Link
                    to="/purchase-invoice"
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
            <Col xxl={3} xl={5} lg={6}>
              <Row>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label>Expense No</label>
                    <InputText placeholder="#564892" className="input_wrap" />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form_group mb-3">
                    <label>Create Date</label>
                    <div className="date_select text-end">
                      <Calendar
                        value={date}
                        placeholder="30/06/2023"
                        onChange={e => setDate(e.value)}
                        showIcon
                        className="w-100"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Company</label>
                <ReactSelectSingle
                  filter
                  value={invoicetempSelect}
                  options={InvoiceTemp}
                  onChange={e => {
                    stateInvoiceTempChange(e);
                  }}
                  placeholder="Select Company"
                />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Client Name</label>
                <InputText placeholder="Client Name" className="input_wrap" />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Email Address</label>
                <InputText
                  placeholder="Write email address"
                  className="input_wrap"
                />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Phone Number</label>
                <InputText
                  placeholder="Write number"
                  type="number"
                  className="input_wrap"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="form_group">
                <label>Remark</label>
                <InputText placeholder="Write here" className="input_wrap" />
              </div>
            </Col>
          </Row>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between g-2 align-items-center">
            <Col md={6}>
              <div className="Receipt_Payment_head_wrapper">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Add Expense Items</h3>
                </div>
              </div>
            </Col>
            <Col lg={3} md={5}>
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
        <div className="billing_details p-0">
          <div className="data_table_wrapper max_height border border-bottom-0 overflow-hidden">
            <DataTable
              value={InvoiceData}
              sortField="price"
              sortOrder={1}
              footerColumnGroup={footerGroup}
              rows={10}
            >
              <Column field="item_name" header="Item Name" sortable></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column
                field="amount_paid"
                header="Amount Paid"
                sortable
              ></Column>
              <Column
                field="action"
                header="Action"
                sortable
                body={ActionTemplet}
              ></Column>
            </DataTable>
          </div>
          <div className="amount_condition p20 p15-lg">
            <Row className="justify-content-between g-3">
              <Col xxl={4} xl={5} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="p20 border-bottom">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div className="condition-content p20">
                    <ul>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xxl={4} xl={5} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>₹ 33,000</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setSubTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Additional Charges
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700">₹ 33,000</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* additional charges popup */}
      <Dialog
        className="modal_Wrapper modal_small"
        visible={subTotal}
        onHide={() => setSubTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setSubTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setSubTotal(false)}>
            Save
          </button>
        </div>
      </Dialog>

      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
