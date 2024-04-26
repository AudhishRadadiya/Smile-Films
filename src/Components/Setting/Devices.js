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
import { devicesTypeSchema } from 'Schema/Setting/masterSettingSchema';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDevices,
  deleteDevices,
  editDevices,
  getDevicesList,
  setDevicesCurrentPage,
  setDevicesPageLimit,
  setIsAddDevices,
  setIsDeleteDevices,
  setIsUpdateDevices,
  setDevicesSearchParam,
  getDeviceData,
} from 'Store/Reducers/Settings/Master/DevicesSlice';
import { useFormik } from 'formik';

let initialData = {
  id: '',
  device_name: '',
  isActive: true,
};

export default function Devices({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    devicesList,
    devicesCurrentPage,
    devicesPageLimit,
    isAddDevices,
    isUpdateDevices,
    isDeleteDevices,
    devicesSearchParam,
    devicesLoading,
  } = useSelector(({ devices }) => devices);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [devicesModel, setDevicesModel] = useState(false);
  const [deviceDataValue, setDeviceDataValue] = useState(initialData);

  useEffect(() => {
    dispatch(
      getDevicesList({
        start: devicesCurrentPage,
        limit: devicesPageLimit,
        isActive: '',
        search: devicesSearchParam,
      }),
    );
  }, [dispatch, devicesCurrentPage, devicesPageLimit]);

  useEffect(() => {
    if (isAddDevices || isUpdateDevices || isDeleteDevices) {
      dispatch(
        getDevicesList({
          start: devicesCurrentPage,
          limit: devicesPageLimit,
          isActive: '',
          search: devicesSearchParam,
        }),
      );
    }
    if (isUpdateDevices) {
      dispatch(setIsUpdateDevices(false));
    }
    if (isAddDevices) {
      dispatch(setIsAddDevices(false));
    }
    if (isDeleteDevices) {
      dispatch(setIsDeleteDevices(false));
    }
  }, [
    isAddDevices,
    isUpdateDevices,
    isDeleteDevices,
    dispatch,
    devicesCurrentPage,
    devicesPageLimit,
    devicesSearchParam,
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
                  dispatch(getDeviceData({ device_id: row?._id }))
                    .then(response => {
                      const responseData = response.payload?.data;
                      setDeviceDataValue(responseData);
                    })
                    .catch(error => {
                      console.error('Error fetching product data:', error);
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
    let pageIndex = devicesCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setDevicesCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setDevicesCurrentPage(page === 0 ? 0 : 1));
    dispatch(setDevicesPageLimit(page));
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        device_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteDevices(deleteItemObj));
      }
      setDeletePopup(false);
    },
    [dispatch, deleteId],
  );

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      if (values?._id) {
        const payload = {
          device_name: values?.device_name,
          device_id: values?._id,
          isActive: values?.isActive,
        };
        dispatch(editDevices(payload));
      } else {
        dispatch(addDevices(values));
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
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: deviceDataValue,
    validationSchema: devicesTypeSchema,
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
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          Save
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setDevicesCurrentPage(1));
    dispatch(
      getDevicesList({
        start: 1,
        limit: devicesPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {devicesLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Devices</h3>
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
                            value={devicesSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setDevicesSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setDeviceDataValue(initialData);
                              setDevicesModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Devices
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
                value={devicesList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="device_name" header="Devices" sortable></Column>
                <Column
                  field="status"
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
                dataList={devicesList?.list}
                pageLimit={devicesPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={devicesCurrentPage}
                totalCount={devicesList?.totalRows}
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
        header="Devices"
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
                <label htmlFor="DeviceName">Device Name</label>
                <InputText
                  id="DeviceName"
                  placeholder="Write Name"
                  className="input_wrap"
                  value={values?.device_name || ''}
                  name="device_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.device_name && errors?.device_name && (
                  <p className="text-danger">{errors?.device_name}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
