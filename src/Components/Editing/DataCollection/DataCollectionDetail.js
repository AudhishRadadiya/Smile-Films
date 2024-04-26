import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import {
  getClientCompany,
  getClientCompanyList,
  setIsAddClientCompany,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getReferenceList } from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getInquiryNo } from 'Store/Reducers/ActivityOverview/inquirySlice';
import { useFormik } from 'formik';
import moment from 'moment';
import {
  addDataCollection,
  clearAddSelectedDataCollectionData,
  clearUpdateSelectedDataCollectionData,
  editDataCollection,
  setAddSelectedDataCollectionData,
  setIsGetInintialValuesDataCollection,
  setUpdateSelectedDataCollectionData,
} from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import CreateClientCompanyInInquiry from 'Components/ActivityOverview/CreateClientCompanyInInquiry';
import { getProjectTypeList } from 'Store/Reducers/Settings/Master/ProjectTypeSlice';
import { Calendar } from 'primereact/calendar';
import { totalCount } from 'Helper/CommonHelper';
import { dataCollectionSchema } from 'Schema/Editing/dataCollectionSchema';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { InputNumber } from 'primereact/inputnumber';
import { toast } from 'react-toastify';
import { getDevicesList } from 'Store/Reducers/Settings/Master/DevicesSlice';

export const JornalEntryData = [
  {
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    due_date: '27/06/2023',
    quantity: '1',
    data_size: '280 GB',
  },
];

