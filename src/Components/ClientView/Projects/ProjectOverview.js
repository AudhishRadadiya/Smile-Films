import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Link, useParams } from 'react-router-dom';
import { ColumnGroup } from 'primereact/columngroup';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import EmailIcon from '../../../Assets/Images/email-icon.svg';
import ProjectQuotation from './ProjectQuotation';
import { useDispatch, useSelector } from 'react-redux';
import { getClientProjectOverviewData } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import Loader from 'Components/Common/Loader';

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

export default function ProjectOverview() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { clientProjectOverviewData, clientProjectOverviewLoading } =
    useSelector(({ clientProject }) => clientProject);

  useEffect(() => {
    dispatch(
      getClientProjectOverviewData({
        order_id: id,
      }),
    );
  }, [dispatch, id]);

  return (
    <div className="overview_wrap p20 p15-sm">
      {clientProjectOverviewLoading && <Loader />}
      <Row className="g-3">
        <Col lg={5}>
          <div className="project_wapper">
            <div className="project_inner">
              <ul>
                <li>
                  <h5 className="text_gray">Work Type</h5>
                  <h3 className="fw_500">
                    {clientProjectOverviewData?.inquiry_type}
                  </h3>
                </li>
                <li>
                  <h5 className="text_gray">Project No</h5>
                  <h3 className="fw_500">
                    {clientProjectOverviewData?.inquiry_no}
                  </h3>
                </li>
                <li>
                  <h5 className="text_gray">Create Date</h5>
                  <h3 className="fw_500">
                    {clientProjectOverviewData?.create_date}
                  </h3>
                </li>
              </ul>
            </div>
            <div className="project_inner">
              <ul>
                <li>
                  <h5 className="text_gray">Due Date</h5>
                  <h3>{clientProjectOverviewData?.due_date}</h3>
                </li>
                <li>
                  <h5 className="text_gray">Data Size</h5>
                  <h3>{clientProjectOverviewData?.data_size} GB</h3>
                </li>
                <li>
                  <h5 className="text_gray">Couple Name</h5>
                  <h3>{clientProjectOverviewData?.couple_name}</h3>
                </li>
                <li>
                  <h5 className="text_gray">Projects Type</h5>
                  <h3>{clientProjectOverviewData?.project_type}</h3>
                </li>
              </ul>
            </div>
            <div className="project_inner project_inner_wrap">
              <ul>
                <li>
                  <h5 className="text_gray">Items</h5>
                  {/* <ul>
                    <li>Wedding Package</li>
                    <li>- Highlights Video</li>
                    <li>- Teaser</li>
                    <li>- Tradition Video</li>
                  </ul> */}
                  <ul>
                    {clientProjectOverviewData?.item_name?.map(
                      (itemName, index) => (
                        <li key={index}>{itemName}</li>
                      ),
                    )}
                  </ul>
                </li>
                {/* <li>
                  <ul className="mt-4">
                    <li>Pre-Wedding</li>
                    <li>Teaser</li>
                  </ul>
                </li> */}
              </ul>
            </div>
            <div className="project_inner">
              <ul>
                <li>
                  <h5 className="text_gray">Remark</h5>
                  <h3>{clientProjectOverviewData?.remark}</h3>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col lg={7}>
          {/* <div class="quotation-details-wrapper mb-3 border radius15">
            <div class="quotation-details-head p10 border-bottom">
              <h3 class="fw_600 m-0">Quotation</h3>
            </div>

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
                          <h6 class="text_green mb-1 me-2">
                            Approved By ABC Enterprise
                          </h6>
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
                <li>
                  <Row>
                    <Col xl={6} lg={12} md={6}>
                      <div className="quotation_name">
                        <h5>Quotation Pre-Wedding package 2</h5>
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
                <li>
                  <Row>
                    <Col xl={6} lg={12} md={6}>
                      <div className="quotation_name">
                        <h5>Quotation Pre-Wedding package 2</h5>
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
          <div class="quotation-details-wrapper mb-3 border radius15">
            <div class="quotation-details-head p10 border-bottom">
              <h3 class="fw_600 m-0">Billing</h3>
            </div>

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
                          <h6 className="text_gray m-0 me-2">
                            Pending Due Date 27/07/23{' '}
                          </h6>
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
          <div class="quotation-details-wrapper border radius15">
            <div class="quotation-details-head p10 border-bottom">
              <h3 class="fw_600 m-0">Final Work</h3>
            </div>

            <div className="saved_quotation py20 px10">
              <Link to="/" className="link_text_blue">
                <p className="m-0">
                  https://www.example.nl.examplelogin.nl/mail/login/
                </p>
              </Link>
            </div>
          </div> */}
          <ProjectQuotation />
        </Col>
      </Row>

      {/* <Dialog
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
            <Row className="justify-content-between">
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
      </Dialog> */}
    </div>
  );
}
