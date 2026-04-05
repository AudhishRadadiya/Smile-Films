import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import DownloadIcon from '../../../Assets/Images/download-icon.svg';
import { useParams } from 'react-router-dom';
import { getJournalEntry } from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Loader from './../../Common/Loader';

export default function ViewJournalEntry() {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { getJournalEntryLoading } = useSelector(
    ({ journalEntry }) => journalEntry,
  );
  const [getJournalEntryDataFromAPI, setGetJournalEntryDataFromAPI] = useState(
    [],
  );

  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getJournalEntry({ journal_entry_id: id }))
      .then(res => {
        setGetJournalEntryDataFromAPI(res?.payload);
      })
      .catch(err => {
        console.error('Error while Fetching Journal Entry Data', err);
      });
  }, []);

  const JournalFooterGroup = data => (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={2} />
        <Column footer={`₹ ${data?.[0].credit ? data?.[0].credit : 0}`} />
        <Column footer={`₹ ${data?.[1].debit ? data?.[1].debit : 0}`} />
      </Row>
    </ColumnGroup>
  );

  const EntryfooterGroup = data => (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`₹ ${data?.total_amount ? data?.total_amount : 0}`}
          colSpan={2}
        />
      </Row>
    </ColumnGroup>
  );

  const crDb = data => {
    return data.type === 1 ? 'CR' : 'DB';
  };
  const AccountTemplate = data => {
    return data.type === 1
      ? data?.receive_client_name
      : data?.payment_company_name;
  };

  return (
    <div className="main_Wrapper">
      {getJournalEntryLoading && <Loader />}
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
                        <img
                          src={
                            getJournalEntryDataFromAPI?.company_logo
                              ? getJournalEntryDataFromAPI?.company_logo
                              : LogoImg
                          }
                          alt=""
                        />
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
                          <h5>
                            {getJournalEntryDataFromAPI?.company_name
                              ? getJournalEntryDataFromAPI?.company_name
                              : ''}
                          </h5>
                        </div>
                        <Row className="justify-content-between gy-3">
                          <Col sm={5}>
                            <div className="user_bank_details">
                              <h5>
                                Payment By: {'  '}
                                <span>
                                  {getJournalEntryDataFromAPI?.payment_company_name
                                    ? getJournalEntryDataFromAPI?.payment_company_name
                                    : ''}
                                </span>
                              </h5>
                            </div>
                            <div className="user_bank_details">
                              <h5>
                                Receive by:{' '}
                                <span>
                                  {getJournalEntryDataFromAPI?.receive_client_name
                                    ? getJournalEntryDataFromAPI?.receive_client_name
                                    : ''}
                                </span>
                              </h5>
                            </div>
                          </Col>
                          <Col sm={5}>
                            <div className="user_bank_details bank_details_light">
                              <h5>
                                Payment No
                                <span>
                                  {getJournalEntryDataFromAPI?.payment_no
                                    ? getJournalEntryDataFromAPI?.payment_no
                                    : 0}
                                </span>
                              </h5>
                            </div>
                            <div className="user_bank_details bank_details_light">
                              <h5>
                                Payment Date
                                <span>
                                  {getJournalEntryDataFromAPI?.create_date
                                    ? moment(
                                        getJournalEntryDataFromAPI?.create_date,
                                      ).format('DD-MM-YYYY')
                                    : ''}
                                </span>
                              </h5>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="data_table_wrapper max_height border radius15 overflow-hidden">
                        <DataTable
                          value={
                            getJournalEntryDataFromAPI?.journalEntryDetails
                              ? getJournalEntryDataFromAPI?.journalEntryDetails
                              : []
                          }
                          sortField="price"
                          sortOrder={1}
                          rows={10}
                          footerColumnGroup={EntryfooterGroup(
                            getJournalEntryDataFromAPI,
                          )}
                        >
                          <Column
                            field="cr_db"
                            header="CR/DB"
                            body={crDb}
                          ></Column>
                          <Column
                            field="account_id"
                            header="Account Name"
                            body={AccountTemplate}
                          ></Column>
                          <Column field="debit" header="Debit"></Column>
                          <Column field="credit" header="Credit"></Column>
                        </DataTable>
                      </div>
                      <div className="delete_btn_wrap">
                        <button
                          className="btn_primary"
                          onClick={() => {
                            dispatch(
                              getJournalEntry({
                                journal_entry_id: id,
                                pdf: true,
                              }),
                            );
                            setVisible(false);
                          }}
                        >
                          <img src={DownloadIcon} alt="downloadicon" />
                          Download
                        </button>
                      </div>
                    </div>
                  </Dialog>
                </li>
                <li>
                  <Link
                    className="btn_border_dark filter_btn"
                    to={`/edit-journal-entry/${id}`}
                  >
                    <img src={EditIcon} alt="" /> Edit
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
                  <h4>
                    {getJournalEntryDataFromAPI?.payment_no
                      ? getJournalEntryDataFromAPI?.payment_no
                      : 0}
                  </h4>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5>Create Date</h5>
                  <h4>
                    {getJournalEntryDataFromAPI?.create_date
                      ? moment(getJournalEntryDataFromAPI?.create_date).format(
                          'DD-MM-YYYY',
                        )
                      : ''}
                  </h4>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row className="g-3">
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Payment Company</h5>
                  <h5>
                    {getJournalEntryDataFromAPI?.payment_company_name
                      ? getJournalEntryDataFromAPI?.payment_company_name
                      : ''}
                  </h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Receive Company </h5>
                  <h5>
                    {getJournalEntryDataFromAPI?.receive_client_name
                      ? getJournalEntryDataFromAPI?.receive_client_name
                      : ''}
                  </h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Payment Type</h5>
                  <h5>
                    {getJournalEntryDataFromAPI?.payment_type &&
                    getJournalEntryDataFromAPI?.payment_type === 1
                      ? 'Cash'
                      : getJournalEntryDataFromAPI?.payment_type === 2
                      ? 'Bank'
                      : getJournalEntryDataFromAPI?.payment_type === 3
                      ? 'Check'
                      : null}
                  </h5>
                </div>
              </Col>
              <Col lg={2} md={3} sm={4} className="col-6">
                <div className="client_pyment_wrap">
                  {getJournalEntryDataFromAPI?.payment_type === 2 && (
                    <>
                      <h5 className="text_gray">PayGroup Name</h5>
                      <h5>
                        {getJournalEntryDataFromAPI?.group_name
                          ? getJournalEntryDataFromAPI?.group_name
                          : ''}
                      </h5>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_pyment_details">
            <Row>
              <Col lg={2}>
                <div className="client_pyment_wrap">
                  <h5 className="text_gray">Description</h5>
                  <h5>
                    {getJournalEntryDataFromAPI?.remark
                      ? getJournalEntryDataFromAPI?.remark
                      : '-'}
                  </h5>
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
                  <h3 className="m-0">Payment Transaction Record</h3>
                </div>
              </div>
            </Col>
            <Col lg={2}>
              {/* <div className="form_group">
                <InputText
                  id="search"
                  placeholder="Search"
                  type="search"
                  className="input_wrap small search_wrap"
                />
              </div> */}
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper max_height">
          <DataTable
            value={
              getJournalEntryDataFromAPI?.journalEntryDetails
                ? getJournalEntryDataFromAPI.journalEntryDetails
                : []
            }
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={JournalFooterGroup(
              getJournalEntryDataFromAPI?.journalEntryDetails,
            )}
          >
            <Column field="type" header="CR/DB" body={crDb}></Column>
            <Column
              field="account_id"
              header="Account Name"
              body={AccountTemplate}
            ></Column>
            <Column field="debit" header="Debit"></Column>
            <Column field="credit" header="Credit"></Column>
          </DataTable>
        </div>
        <div class="title_right_wrapper">
          <ul class="justify-content-end">
            <li>
              <button
                class="p-button p-component btn_border_dark filter_btn"
                data-pc-name="button"
                data-pc-section="root"
                onClick={() => {
                  navigate('/journal-entry');
                }}
              >
                Exit Page
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
