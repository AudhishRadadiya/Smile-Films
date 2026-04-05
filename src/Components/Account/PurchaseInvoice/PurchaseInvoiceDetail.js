import React, { useState, useCallback, memo } from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { InputTextarea } from 'primereact/inputtextarea';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  checkWordLimit,
  convertIntoNumber,
  generateUniqueId,
} from 'Helper/CommonHelper';
import { toast } from 'react-toastify';
import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import { getFormattedDate } from 'Helper/CommonList';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import {
  validationAddPurchaseInvoiceItem,
  validationPurchaseInvoice,
} from 'Schema/Accounting/PurchaseInvoice/PurchaseInvoiceSchema';
import DownloadIcon from '../../../Assets/Images/download-icon.svg';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import {
  addPurchaseInvoice,
  editPurchaseInvoice,
  getPurchaseInvoiceDetail,
  setAddPurchaseInvoiceData,
  setClearAddPurchaseInvoiceData,
  setClearUpdatePurchaseInvoiceData,
  setIsGetInitialValuesPurchaseInvoice,
  setUpdatePurchaseInvoiceData,
} from 'Store/Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';

const addItemIntialValues = {
  item_name: '',
  quantity: '',
  rate: '',
};

const PurchaseInvoiceDetail = ({ initialValues }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const checkViewPermission =
    id && (state?.iseView || locationPath[1] === 'view-purchase-invoice');

  const {
    isGetInitialValuesPurchaseInvoice,
    addPurchaseInvoiceData,
    updatePurchaseInvoiceData,
    purchaseInvoiceNoLoading,
    purchaseInvoiceLoading,
    addPurchaseInvoiceLoading,
    editPurchaseInvoiceLoading,
    purchaseInvoiceDetailLoading,
  } = useSelector(({ purchaseInvoice }) => purchaseInvoice);

  const { clientCompanyLoading, clientCompanyList } = useSelector(
    ({ clientCompany }) => clientCompany,
  );

  // const [deletePopup, setDeletePopup] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [addPurchaseItemDetails, setAddPurchaseItemDetails] =
    useState(addItemIntialValues);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);

  const submitHandle = useCallback(
    async value => {
      if (!value?.purchase_items?.length) {
        toast.error('Please add at least one item');
        return;
      }

      const updatedPurchaseItems = value?.purchase_items?.map(item => {
        return {
          ...(item?._id && { purchase_item_id: item?._id }),
          item_name: item?.item_name,
          quantity: convertIntoNumber(item?.quantity),
          rate: convertIntoNumber(item?.rate),
          amount: convertIntoNumber(item?.amount),
        };
      });

      const payload = {
        ...(id && { purchase_invoice_id: id }),
        purchase_invoice_no: value?.purchase_invoice_no,
        create_date: getFormattedDate(value?.create_date),
        client_company_id: value?.client_company_id,
        remark: value?.remark,
        purchase_items: updatedPurchaseItems,
        sub_total: convertIntoNumber(value?.sub_total),
        discount: convertIntoNumber(value?.discount),
        total_amount: convertIntoNumber(value?.total_amount),
        terms_condition: value?.terms_condition,
      };

      if (id) {
        const res = await dispatch(editPurchaseInvoice(payload));

        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesPurchaseInvoice({
              ...isGetInitialValuesPurchaseInvoice,
              update: false,
            }),
          );
          dispatch(setClearUpdatePurchaseInvoiceData());
          navigate('/purchase-invoice');
        }
      } else {
        const res = await dispatch(addPurchaseInvoice(payload));
        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesPurchaseInvoice({
              ...isGetInitialValuesPurchaseInvoice,
              add: false,
            }),
          );
          dispatch(setClearAddPurchaseInvoiceData());
          navigate('/purchase-invoice');
        }
      }
    },
    [dispatch, id, isGetInitialValuesPurchaseInvoice, navigate],
  );

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: validationPurchaseInvoice,
      onSubmit: submitHandle,
    });

  const addItemSubmitHandle = useCallback(
    (value, { addItemHandleResetForm }) => {
      let commonFieldObj = {};

      if (value?.unique_id) {
        let updatedPurchaseInvoiceData = [...values?.purchase_items];

        const index = updatedPurchaseInvoiceData?.findIndex(
          x => x?.unique_id === value?.unique_id,
        );

        if (index !== -1) {
          const oldObj = updatedPurchaseInvoiceData[index];
          const amount =
            convertIntoNumber(value?.quantity) * convertIntoNumber(value?.rate);

          const updatedObj = {
            ...oldObj,
            ...value,
            amount,
          };
          updatedPurchaseInvoiceData[index] = updatedObj;

          // const calculateSubTotalAmount =
          //   values?.sub_total +
          //   convertIntoNumber(amount) -
          //   oldObj?.amount;
          const calculateSubTotalAmount = totalCount(
            updatedPurchaseInvoiceData,
            'amount',
          );
          const calculateTotalAmount =
            calculateSubTotalAmount - values?.discount;

          commonFieldObj = {
            purchase_items: updatedPurchaseInvoiceData,
            sub_total: calculateSubTotalAmount,
            total_amount: calculateTotalAmount,
          };
        }
      } else {
        const purchaseInvoiceItem = {
          ...value,
          amount:
            convertIntoNumber(value?.quantity) * convertIntoNumber(value?.rate),
          unique_id: generateUniqueId(),
        };

        const updatedPurchaseInvoiceData = values?.purchase_items?.length
          ? [...values?.purchase_items, purchaseInvoiceItem]
          : [purchaseInvoiceItem];

        // const calculateSubTotalAmount =
        //   values?.sub_total +
        //   convertIntoNumber(purchaseInvoiceItem?.amount);
        const calculateSubTotalAmount = totalCount(
          updatedPurchaseInvoiceData,
          'amount',
        );
        const calculateTotalAmount = calculateSubTotalAmount - values?.discount;

        commonFieldObj = {
          purchase_items: updatedPurchaseInvoiceData,
          sub_total: calculateSubTotalAmount,
          total_amount: calculateTotalAmount,
        };
      }

      handleChangeFieldsdData(commonFieldObj);
      setShowPurchasePopup(false);
      setAddPurchaseItemDetails(addItemIntialValues);
      // addItemHandleResetForm();
    },
    [values?.discount, values?.purchase_items],
  );

  const subFormik = useFormik({
    enableReinitialize: true,
    initialValues: addPurchaseItemDetails,
    validationSchema: validationAddPurchaseInvoiceItem,
    onSubmit: addItemSubmitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={3} />
        <Column
          footer={values?.sub_total ? values?.sub_total : 0}
          colSpan={2}
        />
      </Row>
    </ColumnGroup>
  );

  const ActionTemplet = rowData => {
    return (
      <div className="d-flex gap-2">
        <div className="dropdown_action_wrap">
          <Button
            onClick={() => {
              setAddPurchaseItemDetails(rowData);
              setShowPurchasePopup(true);
            }}
            className="btn_transparent"
            disabled={checkViewPermission}
          >
            <img src={EditIcon} alt="EditIcon" />
          </Button>
        </div>
        <div className="dropdown_action_wrap">
          <Button
            onClick={() => {
              // setDeletePopup(true);
              handleDelete(rowData);
            }}
            className="btn_transparent"
            disabled={checkViewPermission}
          >
            <img src={TrashIcon} alt="TrashIcon" />
          </Button>
        </div>
      </div>
    );
  };

  const totalCount = (data, key) => {
    let newData = data?.length > 0 ? data : [];
    const calculatedAmount = newData?.reduce((sum, cuurent) => {
      if (Object.keys(cuurent)?.includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0);
    return convertIntoNumber(calculatedAmount);
  };

  const handleDelete = useCallback(
    data => {
      const updatedPurchaseInvoiceData = values?.purchase_items?.filter(
        item => item?.unique_id !== data?.unique_id,
      );

      // const calculateSubTotalAmount =
      //   values?.sub_total + convertIntoNumber(amount) - oldObj?.amount;

      const calculateSubTotalAmount = totalCount(
        updatedPurchaseInvoiceData,
        'amount',
      );
      const calculateTotalAmount = calculateSubTotalAmount - values?.discount;

      const commonFieldObj = {
        purchase_items: updatedPurchaseInvoiceData,
        sub_total: calculateSubTotalAmount,
        total_amount: calculateTotalAmount,
      };

      handleChangeFieldsdData(commonFieldObj);
      // setDeletePopup(false);
    },
    [values?.purchase_items, values?.discount],
  );

  const handleCompanyData = e => {
    const fieldValue = e.target.value;

    const companyData = clientCompanyList?.list?.find(
      company => company?._id === fieldValue,
    );

    const commonFieldObj = {
      client_company_id: fieldValue,
      client_company: companyData?.company_name,
      client_name: companyData?.client_full_name,
      client_email: companyData?.email_id,
      client_phone_no: companyData?.mobile_no,
    };

    handleChangeFieldsdData(commonFieldObj);
  };

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (id) {
      if (locationPath[1] === 'edit-purchase-invoice') {
        dispatch(
          setUpdatePurchaseInvoiceData({
            ...updatePurchaseInvoiceData,
            ...fieldObject,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewPurchaseInvoiceData({
      //       ...viewPurchaseInvoiceData,
      //       ...fieldObject,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddPurchaseInvoiceData({
          ...addPurchaseInvoiceData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
      if (locationPath[1] === 'edit-purchase-invoice') {
        dispatch(
          setUpdatePurchaseInvoiceData({
            ...updatePurchaseInvoiceData,
            [fieldName]: fieldValue,
          }),
        );
      }
      // else {
      //   dispatch(
      //     setViewPurchaseInvoiceData({
      //       ...viewPurchaseInvoiceData,
      //       [fieldName]: fieldValue,
      //     }),
      //   );
      // }
    } else {
      dispatch(
        setAddPurchaseInvoiceData({
          ...addPurchaseInvoiceData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleAmountAndDiscount = e => {
    const value = e.value;

    // const calculateSubTotalAmount =
    //   values?.sub_total - convertIntoNumber(value);
    const calculateTotalAmount = values?.sub_total - convertIntoNumber(value);

    const commonFieldObj = {
      discount: convertIntoNumber(value),
      total_amount: calculateTotalAmount,
    };
    handleChangeFieldsdData(commonFieldObj);
  };

  const handleDownloadPreview = useCallback(async () => {
    const response = await dispatch(
      getPurchaseInvoiceDetail({
        purchase_invoice_id: id,
        pdf: true,
      }),
    );

    if (response?.payload) {
      setVisiblePreview(false);
    }
  }, [dispatch, id]);

  return (
    <>
      {(purchaseInvoiceLoading ||
        purchaseInvoiceNoLoading ||
        addPurchaseInvoiceLoading ||
        editPurchaseInvoiceLoading ||
        purchaseInvoiceDetailLoading ||
        clientCompanyLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="bg-white radius15 border">
          <div className="billing_heading">
            <Row className="align-items-center gy-3">
              <Col sm={6}>
                <div class="page_title">
                  <h3 class="m-0">
                    {`${
                      id ? (checkViewPermission ? 'View' : 'Edit') : 'Add'
                    } Purchase Invoice`}
                  </h3>
                </div>
              </Col>
              <Col sm={6}>
                <ul className="billing-btn justify-content-sm-end">
                  {checkViewPermission && (
                    <li>
                      <Button
                        className="btn_border_dark filter_btn"
                        onClick={() => setVisiblePreview(true)}
                      >
                        <img src={ShowIcon} alt="" /> Preview
                      </Button>
                    </li>
                  )}
                </ul>
              </Col>
            </Row>
          </div>
          <div className="p20 p10-sm border-bottom">
            <Row>
              <Col xxl={3} xl={5} lg={6}>
                <Row>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Expense No <span className="text-danger fs-6">*</span>{' '}
                      </label>
                      <InputText
                        placeholder="Purchase Invoice No"
                        name="purchase_invoice_no"
                        value={values?.purchase_invoice_no}
                        className="input_wrap"
                        onChange={e => {
                          commonUpdateFieldValue(
                            'purchase_invoice_no',
                            e.target.value,
                          );
                        }}
                        // disabled={checkViewPermission}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Create Date <span className="text-danger fs-6">*</span>
                      </label>
                      <div className="date_select">
                        <Calendar
                          name="create_date"
                          dateFormat="dd-mm-yy"
                          placeholder="Select Create Date"
                          value={values?.create_date || ''}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'create_date',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          maxDate={new Date()}
                          showIcon
                          showButtonBar
                          disabled={checkViewPermission}
                        />
                        {touched?.create_date && errors?.create_date && (
                          <p className="text-danger">{errors?.create_date}</p>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Company <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="client_company_id"
                    value={values?.client_company_id}
                    options={values?.client_company_list}
                    onChange={e => {
                      handleCompanyData(e);
                      setFieldValue('client_company_id', e.target.value);
                    }}
                    placeholder="Select Company"
                    onBlur={handleBlur}
                    disabled={checkViewPermission}
                  />
                  {touched?.client_company_id && errors?.client_company_id && (
                    <p className="text-danger">{errors?.client_company_id}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>Client Name</label>
                  <InputText
                    placeholder="Client Name"
                    name="client_name"
                    value={values?.client_name}
                    className="input_wrap"
                    onChange={e => {
                      commonUpdateFieldValue('client_name', e.target.value);
                    }}
                    disabled
                  />
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>Email Address</label>
                  <InputText
                    placeholder="Email Address"
                    name="client_email"
                    value={values?.client_email}
                    className="input_wrap"
                    onChange={e => {
                      commonUpdateFieldValue('client_email', e.target.value);
                    }}
                    disabled
                  />
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>Phone Number</label>
                  <InputText
                    placeholder="Phone Number"
                    name="client_phone_no"
                    value={values?.client_phone_no}
                    className="input_wrap"
                    onChange={e => {
                      commonUpdateFieldValue('client_phone_no', e.target.value);
                    }}
                    disabled
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="form_group">
                  <label>Remark</label>
                  <InputTextarea
                    id="Remark"
                    name="remark"
                    value={values?.remark}
                    placeholder="Write here"
                    onChange={e => {
                      commonUpdateFieldValue('remark', e.target.value);
                    }}
                    className="input_wrap"
                    rows={2}
                    disabled={checkViewPermission}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="billing_heading">
            <Row className="justify-content-between g-2 align-items-center">
              <Col md={6}>
                <div className="Receipt_Payment_head_wrapper">
                  <div className="Receipt_Payment_head_txt">
                    <h3 className="m-0">Purchase Items</h3>
                  </div>
                </div>
              </Col>
              {!checkViewPermission && (
                <Col lg={3} md={5}>
                  <div className="form_group text-end">
                    <Button
                      className="btn_primary"
                      onClick={() => {
                        setShowPurchasePopup(true);
                        setAddPurchaseItemDetails(addItemIntialValues);
                        subFormik?.resetForm();
                      }}
                      disabled={checkViewPermission}
                    >
                      <img src={PlusIcon} alt="" />
                      Add Purchase Item
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </div>
          <div className="billing_details p-0">
            <div className="data_table_wrapper max_height border border-bottom-0 overflow-hidden">
              <DataTable
                value={values?.purchase_items}
                sortField="price"
                sortOrder={1}
                footerColumnGroup={footerGroup}
                rows={10}
              >
                <Column
                  field="item_name"
                  header="Purchase Item"
                  sortable
                ></Column>
                <Column field="quantity" header="Quantity" sortable></Column>
                <Column field="rate" header="Rate" sortable></Column>
                <Column field="amount" header="Amount Paid" sortable></Column>
                <Column
                  field="action"
                  header="Action"
                  sortable
                  body={ActionTemplet}
                ></Column>
              </DataTable>
            </div>
            <div className="amount_condition p20 p15-lg">
              <Row className="justify-content-between g-3">
                <Col xxl={4} xl={5} lg={6}>
                  {/* <div className="amount-condition-wrapper border radius15"> */}
                  {/* <div className="p20 border-bottom">
                    <h5 className="m-0">Term & Condition</h5>
                  </div> */}
                  <div className="condition-content">
                    <h4 className="m-0 mb-2">Terms & Condition</h4>
                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      formats={quillFormats}
                      name="terms_condition"
                      value={values?.terms_condition}
                      onChange={content =>
                        !checkViewPermission &&
                        commonUpdateFieldValue('terms_condition', content)
                      }
                      style={{ height: '150px' }}
                    />
                  </div>
                </Col>
                <Col xxl={4} xl={5} lg={6}>
                  <div className="amount-condition-wrapper border radius15">
                    <div className="condition-content p20">
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Sub Total</h5>
                        </div>
                        <div className="subtotal-input">
                          <h5>{values?.sub_total}</h5>
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
                        <div className="subtotal-title">
                          <h5>Discount ( - )</h5>
                        </div>
                        <div className="subtotal-input">
                          <InputNumber
                            name="discount"
                            useGrouping={false}
                            maxFractionDigits={2}
                            maxLength="10"
                            value={values?.discount}
                            placeholder="Discount"
                            onChange={e => {
                              if (!e.value || checkWordLimit(e.value, 10)) {
                                setFieldValue(
                                  'discount',
                                  e.value ? e.value : '',
                                );
                                handleAmountAndDiscount(e);
                              }
                            }}
                            disabled={checkViewPermission}
                          />
                        </div>
                      </div>
                      {/* <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setSubTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Additional Charges
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div> */}
                      <div className="sub-total-wrapper total-amount">
                        <div className="subtotal-title">
                          <h5 className="fw_700">Total Amount</h5>
                        </div>
                        <div className="subtotal-input">
                          <h5 className="fw_700">{values?.total_amount}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div class="title_right_wrapper button_padding_manage">
            <ul class="justify-content-end">
              <li>
                <Button
                  onClick={() => {
                    navigate('/purchase-invoice');
                  }}
                  className="btn_border_dark filter_btn"
                >
                  Exit Page
                </Button>
              </li>
              {!checkViewPermission && (
                <li>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn_primary filter_btn"
                  >
                    {id ? 'Update' : 'Save'}
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <Dialog
          header={`${
            subFormik?.values?.unique_id ? 'Update' : 'Add'
          } Purchase Item`}
          className="modal_Wrapper overview_dialog"
          visible={showPurchasePopup}
          onHide={() => {
            setShowPurchasePopup(false);
            setAddPurchaseItemDetails(addItemIntialValues);
          }}
          draggable={false}
        >
          <div className="delete_popup_wrapper">
            <div className="delete_popup_wrapper">
              <Row>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>
                      Purchase Item <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      name="item_name"
                      value={subFormik?.values?.item_name}
                      placeholder="Enter Purchase Item"
                      onChange={subFormik?.handleChange}
                      onBlur={subFormik?.handleBlur}
                      className="input_wrap"
                      // onChange={e => handleChangePopupData(e)}
                    />
                    {subFormik?.touched?.item_name &&
                      subFormik?.errors?.item_name && (
                        <p className="text-danger">
                          {subFormik?.errors?.item_name}
                        </p>
                      )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>
                      Quantity <span className="text-danger fs-6">*</span>
                    </label>
                    <InputNumber
                      name="quantity"
                      placeholder="Enter Quantity"
                      value={subFormik?.values?.quantity}
                      onBlur={subFormik?.handleBlur}
                      onChange={e => {
                        if (!e.value || checkWordLimit(e.value, 10)) {
                          subFormik?.setFieldValue('quantity', e.value);
                        }
                      }}
                      useGrouping={false}
                      maxLength="10"
                      // className="input_wrap"
                      // onChange={e => handleChangePopupData(e)}
                    />
                    {subFormik?.touched?.quantity &&
                      subFormik?.errors?.quantity && (
                        <p className="text-danger">
                          {subFormik?.errors?.quantity}
                        </p>
                      )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>
                      Rate <span className="text-danger fs-6">*</span>
                    </label>
                    <InputNumber
                      name="rate"
                      placeholder="Enter Rate"
                      value={subFormik?.values?.rate}
                      onBlur={subFormik?.handleBlur}
                      onChange={e => {
                        if (!e.value || checkWordLimit(e.value, 10)) {
                          subFormik?.setFieldValue('rate', e.value);
                        }
                      }}
                      useGrouping={false}
                      maxFractionDigits={2}
                      maxLength="10"
                      // className="input_wrap"
                      // value={purchasePopupDetail?.rate}
                    />
                    {subFormik?.touched?.rate && subFormik?.errors?.rate && (
                      <p className="text-danger">{subFormik?.errors?.rate}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="delete_btn_wrap">
              <Button
                onClick={() => {
                  setShowPurchasePopup(false);
                  setAddPurchaseItemDetails(addItemIntialValues);
                }}
                className="btn_border_dark"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={subFormik?.handleSubmit}
                className="btn_primary"
              >
                {subFormik?.values?.unique_id ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialog
          header={
            <div className="dialog_logo">
              <img src={values?.company_logo} alt="" />
            </div>
          }
          className="modal_Wrapper payment_dialog"
          visible={visiblePreview}
          onHide={() => setVisiblePreview(false)}
          draggable={false}
        >
          <div className="voucher_text">
            <h2>Purchase Invoice</h2>
          </div>
          <div className="delete_popup_wrapper">
            <div className="client_payment_details">
              <div className="voucher_head">
                <h5>{values?.client_company}</h5>
              </div>
              <Row className="justify-content-between gy-3">
                <Col sm={5}>
                  <div className="user_bank_details">
                    <h5>
                      Paid To : <span>{values?.client_name}</span>
                    </h5>
                  </div>
                  {/* <div className="user_bank_details">
                    <h5>
                      Payment From : <span>{values?.company_name}</span>
                    </h5>
                  </div> */}
                </Col>
                <Col sm={5}>
                  <div className="user_bank_details bank_details_light">
                    <h5>
                      Purchase Invoice No{' '}
                      <span>{values?.purchase_invoice_no}</span>
                    </h5>
                  </div>
                  <div className="user_bank_details bank_details_light">
                    <h5>
                      Payment Date{' '}
                      <span>{getFormattedDate(values?.create_date)}</span>
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper max_height border radius15 overflow-hidden">
              <DataTable
                value={values?.purchase_items}
                sortField="price"
                sortOrder={1}
                // rows={10}
                // footerColumnGroup={EntryfooterGroup}
              >
                <Column
                  field="item_name"
                  header="Item/Service Name"
                  sortable
                ></Column>
                <Column field="quantity" header="Qty" sortable></Column>
                <Column field="rate" header="Rate" sortable></Column>
                <Column field="amount" header="Amount" sortable></Column>
              </DataTable>
            </div>
            <div className="delete_btn_wrap">
              <button
                className="btn_primary"
                onClick={handleDownloadPreview}
                disabled={!values?.purchase_items?.length}
              >
                <img src={DownloadIcon} alt="downloadicon" /> Download
              </button>
            </div>
          </div>
        </Dialog>

        {/* additional charges popup */}
        {/* <Dialog
        className="modal_Wrapper modal_small"
        visible={subTotal}
        onHide={() => setSubTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setSubTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setSubTotal(false)}>
            Save
          </button>
        </div>
      </Dialog> */}

        {/* <ConfirmDeletePopup
        deletePopup={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      /> */}
      </div>
    </>
  );
};

export default memo(PurchaseInvoiceDetail);
