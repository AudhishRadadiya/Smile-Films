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

export const JornalEntryData = [
  {
    client_name: 'ABC Company',
    debit: '₹ 0.00',
    credit: '₹ 25,000',
  },
  {
    client_name: 'BCD Company',
    debit: '₹ 25,000',
    credit: '₹ 0.00',
  },
];

export default function CreateJournalEntry() {
  const [date, setDate] = useState();
  const [journalSelect, setJournalSelect] = useState([]);
  const [entrySelect, setEntrySelect] = useState([]);
  const [tableSelect, setTableSelect] = useState([]);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={2} />
        <Column footer="₹ 25,000" />
        <Column footer="₹ 25,000" />
      </Row>
    </ColumnGroup>
  );

  const stateJournalChange = e => {
    setJournalSelect(e.value);
  };

  const stateEntryChange = e => {
    setEntrySelect(e.value);
  };

  const stateTableChange = e => {
    setTableSelect(e.value);
  };

  const payment = [
    { label: 'Case', value: 'Case' },
    { label: 'Bank', value: 'Bank' },
    { label: 'Cheque', value: 'Cheque' },
  ];
  const PaymentGroup = [
    { label: 'Expenses Group', value: 'expenses group' },
    { label: 'Bank Fee and Charges', value: 'bank fee and charges' },
    {
      label: 'Employee Salaries & Advances',
      value: 'employee salaries & advances',
    },
    { label: 'Raw Material', value: 'raw material' },
  ];
  const TableGroup = [
    { label: 'CR', value: 'cr' },
    { label: 'DB', value: 'db' },
  ];

  const CrDbTemplet = () => {
    return (
      <div className="table_select">
        <div className="form_group">
          {/* <label>Payment Type</label> */}
          <ReactSelectSingle
            filter
            value={tableSelect}
            options={TableGroup}
            onChange={e => {
              stateTableChange(e);
            }}
            placeholder="CR"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border h-100">
        <div className="billing_heading">
          <Row className="align-items-center g-2">
            <Col sm={6}>
              <div class="page_title">
                <h3 class="m-0">Record Journal Entry</h3>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Link
                    to="/journal-entry"
                    className="btn_border_dark filter_btn"
                  >
                    Exit Page
                  </Link>
                </li>
                <li>
                  <Link to="/journal-entry" className="btn_primary filter_btn">
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
                <Col xxl={2} xl={3} lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Payment No</label>
                    <InputText placeholder="#564892" className="input_wrap" />
                  </div>
                </Col>
                <Col xxl={2} xl={3} lg={4} md={6}>
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
              <Row>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>Payment Type</label>
                    <ReactSelectSingle
                      filter
                      value={journalSelect}
                      options={payment}
                      onChange={e => {
                        stateJournalChange(e);
                      }}
                      placeholder="Select Payment Type"
                    />
                  </div>
                  <div className="form_group mb-3 mb-md-0">
                    <label>Payment Group</label>
                    <ReactSelectSingle
                      filter
                      value={entrySelect}
                      options={PaymentGroup}
                      onChange={e => {
                        stateEntryChange(e);
                      }}
                      placeholder="Select Payment Type"
                    />
                  </div>
                </Col>
                <Col lg={8} md={6}>
                  <div className="form_group">
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
            </Col>
          </Row>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between align-items-center">
            <Col lg={6}>
              <div className="Receipt_Payment_head_wrapper">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Payment Transection Record</h3>
                </div>
              </div>
            </Col>
            <Col lg={2}>
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
            value={JornalEntryData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={footerGroup}
          >
            <Column
              field="cr-db"
              header="CR/DB"
              sortable
              body={CrDbTemplet}
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column field="debit" header="Debit" sortable></Column>
            <Column field="credit" header="Credit" sortable></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
