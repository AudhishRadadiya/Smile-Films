import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import DownloadIcon from '../../../Assets/Images/download-icon.svg';

export const JournalData = [
  {
    cr_db: 'CR',
    client_name: 'ABC Company',
    debit: '₹ 0.00',
    credit: '₹ 25,000',
  },
  {
    cr_db: 'CR',
    client_name: 'ABC Company',
    debit: '₹ 0.00',
    credit: '₹ 25,000',
  },
];

export const EntryDetailsData = [
  {
    cr_db: 'CR',
    client: 'ABC Company',
    debit: '₹ 0.00',
    credit: '₹ 25,000',
  },
  {
    cr_db: 'DB',
    client: 'ABC Company',
    debit: '₹ 0.00',
    credit: '₹ 25,000',
  },
];

export default function ViewJournalEntry() {
  const [visible, setVisible] = useState(false);

  const JournalFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={2} />
        <Column footer="₹ 25,000" />
        <Column footer="₹ 25,000" />
      </Row>
    </ColumnGroup>
  );

  const EntryfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer="₹ 45,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border h-100">
        <div className="billing_heading">
          <Row className="align-items-center gy-3">
            <Col sm={5}>
              <div class="page_title">
                <h3 class="m-0">Journal Entry</h3>
              </div>
            </Col>
            <Col sm={7}>
              <ul className="billing-btn justify-content-sm-end">
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => setVisible(true)}
                  >
                    <img src={ShowIcon} alt="" /> Preview
                  </Button>
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
                      <h2>Journal Entry</h2>
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
                                Payment By : <span>ABC Company</span>
                              </h5>
                            </div>
                            <div className="user_bank_details">
                              <h5>
                                Receive by : <span>BCD Company</span>
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
                          value={EntryDetailsData}
                          sortField="price"
                          sortOrder={1}
                          rows={10}
                          footerColumnGroup={EntryfooterGroup}
                        >
                          <Column
                            field="cr_db"
                            header="CR/DB"
                            sortable
                          ></Column>
                          <Column
                            field="client"
                            header="Client"
                            sortable
                          ></Column>
                          <Column
                            field="debit"
                            header="Debit"
                            sortable
                          ></Column>
                          <Column
                            field="credit"
                            header="Credit"
                            sortable
                          ></Column>
                        </DataTable>
                      </div>
                      <div className="delete_btn_wrap">
                        <button
                          className="btn_primary"
                          onClick={() => setVisible(false)}
                        >
                          <img src={DownloadIcon} alt="downloadicon" /> Download
                        </button>
                      </div>
                    </div>
                  </Dialog>
                </li>
                <li>
                  <Link
                    className="btn_border_dark filter_btn"
                    to="/create-journal-entry"
                  >
                    <img src={EditIcon} alt="" /> Edit
                  </Link>
                </li>
                <li>
                  <Link
                    to="/journal-entry"
                    className="btn_border_dark filter_btn"
                  >
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
                  <h5 className="text_gray">Payment Company</h5>
                  <h5>ABC Company</h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Receive Company </h5>
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
                  <h5 className="text_gray">PayGroup Name</h5>
                  <h5>HDFC Bank</h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row>
              <Col lg={2}>
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Remark</h5>
                  <h5>No Comments</h5>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between g-2 align-items-center">
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
            value={JournalData}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={JournalFooterGroup}
          >
            <Column field="cr_db" header="CR/DB" sortable></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column field="debit" header="Debit" sortable></Column>
            <Column field="credit" header="Credit" sortable></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
