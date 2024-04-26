import React, { useState, useCallback, useEffect, memo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ShowIcon from '../../Assets/Images/show-icon.svg';
import LogoImg from '../../Assets/Images/logo.svg';
import PdfIcon from '../../Assets/Images/pdf-icon.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import EmailIcon from '../../Assets/Images/email-icon.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import {
  addExposingStep,
  addInvoice,
  editQuotation,
  exposingAddQuotation,
  getExposingDetails,
  getExposingQuotation,
  getExposingQuotationList,
  setExposingQuotationData,
  setExposingSelectedProgressIndex,
  setQuotationApprovedData,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { convertIntoNumber, totalCount } from 'Helper/CommonHelper';

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

const ExposingQuotesApprove = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId] = useState('');
  const [date, setDate] = useState();
  const [visible, setVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [confornation, setConfornation] = useState(false);
  const [quotationItems, setQuotationItems] = useState(null);
  // const id = '6620de5667039960d10c18e7';

  const {
    exposingQuotationData,
    exposingDetailsData,
    exposingLoading,
    exposingQuotationLoading,
    exposingStepLoading,
    selectedExposingQuatationData,
    exposingQuotationList,
    quotationApprovedData,
    getExposingStepData,
  } = useSelector(({ exposing }) => exposing);

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
          mobile_no: responseData?.mobile_no,
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

          .then(({ updated, filteredData }) => {
            if (!quotationApprovedData?.quotation_id) {
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

                  dispatch(setQuotationApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
            } else {
              dispatch(
                getExposingQuotation({
                  quotation_id: quotationApprovedData?.quotation_id,
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

                  dispatch(setQuotationApprovedData(data));
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
              // let data = {
              //   ...quotationApprovedData,
              //   ...updated,
              // };
              // dispatch(
              //   setQuotationApprovedData(prevData => ({
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
        <Column footer={selectedExposingQuatationData?.sub_total} />
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
          footer={quotationApprovedData?.sub_total}
          colSpan={2}
        />
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

  const handleMarkAsApprovedChange = () => {
    let payload = {
      quotation_id: selectedExposingQuatationData?._id,
      status: 2,
    };
    dispatch(editQuotation(payload))
      .then(response => {
        dispatch(
          setQuotationApprovedData({
            quotation_id: selectedExposingQuatationData?._id,
          }),
        );
        dispatch(setExposingSelectedProgressIndex(3));
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
  } = quotationApprovedData;

  return (
    <div className="main_Wrapper">
      {(exposingLoading || exposingStepLoading || exposingQuotationLoading) && (
        <Loader />
      )}
      <div className="processing_main bg-white radius15 border">
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
                              dispatch(setExposingSelectedProgressIndex(2));
                              dispatch(setExposingQuotationData({}));
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
                            <h4>{create_date ? create_date : ''}</h4>
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
                                  ? start_date +
                                    (end_date ? ' To ' + end_date : '')
                                  : end_date
                                  ? ' To ' + end_date
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
                                    ₹ {data?.total_amount}
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
                                            'YYYY-MM-DD hh:mm:ss A',
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
                    value={quotationApprovedData?.exposingOrderList}
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
                    value={quotationApprovedData?.quotation_name}
                    disabled
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={quotationApprovedData?.quotation_detail}
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
              <Column field="item" header="Item" sortable></Column>
              <Column
                field="description"
                header="Description"
                sortable
                body={descriptionBodyTemplate}
              ></Column>
              <Column field="event_date" header="Event Date" sortable></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="amount_condition pt20">
            <Row className="justify-content-between">
              <Col lg={5} md={6}>
                <div className="amount-condition-wrapper border radius15 mb-3 mb-md-0">
                  <div className="p20 p10-md border-bottom">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div
                    className="condition-content p20"
                    dangerouslySetInnerHTML={{
                      __html: quotationApprovedData?.terms_condition,
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
                        <h5>{quotationApprovedData?.sub_total}</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <input
                          placeholder="₹ 00.00"
                          value={quotationApprovedData?.discount}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <input
                          placeholder="₹ 00.00"
                          value={quotationApprovedData?.tax}
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
                          {' '}
                          {quotationApprovedData?.total_amount}
                        </h5>
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
            {/* <Link to="/assign-to-exposer" class="btn_primary">
              Save
            </Link> */}
            <Button
              onClick={() => {
                if (getExposingStepData?.step < 3) {
                  let payload = {
                    order_id: id,
                    step: 3,
                  };
                  dispatch(addExposingStep(payload))
                    .then(response => {
                      dispatch(setExposingSelectedProgressIndex(4));
                    })
                    .catch(errors => {
                      console.error('Add Status:', errors);
                    });
                } else {
                  dispatch(setExposingSelectedProgressIndex(4));
                }
              }}
              className="btn_primary ms-2"
            >
              Next
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
                  dispatch(
                    addInvoice({
                      order_id: id,
                      quotation_id: selectedExposingQuatationData?._id,
                    }),
                  );
                  setVisible(false);
                }}
              >
                Convert to Bill
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
                    <span>{selectedExposingQuatationData?.created_at}</span>
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
                          {selectedExposingQuatationData?.discount}
                        </h5>
                      </div>
                    </div>

                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
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
                          {' '}
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
                let totalAmount = 0,
                  taxAmount = 0,
                  subTotal = 0;
                subTotal = totalCount(updatedList, 'amount');
                taxAmount = (subTotal * 18) / 100;
                totalAmount = subTotal - discount + taxAmount;

                const updated = {
                  ...quotationApprovedData,
                  ...selectedExposingQuatationData,
                  exposing_order_table: updatedList,
                  exposingOrderList: itemList,
                  quotation_id: selectedExposingQuatationData?._id,
                  selected_exposing_order_item: itemList,
                  total_amount_collection: convertIntoNumber(subTotal),
                  discount: discount,
                  tax: convertIntoNumber(taxAmount),
                  total_amount: convertIntoNumber(totalAmount),
                };

                dispatch(setExposingQuotationData(updated));
                setVisible(false);
                dispatch(setExposingSelectedProgressIndex(2));
              }}
            >
              <img src={EditIcon} alt="editicon" /> Edit Quotation
            </button>
            <button
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
            </button>
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
          <h2>Are you Sure you want to Delete this Group?</h2>
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
export default memo(ExposingQuotesApprove);
