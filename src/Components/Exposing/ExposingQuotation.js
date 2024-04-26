import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ShowIcon from '../../Assets/Images/show-icon.svg';
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
import { convertIntoNumber, totalCount } from 'Helper/CommonHelper';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { useFormik } from 'formik';
import { exposingQuotationSchema } from 'Schema/Exposing/exposingSchema';
import { getFormattedDate } from 'Helper/CommonList';
import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { toast } from 'react-toastify';
import moment from 'moment';

const TAX = 18;

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

const ExposingQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteId] = useState('');
  const [date, setDate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    exposingQuotationData,
    exposingDetailsData,
    exposingLoading,
    exposingQuotationLoading,
    exposingStepLoading,
    selectedExposingQuatationData,
    exposingQuotationList,
    getExposingStepData,
  } = useSelector(({ exposing }) => exposing);
  const { productList, productLoading } = useSelector(({ product }) => product);

  const { packageList, packageLoading } = useSelector(
    ({ packages }) => packages,
  );

  useEffect(() => {
    if (!exposingQuotationData?.quotation_id) {
      dispatch(getExposingDetails({ order_id: id }))
        .then(response => {
          const responseData = response.payload;
          let updatedList = responseData?.orderItems?.map(d => {
            let rate = d?.rate ? d?.rate : d?.default_rate,
              qty = d?.quantity,
              amount = rate * qty;
            return {
              ...d,
              order_date: d?.order_date ? new Date(d?.order_date) : '',
              quantity: qty,
              rate: rate,
              amount: amount,
              order_iteam_id: d?._id,
            };
          });
          const discount = values?.discount ? values?.discount : 0;
          let totalAmount = 0,
            taxAmount = 0,
            subTotal = 0;
          subTotal = totalCount(updatedList, 'amount');
          taxAmount = (subTotal * TAX) / 100;
          totalAmount = subTotal - discount + taxAmount;
          const updated = {
            ...responseData,
            quotation_name: '',
            exposing_order_table: updatedList,
            terms_condition: '',
            total_amount_collection: convertIntoNumber(subTotal),
            discount: discount,
            tax: convertIntoNumber(taxAmount),
            total_amount: convertIntoNumber(totalAmount),
          };

          dispatch(setExposingQuotationData(updated));
        })
        .catch(error => {
          console.error('Error fetching employee data:', error);
        });
    } else {
      setIsEdit(true);
    }
    dispatch(getExposingQuotationList({ order_id: id, approval: false }));
    dispatch(
      getPackageList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
  }, [dispatch]);

  const exposingItemOptionList = useMemo(() => {
    const packageData = packageList?.list?.map(item => ({
      ...item,
      label: item?.package_name,
      value: item?._id,
      isPackage: true,
    }));

    const productData = productList?.list?.map(item => ({
      ...item,
      label: item?.item_name,
      value: item?._id,
      isPackage: false,
    }));

    let filteredPackageData = packageData?.filter(d =>
      exposingDetailsData?.selected_exposing_order_item?.includes(d?._id),
    );
    let filteredProductData = productData?.filter(d =>
      exposingDetailsData?.selected_exposing_order_item?.includes(d?._id),
    );

    let data = [];
    if (filteredPackageData?.length > 0) {
      data.push({
        label: 'Package',
        items: [...filteredPackageData],
      });
    }
    if (filteredProductData?.length > 0) {
      data.push({ label: 'Product', items: [...filteredProductData] });
    }

    return data;
  }, [packageList, productList, exposingDetailsData]);

  const QuotationfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={
            selectedExposingQuatationData?.sub_total
              ? selectedExposingQuatationData?.sub_total
              : 0
          }
        />
      </Row>
    </ColumnGroup>
  );

  const handleDiscountChange = (fieldName, fieldValue) => {
    const discount = fieldValue;
    const subTotal = totalCount(values?.exposing_order_table, 'amount');
    const taxAmount = values?.tax;
    const totalAmount = subTotal - discount + taxAmount;
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('total_amount_collection', convertIntoNumber(subTotal));
    setFieldValue(fieldName, fieldValue);
  };

  const exposingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
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
        dispatch(
          setQuotationApprovedData({
            quotation_id: selectedExposingQuatationData?._id,
          }),
        );
        dispatch(setExposingSelectedProgressIndex(3));
      })
      .catch(error => {
        console.error('Error fetching while quotation:', error);
      });
  };

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const isRate = values?.exposing_order_table?.some(item => {
        return !item?.rate || item?.rate === 0;
      });

      const isDueDate = values?.exposing_order_table?.some(item => {
        return !item?.order_date;
      });

      const isQty = values?.exposing_order_table?.some(item => {
        return !item?.quantity || item?.quantity === 0;
      });

      if (!isRate && !isQty && !isDueDate) {
        let updatedList = values?.exposing_order_table?.map(d => {
          return {
            item_id: d?.item_id,
            item_name: d?.item_name,
            order_date: moment(new Date(d?.order_date))?.format('YYYY-MM-DD'),
            description: d?.description,
            quantity: d?.quantity,
            rate: d?.rate,
            amount: d?.amount,
          };
        });

        let payload = {
          order_id: id,
          quotation_name: values?.quotation_name ? values?.quotation_name : '',
          terms_condition: values?.terms_condition
            ? values?.terms_condition
            : '',
          sub_total: values?.total_amount_collection
            ? values?.total_amount_collection
            : 0,
          discount: values?.discount ? values?.discount : 0,
          tax: values?.tax ? values?.tax : 0,
          total_amount: values?.total_amount ? values?.total_amount : 0,
          quotation_details: updatedList,
          ...(isEdit && { quotation_id: values?.quotation_id }),
        };

        if (isEdit) {
          dispatch(editQuotation(payload))
            .then(response => {
              dispatch(
                getExposingQuotationList({ order_id: id, approval: false }),
              )
                .then(responseData => {
                  resetForm();
                  const updated = {
                    ...exposingQuotationData,
                    ...selectedExposingQuatationData,
                    exposing_order_table: [],
                    exposingOrderList: [],
                    quotation_id: selectedExposingQuatationData?._id,
                    quotation_name: '',
                    terms_condition: '',
                    total_amount_collection: 0,
                    discount: 0,
                    tax: 0,
                    total_amount: 0,
                    selected_exposing_order_item: [],
                  };
                  dispatch(setExposingQuotationData(updated));
                })
                .catch(error => {
                  console.error('Error fetching quotation list:', error);
                });
            })
            .catch(error => {
              console.error('Error fetching while edit quotation:', error);
            });
        } else {
          dispatch(exposingAddQuotation(payload))
            .then(response => {
              dispatch(
                getExposingQuotationList({ order_id: id, approval: false }),
              )
                .then(responseData => {
                  resetForm();
                  const updated = {
                    ...exposingQuotationData,
                    ...selectedExposingQuatationData,
                    exposing_order_table: [],
                    exposingOrderList: [],
                    quotation_id: selectedExposingQuatationData?._id,
                    quotation_name: '',
                    terms_condition: '',
                    total_amount_collection: 0,
                    discount: 0,
                    tax: 0,
                    total_amount: 0,
                    selected_exposing_order_item: [],
                  };
                  dispatch(setExposingQuotationData(updated));
                })
                .catch(error => {
                  console.error('Error fetching quotation list:', error);
                });
            })
            .catch(error => {
              console.error('Error fetching while add quotation:', error);
            });
        }
      } else {
        toast.error('Quotation Details Are Required');
      }
    },
    [isEdit, dispatch, exposingQuotationData, selectedExposingQuatationData],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: exposingQuotationData,
    validationSchema: exposingQuotationSchema,
    onSubmit: submitHandle,
  });

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
  } = values;

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="" footer="Total Amount" colSpan={6} />
        <Column footer={values?.total_amount_collection} colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const handleexposing_order_tableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.exposing_order_table];
    const index = editingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = editingList[index];
    let totalAmount = 0,
      taxAmount = 0,
      subTotal = 0;

    if (fieldName === 'quantity') {
      const rate = editingList[index]['rate'];
      const amount = fieldValue * rate;
      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
        amount: amount,
      };
      if (index >= 0) editingList[index] = updatedObj;
    } else if (fieldName === 'rate') {
      const quantity = editingList[index]['quantity'];
      const amount = fieldValue * quantity;

      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
        amount: amount,
      };

      if (index >= 0) editingList[index] = updatedObj;
    } else {
      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
      };
      if (index >= 0) editingList[index] = updatedObj;
    }
    const discount = values?.discount ? values?.discount : 0;
    subTotal = totalCount(editingList, 'amount');
    taxAmount = (subTotal * TAX) / 100;
    totalAmount = subTotal - discount + taxAmount;

    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('total_amount_collection', convertIntoNumber(subTotal));
    setFieldValue('exposing_order_table', editingList);
  };

  const descriptionBodyTemplate = data => {
    return (
      <div
        className="editor_text_wrapper max_700"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const dueDateBodyTemplate = data => {
    return (
      <div className="">
        <div className="form_group mb-3">
          <div className="date_select">
            <Calendar
              placeholder="Select Date"
              dateFormat="dd-mm-yy"
              value={data?.order_date ? data?.order_date : ''}
              name="order_date"
              readOnlyInput
              onChange={e => {
                const utcDate = new Date(e.value);
                handleexposing_order_tableChange(data, e.target.name, utcDate);
              }}
              showIcon
            />
          </div>
        </div>
      </div>
    );
  };

  const qtyBodyTemplate = data => {
    return (
      <div className="form_group d-flex">
        <InputNumber
          id="Qty"
          placeholder="Quantity"
          name="quantity"
          className="w_100"
          useGrouping={false}
          value={data?.quantity ? data?.quantity : ''}
          onChange={e => {
            handleexposing_order_tableChange(
              data,
              e.originalEvent.target.name,
              e.value,
            );
          }}
        />
      </div>
    );
  };

  const rateBodyTemplate = data => {
    return (
      <div className="form_group d-flex">
        <InputNumber
          id="Rate"
          placeholder="Rate"
          name="rate"
          className="w_100"
          useGrouping={false}
          maxFractionDigits={2}
          value={data?.rate ? data?.rate : ''}
          onChange={e => {
            handleexposing_order_tableChange(
              data,
              e.originalEvent.target.name,
              e.value,
            );
          }}
        />
      </div>
    );
  };

  const handleDeleteEditingItem = item => {
    let dummyList = values?.exposing_order_table
      ? values?.exposing_order_table?.filter(d => d?.item_id !== item?.item_id)
      : [];
    const discount = values?.discount ? values?.discount : 0;
    const subTotal = totalCount(dummyList, 'amount');
    const taxAmount = (subTotal * TAX) / 100;
    const totalAmount = subTotal - discount + taxAmount;
    setFieldValue('tax', taxAmount);
    setFieldValue('total_amount', totalAmount);
    setFieldValue('total_amount_collection', subTotal);
    setFieldValue('exposing_order_table', dummyList);
    let itemData = values?.selected_exposing_order_item
      ? values?.selected_exposing_order_item?.filter(d => d !== item?.item_id)
      : [];
    setFieldValue('selected_exposing_order_item', itemData);
  };

  const actionBodyTemplate = data => {
    return (
      <div className="group-delete">
        <Button
          className="btn_as_text"
          onClick={() => handleDeleteEditingItem(data)}
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;

    let exposingOrderList = [];

    if (!values?.selected_exposing_order_item?.includes(data?._id)) {
      let newObj = {};

      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: '',
          order_date: data?.order_date,
          description: data?.remark,
          rate: '',
          amount: '',
          order_iteam_id: '',
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: '',
          order_date: data?.order_date,
          description: data?.item_description,
          rate: '',
          amount: '',
          order_iteam_id: '',
        };
      }

      exposingOrderList = [...values?.exposing_order_table, newObj];
    } else {
      exposingOrderList = values?.exposing_order_table
        ? values?.exposing_order_table?.filter(
            item => item?.item_id !== data?._id,
          )
        : [];
      const discount = values?.discount ? values?.discount : 0;
      const subTotal = totalCount(exposingOrderList, 'amount');
      const taxAmount = (subTotal * TAX) / 100;
      const totalAmount = subTotal - discount + taxAmount;
      setFieldValue('tax', taxAmount);
      setFieldValue('total_amount', totalAmount);
      setFieldValue('total_amount_collection', subTotal);
      setFieldValue('exposing_order_table', exposingOrderList);
      let itemData = values?.selected_exposing_order_item
        ? values?.selected_exposing_order_item?.filter(
            item => item?.item_id !== data?._id,
          )
        : [];
      setFieldValue('selected_exposing_order_item', itemData);
    }

    setFieldValue('exposing_order_table', exposingOrderList);
    setFieldValue(fieldName, fieldValue);
  };

  const handleDelete = useCallback(async => {
    setDeletePopup(false);
  }, []);

  return (
    <div className="main_Wrapper">
      {(exposingLoading ||
        exposingStepLoading ||
        exposingQuotationLoading ||
        productLoading ||
        packageLoading) && <Loader />}

      <div className="processing_main bg-white radius15 border">
        {/* <div className="billing_heading">
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
        </div> */}
        <div className="billing_details">
          <Row className="g-3 g-sm-4">
            <Col lg={8}>
              <div className="process_order_wrap p-0 pb-3 mb20">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        {/* <Link to="/order-form">
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Link> */}
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setExposingSelectedProgressIndex(1));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Quotation</h2>
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
                    <div className="order-details-wrapper mb-3 p10 border radius15">
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
                    <div className="order-details-wrapper mb-3 p10 border radius15">
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
                            <h5>{client_full_name ? client_full_name : ''}</h5>
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
              <div class="quotation-details-wrapper mb-3 h-100 border radius15">
                <div class="p10 border-bottom">
                  <h6 class="m-0">Quotation</h6>
                </div>
                <div className="saved_quotation p10">
                  <ul>
                    {exposingQuotationList?.quotation_list?.length > 0 ? (
                      exposingQuotationList.quotation_list.map((data, i) => (
                        <li key={i}>
                          <Row>
                            <Col sm={6}>
                              <div className="quotation_name">
                                <h5>{data?.quotation_name}</h5>
                                <h5 className="fw_400 m-0">
                                  {data?.total_amount}
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
          <div className="order_items">
            <h3>Quotation Details</h3>
            <Row className="justify-content-between">
              <Col xxl={2} xl={4} lg={5}>
                <div class="form_group">
                  <MultiSelect
                    filter
                    value={
                      values?.selected_exposing_order_item
                        ? values?.selected_exposing_order_item
                        : []
                    }
                    name="selected_exposing_order_item"
                    options={exposingItemOptionList}
                    onChange={e => {
                      handleitemList(e.target.name, e.value, e);
                    }}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={exposingItemsTemplate}
                    placeholder="Select Exposing Items"
                    className="w-100"
                    showSelectAll={false}
                  />
                  {touched?.selected_exposing_order_item &&
                    errors?.selected_exposing_order_item && (
                      <p className="text-danger">
                        {errors?.selected_exposing_order_item}
                      </p>
                    )}
                </div>
              </Col>
              <Col xl={4} lg={6}>
                <div className="">
                  <div className="form_group d-sm-flex align-items-center">
                    <label className="me-3 mb-0 fw_500 text-nowrap mb-sm-0 mb-2">
                      Name the Quotation
                    </label>
                    <InputText
                      placeholder="Write here"
                      className="input_wrap"
                      name="quotation_name"
                      value={
                        values?.quotation_name ? values?.quotation_name : ''
                      }
                      onChange={handleChange}
                    />
                    {touched?.quotation_name && errors?.quotation_name && (
                      <p className="text-danger">{errors?.quotation_name}</p>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={
                values?.exposing_order_table ? values?.exposing_order_table : []
              }
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={footerGroup}
            >
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
                sortable
                body={dueDateBodyTemplate}
              ></Column>
              <Column
                field="quantity"
                header="Qty"
                sortable
                body={qtyBodyTemplate}
              ></Column>
              <Column
                field="rate"
                header="Rate"
                sortable
                body={rateBodyTemplate}
              ></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column
                field="action"
                header="Action"
                sortable
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="amount_condition pt20">
            <Row className="justify-content-between">
              <Col xl={5} lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="condition-content">
                    <h4 className="mb-2">Term & Condition</h4>

                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      formats={quillFormats}
                      name="terms_condition"
                      value={values?.terms_condition}
                      onChange={content =>
                        setFieldValue('terms_condition', content)
                      }
                      style={{ height: '200px' }}
                    />
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
                        <h5>{values?.total_amount_collection}</h5>
                        {touched?.total_amount_collection &&
                          errors?.total_amount_collection && (
                            <p className="text-danger">
                              {errors?.total_amount_collection}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <InputNumber
                          placeholder="₹ 00.00"
                          name="discount"
                          className="w-100"
                          maxFractionDigits={2}
                          useGrouping={false}
                          value={values?.discount ? values?.discount : ''}
                          onChange={e => {
                            handleDiscountChange(
                              e.originalEvent.target.name,
                              e.value,
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax(18 %)</h5>
                      </div>
                      <div className="subtotal-input">
                        <InputText
                          placeholder="₹ 00.00"
                          value={values?.tax ? values?.tax : 0}
                          name="tax"
                        />
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700">
                          {values?.total_amount ? values?.total_amount : '0'}
                        </h5>
                        {touched?.total_amount && errors?.total_amount && (
                          <p className="text-danger">{errors?.total_amount}</p>
                        )}
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
                dispatch(setExposingQuotationData({}));
                navigate('/editing');
              }}
              className="btn_border_dark"
            >
              Exit Page
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              className="btn_primary ms-2"
            >
              Save
            </Button>
            {exposingQuotationList?.quotation_status && (
              <Button
                className="btn_primary ms-2"
                onClick={() => {
                  if (getExposingStepData?.step < 2) {
                    let payload = {
                      order_id: id,
                      step: 2,
                    };
                    dispatch(addExposingStep(payload))
                      .then(response => {
                        dispatch(setExposingSelectedProgressIndex(3));
                      })
                      .catch(errors => {
                        console.error('Add Status:', errors);
                      });
                  } else {
                    dispatch(setExposingSelectedProgressIndex(3));
                  }

                  dispatch(setExposingQuotationData({}));
                }}
              >
                Next
              </Button>
            )}
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
        onHide={() => {
          if (selectedExposingQuatationData?.status === 2) {
            dispatch(
              setQuotationApprovedData({
                quotation_id: selectedExposingQuatationData?._id,
              }),
            );
            dispatch(setExposingSelectedProgressIndex(3));
            setVisible(false);
          } else {
            setVisible(false);
          }
        }}
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
              sortField="item_name"
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
                          {selectedExposingQuatationData?.sub_total
                            ? selectedExposingQuatationData?.sub_total
                            : 0}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedExposingQuatationData?.discount
                            ? selectedExposingQuatationData?.discount
                            : 0}
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
                          {selectedExposingQuatationData?.tax
                            ? selectedExposingQuatationData?.tax
                            : 0}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text-end">
                          {selectedExposingQuatationData?.total_amount
                            ? selectedExposingQuatationData?.total_amount
                            : 0}
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
                      // due_date: d?.due_date ? new Date(d.due_date) : '',
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
                taxAmount = (subTotal * TAX) / 100;
                totalAmount = subTotal - discount + taxAmount;
                let { order_date, ...rest } = selectedExposingQuatationData;
                // const {
                //   selected_exposing_order_item,
                //   orderItems,
                //   ...restExposingQuotationData
                // } = exposingQuotationData;
                const updated = {
                  ...exposingQuotationData,
                  rest,
                  exposing_order_table: updatedList,
                  // orderItems: updatedList,
                  total_amount_collection: convertIntoNumber(subTotal),
                  discount: discount,
                  tax: convertIntoNumber(taxAmount),
                  total_amount: convertIntoNumber(totalAmount),
                  exposingOrderList: itemList,
                  quotation_id: selectedExposingQuatationData?._id,
                  quotation_name: selectedExposingQuatationData?.quotation_name,
                  terms_condition:
                    selectedExposingQuatationData?.terms_condition,
                  selected_exposing_order_item: itemList,
                };

                dispatch(setExposingQuotationData(updated));
                setVisible(false);
                setIsEdit(true);
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
              // onClick={() => setVisible(false)}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedExposingQuatationData?.status === 1 && (
              <button
                className="btn_primary"
                onClick={() => {
                  handleMarkAsApprovedChange();
                }}
              >
                Mark as Approved
              </button>
            )}
            {selectedExposingQuatationData?.status === 2 && (
              <span className="approved_button_Wrap">Approved</span>
            )}
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
};
export default memo(ExposingQuotation);
