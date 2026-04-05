import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import ReactSelectSingle from '../../../Common/ReactSelectSingle';
import ArrowIcon from '../../../../Assets/Images/left_arrow.svg';
import ShowIcon from '../../../../Assets/Images/show-icon.svg';
import PdfIcon from '../../../../Assets/Images/pdf-icon.svg';
import EditIcon from '../../../../Assets/Images/edit.svg';
import TrashIcon from '../../../../Assets/Images/trash.svg';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addInvoice,
  addQuotation,
  editQuotation,
  getEditingFlow,
  getQuotation,
  getQuotationList,
  getQuotationName,
  setQuotationApprovedData,
  addStep,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  checkWordLimit,
  convertIntoNumber,
  thousandSeparator,
  totalCount,
} from 'Helper/CommonHelper';
import Loader from 'Components/Common/Loader';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { InputNumber } from 'primereact/inputnumber';
import moment from 'moment';
import { editingQuotationSchema } from 'Schema/Editing/editingSchema';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import {
  addInquiryStep,
  getInquiryStep,
  setInquiryFlowEditingQuotationData,
  setInquirySelectedProgressIndex,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

const EditingQuotationInquiryFlow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // const [editingItemOptionList, setEditingItemOptionList] = useState([]);
  const {
    editingLoading,
    quotationList,
    selectedQuatationData,
    quotationLoading,
    invoiceLoading,
    selectedEditingData,
    quotationNameData,
    quotationNameLoading,
  } = useSelector(({ editing }) => editing);
  const { currencyList, currencyLoading } = useSelector(
    ({ currency }) => currency,
  );
  const { clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { productList, productLoading } = useSelector(({ product }) => product);
  const { packageList, packageLoading } = useSelector(
    ({ packages }) => packages,
  );
  const { getInquiryStepData, inquiryFlowEditingQuotationData } = useSelector(
    ({ inquiry }) => inquiry,
  );

  useEffect(() => {
    if (!inquiryFlowEditingQuotationData?.quotation_id) {
      dispatch(getQuotationName())
        .then(res => {
          const quotationName = res.payload;
          return { quotationName };
        })
        .then(({ quotationName }) => {
          dispatch(getEditingFlow({ order_id: id }))
            .then(response => {
              const responseData = response.payload;
              return { responseData };
            })
            .then(async ({ responseData }) => {
              let totalAmount = 0,
                taxAmount = 0,
                subTotal = 0;

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

              const findedDefaultCurrency = currencyDetails?.find(
                c => c?.currency_code === 'INR',
              );

              let updatedList = responseData?.orderItems?.map(d => {
                let rate = d?.rate ? d?.rate : d?.default_rate,
                  qty = d?.quantity,
                  amount = rate * qty;
                return {
                  ...d,
                  due_date: d?.due_date ? new Date(d?.due_date) : '',
                  quantity: qty,
                  rate: rate,
                  amount: amount,
                  order_iteam_id: d?._id,
                };
              });

              const discount = values?.discount ? values?.discount : 0;
              const texPercentage = values?.tex_percentage
                ? values?.tex_percentage
                : 0;

              subTotal = totalCount(updatedList, 'amount');
              const calculatedSubAmount =
                convertIntoNumber(subTotal) - convertIntoNumber(discount);
              taxAmount = (calculatedSubAmount * texPercentage) / 100;
              totalAmount = calculatedSubAmount + taxAmount;

              const updated = {
                ...responseData,
                quotation_name: quotationName ? quotationName : '',
                editingTable: updatedList,
                terms_condition: '',
                sub_total: convertIntoNumber(subTotal),
                discount: discount,
                tax_percentage: texPercentage,
                tax: convertIntoNumber(taxAmount),
                total_amount: convertIntoNumber(totalAmount),
                data_size: convertIntoNumber(responseData?.data_size || 0),
                currency: clientCurrency?._id,
                selected_currency: clientCurrency,
                default_currency: findedDefaultCurrency,
              };

              // dispatch(setEditingQuotationData(updated));
              dispatch(setInquiryFlowEditingQuotationData(updated));
              dispatch(getInquiryStep({ inquiry_id: id }));
            })
            .catch(error => {
              console.error('Error fetching employee data:', error);
            });
        });
    } else {
      setIsEdit(true);
    }
    dispatch(getQuotationList({ order_id: id, approval: false }));
    dispatch(
      getPackageList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 1,
      }),
    );
    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 1,
      }),
    );
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(
  //     getPackageList({
  //       start: 0,
  //       limit: 0,
  //       isActive: true,
  //       search: '',
  //     }),
  //   )
  //     .then(response => {
  //       const packageData = response.payload?.data?.list?.map(item => ({
  //         ...item,
  //         label: item?.package_name,
  //         value: item?._id,
  //         isPackage: true,
  //       }));

  //       return { packageData };
  //     })
  //     .then(({ packageData }) => {
  //       dispatch(
  //         getProductList({
  //           start: 0,
  //           limit: 0,
  //           isActive: true,
  //           search: '',
  //         }),
  //       )
  //         .then(response => {
  //           const productData = response.payload?.data?.list?.map(item => ({
  //             ...item,
  //             label: item?.item_name,
  //             value: item?._id,
  //             isPackage: false,
  //           }));

  //           let filteredPackageData = packageData?.filter(d =>
  //             inquiryFlowEditingQuotationData?.editing_inquiry?.includes(d?._id),
  //           );
  //           let filteredProductData = productData?.filter(d =>
  //             inquiryFlowEditingQuotationData?.editing_inquiry?.includes(d?._id),
  //           );
  //           // let data = [
  //           //   { label: 'Package', items: [...packageData] },
  //           //   { label: 'Product', items: [...productData] },
  //           // ];
  //           let data = [
  //             { label: 'Package', items: [...filteredPackageData] },
  //             { label: 'Product', items: [...filteredProductData] },
  //           ];
  //           setEditingItemOptionList(data);
  //         })
  //         .catch(error => {
  //           console.error('Error fetching product data:', error);
  //         });
  //     })
  //     .catch(error => {
  //       console.error('Error fetching package data:', error);
  //     });
  // }, [dispatch, inquiryFlowEditingQuotationData]);

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

  const editingItemOptionList = useMemo(() => {
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
      selectedEditingData?.editing_inquiry?.includes(d?._id),
    );
    let filteredProductData = productData?.filter(d =>
      selectedEditingData?.editing_inquiry?.includes(d?._id),
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
  }, [selectedEditingData, productList, packageList]);

  const editingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
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

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let editingList = [];

    if (!values?.editing_inquiry?.includes(data?._id)) {
      let newObj = {};
      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: '',
          due_date: data?.due_date,
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
          due_date: data?.due_date,
          description: data?.item_description,
          rate: '',
          amount: '',
          order_iteam_id: '',
        };
      }
      editingList = [...values?.editingTable, newObj];
    } else {
      editingList = values?.editingTable?.filter(
        item => item?.item_id !== data?._id,
      );

      const discount = values?.discount ? values?.discount : 0;
      const subTotal = totalCount(editingList, 'amount');
      const calculatedSubAmount =
        convertIntoNumber(subTotal) - convertIntoNumber(discount);
      const taxAmount = (calculatedSubAmount * values?.tax_percentage) / 100;
      const totalAmount = calculatedSubAmount + taxAmount;

      setFieldValue('tax', taxAmount);
      setFieldValue('total_amount', totalAmount);
      setFieldValue('sub_total', subTotal);

      let itemData = values?.editing_inquiry
        ? values?.editing_inquiry?.filter(item => item?.item_id !== data?._id)
        : [];
      setFieldValue('editing_inquiry', itemData);
    }
    setFieldValue('editingTable', editingList);
    setFieldValue(fieldName, fieldValue);
  };

  const handleEditingTableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.editingTable];
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
    const discount = values?.discount;
    subTotal = totalCount(editingList, 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    taxAmount = (calculatedSubAmount * values?.tax_percentage) / 100;
    totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue('total_amount', convertIntoNumber(totalAmount));
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('editingTable', editingList);
  };

  const handleDiscountChange = (fieldName, fieldValue) => {
    const discount = fieldValue;
    const taxPercentage = values?.tax_percentage;
    const subTotal = totalCount(values?.editingTable, 'amount');
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
    const taxPercentage = fieldValue;
    const discount = values?.discount;
    const subTotal = totalCount(values?.editingTable, 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    const totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue(fieldName, fieldValue);
    setFieldValue('tax', convertIntoNumber(taxAmount));
    setFieldValue('sub_total', convertIntoNumber(subTotal));
    setFieldValue('total_amount', convertIntoNumber(totalAmount));
  };

  const handleMarkAsApprovedChange = () => {
    let payload = {
      quotation_id: selectedQuatationData?._id,
      status: 2,
    };
    dispatch(editQuotation(payload))
      .then(response => {
        dispatch(
          setQuotationApprovedData({
            quotation_id: selectedQuatationData?._id,
          }),
        );

        // For adding inquiry step :
        if (getInquiryStepData?.inquiry_step < 2) {
          let payload = {
            inquiry_id: id,
            is_rework: false,
            inquiry_step: 2,
          };
          dispatch(addInquiryStep(payload))
            .then(response => {
              dispatch(getInquiryStep({ inquiry_id: id }));
              dispatch(setInquirySelectedProgressIndex(3));
              let addStepPayload = {
                order_id: id,
                step: 2,
              };
              dispatch(addStep(addStepPayload));
            })
            .catch(errors => {
              console.error('Add Status:', errors);
            });
        } else {
          dispatch(setInquirySelectedProgressIndex(3));
        }
      })
      .catch(error => {
        console.error('Error fetching while quotation:', error);
      });
  };

  const handleDeleteEditingItem = item => {
    let dummyList = values?.editingTable.filter(
      d => d?.item_id !== item?.item_id,
    );

    const discount = dummyList?.length ? values?.discount : 0;
    const taxPercentage = dummyList?.length ? values?.tax_percentage : 18;
    const subTotal = totalCount(dummyList, 'amount');
    const calculatedSubAmount =
      convertIntoNumber(subTotal) - convertIntoNumber(discount);
    const taxAmount = (calculatedSubAmount * taxPercentage) / 100;
    const totalAmount = calculatedSubAmount + taxAmount;

    setFieldValue('tax', taxAmount);
    setFieldValue('discount', discount);
    setFieldValue('sub_total', subTotal);
    setFieldValue('editingTable', dummyList);
    setFieldValue('total_amount', totalAmount);
    setFieldValue('tax_percentage', taxPercentage);
    let itemData = values?.editing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('editing_inquiry', itemData);
  };

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
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
              value={data?.due_date || ''}
              name="due_date"
              readOnlyInput
              // onChange={e => {
              //   const utcDate = new Date(e.value);
              //   handleEditingTableChange(data, e.target.name, utcDate);
              // }}
              onChange={e =>
                handleEditingTableChange(data, e.target.name, e.target.value)
              }
              showIcon
              showButtonBar
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
          value={data?.quantity}
          onChange={e => {
            // Ensure the value doesn't exceed 100
            if (!e.value || checkWordLimit(e.value, 10)) {
              handleEditingTableChange(
                data,
                e.originalEvent.target.name,
                e.value ? e.value : '',
              );
            }
          }}
          maxLength="10"
        />
      </div>
    );
  };

  const rateBodyTemplate = data => {
    return (
      <div className="d-flex align-items-center justify-content-around">
        <span>
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
                handleEditingTableChange(
                  data,
                  e.originalEvent.target.name,
                  e.value ? e.value : '',
                );
              }
            }}
            maxLength="10"
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
        <span>{rowData?.amount}</span>
      </div>
    );
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

  const fetchRequiredData = useCallback(
    async formData => {
      dispatch(getQuotationList({ order_id: id, approval: false }));
      const quotationName = await dispatch(getQuotationName());
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
        ...inquiryFlowEditingQuotationData,
        // ...selectedQuatationData,
        editingTable: [],
        editing_inquiry: [],
        quotation_id: selectedQuatationData?._id,
        quotation_name: quotationName?.payload ? quotationName?.payload : '',
        terms_condition: '',
        sub_total: 0,
        discount: 0,
        tax: 0,
        total_amount: 0,
        tax_percentage: 18,
        currency: clientCurrency?._id,
        selected_currency: clientCurrency,
      };

      return updated;
    },
    [
      id,
      dispatch,
      currencyList,
      selectedQuatationData,
      inquiryFlowEditingQuotationData,
    ],
  );

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const isRate = values?.editingTable?.some(item => {
        return !item?.rate || item?.rate === 0;
      });
      const isDueDate = values?.editingTable?.some(item => {
        return !item?.due_date;
      });
      const isQty = values?.editingTable?.some(item => {
        return !item?.quantity || item?.quantity === 0;
      });

      if (isDueDate) {
        toast.error('Quotation Due Date are required');
      } else if (isQty) {
        toast.error('Quotation Qty are required');
      } else if (isRate) {
        toast.error('Quotation Rate are required');
      }

      if (!isRate && !isQty && !isDueDate) {
        const currentCurrencyRate = values?.selected_currency;

        let updatedList = values?.editingTable?.map(d => {
          const calculatedRate = d?.rate * currentCurrencyRate?.exchange_rate;
          const findObj = values?.quotation_detail?.find(
            item => item?.item_id === d?.item_id,
          );

          return {
            item_id: d?.item_id,
            item_name: d?.item_name,
            due_date: moment(new Date(d?.due_date))?.format('YYYY-MM-DD'),
            description: d?.description,
            quantity: d?.quantity,
            rate: calculatedRate,
            amount: d?.quantity * calculatedRate,
            ...(isEdit && { quotation_details_id: findObj?._id }),
          };
        });

        let payload = {
          order_id: id,
          quotation_name: values?.quotation_name,
          terms_condition: values?.terms_condition,
          sub_total: convertIntoNumber(
            values?.sub_total * currentCurrencyRate?.exchange_rate,
          ),
          discount: convertIntoNumber(
            values?.discount * currentCurrencyRate?.exchange_rate,
          ),
          tax: convertIntoNumber(
            values?.tax * currentCurrencyRate?.exchange_rate,
          ),
          tax_percentage: values?.tax_percentage
            ? convertIntoNumber(values?.tax_percentage)
            : 0,
          total_amount: convertIntoNumber(
            values?.total_amount * currentCurrencyRate?.exchange_rate,
          ),
          currency: values?.currency,
          conversation_rate: currentCurrencyRate?.exchange_rate,
          currency_symbol: currentCurrencyRate?.currency_symbol,
          quotation_details: updatedList,
          ...(isEdit && { quotation_id: values?.quotation_id }),
        };

        if (isEdit) {
          dispatch(editQuotation(payload))
            .then(async response => {
              resetForm();
              const updatedEditingInquiryQuotation = await fetchRequiredData(
                values,
              );
              setIsEdit(false);

              if (selectedQuatationData?.status === 2) {
                dispatch(setInquiryFlowEditingQuotationData({}));
                dispatch(setInquirySelectedProgressIndex(3));
              } else {
                dispatch(
                  setInquiryFlowEditingQuotationData(
                    updatedEditingInquiryQuotation,
                  ),
                );
              }

              // dispatch(getQuotationName())
              //   .then(res => {
              //     const quotationName = res.payload;
              //     return { quotationName };
              //   })
              //   .then(({ quotationName }) => {
              //     dispatch(getQuotationList({ order_id: id, approval: false }))
              //       .then(responseData => {
              //         resetForm();
              //         const updated = {
              //           ...inquiryFlowEditingQuotationData,
              //           ...selectedQuatationData,
              //           editingTable: [],
              //           editing_inquiry: [],
              //           quotation_id: selectedQuatationData?._id,
              //           quotation_name: quotationName ? quotationName : '',
              //           terms_condition: '',
              //           sub_total: 0,
              //           discount: 0,
              //           tax: 0,
              //           total_amount: 0,
              //           tax_percentage: 18,
              //         };
              //         // dispatch(setEditingQuotationData(updated));
              //         dispatch(setInquiryFlowEditingQuotationData(updated));
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
          dispatch(addQuotation(payload))
            .then(async response => {
              resetForm();
              const updatedEditingQuotationData = await fetchRequiredData(
                values,
              );
              dispatch(
                setInquiryFlowEditingQuotationData(updatedEditingQuotationData),
              );

              // dispatch(getQuotationName())
              //   .then(res => {
              //     const quotationName = res.payload;
              //     return { quotationName };
              //   })
              //   .then(({ quotationName }) => {
              //     dispatch(getQuotationList({ order_id: id, approval: false }))
              //       .then(responseData => {
              //         resetForm();
              //         const updated = {
              //           ...inquiryFlowEditingQuotationData,
              //           ...selectedQuatationData,
              //           editingTable: [],
              //           editing_inquiry: [],
              //           quotation_id: selectedQuatationData?._id,
              //           quotation_name: quotationName ? quotationName : '',
              //           terms_condition: '',
              //           sub_total: 0,
              //           discount: 0,
              //           tax: 0,
              //           total_amount: 0,
              //           tax_percentage: 18,
              //         };
              //         // dispatch(setEditingQuotationData(updated));
              //         dispatch(setInquiryFlowEditingQuotationData(updated));
              //       })
              //       .catch(error => {
              //         console.error('Error fetching quotation list:', error);
              //       });
              //   });
            })
            .catch(error => {
              console.error('Error fetching while addquotation:', error);
            });
        }
      }
    },
    [id, isEdit, dispatch, fetchRequiredData, selectedQuatationData],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: inquiryFlowEditingQuotationData,
    validationSchema: editingQuotationSchema,
    onSubmit: submitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="" footer="Total Quantity" colSpan={6} />
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

  return (
    <div className="">
      {(editingLoading ||
        invoiceLoading ||
        productLoading ||
        packageLoading ||
        currencyLoading ||
        quotationLoading ||
        quotationNameLoading ||
        clientCompanyLoading) && <Loader />}

      <div className="billing_details">
        <Row className="g-3 g-sm-4">
          <Col xxl={8} xl={7}>
            <div className="process_order_wrap p-0 pb-3 mb20">
              <Row className="align-items-center">
                <Col sm={6}>
                  <div className="back_page">
                    <div className="btn_as_text d-flex align-items-center">
                      <Button
                        className="btn_transparent"
                        onClick={() => {
                          dispatch(setInquirySelectedProgressIndex(1));
                        }}
                      >
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </Button>
                      <h2 className="m-0 ms-2 fw_500">
                        {isEdit ? 'Update' : ''} Quotation
                      </h2>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="date_number">
                    <ul className="justify-content-end">
                      <li>
                        <h6>Order No.</h6>
                        <h4>{values?.inquiry_no}</h4>
                      </li>
                      <li>
                        <h6>Create Date</h6>
                        <h4>{values?.create_date}</h4>
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
                          <h5>{values?.item_name}</h5>
                        </div>
                        <div className="order-date">
                          <span>Couple Name :</span>
                          <h5>{values?.couple_name}</h5>
                        </div>
                      </div>
                      <div className="details_box_inner">
                        <div className="order-date">
                          <span>Data Size :</span>
                          <h5>{values?.data_size} GB</h5>
                        </div>
                        <div className="order-date">
                          <span>Project Type :</span>
                          <h5>{values?.project_type_value}</h5>
                        </div>
                        <div className="order-date">
                          <span>Due Date :</span>
                          <h5>{values?.due_date}</h5>
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
                          <h5>{values?.company_name}</h5>
                        </div>
                        <div className="order-date">
                          <span>Client Name :</span>
                          <h5>{values?.client_full_name}</h5>
                        </div>
                      </div>
                      <div className="details_box_inner">
                        <div className="order-date">
                          <span>Phone No :</span>
                          <h5>{values?.mobile_no}</h5>
                        </div>
                        <div className="order-date">
                          <span>Email :</span>
                          <h5>{values?.email_id}</h5>
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
                  {quotationList?.quotation_list?.length > 0 &&
                    quotationList?.quotation_list?.map((data, i) => {
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
                                          'YYYY-MM-DD hh:mm:ss A',
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
        <div className="order_items">
          <h3>
            Quotation Details <span className="text-danger fs-6">*</span>
          </h3>
          <Row className="justify-content-between g-4">
            <Col xl={3} lg={4} md={6}>
              <div className="form_group">
                <MultiSelect
                  filter
                  value={values?.editing_inquiry}
                  name="editing_inquiry"
                  options={editingItemOptionList}
                  onChange={e => {
                    handleitemList(e.target.name, e.value, e);
                  }}
                  optionLabel="label"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionGroupTemplate={editingItemsTemplate}
                  onBlur={handleBlur}
                  placeholder="Select Editing Items"
                  className="w-100"
                  showSelectAll={false}
                />
                {touched?.editing_inquiry && errors?.editing_inquiry && (
                  <p className="text-danger">{errors?.editing_inquiry}</p>
                )}
              </div>
            </Col>
            <Col xl={4} md={6}>
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
                      value={values?.quotation_name}
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
        <div className="data_table_wrapper border radius15 max_height vertical_top">
          <DataTable
            value={values?.editingTable}
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
        <div className="amount_condition pt20">
          <Row className="d-flex justify-content-between g-4">
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
                  {/* <InputTextarea
                    id="Terms"
                    placeholder="Terms & Conditions"
                    name="terms_condition"
                    value={values?.terms_condition || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                        {values?.selected_currency
                          ? values?.selected_currency?.currency_symbol
                          : ''}{' '}
                        {values?.sub_total}
                      </h5>
                      {touched?.sub_total && errors?.sub_total && (
                        <p className="text-danger">{errors?.sub_total}</p>
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
                        value={values?.discount}
                        onChange={e => {
                          handleDiscountChange(
                            e.originalEvent.target.name,
                            e.value,
                          );
                        }}
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
                            onChange={e => {
                              const findObj = currencyList?.list?.find(item => {
                                return item._id === e.target.value;
                              });
                              setFieldValue('currency', e.target.value);
                              setFieldValue('selected_currency', findObj);
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
                        {values?.total_amount}
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
                      values?.selected_currency?.exchange_rate,
                  )}
                </span>
              </div>
              <div className="amount-condition-wrapper border radius15 mt-3">
                <div className="d-flex justify-content-around condition-content p5">
                  <div className="">{`${1} ${
                    values?.selected_currency?.currency_code
                      ? values?.selected_currency?.currency_code
                      : ''
                  }`}</div>
                  <div>=</div>
                  <div className="">{`${
                    values?.selected_currency?.exchange_rate
                      ? values?.selected_currency?.exchange_rate
                      : ''
                  } ${
                    values?.default_currency?.currency_code
                      ? values?.default_currency?.currency_code
                      : ''
                  }`}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="btn_group text-end mt20">
          <Button
            onClick={() => {
              // dispatch(setEditingQuotationData({}));
              dispatch(setInquiryFlowEditingQuotationData({}));
              navigate('/inquiry');
            }}
            className="btn_border_dark"
          >
            Exit Page
          </Button>
          <Button
            onClick={handleSubmit}
            className="btn_primary ms-2"
            disabled={!values?.editingTable?.length}
          >
            {isEdit ? 'Update' : 'Save'}
          </Button>
          {quotationList?.quotation_status && (
            <Button
              className="btn_primary ms-2"
              onClick={() => {
                if (getInquiryStepData?.inquiry_step < 2) {
                  let payload = {
                    inquiry_id: id,
                    is_rework: false,
                    inquiry_step: 2,
                  };
                  dispatch(addInquiryStep(payload))
                    .then(response => {
                      dispatch(getInquiryStep({ inquiry_id: id }));
                      dispatch(setInquirySelectedProgressIndex(3));
                    })
                    .catch(errors => {
                      console.error('Add Status:', errors);
                    });
                } else {
                  dispatch(setInquirySelectedProgressIndex(3));
                }
                // dispatch(setEditingQuotationData({}));
                dispatch(setInquiryFlowEditingQuotationData({}));
              }}
            >
              Next
            </Button>
          )}
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
                  dispatch(
                    addInvoice({
                      order_id: id,
                      quotation_id: selectedQuatationData?._id,
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
        className="commission_dialog payment_dialog quotation_dialog"
        visible={visible}
        onHide={() => {
          if (selectedQuatationData?.status === 2) {
            dispatch(
              setQuotationApprovedData({
                quotation_id: selectedQuatationData?._id,
              }),
            );
            dispatch(setInquirySelectedProgressIndex(3));
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
                          {selectedQuatationData?.currency_symbol}
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
                          {selectedQuatationData?.currency_symbol}
                          {selectedQuatationData?.discount}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax ({selectedQuatationData?.tax_percentage}%)</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="text_gray text-end">
                          {selectedQuatationData?.currency_symbol}
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
                          {selectedQuatationData?.currency_symbol}
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
            <button
              className="btn_border_dark"
              onClick={() => {
                const itemList = [];

                let updatedList = selectedQuatationData?.quotation_detail?.map(
                  d => {
                    itemList.push(d?.item_id);
                    return {
                      ...d,
                      // due_date: d?.due_date ? new Date(d.due_date) : '',
                      order_iteam_id: d?._id,
                    };
                  },
                );

                const discount = selectedQuatationData?.discount
                  ? selectedQuatationData?.discount
                  : 0;
                const taxPercentage = selectedQuatationData?.tax_percentage
                  ? selectedQuatationData?.tax_percentage
                  : 0;

                let totalAmount = 0,
                  taxAmount = 0,
                  subTotal = 0;
                subTotal = totalCount(updatedList, 'amount');
                const calculatedSubAmount =
                  convertIntoNumber(subTotal) - convertIntoNumber(discount);
                taxAmount =
                  (calculatedSubAmount *
                    selectedQuatationData?.tax_percentage) /
                  100;
                totalAmount = calculatedSubAmount + taxAmount;

                let { due_date, ...rest } = selectedQuatationData;

                const clientCurrency = currencyList?.list?.find(
                  c => c?._id === rest?.currency,
                );

                const updated = {
                  ...inquiryFlowEditingQuotationData,
                  ...rest,
                  editingTable: updatedList,
                  sub_total: convertIntoNumber(subTotal),
                  discount: discount,
                  tax_percentage: convertIntoNumber(taxPercentage),
                  tax: convertIntoNumber(taxAmount),
                  total_amount: convertIntoNumber(totalAmount),
                  editing_inquiry: itemList,
                  quotation_id: selectedQuatationData?._id,
                  quotation_name: selectedQuatationData?.quotation_name,
                  terms_condition: selectedQuatationData?.terms_condition,
                  currency: clientCurrency?._id,
                  selected_currency: clientCurrency,
                };

                // dispatch(setEditingQuotationData(updated));
                dispatch(setInquiryFlowEditingQuotationData(updated));
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
                  getQuotation({
                    quotation_id: selectedQuatationData?._id,
                    email: false,
                    pdf: true,
                  }),
                );
                setVisible(false);
              }}
            >
              <img src={PdfIcon} alt="pdficon" /> Save As PDF
            </button>
            {selectedQuatationData?.status === 1 && (
              <button
                className="btn_primary"
                onClick={() => {
                  handleMarkAsApprovedChange();
                }}
              >
                Mark as Approved
              </button>
            )}
            {selectedQuatationData?.status === 2 && (
              <span className="approved_button_Wrap">Approved</span>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default memo(EditingQuotationInquiryFlow);
