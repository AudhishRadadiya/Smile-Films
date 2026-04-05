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
import { useFormik } from 'formik';
import _ from 'lodash';
import { countrySchema } from 'Schema/Setting/masterSettingSchema';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCountry,
  deleteCountry,
  editCountry,
  getCountryList,
  setCountryCurrentPage,
  setCountryPageLimit,
  setIsAddCountry,
  setIsDeleteCountry,
  setIsUpdateCountry,
  setCountrySearchParam,
  getCountryData,
} from 'Store/Reducers/Settings/Master/CountrySlice';
import Loader from 'Components/Common/Loader';

let initialData = {
  id: '',
  country: '',
  isActive: true,
};

export default function CountryLocation({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();

  const {
    countryList,
    countryCurrentPage,
    countryPageLimit,
    isAddCountry,
    isUpdateCountry,
    isDeleteCountry,
    countrySearchParam,
    countryLoading,
  } = useSelector(({ country }) => country);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [countryModel, setCountryModel] = useState(false);
  const [countryDataValue, setCountryDataValue] = useState(initialData);

  const getCountryListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getCountryList({
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
    getCountryListApi(countryCurrentPage, countryPageLimit, countrySearchParam);
  }, []);

  useEffect(() => {
    if (isAddCountry || isUpdateCountry || isDeleteCountry) {
      getCountryListApi(
        countryCurrentPage,
        countryPageLimit,
        countrySearchParam,
      );
      resetForm();
      setCountryModel(false);
      setCountryDataValue(initialData);
    }
    if (isUpdateCountry) {
      dispatch(setIsUpdateCountry(false));
    }
    if (isAddCountry) {
      dispatch(setIsAddCountry(false));
    }
    if (isDeleteCountry) {
      dispatch(setIsDeleteCountry(false));
    }
  }, [dispatch, isAddCountry, isUpdateCountry, isDeleteCountry]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          country_id: values?._id,
          country: values?.country,
          isActive: values?.isActive,
        };
        dispatch(editCountry(payload));
      } else {
        dispatch(addCountry(values));
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
  } = useFormik({
    enableReinitialize: true,
    initialValues: countryDataValue,
    validationSchema: countrySchema,
    onSubmit: submitHandle,
  });

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
      //             dispatch(getCountryData({ country_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setCountryDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching country data:', error);
      //               });

      //             setCountryModel(true);
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
              dispatch(getCountryData({ country_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setCountryDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching country data:', error);
                });

              setCountryModel(true);
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
  const onPageChange = useCallback(
    page => {
      if (page !== countryCurrentPage) {
        let pageIndex = countryCurrentPage;
        if (page?.page === 'Prev') pageIndex--;
        else if (page?.page === 'Next') pageIndex++;
        else pageIndex = page;
        dispatch(setCountryCurrentPage(pageIndex));
        getCountryListApi(pageIndex, countryPageLimit, countrySearchParam);
      }
    },
    [
      dispatch,
      countryPageLimit,
      getCountryListApi,
      countryCurrentPage,
      countrySearchParam,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(setCountryCurrentPage(page === 0 ? 0 : 1));
      dispatch(setCountryPageLimit(page));
      const pageValue =
        page === 0
          ? countryList?.totalRows
            ? countryList?.totalRows
            : 0
          : page;
      const prevPageValue =
        countryPageLimit === 0
          ? countryList?.totalRows
            ? countryList?.totalRows
            : 0
          : countryPageLimit;
      if (
        prevPageValue < countryList?.totalRows ||
        pageValue < countryList?.totalRows
      ) {
        getCountryListApi(page === 0 ? 0 : 1, page, countrySearchParam);
      }
    },
    [
      dispatch,
      countryPageLimit,
      getCountryListApi,
      countrySearchParam,
      countryList?.totalRows,
    ],
  );

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      country_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteCountry(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const onCancel = useCallback(() => {
    resetForm();
    setCountryDataValue(initialData);
    setCountryModel(false);
  }, [resetForm]);

  const handleSearchInput = e => {
    dispatch(setCountryCurrentPage(1));
    getCountryListApi(1, countryPageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

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
        <Button className="btn_border" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="country_location_wrap">
      {countryLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Country</h3>
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
                        value={countrySearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setCountrySearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  {is_create_access === true && (
                    <li>
                      <Button
                        onClick={() => {
                          setCountryDataValue(initialData);
                          setCountryModel(true);
                        }}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" /> Create Country
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
            value={countryList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="country" header="Country Name" sortable></Column>
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
            dataList={countryList?.list}
            pageLimit={countryPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={countryCurrentPage}
            totalCount={countryList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'country'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Country' : 'Create Country'}
        visible={countryModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="country">
                  Country Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="country"
                  placeholder="Country Name"
                  className="input_wrap"
                  name="country"
                  value={values?.country || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.country && errors?.country && (
                  <p className="text-danger">{errors?.country}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
