import React, { useEffect, useState, useCallback } from 'react';
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
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCurrency,
  deleteCurrency,
  editCurrency,
  getCurrencyList,
  setCurrencyCurrentPage,
  setCurrencyPageLimit,
  setIsAddCurrency,
  setIsDeleteCurrency,
  setIsUpdateCurrency,
  setCurrencySearchParam,
  getCurrencyData,
} from 'Store/Reducers/Settings/Master/CurrencySlice';
import { useFormik } from 'formik';
import { currrencyTypeSchema } from 'Schema/Setting/masterSettingSchema';
import { InputNumber } from 'primereact/inputnumber';

let initalData = {
  id: '',
  currency_name: '',
  currency_code: '',
  exchange_rate: '',
  isActive: true,
};

export default function Currency({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    currencyList,
    currencyCurrentPage,
    currencyPageLimit,
    isAddCurrency,
    isUpdateCurrency,
    isDeleteCurrency,
    currencySearchParam,
    currencyLoading,
  } = useSelector(({ currency }) => currency);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [devicesModel, setDevicesModel] = useState(false);
  const [currencyDataValue, setCurrencyDataValue] = useState(initalData);

  useEffect(() => {
    dispatch(
      getCurrencyList({
        start: currencyCurrentPage,
        limit: currencyPageLimit,
        isActive: '',
        search: currencySearchParam,
      }),
    );
  }, [dispatch, currencyCurrentPage, currencyPageLimit]);

  useEffect(() => {
    if (isAddCurrency || isUpdateCurrency || isDeleteCurrency) {
      dispatch(
        getCurrencyList({
          start: currencyCurrentPage,
          limit: currencyPageLimit,
          isActive: '',
          search: currencySearchParam,
        }),
      );
    }
    if (isUpdateCurrency) {
      dispatch(setIsUpdateCurrency(false));
    }
    if (isAddCurrency) {
      dispatch(setIsAddCurrency(false));
    }
    if (isDeleteCurrency) {
      dispatch(setIsDeleteCurrency(false));
    }
  }, [
    isAddCurrency,
    isUpdateCurrency,
    isDeleteCurrency,
    dispatch,
    currencyCurrentPage,
    currencyPageLimit,
    currencySearchParam,
  ]);

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
                  dispatch(getCurrencyData({ currency_id: row?._id }))
                    .then(response => {
                      const responseData = response.payload?.data;
                      setCurrencyDataValue(responseData);
                    })
                    .catch(error => {
                      console.error('Error fetching currency data:', error);
                    });

                  setDevicesModel(true);
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

  const onPageChange = page => {
    let pageIndex = currencyCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setCurrencyCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setCurrencyCurrentPage(page === 0 ? 0 : 1));
    dispatch(setCurrencyPageLimit(page));
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        currency_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteCurrency(deleteItemObj));
      }
      setDeletePopup(false);
    },
    [dispatch, deleteId],
  );

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      if (values?._id) {
        const payload = {
          currency_id: values?._id,
          currency_name: values?.currency_name,
          currency_code: values?.currency_code,
          exchange_rate: values?.exchange_rate,
          isActive: values?.isActive,
        };
        dispatch(editCurrency(payload));
      } else {
        dispatch(addCurrency(values));
      }
      resetForm();
      setDevicesModel(false);
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
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: currencyDataValue,
    validationSchema: currrencyTypeSchema,
    onSubmit: submitHandle,
  });
  const onCancel = useCallback(() => {
    resetForm();
    setDevicesModel(false);
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
    dispatch(setCurrencyCurrentPage(1));
    dispatch(
      getCurrencyList({
        start: 1,
        limit: currencyPageLimit,
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
      {currencyLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Currency</h3>
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
                            value={currencySearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setCurrencySearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setCurrencyDataValue(initalData);
                              setDevicesModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Add Currency
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
                value={currencyList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="currency_name"
                  header="Currency Name"
                  sortable
                ></Column>
                <Column
                  field="currency_code"
                  header="Currency Code"
                  sortable
                ></Column>
                <Column
                  field="exchange_rate"
                  header="Exchange Rate"
                  sortable
                ></Column>
                <Column
                  field="isActive"
                  header="Status"
                  sortable
                  body={statusBodyTemplate}
                  style={{ width: '10%' }}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={currencyList?.list}
                pageLimit={currencyPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={currencyCurrentPage}
                totalCount={currencyList?.totalRows}
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
        header="Currency"
        visible={devicesModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="Name">Name</label>
                <InputText
                  id="Name"
                  placeholder="Name"
                  className="input_wrap"
                  value={values?.currency_name || ''}
                  name="currency_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.currency_name && errors?.currency_name && (
                  <p className="text-danger">{errors?.currency_name}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="Code">Code</label>
                <InputText
                  id="Code"
                  placeholder="Code"
                  className="input_wrap"
                  value={values?.currency_code || ''}
                  name="currency_code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.currency_code && errors?.currency_code && (
                  <p className="text-danger">{errors?.currency_code}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="ExchangeRate">Exchange Rate</label>
                <InputNumber
                  id="ExchangeRate"
                  placeholder="Exchange Rate"
                  value={values?.exchange_rate || ''}
                  name="exchange_rate"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('exchange_rate', e.value);
                  }}
                  required
                />
                {touched?.exchange_rate && errors?.exchange_rate && (
                  <p className="text-danger">{errors?.exchange_rate}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
