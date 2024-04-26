import React, { useState, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Link } from 'react-router-dom';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ShowIcon from '../../Assets/Images/show-icon.svg';
import LogoImg from '../../Assets/Images/logo.svg';
import PdfIcon from '../../Assets/Images/pdf-icon.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import EmailIcon from '../../Assets/Images/email-icon.svg';
import TrashIcon from '../../Assets/Images/trash.svg';

export const QuotationViewData = [
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    qty: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
];

export const QuotationData = [
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
  },
];

export default function Quotation() {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState();
  const [quotationItems, setQuotationItems] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId] = useState('');

  const QuotationfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer="₹ 60,000" />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Quantity" colSpan={5} />
        <Column footer="₹ 60,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const DescriptionTemplate = () => {
    return (
      <>
        <div className="description_text">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the
          </p>
        </div>
      </>
    );
  };

  const EventBodyTemplet = () => {
    return (
      <div className="event_date_select">
        <div className="form_group mb-3">
          <div className="date_select">
            <Calendar
              value={date}
              placeholder="27/08/2023"
              onChange={e => setDate(e.value)}
              showIcon
            />
          </div>
        </div>
      </div>
    );
  };

  const handleDelete = useCallback(async => {
    setDeletePopup(false);
  }, []);

  const ActionBodyTemplet = () => {
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

  const QuotationItems = [
    {
      label: 'Packages',
      code: 'DE',
      items: [
        {
          label: 'Video & Highlight Package',
          value: 'Video & Highlight Package',
        },
        { label: 'Bronze Wedding Packege', value: 'Bronze Wedding Packege' },
        { label: 'Wedding & Reel Packeg', value: 'Wedding & Reel Packeg' },
      ],
    },
    {
      label: 'Products',
      code: 'US',
      items: [
        { label: 'Reels', value: 'Reels' },
        { label: 'Instagram Post', value: 'Instagram Post' },
        { label: 'Highlights', value: 'Highlights' },
        { label: 'Teaser', value: 'Teaser' },
      ],
    },
  ];

  const quotationItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <div className="main_Wrapper">
      <div className="processing_main bg-white radius15 border">
        <div className="billing_heading">
          <div className="processing_bar_wrapper">
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Order Form</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Quotation</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap next">
              <h4 className="m-0">Quotes Approve</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Assign to Exposer</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Overview</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Completed</h4>
              <span className="line"></span>
            </div>
          </div>
        </div>
        <div className="billing_details">
          <Row className="g-3 g-sm-4">
            <Col lg={8}>
              <div className="process_order_wrap p-0 pb-3 mb20">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        <Link to="/order-form">
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Link>
                        <h2 className="m-0 ms-2 fw_500">Quotation</h2>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="date_number">
                      <ul className="justify-content-end">
                        <li>
                          <h6>Order No.</h6>
                          <h4>#564892</h4>
                        </li>
                        <li>
                          <h6>Creat Date</h6>
                          <h4>27/06/2023</h4>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job_company">
                <Row className="g-3 g-sm-4">
                  <Col md={6}>
                    <div className="order-details-wrapper mb-3 p10 border radius15">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Job</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Dates :</span>
                            <h5>27/08/2023 To 29/08/2023</h5>
                          </div>
                          <div className="order-date">
                            <span>Venue :</span>
                            <h5>Omkar Exotica, Ankleswar</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="order-details-wrapper mb-3 p10 border radius15">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Company</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Company Name :</span>
                            <h5>ABC Enterprise</h5>
                          </div>
                          <div className="order-date">
                            <span>Client Name :</span>
                            <h5>Rajesh Singhania</h5>
                          </div>
                        </div>
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Phone No :</span>
                            <h5>+91 9876541230</h5>
                          </div>
                          <div className="order-date">
                            <span>Email :</span>
                            <h5>rajeshsinghania@gmail.com</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={4}>
              <div class="quotation-details-wrapper mb-3 h-100 border radius15">
                <div class="p10 border-bottom">
                  <h6 class="m-0">Quotation</h6>
                </div>
                {/* <div class="quotation_save_data">
                  <h6>No Quotation saved</h6>
                </div> */}
                <div className="saved_quotation p10">
                  <ul>
                    <li>
                      <Row>
                        <Col xl={6} lg={12} md={6}>
                          <div className="quotation_name">
                            <h5>Quotation Wedding Shooting</h5>
                            <h5 className="fw_400 m-0">₹ 40,000</h5>
                          </div>
                        </Col>
                        <Col xl={6} lg={12} md={6}>
                          <div className="quotation_view d-flex justify-content-end align-items-center">
                            <div className="aprroved_box text-end">
                              <h6 className="text_gray m-0 me-2">Pending</h6>
                            </div>
                            <Button
                              className="btn_border_dark filter_btn"
                              onClick={() => setVisible(true)}
                            >
                              <img src={ShowIcon} alt="" /> View
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
          <div className="order_items">
            <h3>Quotation Details</h3>
            <Row className="justify-content-between">
              <Col xxl={2} xl={4} lg={5}>
                <div class="form_group">
                  <MultiSelect
                    filter
                    value={quotationItems}
                    options={QuotationItems}
                    onChange={e => setQuotationItems(e.value)}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={quotationItemsTemplate}
                    placeholder="Select Exposing Items"
                    display="chip"
                    className="w-100"
                  />
                </div>
              </Col>
              <Col xl={4} lg={6}>
                <div className="form_group d-block align-items-center d-sm-flex mt-3 mt-lg-0">
                  <label className="me-3 mb-0 fw_500 text-nowrap mb-2 mb-sm-0">
                    Name the Quotation
                  </label>
                  <InputText
                    placeholder="Quotation Wedding package 1"
                    className="input_wrap"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={QuotationData}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={footerGroup}
            >
              <Column field="item" header="Item" sortable></Column>
              <Column
                field="description"
                header="Description"
                body={DescriptionTemplate}
                sortable
              ></Column>
              <Column
                field="event_date"
                header="Event Date"
                sortable
                body={EventBodyTemplet}
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column
                field="action"
                header="Action"
                sortable
                body={ActionBodyTemplet}
              ></Column>
            </DataTable>
          </div>
          <div className="amount_condition pt20">
            <Row className="justify-content-between">
              <Col lg={5} md={6}>
                <div className="amount-condition-wrapper border radius15 mb-3 mb-md-0">
                  <div className="p20 p10-md border-bottom">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div className="condition-content p20 p15-sm">
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
              <Col xl={4} md={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20 p15-sm">
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
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
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
                        <h5>Tax</h5>
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
          <div class="delete_btn_wrap mt-4 p-0 text-end">
            <Link to="/exposing" class="btn_border_dark">
              Exit Page
            </Link>
            <Link to="/quotes-approve" class="btn_primary">
              Save
            </Link>
          </div>
        </div>
      </div>

      <Dialog
        header={
          <div className="dialog_logo">
            <img src={LogoImg} alt="" />
          </div>
        }
        className="modal_Wrapper payment_dialog quotation_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Quotation</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between gy-3">
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>Smile Films</h5>
                </div>
                <div className="user_bank_details">
                  <p>
                    406 DHARA ARCADE, NEAR MAHADEV CHOWK MOTA VARACHHA SURAT
                    GUJARAT 394101
                  </p>
                </div>
              </Col>
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>Quotation Wedding Shooting</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No <span>52123</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date <span>20 May 20219</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={QuotationViewData}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={QuotationfooterGroup}
            >
              <Column field="item" header="Item" sortable></Column>
              <Column field="qty" header="Qty" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="quotation-wrapper amount_condition mt20">
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="pb10">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div className="condition-content">
                    <ul>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p className="m-0">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text-end">₹ 33,000</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">₹ 33,000</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="delete_btn_wrap">
            <button
              className="btn_border_dark"
              onClick={() => setVisible(false)}
            >
              <img src={EditIcon} alt="editicon" /> Edit Quotation
            </button>
            <button
              className="btn_border_dark"
              onClick={() => setVisible(false)}
            >
              <img src={EmailIcon} alt="EmailIcon" /> Send Email
            </button>
            <button
              className="btn_border_dark"
              onClick={() => setVisible(false)}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            <button className="btn_primary" onClick={() => setVisible(false)}>
              Mark as Approved
            </button>
          </div>
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
