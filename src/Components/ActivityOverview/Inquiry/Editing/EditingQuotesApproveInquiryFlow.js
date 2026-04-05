import React, { memo, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { InputText } from 'primereact/inputtext';
import ArrowIcon from '../../../../Assets/Images/left_arrow.svg';
import ShowIcon from '../../../../Assets/Images/show-icon.svg';
import PdfIcon from '../../../../Assets/Images/pdf-icon.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addInvoice,
  editQuotation,
  getEditingFlow,
  getQuotation,
  getQuotationList,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';
import {
  setInquiryFlowEditingQuotationData,
  setInquiryFlowEditingQuotesApprovedData,
  setInquirySelectedProgressIndex,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import { InputNumber } from 'primereact/inputnumber';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';

const EditingQuotesApproveInquiryFlow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [confornation, setConfornation] = useState(false);

  const { currencyList, currencyLoading } = useSelector(
    ({ currency }) => currency,
  );
  const { getInquiryStepData, inquiryFlowEditingQuotesApprovedData } =
    useSelector(({ inquiry }) => inquiry);
  const {
    editingLoading,
    quotationList,
    selectedQuatationData,
    quotationLoading,
    invoiceLoading,
  } = useSelector(({ editing }) => editing);

  useEffect(() => {
    dispatch(getEditingFlow({ order_id: id }))
      .then(response => {
        const responseData = response.payload;
        const updated = {
          inquiry_no: responseData?.inquiry_no,
          create_date: responseData?.create_date,
          item_name: responseData?.item_name,
          couple_name: responseData?.couple_name,
          data_size: convertIntoNumber(responseData?.data_size || 0),
          project_type_value: responseData?.project_type_value,
          due_date: responseData?.due_date,
          company_name: responseData?.company_name,
          client_full_name: responseData?.client_full_name,
          client_company_id: responseData?.client_company_id,
          mobile_no: responseData?.mobile_no,
          email_id: responseData?.email_id,
        };
        return { updated };
      })
      .then(({ updated }) => {
        dispatch(getQuotationList({ order_id: id, approval: true }))
          .then(response => {
            const responseList = response.payload;
            const filteredData = responseList?.find(item => item?.status === 2);
            return { updated, filteredData };
          })
          .then(async ({ updated, filteredData }) => {
            await dispatch(
              getCurrencyList({
                start: 0,
                limit: 0,
                isActive: true,
                search: '',
              }),
            );

            if (!inquiryFlowEditingQuotesApprovedData?.quotation_id) {
              dispatch(
                getQuotation({
                  quotation_id: filteredData?._id,
                  email: false,
                  pdf: false,
                }),
              )
                .then(response => {
                  const responseData = response.payload;
                  const updatedList = responseData?.quotation_detail?.map(d => {
                    return {
                      ...d,
                      due_date: d?.due_date
                        ? moment(d?.due_date)?.format('DD-MM-YYYY')
                        : '',
                      // due_date: d?.due_date ? new Date(d?.due_date) : '',
                    };
                  });

                  const { due_date, ...rest } = responseData;
                  let data = {
                    ...updated,
                    ...rest,
                    quotation_detail: updatedList,
                  };

                  // dispatch(setQuotationApprovedData(data));
                  dispatch(setInquiryFlowEditingQuotesApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
            } else {
              dispatch(
                getQuotation({
                  quotation_id:
                    inquiryFlowEditingQuotesApprovedData?.quotation_id,
                  email: false,
                  pdf: false,
                }),
              )
                .then(response => {
                  const responseData = response.payload;
                  const updatedList = responseData?.quotation_detail?.map(d => {
                    return {
                      ...d,
                      due_date: d?.due_date
                        ? moment(d?.due_date)?.format('DD-MM-YYYY')
                        : '',
                      // due_date: d?.due_date ? new Date(d?.due_date) : '',
                    };
                  });

                  const { due_date, ...rest } = responseData;
                  let data = {
                    ...updated,
                    ...rest,
                    quotation_detail: updatedList,
                  };

                  // dispatch(setQuotationApprovedData(data));
                  dispatch(setInquiryFlowEditingQuotesApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
              // let data = {
              //   ...inquiryFlowEditingQuotesApprovedData,
              //   ...updated,
              // };
              // dispatch(
              //   setInquiryFlowEditingQuotesApprovedData(prevData => ({
              //     ...prevData,
              //     ...data,
              //   })),
              // );
            }
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, [dispatch, id]);

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };
  const descriptionBodyTemplate = data => {
    return (
      <div
        className="editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const QuotationfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`${
            selectedQuatationData?.currency_symbol
              ? selectedQuatationData?.currency_symbol
              : ''
          }${
            selectedQuatationData?.sub_total
              ? selectedQuatationData?.sub_total
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="" footer="Total Quantity" colSpan={6} />
        <Column
          footer={`${
            inquiryFlowEditingQuotesApprovedData?.currency_symbol
              ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
              : ''
          } ${
            inquiryFlowEditingQuotesApprovedData?.sub_total
              ? inquiryFlowEditingQuotesApprovedData?.sub_total
              : 0
          }`}
          colSpan={2}
        />
      </Row>
    </ColumnGroup>
  );

  const rateTemplate = rowData => {
    return (
      <div className="d-flex">
        <span className="me-1">
          {inquiryFlowEditingQuotesApprovedData
            ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.rate}</span>
      </div>
    );
  };

  const amountTemplate = rowData => {
    return (
      <div className="d-flex">
        <span className="me-1">
          {inquiryFlowEditingQuotesApprovedData
            ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount}</span>
      </div>
    );
  };

  const viewQuotationRateTemplate = rowData => {
    return (
      <div className="d-flex">
        <span>
          {selectedQuatationData?.currency_symbol
            ? selectedQuatationData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.rate}</span>
      </div>
    );
  };

  const viewQuotationAmountTemplate = rowData => {
    return (
      <div className="d-flex">
        <span>
          {selectedQuatationData?.currency_symbol
            ? selectedQuatationData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount}</span>
      </div>
    );
  };

  const handleMarkAsApprovedChange = () => {
    let payload = {
      quotation_id: selectedQuatationData?._id,
      status: 2,
    };
    dispatch(editQuotation(payload))
      .then(response => {
        dispatch(
          setInquiryFlowEditingQuotesApprovedData({
            quotation_id: selectedQuatationData?._id,
          }),
        );
      })
      .catch(error => {
        console.error('Error fetching while edit data collection:', error);
      });
  };

  return (
    <div className="">
      {(editingLoading ||
        quotationLoading ||
        invoiceLoading ||
        currencyLoading) && <Loader />}
      <div className="billing_details">
        <div className="mb25">
          <Row className="g-3 g-sm-4">
            <Col xxl={8} xl={7}>
              <div className="process_order_wrap p-0 pb-3 mb-3">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setInquirySelectedProgressIndex(2));
                            dispatch(setInquiryFlowEditingQuotationData({}));
                            // dispatch(setEditingQuotationData({}));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Quotes Approve</h2>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="date_number">
                      <ul className="justify-content-end">
                        <li>
                          <h6>Order No.</h6>
                          <h4>
                            {inquiryFlowEditingQuotesApprovedData?.inquiry_no}
                          </h4>
                        </li>
                        <li>
                          <h6>Create Date</h6>
                          <h4>
                            {inquiryFlowEditingQuotesApprovedData?.create_date}
                          </h4>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job_company">
                <Row className="g-3 g-sm-4">
                  <Col md={6}>
                    <div className="order-details-wrapper p10 border radius15 h-100">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Job</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Items :</span>
                            <h5>
                              {inquiryFlowEditingQuotesApprovedData?.item_name}
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Couple Name :</span>
                            <h5>
                              {
                                inquiryFlowEditingQuotesApprovedData?.couple_name
                              }
                            </h5>
                          </div>
                        </div>
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Data Size :</span>
                            <h5>
                              {inquiryFlowEditingQuotesApprovedData?.data_size}
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Project Type :</span>
                            <h5>
                              {
                                inquiryFlowEditingQuotesApprovedData?.project_type_value
                              }
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Due Date :</span>
                            <h5>
                              {inquiryFlowEditingQuotesApprovedData?.due_date}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="order-details-wrapper p10 border radius15 h-100">
                      <div className="pb10 border-bottom">
                        <h6 className="m-0">Company</h6>
                      </div>
                      <div className="details_box pt10">
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Company Name :</span>
                            <h5>
                              {
                                inquiryFlowEditingQuotesApprovedData?.company_name
                              }
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Client Name :</span>
                            <h5>
                              {
                                inquiryFlowEditingQuotesApprovedData?.client_full_name
                              }
                            </h5>
                          </div>
                        </div>
                        <div className="details_box_inner">
                          <div className="order-date">
                            <span>Phone No :</span>
                            <h5>
                              {inquiryFlowEditingQuotesApprovedData?.mobile_no}
                            </h5>
                          </div>
                          <div className="order-date">
                            <span>Email :</span>
                            <h5>
                              {inquiryFlowEditingQuotesApprovedData?.email_id}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xxl={4} xl={5}>
              <div class="quotation-details-wrapper h-100 border radius15">
                <div class="p10 border-bottom">
                  <h6 class="m-0">Quotation</h6>
                </div>
                {/* <div class="quotation_save_data">
                  <h6>No Quotation saved</h6>
                </div> */}
                <div className="saved_quotation p10">
                  <ul>
                    {quotationList?.length > 0 &&
                      quotationList?.map((data, i) => {
                        return (
                          <li key={i}>
                            <Row>
                              <Col sm={6}>
                                <div className="quotation_name">
                                  <h5>{data?.quotation_name}</h5>
                                  <h5 className="fw_400 m-0">
                                    {data?.currency_symbol
                                      ? data?.currency_symbol
                                      : ''}{' '}
                                    {convertIntoNumber(data?.total_amount)}
                                  </h5>
                                </div>
                              </Col>
                              <Col sm={6}>
                                {data?.status === 1 && (
                                  <div className="quotation_view d-flex justify-content-end align-items-center">
                                    <h6 className="text_gray m-0 me-2">
                                      Pending
                                    </h6>
                                    <Button
                                      className="btn_border_dark filter_btn"
                                      onClick={() => {
                                        dispatch(
                                          getQuotation({
                                            quotation_id: data?._id,
                                            email: false,
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
                                      <h6 class="text_green mb-2 me-2">
                                        Approved By {data?.approved_by}
                                      </h6>
                                      <h6 className="text_gray m-0 me-2">
                                        {data?.approved_at &&
                                          moment(data?.approved_at)?.format(
                                            'DD-MM-YYYY hh:mm:ss A',
                                          )}
                                      </h6>
                                    </div>
                                    <Button
                                      className="btn_border_dark filter_btn"
                                      onClick={() => {
                                        dispatch(
                                          getQuotation({
                                            quotation_id: data?._id,
                                            email: false,
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
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="order_items">
          <h3>
            Quotation Details <span className="text-danger fs-6">*</span>
          </h3>
          <Row className="justify-content-between g-4">
            <Col xl={3} lg={4} md={6}>
              <div className="form_group">
                {/* <MultiSelect
                  filter
                  value={inquiryFlowEditingQuotesApprovedData?.editing_inquiry}
                  optionLabel="label"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionGroupTemplate={editingItemsTemplate}
                  placeholder="Select Editing Items"
                  className="w-100"
                  disabled
                /> */}
                <InputText
                  placeholder="Select Editing Items"
                  className="input_wrap"
                  value={inquiryFlowEditingQuotesApprovedData?.editing_inquiry}
                  disabled
                />
              </div>
            </Col>
            <Col xl={4} md={6}>
              <div className="">
                <div className="form_group d-sm-flex align-items-center">
                  <label className="me-sm-3 mb-sm-0 mb-2 fw_500 text-nowrap">
                    Name the Quotation{' '}
                    <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    placeholder="Write here"
                    className="input_wrap"
                    value={inquiryFlowEditingQuotesApprovedData?.quotation_name}
                    disabled
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper border radius15 max_height vertical_top">
          <DataTable
            value={inquiryFlowEditingQuotesApprovedData?.quotation_detail}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={footerGroup}
          >
            <Column
              field="srNo"
              header="Sr No."
              sortable
              body={customNoColumn}
            ></Column>
            <Column field="item_name" header="Item" sortable></Column>
            <Column
              field="description"
              header="Description"
              sortable
              body={descriptionBodyTemplate}
            ></Column>
            <Column field="due_date" header="Due Date" sortable></Column>
            <Column field="quantity" header="Qty" sortable></Column>
            <Column
              field="rate"
              header="Rate"
              sortable
              body={rateTemplate}
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              body={amountTemplate}
            ></Column>
          </DataTable>
        </div>
        <div className="amount_condition pt20">
          <Row className="justify-content-between g-4">
            <Col xl={5} lg={6}>
              <div className="amount-condition-wrapper border radius15">
                <div className="p20 border-bottom">
                  <h5 className="m-0">Terms & Condition</h5>
                </div>
                <div
                  className="condition-content p20"
                  dangerouslySetInnerHTML={{
                    __html:
                      inquiryFlowEditingQuotesApprovedData?.terms_condition,
                  }}
                >
                  {/* <ul>
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
                  </ul> */}
                  {/* <InputTextarea
                    id="Terms"
                    placeholder="Terms & Conditions"
                    name="terms_condition"
                    value={inquiryFlowEditingQuotesApprovedData?.terms_condition || ''}
                    disabled
                    rows={3}
                  /> */}
                </div>
              </div>
            </Col>
            <Col xl={4} lg={6}>
              <div className="amount-condition-wrapper border radius15">
                <div className="condition-content p20">
                  <div className="sub-total-wrapper">
                    <div className="subtotal-title">
                      <h5>Sub Total</h5>
                    </div>
                    <div className="subtotal-input">
                      <h5>
                        {inquiryFlowEditingQuotesApprovedData
                          ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          : ''}{' '}
                        {inquiryFlowEditingQuotesApprovedData?.sub_total}
                      </h5>
                    </div>
                  </div>
                  <div className="sub-total-wrapper">
                    <div className="subtotal-title">
                      <h5>Discount ( - )</h5>
                    </div>
                    <div className="d-flex align-items-center subtotal-input gap-1">
                      <div>
                        {inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          : ''}
                      </div>
                      <InputText
                        placeholder="Discount"
                        value={inquiryFlowEditingQuotesApprovedData?.discount}
                        disabled
                      />
                    </div>
                  </div>
                  {/* <div className="sub-total-wrapper">
                    <div className="subtotal-title">
                      <h5>Before Tax</h5>
                    </div>
                    <div className="subtotal-input">
                      <input placeholder="₹ 00.00" />
                    </div>
                  </div> */}
                  <div className="sub-total-wrapper">
                    <div className="tax-input">
                      <h5>Tax</h5>
                      <div className="subtotal-input">
                        <InputNumber
                          placeholder="Tax Percentage"
                          name="tax_percentage"
                          value={
                            inquiryFlowEditingQuotesApprovedData?.tax_percentage
                          }
                          disabled
                          min={0}
                          max={100}
                          maxLength={3}
                          useGrouping={false}
                          maxFractionDigits={2}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center subtotal-input gap-1">
                      <div>
                        {inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          : ''}
                      </div>
                      <InputText
                        placeholder="0"
                        value={inquiryFlowEditingQuotesApprovedData?.tax}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="sub-total-wrapper total-amount">
                    <div className="subtotal-title">
                      <h5 className="fw_700">Total Amount</h5>
                    </div>
                    <div className="subtotal-input">
                      <h5 className="fw_700">
                        {inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          ? inquiryFlowEditingQuotesApprovedData?.currency_symbol
                          : ''}{' '}
                        {inquiryFlowEditingQuotesApprovedData?.total_amount}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="btn_group text-end mt20">
          <Button
            onClick={() => {
              // dispatch(setQuotationApprovedData({}));
              dispatch(setInquiryFlowEditingQuotesApprovedData({}));
              navigate('/inquiry');
            }}
            className="btn_border_dark"
          >
            Exit Page
          </Button>
          {/* <Button
            onClick={() => {
              if (getInquiryStepData?.inquiry_step < 3) {
                let payload = {
                  inquiry_id: id,
                  is_rework: false,
                  inquiry_step: 3,
                };
                dispatch(addInquiryStep(payload))
                  .then(response => {
                    dispatch(setInquirySelectedProgressIndex(4));
                  })
                  .catch(errors => {
                    console.error('Add Status:', errors);
                  });
              } else {
                dispatch(setInquirySelectedProgressIndex(4));
              }
            }}
            className="btn_primary ms-2"
          >
            Next
          </Button> */}
        </div>
      </div>
      <Dialog
        header={
          <div className="quotation_wrapper">
            <div className="dialog_logo">
              <img
                src={selectedQuatationData?.company_logo}
                alt="company logo"
              />
            </div>
            {selectedQuatationData?.status === 2 && (
              <button
                className="btn_border_dark"
                onClick={() => {
                  if (!selectedQuatationData?.bill_converted) {
                    dispatch(
                      addInvoice({
                        order_id: id,
                        quotation_id: selectedQuatationData?._id,
                      }),
                    );
                    setVisible(false);
                  }
                }}
                disabled={selectedQuatationData?.bill_converted}
              >
                {selectedQuatationData?.bill_converted
                  ? 'Converted'
                  : 'Convert to Bill'}
              </button>
            )}
          </div>
        }
        className="commission_dialog payment_dialog quotation_dialog"
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Quotation</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>{selectedQuatationData?.company_name}</h5>
                </div>
                <div className="user_bank_details">
                  <p>{selectedQuatationData?.company_address}</p>
                </div>
              </Col>
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>{selectedQuatationData?.quotation_name}</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No <span>{selectedQuatationData?.order_no}</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date <span>{selectedQuatationData?.created_at}</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Couple Name{' '}
                    <span>{selectedQuatationData?.couple_name}</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={selectedQuatationData?.quotation_detail}
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
                  <div
                    className="condition-content"
                    dangerouslySetInnerHTML={{
                      __html: selectedQuatationData?.terms_condition,
                    }}
                  >
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
                    {/* {selectedQuatationData?.terms_condition} */}
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
                          {selectedQuatationData
                            ? selectedQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedQuatationData?.sub_total}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedQuatationData
                            ? selectedQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedQuatationData?.discount}
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
                        <h5>Tax ({selectedQuatationData?.tax_percentage}%)</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedQuatationData
                            ? selectedQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedQuatationData?.tax}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">
                          {selectedQuatationData
                            ? selectedQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedQuatationData?.total_amount}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="delete_btn_wrap">
            {/* {selectedQuatationData?.status === 1 && ( */}
            <button
              className="btn_border_dark"
              onClick={() => {
                const itemList = [];
                let updatedList = selectedQuatationData?.quotation_detail?.map(
                  d => {
                    itemList.push(d?.item_id);
                    return {
                      ...d,
                      due_date: d?.due_date ? new Date(d.due_date) : '',
                      order_iteam_id: d?._id,
                    };
                  },
                );

                const clientCurrency = currencyList?.list?.find(
                  c => c?._id === selectedQuatationData?.currency,
                );

                const findedDefaultCurrency = currencyList?.list?.find(
                  c => c?.currency_code === 'INR',
                );

                const updated = {
                  ...selectedQuatationData,
                  ...inquiryFlowEditingQuotesApprovedData,
                  editingTable: updatedList,
                  editing_inquiry: itemList,
                  quotation_id: selectedQuatationData?._id,
                  currency: clientCurrency?._id,
                  selected_currency: clientCurrency,
                  default_currency: findedDefaultCurrency,
                };

                // dispatch(setEditingQuotationData(updated));
                dispatch(setInquiryFlowEditingQuotationData(updated));
                setVisible(false);
                dispatch(setInquirySelectedProgressIndex(2));
              }}
            >
              <img src={EditIcon} alt="editicon" /> Edit Quotation
            </button>
            {/* )} */}
            {/* <button
              className="btn_border_dark"
              onClick={() => {
                dispatch(
                  getQuotation({
                    quotation_id: selectedQuatationData?._id,
                    email: true,
                    pdf: false,
                  }),
                );
                setVisible(false);
              }}
              // onClick={() => setVisible(false)}
            >
              <img src={EmailIcon} alt="EmailIcon" /> Send Email
            </button> */}
            <button
              className="btn_border_dark"
              onClick={() => {
                dispatch(
                  getQuotation({
                    quotation_id: selectedQuatationData?._id,
                    email: false,
                    pdf: true,
                  }),
                );
                setVisible(false);
              }}
              // onClick={() => setVisible(false)}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedQuatationData?.status === 1 ? (
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
      {/* conformation popup */}
      <Dialog
        className="delete_dialog"
        visible={confornation}
        onHide={() => setConfornation(false)}
        draggable={false}
      >
        <div className="delete_popup_wrapper">
          <h2>Are you sure, You want to delete this group?</h2>
          <div className="delete_btn_wrap">
            <button className="btn_primary" onClick={() => setVisible(false)}>
              Delete
            </button>
            <button className="btn_border" onClick={() => setVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default memo(EditingQuotesApproveInquiryFlow);
