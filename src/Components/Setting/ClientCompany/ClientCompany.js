import React, { useEffect, useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Tag } from 'primereact/tag';
import { Type } from 'Helper/CommonList';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import CompanySidebar from '../CompanySidebar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { RadioButton } from 'primereact/radiobutton';
import { Col, Row } from 'react-bootstrap';
import { InputNumber } from 'primereact/inputnumber';
import { generateUniqueId } from 'Helper/CommonHelper';
import { useDispatch, useSelector } from 'react-redux';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { InputTextarea } from 'primereact/inputtextarea';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { clientCompanySchema } from 'Schema/Setting/clientComapnySchema';
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
  setSelectCountry,
  setSelectState,
} from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import {
  getStateList,
  setStateList,
} from 'Store/Reducers/Settings/Master/StateSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { getReferenceList } from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';

const clientCompanyInitialData = {
  company_name: '',
  client_full_name: '',
  email_id: '',
  mobile_no: [
    {
      mobile_no: '',
      unique_id: generateUniqueId(),
    },
  ],
  address: '',
  group_name: '',
  country: '',
  state: '',
  city: '',
  pin_code: '',
  reference: '',
  type: '',
  currency: '',
  opening_balance_type: 1,
  opening_balance: '',
  credits_limits: '',
  pay_due_day: '',
  id: '',
  isActive: true,
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

export default function ClientCompany({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectState,
    selectCountry,
    clientCompanyList,
    clientCompanyCurrentPage,
    clientCompanyPageLimit,
    isAddClientCompany,
    isUpdateClientCompany,
    isDeleteClientCompany,
    clientCompanySearchParam,
    clientCompanyLoading,
  } = useSelector(({ clientCompany }) => clientCompany);
  const { groupLoading } = useSelector(({ group }) => group);

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const { stateLoading } = useSelector(({ state }) => state);
  const { countryLoading } = useSelector(({ country }) => country);
  const [editData, setEditData] = useState(clientCompanyInitialData);
  const { currencyLoading } = useSelector(({ currency }) => currency);
  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const { referenceLoading } = useSelector(({ references }) => references);
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
  const { cityLoading } = useSelector(({ city }) => city);
  const { countryList } = useSelector(({ country }) => country);
  const { stateList } = useSelector(({ state }) => state);

  const getClientCompanyListApi = useCallback(
    (start = 1, limit = 10, search = '', country_id = '', state_id = '') => {
      dispatch(
        getClientCompanyList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
          type: 3,
          country_id: country_id,
          state_id: state_id,
        }),
      );
    },
    [dispatch],
  );

  const getCountryListApi = useCallback(async () => {
    return dispatch(
      getCountryList({
        start: 0,
        limit: 0,
        isActive: true,
      }),
    );
  }, [dispatch]);

  const getStateListApi = useCallback(
    (countryId = '', start = 0, limit = 0, search = '') => {
      return dispatch(
        getStateList({
          country_id: countryId,
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getClientCompanyListApi(
      clientCompanyCurrentPage,
      clientCompanyPageLimit,
      clientCompanySearchParam,
      selectState,
      selectCountry,
    );
    getCountryListApi();
  }, []);

  useEffect(() => {
    if (isAddClientCompany || isUpdateClientCompany || isDeleteClientCompany) {
      getClientCompanyListApi(
        clientCompanyCurrentPage,
        clientCompanyPageLimit,
        clientCompanySearchParam,
      );
      setEditData(clientCompanyInitialData);
      setCreateCompanyModal(false);
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
    dispatch,
    isAddClientCompany,
    isUpdateClientCompany,
    isDeleteClientCompany,
  ]);

  const countryOptions = useMemo(() => {
    let countryData = [];
    if (countryList?.list?.length > 0) {
      countryData = countryList.list.map(item => {
        return {
          label: item.country,
          value: item._id,
        };
      });
    }

    return [{ label: 'All', value: '' }, ...countryData];
  }, [countryList]);

  const stateOptions = useMemo(() => {
    let stateData = [];

    if (stateList?.list?.length > 0) {
      stateData = stateList.list.map(item => {
        return {
          label: item.state,
          value: item._id,
        };
      });
    }

    const modified = !!stateData?.length
      ? [{ label: 'All', value: '' }, ...stateData]
      : stateData;

    return modified;
  }, [stateList]);

  const getRequiredList = async editedClientData => {
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
                  getDropdownGroupList({
                    start: 0,
                    limit: 0,
                    isActive: true,
                    search: '',
                  }),
                )
                  .then(response => {
                    const groupData = response.payload?.map(item => ({
                      label: item?.group_name,
                      value: item?._id,
                    }));

                    return {
                      currencyData,
                      referenceData,
                      countryData,
                      groupData,
                    };
                  })
                  .then(
                    async ({
                      currencyData,
                      referenceData,
                      countryData,
                      groupData,
                    }) => {
                      let stateData = [];
                      let cityData = [];

                      if (editedClientData?.country) {
                        const isSuccessState = await dispatch(
                          getStateList({
                            country_id: editedClientData?.country,
                            start: 0,
                            limit: 0,
                            isActive: true,
                          }),
                        );

                        const isSuccessCity = await dispatch(
                          getCityList({
                            country_id: editedClientData?.country,
                            state_id: editedClientData?.state,
                            start: 0,
                            limit: 0,
                            isActive: true,
                          }),
                        );

                        stateData = isSuccessState.payload?.data?.list?.map(
                          item => ({
                            label: item?.state,
                            value: item?._id,
                          }),
                        );

                        cityData = isSuccessCity.payload?.data?.list?.map(
                          item => ({
                            label: item?.city,
                            value: item?._id,
                          }),
                        );
                      }

                      setDropdownOptionList(prevState => ({
                        ...prevState,
                        cityList: cityData,
                        stateList: stateData,
                        countryList: countryData,
                        currencyList: currencyData,
                        dropdownGroupList: groupData,
                        referenceOptionList: referenceData,
                      }));
                    },
                  )
                  .catch(error => {
                    console.error('Error fetching group data:', error);
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

  const submitHandle = useCallback(
    (values, { resetForm }) => {
      const { id, ...rest } = values;

      const updatedMobileNumbers = values?.mobile_no?.map(mobileNumber => {
        return mobileNumber?.mobile_no;
      });

      const payload = {
        ...rest,
        ...(id && { client_company_id: values?.id }),
        mobile_no: updatedMobileNumbers,
        email_id: values?.email_id?.trim(),
      };

      if (id) {
        dispatch(editClientCompany(payload));
      } else {
        dispatch(addClientCompany(payload));
      }
      resetForm();
      setEditData(clientCompanyInitialData);
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: editData,
    validationSchema: clientCompanySchema,
    onSubmit: submitHandle,
  });

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
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle
      //       id="dropdown-basic"
      //       className="action_btn"
      //       disabled={is_edit_access || is_delete_access ? false : true}
      //     >
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       {is_edit_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             const updatedMobileNumbers = row?.mobile_no?.map(
      //               mobileNumber => {
      //                 return {
      //                   mobile_no: mobileNumber,
      //                   unique_id: generateUniqueId(),
      //                 };
      //               },
      //             );

      //             const editedData = {
      //               ...clientCompanyInitialData,
      //               ...row,
      //               id: row?._id,
      //               mobile_no: updatedMobileNumbers,
      //             };
      //             getRequiredList(editedData);
      //             setEditData(editedData);
      //             setCreateCompanyModal(true);
      //           }}
      //         >
      //           <img src={EditIcon} alt="EditIcon" /> Edit
      //         </Dropdown.Item>
      //       )}
      //       {is_delete_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             setDeleteId(row?._id);
      //             setDeletePopup(true);
      //           }}
      //         >
      //           <img src={TrashIcon} alt="TrashIcon" /> Delete
      //         </Dropdown.Item>
      //       )}
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        {is_edit_access && (
          <img
            alt=""
            src={EditIcon}
            className="cursor_pointer"
            onClick={() => {
              const updatedMobileNumbers = row?.mobile_no?.map(mobileNumber => {
                return {
                  mobile_no: mobileNumber,
                  unique_id: generateUniqueId(),
                };
              });

              const editedData = {
                ...clientCompanyInitialData,
                ...row,
                id: row?._id,
                mobile_no: updatedMobileNumbers,
              };
              getRequiredList(editedData);
              setEditData(editedData);
              setCreateCompanyModal(true);
            }}
          />
        )}
        {is_delete_access && (
          <img
            src={TrashIcon}
            alt=""
            className="cursor_pointer"
            onClick={() => {
              setDeleteId(row?._id);
              setDeletePopup(true);
            }}
          />
        )}
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

  const currentClientBalanceBodyTemplate = rowData => {
    return (
      <span>
        {`${Math.abs(rowData?.current_balance) || 0} ${
          rowData?.current_balance > 0 ? 'CR' : 'DB'
        }`}
      </span>
    );
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
      <div
        className="hover_text"
        onClick={() => navigate(`/company-profile/${data?._id}`)}
      >
        {data?.company_name}
      </div>
    );
  };

  const mobileNoTemplate = rowData => {
    const mobileNumber = rowData?.mobile_no?.join(', ');
    return <span>{mobileNumber}</span>;
  };

  const addressBodyTemplate = data => {
    return <p className="address_wrapper">{data?.address}</p>;
  };

  const onPageChange = page => {
    if (page !== clientCompanyCurrentPage) {
      let pageIndex = clientCompanyCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setClientCompanyCurrentPage(pageIndex));
      getClientCompanyListApi(
        pageIndex,
        clientCompanyPageLimit,
        clientCompanySearchParam,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setClientCompanyCurrentPage(page === 0 ? 0 : 1));
    dispatch(setClientCompanyPageLimit(page));
    const pageValue =
      page === 0
        ? clientCompanyList?.totalRows
          ? clientCompanyList?.totalRows
          : 0
        : page;
    const prevPageValue =
      clientCompanyPageLimit === 0
        ? clientCompanyList?.totalRows
          ? clientCompanyList?.totalRows
          : 0
        : clientCompanyPageLimit;
    if (
      prevPageValue < clientCompanyList?.totalRows ||
      pageValue < clientCompanyList?.totalRows
    ) {
      getClientCompanyListApi(
        page === 0 ? 0 : 1,
        page,
        clientCompanySearchParam,
      );
    }
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
    setEditData(clientCompanyInitialData);
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
        <Button type="submit" className="btn_primary" onClick={handleSubmit}>
          {editData?.id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setClientCompanyCurrentPage(1));
    getClientCompanyListApi(1, clientCompanyPageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleSelectCountry = useCallback(
    data => {
      dispatch(setSelectState(''));
      dispatch(setSelectCountry(data));
      const country = data ? data : '';

      if (data) {
        getStateListApi(data);
      } else {
        dispatch(
          setStateList({
            ...stateList,
            list: [],
          }),
        );
      }

      getClientCompanyListApi(
        clientCompanyCurrentPage,
        clientCompanyPageLimit,
        clientCompanySearchParam,
        country,
        '',
      );
    },
    [
      dispatch,
      stateList,
      clientCompanyPageLimit,
      clientCompanyCurrentPage,
      clientCompanySearchParam,
    ],
  );

  const handleSelectState = useCallback(
    data => {
      dispatch(setSelectState(data));

      getClientCompanyListApi(
        clientCompanyCurrentPage,
        clientCompanyPageLimit,
        clientCompanySearchParam,
        selectCountry,
        data === 'All' ? '' : data,
      );
    },
    [
      dispatch,
      selectCountry,
      clientCompanyPageLimit,
      clientCompanyCurrentPage,
      clientCompanySearchParam,
    ],
  );

  return (
    <div className="main_Wrapper">
      {(cityLoading ||
        groupLoading ||
        stateLoading ||
        countryLoading ||
        currencyLoading ||
        referenceLoading ||
        clientCompanyLoading) && <Loader />}
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
                        <ReactSelectSingle
                          filter
                          value={selectCountry}
                          options={countryOptions}
                          onBlur={handleBlur}
                          onChange={e => handleSelectCountry(e.value)}
                          placeholder="Select Country"
                        />
                      </li>
                      <li>
                        <ReactSelectSingle
                          filter
                          value={selectState}
                          options={stateOptions}
                          onBlur={handleBlur}
                          onChange={e => handleSelectState(e.value)}
                          placeholder="Select State"
                        />
                      </li>

                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            type="search"
                            placeholder="Search"
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
                              setEditData({
                                ...clientCompanyInitialData,
                                mobile_no: [
                                  {
                                    mobile_no: '',
                                    unique_id: generateUniqueId(),
                                  },
                                ],
                              });
                              getRequiredList(clientCompanyInitialData);
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
                <Column
                  field="mobile_no"
                  header="Phone No"
                  sortable
                  body={mobileNoTemplate}
                ></Column>
                <Column
                  field="address"
                  header="Address"
                  body={addressBodyTemplate}
                  sortable
                ></Column>
                {/* <Column
                  field="receivables"
                  header="Receivables"
                  sortable
                ></Column>
                <Column
                  field="unused_credits"
                  header="Unused Credits"
                  sortable
                ></Column> */}
                <Column
                  field="current_balance"
                  header="Current Client Balance"
                  sortable
                  body={currentClientBalanceBodyTemplate}
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
        moduleName={'client company'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />

      <Dialog
        header={
          editData?.id ? 'Update Client Company' : 'Create Client Company'
        }
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
                  <label htmlFor="company_name">
                    Company <span className="text-danger fs-6">*</span>
                  </label>
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
                  <label htmlFor="client_full_name">
                    Client Full Name <span className="text-danger fs-6">*</span>
                  </label>
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
                  <label htmlFor="email_id">
                    Email Address <span className="text-danger fs-6">*</span>
                  </label>
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
              {values?.mobile_no?.length > 0 &&
                values?.mobile_no?.map((item, index) => {
                  return (
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <span>Phone Number {index + 1} </span>
                            <span className="text-danger fs-6">*</span>
                          </div>
                          <div>
                            {index === 0 && values?.mobile_no?.length < 3 && (
                              <Button
                                className="btn_transparent text_primary btn_right add_btn"
                                onClick={e => {
                                  e.preventDefault();
                                  if (values?.mobile_no?.length < 3) {
                                    setFieldValue('mobile_no', [
                                      ...values?.mobile_no,
                                      {
                                        unique_id: generateUniqueId(),
                                        mobile_no: '',
                                      },
                                    ]);
                                  }
                                }}
                              >
                                ADD
                                <img src={PlusIcon} alt="PlusIcon" />
                              </Button>
                            )}
                            {index > 0 && (
                              <Button
                                className="btn_transparent add_btn"
                                onClick={() => {
                                  const updatedData = values?.mobile_no?.filter(
                                    value =>
                                      value?.unique_id !== item?.unique_id,
                                  );
                                  setFieldValue('mobile_no', updatedData);
                                }}
                              >
                                <img src={TrashIcon} alt="TrashIcon" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <InputText
                          placeholder="Write number"
                          className="input_wrap"
                          name={`mobile_no[${index}].mobile_no`}
                          value={item?.mobile_no || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors?.mobile_no?.length &&
                          touched?.mobile_no?.length &&
                          touched?.mobile_no[index]?.mobile_no &&
                          errors?.mobile_no[index]?.mobile_no && (
                            <p className="text-danger">
                              {errors?.mobile_no[index]?.mobile_no}
                            </p>
                          )}
                      </div>
                    </Col>
                  );
                })}
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="address">Address</label>
                  <InputTextarea
                    rows={1}
                    id="address"
                    name="address"
                    className="input_wrap"
                    placeholder="Write address"
                    value={values?.address || ''}
                    onChange={handleChange}
                  />
                  {touched?.address && errors?.address && (
                    <p className="text-danger">{errors?.address}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="group_name">
                    Group Name <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="group_name"
                    name="group_name"
                    placeholder="Group Name"
                    value={values?.group_name}
                    options={dropdownOptionList?.dropdownGroupList || []}
                    onBlur={handleBlur}
                    onChange={e => setFieldValue('group_name', e.value)}
                    optionGroupTemplate={groupLableTemplate}
                    // optionLabel="label"
                    // optionGroupLabel="label"
                    // optionGroupChildren="items"
                    // className="w-100"
                  />
                  {touched?.group_name && errors?.group_name && (
                    <p className="text-danger">{errors?.group_name}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="country">
                    Country <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="country"
                    name="country"
                    placeholder="Select Country"
                    value={values?.country || ''}
                    options={dropdownOptionList?.countryList}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('country', e.value);
                      setFieldValue('state', '');
                      setFieldValue('city', '');
                      setDropdownOptionList({
                        ...dropdownOptionList,
                        stateList: [],
                        cityList: [],
                      });
                      loadStateData(e.value);
                    }}
                  />
                  {touched?.country && errors?.country && (
                    <p className="text-danger">{errors?.country}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="state">
                    State <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="state"
                    name="state"
                    value={values?.state || ''}
                    options={dropdownOptionList?.stateList}
                    onBlur={handleBlur}
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
                  <label htmlFor="city">
                    City <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="city"
                    name="city"
                    value={values?.city || ''}
                    options={dropdownOptionList?.cityList}
                    onBlur={handleBlur}
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
                    name="pin_code"
                    placeholder="Write Pin code"
                    useGrouping={false}
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
                  <label htmlFor="reference">
                    Reference <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="reference"
                    name="reference"
                    value={values?.reference || ''}
                    options={dropdownOptionList?.referenceOptionList}
                    onBlur={handleBlur}
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
                  <label htmlFor="type">
                    Type <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="type"
                    name="type"
                    options={Type}
                    value={values?.type || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('type', e.value);
                    }}
                    placeholder="Select Type"
                  />
                  {touched?.type && errors?.type && (
                    <p className="text-danger">{errors?.type}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="currency">
                    Currency <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="currency"
                    name="currency"
                    value={values?.currency || ''}
                    options={dropdownOptionList?.currencyList}
                    onBlur={handleBlur}
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
                    name="opening_balance"
                    placeholder="opening Balance"
                    value={values?.opening_balance || ''}
                    onChange={e => {
                      setFieldValue('opening_balance', e.value);
                    }}
                    min={0}
                    onBlur={handleBlur}
                    useGrouping={false}
                    maxFractionDigits={2}
                  />
                  {touched?.opening_balance && errors?.opening_balance && (
                    <p className="text-danger">{errors?.opening_balance}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="credits_limits">Credit Limit</label>
                  <InputNumber
                    id="credits_limits"
                    name="credits_limits"
                    placeholder="Credit Limit"
                    useGrouping={false}
                    value={values?.credits_limits || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('credits_limits', e.value);
                    }}
                  />
                  {touched?.credits_limits && errors?.credits_limits && (
                    <p className="text-danger">{errors?.credits_limits}</p>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="pay_due_day">Pay Due Days</label>
                  <InputNumber
                    id="pay_due_day"
                    name="pay_due_day"
                    placeholder="Pay Due Day"
                    useGrouping={false}
                    value={values?.pay_due_day || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      setFieldValue('pay_due_day', e.value);
                    }}
                  />
                  {/* <Calendar
                    id="pay_due_date"
                    placeholder="Pay Due Day"
                    showIcon
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    value={values?.pay_due_date || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    showButtonBar
                  /> */}
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
