import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import { ColumnGroup } from 'primereact/columngroup';

export const TransactionData = [
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    credit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    credit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    credit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    credit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    credit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    details: 'Invoice #123256',
    debit_amount: '₹ 6,000',
    closing_amount: '₹ 6,000',
  },
];

export default function Transaction() {
  const [date, setDate] = useState();

  const TransactionfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={4} />
        <Column footer="₹ 60,000" />
      </Row>
    </ColumnGroup>
  );

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
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={TransactionData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={TransactionfooterGroup}
          >
            <Column field="entry_date" header="Entry Date" sortable></Column>
            <Column field="details" header="Details" sortable></Column>
            <Column
              field="credit_amount"
              header="Credit Amount"
              sortable
            ></Column>
            <Column
              field="debit_amount"
              header="Debit Amount"
              sortable
            ></Column>
            <Column
              field="closing_amount"
              header="Closing Amount"
              sortable
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
