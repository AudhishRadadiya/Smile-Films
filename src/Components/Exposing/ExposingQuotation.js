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
import ReactSelectSingle from '../Common/ReactSelectSingle';
import {
  addExposingStep,
  addInvoice,
  editQuotation,
  exposingAddQuotation,
  getExposingDetails,
  getExposingQuotation,
  getExposingQuotationList,
  getExposingStep,
  setExposingQuotationData,
  setExposingSelectedProgressIndex,
  setQuotationApprovedData,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkWordLimit,
  convertIntoNumber,
  thousandSeparator,
  totalCount,
} from 'Helper/CommonHelper';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { useFormik } from 'formik';
import { exposingQuotationSchema } from 'Schema/Exposing/exposingSchema';
import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getQuotationName } from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

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

  const { quotationNameLoading } = useSelector(({ editing }) => editing);
  const { productList, productLoading } = useSelector(({ product }) => product);
  const { clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { packageList, packageLoading } = useSelector(
    ({ packages }) => packages,
  );
  const { currencyList, currencyLoading } = useSelector(
    ({ currency }) => currency,
  );
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

  useEffect(() => {
    if (!exposingQuotationData?.quotation_id) {
      dispatch(getQuotationName())
        .then(res => {
          const quotationName = res.payload;
          return { quotationName };
        })
        .then(({ quotationName }) => {
          dispatch(getExposingDetails({ order_id: id }))
            .then(response => {
              const responseData = response.payload;
              return { responseData };
            })
            .then(async ({ responseData }) => {
              const currencyData = await dispatch(
                getCurrencyList({
                  start: 0,
                  limit: 0,
                  isActive: true,
                  search: '',
                }),
              );

              const currencyDetails = currencyData?.payload?.data?.list;
              const clientCurrency = currencyDetails?.find(
                c => c?._id === responseData?.currency,
              );
              const defaultCurrency = currencyDetails?.find(
                c => c?.currency_code === 'INR',
              );

              let updatedList = responseData?.exposing_order_table?.map(
                item => {
                  const rate = item?.rate ?? item?.default_rate;
                  const amount = rate * item?.quantity;

                  // const startDate = item?.order_start_date
                  //   ? new Date(item?.order_start_date)
                  //   : null;
                  // const endDate = item?.order_end_date
                  //   ? new Date(item?.order_end_date)
                  //   : null;

                  // const convertedIntoDateArray =
                  //   startDate && endDate ? [startDate, endDate] : [];

                  return {
                    ...item,
                    // order_date: convertedIntoDateArray,
                    rate: rate,
                    amount: amount,
                    order_item_id: item?._id,
                  };
                },
              );

              const discount = values?.discount ? values?.discount : 0;
              const taxPercentage = values?.tax_percentage
                ? values?.tax_percentage
                : 0;
              let totalAmount = 0,
                taxAmount = 0,
                subTotal = 0;
              subTotal = totalCount(updatedList, 'amount');
              const amount =
                convertIntoNumber(subTotal) - convertIntoNumber(discount);
              taxAmount = (amount * taxPercentage) / 100;
              totalAmount = amount + taxAmount;

              const updated = {
                ...responseData,
                quotation_name: quotationName ? quotationName : '',
                mobile_no: Array.isArray(responseData?.mobile_no)
                  ? responseData?.mobile_no?.join(', ')
                  : responseData?.mobile_no,
                exposing_order_table: updatedList,
                terms_condition: '',
                total_amount_collection: convertIntoNumber(subTotal),
                discount: discount,
                tax: convertIntoNumber(taxAmount),
                tax_percentage: taxPercentage,
                total_amount: convertIntoNumber(totalAmount),
                currency: clientCurrency?._id,
                selected_currency: clientCurrency,
                exchange_currency_rate: clientCurrency?.exchange_rate,
                default_currency: defaultCurrency,
              };

              dispatch(setExposingQuotationData(updated));
            })
            .catch(error => {
              console.error('Error fetching employee data:', error);
            });
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
        type: 2,
      }),
    );
    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 2,
      }),
    );
  }, [dispatch]);

  const currencyOptionList = useMemo(() => {
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

  const exposingItemOptionList = useMemo(() => {
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

    // let filteredPackageData = packageData?.filter(d =>
    //   exposingDetailsData?.selected_exposing_order_item?.includes(d?._id),
    // );
    // let filteredProductData = productData?.filter(d =>
    //   exposingDetailsData?.selected_exposing_order_item?.includes(d?._id),
    // );

    const quotationDetails = [
      {
        label: 'Package',
        items: packageData,
      },
      { label: 'Product', items: productData },
    ];

    return quotationDetails;
  }, [packageList, productList]);

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

  const handleDiscountChange = (fieldName, fieldValue) => {
    const discount = fieldValue;
    const subTotal = totalCount(values?.exposing_order_table, 'amount');
    const amount = convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (amount * values?.tax_percentage) / 100;
    const totalAmount = amount + taxAmount;
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('total_amount_collection', convertIntoNumber(subTotal));
    setFieldValue(fieldName, fieldValue);
  };

  const handleTaxPercentageChange = (fieldName, fieldValue) => {
    const taxPercentage = fieldValue;
    const subTotal = totalCount(values?.exposing_order_table, 'amount');
    const discount = values?.discount;
    const amount = convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (amount * taxPercentage) / 100;
    const totalAmount = amount + taxAmount;
    setFieldValue('tax', convertIntoNumber(taxAmount));
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

  const handleMarkAsApprovedChange = useCallback(() => {
    let payload = {
      quotation_id: selectedExposingQuatationData?._id,
      status: 2,
    };
    dispatch(editQuotation(payload))
      .then(response => {
        if (!!response.payload) {
          dispatch(
            setQuotationApprovedData({
              quotation_id: selectedExposingQuatationData?._id,
            }),
          );

          if (getExposingStepData?.step < 2) {
            let payload = {
              order_id: id,
              step: 2,
            };
            dispatch(addExposingStep(payload))
              .then(response => {
                dispatch(getExposingStep({ order_id: id }));
                dispatch(setExposingSelectedProgressIndex(3));
              })
              .catch(errors => {
                console.error('Add Status:', errors);
              });
          } else {
            dispatch(setExposingSelectedProgressIndex(3));
          }

          // dispatch(setExposingSelectedProgressIndex(3));
        }
      })
      .catch(error => {
        console.error('Error fetching while quotation:', error);
      });
  }, [id, dispatch, getExposingStepData, selectedExposingQuatationData]);

  const fetchRequiredData = useCallback(
    async formData => {
      dispatch(getExposingQuotationList({ order_id: id, approval: false }));
      const quotationData = await dispatch(getQuotationName());
      const clientCompanyData = await dispatch(
        getClientCompany({
          client_company_id: formData?.client_company_id,
        }),
      );

      const clientCompanyDetails = clientCompanyData?.payload?.data;
      const clientCurrency = currencyList?.list?.find(
        c => c?._id === clientCompanyDetails?.currency_id,
      );

      const updated = {
        ...exposingQuotationData,
        ...selectedExposingQuatationData,
        exposing_order_table: [],
        exposingOrderList: [],
        quotation_id: selectedExposingQuatationData?._id,
        quotation_name: quotationData.payload ? quotationData.payload : '',
        terms_condition: '',
        total_amount_collection: 0,
        discount: 0,
        tax: 0,
        total_amount: 0,
        tax_percentage: 18,
        selected_exposing_order_item: [],
        currency: clientCurrency?._id,
        selected_currency: clientCurrency,
        exchange_currency_rate: clientCurrency?.exchange_rate,
      };

      return updated;
    },
    [
      id,
      dispatch,
      currencyList,
      exposingQuotationData,
      selectedExposingQuatationData,
    ],
  );

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const currentCurrencyRate = values?.exchange_currency_rate;

      const isRate = values?.exposing_order_table?.some(item => {
        return !item?.rate || item?.rate === 0;
      });

      const isDueDate = values?.exposing_order_table?.some(item => {
        return !item?.order_date?.length === 2;
      });

      const isQty = values?.exposing_order_table?.some(item => {
        return !item?.quantity || item?.quantity === 0;
      });

      if (!currentCurrencyRate) {
        toast.error('Currency rate is required');
      } else if (isDueDate) {
        toast.error('Event Date in Quotation Details is Required');
      } else if (isQty) {
        toast.error('Quantity in Quotation Details is Required');
      } else if (isRate) {
        toast.error('Rate in Quotation Details is Required');
      } else {
        const currentCurrencyData = values?.selected_currency;

        const updatedList = values?.exposing_order_table?.map(d => {
          const calculatedRate = d?.rate * currentCurrencyRate;

          const startDate =
            d?.order_date?.length && d?.order_date[0]
              ? moment(d?.order_date[0])?.format('YYYY-MM-DD')
              : '';
          const endDate =
            d?.order_date?.length && d?.order_date[1]
              ? moment(d?.order_date[1])?.format('YYYY-MM-DD')
              : '';

          const findObj = values?.quotation_detail?.find(
            item => item?.item_id === d?.item_id,
          );

          return {
            item_id: d?.item_id,
            item_name: d?.item_name,
            order_start_date: startDate,
            order_end_date: endDate,
            description: d?.description,
            quantity: d?.quantity,
            rate: convertIntoNumber(calculatedRate),
            amount: convertIntoNumber(d?.quantity * calculatedRate),
            ...(isEdit && { quotation_details_id: findObj?._id }),
          };
        });

        const payload = {
          order_id: id,
          quotation_name: values?.quotation_name ? values?.quotation_name : '',
          terms_condition: values?.terms_condition
            ? values?.terms_condition
            : '',
          sub_total: values?.total_amount_collection
            ? convertIntoNumber(
                values?.total_amount_collection * currentCurrencyRate,
              )
            : 0,
          discount: values?.discount
            ? convertIntoNumber(values?.discount * currentCurrencyRate)
            : 0,
          tax: values?.tax
            ? convertIntoNumber(values?.tax * currentCurrencyRate)
            : 0,
          tax_percentage: values?.tax_percentage
            ? convertIntoNumber(values?.tax_percentage)
            : 0,
          total_amount: values?.total_amount
            ? convertIntoNumber(values?.total_amount * currentCurrencyRate)
            : 0,
          currency: values?.currency,
          conversation_rate: currentCurrencyRate,
          currency_symbol: currentCurrencyData?.currency_symbol,
          quotation_details: updatedList,
          ...(isEdit && { quotation_id: values?.quotation_id }),
        };

        if (isEdit) {
          dispatch(editQuotation(payload))
            .then(async response => {
              resetForm();
              setIsEdit(false);
              const updatedExposingQuotationData = await fetchRequiredData(
                values,
              );

              if (selectedExposingQuatationData?.status === 2) {
                dispatch(setExposingQuotationData({}));
                dispatch(setExposingSelectedProgressIndex(3));
              } else {
                dispatch(
                  setExposingQuotationData(updatedExposingQuotationData),
                );
              }

              // dispatch(getQuotationName())
              //   .then(res => {
              //     const quotationName = res.payload;
              //     return { quotationName };
              //   })
              //   .then(({ quotationName }) => {
              //     dispatch(
              //       getExposingQuotationList({ order_id: id, approval: false }),
              //     )
              //       .then(responseData => {
              //         resetForm();
              //         const updated = {
              //           ...exposingQuotationData,
              //           ...selectedExposingQuatationData,
              //           exposing_order_table: [],
              //           exposingOrderList: [],
              //           quotation_id: selectedExposingQuatationData?._id,
              //           quotation_name: quotationName ? quotationName : '',
              //           terms_condition: '',
              //           total_amount_collection: 0,
              //           discount: 0,
              //           tax: 0,
              //           total_amount: 0,
              //           tax_percentage: 18,
              //           selected_exposing_order_item: [],
              //         };
              //         dispatch(setExposingQuotationData(updated));
              //         setIsEdit(false);
              //       })
              //       .catch(error => {
              //         console.error('Error fetching quotation list:', error);
              //       });
              //   });
            })
            .catch(error => {
              console.error('Error fetching while edit quotation:', error);
            });
        } else {
          dispatch(exposingAddQuotation(payload))
            .then(async response => {
              resetForm();
              const updatedExposingQuotationData = await fetchRequiredData(
                values,
              );
              dispatch(setExposingQuotationData(updatedExposingQuotationData));

              // dispatch(getQuotationName())
              //   .then(res => {
              //     const quotationName = res.payload;
              //     return { quotationName };
              //   })
              //   .then(({ quotationName }) => {
              //     dispatch(
              //       getExposingQuotationList({ order_id: id, approval: false }),
              //     )
              //       .then(responseData => {
              //         resetForm();
              //         const updated = {
              //           ...exposingQuotationData,
              //           ...selectedExposingQuatationData,
              //           exposing_order_table: [],
              //           exposingOrderList: [],
              //           quotation_id: selectedExposingQuatationData?._id,
              //           quotation_name: quotationName ? quotationName : '',
              //           terms_condition: '',
              //           total_amount_collection: 0,
              //           discount: 0,
              //           tax: 0,
              //           tax_percentage: 18,
              //           total_amount: 0,
              //           selected_exposing_order_item: [],
              //         };
              //         dispatch(setExposingQuotationData(updated));
              //       })
              //       .catch(error => {
              //         console.error('Error fetching quotation list:', error);
              //       });
              //   });
            })
            .catch(error => {
              console.error('Error fetching while add quotation:', error);
            });
        }
      }
    },
    [id, isEdit, dispatch, fetchRequiredData, selectedExposingQuatationData],
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
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
        <Column
          footer={`${
            values?.selected_currency
              ? values?.selected_currency?.currency_symbol
              : ''
          } ${
            values?.total_amount_collection
              ? values?.total_amount_collection
              : 0
          }`}
          colSpan={2}
        />
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
    const amount = convertIntoNumber(subTotal) - convertIntoNumber(discount);
    taxAmount = (amount * values?.tax_percentage) / 100;
    totalAmount = amount + taxAmount;

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
        <div className="form_group">
          <div className="date_select">
            <Calendar
              name="order_date"
              placeholder="Select Date Range"
              value={data?.order_date ? data?.order_date : []}
              showIcon
              showButtonBar
              selectionMode="range"
              dateFormat="dd-mm-yy"
              readOnlyInput
              onChange={e => {
                // const utcDate = e.value ? new Date(e.value) : '';
                handleexposing_order_tableChange(data, e.target.name, e.value);
              }}
            />

            {/* <Calendar
              placeholder="Select Date"
              dateFormat="dd-mm-yy"
              value={data?.order_date ? data?.order_date : ''}
              name="order_date"
              readOnlyInput
              onChange={e => {
                const utcDate = e.value ? new Date(e.value) : '';
                handleexposing_order_tableChange(data, e.target.name, utcDate);
              }}
              showIcon
              showButtonBar
            /> */}
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
            // if (/^\d{1,10}$/.test(e.value)) {
            if (!e.value || checkWordLimit(e.value, 10)) {
              handleexposing_order_tableChange(
                data,
                e.originalEvent.target.name,
                e.value ? e.value : '',
              );
            }
          }}
          maxLength="10"
          minFractionDigits={0}
          maxFractionDigits={2}
        />
      </div>
    );
  };

  const rateBodyTemplate = data => {
    return (
      <div className="form_group d-flex align-items-center justify-content-around">
        <span>
          {values?.selected_currency
            ? values?.selected_currency?.currency_symbol
            : ''}
        </span>
        <InputNumber
          id="Rate"
          placeholder="Rate"
          name="rate"
          className="w_100"
          useGrouping={false}
          maxFractionDigits={2}
          value={data?.rate ? data?.rate : ''}
          maxLength="10"
          onChange={e => {
            if (!e.value || checkWordLimit(e.value, 10)) {
              handleexposing_order_tableChange(
                data,
                e.originalEvent.target.name,
                e.value ? e.value : '',
              );
            }
          }}
        />
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

  const handleDeleteEditingItem = item => {
    let dummyList = values?.exposing_order_table
      ? values?.exposing_order_table?.filter(d => d?.item_id !== item?.item_id)
      : [];
    const discount = dummyList?.length ? values?.discount : 0;
    const taxPercentage = dummyList?.length ? values?.tax_percentage : 18;
    const subTotal = totalCount(dummyList, 'amount');
    const amount = convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (amount * taxPercentage) / 100;
    const totalAmount = amount + taxAmount;
    setFieldValue('tax', taxAmount);
    setFieldValue('discount', discount);
    setFieldValue('total_amount_collection', subTotal);
    setFieldValue('exposing_order_table', dummyList);
    setFieldValue('total_amount', totalAmount);
    setFieldValue('tax_percentage', taxPercentage);
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

  const handleItemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;

    let exposingOrderList = [];

    if (!values?.selected_exposing_order_item?.includes(data?._id)) {
      let newObj = {};

      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: '',
          // order_date: data?.order_date,
          order_date: [],
          description: data?.remark,
          rate: '',
          amount: '',
          order_item_id: '',
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: '',
          // order_date: data?.order_date,
          order_date: [],
          description: data?.item_description,
          rate: '',
          amount: '',
          order_item_id: '',
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
      const amount = convertIntoNumber(subTotal) - convertIntoNumber(discount);
      const taxAmount = (amount * values?.tax_percentage) / 100;
      const totalAmount = amount + taxAmount;
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
    <>
      {(packageLoading ||
        productLoading ||
        exposingLoading ||
        currencyLoading ||
        exposingStepLoading ||
        clientCompanyLoading ||
        exposingQuotationLoading ||
        quotationNameLoading) && <Loader />}

      <div className="processing_main">
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
                        <h2 className="m-0 ms-2 fw_500">
                          {isEdit ? 'Edit Quotation' : 'Add Quotation'}
                        </h2>
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
                                  {data?.currency_symbol
                                    ? data?.currency_symbol
                                    : ''}{' '}
                                  {data?.total_amount
                                    ? convertIntoNumber(data?.total_amount)
                                    : ''}
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
            <h3>
              Quotation Details <span className="text-danger fs-6">*</span>
            </h3>
            <Row className="justify-content-between">
              <Col xxl={2} xl={4} lg={5}>
                <div class="form_group">
                  <MultiSelect
                    filter
                    value={
                      exposingItemOptionList?.length
                        ? values?.selected_exposing_order_item
                        : []
                    }
                    name="selected_exposing_order_item"
                    options={exposingItemOptionList}
                    onChange={e => {
                      handleItemList(e.target.name, e.value, e);
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
                  <div className="form_group d-sm-flex align-items-center justify-content-end">
                    <label className="me-3 mb-0 fw_500 text-nowrap mb-sm-0 mb-2">
                      Name the Quotation{' '}
                      <span className="text-danger fs-6">*</span>
                    </label>
                    <div>
                      <InputText
                        placeholder="Quotation Name"
                        className="input_wrap"
                        name="quotation_name"
                        value={
                          values?.quotation_name ? values?.quotation_name : ''
                        }
                        onChange={handleChange}
                        disabled
                      />
                      {touched?.quotation_name && errors?.quotation_name && (
                        <p className="text-danger">{errors?.quotation_name}</p>
                      )}
                    </div>
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
              <Column
                field="amount"
                header="Amount"
                sortable
                body={amountTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="amount_condition pt20">
            <Row className="justify-content-between">
              <Col xl={5} lg={6}>
                <div className="amount-condition-wrapper">
                  <div className="condition-content">
                    <h4 className="mb-2">Terms & Condition</h4>

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
                        <h5>
                          {values?.selected_currency
                            ? values?.selected_currency?.currency_symbol
                            : ''}{' '}
                          {values?.total_amount_collection}
                        </h5>
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
                          value={values?.discount ? values?.discount : ''}
                          maxLength="10"
                          onChange={e => {
                            if (!e.value || checkWordLimit(e.value, 10)) {
                              handleDiscountChange(
                                e.originalEvent.target.name,
                                e.value ? e.value : '',
                              );
                            }
                          }}
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
                            value={values?.tax_percentage}
                            onChange={e => {
                              if (!e?.value || checkWordLimit(e?.value, 3)) {
                                handleTaxPercentageChange(
                                  e.originalEvent.target.name,
                                  e.value,
                                );
                              }
                            }}
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
                          {values?.selected_currency
                            ? values?.selected_currency?.currency_symbol
                            : ''}
                        </div>
                        <InputText
                          placeholder="₹ 00.00"
                          value={values?.tax ? values?.tax : 0}
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
                              options={currencyOptionList}
                              onBlur={handleBlur}
                              onChange={e => {
                                const findObj = currencyList?.list?.find(
                                  item => {
                                    return item._id === e.target.value;
                                  },
                                );

                                setFieldValue('currency', e.target.value);
                                if (findObj) {
                                  setFieldValue(
                                    'exchange_currency_rate',
                                    findObj.exchange_rate,
                                  );
                                  setFieldValue('selected_currency', findObj);
                                }
                              }}
                            />
                            {touched?.currency && errors?.currency && (
                              <p className="text-danger">{errors?.currency}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700">
                          {values?.selected_currency
                            ? values?.selected_currency?.currency_symbol
                            : ''}{' '}
                          {values?.total_amount ? values?.total_amount : '0'}
                        </h5>
                        {touched?.total_amount && errors?.total_amount && (
                          <p className="text-danger">{errors?.total_amount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 ms-3">
                  Conversion :{' '}
                  <span className="fw-bold">
                    {thousandSeparator(
                      values?.total_amount *
                        // values?.selected_currency?.exchange_rate,
                        values?.exchange_currency_rate,
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
                        id="ExchangeRate"
                        placeholder="exchange rate"
                        name="exchange_currency_rate"
                        className="w_100 currency_input"
                        useGrouping={false}
                        value={values?.exchange_currency_rate}
                        onChange={e => {
                          if (!e.value || checkWordLimit(e.value, 8)) {
                            setFieldValue('exchange_currency_rate', e.value);
                          }
                        }}
                        maxLength="8"
                        min={0}
                        minFractionDigits={0}
                        maxFractionDigits={2}
                      />
                      {`${
                        values?.default_currency?.currency_code
                          ? values?.default_currency?.currency_code
                          : ''
                      }`}
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
                navigate('/exposing');
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
              {isEdit ? 'Update' : 'Save'}
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
                        dispatch(getExposingStep({ order_id: id }));
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
              <img src={selectedExposingQuatationData?.company_logo} alt="" />
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
                    setVisible(false);
                  }
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
                    <span>
                      {moment(
                        selectedExposingQuatationData?.created_at,
                      )?.format('DD-MM-YYYY')}
                    </span>
                  </h5>
                </div>
                <div className="user_bank_details bank_details_light">
                  <h5>
                    Company Name{' '}
                    <span>{selectedExposingQuatationData?.client_company}</span>
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
                          {selectedExposingQuatationData?.currency_symbol}
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
                          {selectedExposingQuatationData?.currency_symbol}
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
                        <h5>
                          Tax(
                          {selectedExposingQuatationData?.tax_percentage
                            ? selectedExposingQuatationData?.tax_percentage
                            : ''}
                          %)
                        </h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedExposingQuatationData?.currency_symbol}
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
                          {selectedExposingQuatationData?.currency_symbol}
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
            {!selectedExposingQuatationData?.bill_converted && (
              <button
                className="btn_border_dark"
                onClick={() => {
                  const itemList = [];
                  let totalAmount = 0,
                    taxAmount = 0,
                    subTotal = 0;

                  let updatedList =
                    selectedExposingQuatationData?.quotation_detail?.map(d => {
                      itemList.push(d?.item_id);
                      return {
                        ...d,
                        // due_date: d?.due_date ? new Date(d.due_date) : '',
                        order_item_id: d?._id,
                      };
                    });

                  const discount = selectedExposingQuatationData?.discount
                    ? selectedExposingQuatationData?.discount
                    : 0;
                  const taxPercentage =
                    selectedExposingQuatationData?.tax_percentage
                      ? selectedExposingQuatationData?.tax_percentage
                      : 0;

                  subTotal = totalCount(updatedList, 'amount');
                  const amount =
                    convertIntoNumber(subTotal) - convertIntoNumber(discount);
                  taxAmount =
                    (amount * selectedExposingQuatationData?.tax_percentage) /
                    100;
                  totalAmount = amount + taxAmount;
                  let { order_date, ...rest } = selectedExposingQuatationData;
                  // const {
                  //   selected_exposing_order_item,
                  //   orderItems,
                  //   ...restExposingQuotationData
                  // } = exposingQuotationData;

                  const clientCurrency = currencyList?.list?.find(
                    c => c?._id === rest?.currency,
                  );

                  const updated = {
                    ...exposingQuotationData,
                    ...rest,
                    exposing_order_table: updatedList,
                    // orderItems: updatedList,
                    total_amount_collection: convertIntoNumber(subTotal),
                    discount: discount,
                    tax: convertIntoNumber(taxAmount),
                    tax_percentage: convertIntoNumber(taxPercentage),
                    total_amount: convertIntoNumber(totalAmount),
                    exposingOrderList: itemList,
                    quotation_id: selectedExposingQuatationData?._id,
                    quotation_name:
                      selectedExposingQuatationData?.quotation_name,
                    terms_condition:
                      selectedExposingQuatationData?.terms_condition,
                    selected_exposing_order_item: itemList,
                    currency: clientCurrency?._id,
                    selected_currency: clientCurrency,
                    exchange_currency_rate: clientCurrency?.exchange_rate,
                  };

                  dispatch(setExposingQuotationData(updated));
                  setVisible(false);
                  setIsEdit(true);
                }}
              >
                <img src={EditIcon} alt="editicon" /> Edit Quotation
              </button>
            )}
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
              // onClick={() => setVisible(false)}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedExposingQuatationData?.status === 1 && (
              <button
                className="btn_primary"
                onClick={handleMarkAsApprovedChange}
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
    </>
  );
};
export default memo(ExposingQuotation);
