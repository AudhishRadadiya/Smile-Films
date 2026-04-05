import React, { useEffect, useState, useCallback } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../../Assets/Images/action.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { useFormik } from 'formik';
import _ from 'lodash';
import { citySchema } from 'Schema/Setting/masterSettingSchema';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCity,
  deleteCity,
  editCity,
  getCityById,
  getCityList,
  setCityCurrentPage,
  setCityList,
  setCityPageLimit,
  setCitySearchParam,
  setIsAddCity,
  setIsDeleteCity,
  setIsUpdateCity,
  setSelectCountryForCity,
  setSelectStateForCity,
} from 'Store/Reducers/Settings/Master/CitySlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import Loader from 'Components/Common/Loader';

let initialData = {
  id: '',
  city: '',
  state_id: '',
  country_id: '',
  isActive: true,
};

export default function CityLocation({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [cityModel, setCityModel] = useState(false);
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [stateInnerDropdown, setStateInnerDropdown] = useState([]);
  const [cityDataValue, setCityDataValue] = useState(initialData);
  const {
    selectCountryForCity,
    selectStateForCity,
    cityPageLimit,
    cityCurrentPage,
    cityList,
    isDeleteCity,
    isUpdateCity,
    isAddCity,
    citySearchParam,
    cityLoading,
  } = useSelector(({ city }) => city);

  const getCityListApi = useCallback(
    (countryId = '', stateId = '', start = 1, limit = 10, search = '') => {
      dispatch(
        getCityList({
          country_id: countryId,
          state_id: stateId,
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
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
      //             dispatch(getCityById(row?._id))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setCityDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching city data:', error);
      //               });
      //             setCityModel(true);
      //             handleEditDataOptions(row);
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
              dispatch(getCityById(row?._id))
                .then(response => {
                  const responseData = response.payload?.data;
                  setCityDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching city data:', error);
                });
              setCityModel(true);
              handleEditDataOptions(row);
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

  const onPageChange = page => {
    if (page !== cityCurrentPage) {
      let pageIndex = cityCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setCityCurrentPage(pageIndex));
      getCityListApi(
        selectCountryForCity?.country,
        selectStateForCity?.state,
        pageIndex,
        cityPageLimit,
        citySearchParam,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setCityCurrentPage(page === 0 ? 0 : 1));
    dispatch(setCityPageLimit(page));
    const pageValue =
      page === 0 ? (cityList?.totalRows ? cityList?.totalRows : 0) : page;
    const prevPageValue =
      cityPageLimit === 0
        ? cityList?.totalRows
          ? cityList?.totalRows
          : 0
        : cityPageLimit;
    if (
      prevPageValue < cityList?.totalRows ||
      pageValue < cityList?.totalRows
    ) {
      getCityListApi(
        selectCountryForCity?.country,
        selectStateForCity?.state,
        page === 0 ? 0 : 1,
        page,
        citySearchParam,
      );
    }
  };

  const handleDelete = useCallback(() => {
    dispatch(deleteCity(deleteId));
    setDeletePopup(false);
  }, [deleteId, dispatch]);

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

  const loadData = useCallback(async () => {
    const res = await dispatch(
      getCountryList({
        start: 0,
        limit: 0,
        isActive: true,
      }),
    );
    if (res?.payload?.data?.list?.length) {
      const countyData = res?.payload?.data?.list?.map(item => {
        return { label: item?.country, value: item?._id };
      });
      if (countyData?.length) {
        setCountryDropdown(countyData);
        dispatch(
          setSelectCountryForCity({
            ...selectCountryForCity,
            country: countyData[0]?.value,
          }),
        );
        const isSuccessState = await getStateListApi(countyData[0]?.value);
        if (isSuccessState?.payload?.data?.list?.length) {
          const stateData = isSuccessState?.payload?.data?.list?.map(item => {
            return { label: item?.state, value: item?._id };
          });

          if (stateData?.length) {
            setStateDropdown(stateData);
            dispatch(
              setSelectStateForCity({
                ...selectStateForCity,
                state: stateData[0]?.value,
              }),
            );
            getCityListApi(
              countyData[0]?.value,
              stateData[0]?.value,
              cityCurrentPage,
              cityPageLimit,
              citySearchParam,
            );
          }
        }
      } else {
        setStateDropdown([]);
        dispatch(setCityList({ list: [], pageNo: '', totalRows: 0 }));
      }
    }
  }, [
    dispatch,
    cityPageLimit,
    getCityListApi,
    cityCurrentPage,
    getStateListApi,
    citySearchParam,
    selectStateForCity,
    selectCountryForCity,
  ]);

  const handleEditDataOptions = useCallback(
    async data => {
      const isSuccessState = await getStateListApi(data?.country_id);
      if (isSuccessState?.payload?.data?.list?.length) {
        const stateData = isSuccessState?.payload?.data?.list?.map(item => {
          return { label: item?.state, value: item?._id };
        });
        if (stateData?.length) {
          setStateInnerDropdown(stateData);
        }
      }
    },
    [getStateListApi],
  );

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          city: values?.city,
          city_id: values?._id,
          state_id: values?.state_id,
          country_id: values?.country_id,
          isActive: values?.isActive,
        };
        dispatch(editCity(payload));
      } else {
        dispatch(addCity(values));
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
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: cityDataValue,
    validationSchema: citySchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isAddCity || isUpdateCity || isDeleteCity) {
      getCityListApi(
        selectCountryForCity?.country,
        selectStateForCity?.state,
        cityCurrentPage,
        cityPageLimit,
        citySearchParam,
      );
      resetForm();
      setCityModel(false);
      setCityDataValue(initialData);
    }
    if (isUpdateCity) {
      dispatch(setIsUpdateCity(false));
    }
    if (isAddCity) {
      dispatch(setIsAddCity(false));
    }
    if (isDeleteCity) {
      dispatch(setIsDeleteCity(false));
    }
  }, [dispatch, isAddCity, isUpdateCity, isDeleteCity]);

  const onCancel = useCallback(() => {
    resetForm();
    setCityModel(false);
    setCityDataValue(initialData);
  }, [resetForm]);

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Checkbox
          inputId="ingredient1"
          name="isActive"
          value={values?.isActive || false}
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
        <Button className="btn_border" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit}>
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSelectCountry = useCallback(
    async value => {
      dispatch(
        setSelectCountryForCity({ ...selectCountryForCity, country: value }),
      );
      const isSuccessState = await getStateListApi(value);

      if (isSuccessState?.payload?.data?.list?.length) {
        const stateData = isSuccessState?.payload?.data?.list?.map(item => {
          return { label: item?.state, value: item?._id };
        });

        if (stateData?.length) {
          setStateDropdown(stateData);
          dispatch(
            setSelectStateForCity({
              ...selectStateForCity,
              state: stateData[0]?.value,
            }),
          );
          getCityListApi(value, stateData[0]?.value, 1, 10, '');
          dispatch(setCityCurrentPage(1));
          dispatch(setCityPageLimit(10));
          dispatch(setCitySearchParam(''));
        }
      } else {
        setStateDropdown([]);
        dispatch(setCityList({ list: [], pageNo: '', totalRows: 0 }));
      }
    },
    [
      dispatch,
      getCityListApi,
      getStateListApi,
      selectCountryForCity,
      selectStateForCity,
    ],
  );
  const handleSelectState = useCallback(
    value => {
      dispatch(setSelectStateForCity({ ...selectStateForCity, state: value }));
      getCityListApi(
        selectCountryForCity?.country,
        value,
        cityCurrentPage,
        cityPageLimit,
        citySearchParam,
      );
    },
    [
      dispatch,
      cityPageLimit,
      getCityListApi,
      citySearchParam,
      cityCurrentPage,
      selectStateForCity,
      selectCountryForCity?.country,
    ],
  );

  const handleSearchInput = (e, selectCountryForCity, selectStateForCity) => {
    dispatch(setCityCurrentPage(1));
    getCityListApi(
      selectCountryForCity?.country,
      selectStateForCity?.state,
      1,
      cityPageLimit,
      e.target.value?.trim(),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="country_location_wrap">
      {cityLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title d-flex align-items-center">
                <h3 className="m-0">City</h3>
                <div className="form_group ms-2">
                  <ReactSelectSingle
                    filter
                    value={selectCountryForCity?.country}
                    options={countryDropdown}
                    onBlur={e => handleBlur(e)}
                    onChange={e => handleSelectCountry(e.value)}
                    placeholder="Select Country"
                  />
                </div>
                <div className="form_group ms-2">
                  <ReactSelectSingle
                    filter
                    value={selectStateForCity?.state}
                    options={stateDropdown}
                    onBlur={handleBlur}
                    onChange={e => handleSelectState(e.value)}
                    placeholder="Select State"
                  />
                </div>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={citySearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            selectCountryForCity,
                            selectStateForCity,
                          );
                          dispatch(setCitySearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  {is_create_access === true && (
                    <li>
                      <Button
                        onClick={() => {
                          setCityDataValue(initialData);
                          setCityModel(true);
                        }}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" /> Create City
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper setting_tab_table">
          <DataTable
            value={cityList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="city" header="City Name" sortable></Column>
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
              style={{ width: '8%' }}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={cityList?.list}
            pageLimit={cityPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={cityCurrentPage}
            totalCount={cityList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'city'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update City' : 'Create City'}
        visible={cityModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <div className="form_group mb-3">
            <label htmlFor="country">
              Country <span className="text-danger fs-6">*</span>
            </label>
            <ReactSelectSingle
              filter
              id="country_id"
              options={countryDropdown}
              value={values?.country_id || ''}
              name="country_id"
              onBlur={handleBlur}
              onChange={async e => {
                setFieldValue('country_id', e.target.value);
                setFieldValue('state_id', '');
                setFieldValue('city', '');
                const isSuccessState = await getStateListApi(e.value);
                if (isSuccessState?.payload?.data?.list?.length) {
                  const stateData = isSuccessState?.payload?.data?.list?.map(
                    item => {
                      return { label: item?.state, value: item?._id };
                    },
                  );
                  if (stateData?.length) {
                    setStateInnerDropdown(stateData);
                  }
                } else {
                  setStateInnerDropdown([]);
                }
              }}
              placeholder="Select Country"
            />
            {touched?.country_id &&
              errors?.country_id &&
              !values?.country_id && (
                <p className="text-danger">{errors?.country_id}</p>
              )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="state">
              State <span className="text-danger fs-6">*</span>
            </label>
            <ReactSelectSingle
              filter
              id="state"
              options={stateInnerDropdown}
              value={values?.state_id || ''}
              name="state_id"
              onBlur={handleBlur}
              onChange={e => {
                setFieldValue('state_id', e.value);
                setFieldValue('city', '');
              }}
              placeholder="Select State"
            />
            {touched?.state_id && errors?.state_id && !values?.state_id && (
              <p className="text-danger">{errors?.state_id}</p>
            )}
          </div>
          <div className="form_group mb-3">
            <label htmlFor="city">
              City Name <span className="text-danger fs-6">*</span>
            </label>
            <InputText
              id="city"
              placeholder="Write Name"
              className="input_wrap"
              name="city"
              value={values?.city || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
            {touched?.city && errors?.city && !values?.city && (
              <p className="text-danger">{errors?.city}</p>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
