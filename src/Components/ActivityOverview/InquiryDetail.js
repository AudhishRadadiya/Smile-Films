import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import CreateClientCompanyInInquiry from './CreateClientCompanyInInquiry';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getReferenceList } from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import {
  addInquiry,
  clearAddSelectedInquiryData,
  clearUpdateSelectedInquiryData,
  editInquiry,
  getInquiryNo,
  setAddSelectedInquiryData,
  setIsGetInintialValuesInquiry,
  setUpdateSelectedInquiryData,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import { useFormik } from 'formik';
import {
  getClientCompany,
  getClientCompanyList,
  setIsAddClientCompany,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { inquirySchema } from 'Schema/ActivityOverview/activityOverviewSchema';
import { toast } from 'react-toastify';

export default function InquiryForm({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const [dropdownInquiryOptionList, setDropdownInquiryOptionList] = useState({
    editingItemOptionList: [],
    exposingItemOptionList: [],
    clientCompanyOptionList: [],
  });
  const { isAddClientCompany, clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { countryLoading } = useSelector(({ country }) => country);
  const { currencyLoading } = useSelector(({ currency }) => currency);
  const { referenceLoading } = useSelector(({ references }) => references);
  const { packageLoading } = useSelector(({ packages }) => packages);
  const { productLoading } = useSelector(({ product }) => product);
  const {
    inquiryLoading,
    addSelectedInquiryData,
    updateSelectedInquiryData,
    isGetInintialValuesInquiry,
  } = useSelector(({ inquiry }) => inquiry);

  const companyHandleChange = (fieldName, fieldValue) => {
    const responseData = {};

    dispatch(getClientCompany({ client_company_id: fieldValue }))
      ?.then(response => {
        const responseData = response?.payload?.data;
        setFieldValue(fieldName, fieldValue);
        setFieldValue('client_full_name', responseData?.client_full_name);
        setFieldValue('reference', responseData?.reference_value);
        setFieldValue('email_id', responseData?.email_id);
        setFieldValue('mobile_no', responseData?.mobile_no);
        setFieldValue('address', responseData?.address);
        setFieldValue('country', responseData?.country_value);
        setFieldValue('state', responseData?.state_value);
        setFieldValue('city', responseData?.city_value);
        setFieldValue('pin_code', responseData?.pin_code);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
    if (id) {
      dispatch(
        setUpdateSelectedInquiryData({
          ...updateSelectedInquiryData,
          [fieldName]: fieldValue,
          reference: responseData?.reference_value,
          email_id: responseData?.email_id,
          mobile_no: responseData?.mobile_no,
          address: responseData?.address,
          country: responseData?.country_value,
          state: responseData?.state_value,
          city: responseData?.city_value,
          pin_code: responseData?.pin_code,
        }),
      );
    } else {
      dispatch(
        setAddSelectedInquiryData({
          ...addSelectedInquiryData,
          [fieldName]: fieldValue,
          reference: responseData?.reference_value,
          email_id: responseData?.email_id,
          mobile_no: responseData?.mobile_no,
          address: responseData?.address,
          country: responseData?.country_value,
          state: responseData?.state_value,
          city: responseData?.city_value,
          pin_code: responseData?.pin_code,
        }),
      );
    }
  };

  useEffect(() => {
    if (!id) {
      dispatch(getInquiryNo())
        .then(response => {
          const responseData = response.payload;

          dispatch(
            setAddSelectedInquiryData({
              ...addSelectedInquiryData,
              inquiry_no: responseData,
              create_date: new Date(),
            }),
          );

          setFieldValue('inquiry_no', responseData);
          setFieldValue('create_date', new Date());
        })
        .catch(error => {
          console.error('Error fetching inquiry no:', error);
        });
    }

    dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    )
      .then(response => {
        const companyData = response.payload?.data?.list?.map(item => ({
          label: item?.company_name,
          value: item?._id,
        }));

        return { companyData };
      })
      .then(({ companyData }) => {
        dispatch(
          getPackageList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        )
          .then(response => {
            const packageData = response.payload?.data?.list?.map(item => ({
              ...item,
              label: item?.package_name,
              value: item?._id,
              isPackage: true,
            }));

            return { companyData, packageData };
          })
          .then(({ companyData, packageData }) => {
            dispatch(
              getProductList({
                start: 0,
                limit: 0,
                isActive: true,
                search: '',
              }),
            )
              .then(response => {
                const productData = response.payload?.data?.list?.map(item => ({
                  ...item,
                  label: item?.item_name,
                  value: item?._id,
                  isPackage: false,
                }));
                let data = [
                  { label: 'Package', items: [...packageData] },
                  { label: 'Product', items: [...productData] },
                ];
                setDropdownInquiryOptionList(prevState => ({
                  ...prevState,
                  clientCompanyOptionList: companyData,
                  editingItemOptionList: data,
                  exposingItemOptionList: data,
                }));
              })
              .catch(error => {
                console.error('Error fetching product data:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching package data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching company data:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (isAddClientCompany) {
      dispatch(
        getClientCompanyList({
          start: 0,
          limit: 0,
          isActive: true,
          search: '',
        }),
      ).then(response => {
        const companyData = response.payload?.data?.list?.map(item => ({
          label: item?.company_name,
          value: item?._id,
        }));

        setDropdownInquiryOptionList(prevState => ({
          ...prevState,
          clientCompanyOptionList: companyData,
        }));

        const changedValues = companyData.find(
          afterItem =>
            !dropdownInquiryOptionList?.clientCompanyOptionList.find(
              beforeItem =>
                beforeItem.value === afterItem.value &&
                beforeItem.label === afterItem.label,
            ),
        );

        setFieldValue('client_company_id', changedValues.value);
        companyHandleChange('client_company_id', changedValues.value);
      });
    }

    if (isAddClientCompany) {
      dispatch(setIsAddClientCompany(false));
    }
  }, [isAddClientCompany, dispatch]);

  const getRequiredList = () => {
    dispatch(
      getCurrencyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
    dispatch(
      getReferenceList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );

    dispatch(
      getCountryList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
  };

  const handleEditingTableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.editing_inquiryTable];
    const index = editingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = editingList[index];
    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) editingList[index] = updatedObj;
    setFieldValue('editing_inquiryTable', editingList);
  };

  const handleExposingTableChange = (item, fieldName, fieldValue) => {
    const exposingList = [...values?.exposing_inquiryTable];
    const index = exposingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = exposingList[index];
    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) exposingList[index] = updatedObj;
    setFieldValue('exposing_inquiryTable', exposingList);
  };

  const actionBodyTemplate = data => {
    return (
      <div className="dropdown_action_wrap">
        <Button
          onClick={() => {
            handleDeleteEditingItem(data);
          }}
          className="btn_transparent"
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };
  const dueDateBodyTemplate = data => {
    return (
      <div className="form_group date_select_wrapper w_150 hover_date">
        <Calendar
          id="Creat Date"
          placeholder="Select Date"
          showIcon
          dateFormat="dd-mm-yy"
          value={data?.due_date}
          name="due_date"
          minDate={new Date(values?.create_date)}
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value);
            handleEditingTableChange(data, e.target.name, utcDate);
          }}
        />
      </div>
    );
  };

  const quantityBodyTemplate = data => {
    return (
      <div className="form_group w_120 hover_input">
        <InputNumber
          id="Quantity"
          placeholder="Enter Qty"
          name="quantity"
          useGrouping={false}
          value={data?.quantity}
          onChange={e => {
            handleEditingTableChange(
              data,
              e.originalEvent.target.name,
              e.value,
            );
          }}
          required
        />
      </div>
    );
  };

  const descriptionBodyTemplate = data => {
    // return (
    //   <div className="max_250 form_group hover_textarea">
    //     <InputTextarea
    //       id="current_address"
    //       placeholder="Current Address"
    //       rows={1}
    //       name="description"
    //       value={data?.description}
    //       onChange={e => {
    //         handleEditingTableChange(data, e.target.name, e.target.value);
    //       }}
    //     />
    //   </div>
    // );
    return (
      <div
        className="editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const actionExpoBodyTemplate = data => {
    return (
      <div className="dropdown_action_wrap">
        <Button
          onClick={() => {
            handleDeleteExposingItem(data);
          }}
          className="btn_transparent"
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };

  const dueDateExpoBodyTemplate = data => {
    return (
      <div className="form_group date_select_wrapper w_150 hover_date">
        <Calendar
          id="Order Date"
          placeholder="Select Date"
          showIcon
          dateFormat="dd-mm-yy"
          value={data?.order_date}
          name="order_date"
          minDate={new Date(values?.create_date)}
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value);
            handleExposingTableChange(data, e.target.name, utcDate);
          }}
        />
      </div>
    );
  };

  const quantityExpoBodyTemplate = data => {
    return (
      <div className="form_group w_120 hover_input">
        <InputNumber
          id="Quantity"
          placeholder="Enter Qty"
          name="quantity"
          useGrouping={false}
          value={data?.quantity}
          onChange={e => {
            handleExposingTableChange(
              data,
              e.originalEvent.target.name,
              e.value,
            );
          }}
          required
        />
      </div>
    );
  };

  const rateExpoBodyTemplate = data => {
    return (
      <div className="form_group w_120 hover_input">
        <InputNumber
          id="Rate"
          placeholder="Enter Qty"
          name="rate"
          useGrouping={false}
          value={data?.rate}
          onChange={e => {
            handleExposingTableChange(
              data,
              e.originalEvent.target.name,
              e.value,
            );
          }}
          required
        />
      </div>
    );
  };

  const descriptionExpoBodyTemplate = data => {
    // return (
    // <div className="max_250 form_group hover_textarea">
    //   <InputTextarea
    //     id="current_address"
    //     placeholder="Current Address"
    //     className="input_wrap"
    //     rows={1}
    //     name="description"
    //     value={data?.description}
    //     onChange={e => {
    //       handleExposingTableChange(data, e.target.name, e.target.value);
    //     }}
    //   />
    // </div>
    // );
    return (
      <div
        className="editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const submitHandle = useCallback(
    async values => {
      const isDueDate =
        values?.inquiry_type === 1
          ? values?.editing_inquiryTable?.some(item => {
              return !item?.due_date;
            })
          : values?.exposing_inquiryTable?.some(item => {
              return !item?.order_date;
            });

      if (!isDueDate) {
        if (id) {
          let payload = {
            inquiry_id: id,
            create_date: values?.create_date,
            client_company_id: values?.client_company_id,
            remark: values?.remark,
            inquiry_type: values?.inquiry_type,
            inquiry_item:
              values?.inquiry_type === 1
                ? values?.editing_inquiryTable
                : values?.exposing_inquiryTable,
          };
          dispatch(editInquiry(payload));
          dispatch(
            setIsGetInintialValuesInquiry({
              ...isGetInintialValuesInquiry,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedInquiryData());
        } else {
          let payload = {
            inquiry_no: values?.inquiry_no,
            create_date: values?.create_date,
            client_company_id: values?.client_company_id,
            remark: values?.remark,
            inquiry_type: values?.inquiry_type,
            inquiry_item:
              values?.inquiry_type === 1
                ? values?.editing_inquiryTable
                : values?.exposing_inquiryTable,
          };
          dispatch(addInquiry(payload));
          dispatch(
            setIsGetInintialValuesInquiry({
              ...isGetInintialValuesInquiry,
              add: false,
            }),
          );
          dispatch(clearAddSelectedInquiryData());
        }
        navigate('/inquiry');
      } else {
        toast.error('Due Date is Required');
      }
    },
    [id, dispatch, navigate],
  );
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: inquirySchema,
    onSubmit: submitHandle,
  });

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
      dispatch(
        setUpdateSelectedInquiryData({
          ...updateSelectedInquiryData,
          [fieldName]: fieldValue,
        }),
      );
    } else {
      dispatch(
        setAddSelectedInquiryData({
          ...addSelectedInquiryData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let editingList = [];
    let exposingList = [];
    if (values?.inquiry_type === 1) {
      if (!values?.editing_inquiry?.includes(data?._id)) {
        let newObj = {};
        if (data?.isPackage === true) {
          newObj = {
            item_id: data?._id,
            item_name: data?.package_name,
            quantity: 1,
            due_date: '',
            description: data?.remark,
          };
        } else {
          newObj = {
            item_id: data?._id,
            item_name: data?.item_name,
            quantity: 1,
            due_date: '',
            description: data?.item_description,
          };
        }

        editingList = [...values?.editing_inquiryTable, newObj];
      } else {
        editingList = values?.editing_inquiryTable?.filter(
          item => item?.item_id !== data?._id,
        );
      }
      setFieldValue('editing_inquiryTable', editingList);
    } else {
      if (!values?.exposing_inquiry?.includes(data?._id)) {
        let newObj = {};
        if (data?.isPackage === true) {
          newObj = {
            item_id: data?._id,
            item_name: data?.package_name,
            quantity: 1,
            order_date: '',
            description: data?.remark,
            rate: data?.price,
          };
        } else {
          newObj = {
            item_id: data?._id,
            item_name: data?.item_name,
            quantity: 1,
            order_date: '',
            description: data?.item_description,
            rate: data?.item_price,
          };
        }

        exposingList = [...values?.exposing_inquiryTable, newObj];
      } else {
        exposingList = values?.exposing_inquiryTable?.filter(
          item => item?.item_id !== data?._id,
        );
      }
      setFieldValue('exposing_inquiryTable', exposingList);
    }
    if (id) {
      dispatch(
        setUpdateSelectedInquiryData({
          ...updateSelectedInquiryData,
          [fieldName]: fieldValue,
          editing_inquiryTable: editingList,
          exposing_inquiryTable: exposingList,
        }),
      );
    } else {
      dispatch(
        setAddSelectedInquiryData({
          ...addSelectedInquiryData,
          [fieldName]: fieldValue,
          editing_inquiryTable: editingList,
          exposing_inquiryTable: exposingList,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  // const handleitemList = (fieldName, fieldValue, e) => {
  //   const data = e?.selectedOption;
  //   let editingList = [];
  //   let exposingList = [];
  //   if (
  //     e?.selectedOption &&
  //     e?.selectedOption.length === e?.value?.length &&
  //     e?.value?.length !== 0
  //   ) {
  //     // Add all items to the table
  //     if (values?.inquiry_type === 1) {
  //       editingList = dropdownInquiryOptionList.editingItemOptionList
  //         ?.flatMap(option => option.items)
  //         ?.map(item => {
  //           return {
  //             item_id: item._id,
  //             item_name: item.isPackage ? item.package_name : item.item_name,
  //             quantity: 1,
  //             due_date: '',
  //             description: item.isPackage ? item.remark : item.item_description,
  //           };
  //         });
  //       setFieldValue('editing_inquiryTable', editingList);
  //     } else {
  //       exposingList = dropdownInquiryOptionList.exposingItemOptionList
  //         ?.flatMap(option => option.items)
  //         ?.map(item => {
  //           return {
  //             item_id: item._id,
  //             item_name: item.isPackage ? item.package_name : item.item_name,
  //             quantity: 1,
  //             order_date: '',
  //             description: item.isPackage ? item.remark : item.item_description,
  //             rate: item.price || item.item_price,
  //           };
  //         });
  //       setFieldValue('exposing_inquiryTable', exposingList);
  //     }
  //   } else if (e?.selectedOption && e?.selectedOption.length === 0) {
  //     // Remove all items from the table if all options are deselected
  //     setFieldValue('editing_inquiryTable', []);
  //     setFieldValue('exposing_inquiryTable', []);
  //   } else {
  //     if (values?.inquiry_type === 1) {
  //       if (!values?.editing_inquiry?.includes(data?._id)) {
  //         let newObj = {};
  //         if (data?.isPackage === true) {
  //           newObj = {
  //             item_id: data?._id,
  //             item_name: data?.package_name,
  //             quantity: 1,
  //             due_date: '',
  //             description: data?.remark,
  //           };
  //         } else {
  //           newObj = {
  //             item_id: data?._id,
  //             item_name: data?.item_name,
  //             quantity: 1,
  //             due_date: '',
  //             description: data?.item_description,
  //           };
  //         }

  //         editingList = [...values?.editing_inquiryTable, newObj];
  //       } else {
  //         editingList = values?.editing_inquiryTable?.filter(
  //           item => item?.item_id !== data?._id,
  //         );
  //       }
  //       setFieldValue('editing_inquiryTable', editingList);
  //     } else {
  //       if (!values?.exposing_inquiry?.includes(data?._id)) {
  //         let newObj = {};
  //         if (data?.isPackage === true) {
  //           newObj = {
  //             item_id: data?._id,
  //             item_name: data?.package_name,
  //             quantity: 1,
  //             order_date: '',
  //             description: data?.remark,
  //             rate: data?.price,
  //           };
  //         } else {
  //           newObj = {
  //             item_id: data?._id,
  //             item_name: data?.item_name,
  //             quantity: 1,
  //             order_date: '',
  //             description: data?.item_description,
  //             rate: data?.item_price,
  //           };
  //         }

  //         exposingList = [...values?.exposing_inquiryTable, newObj];
  //       } else {
  //         exposingList = values?.exposing_inquiryTable?.filter(
  //           item => item?.item_id !== data?._id,
  //         );
  //       }
  //       setFieldValue('exposing_inquiryTable', exposingList);
  //     }
  //   }
  //   if (id) {
  //     dispatch(
  //       setUpdateSelectedInquiryData({
  //         ...updateSelectedInquiryData,
  //         [fieldName]: fieldValue,
  //         editing_inquiryTable: editingList,
  //         exposing_inquiryTable: exposingList,
  //       }),
  //     );
  //   } else {
  //     dispatch(
  //       setAddSelectedInquiryData({
  //         ...addSelectedInquiryData,
  //         [fieldName]: fieldValue,
  //         editing_inquiryTable: editingList,
  //         exposing_inquiryTable: exposingList,
  //       }),
  //     );
  //   }

  //   setFieldValue(fieldName, fieldValue);
  // };

  const handleDeleteEditingItem = item => {
    let dummyList = values?.editing_inquiryTable.filter(
      d => d?.item_id !== item?.item_id,
    );
    setFieldValue('editing_inquiryTable', dummyList);
    let itemData = values?.editing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('editing_inquiry', itemData);
    if (id) {
      dispatch(
        setUpdateSelectedInquiryData({
          ...updateSelectedInquiryData,
          editing_inquiryTable: dummyList,
          editing_inquiry: itemData,
        }),
      );
    } else {
      dispatch(
        setAddSelectedInquiryData({
          ...addSelectedInquiryData,
          editing_inquiryTable: dummyList,
          editing_inquiry: itemData,
        }),
      );
    }
  };
  const handleDeleteExposingItem = item => {
    let dummyList = values?.exposing_inquiryTable.filter(
      d => d?.item_id !== item?.item_id,
    );
    setFieldValue('exposing_inquiryTable', dummyList);
    let itemData = values?.exposing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('exposing_inquiry', itemData);
    if (id) {
      dispatch(
        setUpdateSelectedInquiryData({
          ...updateSelectedInquiryData,
          exposing_inquiryTable: dummyList,
          exposing_inquiry: itemData,
        }),
      );
    } else {
      dispatch(
        setAddSelectedInquiryData({
          ...addSelectedInquiryData,
          exposing_inquiryTable: dummyList,
          exposing_inquiry: itemData,
        }),
      );
    }
  };

  const groupedItemTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const handleCancel = () => {
    if (id) {
      dispatch(
        setIsGetInintialValuesInquiry({
          ...isGetInintialValuesInquiry,
          update: false,
        }),
      );
      dispatch(clearUpdateSelectedInquiryData());
    } else {
      dispatch(
        setIsGetInintialValuesInquiry({
          ...isGetInintialValuesInquiry,
          add: false,
        }),
      );
      dispatch(clearAddSelectedInquiryData());
    }
    navigate('/inquiry');
  };

  return (
    <div className="main_Wrapper">
      {(clientCompanyLoading ||
        countryLoading ||
        currencyLoading ||
        referenceLoading ||
        inquiryLoading ||
        packageLoading ||
        productLoading) && <Loader />}
      <div className="create_inquiry_wrap bg-white radius15 border">
        <div className="create_inquiry_top p15 border-bottom">
          <Row className="align-items-center gy-3">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">Inquiry Form</h3>
              </div>
            </Col>
            <Col sm={9}>
              <div className="title_right_wrapper">
                <ul>
                  <li>
                    <Button onClick={handleCancel} className="btn_border_dark">
                      Exit Page
                    </Button>
                  </li>
                  <li>
                    <Button className="btn_primary" onClick={handleSubmit}>
                      Save Inquiry
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="inquiry_form_wrap p20 p10-sm">
          <Row>
            <Col xl={6}>
              <div className="inquiry_form_left">
                <Row>
                  <Col xl={5} sm={6}>
                    <div className="form_group mb-3">
                      <label>Inquiry No</label>
                      <InputText
                        id="Inquiry No"
                        placeholder="Enter Inquiry No"
                        className="input_wrap"
                        name="inquiry_no"
                        value={values?.inquiry_no || ''}
                        disabled
                        required
                      />
                      {touched?.inquiry_no && errors?.inquiry_no && (
                        <p className="text-danger">{errors?.inquiry_no}</p>
                      )}
                    </div>
                  </Col>
                  <Col xl={5} sm={6}>
                    <div className="form_group date_select_wrapper mb-3">
                      <label>Create Date</label>
                      <Calendar
                        id="Creat Date"
                        placeholder="Select Date"
                        showIcon
                        dateFormat="dd-mm-yy"
                        name="create_date"
                        maxDate={new Date()}
                        value={values?.create_date || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        showButtonBar
                      />
                      {touched?.create_date && errors?.create_date && (
                        <p className="text-danger">{errors?.create_date}</p>
                      )}
                    </div>
                  </Col>
                </Row>
                <h3 className="mb-3">Client Details</h3>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>Company</label>

                      <ReactSelectSingle
                        filter
                        value={values?.client_company_id}
                        options={
                          dropdownInquiryOptionList?.clientCompanyOptionList
                        }
                        name="client_company_id"
                        onChange={e => {
                          companyHandleChange(e.target.name, e.value);
                        }}
                        onBlur={handleBlur}
                        placeholder="Select Company"
                      />
                      {touched?.client_company_id &&
                        errors?.client_company_id &&
                        !values?.client_company_id && (
                          <p className="text-danger">
                            {errors?.client_company_id}
                          </p>
                        )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    {!id && (
                      <Button
                        className="btn_primary mt25"
                        onClick={() => {
                          getRequiredList();
                          setCreateCompanyModal(true);
                        }}
                      >
                        <img src={PlusIcon} alt="PlusIcon" />
                        New Client
                      </Button>
                    )}
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>Client Full Name</label>
                      <InputText
                        id="Client Full Name"
                        placeholder="Client Name"
                        className="input_wrap"
                        name="client_full_name"
                        value={values?.client_full_name}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>Reference</label>
                      <InputText
                        id="Reference Name"
                        placeholder="Reference"
                        className="input_wrap"
                        name="reference"
                        value={values?.reference}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="EmailAddress">Email Address</label>
                      <InputText
                        id="EmailAddress"
                        placeholder="Email Address"
                        className="input_wrap"
                        name="email_id"
                        value={values?.email_id}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="PhoneNumber">Phone Number</label>
                      <InputText
                        id="PhoneNumber"
                        placeholder="Phone Number"
                        className="input_wrap"
                        name="mobile_no"
                        value={values?.mobile_no}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form_group mb-3">
                      <label htmlFor="Address">Address</label>
                      <InputText
                        id="Address"
                        placeholder="Address"
                        className="input_wrap"
                        name="address"
                        value={values?.address}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>Country</label>
                      <InputText
                        id="Address"
                        placeholder="Country"
                        className="input_wrap"
                        name="country"
                        value={values?.country}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>State</label>
                      <InputText
                        id="Address"
                        placeholder="State"
                        className="input_wrap"
                        name="state"
                        value={values?.state}
                        disabled
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label>City</label>
                      <InputText
                        id="Address"
                        placeholder="City"
                        className="input_wrap"
                        name="city"
                        value={values?.city}
                        disabled
                      />
                    </div>
                    <div className="form_group mb-3">
                      <label htmlFor="PinCode">Pin code</label>
                      <InputText
                        id="PinCode"
                        placeholder="Pin Code"
                        className="input_wrap"
                        name="pin_code"
                        value={values?.pin_code}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="Remark">Remark</label>
                      <InputTextarea
                        id="Remark"
                        placeholder="Remark"
                        className="input_wrap"
                        rows={6}
                        name="remark"
                        value={values?.remark || ''}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xl={6}>
              <div className="inquiry_form_right">
                <h3 className="mb-3">Inquiry Details</h3>
                <div className="radio_wrapper d-flex flex-wrap align-items-center mb20">
                  <label className="me-3">Inquiry Type</label>
                  <div className="radio-inner-wrap d-flex align-items-center me-3">
                    <RadioButton
                      inputId="Editing"
                      name="inquiry_type"
                      value={1}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      checked={values?.inquiry_type === 1}
                    />
                    <label htmlFor="ingredient1" className="ms-sm-2 ms-1">
                      Editing
                    </label>
                  </div>
                  <div className="radio-inner-wrap d-flex align-items-center">
                    <RadioButton
                      inputId="Exposing"
                      name="inquiry_type"
                      value={2}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      checked={values?.inquiry_type === 2}
                    />
                    <label htmlFor="ingredient2" className="ms-sm-2 ms-1">
                      Exposing
                    </label>
                  </div>
                  {touched?.inquiry_type && errors?.inquiry_type && (
                    <p className="text-danger">{errors?.inquiry_type}</p>
                  )}
                </div>
                <Row>
                  <Col sm={6}>
                    <div className="form_group mb-3">
                      <MultiSelect
                        value={
                          values?.inquiry_type === 1
                            ? values?.editing_inquiry
                            : values?.exposing_inquiry
                        }
                        name={`${
                          values?.inquiry_type === 1
                            ? 'editing_inquiry'
                            : 'exposing_inquiry'
                        }`}
                        options={
                          values?.inquiry_type === 1
                            ? dropdownInquiryOptionList?.editingItemOptionList
                            : dropdownInquiryOptionList?.exposingItemOptionList
                        }
                        optionLabel="label"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        optionGroupTemplate={groupedItemTemplate}
                        onChange={e => {
                          handleitemList(e.target.name, e.target.value, e);
                          // commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                        filter
                        placeholder="Select items"
                        showSelectAll={false}
                        onBlur={handleBlur}
                        className="w-100 "
                      />
                      {/* <ReactSelectSingle
                        filter
                        value={values?.inquiry_itemId}
                        options={dropdownInquiryOptionList?.itemOptionList}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                        placeholder="Select Company"
                      /> */}

                      {touched?.editing_inquiry && errors?.editing_inquiry && (
                        <p className="text-danger">{errors?.editing_inquiry}</p>
                      )}
                      {touched?.exposing_inquiry &&
                        errors?.exposing_inquiry && (
                          <p className="text-danger">
                            {errors?.exposing_inquiry}
                          </p>
                        )}
                    </div>
                  </Col>
                </Row>
                <div className="data_table_wrapper inquiry_form_table border rounded">
                  {values?.inquiry_type === 1 && (
                    <DataTable
                      value={values?.editing_inquiryTable}
                      sortField="price"
                      sortOrder={1}
                      rows={10}
                    >
                      <Column field="item_name" header="Item"></Column>
                      <Column
                        field="quantity"
                        header="Quantity"
                        body={quantityBodyTemplate}
                      ></Column>
                      <Column
                        field="due_date"
                        header="Due Date"
                        body={dueDateBodyTemplate}
                      ></Column>
                      <Column
                        field="description"
                        header="Descriptions"
                        body={descriptionBodyTemplate}
                      ></Column>
                      <Column
                        field="action"
                        header="Action"
                        body={actionBodyTemplate}
                      ></Column>
                    </DataTable>
                  )}
                  {values?.inquiry_type === 2 && (
                    <DataTable
                      value={values?.exposing_inquiryTable}
                      sortField="price"
                      sortOrder={1}
                      rows={10}
                    >
                      <Column field="item_name" header="Item Name"></Column>
                      <Column
                        field="quantity"
                        header="Quantity"
                        body={quantityExpoBodyTemplate}
                      ></Column>
                      <Column
                        field="order_date"
                        header="Order Date"
                        body={dueDateExpoBodyTemplate}
                      ></Column>
                      <Column
                        field="rate"
                        header="Rate"
                        body={rateExpoBodyTemplate}
                      ></Column>
                      <Column
                        field="description"
                        header="Descriptions"
                        body={descriptionExpoBodyTemplate}
                      ></Column>
                      <Column
                        field="action"
                        header="Action"
                        body={actionExpoBodyTemplate}
                      ></Column>
                    </DataTable>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Dialog
        header="Save Personal Filters"
        visible={saveFilterModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setSaveFilterModal(false)}
      >
        <div className="form_group mb-3">
          <InputText placeholder="Name your filter" />
        </div>
        <Button
          className="btn_primary"
          onClick={() => setSaveFilterModal(false)}
        >
          Save Filter
        </Button>
      </Dialog>

      <CreateClientCompanyInInquiry
        createCompanyModal={createCompanyModal}
        setCreateCompanyModal={setCreateCompanyModal}
      />
      {/* <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      /> */}
      {/* <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
      >
        <div className="company_inquiry_title text-center mb25">
          <h2>ABC Company</h2>
          <h5>Rajesh Singhania</h5>
        </div>
        <div className="company_inquiry_detail">
          <ul>
            <li>
              <label>
                Inquiry No.<span>:</span>
              </label>
              <span>#56123</span>
            </li>
            <li>
              <label>
                Created Date<span>:</span>
              </label>
              <span>23/06/2023</span>
            </li>
            <li>
              <label>
                Contact Number<span>:</span>
              </label>
              <span>+91 9876541230</span>
            </li>
            <li>
              <label>
                Inquiry Type<span>:</span>
              </label>
              <span>#56123</span>
            </li>
            <li>
              <label>
                Item Names<span>:</span>
              </label>
              <span>Wedding</span>
            </li>
            <li>
              <label>
                Reference<span>:</span>
              </label>
              <span>Social Media</span>
            </li>
            <li>
              <label>
                Status<span>:</span>
              </label>
              <span>Social Media</span>
            </li>
            <li>
              <label className="w-100">Specific Recruitment</label>
              <InputTextarea
                value={value}
                onChange={e => setValue(e.target.value)}
                rows={5}
                cols={30}
              />
            </li>
          </ul>
          <div className="text-center">
            <Button className="btn_primary">
              <img src={EditIcon} alt="" />
              Edit Inquiry
            </Button>
          </div>
        </div>
      </Sidebar> */}
    </div>
  );
}
