import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import DowanloadIcon from '../../../Assets/Images/download-icon.svg';
import Eyes from '../../../Assets/Images/eyes.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
export const employeeData = [
  {
    date: '01/07/2023',
    transactions_type: 'Opening Balance',
    credit_amount: '₹ 40,000',
    debit_amount: '',
    closing_amount: '₹ 40,000',
  },
  {
    date: '31/07/2023',
    transactions_type: 'Payment Received',
    credit_amount: '',
    debit_amount: '₹ 35,000',
    closing_amount: '₹ 5000',
  },
  {
    date: '27/08/2023',
    transactions_type: 'B-pmt',
    credit_amount: '₹ 5000',
    debit_amount: '',
    closing_amount: '₹ 10,000',
  },
  {
    date: '30/08/2023',
    transactions_type: 'B-pmt Payment Received ',
    credit_amount: '₹ 1,00,000',
    debit_amount: '',
    closing_amount: '₹ 1,10,000',
  },
];

export default function CompanyTransactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);
  const [previewModel, setPreviewModel] = useState(false);

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

  return (
    <div className="transaction_wrap">
      <div className="table_main_Wrapper rounded-0 border-0">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Transactions</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group date_select_wrapper text-end">
                      <Calendar
                        id="Creat Date"
                        placeholder="Select Date"
                        showIcon
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        selectionMode="range"
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => setPreviewModel(true)}
                      to="/create-employee"
                      className="btn_border_dark"
                    >
                      <img src={Eyes} alt="" /> Preview
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper transaction_table_wrapper">
          <DataTable
            value={employeeData}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="date" header="Date" sortable></Column>
            <Column
              field="transactions_type"
              header="Transactions Type"
              sortable
            ></Column>
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
          <CustomPaginator
            dataList={employeeData}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={employeeData?.length}
          />
        </div>
      </div>
      <Dialog
        header={
          <h5 className="m-0 text-center">
            Customer Statement for Rupesh Zalavadiya
          </h5>
        }
        visible={previewModel}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={() => setPreviewModel(false)}
      >
        <div className="customer_statement_wrap">
          <Row>
            <Col lg={6}>
              <h3>Smile Filmes, Gujarat, India</h3>
              <h3>kapil.codezee@gmail.com</h3>
            </Col>
            <Col lg={6}>
              <div className="text-end">
                <h3>kapil.codezee@gmail.com</h3>
                <h4 className="text_dark">01/08/2023 To 31/08/2023</h4>
              </div>
            </Col>
            <Col lg={12} className="my20">
              <h5>Rupesh Zalavadiya</h5>
              <h5>Station road Surat, 395004 Gujarat, India</h5>
            </Col>
          </Row>
          <div className="data_table_wrapper max_height">
            <DataTable
              value={employeeData}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column field="date" header="Date" sortable></Column>
              <Column
                field="transactions_type"
                header="Transactions Type"
                sortable
              ></Column>
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
          <Row className="justify-content-end my20">
            <Col lg={6}>
              <div className="balance_box p20 border radius6">
                <ul>
                  <li>
                    <label>Opening Balance</label>
                    <span>₹ 40,000</span>
                  </li>
                  <li>
                    <label>Credit Amount</label>
                    <span>₹ 1,45,000</span>
                  </li>
                  <li>
                    <label>Debit Amount</label>
                    <span>₹ 35,000</span>
                  </li>
                  <li>
                    <label>Closing Balance</label>
                    <span>₹1, 10, 000</span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="text-end">
            <Button className="btn_primary">
              <img src={DowanloadIcon} alt="DowanloadIcon" />
              Download
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
