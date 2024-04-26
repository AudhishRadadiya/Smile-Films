import React, { useEffect, useState, useCallback } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanySidebar from '../CompanySidebar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../../Assets/Images/action.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { useFormik } from 'formik';
import { clientComapnySchema } from 'Schema/Setting/clientComapnySchema';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  addClientCompany,
  deleteClientCompany,
  editClientCompany,
  getClientCompanyList,
  setClientCompanyCurrentPage,
  setClientCompanyPageLimit,
  setIsAddClientCompany,
  setIsDeleteClientCompany,
  setIsUpdateClientCompany,
  setClientCompanySearchParam,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getReferenceList } from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { InputNumber } from 'primereact/inputnumber';
import { getFormattedDate } from 'Helper/CommonHelper';
import { Type } from 'Helper/CommonList';
import { InputTextarea } from 'primereact/inputtextarea';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';

export default function ClientCompany({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();

  const {
    clientCompanyList,
    clientCompanyCurrentPage,
    clientCompanyPageLimit,
    isAddClientCompany,
    isUpdateClientCompany,
    isDeleteClientCompany,
    clientCompanySearchParam,
    clientCompanyLoading,
  } = useSelector(({ clientCompany }) => clientCompany);
  const { countryLoading } = useSelector(({ country }) => country);
  const { stateLoading } = useSelector(({ state }) => state);
  const { cityLoading } = useSelector(({ city }) => city);
  const { currencyLoading } = useSelector(({ currency }) => currency);
  const { referenceLoading } = useSelector(({ references }) => references);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const [dropdownOptionList, setDropdownOptionList] = useState({
    countryList: [],
    referenceOptionList: [],
    currencyList: [],
    stateList: [],
    cityList: [],
    dropdownGroupList: [],

    // typeList: [],
    // companyList: [{ label: 'XYZ', value: '658be8bf970fab716b2348cd' }],
    // companyList: [],
  });

  const [editData, setEditData] = useState({});

  const clientCompanyData = {
    company_name: editData?.company_name || '',
    client_full_name: editData?.client_full_name || '',
    email_id: editData?.email_id || '',
    mobile_no: editData?.mobile_no || '',
    address: editData?.address || '',
    // company: editData?.company || '',
    country: editData?.country || '',
    state: editData?.state || '',
    city: editData?.city || '',
    pin_code: editData?.pin_code || '',
    reference: editData?.reference || '',
    type: editData?.type || '',
    currency: editData?.currency || '',
    opening_balance_type: editData?.opening_balance_type || 1,
    opening_balance: editData?.opening_balance || '',
    credits_limits: editData?.credits_limits || '',
    pay_due_date:
      (editData?.pay_due_date && new Date(editData?.pay_due_date)) || '',
    id: editData?._id || '',
    isActive: editData?.isActive || true,
  };
  useEffect(() => {
    dispatch(
      getClientCompanyList({
        start: clientCompanyCurrentPage,
        limit: clientCompanyPageLimit,
        isActive: '',
        search: clientCompanySearchParam,
      }),
    );
  }, [dispatch, clientCompanyCurrentPage, clientCompanyPageLimit]);

  useEffect(() => {
    if (isAddClientCompany || isUpdateClientCompany || isDeleteClientCompany) {
      dispatch(
        getClientCompanyList({
          start: clientCompanyCurrentPage,
          limit: clientCompanyPageLimit,
          isActive: '',
          search: clientCompanySearchParam,
        }),
      );
    }
    if (isUpdateClientCompany) {
      dispatch(setIsUpdateClientCompany(false));
    }
    if (isAddClientCompany) {
      dispatch(setIsAddClientCompany(false));
    }
    if (isDeleteClientCompany) {
      dispatch(setIsDeleteClientCompany(false));
    }
  }, [
    isAddClientCompany,
    isUpdateClientCompany,
    isDeleteClientCompany,
    dispatch,
    clientCompanyCurrentPage,
    clientCompanyPageLimit,
    clientCompanySearchParam,
  ]);

  // const getRequiredList = () => {
  //   dispatch(
  //     getCurrencyList({
  //       start: 0,
  //       limit: 0,
  //       isActive: true,
  //       search: '',
  //     }),
  //   )

  //   dispatch(
  //     getReferenceList({
  //       start: 0,
  //       limit: 0,
  //       isActive: true,
  //       search: '',
  //     }),
  //   );

  //   dispatch(
  //     getCountryList({
  //       start: 0,
  //       limit: 0,
  //       isActive: true,
  //       search: '',
  //     }),
  //   );
  // };

  const getRequiredList = () => {
    dispatch(
      getCountryList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    )
      .then(responseData => {
        const countyData = responseData?.payload;
        return { countyData };
      })
      .then(({ countyData }) => {
        dispatch(
          getDropdownGroupList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        ).then(response => {
          const groupData = response.payload?.data?.map(item => ({
            label: item?.group_name,
            value: item?._id,
          }));
          // let data = [
          //   { label: 'Package', items: [...countyDataOption] },
          //   { label: 'Product', items: [...productData] },
          // ];
          const groupOptionList = [{ label: 'Name', items: groupData }];
          setDropdownOptionList({
            ...dropdownOptionList,

            dropdownGroupList: groupOptionList,
          });
        });
      })
      .catch(error => {
        console.error('Error fetching group data:', error);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });

    dispatch(
      getCurrencyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    )
      .then(response => {
        const currencyData = response.payload?.data?.list?.map(item => {
          return { label: item?.currency_name, value: item?._id };
        });

        return { currencyData };
      })
      .then(({ currencyData }) => {
        dispatch(
          getReferenceList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        )
          .then(response => {
            const referenceData = response.payload?.data?.list?.map(item => {
              return { label: item?.reference_name, value: item?._id };
            });

            return { currencyData, referenceData };
          })
          .then(({ currencyData, referenceData }) => {
            dispatch(
              getCountryList({
                start: 0,
                limit: 0,
                isActive: true,
                search: '',
              }),
            )
              .then(response => {
                const countryData = response.payload?.data?.list?.map(item => {
                  return { label: item?.country, value: item?._id };
                });

                return { currencyData, referenceData, countryData };
              })
              .then(({ currencyData, referenceData, countryData }) => {
                dispatch(
                  getStateList({
                    start: 0,
                    limit: 0,
                    isActive: true,
                    search: '',
                  }),
                )
                  .then(response => {
                    const stateData = response.payload?.data?.list?.map(
                      item => {
                        return { label: item?.state, value: item?._id };
                      },
                    );

                    return {
                      currencyData,
                      referenceData,
                      countryData,
                      stateData,
                    };
                  })
                  .then(
                    ({
                      currencyData,
                      referenceData,
                      countryData,
                      stateData,
                    }) => {
                      dispatch(
                        getCityList({
                          start: 0,
                          limit: 0,
                          isActive: true,
                          search: '',
                        }),
                      )
                        .then(response => {
                          const cityData = response.payload?.data?.list?.map(
                            item => {
                              return { label: item?.city, value: item?._id };
                            },
                          );

                          setDropdownOptionList(prevState => ({
                            ...prevState,
                            cityList: cityData,
                            countryList: countryData,
                            stateList: stateData,
                            referenceOptionList: referenceData,
                            currencyList: currencyData,
                          }));
                        })
                        .catch(error => {
                          console.error('Error fetching city data:', error);
                        });
                    },
                  )
                  .catch(error => {
                    console.error('Error fetching state data:', error);
                  });
              })
              .catch(error => {
                console.error('Error fetching country data:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching reference data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching currency data:', error);
      });
  };

  // useEffect(() => {
  //   if (
  //     countryList?.list?.length > 0 &&
  //     referenceList?.list?.length > 0 &&
  //     currencyList?.list?.length > 0
  //   ) {
  //     const countyData = countryList?.list?.map(item => {
  //       return { label: item?.country, value: item?._id };
  //     });
  //     const referenceData = referenceList?.list?.map(item => {
  //       return { label: item?.reference_name, value: item?._id };
  //     });
  //     const currencyData = currencyList?.list?.map(item => {
  //       return { label: item?.currency_name, value: item?._id };
  //     });

  //     setDropdownOptionList({
  //       ...dropdownOptionList,
  //       countryList: countyData,
  //       referenceOptionList: referenceData,
  //       currencyList: currencyData,
  //     });
  //   }
  // }, [countryList, referenceList, currencyList]);

  const loadStateData = useCallback(
    async e => {
      const isSuccessState = await dispatch(
        getStateList({
          country_id: e,
          start: 0,
          limit: 0,
          isActive: true,
        }),
      );
      if (isSuccessState?.payload?.data?.list?.length) {
        const stateData = isSuccessState?.payload?.data?.list?.map(item => {
          return { label: item?.state, value: item?._id };
        });

        setDropdownOptionList({
          ...dropdownOptionList,
          stateList: stateData,
        });
      }
    },
    [dispatch, dropdownOptionList],
  );

  const submitHandle = useCallback(
    async values => {
      const { id, ...rest } = values;
      if (values?.id) {
        const payload = {
          ...rest,
          pay_due_date: getFormattedDate(rest?.pay_due_date),
          client_company_id: values?.id,
        };
        dispatch(editClientCompany(payload));
      } else {
        const payload = {
          ...rest,
          pay_due_date: getFormattedDate(rest?.pay_due_date),
        };
        dispatch(addClientCompany(payload));
      }
      setCreateCompanyModal(false);
    },
    [dispatch],
  );
  const {
    values,
    errors,
    touched,
    resetForm,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: clientCompanyData,
    validationSchema: clientComapnySchema,
    onSubmit: submitHandle,
  });

  const loadCityData = useCallback(
    async e => {
      const isSuccessCity = await dispatch(
        getCityList({
          country_id: values?.country,
          state_id: e,
          start: 0,
          limit: 0,
          isActive: true,
        }),
      );

      if (isSuccessCity?.payload?.data?.list?.length) {
        const cityData = isSuccessCity?.payload?.data?.list?.map(item => {
          return { label: item?.city, value: item?._id };
        });

        setDropdownOptionList({
          ...dropdownOptionList,
          cityList: cityData,
        });
      }
    },
    [dispatch, dropdownOptionList, values?.country],
  );

  const actionBodyTemplate = row => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="action_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item
                onClick={() => {
                  getRequiredList();
                  setEditData(row);
                  setCreateCompanyModal(true);
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeleteId(row?._id);
                  setDeletePopup(true);
                }}
              >
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const statusBodyTemplate = product => {
    return (
      <Tag
        value={product.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(product)}
      ></Tag>
    );
  };

  const getSeverity = product => {
    switch (product.isActive) {
      case true:
        return 'active';

      case false:
        return 'inactive';

      default:
        return null;
    }
  };

  const groupLableTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const companyNameBodyTemplate = data => {
    return (
      <Link to="/company-profile" className="hover_text">
        {data?.company_name}
      </Link>
    );
  };

  const addressBodyTemplate = data => {
    return <p className="address_wrapper">{data?.address}</p>;
  };

  const onPageChange = page => {
    let pageIndex = clientCompanyCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setClientCompanyCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setClientCompanyCurrentPage(page === 0 ? 0 : 1));
    dispatch(setClientCompanyPageLimit(page));
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      client_company_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteClientCompany(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const onCancel = useCallback(() => {
    resetForm();
    setCreateCompanyModal(false);
  }, [resetForm]);

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Checkbox
          inputId="ingredient1"
          name="isActive"
          value={values?.isActive}
          onBlur={handleBlur}
          onChange={handleChange}
          checked={values?.isActive}
          required
        />
        {touched?.isActive && errors?.isActive && (
          <p className="text-danger">{errors?.isActive}</p>
        )}
        <label htmlFor="ingredient1" className="ms-2">
          Active
        </label>
      </div>
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setClientCompanyCurrentPage(1));
    dispatch(
      getClientCompanyList({
        start: 1,
        limit: clientCompanyPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {(clientCompanyLoading ||
        countryLoading ||
        stateLoading ||
        cityLoading ||
        currencyLoading ||
        referenceLoading) && <Loader />}

      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col md={5}>
                  <div className="page_title">
                    <h3 className="m-0">Client Company</h3>
                  </div>
                </Col>
                <Col md={7}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={clientCompanySearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(
                                setClientCompanySearchParam(e.target.value),
                              );
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setEditData({});
                              getRequiredList();
                              setCreateCompanyModal(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Client
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper client_company_wrap">
              <DataTable
                value={clientCompanyList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="company_name"
                  header="Company Name"
                  sortable
                  body={companyNameBodyTemplate}
                ></Column>
                <Column
                  field="client_full_name"
                  header="Client Name"
                  sortable
                ></Column>
                <Column field="email_id" header="Email" sortable></Column>
                <Column field="mobile_no" header="Phone No" sortable></Column>
                <Column
                  field="address"
                  header="Address"
                  body={addressBodyTemplate}
                  sortable
                ></Column>
                <Column
                  field="receivables"
                  header="Receivables"
                  sortable
                ></Column>
                <Column
                  field="unused_credits"
                  header="Unused Credits"
                  sortable
                ></Column>
                <Column
                  field="isActive"
                  header="Status"
                  sortable
                  body={statusBodyTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={clientCompanyList?.list}
                pageLimit={clientCompanyPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={clientCompanyCurrentPage}
                totalCount={clientCompanyList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />

      <Dialog
        header="Create Client Company"
        visible={createCompanyModal}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={onCancel}
        footer={footerContent}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="create_client_company_wrap">
            <Row>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="company_name">Company</label>
                  <InputText
                    id="company_name"
                    placeholder="Write Company"
                    className="input_wrap"
                    name="company_name"
                    value={values?.company_name || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched?.company_name && errors?.company_name && (
                    <p className="text-danger">{errors?.company_name}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="client_full_name">Client Full Name</label>
                  <InputText
                    id="client_full_name"
                    placeholder="Write Name"
                    className="input_wrap"
                    name="client_full_name"
                    value={values?.client_full_name || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched?.client_full_name && errors?.client_full_name && (
                    <p className="text-danger">{errors?.client_full_name}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="email_id">Email Address</label>
                  <InputText
                    id="email_id"
                    placeholder="Write email address"
                    className="input_wrap"
                    name="email_id"
                    value={values?.email_id || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />

                  {touched?.email_id && errors?.email_id && (
                    <p className="text-danger">{errors?.email_id}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="mobile_no">Phone Number</label>
                  <InputText
                    id="mobile_no"
                    placeholder="Write number"
                    className="input_wrap"
                    name="mobile_no"
                    value={values?.mobile_no || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched?.mobile_no && errors?.mobile_no && (
                    <p className="text-danger">{errors?.mobile_no}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="address">Address</label>

                  <InputTextarea
                    id="address"
                    rows={1}
                    placeholder="Write address"
                    className="input_wrap"
                    name="address"
                    value={values?.address || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched?.address && errors?.address && (
                    <p className="text-danger">{errors?.address}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label>Group Name</label>
                  <ReactSelectSingle
                    filter
                    value={values?.group_name}
                    options={dropdownOptionList?.dropdownGroupList}
                    name="group_name"
                    onChange={e => setFieldValue('group_name', e.value)}
                    optionLabel="label"
                    optionGroupLabel="label"
                    placeholder="Group Name"
                    optionGroupChildren="items"
                    optionGroupTemplate={groupLableTemplate}
                    className="w-100"
                  />
                  {touched?.group_name &&
                    errors?.group_name &&
                    !values?.group_name && (
                      <p className="text-danger">{errors?.group_name}</p>
                    )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="country">Country</label>
                  <ReactSelectSingle
                    filter
                    id="country"
                    options={dropdownOptionList?.countryList}
                    value={values?.country || ''}
                    name="country"
                    onChange={e => {
                      setFieldValue('country', e.value);
                      loadStateData(e.value);
                    }}
                    placeholder="Select Country"
                  />
                  {touched?.country && errors?.country && (
                    <p className="text-danger">{errors?.country}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="state">State</label>
                  <ReactSelectSingle
                    filter
                    id="state"
                    options={dropdownOptionList?.stateList}
                    value={values?.state || ''}
                    name="state"
                    onChange={e => {
                      setFieldValue('state', e.value);
                      loadCityData(e.value);
                    }}
                    placeholder="Select State"
                  />
                  {touched?.state && errors?.state && (
                    <p className="text-danger">{errors?.state}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="city">City</label>
                  <ReactSelectSingle
                    filter
                    id="city"
                    options={dropdownOptionList?.cityList}
                    value={values?.city || ''}
                    name="city"
                    onChange={e => {
                      setFieldValue('city', e.value);
                    }}
                    placeholder="Select City"
                  />
                  {touched?.city && errors?.city && (
                    <p className="text-danger">{errors?.city}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="pin_code">Pin code</label>
                  <InputNumber
                    id="pin_code"
                    placeholder="Write Pin code"
                    useGrouping={false}
                    name="pin_code"
                    value={values?.pin_code || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('pin_code', e.value);
                    }}
                  />
                  {touched?.pin_code && errors?.pin_code && (
                    <p className="text-danger">{errors?.pin_code}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="reference">Reference</label>
                  <ReactSelectSingle
                    filter
                    id="reference"
                    options={dropdownOptionList?.referenceOptionList}
                    value={values?.reference || ''}
                    name="reference"
                    onChange={e => {
                      setFieldValue('reference', e.value);
                    }}
                    placeholder="Select Reference"
                  />
                  {touched?.reference && errors?.reference && (
                    <p className="text-danger">{errors?.reference}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="type">Type</label>
                  <ReactSelectSingle
                    filter
                    id="type"
                    options={Type}
                    value={values?.type || ''}
                    name="type"
                    onChange={e => {
                      setFieldValue('type', e.value);
                    }}
                    placeholder="Select Type"
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="currency">Currency</label>
                  <ReactSelectSingle
                    filter
                    id="currency"
                    options={dropdownOptionList?.currencyList}
                    value={values?.currency || ''}
                    name="currency"
                    onChange={e => {
                      setFieldValue('currency', e.value);
                    }}
                    placeholder="Select Currency"
                  />
                  {touched?.currency && errors?.currency && (
                    <p className="text-danger">{errors?.currency}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <div className="opn_balance_wrap d-flex justify-content-between mb10">
                    <label htmlFor="OpeningBalance">Opening Balance</label>
                    <div className="radio_wrapper d-flex align-items-center">
                      <div className="radio-inner-wrap d-flex align-items-center me-2">
                        <RadioButton
                          inputId="Credits"
                          name="opening_balance_type"
                          value={1}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values?.opening_balance_type === 1}
                        />
                        <label htmlFor="Credits" className="ms-md-2 ms-1">
                          Credits
                        </label>
                      </div>
                      <div className="radio-inner-wrap d-flex align-items-center">
                        <RadioButton
                          inputId="Debits"
                          name="opening_balance_type"
                          value={2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values?.opening_balance_type === 2}
                        />
                        <label htmlFor="Debits" className="ms-md-2 ms-1">
                          Debits
                        </label>
                      </div>
                    </div>
                  </div>
                  <InputNumber
                    id="opening_balance"
                    placeholder="Write opening Balance"
                    name="opening_balance"
                    useGrouping={false}
                    value={values?.opening_balance || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('opening_balance', e.value);
                    }}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="credits_limits">Credits Limits</label>
                  <InputNumber
                    id="credits_limits"
                    placeholder="Write Credits Limits"
                    name="credits_limits"
                    useGrouping={false}
                    value={values?.credits_limits || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('credits_limits', e.value);
                    }}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="pay_due_date">Pay Due Date</label>
                  <Calendar
                    id="pay_due_date"
                    placeholder="Write Credits Limits"
                    showIcon
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    value={values?.pay_due_date || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    showButtonBar
                  />
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
