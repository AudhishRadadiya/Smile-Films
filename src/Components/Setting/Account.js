import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccount,
  getAccountList,
  setAccountCurrentPage,
  setAccountPageLimit,
  setAccountSearchParam,
  setIsAddAccount,
  setIsDeleteAccount,
  setIsUpdateAccount,
} from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import CompanySidebar from './CompanySidebar';

import Loader from 'Components/Common/Loader';
import { accountSchema } from 'Schema/Setting/accountMasterSchema';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import _ from 'lodash';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { getChangeFinancialYearList } from 'Store/Reducers/Settings/Master/ChangeFinancialYearSlice';
import { Link } from 'react-router-dom';

let accountData = {
  id: '',
  account_name: '',
  group_name: '',
  balance_method: '',
  opening_balance: 0,
  opening_balance_type: 1,
  country: '',
  state: '',
  city: '',
  area: '',
  pincode: '',
  email_id: '',
  mobile_no: '',
  isActive: true,
};

const balanceMethodList = [{ label: 'Balance Only', value: 'Balance Only' }];

export default function Account({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();

  const {
    accountList,
    accountCurrentPage,
    accountPageLimit,
    isAddAccount,
    isUpdateAccount,
    isDeleteAccount,
    accountSearchParam,
    accountLoading,
    selectedAccountData,
  } = useSelector(({ account }) => account);
  const { cityLoading } = useSelector(({ city }) => city);
  const { stateLoading } = useSelector(({ state }) => state);
  const { countryLoading } = useSelector(({ country }) => country);
  const { changeYearList } = useSelector(
    ({ changeFinancialYear }) => changeFinancialYear,
  );

  const [deleteId, setDeleteId] = useState('');
  const [editData, setEditData] = useState(accountData);
  const [deletePopup, setDeletePopup] = useState(false);
  const [accountModel, setAccountModel] = useState(false);
  const [financialYear, setFinancialYear] = useState('');
  const [dropdownOptionList, setDropdownOptionList] = useState({
    countryList: [],
    stateList: [],
    cityList: [],
    dropdownGroupList: [],
  });

  const accountGroupData = useMemo(() => {
    let dummyArray = [];
    if (accountList?.list?.length > 0) {
      accountList?.list.forEach(item => {
        dummyArray = [...dummyArray, ...item.account];
      });
    }
    return dummyArray;
  }, [accountList]);

  const getAccountListApi = useCallback(
    (start = 1, limit = 10, search = '', financialYearId = financialYear) => {
      dispatch(
        getAccountList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
          financial_year_id: financialYearId,
        }),
      );
    },
    [dispatch, financialYear],
  );

  const getChangeFinancialYearListApi = useCallback(
    (start = 0, limit = 0, search = '') => {
      dispatch(
        getChangeFinancialYearList({
          start: start,
          limit: limit,
          search: search?.trim(),
          isActive: '',
        }),
      ).then(response => {
        const financialYearList = response?.payload?.data?.list || {};

        const selectedFinancialYear =
          Object.keys(financialYearList).length > 0 &&
          financialYearList?.find(item => item.default === true)?._id;

        if (selectedFinancialYear) {
          setFinancialYear(selectedFinancialYear);
        }
        getAccountListApi(
          accountCurrentPage,
          accountPageLimit,
          accountSearchParam,
          selectedFinancialYear,
        );
      });
    },
    [
      dispatch,
      getAccountListApi,
      accountCurrentPage,
      accountPageLimit,
      accountSearchParam,
    ],
  );

  useEffect(() => {
    getChangeFinancialYearListApi();
  }, []);

  useEffect(() => {
    if (isAddAccount || isUpdateAccount || isDeleteAccount) {
      getAccountListApi(
        accountCurrentPage,
        accountPageLimit,
        accountSearchParam,
        financialYear,
      );
      resetForm();
      setEditData(accountData);
      setAccountModel(false);
    }
    if (isUpdateAccount) {
      dispatch(setIsUpdateAccount(false));
    }
    if (isAddAccount) {
      dispatch(setIsAddAccount(false));
    }
    if (isDeleteAccount) {
      dispatch(setIsDeleteAccount(false));
    }
  }, [dispatch, isAddAccount, isUpdateAccount, isDeleteAccount]);

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
          const countyDataOption = countyData?.data?.list?.map(item => {
            return { label: item?.country, value: item?._id };
          });
          const groupData = response.payload?.map(item => ({
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
            countryList: countyDataOption,
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
  };

  useEffect(() => {
    if (Object.keys(selectedAccountData)?.length) {
      setEditData(selectedAccountData);

      if (selectedAccountData?.country) {
        let cityOptionList = [];
        let stateOptionList = [];

        dispatch(
          getStateList({
            country_id: selectedAccountData?.country,
            start: 0,
            limit: 0,
            isActive: true,
          }),
        )
          .then(response => {
            stateOptionList = response.payload?.data?.list?.map(item => {
              return { label: item?.state, value: item?._id };
            });

            return dispatch(
              getCityList({
                country_id: selectedAccountData?.country,
                state_id: selectedAccountData?.state,
                start: 0,
                limit: 0,
                isActive: true,
              }),
            );
          })
          .then(cityResponse => {
            cityOptionList = cityResponse.payload?.data?.list?.map(item => ({
              label: item?.city,
              value: item?._id,
            }));

            setDropdownOptionList(prevState => ({
              ...prevState,
              stateList: stateOptionList,
              cityList: cityOptionList,
            }));
          })
          .catch(error => {
            console.error('Error fetching company data:', error);
          });
      }
    }
  }, [selectedAccountData, dispatch]);

  const headerTemplate = data => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-bold">{data?.group_name}</span>
      </div>
    );
  };

  const groupLableTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const currentBalanceTemplate = data => {
    const history = data?.accountHistory || {};

    if (Object.keys(history).length > 0) {
      return (
        <div>{`${Math.abs(data?.current_balance) || ''} ${
          data?.current_balance ? (data?.current_balance > 0 ? 'CR' : 'DB') : ''
        }`}</div>
      );
    }

    return '-';
  };

  const openingBalanceTemplate = data => {
    const history = data?.accountHistory || {};

    if (Object.keys(history).length > 0) {
      return (
        <div>{`${Math.abs(data?.opening_balance) || ''} ${
          data?.opening_balance ? (data?.opening_balance > 0 ? 'CR' : 'DB') : ''
        }`}</div>
      );
    }

    return '-';
  };

  const actionBodyTemplate = row => {
    return row?.type === 'account' ? (
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
      //             getRequiredList();
      //             dispatch(getAccount({ account_id: row?._id }));
      //             setAccountModel(true);
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
              getRequiredList();
              dispatch(getAccount({ account_id: row?._id }));
              setAccountModel(true);
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
    ) : (
      ''
    );
  };

  const onPageChange = page => {
    if (page !== accountCurrentPage) {
      let pageIndex = accountCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setAccountCurrentPage(pageIndex));
      getAccountListApi(
        pageIndex,
        accountPageLimit,
        accountSearchParam,
        financialYear,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setAccountCurrentPage(page === 0 ? 0 : 1));
    dispatch(setAccountPageLimit(page));
    const pageValue =
      page === 0 ? (accountList?.totalRows ? accountList?.totalRows : 0) : page;
    const prevPageValue =
      accountPageLimit === 0
        ? accountList?.totalRows
          ? accountList?.totalRows
          : 0
        : accountPageLimit;
    if (
      prevPageValue < accountList?.totalRows ||
      pageValue < accountList?.totalRows
    ) {
      getAccountListApi(
        page === 0 ? 0 : 1,
        page,
        accountSearchParam,
        financialYear,
      );
    }
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      account_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteAccount(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      const payload = {
        account_name: values?.account_name,
        group_name: values?.group_name,
        balance_method: values?.balance_method,
        opening_balance: values?.opening_balance,
        opening_balance_type: values?.opening_balance_type,
        area: values?.area,
        pincode: values?.pincode,
        email_id: values?.email_id,
        mobile_no: values?.mobile_no,
        isActive: values?.isActive,
        ...(values?._id && { account_id: values?._id }),
        ...(values?.city && { city: values?.city }),
        ...(values?.state && { state: values?.state }),
        ...(values?.country && { country: values?.country }),
      };

      if (values?._id) {
        dispatch(editAccount(payload));
      } else {
        dispatch(addAccount(payload));
      }
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: editData,
    validationSchema: accountSchema,
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
          cityList: [],
        });
      } else {
        setDropdownOptionList({
          ...dropdownOptionList,
          stateList: [],
          cityList: [],
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

  const onCancel = useCallback(() => {
    resetForm();
    setEditData(accountData);
    setAccountModel(false);
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
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setAccountCurrentPage(1));

    getAccountListApi(
      1,
      accountPageLimit,
      e.target.value?.trim(),
      financialYear,
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [financialYear],
  );

  const financialYearOptions = useMemo(() => {
    return (changeYearList?.list || []).map(item => {
      const startYear = new Date(item.start_date).getFullYear();
      const endYear = new Date(item.end_date).getFullYear();
      return {
        label: `${startYear} - ${endYear}`,
        value: item._id,
      };
    });
  }, [changeYearList]);

  const handleSelectFinancialYear = useCallback(
    data => {
      setFinancialYear(data);
      getAccountListApi(1, accountPageLimit, accountSearchParam, data);
    },
    [accountPageLimit, accountSearchParam, getAccountListApi],
  );

  const accountNameTemplate = data => {
    return (
      <Link to={`/account-history/${data?._id}`} className="hover_text">
        {data?.account_name}
      </Link>
    );
  };

  return (
    <div className="main_Wrapper">
      {(accountLoading || countryLoading || stateLoading || cityLoading) && (
        <Loader />
      )}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Account</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <ReactSelectSingle
                          id="financial_year"
                          filter
                          value={financialYear}
                          options={financialYearOptions}
                          onBlur={handleBlur}
                          onChange={e => handleSelectFinancialYear(e.value)}
                          placeholder="Select Financial Year"
                        />
                      </li>
                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={accountSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setAccountSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setEditData(accountData);
                              getRequiredList();
                              setAccountModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Account
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper">
              <DataTable
                value={accountGroupData}
                rowGroupMode="subheader"
                groupRowsBy="group_name"
                sortMode="single"
                sortField="group_name"
                sortOrder={1}
                scrollable
                rowGroupHeaderTemplate={headerTemplate}
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column
                  field="account_name"
                  header="Account Name"
                  body={accountNameTemplate}
                  sortable
                ></Column>
                <Column field="city" header="City" sortable></Column>
                <Column
                  field="address"
                  header="Address"
                  sortable
                  className="address_manage_wrapper"
                ></Column>
                <Column
                  field="opening_balance"
                  header="Opening Balance"
                  sortable
                  body={openingBalanceTemplate}
                ></Column>
                <Column
                  field="current_balance"
                  header="Closing Balance"
                  sortable
                  body={currentBalanceTemplate}
                ></Column>
                <Column
                  field="isActive"
                  header="Action"
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={accountList?.list}
                pageLimit={accountPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={accountCurrentPage}
                totalCount={accountList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'account'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Account' : 'Create Account'}
        visible={accountModel}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Name">
                  Account Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="Name"
                  placeholder="Account Name"
                  className="input_wrap"
                  value={values?.account_name || ''}
                  name="account_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.account_name && errors?.account_name && (
                  <p className="text-danger">{errors?.account_name}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>
                  Group Name <span className="text-danger fs-6">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  value={values?.group_name}
                  options={dropdownOptionList?.dropdownGroupList}
                  name="group_name"
                  onBlur={handleBlur}
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
          </Row>
          <h3 className="my20">Balance Method</h3>
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>
                  Balance Method <span className="text-danger fs-6">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  value={values?.balance_method || ''}
                  name="balance_method"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  options={balanceMethodList}
                  placeholder="Balance Method"
                />
                {touched?.balance_method &&
                  errors?.balance_method &&
                  !values?.balance_method && (
                    <p className="text-danger">{errors?.balance_method}</p>
                  )}
              </div>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="OpeningBalance">Opening Balance</label>
                <InputNumber
                  id="OpeningBalance"
                  placeholder="Opening Balance"
                  name="opening_balance"
                  value={values?.opening_balance || ''}
                  onChange={e => {
                    setFieldValue('opening_balance', e.value);
                  }}
                  min={0}
                  useGrouping={false}
                  onBlur={handleBlur}
                  maxFractionDigits={2}
                  required
                />
                {touched?.opening_balance && errors?.opening_balance && (
                  <p className="text-danger">{errors?.opening_balance}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="radio_wrapper d-flex align-items-center">
                <label className="me-3">Type</label>
                <div className="radio-inner-wrap d-flex align-items-center me-3">
                  <RadioButton
                    inputId="Credits"
                    name="opening_balance_type"
                    value={1}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.opening_balance_type === 1}
                  />
                  <label htmlFor="Credits" className="ms-2">
                    Credits
                  </label>
                </div>
                <div className="radio-inner-wrap d-flex align-items-center">
                  <RadioButton
                    inputId="Debits"
                    name="opening_balance_type"
                    value={2}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.opening_balance_type === 2}
                  />
                  <label htmlFor="Debits" className="ms-2">
                    Debits
                  </label>
                </div>
              </div>
            </Col>
          </Row>
          <h3 className="my20">Party Detail</h3>
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>Country</label>
                <ReactSelectSingle
                  filter
                  value={values?.country}
                  name="country"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('country', e.value);
                    setFieldValue('state', '');
                    setFieldValue('city', '');
                    loadStateData(e.value);
                  }}
                  options={dropdownOptionList?.countryList}
                  placeholder="Select Country"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>State</label>
                <ReactSelectSingle
                  filter
                  value={values?.state}
                  name="state"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('state', e.value);
                    setFieldValue('city', '');
                    loadCityData(e.value);
                  }}
                  options={dropdownOptionList?.stateList}
                  placeholder="Select State"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>City</label>
                <ReactSelectSingle
                  filter
                  value={values?.city || ''}
                  name="city"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  options={dropdownOptionList?.cityList}
                  placeholder="Select City"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Address">Address</label>
                <InputText
                  id="Address"
                  placeholder="Address"
                  className="input_wrap"
                  name="area"
                  value={values?.area || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched?.area && errors?.area && (
                  <p className="text-danger">{errors?.area}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Pincode">Pin code</label>
                <InputNumber
                  id="Pincode"
                  placeholder="Pin code"
                  name="pincode"
                  useGrouping={false}
                  value={values?.pincode || ''}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('pincode', e.value);
                  }}
                  required
                />
                {touched?.pincode && errors?.pincode && (
                  <p className="text-danger">{errors?.pincode}</p>
                )}
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
                <label htmlFor="PhoneNumber">Phone Number</label>
                <InputText
                  id="PhoneNumber"
                  placeholder="Phone Number"
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
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