export default function DataCollectionDetail({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const [
    dropdownDataCollectionOptionList,
    setDropdownDataCollectionOptionList,
  ] = useState({
    editingItemOptionList: [],
    clientCompanyOptionList: [],
    projectTypeOptionList: [],
    DataCollectionList: [],
  });

  const { isAddClientCompany, clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { countryLoading } = useSelector(({ country }) => country);
  const { currencyLoading } = useSelector(({ currency }) => currency);
  const { referenceLoading } = useSelector(({ references }) => references);
  const { packageLoading } = useSelector(({ packages }) => packages);
  const { productLoading } = useSelector(({ product }) => product);
  const { devicesLoading } = useSelector(({ devices }) => devices);
  const {
    dataCollectionLoading,
    addSelectedDataCollectionData,
    updateSelectedDataCollectionData,
    isGetInintialValuesDataCollection,
  } = useSelector(({ dataCollection }) => dataCollection);

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
    if (!id) {
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
            const projectTypeData = response.payload?.data?.list?.map(item => ({
              ...item,
              label: item?.project_type,
              value: item?._id,
            }));

            return { companyData, projectTypeData };
          })
          .then(({ companyData, projectTypeData }) => {
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

                return { companyData, projectTypeData, packageData };
              })
              .then(({ companyData, projectTypeData, packageData }) => {
                dispatch(
                  getProductList({
                    start: 0,
                    limit: 0,
                    isActive: true,
                    search: '',
                  }),
                )
                  .then(response => {
                    const productData = response.payload?.data?.list?.map(
                      item => ({
                        ...item,
                        label: item?.item_name,
                        value: item?._id,
                        isPackage: false,
                      }),
                    );
                    let data = [
                      { label: 'Package', items: [...packageData] },
                      { label: 'Product', items: [...productData] },
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
          data_collection_source: [],
          data_size: '',
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: 1,
          due_date: '',
          description: data?.item_description,
          data_collection_source: [],
          data_size: '',
        };
      }
      editingList = [...values?.editingTable, newObj];
    } else {
      editingList = values?.editingTable?.filter(
        item => item?.item_id !== data?._id,
      );
    }
    let totalDataCollection = totalCount(editingList, 'data_size');
    setFieldValue('total_data_collection', totalDataCollection);
    setFieldValue('editingTable', editingList);

    if (id) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          total_data_collection: totalDataCollection,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          total_data_collection: totalDataCollection,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleEditingTableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = editingList[index];
    let totalDataCollection = 0;
    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) editingList[index] = updatedObj;
    if (fieldName === 'data_size') {
      totalDataCollection = totalCount(editingList, 'data_size');
      setFieldValue('total_data_collection', totalDataCollection);
    }
    setFieldValue('editingTable', editingList);
    if (id) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          ...(fieldName === 'data_size' && {
            total_data_collection: totalDataCollection,
          }),
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          [fieldName]: fieldValue,
          editingTable: editingList,
          ...(fieldName === 'data_size' && {
            total_data_collection: totalDataCollection,
          }),
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

  const DataCollectionTemplate = data => {
    return (
      <div className="form_group d-flex">
        <MultiSelect
          value={data?.data_collection_source}
          options={dropdownDataCollectionOptionList?.DataCollectionList}
          name="data_collection_source"
          onChange={e => {
            handleEditingTableChange(data, e.target.name, e.target.value);
          }}
          placeholder="Data Collection Source"
          className="w-100 me-2"
          showSelectAll={false}
          maxSelectedLabels={1}
        />
      </div>
    );
  };

  const dataSizeBodyTemplate = data => {
    return (
      <div className="form_group d-flex">
        {/* <InputText
          id="Data Size"
          placeholder="Data size"
          name="data_size"
          useGrouping={false}
          value={data?.data_size}
          onChange={e => {
            handleEditingTableChange(data, e.target.name, e.target.value);
          }}
          required
        /> */}
        <InputNumber
          id="Data Size"
          placeholder="Data size"
          name="data_size"
          className="max_100"
          useGrouping={false}
          maxFractionDigits={2}
          value={data?.data_size}
          onBlur={handleBlur}
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
            const utcDate = new Date(e.value);
            handleEditingTableChange(data, e.target.name, utcDate);
          }}
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
    // return (
    //   <div className="max_500">
    //     <p>{data?.description}</p>
    //   </div>
    // );
    return (
      <div
        className="max_700 editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data?.description }}
      />
    );
  };

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
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

  const submitHandle = useCallback(async values => {
    const isDataCollectionSource = values?.editingTable?.some(item => {
      return item?.data_collection_source.length === 0;
    });

    const isDueDate = values?.editingTable?.some(item => {
      return !item?.due_date;
    });

    const isDataSize = values?.editingTable?.some(item => {
      return !item?.data_size;
    });

    if (!isDataCollectionSource && !isDataSize && !isDueDate) {
      if (id) {
        let updatedList = values?.editingTable?.map(d => {
          return {
            ...d,
            orderItems_id: d?._id,
          };
        });
        let payload = {
          order_id: id,
          create_date: values?.create_date
            ? moment(values?.create_date).format('YYYY-MM-DD')
            : '',
          client_company_id: values?.client_company_id,
          remark: values?.remark,
          couple_name: values?.couple_name,
          project_type: values?.project_type,
          data_collection: updatedList,
        };
        dispatch(editDataCollection(payload));
        dispatch(
          setIsGetInintialValuesDataCollection({
            ...isGetInintialValuesDataCollection,
            update: false,
          }),
        );
        dispatch(clearUpdateSelectedDataCollectionData());
      } else {
        let payload = {
          inquiry_no: values?.inquiry_no,
          create_date: values?.create_date
            ? moment(values?.create_date).format('YYYY-MM-DD')
            : '',
          client_company_id: values?.client_company_id,
          remark: values?.remark,
          couple_name: values?.couple_name,
          project_type: values?.project_type,
          data_collection: values?.editingTable,
        };
        dispatch(addDataCollection(payload));
        dispatch(
          setIsGetInintialValuesDataCollection({
            ...isGetInintialValuesDataCollection,
            add: false,
          }),
        );
        dispatch(clearAddSelectedDataCollectionData());
      }
      navigate('/data-collection');
    } else {
      toast.error('Data Collection Details Are Required');
    }
  }, []);

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: dataCollectionSchema,
      onSubmit: submitHandle,
    });
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-start" footer="Total Data Collection" />
        <Column
          className="text-end"
          footer={`${values?.total_data_collection} GB`}
          colSpan={5}
        />
      </Row>
    </ColumnGroup>
  );

  const handleDeleteEditingItem = item => {
    let dummyList = values?.editingTable.filter(
      d => d?.item_id !== item?.item_id,
    );
    const totalDataCollection = totalCount(dummyList, 'data_size');
    setFieldValue('total_data_collection', totalDataCollection);
    setFieldValue('editingTable', dummyList);
    let itemData = values?.editing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('editing_inquiry', itemData);
    if (id) {
      dispatch(
        setUpdateSelectedDataCollectionData({
          ...updateSelectedDataCollectionData,
          editingTable: dummyList,
          editing_inquiry: itemData,
          total_data_collection: totalDataCollection,
        }),
      );
    } else {
      dispatch(
        setAddSelectedDataCollectionData({
          ...addSelectedDataCollectionData,
          editingTable: dummyList,
          editing_inquiry: itemData,
          total_data_collection: totalDataCollection,
        }),
      );
    }
  };

  const handleCancel = () => {
    if (id) {
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
        dataCollectionLoading) && <Loader />}
      <div className="add_data_collection_wrap bg-white radius15 border">
        <div className="px20 py15 border-bottom">
          <Row className="align-items-center gy-3">
            <Col sm={6}>
              <h2 className="m-0">Data Collection</h2>
            </Col>
            <Col sm={6}>
              <div className="title_right_wrapper">
                <ul>
                  <li>
                    <Button onClick={handleCancel} className="btn_border_dark">
                      Exit Page
                    </Button>
                  </li>
                  <li>
                    <Button onClick={handleSubmit} className="btn_primary">
                      Save
                    </Button>
                  </li>
                </ul>
              </div>
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
                    <h4>{moment(values.create_date)?.format('YYYY-MM-DD')}</h4>
                    {touched?.create_date && errors?.create_date && (
                      <p className="text-danger">{errors?.create_date}</p>
                    )}
                  </li>
                  {id && (
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
                    <label>Company</label>
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
                    {!id && (
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
                      placeholder="Enter Name"
                      className="input_wrap"
                      name="client_full_name"
                      value={values?.client_full_name}
                      disabled
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="CoupleName">Couple Name</label>
                    <InputText
                      id="CoupleName"
                      placeholder="Enter Name"
                      className="input_wrap"
                      name="couple_name"
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
              </Row>
            </Col>
            <Col lg={6}>
              <Row>
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <label>Project Type</label>
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
                  </div>
                </Col>
                <div className="form_group">
                  <label>Remark</label>
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
          <h3 className="mt10 mb20">Data Collection Details</h3>
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
              footerColumnGroup={footerGroup}
            >
              <Column
                field="item_name"
                header="Item"
                sortable
                // body={ItemsBodyTemplate}
              ></Column>
              <Column
                field="description"
                header="Description"
                sortable
                body={descriptionBodyTemplate}
              ></Column>
              <Column
                field="data_collection_source"
                header="Data Collection Source"
                sortable
                body={DataCollectionTemplate}
              ></Column>
              <Column
                field="due_date"
                header="Due Date"
                sortable
                body={dueDateBodyTemplate}
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column
                field="data_size"
                header="Data Size (GB)"
                sortable
                body={dataSizeBodyTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
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
