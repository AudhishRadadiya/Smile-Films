import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../Assets/Images/plus.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanySidebar from './CompanySidebar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAccount,
  getAccount,
  getAccountList,
  setAccountCurrentPage,
  setAccountPageLimit,
  setAccountSearchParam,
  setIsAddAccount,
  setIsDeleteAccount,
  setIsUpdateAccount,
  addAccount,
  editAccount,
} from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { useFormik } from 'formik';

import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import { accountSchema } from 'Schema/Setting/accountMasterSchema';
import _ from 'lodash';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';

let accountData = {
  id: '',
  account_name: '',
  group_name: '',
  balance_method: '',
  opening_balance: 0,
  type: 1,
  country: '',
  state: '',
  city: '',
  area: '',
  pincode: '',
  email_id: '',
  mobile_no: '',
  isActive: true,
};

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
  const { countryLoading } = useSelector(({ country }) => country);
  const { stateLoading } = useSelector(({ state }) => state);
  const { cityLoading } = useSelector(({ city }) => city);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [accountModel, setAccountModel] = useState(false);
  const [editData, setEditData] = useState(accountData);
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
        item.accounts?.forEach(d => {
          dummyArray.push({ ...d });
        });
      });
    }
    return dummyArray;
  }, [accountList]);

  useEffect(() => {
    dispatch(
      getAccountList({
        start: accountCurrentPage,
        limit: accountPageLimit,
        isActive: '',
        search: accountSearchParam,
      }),
    );
  }, [dispatch, accountCurrentPage, accountPageLimit]);

  useEffect(() => {
    if (isAddAccount || isUpdateAccount || isDeleteAccount) {
      dispatch(
        getAccountList({
          start: accountCurrentPage,
          limit: accountPageLimit,
          isActive: '',
          search: accountSearchParam,
        }),
      );
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
  }, [
    isAddAccount,
    isUpdateAccount,
    isDeleteAccount,
    dispatch,
    accountCurrentPage,
    accountPageLimit,
    accountSearchParam,
  ]);
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
      let stateOptionList = [],
        cityOptionList = [];

      setEditData(selectedAccountData);
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

  const balanceMethodList = [{ label: 'Balance Only', value: 'Balance Only' }];

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
                  dispatch(getAccount({ account_id: row?._id }));
                  setAccountModel(true);
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

  const onPageChange = page => {
    let pageIndex = accountCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setAccountCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setAccountCurrentPage(page === 0 ? 0 : 1));
    dispatch(setAccountPageLimit(page));
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

  const countryTemplate = option => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div>{option.label}</div>
        <div>{option.code}</div>
      </div>
    );
  };

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

  const submitHandle = useCallback(
    async values => {
      if (values?._id) {
        const payload = {
          ...values,
          account_id: values?._id,
        };
        dispatch(editAccount(payload));
      } else {
        dispatch(addAccount(values));
      }
      setAccountModel(false);
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
          Save
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setAccountCurrentPage(1));
    dispatch(
      getAccountList({
        start: 1,
        limit: accountPageLimit,
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
                  sortable
                ></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="area" header="Area" sortable></Column>
                <Column
                  field="opening_balance"
                  header="Opening Balance"
                  sortable
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
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header="Account"
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
                <label htmlFor="Name">Name</label>
                <InputText
                  id="Name"
                  placeholder="Name"
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
          </Row>
          <h3 className="my20">Balance Method</h3>
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>Balance Method</label>
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
                  useGrouping={false}
                  value={values?.opening_balance || ''}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('opening_balance', e.value);
                  }}
                  required
                />
                {touched?.opening_balance &&
                  errors?.opening_balance &&
                  !values?.opening_balance && (
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
                    name="type"
                    value={1}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.type === 1}
                  />
                  <label htmlFor="Credits" className="ms-2">
                    Credits
                  </label>
                </div>
                <div className="radio-inner-wrap d-flex align-items-center">
                  <RadioButton
                    inputId="Debits"
                    name="type"
                    value={2}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.type === 2}
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
                {touched?.country && errors?.country && !values?.country && (
                  <p className="text-danger">{errors?.country}</p>
                )}
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
                {touched?.state && errors?.state && !values?.state && (
                  <p className="text-danger">{errors?.state}</p>
                )}
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
                {touched?.city && errors?.city && !values?.city && (
                  <p className="text-danger">{errors?.city}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Area">Area</label>
                <InputText
                  id="Area"
                  placeholder="Area"
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
