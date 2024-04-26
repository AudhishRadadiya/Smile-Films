import React, { useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';

export const JornalEntryData = [
  {
    item_service_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_service_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
  {
    item_service_name: '27/07/2023',
    quantity: '2',
    rate: '₹ 10,000',
    amount_paid: '₹ 20,000',
  },
];

export default function RecordExpenses() {
  const [date, setDate] = useState();
  const [categorySelect, setCategorySelect] = useState([]);
  const [paymentSelect, setPaymentSelect] = useState([]);
  const [outfromSelect, setOutFromSelect] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId] = useState('');

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={3} />
        <Column footer="₹ 25,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const stateCategoryChange = e => {
    setCategorySelect(e.value);
  };
  const statePaymentChange = e => {
    setPaymentSelect(e.value);
  };
  const stateOutFromChange = e => {
    setOutFromSelect(e.value);
  };

  const Category = [
    { label: 'Expenses Group', value: 'expenses group' },
    { label: 'Bank Fee and Charges', value: 'bank fee and charges' },
    {
      label: 'Employee Salaries & Advances',
      value: 'employee salaries & advances',
    },
    { label: 'Raw Material', value: 'raw material' },
  ];
  const Payment = [
    { label: 'Case', value: 'Case' },
    { label: 'Bank', value: 'Bank' },
    { label: 'Cheque', value: 'Cheque' },
  ];
  const Outfrom = [
    { label: 'Expenses Group', value: 'expenses group' },
    { label: 'Bank Fee and Charges', value: 'bank fee and charges' },
    {
      label: 'Employee Salaries & Advances',
      value: 'employee salaries & advances',
    },
    { label: 'Raw Material', value: 'raw material' },
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
          <Row className="align-items-center g-2">
            <Col sm={6}>
              <div class="page_title">
                <h3 class="m-0">Record Expense</h3>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Link to="/expenses" className="btn_border_dark filter_btn">
                    Exit Page
                  </Link>
                </li>
                <li>
                  <Link className="btn_primary filter_btn" to="/expenses">
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
                <label>Expense Category</label>
                <ReactSelectSingle
                  filter
                  value={categorySelect}
                  options={Category}
                  onChange={e => {
                    stateCategoryChange(e);
                  }}
                  placeholder="Select Category"
                />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Payment Type</label>
                <ReactSelectSingle
                  filter
                  value={paymentSelect}
                  options={Payment}
                  onChange={e => {
                    statePaymentChange(e);
                  }}
                  placeholder="Select Payment Type"
                />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Payment Out From</label>
                <ReactSelectSingle
                  filter
                  value={outfromSelect}
                  options={Outfrom}
                  onChange={e => {
                    stateOutFromChange(e);
                  }}
                  placeholder="Select Group"
                />
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Amount</label>
                <InputText
                  placeholder="₹ 00.00"
                  type="number"
                  className="input_wrap"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="form_group mb-3">
                <label>Remark</label>
                <InputText placeholder="Write here" className="input_wrap" />
              </div>
            </Col>
          </Row>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between align-items-center">
            <Col lg={6} md={4}>
              <div className="Receipt_Payment_head_wrapper">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Item/ Service</h3>
                </div>
              </div>
            </Col>
            <Col xxl={4} xl={5} lg={6} md={7}>
              <div className="d-flex align-items-center flex-wrap gap-2 gap-sm-3 justify-content-end mt-3 mt-md-0">
                <div className="form_group">
                  <InputText
                    id="search"
                    placeholder="Search"
                    type="search"
                    className="input_wrap small search_wrap"
                  />
                </div>
                <Button className="btn_primary filter_btn">
                  <img src={PlusIcon} alt="" /> Add Line
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper max_height">
          <DataTable
            value={JornalEntryData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={footerGroup}
          >
            <Column
              field="item_service_name"
              header="Item/Service Name"
              sortable
            ></Column>
            <Column field="quantity" header="Quantity" sortable></Column>
            <Column field="rate" header="Rate" sortable></Column>
            <Column field="amount_paid" header="Amount Paid" sortable></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={ActionTemplet}
            ></Column>
          </DataTable>
        </div>
      </div>

      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
