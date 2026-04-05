import Loader from 'Components/Common/Loader';
import {
  editClientQuotation,
  getClientBilling,
  getClientBillingList,
  getClientQuotation,
  getClientQuotationList,
} from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { memo, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import { convertIntoNumber } from 'Helper/CommonHelper';

const ProjectQuotation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [billingPopup, setBillingPopup] = useState(false);

  const {
    clientBillingList,
    clientQuotationList,
    clientBillingLoading,
    clientQuotationLoading,
    selectedClientBillingData,
    clientProjectOverviewData,
    selectedClientQuotationData,
  } = useSelector(({ clientProject }) => clientProject);

  useEffect(() => {
    dispatch(
      getClientQuotationList({
        order_id: id,
      }),
    );
    dispatch(
      getClientBillingList({
        order_id: id,
      }),
    );
  }, [dispatch]);

  const handleMarkAsApprovedChange = () => {
    let payload = {
      quotation_id: selectedClientQuotationData?._id,
      status: 2,
    };
    dispatch(editClientQuotation(payload))
      .then(response => {
        setVisible(false);
        dispatch(
          getClientQuotationList({
            order_id: id,
          }),
        );
      })
      .catch(error => {
        console.error('Error fetching while edit data collection:', error);
      });
  };

  const viewQuotationRateTemplate = rowData => {
    return (
      <div className="d-flex gap-1">
        <span>
          {selectedClientQuotationData?.currency_symbol
            ? selectedClientQuotationData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.rate}</span>
      </div>
    );
  };

  const viewQuotationAmountTemplate = rowData => {
    return (
      <div className="d-flex gap-1">
        <span>
          {selectedClientQuotationData?.currency_symbol
            ? selectedClientQuotationData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount}</span>
      </div>
    );
  };

  const viewBillingRateTemplate = rowData => {
    return (
      <div className="d-flex gap-1">
        <span>
          {selectedClientBillingData?.currency_symbol
            ? selectedClientBillingData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.rate}</span>
      </div>
    );
  };

  const viewBillingAmountTemplate = rowData => {
    return (
      <div className="d-flex gap-1">
        <span>
          {selectedClientBillingData?.currency_symbol
            ? selectedClientBillingData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount}</span>
      </div>
    );
  };

  const QuotationfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`${
            selectedClientQuotationData?.currency_symbol
              ? selectedClientQuotationData?.currency_symbol
              : ''
          } ${
            selectedClientQuotationData?.sub_total
              ? selectedClientQuotationData?.sub_total
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );
  const BillingfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`${
            selectedClientBillingData?.currency_symbol
              ? selectedClientBillingData?.currency_symbol
              : ''
          } ${
            selectedClientBillingData?.sub_total
              ? selectedClientBillingData?.sub_total
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <div>
      {(clientQuotationLoading || clientBillingLoading) && <Loader />}
      <div class="quotation-details-wrapper mb-3 border radius15">
        <div class="quotation-details-head p10 border-bottom">
          <h3 class="fw_600 m-0">Quotation</h3>
        </div>

        <div className="saved_quotation p10">
          <ul>
            {clientQuotationList?.length > 0 &&
              clientQuotationList?.map((data, i) => {
                return (
                  <li key={i}>
                    <Row>
                      <Col xl={6} lg={12} md={6}>
                        <div className="quotation_name">
                          <h5>{data?.quotation_name}</h5>
                          <h5 className="fw_400 m-0">
                            {`${
                              data?.currency_symbol ? data?.currency_symbol : ''
                            } ${
                              data?.total_amount
                                ? convertIntoNumber(data?.total_amount)
                                : ''
                            }`}
                          </h5>
                        </div>
                      </Col>
                      <Col xl={6} lg={12} md={6}>
                        {data?.status === 1 && (
                          <div className="quotation_view d-flex justify-content-end align-items-center">
                            <div className="aprroved_box text-end">
                              <h6 class="text_green mb-1 me-2">Pending</h6>
                            </div>
                            <Button
                              className="btn_border_dark filter_btn"
                              onClick={() => {
                                dispatch(
                                  getClientQuotation({
                                    quotation_id: data?._id,
                                    pdf: false,
                                  }),
                                );
                                setVisible(true);
                              }}
                            >
                              <img src={ShowIcon} alt="" /> View
                            </Button>
                          </div>
                        )}
                        {data?.status === 2 && (
                          <div className="quotation_view d-flex justify-content-end align-items-center">
                            <div className="aprroved_box text-end">
                              <h6 class="text_green mb-1 me-2">
                                Approved By {data?.approved_by}
                              </h6>
                              <h6 className="text_gray m-0 me-2">
                                {' '}
                                {data?.approved_at &&
                                  moment(data?.approved_at)?.format(
                                    'DD-MM-YYYY',
                                  )}
                              </h6>
                            </div>
                            <Button
                              className="btn_border_dark filter_btn"
                              onClick={() => {
                                dispatch(
                                  getClientQuotation({
                                    quotation_id: data?._id,
                                    pdf: false,
                                  }),
                                );
                                setVisible(true);
                              }}
                            >
                              <img src={ShowIcon} alt="" /> View
                            </Button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </li>
                );
              })}
            {/* <li>
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
            </li> */}
          </ul>
        </div>
      </div>
      <div class="quotation-details-wrapper mb-3 border radius15">
        <div class="quotation-details-head p10 border-bottom">
          <h3 class="fw_600 m-0">Billing</h3>
        </div>
        <div className="saved_quotation p10">
          <ul>
            {clientBillingList &&
              clientBillingList?.length > 0 &&
              clientBillingList?.map((data, i) => {
                return (
                  <li key={i}>
                    <Row>
                      <Col xl={6} lg={12} md={6}>
                        <div className="quotation_name">
                          <h5>Invoice No. #{data?.invoice_no}</h5>
                          <h5 className="fw_400 m-0">{`${
                            data?.currency_symbol ? data?.currency_symbol : ''
                          } ${
                            data?.total_amount
                              ? convertIntoNumber(data?.total_amount)
                              : ''
                          }`}</h5>
                        </div>
                      </Col>
                      <Col xl={6} lg={12} md={6}>
                        <div className="quotation_view d-flex justify-content-end align-items-center">
                          <div className="aprroved_box text-end">
                            <h6 className="text_gray m-0 me-2">
                              Pending Due Date{' '}
                              {data?.created_at &&
                                moment(data?.created_at)?.format(
                                  'DD-MM-YYYY',
                                )}{' '}
                            </h6>
                          </div>
                          <Button
                            className="btn_border_dark filter_btn"
                            onClick={() => {
                              dispatch(
                                getClientBilling({
                                  invoice_id: data?._id,
                                  pdf: false,
                                }),
                              );
                              setBillingPopup(true);
                            }}
                          >
                            <img src={ShowIcon} alt="" /> View
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </li>
                );
              })}
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
              {/* https://www.example.nl.examplelogin.nl/mail/login/ */}
              {clientProjectOverviewData?.final_work}
            </p>
          </Link>
        </div>
      </div>

      <Dialog
        header={
          <div className="dialog_logo">
            <img
              src={
                selectedClientQuotationData?.company_logo
                  ? selectedClientQuotationData?.company_logo
                  : ''
              }
              alt=""
            />
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
                  <h5>{selectedClientQuotationData?.company_name}</h5>
                </div>
                <div className="user_bank_details">
                  <p>{selectedClientQuotationData?.company_address}</p>
                </div>
              </Col>
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>{selectedClientQuotationData?.quotation_name}</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No{' '}
                    <span>{selectedClientQuotationData?.order_no}</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date{' '}
                    <span>
                      {moment(selectedClientQuotationData?.created_at)?.format(
                        'DD-MM-YYYY',
                      )}
                    </span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Couple Name{' '}
                    <span>{selectedClientQuotationData?.couple_name}</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={selectedClientQuotationData?.quotation_detail}
              sortField="item_name"
              sortOrder={1}
              rows={10}
              footerColumnGroup={QuotationfooterGroup}
            >
              <Column field="item_name" header="Item" sortable></Column>
              <Column field="quantity" header="Qty" sortable></Column>
              <Column
                field="rate"
                header="Rate"
                sortable
                body={viewQuotationRateTemplate}
              ></Column>
              <Column
                field="amount"
                header="Amount"
                sortable
                body={viewQuotationAmountTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="quotation-wrapper amount_condition mt20">
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="pb10">
                    <h5 className="m-0">Terms & Condition</h5>
                  </div>
                  <div className="condition-content">
                    {/* <ul>
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
                    </ul> */}
                    {selectedClientQuotationData?.terms_condition}
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
                        <h5 className="text-end">
                          {selectedClientQuotationData?.currency_symbol
                            ? selectedClientQuotationData?.currency_symbol
                            : ''}{' '}
                          {selectedClientQuotationData?.sub_total}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedClientQuotationData?.currency_symbol
                            ? selectedClientQuotationData?.currency_symbol
                            : ''}{' '}
                          {selectedClientQuotationData?.discount}
                        </h5>
                      </div>
                    </div>
                    {/* <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div> */}
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedClientQuotationData?.currency_symbol
                            ? selectedClientQuotationData?.currency_symbol
                            : ''}{' '}
                          {selectedClientQuotationData?.tax}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">
                          {selectedClientQuotationData?.currency_symbol
                            ? selectedClientQuotationData?.currency_symbol
                            : ''}{' '}
                          {selectedClientQuotationData?.total_amount}
                        </h5>
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
              onClick={() => {
                dispatch(
                  getClientQuotation({
                    quotation_id: selectedClientQuotationData?._id,
                    pdf: true,
                  }),
                );
                setVisible(false);
              }}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedClientQuotationData?.status === 1 ? (
              <button
                className="btn_primary"
                onClick={() => {
                  handleMarkAsApprovedChange();
                }}
              >
                Mark as Approved
              </button>
            ) : (
              <span className="approved_button_Wrap">Approved</span>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        header={
          <div className="dialog_logo">
            {selectedClientQuotationData?.company_logo ? (
              <img
                src={
                  selectedClientQuotationData?.company_logo
                    ? selectedClientQuotationData?.company_logo
                    : ''
                }
                alt=""
              />
            ) : (
              ''
            )}
          </div>
        }
        className="modal_Wrapper payment_dialog quotation_dialog"
        visible={billingPopup}
        onHide={() => setBillingPopup(false)}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Invoice</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>{selectedClientBillingData?.company_name}</h5>
                </div>
                <div className="user_bank_details">
                  <p>{selectedClientBillingData?.company_address}</p>
                </div>
              </Col>
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>{selectedClientBillingData?.quotation_name}</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No <span>{selectedClientBillingData?.order_no}</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date
                    <span>
                      {moment(selectedClientBillingData?.created_at)?.format(
                        'DD-MM-YYYY',
                      )}
                    </span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Couple Name{' '}
                    <span>{selectedClientBillingData?.couple_name}</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={selectedClientBillingData?.quotation_detail}
              sortField="item_name"
              sortOrder={1}
              rows={10}
              footerColumnGroup={BillingfooterGroup}
            >
              <Column field="item_name" header="Item" sortable></Column>
              <Column field="quantity" header="Qty" sortable></Column>
              <Column
                field="rate"
                header="Rate"
                sortable
                body={viewBillingRateTemplate}
              ></Column>
              <Column
                field="amount"
                header="Amount"
                sortable
                body={viewBillingAmountTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="quotation-wrapper amount_condition mt20">
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="pb10">
                    <h5 className="m-0">Terms & Condition</h5>
                  </div>
                  <div className="condition-content">
                    {/* <ul>
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
                    </ul> */}
                    {selectedClientBillingData?.terms_condition}
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
                        <h5 className="text-end">
                          {selectedClientBillingData?.currency_symbol
                            ? selectedClientBillingData?.currency_symbol
                            : ''}{' '}
                          {selectedClientBillingData?.sub_total}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedClientBillingData?.currency_symbol
                            ? selectedClientBillingData?.currency_symbol
                            : ''}{' '}
                          {selectedClientBillingData?.discount}
                        </h5>
                      </div>
                    </div>
                    {/* <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">₹ 00.00</h5>
                      </div>
                    </div> */}
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedClientBillingData?.currency_symbol
                            ? selectedClientBillingData?.currency_symbol
                            : ''}{' '}
                          {selectedClientBillingData?.tax}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">
                          {selectedClientBillingData?.currency_symbol
                            ? selectedClientBillingData?.currency_symbol
                            : ''}{' '}
                          {selectedClientBillingData?.total_amount}
                        </h5>
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
              onClick={() => {
                dispatch(
                  getClientBilling({
                    invoice_id: selectedClientBillingData?._id,
                    pdf: true,
                  }),
                );
                setBillingPopup(false);
              }}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default memo(ProjectQuotation);
