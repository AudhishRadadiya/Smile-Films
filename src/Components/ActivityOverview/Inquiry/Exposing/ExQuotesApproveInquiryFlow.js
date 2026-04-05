import React, { useState, useCallback, useEffect, memo } from 'react';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ColumnGroup } from 'primereact/columngroup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../../../Assets/Images/edit.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import PdfIcon from '../../../../Assets/Images/pdf-icon.svg';
import ShowIcon from '../../../../Assets/Images/show-icon.svg';
import ArrowIcon from '../../../../Assets/Images/left_arrow.svg';
import { convertIntoNumber, totalCount } from 'Helper/CommonHelper';
import {
  addInvoice,
  editQuotation,
  getExposingDetails,
  getExposingQuotation,
  getExposingQuotationList,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import {
  setInquiryFlowExQuotationData,
  setInquiryFlowExQuotesApprovedData,
  setInquirySelectedProgressIndex,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import { InputNumber } from 'primereact/inputnumber';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';

const ExQuotesApproveInquiryFlow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState();
  const [visible, setVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [confornation, setConfornation] = useState(false);
  const [quotationItems, setQuotationItems] = useState(null);

  const { inquiryFlowExQuotesApprovedData } = useSelector(
    ({ inquiry }) => inquiry,
  );
  const {
    exposingLoading,
    exposingQuotationList,
    exposingQuotationLoading,
    selectedExposingQuatationData,
  } = useSelector(({ exposing }) => exposing);
  const { currencyList, currencyLoading } = useSelector(
    ({ currency }) => currency,
  );

  useEffect(() => {
    dispatch(getExposingDetails({ order_id: id }))
      .then(response => {
        const responseData = response.payload;
        const updated = {
          inquiry_no: responseData?.inquiry_no,
          create_date: responseData?.create_date,
          item_name: responseData?.item_name,
          couple_name: responseData?.couple_name,
          data_size: responseData?.data_size,
          project_type_value: responseData?.project_type_value,
          start_date: responseData?.start_date,
          end_date: responseData?.end_date,
          venue: responseData?.venue,
          company_name: responseData?.company_name,
          client_full_name: responseData?.client_full_name,
          client_company_id: responseData?.client_company_id,
          mobile_no: Array.isArray(responseData?.mobile_no)
            ? responseData?.mobile_no?.join(', ')
            : responseData?.mobile_no,
          email_id: responseData?.email_id,
        };
        return { updated };
      })
      .then(({ updated }) => {
        dispatch(getExposingQuotationList({ order_id: id, approval: true }))
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

            if (!inquiryFlowExQuotesApprovedData?.quotation_id) {
              dispatch(
                getExposingQuotation({
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

                  const itemList = updatedList?.map(item => item.item_name);

                  const { due_date, ...rest } = responseData;
                  let data = {
                    ...updated,
                    ...rest,
                    quotation_detail: updatedList,
                    exposingOrderList: itemList,
                  };

                  // dispatch(setQuotationApprovedData(data));
                  dispatch(setInquiryFlowExQuotesApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
            } else {
              dispatch(
                getExposingQuotation({
                  quotation_id: inquiryFlowExQuotesApprovedData?.quotation_id,
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

                  const itemList = updatedList?.map(item => item.item_name);

                  const { due_date, ...rest } = responseData;
                  let data = {
                    ...updated,
                    ...rest,
                    quotation_detail: updatedList,
                    exposingOrderList: itemList,
                  };

                  // dispatch(setQuotationApprovedData(data));
                  dispatch(setInquiryFlowExQuotesApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
              // let data = {
              //   ...inquiryFlowExQuotesApprovedData,
              //   ...updated,
              // };
              // dispatch(
              //   setInquiryFlowExQuotesApprovedData(prevData => ({
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

  const QuotationfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={`${
            selectedExposingQuatationData?.currency_symbol
              ? selectedExposingQuatationData?.currency_symbol
              : ''
          }${
            selectedExposingQuatationData?.sub_total
              ? selectedExposingQuatationData?.sub_total
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          className="text-end border-bottom-0"
          footer="Total Quantity"
          colSpan={5}
        />
        <Column
          className="border-bottom-0"
          footer={`${
            inquiryFlowExQuotesApprovedData?.currency_symbol
              ? inquiryFlowExQuotesApprovedData?.currency_symbol
              : ''
          } ${
            inquiryFlowExQuotesApprovedData?.sub_total
              ? inquiryFlowExQuotesApprovedData?.sub_total
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
          {inquiryFlowExQuotesApprovedData?.currency_symbol
            ? inquiryFlowExQuotesApprovedData?.currency_symbol
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
          {inquiryFlowExQuotesApprovedData?.currency_symbol
            ? inquiryFlowExQuotesApprovedData?.currency_symbol
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
          {selectedExposingQuatationData?.currency_symbol
            ? selectedExposingQuatationData?.currency_symbol
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
          {selectedExposingQuatationData?.currency_symbol
            ? selectedExposingQuatationData?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount}</span>
      </div>
    );
  };

  const handleMarkAsApprovedChange = () => {
    let payload = {
      quotation_id: selectedExposingQuatationData?._id,
      status: 2,
    };
    dispatch(editQuotation(payload))
      .then(response => {
        // dispatch(
        //   setQuotationApprovedData({
        //     quotation_id: selectedExposingQuatationData?._id,
        //   }),
        // );
        dispatch(
          setInquiryFlowExQuotesApprovedData({
            quotation_id: selectedExposingQuatationData?._id,
          }),
        );
        // dispatch(setExposingSelectedProgressIndex(3));
      })
      .catch(error => {
        console.error('Error fetching while edit data collection:', error);
      });
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

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };

  const descriptionBodyTemplate = data => {
    return (
      <div
        className="editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data?.description }}
      />
    );
  };

  const dueDateBodyTemplate = data => {
    const orderStartDate = data?.order_start_date
      ? moment(data?.order_start_date).format('DD-MM-YYYY')
      : '';

    const orderEndDate = data?.order_end_date
      ? moment(data?.order_end_date).format('DD-MM-YYYY')
      : '';

    return (
      // <div className="">
      //   <div className="form_group mb-3">
      //     <div className="date_select">
      //       <Calendar
      //         placeholder="Select Date"
      //         dateFormat="dd-mm-yy"
      //         value={data?.order_date ? data?.order_date : ''}
      //         name="order_date"
      //         readOnlyInput
      //         showIcon
      //         showButtonBar
      //       />
      //     </div>
      //   </div>
      // </div>
      <span>{`${
        orderStartDate ? orderStartDate + ' To ' : ''
      } ${orderEndDate}`}</span>
    );
  };

  const {
    start_date,
    end_date,
    venue,
    company_name,
    client_full_name,
    mobile_no,
    email_id,
    inquiry_no,
    create_date,
  } = inquiryFlowExQuotesApprovedData;

  return (
    <>
      {(exposingLoading || currencyLoading || exposingQuotationLoading) && (
        <Loader />
      )}
      <div className="processing_main">
        {/* <div className="billing_heading">
          <div className="processing_bar_wrapper">
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Order Form</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Quotation</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Quotes Approve</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap next">
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
        </div> */}
        <div className="billing_details">
          <div className="mb25">
            <Row className="g-3 g-sm-4">
              <Col lg={8}>
                <div className="process_order_wrap p-0 pb-3 mb20">
                  <Row className="align-items-center">
                    <Col sm={6}>
                      <div className="back_page">
                        <div className="btn_as_text d-flex align-items-center">
                          <Button
                            className="btn_transparent"
                            onClick={() => {
                              dispatch(setInquirySelectedProgressIndex(2));
                              dispatch(setInquiryFlowExQuotationData({}));
                              // dispatch(setExposingQuotationData({}));
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
                            <h4>{inquiry_no ? inquiry_no : ''}</h4>
                          </li>
                          <li>
                            <h6>Create Date</h6>
                            <h4>
                              {' '}
                              {create_date
                                ? moment(create_date)?.format('DD-MM-YYYY')
                                : ''}
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
                      <div className="order-details-wrapper p10 border radius15 mb-3">
                        <div className="pb10 border-bottom">
                          <h6 className="m-0">Job</h6>
                        </div>
                        <div className="details_box pt10">
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Dates :</span>
                              <h5>
                                {start_date
                                  ? moment(start_date)?.format('DD-MM-YYYY') +
                                    (end_date
                                      ? ' To ' +
                                        moment(end_date)?.format('DD-MM-YYYY')
                                      : '')
                                  : end_date
                                  ? ' To ' +
                                    moment(end_date)?.format('DD-MM-YYYY')
                                  : ''}
                              </h5>
                            </div>
                            <div className="order-date">
                              <span>Venue :</span>
                              <h5>{venue ? venue : ''}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="order-details-wrapper p10 border radius15 mb-3">
                        <div className="pb10 border-bottom">
                          <h6 className="m-0">Company</h6>
                        </div>
                        <div className="details_box pt10">
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Company Name :</span>
                              <h5>{company_name ? company_name : ''}</h5>
                            </div>
                            <div className="order-date">
                              <span>Client Name :</span>
                              <h5>
                                {client_full_name ? client_full_name : ''}
                              </h5>
                            </div>
                          </div>
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Phone No :</span>
                              <h5>{mobile_no ? mobile_no : ''}</h5>
                            </div>
                            <div className="order-date">
                              <span>Email :</span>
                              <h5>{email_id ? email_id : ''}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={4}>
                <div class="quotation-details-wrapper h-100 border radius15">
                  <div class="p10 border-bottom">
                    <h6 class="m-0">Quotation</h6>
                  </div>
                  {/* <div class="quotation_save_data">
                  <h6>No Quotation saved</h6>
                </div> */}
                  <div className="saved_quotation p10">
                    <ul>
                      {exposingQuotationList?.length > 0 ? (
                        exposingQuotationList?.map((data, i) => (
                          <li key={i}>
                            <Row>
                              <Col xxl={6} lg={12} md={6}>
                                <div className="quotation_name">
                                  <h5>{data?.quotation_name}</h5>
                                  <h5 className="fw_400 m-0">
                                    {data?.currency_symbol
                                      ? data?.currency_symbol
                                      : ''}{' '}
                                    {data?.total_amount
                                      ? convertIntoNumber(data?.total_amount)
                                      : 0}
                                  </h5>
                                </div>
                              </Col>

                              <Col xxl={6} lg={12} md={6}>
                                {data?.status === 1 && (
                                  <div className="quotation_view d-flex justify-content-end align-items-center">
                                    <h6 className="text_gray m-0 me-2">
                                      Pending
                                    </h6>
                                    <Button
                                      className="btn_border_dark filter_btn"
                                      onClick={() => {
                                        dispatch(
                                          getExposingQuotation({
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
                                      <h6 className="text_green mb-2 me-2">
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
                                          getExposingQuotation({
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
                        ))
                      ) : (
                        <div className="quotation_save_data">
                          <h6>No Quotation saved</h6>
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="order_items">
            <h3>Quotation Details</h3>
            <Row className="justify-content-between">
              <Col xxl={2} xl={4} lg={5}>
                <div class="form_group">
                  {/* <MultiSelect
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
                  /> */}
                  <InputText
                    placeholder="Select Editing Items"
                    className="input_wrap"
                    value={inquiryFlowExQuotesApprovedData?.exposingOrderList}
                    disabled
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
                    value={inquiryFlowExQuotesApprovedData?.quotation_name}
                    disabled
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={inquiryFlowExQuotesApprovedData?.quotation_detail}
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
              <Column
                field="order_date"
                header="Event Date"
                body={dueDateBodyTemplate}
                sortable
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
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
            <Row className="justify-content-between">
              <Col lg={5} md={6}>
                <div className="amount-condition-wrapper border radius15 mb-3 mb-md-0">
                  <div className="p20 p10-md border-bottom">
                    <h5 className="m-0">Terms & Condition</h5>
                  </div>
                  <div
                    className="condition-content p20"
                    dangerouslySetInnerHTML={{
                      __html: inquiryFlowExQuotesApprovedData?.terms_condition,
                    }}
                  ></div>
                </div>
              </Col>
              <Col xl={4} md={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>
                          {inquiryFlowExQuotesApprovedData?.currency_symbol
                            ? inquiryFlowExQuotesApprovedData?.currency_symbol
                            : ''}{' '}
                          {inquiryFlowExQuotesApprovedData?.sub_total}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input d-flex align-items-center gap-1">
                        <div>
                          {inquiryFlowExQuotesApprovedData?.currency_symbol
                            ? inquiryFlowExQuotesApprovedData?.currency_symbol
                            : ''}
                        </div>
                        <input
                          placeholder="₹ 00.00"
                          value={inquiryFlowExQuotesApprovedData?.discount}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="sub-total-wrapper">
                      <div className="tax-input">
                        <h5>Tax</h5>
                        <div className="subtotal-input">
                          <InputNumber
                            placeholder="Tax Percentage"
                            name="tax_percentage"
                            value={
                              inquiryFlowExQuotesApprovedData?.tax_percentage
                            }
                            min={0}
                            max={100}
                            maxLength={3}
                            useGrouping={false}
                            maxFractionDigits={2}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="subtotal-input d-flex align-items-center gap-1">
                        <div>
                          {inquiryFlowExQuotesApprovedData?.currency_symbol
                            ? inquiryFlowExQuotesApprovedData?.currency_symbol
                            : ''}
                        </div>
                        <input
                          placeholder="₹ 00.00"
                          value={inquiryFlowExQuotesApprovedData?.tax}
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
                          {inquiryFlowExQuotesApprovedData?.currency_symbol
                            ? inquiryFlowExQuotesApprovedData?.currency_symbol
                            : ''}{' '}
                          {inquiryFlowExQuotesApprovedData?.total_amount}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div class="delete_btn_wrap mt-4 p-0 text-end">
            <Button
              className="btn_border_dark"
              onClick={() => {
                // dispatch(setQuotationApprovedData({}));
                dispatch(setInquiryFlowExQuotesApprovedData({}));
                navigate('/inquiry');
              }}
            >
              Exit Page
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        header={
          <div className="quotation_wrapper">
            <div className="dialog_logo">
              <img
                src={selectedExposingQuatationData?.company_logo}
                alt="company logo"
              />
            </div>
            {selectedExposingQuatationData?.status === 2 && (
              <button
                className="btn_border_dark"
                onClick={() => {
                  if (!selectedExposingQuatationData?.bill_converted) {
                    dispatch(
                      addInvoice({
                        order_id: id,
                        quotation_id: selectedExposingQuatationData?._id,
                      }),
                    );
                  }
                  setVisible(false);
                }}
                disabled={selectedExposingQuatationData?.bill_converted}
              >
                {selectedExposingQuatationData?.bill_converted
                  ? 'Converted'
                  : 'Convert to Bill'}
              </button>
            )}
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
                  <h5>{selectedExposingQuatationData?.company_name}</h5>
                </div>
                <div className="user_bank_details">
                  <p>{selectedExposingQuatationData?.company_address}</p>
                </div>
              </Col>
              <Col md={5} sm={6}>
                <div className="voucher_head">
                  <h5>{selectedExposingQuatationData?.quotation_name}</h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order No{' '}
                    <span>{selectedExposingQuatationData?.order_no}</span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Order Date{' '}
                    <span>
                      {moment(
                        selectedExposingQuatationData?.created_at,
                      )?.format('DD-MM-YYYY')}
                    </span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Couple Name{' '}
                    <span>{selectedExposingQuatationData?.couple_name}</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={selectedExposingQuatationData?.quotation_detail}
              sortField="price"
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
                      __html: selectedExposingQuatationData?.terms_condition,
                    }}
                  ></div>
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
                          {selectedExposingQuatationData?.currency_symbol
                            ? selectedExposingQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedExposingQuatationData?.sub_total}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedExposingQuatationData?.currency_symbol
                            ? selectedExposingQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedExposingQuatationData?.discount}
                        </h5>
                      </div>
                    </div>

                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>
                          Tax ({selectedExposingQuatationData?.tax_percentage}%)
                        </h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedExposingQuatationData?.currency_symbol
                            ? selectedExposingQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedExposingQuatationData?.tax}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">
                          {selectedExposingQuatationData?.currency_symbol
                            ? selectedExposingQuatationData?.currency_symbol
                            : ''}{' '}
                          {selectedExposingQuatationData?.total_amount}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="delete_btn_wrap">
            {/* {selectedExposingQuatationData?.status === 1 && ( */}
            <button
              className="btn_border_dark"
              onClick={() => {
                const itemList = [];
                let updatedList =
                  selectedExposingQuatationData?.quotation_detail?.map(d => {
                    itemList.push(d?.item_id);
                    return {
                      ...d,
                      due_date: d?.due_date ? new Date(d.due_date) : '',
                      order_iteam_id: d?._id,
                    };
                  });

                const discount = selectedExposingQuatationData?.discount
                  ? selectedExposingQuatationData?.discount
                  : 0;
                const taxPercentage =
                  selectedExposingQuatationData?.tax_percentage
                    ? selectedExposingQuatationData?.tax_percentage
                    : 0;
                let totalAmount = 0,
                  taxAmount = 0,
                  subTotal = 0;
                subTotal = totalCount(updatedList, 'amount');
                const amount =
                  convertIntoNumber(subTotal) - convertIntoNumber(discount);
                taxAmount =
                  (amount * selectedExposingQuatationData?.tax_percentage) /
                  100;
                totalAmount = amount + taxAmount;

                const clientCurrency = currencyList?.list?.find(
                  c => c?._id === selectedExposingQuatationData?.currency,
                );

                const findedDefaultCurrency = currencyList?.list?.find(
                  c => c?.currency_code === 'INR',
                );

                const updated = {
                  ...inquiryFlowExQuotesApprovedData,
                  ...selectedExposingQuatationData,
                  exposing_order_table: updatedList,
                  exposingOrderList: itemList,
                  quotation_id: selectedExposingQuatationData?._id,
                  selected_exposing_order_item: itemList,
                  total_amount_collection: convertIntoNumber(subTotal),
                  discount: discount,
                  tax_percentage: convertIntoNumber(taxPercentage),
                  tax: convertIntoNumber(taxAmount),
                  total_amount: convertIntoNumber(totalAmount),
                  currency: clientCurrency?._id,
                  selected_currency: clientCurrency,
                  default_currency: findedDefaultCurrency,
                };

                // dispatch(setExposingQuotationData(updated));
                dispatch(setInquiryFlowExQuotationData(updated));
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
                  getExposingQuotation({
                    quotation_id: selectedExposingQuatationData?._id,
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
                  getExposingQuotation({
                    quotation_id: selectedExposingQuatationData?._id,
                    email: false,
                    pdf: true,
                  }),
                );
                setVisible(false);
              }}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedExposingQuatationData?.status === 1 ? (
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
    </>
  );
};
export default memo(ExQuotesApproveInquiryFlow);
