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
import { stateSchema } from 'Schema/Setting/masterSettingSchema';
import { useDispatch, useSelector } from 'react-redux';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import {
  addState,
  deleteState,
  editState,
  getStateById,
  getStateList,
  setIsAddState,
  setIsDeleteState,
  setIsUpdateState,
  setSelectCountryForState,
  setStateCurrentPage,
  setStatePageLimit,
  setStateSearchParam,
} from 'Store/Reducers/Settings/Master/StateSlice';
import Loader from 'Components/Common/Loader';

let initalData = {
  id: '',
  state: '',
  country_id: '',
  isActive: true,
};

export default function StateLocation({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [stateModel, setStateModel] = useState(false);
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDataValue, setStateDataValue] = useState(initalData);

  const {
    selectCountryForState,
    statePageLimit,
    stateCurrentPage,
    stateList,
    isDeleteState,
    isUpdateState,
    isAddState,
    stateSearchParam,
    stateLoading,
  } = useSelector(({ state }) => state);

  const getStateListApi = useCallback(
    (countryId = '', start = 1, limit = 10, search = '') => {
      dispatch(
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
          setSelectCountryForState({
            ...selectCountryForState,
            country: countyData[0]?.value,
          }),
        );
        getStateListApi(countyData[0]?.value);
      }
    }
  }, [dispatch]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          state_id: values?._id,
          state: values?.state,
          country_id: values?.country_id,
          isActive: values?.isActive,
        };
        dispatch(editState(payload));
      } else {
        dispatch(addState(values));
      }
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: stateDataValue,
    validationSchema: stateSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isAddState || isUpdateState || isDeleteState) {
      getStateListApi(
        selectCountryForState?.country,
        stateCurrentPage,
        statePageLimit,
        stateSearchParam,
      );
      resetForm();
      setStateModel(false);
      setStateDataValue(initalData);
    }
    if (isUpdateState) {
      dispatch(setIsUpdateState(false));
    }
    if (isAddState) {
      dispatch(setIsAddState(false));
    }
    if (isDeleteState) {
      dispatch(setIsDeleteState(false));
    }
  }, [dispatch, isAddState, isUpdateState, isDeleteState]);

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
      //             dispatch(getStateById({ state_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setStateDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching state data:', error);
      //               });

      //             setStateModel(true);
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
              dispatch(getStateById({ state_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setStateDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching state data:', error);
                });

              setStateModel(true);
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
        value={product?.isActive === true ? 'Active' : 'Inactive'}
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

  const onPageChange = useCallback(
    page => {
      if (page !== stateCurrentPage) {
        let pageIndex = stateCurrentPage;
        if (page?.page === 'Prev') pageIndex--;
        else if (page?.page === 'Next') pageIndex++;
        else pageIndex = page;
        dispatch(setStateCurrentPage(pageIndex));
        getStateListApi(
          selectCountryForState?.country,
          pageIndex,
          statePageLimit,
          stateSearchParam,
        );
      }
    },
    [
      dispatch,
      statePageLimit,
      getStateListApi,
      stateCurrentPage,
      stateSearchParam,
      selectCountryForState?.country,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(setStateCurrentPage(page === 0 ? 0 : 1));
      dispatch(setStatePageLimit(page));
      const pageValue =
        page === 0 ? (stateList?.totalRows ? stateList?.totalRows : 0) : page;
      const prevPageValue =
        statePageLimit === 0
          ? stateList?.totalRows
            ? stateList?.totalRows
            : 0
          : statePageLimit;
      if (
        prevPageValue < stateList?.totalRows ||
        pageValue < stateList?.totalRows
      ) {
        getStateListApi(
          selectCountryForState?.country,
          page === 0 ? 0 : 1,
          page,
          stateSearchParam,
        );
      }
    },
    [
      dispatch,
      statePageLimit,
      getStateListApi,
      stateSearchParam,
      stateList?.totalRows,
      selectCountryForState?.country,
    ],
  );

  const handleDelete = useCallback(() => {
    dispatch(deleteState(deleteId));
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const onCancel = useCallback(() => {
    resetForm();
    setStateModel(false);
    setStateDataValue(initalData);
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

  const handleSelectCountry = value => {
    dispatch(
      setSelectCountryForState({ ...selectCountryForState, country: value }),
    );
    getStateListApi(value, stateCurrentPage, statePageLimit, stateSearchParam);
  };

  const handleSearchInput = e => {
    dispatch(setStateCurrentPage(1));
    getStateListApi(
      selectCountryForState?.country,
      1,
      statePageLimit,
      e.target.value?.trim(),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="country_location_wrap">
      {stateLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title d-flex align-items-center">
                <h3 className="m-0">State</h3>
                <div className="form_group ms-2">
                  <ReactSelectSingle
                    filter
                    value={selectCountryForState?.country}
                    options={countryDropdown}
                    onBlur={handleBlur}
                    onChange={e => handleSelectCountry(e.value)}
                    placeholder="Select Country"
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
                        value={stateSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setStateSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  {is_create_access === true && (
                    <li>
                      <Button
                        onClick={() => {
                          setStateDataValue(initalData);
                          setStateModel(true);
                        }}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" /> Create State
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
            value={stateList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="state" header="State Name" sortable></Column>
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
            dataList={stateList?.list}
            pageLimit={statePageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={stateCurrentPage}
            totalCount={stateList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'state'}
        deletePopup={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update State' : 'Create State'}
        visible={stateModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <div className="form_group mb-3">
            <label>
              Country <span className="text-danger fs-6">*</span>
            </label>
            <ReactSelectSingle
              filter
              options={countryDropdown}
              value={values?.country_id}
              name="country_id"
              onBlur={handleBlur}
              onChange={e => {
                setFieldValue('country_id', e.value);
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
              State Name <span className="text-danger fs-6">*</span>
            </label>
            <InputText
              id="state"
              placeholder="State Name"
              className="input_wrap"
              name="state"
              value={values?.state}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
            {touched?.state && errors?.state && (
              <p className="text-danger">{errors?.state}</p>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
