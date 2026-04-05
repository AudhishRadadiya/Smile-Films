import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  addStep,
  getStep,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import {
  getClientCompany,
  getClientCompanyList,
  setIsAddClientCompany,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import {
  addDataCollection,
  clearAddSelectedDataCollectionData,
  clearUpdateSelectedDataCollectionData,
  editDataCollection,
  setAddSelectedDataCollectionData,
  setIsGetInintialValuesDataCollection,
  setUpdateSelectedDataCollectionData,
} from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { checkWordLimit } from 'Helper/CommonHelper';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { dataCollectionSchema } from 'Schema/Editing/dataCollectionSchema';
import { getInquiryNo } from 'Store/Reducers/ActivityOverview/inquirySlice';
import { getDevicesList } from 'Store/Reducers/Settings/Master/DevicesSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getReferenceList } from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { getProjectTypeList } from 'Store/Reducers/Settings/Master/ProjectTypeSlice';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';
import CreateClientCompanyInInquiry from 'Components/ActivityOverview/CreateClientCompanyInInquiry';

const dataSizeType = [
  { label: 'MB', value: 1 },
  { label: 'GB', value: 2 },
  { label: 'TB', value: 3 },
];

export default function DataCollectionDetail({ initialValues }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const locationPath = pathname?.split('/');
  const updateData = id && locationPath[1] === 'update-data-collection';

  const queryParams = new URLSearchParams(search);
  const paramValue = queryParams.get('param');

  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const [
    dropdownDataCollectionOptionList,
    setDropdownDataCollectionOptionList,
  ] = useState({
    DataCollectionList: [],
    editingItemOptionList: [],
    projectTypeOptionList: [],
    clientCompanyOptionList: [],
  });

  const {
    dataCollectionLoading,
    addSelectedDataCollectionData,
    updateSelectedDataCollectionData,
    isGetInintialValuesDataCollection,
  } = useSelector(({ dataCollection }) => dataCollection);
  const { countryLoading } = useSelector(({ country }) => country);
  const { devicesLoading } = useSelector(({ devices }) => devices);
  const { productLoading } = useSelector(({ product }) => product);
  const { packageLoading } = useSelector(({ packages }) => packages);
  const { currencyLoading } = useSelector(({ currency }) => currency);
  const { referenceLoading } = useSelector(({ references }) => references);
  const { getStepData, stepLoading } = useSelector(({ editing }) => editing);
  const { projectTypeLoading } = useSelector(({ projectType }) => projectType);
  const { isAddClientCompany, clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );

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
    if (updateData) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
          email_id: responseData?.email_id,
          mobile_no: responseData?.mobile_no,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
          email_id: responseData?.email_id,
          mobile_no: responseData?.mobile_no,
        }),
      );
    }
  };

  useEffect(() => {
    if (!updateData) {
      dispatch(getInquiryNo())
        .then(response => {
          const responseData = response.payload;

          dispatch(
            setAddSelectedDataCollectionData({
              ...addSelectedDataCollectionData,
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
      getDevicesList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    )
      .then(response => {
        const DataCollectionListData = response.payload?.data?.list?.map(
          item => {
            return { label: item?.device_name, value: item?._id };
          },
        );

        setDropdownDataCollectionOptionList(prevState => ({
          ...prevState,
          DataCollectionList: DataCollectionListData,
        }));
      })
      .catch(error => {
        console.error('Error fetching city data:', error);
      });

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

        if (isAddClientCompany) {
          const changedValues = companyData.find(
            afterItem =>
              !dropdownDataCollectionOptionList?.clientCompanyOptionList.find(
                beforeItem =>
                  beforeItem.value === afterItem.value &&
                  beforeItem.label === afterItem.label,
              ),
          );

          setFieldValue('client_company_id', changedValues?.value);
          companyHandleChange('client_company_id', changedValues?.value);
        }

        return { companyData };
      })
      .then(({ companyData }) => {
        dispatch(
          getProjectTypeList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        )
          .then(response => {
            let projectTypeData = [];

            if (response.payload?.data?.list?.length) {
              projectTypeData = response.payload?.data?.list?.map(item => ({
                ...item,
                label: item?.project_type,
                value: item?._id,
              }));
            }

            return { companyData, projectTypeData };
          })
          .then(({ companyData, projectTypeData }) => {
            dispatch(
              getPackageList({
                start: 0,
                limit: 0,
                isActive: true,
                search: '',
                type: 1,
              }),
            )
              .then(response => {
                let packageData = [];

                if (response.payload?.data?.list?.length) {
                  packageData = response.payload?.data?.list?.map(item => ({
                    ...item,
                    label: item?.package_name,
                    value: item?._id,
                    isPackage: true,
                  }));
                }

                return { companyData, projectTypeData, packageData };
              })
              .then(({ companyData, projectTypeData, packageData }) => {
                dispatch(
                  getProductList({
                    start: 0,
                    limit: 0,
                    isActive: true,
                    search: '',
                    type: 1,
                  }),
                )
                  .then(response => {
                    if (id) {
                      dispatch(getStep({ order_id: id }));
                    }

                    let productData = [];

                    if (response.payload?.data?.list?.length) {
                      productData = response.payload?.data?.list?.map(item => ({
                        ...item,
                        label: item?.item_name,
                        value: item?._id,
                        isPackage: false,
                      }));
                    }

                    const data = [
                      {
                        label: 'Package',
                        items: packageData?.length ? [...packageData] : [],
                      },
                      {
                        label: 'Product',
                        items: productData?.length ? [...productData] : [],
                      },
                    ];

                    setDropdownDataCollectionOptionList(prevState => ({
                      ...prevState,
                      clientCompanyOptionList: companyData,
                      editingItemOptionList: data,
                      projectTypeOptionList: projectTypeData,
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
            console.error('Error fetching project type data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching company data:', error);
      });
  }, [dispatch, isAddClientCompany]);

  useEffect(() => {
    if (isAddClientCompany) {
      dispatch(
        getClientCompanyList({
          start: 0,
          limit: 0,
          isActive: true,
          search: '',
        }),
      );
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

    dispatch(
      getDropdownGroupList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
  };

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let editingList = [];

    if (!values?.editing_inquiry?.includes(data?._id)) {
      let newObj = {};
      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: 1,
          due_date: '',
          description: data?.remark,
          // data_collection_source: [],
          // data_size: '',
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: 1,
          due_date: '',
          description: data?.item_description,
          // data_collection_source: [],
          // data_size: '',
        };
      }
      editingList = [...values?.editingTable, newObj];
    } else {
      editingList = values?.editingTable?.filter(
        item => item?.item_id !== data?._id,
      );
    }
    // let totalDataCollection = totalCount(editingList, 'data_size');
    // setFieldValue('total_data_collection', totalDataCollection);
    setFieldValue('editingTable', editingList);

    if (updateData) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          // total_data_collection: totalDataCollection,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          // total_data_collection: totalDataCollection,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleEditingTableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = editingList[index];
    // let totalDataCollection = 0;
    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) editingList[index] = updatedObj;
    // if (fieldName === 'data_size') {
    //   totalDataCollection = totalCount(editingList, 'data_size');
    //   setFieldValue('total_data_collection', totalDataCollection);
    // }
    setFieldValue('editingTable', editingList);
    if (updateData) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          // ...(fieldName === 'data_size' && {
          //   total_data_collection: totalDataCollection,
          // }),
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          // ...(fieldName === 'data_size' && {
          //   total_data_collection: totalDataCollection,
          // }),
        }),
      );
    }
  };

  const editingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  // const DataCollectionTemplate = data => {
  //   return (
  //     <div className="form_group d-flex">
  //       <MultiSelect
  //         value={data?.data_collection_source}
  //         options={dropdownDataCollectionOptionList?.DataCollectionList}
  //         name="data_collection_source"
  //         onChange={e => {
  //           handleEditingTableChange(data, e.target.name, e.target.value);
  //         }}
  //         placeholder="Data Collection Source"
  //         className="w-100 me-2"
  //         showSelectAll={false}
  //         maxSelectedLabels={1}
  //       />
  //     </div>
  //   );
  // };

  // const dataSizeBodyTemplate = data => {
  //   return (
  //     <div className="form_group d-flex">
  //       {/* <InputText
  //         id="Data Size"
  //         placeholder="Data size"
  //         name="data_size"
  //         useGrouping={false}
  //         value={data?.data_size}
  //         onChange={e => {
  //           handleEditingTableChange(data, e.target.name, e.target.value);
  //         }}
  //         required
  //       /> */}
  //       <InputNumber
  //         id="Data Size"
  //         placeholder="Data size"
  //         name="data_size"
  //         className="max_100"
  //         useGrouping={false}
  //         maxFractionDigits={2}
  //         value={data?.data_size}
  //         onBlur={handleBlur}
  //         maxLength="10"
  //         onChange={e => {
  //           if (!e.value || checkWordLimit(e.value, 10)) {
  //             handleEditingTableChange(
  //               data,
  //               e.originalEvent.target.name,
  //               e.value ? e.value : '',
  //             );
  //           }
  //         }}
  //         required
  //       />
  //     </div>
  //   );
  // };

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
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value ? e.value : '');
            handleEditingTableChange(data, e.target.name, utcDate);
          }}
          showButtonBar
        />
      </div>
    );
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

  const descriptionBodyTemplate = data => {
    return (
      <div
        className="max_250 editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data?.description }}
      />
    );
  };

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (updateData) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const submitHandle = useCallback(
    async values => {
      // const isDataCollectionSource = values?.editingTable?.some(item => {
      //   return item?.data_collection_source.length === 0;
      // });

      const isDueDate = values?.editingTable?.some(item => {
        return !item?.due_date;
      });

      // const isDataSize = values?.editingTable?.some(item => {
      //   return !item?.data_size;
      // });

      // if (isDataCollectionSource) {
      //   toast.error(
      //     'Data Collection Source in Data Collection Details is Required',
      //   );
      // }

      // if (isDataSize) {
      //   toast.error('Data Size in Data Collection Details is Required');
      // }

      if (isDueDate) {
        toast.error('Due Date in Data Collection Details is Required');
      } else {
        let navigationLink = '';
        let orderId = '';

        let payload = {
          ...(id ? { order_id: id } : { inquiry_no: values?.inquiry_no }),
          create_date: values?.create_date
            ? moment(values?.create_date).format('YYYY-MM-DD')
            : '',
          remark: values?.remark,
          couple_name: values?.couple_name,
          project_type: values?.project_type,
          data_collection_source: values?.data_collection_source,
          data_size: values?.data_size,
          data_size_type: values?.data_size_type,
          client_company_id: values?.client_company_id,
          ...(!updateData && { data_collection: values?.editingTable }),
          editing_hour: values?.editing_hour ? values?.editing_hour : 0,
          editing_minute: values?.editing_minute ? values?.editing_minute : 0,
          editing_second: values?.editing_second ? values?.editing_second : 0,
        };

        if (updateData) {
          let updatedList = values?.editingTable?.map(d => {
            return {
              ...d,
              orderItems_id: d?._id,
            };
          });

          payload = {
            ...payload,
            data_collection: updatedList,
          };

          await dispatch(editDataCollection(payload));

          dispatch(
            setIsGetInintialValuesDataCollection({
              ...isGetInintialValuesDataCollection,
              update: false,
            }),
          );
          dispatch(clearUpdateSelectedDataCollectionData());
          orderId = id;

          if (paramValue === 'editing') {
            navigationLink = `/editing-flow/${id}`;
          } else {
            navigationLink = '/data-collection';
          }
        } else {
          const res = await dispatch(addDataCollection(payload));

          dispatch(
            setIsGetInintialValuesDataCollection({
              ...isGetInintialValuesDataCollection,
              add: false,
            }),
          );
          dispatch(clearAddSelectedDataCollectionData());
          orderId = res?.payload?.data?._id;
          navigationLink = '/editing';
        }

        if (!getStepData?.step || getStepData?.step < 1) {
          let addStepPayload = {
            step: 1,
            order_id: orderId,
          };

          // Its use for completing the data-collection step in Editing:
          await dispatch(addStep(addStepPayload));
        }

        navigate(navigationLink);
      }
    },
    [
      id,
      dispatch,
      navigate,
      paramValue,
      updateData,
      getStepData,
      isGetInintialValuesDataCollection,
    ],
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
    validationSchema: dataCollectionSchema,
    onSubmit: submitHandle,
  });

  // const footerGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column className="text-start" footer="Total Data Collection" />
  //       <Column
  //         className="text-end"
  //         footer={`${values?.total_data_collection} GB`}
  //         colSpan={5}
  //       />
  //     </Row>
  //   </ColumnGroup>
  // );

  const handleDeleteEditingItem = item => {
    let dummyList = values?.editingTable.filter(
      d => d?.item_id !== item?.item_id,
    );
    // const totalDataCollection = totalCount(dummyList, 'data_size');
    // setFieldValue('total_data_collection', totalDataCollection);
    setFieldValue('editingTable', dummyList);
    let itemData = values?.editing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('editing_inquiry', itemData);
    if (updateData) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          editingTable: dummyList,
          editing_inquiry: itemData,
          // total_data_collection: totalDataCollection,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          editingTable: dummyList,
          editing_inquiry: itemData,
          // total_data_collection: totalDataCollection,
        }),
      );
    }
  };

  const handleCancel = () => {
    if (updateData) {
      dispatch(
        setIsGetInintialValuesDataCollection({
          ...isGetInintialValuesDataCollection,
          update: false,
        }),
      );
      dispatch(clearUpdateSelectedDataCollectionData());
    } else {
      dispatch(
        setIsGetInintialValuesDataCollection({
          ...isGetInintialValuesDataCollection,
          add: false,
        }),
      );
      dispatch(clearAddSelectedDataCollectionData());
    }
    navigate('/data-collection');
  };

  return (
    <div className="main_Wrapper">
      {(clientCompanyLoading ||
        countryLoading ||
        currencyLoading ||
        referenceLoading ||
        packageLoading ||
        productLoading ||
        devicesLoading ||
        projectTypeLoading ||
        dataCollectionLoading ||
        stepLoading) && <Loader />}
      <div className="add_data_collection_wrap bg-white radius15 border">
        <div className="px20 py15 border-bottom">
          <Row className="align-items-center">
            <Col sm={12}>
              <h2 className="m-0">
                {' '}
                {updateData ? 'Update Data Collection' : 'Add Data Collection'}
              </h2>
            </Col>
          </Row>
        </div>
        <div className="p20 p10-sm">
          <Row>
            <Col lg={6}>
              <div className="date_number mb20">
                <ul>
                  <li>
                    <h6>Order No.</h6>
                    <h4>{values?.inquiry_no}</h4>
                    {touched?.inquiry_no && errors?.inquiry_no && (
                      <p className="text-danger">{errors?.inquiry_no}</p>
                    )}
                  </li>
                  <li>
                    <h6>Create Date</h6>
                    <h4>{moment(values.create_date)?.format('DD-MM-YYYY')}</h4>
                    {touched?.create_date && errors?.create_date && (
                      <p className="text-danger">{errors?.create_date}</p>
                    )}
                  </li>
                  {updateData && (
                    <li>
                      <h6>Confirm By</h6>
                      <h4>{values?.confirm_by}</h4>
                    </li>
                  )}
                </ul>
              </div>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label>
                      Company<span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      value={values?.client_company_id}
                      options={
                        dropdownDataCollectionOptionList?.clientCompanyOptionList
                      }
                      name="client_company_id"
                      onChange={e => {
                        companyHandleChange(e.target.name, e.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Company Name"
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
                  <div className="form_group mb-3">
                    {!updateData && (
                      <Button
                        className="btn_primary mt25"
                        onClick={() => {
                          getRequiredList();
                          setCreateCompanyModal(true);
                        }}
                      >
                        <img src={PlusIcon} alt="" /> New Client
                      </Button>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="ClientName">Client Name</label>
                    <InputText
                      id="ClientName"
                      placeholder="Enter Client Name"
                      className="input_wrap"
                      name="client_full_name"
                      value={values?.client_full_name}
                      disabled
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="CoupleName">
                      Couple Name<span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="CoupleName"
                      name="couple_name"
                      className="input_wrap"
                      placeholder="Enter Couple Name"
                      value={values?.couple_name}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                    {touched?.couple_name && errors?.couple_name && (
                      <p className="text-danger">{errors?.couple_name}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="EmailAddress">Email Address</label>
                    <InputText
                      id="EmailAddress"
                      placeholder="Enter Email"
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
                      placeholder="Enter Number"
                      className="input_wrap"
                      name="mobile_no"
                      value={values?.mobile_no}
                      disabled
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="CoupleName">
                      Data Collection Source
                      <span className="text-danger fs-6">*</span>
                    </label>
                    <MultiSelect
                      value={values?.data_collection_source}
                      options={
                        dropdownDataCollectionOptionList?.DataCollectionList
                      }
                      name="data_collection_source"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Data Collection Source"
                      className="w-100 me-2"
                      showSelectAll={false}
                      maxSelectedLabels={3}
                    />
                    {touched?.data_collection_source &&
                      errors?.data_collection_source && (
                        <p className="text-danger">
                          {errors?.data_collection_source}
                        </p>
                      )}
                  </div>
                </Col>
                <Col sm={6}>
                  <Row>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="DataSize">
                          Data Size<span className="text-danger fs-6">*</span>
                        </label>
                        <InputNumber
                          name="data_size"
                          placeholder="Enter Data Size"
                          value={values?.data_size}
                          onChange={e => {
                            if (!e.value || checkWordLimit(e.value, 10)) {
                              setFieldValue('data_size', e.value);
                            }
                          }}
                          maxLength="10"
                          useGrouping={false}
                          onBlur={handleBlur}
                          maxFractionDigits={2}
                        />
                        {touched?.data_size && errors?.data_size && (
                          <p className="text-danger">{errors?.data_size}</p>
                        )}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label>
                          Data Size Unit
                          <span className="text-danger fs-6">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          name="data_size_type"
                          value={values?.data_size_type}
                          options={dataSizeType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Data Size Unit"
                        />
                        {touched?.data_size_type && errors?.data_size_type && (
                          <p className="text-danger">
                            {errors?.data_size_type}
                          </p>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label>
                      Project Type<span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      value={values?.project_type}
                      options={
                        dropdownDataCollectionOptionList?.projectTypeOptionList
                      }
                      name="project_type"
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.value);
                      }}
                      onBlur={handleBlur}
                      placeholder="Project Type"
                    />
                    {touched?.project_type && errors?.project_type && (
                      <p className="text-danger">{errors?.project_type}</p>
                    )}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group input_time mb-3">
                    <label>
                      Total Hours <span className="text-danger fs-6">*</span>
                    </label>
                    <div className="d-md-flex align-items-center justify-content-start">
                      <InputNumber
                        name="editing_hour"
                        placeholder="HH"
                        value={values?.editing_hour}
                        className="mb-2"
                        onChange={e => {
                          setFieldValue('editing_hour', e?.value);
                        }}
                        useGrouping={false}
                        minFractionDigits={0}
                        min={0}
                      />
                      <span className="px-1">
                        {'H'} {':'}
                      </span>
                      <InputNumber
                        name="editing_minute"
                        placeholder="MM"
                        value={values?.editing_minute}
                        className="mb-2"
                        onChange={e => {
                          setFieldValue('editing_minute', e?.value);
                        }}
                        useGrouping={false}
                        minFractionDigits={0}
                        min={0}
                      />
                      <span className="px-1">
                        {'M'} {':'}
                      </span>
                      <InputNumber
                        name="editing_second"
                        placeholder="SS"
                        value={values?.editing_second}
                        className="mb-2"
                        onChange={e => {
                          setFieldValue('editing_second', e?.value);
                        }}
                        useGrouping={false}
                        minFractionDigits={0}
                        min={0}
                      />
                      <span className="px-1">{'S'}</span>
                    </div>
                    {(touched?.editing_hour ||
                      touched?.editing_minute ||
                      touched?.editing_second) &&
                      (errors?.editing_hour ||
                        errors?.editing_minute ||
                        errors?.editing_second) && (
                        <p className="text-danger">
                          {errors?.editing_hour ||
                            errors?.editing_minute ||
                            errors?.editing_second}
                        </p>
                      )}
                  </div>
                </Col>
                <div className="form_group">
                  <label>Description</label>
                  {/* <Editor
                    name="remark"
                    value={values?.remark || ''}
                    onTextChange={e => setFieldValue('remark', e.textValue)}
                    style={{ height: '150px' }}
                  /> */}
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    name="remark"
                    style={{ height: '235px' }}
                    value={values?.remark}
                    onChange={content => setFieldValue('remark', content)}
                  />
                </div>
              </Row>
            </Col>
          </Row>
          <h3 className="mt10 mb20">
            Data Collection Details<span className="text-danger fs-6">*</span>
          </h3>
          <Row>
            <Col xl={3} md={6}>
              <div className="form_group mb-3">
                <MultiSelect
                  filter
                  value={values?.editing_inquiry}
                  name="editing_inquiry"
                  options={
                    dropdownDataCollectionOptionList?.editingItemOptionList
                  }
                  onChange={e => {
                    handleitemList(e.target.name, e.value, e);
                    // commonUpdateFieldValue(e.target.name, e.target.value);
                  }}
                  optionLabel="label"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionGroupTemplate={editingItemsTemplate}
                  placeholder="Select Editing Items"
                  className="w-100"
                  onBlur={handleBlur}
                  showSelectAll={false}
                />

                {touched?.editing_inquiry && errors?.editing_inquiry && (
                  <p className="text-danger">{errors?.editing_inquiry}</p>
                )}
              </div>
            </Col>
          </Row>
          <div className="data_table_wrapper border radius15 vertical_top max_height">
            <DataTable
              value={values?.editingTable}
              sortField="item_name"
              sortOrder={1}
              rows={10}
              // footerColumnGroup={footerGroup}
            >
              <Column field="item_name" header="Item" sortable></Column>
              <Column
                field="description"
                header="Description"
                sortable
                body={descriptionBodyTemplate}
              ></Column>
              {/* <Column
                field="data_collection_source"
                header="Data Collection Source"
                sortable
                body={DataCollectionTemplate}
              ></Column> */}
              <Column
                field="due_date"
                header="Due Date"
                sortable
                body={dueDateBodyTemplate}
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              {/* <Column
                field="data_size"
                header="Data Size (GB)"
                sortable
                body={dataSizeBodyTemplate}
              ></Column> */}
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="title_right_wrapper mt-3">
            <ul className="justify-content-end">
              <li>
                <Button onClick={handleCancel} className="btn_border_dark">
                  Exit Page
                </Button>
              </li>
              <li>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn_primary"
                >
                  {updateData ? 'Update' : 'Save'}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <CreateClientCompanyInInquiry
        createCompanyModal={createCompanyModal}
        setCreateCompanyModal={setCreateCompanyModal}
      />
    </div>
  );
}
