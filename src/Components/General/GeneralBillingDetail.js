import { useCallback, memo, useMemo } from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  checkWordLimit,
  convertIntoNumber,
  generateUniqueId,
  thousandSeparator,
  totalCount,
} from 'Helper/CommonHelper';
import { toast } from 'react-toastify';
import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import { useDispatch, useSelector } from 'react-redux';
import TrashIcon from '../../Assets/Images/trash.svg';
import PdfIcon from '../../Assets/Images/pdf-icon.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import {
  addGeneralBilling,
  editGeneralBilling,
  setAddGeneralBillingData,
  setClearAddGeneralBillingData,
  setClearEditGeneralBillingData,
  setIsGetInitialValuesGeneralBilling,
  setEditGeneralBillingData,
  getGeneralBillingDetail,
} from 'Store/Reducers/GeneralBilling/GeneralBillingSlice';
import { MultiSelect } from 'primereact/multiselect';
import moment from 'moment';
import { validationGeneralBilling } from 'Schema/GeneralBilling/GeneralBillingSchema';

const paymentMethodOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank', value: 'Bank' },
  { label: 'UPI', value: 'UPI' },
];

const GeneralBillingDetail = ({ initialValues }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const checkViewPermission =
    id && (state?.iseView || locationPath[1] === 'view-general-billing');

  const {
    isGetInitialValuesGeneralBilling,
    addGeneralBillingData,
    editGeneralBillingData,
    editGeneralBillingLoading,
    generalBillingNoLoading,
    generalBillingDetailLoading,
    generalBillingLoading,
    addGeneralBillingLoading,
  } = useSelector(({ generalBilling }) => generalBilling);

  const { productList, productLoading } = useSelector(({ product }) => product);

  const { packageList, packageLoading } = useSelector(
    ({ packages }) => packages,
  );

  const { currencyList, currencyLoading } = useSelector(
    ({ currency }) => currency,
  );

  const { accountLoading, accountList } = useSelector(({ account }) => account);

  const accountOptions = useMemo(() => {
    let accountData = [];
    if (accountList?.list?.length) {
      accountList?.list?.forEach(({ account }) => {
        if (account?.length) {
          accountData = [
            ...accountData,
            ...account?.map(acc => ({
              label: acc?.account_name,
              value: acc?._id,
            })),
          ];
        }
      });
    }
    return accountData;
  }, [accountList]);

  const handleAccountData = useCallback(
    async accountID => {
      const accountData = accountList?.list
        ?.map(({ account }) => account)
        ?.flat()
        ?.find(acc => acc?._id === accountID);

      if (accountData) {
        const commonFieldObj = {
          account_id: accountID,
        };

        handleChangeFieldsdData(commonFieldObj);
      }
    },
    [accountList],
  );

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (id) {
      if (locationPath[1] === 'edit-general-billing') {
        dispatch(
          setEditGeneralBillingData({
            ...editGeneralBillingData,
            ...fieldObject,
          }),
        );
      }
    } else {
      dispatch(
        setAddGeneralBillingData({
          ...addGeneralBillingData,
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
      if (locationPath[1] === 'edit-general-billing') {
        dispatch(
          setEditGeneralBillingData({
            ...editGeneralBillingData,
            [fieldName]: fieldValue,
          }),
        );
      }
    } else {
      dispatch(
        setAddGeneralBillingData({
          ...addGeneralBillingData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const submitHandle = useCallback(
    async values => {
      if (!values?.billing_items || values?.billing_items?.length === 0) {
        toast.error('Please add at least one billing item');
        return;
      }

      const isRate = values?.billing_items?.some(item => {
        return !item?.rate || item?.rate === 0;
      });

      const isDueDate = values?.billing_items?.some(item => {
        return !item?.due_date;
      });

      const isQty = values?.billing_items?.some(item => {
        return !item?.quantity || item?.quantity === 0;
      });

      if (isDueDate) {
        toast.error('Due Date in Billing Items is Required');
        return;
      } else if (isQty) {
        toast.error('Quantity in Billing Items is Required');
        return;
      } else if (isRate) {
        toast.error('Rate in Billing Items is Required');
        return;
      }

      const selectedCurrency = currencyList?.list?.find(
        c => c?._id === values?.currency,
      );

      if (!selectedCurrency) {
        toast.error('Please select a currency');
        return;
      }

      const updatedBillingItems = values?.billing_items?.map(item => {
        return {
          item_id: item?.item_id,
          description: item?.description || '',
          due_date: item?.due_date
            ? moment(item?.due_date).format('YYYY-MM-DD')
            : null,
          quantity: convertIntoNumber(item?.quantity),
          rate: convertIntoNumber(item?.rate),
          amount: convertIntoNumber(item?.amount),
        };
      });

      const payload = {
        ...(id && { billing_id: id }),
        client_name: values?.client_name || '',
        mobile_number: values?.mobile_number || '',
        billing_no: values?.billing_no || '',
        time: values?.time ? moment(values?.time).format('hh:mm A') : null,
        data_size: values?.data_size || '',
        due_date: values?.due_date
          ? moment(values?.due_date).format('YYYY-MM-DD')
          : null,
        description: values?.description || '',
        sub_total: convertIntoNumber(values?.sub_total || 0),
        discount: convertIntoNumber(values?.discount || 0),
        tax: convertIntoNumber(values?.tax || 0),
        tax_percentage: convertIntoNumber(values?.tax_percentage || 0),
        total_amount: convertIntoNumber(values?.total_amount || 0),
        currency: values?.currency,
        currency_symbol: selectedCurrency?.currency_symbol || '',
        conversation_rate: convertIntoNumber(values?.conversation_rate || 1),
        account_id: values?.account_id,
        payment_method: values?.payment_method || '',
        billing_items: updatedBillingItems,
      };

      if (id) {
        const res = await dispatch(editGeneralBilling(payload));
        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesGeneralBilling({
              ...isGetInitialValuesGeneralBilling,
              update: false,
            }),
          );
          dispatch(setClearEditGeneralBillingData());
          navigate('/general-billing');
        }
      } else {
        const res = await dispatch(addGeneralBilling(payload));
        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesGeneralBilling({
              ...isGetInitialValuesGeneralBilling,
              add: false,
            }),
          );
          dispatch(setClearAddGeneralBillingData());
          navigate('/general-billing');
        }
      }
    },
    [dispatch, id, isGetInitialValuesGeneralBilling, navigate, currencyList],
  );

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: validationGeneralBilling,
      onSubmit: submitHandle,
    });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={5} />
        <Column
          footer={`${
            values?.selected_currency
              ? values?.selected_currency?.currency_symbol
              : ''
          } ${values?.sub_total ? values?.sub_total : 0}`}
          colSpan={2}
        />
      </Row>
    </ColumnGroup>
  );

  const editingItemOptionList = useMemo(() => {
    const packageData =
      packageList?.list?.map(item => ({
        ...item,
        label: item?.package_name,
        value: item?._id,
        isPackage: true,
      })) || [];

    const productData =
      productList?.list?.map(item => ({
        ...item,
        label: item?.item_name,
        value: item?._id,
        isPackage: false,
      })) || [];

    const quotationDetails = [
      {
        label: 'Package',
        items: packageData,
      },
      { label: 'Product', items: productData },
    ];

    return quotationDetails;
  }, [productList, packageList]);

  const handleItemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let billingList = [];

    if (!values?.billing_inquiry?.includes(data?._id)) {
      let newObj = {};
      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: '',
          due_date: data?.due_date ? new Date(data?.due_date) : null,
          description: data?.remark || '',
          rate: '',
          amount: '',
          unique_id: generateUniqueId(),
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: '',
          due_date: data?.due_date ? new Date(data?.due_date) : null,
          description: data?.item_description || '',
          rate: '',
          amount: '',
          unique_id: generateUniqueId(),
        };
      }
      billingList = [...(values?.billing_items || []), newObj];
    } else {
      billingList = values?.billing_items?.filter(
        item => item?.item_id !== data?._id,
      );
      const discount = values?.discount || 0;
      const taxPercentage = values?.tax_percentage || 0;
      const subTotal = totalCount(billingList, 'amount');
      const calculatedSubAmount =
        convertIntoNumber(subTotal) - convertIntoNumber(discount);
      const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
      const totalAmount = calculatedSubAmount + taxAmount;

      setFieldValue('tax', convertIntoNumber(taxAmount));
      setFieldValue('total_amount', convertIntoNumber(totalAmount));
      setFieldValue('sub_total', convertIntoNumber(subTotal));

      let itemData = values?.billing_inquiry
        ? values?.billing_inquiry?.filter(item => item !== data?._id)
        : [];
      setFieldValue('billing_inquiry', itemData);
    }
    setFieldValue('billing_items', billingList);
    setFieldValue(fieldName, fieldValue);
  };

  const handleBillingTableChange = (item, fieldName, fieldValue) => {
    const billingList = [...(values?.billing_items || [])];
    const index = billingList?.findIndex(x => x?.unique_id === item?.unique_id);
    if (index === -1) return;

    const oldObj = billingList[index];
    let totalAmount = 0,
      taxAmount = 0,
      subTotal = 0;

    if (fieldName === 'quantity') {
      const rate = billingList[index]['rate'] || 0;
      const amount = fieldValue * rate;
      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
        amount: amount,
      };
      billingList[index] = updatedObj;
    } else if (fieldName === 'rate') {
      const quantity = billingList[index]['quantity'] || 0;
      const amount = fieldValue * quantity;

      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
        amount: amount,
      };

      billingList[index] = updatedObj;
    } else {
      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
      };
      billingList[index] = updatedObj;
    }

    const discount = values?.discount || 0;
    const taxPercentage = values?.tax_percentage || 0;
    subTotal = totalCount(billingList, 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('billing_items', billingList);
  };

  const handleDiscountChange = (fieldName, fieldValue) => {
    const discount = fieldValue || 0;
    const taxPercentage = values?.tax_percentage || 0;
    const subTotal = totalCount(values?.billing_items || [], 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    const totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue(fieldName, fieldValue);
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
  };

  const handleTaxPercentageChange = (fieldName, fieldValue) => {
    const taxPercentage = fieldValue || 0;
    const discount = values?.discount || 0;
    const subTotal = totalCount(values?.billing_items || [], 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    const totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue(fieldName, fieldValue);
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
  };

  const editingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const handleDeleteEditingItem = item => {
    let dummyList = values?.billing_items?.filter(
      d => d?.unique_id !== item?.unique_id,
    );
    const discount = dummyList?.length ? values?.discount : 0;
    const taxPercentage = dummyList?.length ? values?.tax_percentage : 0;
    const subTotal = totalCount(dummyList, 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    const totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('discount', discount);
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('billing_items', dummyList);
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('tax_percentage', taxPercentage);
    let itemData = values?.billing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('billing_inquiry', itemData);
  };

  const currencyOptionData = useMemo(() => {
    let currencyData = [];
    if (currencyList?.list?.length) {
      currencyData = currencyList?.list?.map(item => {
        return {
          label: item?.currency_code,
          value: item._id,
        };
      });
    }
    return currencyData;
  }, [currencyList]);

  const descriptionBodyTemplate = data => {
    return (
      <div
        className="editor_text_wrapper max_700"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
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
          value={data?.quantity}
          onChange={e => {
            if (!e.value || checkWordLimit(e.value, 10)) {
              handleBillingTableChange(
                data,
                e.originalEvent.target.name,
                e.value !== null ? e.value : '',
              );
            }
          }}
          min={0}
          maxLength="10"
          minFractionDigits={0}
          maxFractionDigits={2}
          disabled={checkViewPermission}
        />
      </div>
    );
  };

  const rateBodyTemplate = data => {
    return (
      <div className="d-flex align-items-center justify-content-around">
        <span className="me-1">
          {values?.selected_currency
            ? values?.selected_currency?.currency_symbol
            : ''}
        </span>
        <div className="form_group d-flex">
          <InputNumber
            id="Rate"
            placeholder="Rate"
            name="rate"
            className="w_100"
            useGrouping={false}
            maxFractionDigits={2}
            value={data?.rate}
            onChange={e => {
              if (!e.value || checkWordLimit(e.value, 10)) {
                handleBillingTableChange(
                  data,
                  e.originalEvent.target.name,
                  e.value !== null ? e.value : '',
                );
              }
            }}
            min={0}
            maxLength="10"
            disabled={checkViewPermission}
          />
        </div>
      </div>
    );
  };

  const amountTemplate = rowData => {
    return (
      <div className="d-flex">
        <span className="me-1">
          {values?.selected_currency
            ? values?.selected_currency?.currency_symbol
            : ''}
        </span>
        <span>{rowData?.amount || 0}</span>
      </div>
    );
  };

  const actionBodyTemplate = data => {
    return (
      <div className="group-delete">
        <Button
          className="btn_as_text"
          onClick={() => handleDeleteEditingItem(data)}
          disabled={checkViewPermission}
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };

  const dueDateBodyTemplate = data => {
    return (
      <div className="">
        <div className="form_group">
          <div className="date_select">
            <Calendar
              placeholder="Select Date"
              dateFormat="dd-mm-yy"
              value={data?.due_date || null}
              name="due_date"
              readOnlyInput
              onChange={e =>
                handleBillingTableChange(data, e.target.name, e.target.value)
              }
              showIcon
              showButtonBar
              disabled={checkViewPermission}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {(addGeneralBillingLoading ||
        editGeneralBillingLoading ||
        packageLoading ||
        productLoading ||
        currencyLoading ||
        generalBillingNoLoading ||
        generalBillingDetailLoading ||
        generalBillingLoading ||
        accountLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="bg-white radius15 border">
          <div className="billing_heading">
            <Row className="align-items-center gy-3">
              <Col sm={6}>
                <div class="page_title">
                  <h3 class="m-0">
                    {`${
                      id ? (checkViewPermission ? 'View' : 'Edit') : 'Add'
                    } General Billing`}
                  </h3>
                </div>
              </Col>
              {checkViewPermission && (
                <Col sm={6}>
                  <ul className="billing-btn justify-content-sm-end">
                    <li>
                      <Button
                        className="btn_border_dark filter_btn"
                        onClick={() => {
                          dispatch(
                            getGeneralBillingDetail({
                              billing_id: id,
                              pdf: true,
                            }),
                          );
                        }}
                      >
                        <img src={PdfIcon} alt="" /> Save As PDF
                      </Button>
                    </li>
                  </ul>
                </Col>
              )}
            </Row>
          </div>

          <div className="billing_details border-bottom">
            <Row className="g-3 g-sm-4">
              <Col lg={12}>
                <div className="p10 border radius15">
                  <div className="pb10 border-bottom">
                    <h6 className="m-0">Company</h6>
                  </div>
                  <div className="details_box pt15">
                    <div class="details_box_inner">
                      <div class="order-date">
                        <span>Company Name :</span>
                        <h5>
                          {values?.company_name ? values?.company_name : ''}
                        </h5>
                      </div>
                    </div>
                    <div class="details_box_inner">
                      <div class="order-date">
                        <span>Director Name :</span>
                        <h5>
                          {values?.director_name ? values?.director_name : ''}
                        </h5>
                      </div>
                    </div>
                    <div class="details_box_inner">
                      <div class="order-date">
                        <span>Phone No :</span>
                        <h5>{values?.mobile_no ? values?.mobile_no : ''}</h5>
                      </div>
                    </div>
                    <div class="details_box_inner">
                      <div class="order-date">
                        <span>Email :</span>
                        <h5>{values?.email_id ? values?.email_id : ''}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="p20 p10-sm border-bottom">
            <Row>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>Billing No</label>
                  <InputText
                    placeholder="Billing No"
                    name="billing_no"
                    value={values?.billing_no || ''}
                    className="input_wrap"
                    disabled
                  />
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Client Name <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    placeholder="Client Name"
                    name="client_name"
                    value={values?.client_name || ''}
                    className="input_wrap"
                    onChange={e => {
                      commonUpdateFieldValue('client_name', e.target.value);
                    }}
                    disabled={checkViewPermission}
                    onBlur={handleBlur}
                  />
                  {touched?.client_name && errors?.client_name && (
                    <p className="text-danger">{errors?.client_name}</p>
                  )}
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label htmlFor="mobile_number">
                    Mobile Number <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="mobile_number"
                    placeholder="Mobile Number"
                    className="input_wrap"
                    name="mobile_number"
                    value={values?.mobile_number || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue('mobile_number', e.target.value);
                    }}
                    disabled={checkViewPermission}
                    required
                  />
                  {touched?.mobile_number && errors?.mobile_number && (
                    <p className="text-danger">{errors?.mobile_number}</p>
                  )}
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Account <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="account_id"
                    value={values?.account_id || ''}
                    options={accountOptions}
                    onChange={e => {
                      handleAccountData(e.target.value);
                      commonUpdateFieldValue('account_id', e.target.value);
                    }}
                    placeholder="Select Account Name"
                    disabled={checkViewPermission}
                    onBlur={handleBlur}
                  />
                  {touched?.account_id && errors?.account_id && (
                    <p className="text-danger">{errors?.account_id}</p>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Due Date <span className="text-danger fs-6">*</span>
                  </label>
                  <div className="date_select">
                    <Calendar
                      name="due_date"
                      dateFormat="dd-mm-yy"
                      placeholder="Select Due Date"
                      value={values?.due_date || null}
                      onChange={e => {
                        commonUpdateFieldValue('due_date', e.target.value);
                      }}
                      showIcon
                      showButtonBar
                      disabled={checkViewPermission}
                    />
                    {touched?.due_date && errors?.due_date && (
                      <p className="text-danger">{errors?.due_date}</p>
                    )}
                  </div>
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Time <span className="text-danger fs-6">*</span>
                  </label>
                  <div className="date_select">
                    <Calendar
                      id="calendar-timeonly"
                      name="time"
                      value={values?.time || null}
                      placeholder="Select Time"
                      onChange={e => {
                        commonUpdateFieldValue('time', e.target.value);
                      }}
                      hourFormat="12"
                      timeOnly
                      showIcon
                      disabled={checkViewPermission}
                    />

                    {touched?.time && errors?.time && (
                      <p className="text-danger">{errors?.time}</p>
                    )}
                  </div>
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label htmlFor="data_size">
                    Data Size <span className="text-danger fs-6">*</span>
                  </label>
                  <InputNumber
                    name="data_size"
                    placeholder="Enter Data Size"
                    value={values?.data_size || ''}
                    onChange={e => {
                      commonUpdateFieldValue('data_size', e.value);
                    }}
                    useGrouping={false}
                    onBlur={handleBlur}
                    maxFractionDigits={2}
                    disabled={checkViewPermission}
                  />
                  {touched?.data_size && errors?.data_size && (
                    <p className="text-danger">{errors?.data_size}</p>
                  )}
                </div>
              </Col>

              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Payment Method <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="payment_method"
                    value={values?.payment_method || ''}
                    options={paymentMethodOptions}
                    onChange={e => {
                      commonUpdateFieldValue('payment_method', e.target.value);
                    }}
                    placeholder="Select Payment Method"
                    disabled={checkViewPermission}
                    onBlur={handleBlur}
                  />
                  {touched?.payment_method && errors?.payment_method && (
                    <p className="text-danger">{errors?.payment_method}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <div className="billing_details pt0 mt0 pb-0">
            <div className="order_items">
              <h3>
                General Billing Details{' '}
                <span className="text-danger fs-6">*</span>
              </h3>

              <Row className="justify-content-between g-4">
                <Col xl={3} lg={4} md={6}>
                  <div className="form_group">
                    <MultiSelect
                      filter
                      value={
                        editingItemOptionList?.length
                          ? values?.billing_inquiry || []
                          : []
                      }
                      name="billing_inquiry"
                      options={editingItemOptionList}
                      onChange={e => {
                        handleItemList(e.target.name, e.value, e);
                      }}
                      optionLabel="label"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionGroupTemplate={editingItemsTemplate}
                      onBlur={handleBlur}
                      placeholder="Select Billing Items"
                      className="w-100"
                      showSelectAll={false}
                      disabled={checkViewPermission}
                    />
                    {touched?.billing_inquiry && errors?.billing_inquiry && (
                      <p className="text-danger">{errors?.billing_inquiry}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="billing_details pt0 mt0">
            <div className="data_table_wrapper max_height border radius15 overflow-hidden">
              <DataTable
                value={values?.billing_items || []}
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
                  field="due_date"
                  header="Due Date"
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
                <Column
                  field="amount"
                  header="Amount"
                  sortable
                  body={amountTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  sortable
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
            </div>

            <div className="amount_condition pt20 mt20">
              <Row className="d-flex justify-content-between g-4">
                <Col xl={5} lg={6}>
                  <div className="amount-condition-wrapper">
                    <div className="condition-content">
                      <h4 className="mb-2">Description</h4>
                      <ReactQuill
                        theme="snow"
                        modules={quillModules}
                        formats={quillFormats}
                        name="description"
                        value={values?.description || ''}
                        onChange={content =>
                          commonUpdateFieldValue('description', content)
                        }
                        readOnly={checkViewPermission}
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
                          <h5>
                            {values?.selected_currency
                              ? values?.selected_currency?.currency_symbol
                              : ''}{' '}
                            {values?.sub_total}
                          </h5>
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Discount ( - )</h5>
                        </div>
                        <div className="d-flex align-items-center subtotal-input gap-1">
                          <div>
                            {values?.selected_currency
                              ? values?.selected_currency?.currency_symbol
                              : ''}
                          </div>
                          <InputNumber
                            placeholder="Discount"
                            name="discount"
                            className="w-100"
                            maxFractionDigits={2}
                            useGrouping={false}
                            value={values?.discount}
                            onChange={e => {
                              handleDiscountChange(
                                e.originalEvent.target.name,
                                e.value,
                              );
                            }}
                            disabled={checkViewPermission}
                          />
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="tax-input">
                          <h5>Tax</h5>
                          <div className="subtotal-input">
                            <InputNumber
                              name="tax_percentage"
                              placeholder="Tax Percentage"
                              value={values?.tax_percentage}
                              onChange={e => {
                                if (!e?.value || checkWordLimit(e?.value, 3)) {
                                  const value = e.value > 100 ? 100 : e.value;
                                  handleTaxPercentageChange(
                                    e.originalEvent.target.name,
                                    value,
                                  );
                                }
                              }}
                              min={0}
                              max={100}
                              maxLength={3}
                              useGrouping={false}
                              maxFractionDigits={2}
                              disabled={checkViewPermission}
                            />
                          </div>
                        </div>
                        <div className="d-flex align-items-center subtotal-input gap-1">
                          <div>
                            {values?.selected_currency
                              ? values?.selected_currency?.currency_symbol
                              : ''}
                          </div>
                          <InputText
                            placeholder="₹ 00.00"
                            value={values?.tax}
                            name="tax"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="sub-total-wrapper total-amount">
                        <div className="subtotal-title">
                          <div className="subtotal-currency">
                            <h5 className="fw_700">Total Amount</h5>
                            <div className="form_group">
                              <ReactSelectSingle
                                filter
                                className="currency_dropdown"
                                id="currency"
                                name="currency"
                                placeholder="Select Currency"
                                value={values?.currency || ''}
                                options={currencyOptionData}
                                onBlur={handleBlur}
                                disabled={checkViewPermission}
                                onChange={e => {
                                  const findObj = currencyList?.list?.find(
                                    item => {
                                      return item._id === e.target.value;
                                    },
                                  );

                                  setFieldValue('currency', e.target.value);

                                  if (findObj) {
                                    commonUpdateFieldValue(
                                      'conversation_rate',
                                      findObj.exchange_rate || 1,
                                    );
                                    commonUpdateFieldValue(
                                      'selected_currency',
                                      findObj,
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="subtotal-input">
                          <h5 className="fw_700">
                            {values?.selected_currency
                              ? values?.selected_currency?.currency_symbol
                              : ''}{' '}
                            {values?.total_amount}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pl20">
                    Conversion :{' '}
                    <span className="fw-bold">
                      {thousandSeparator(
                        (values?.total_amount || 0) *
                          (values?.conversation_rate || 1),
                      )}
                    </span>
                  </div>

                  <div className="amount-condition-wrapper border radius15 mt-3">
                    <div className="d-flex justify-content-around condition-content p5">
                      <div>
                        {`${1} ${
                          values?.selected_currency?.currency_code
                            ? values?.selected_currency?.currency_code
                            : ''
                        }`}
                      </div>
                      <div>=</div>
                      <div>
                        <InputNumber
                          id="ConversationRate"
                          placeholder="conversation rate"
                          name="conversation_rate"
                          className="w_100 currency_input"
                          useGrouping={false}
                          value={values?.conversation_rate || 1}
                          onChange={e => {
                            if (!e.value || checkWordLimit(e.value, 8)) {
                              commonUpdateFieldValue(
                                'conversation_rate',
                                e.value || 1,
                              );
                            }
                          }}
                          maxLength="8"
                          min={0}
                          minFractionDigits={0}
                          maxFractionDigits={2}
                          disabled={checkViewPermission}
                        />

                        {`${
                          values?.default_currency?.currency_code
                            ? values?.default_currency?.currency_code
                            : 'INR'
                        }`}
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
                    navigate('/general-billing');
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
      </div>
    </>
  );
};

export default memo(GeneralBillingDetail);
