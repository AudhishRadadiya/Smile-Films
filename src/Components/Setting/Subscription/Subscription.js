import React, { useEffect, useState, useCallback } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ActionBtn from '../../../Assets/Images/action.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import CompanySidebar from '../CompanySidebar';
import Loader from 'Components/Common/Loader';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import CustomPaginator from 'Components/Common/CustomPaginator';
import _ from 'lodash';
import {
  addSubscription,
  deleteSubscription,
  editSubscription,
  getSubscription,
  getSubscriptionList,
  setIsAddSubscription,
  setIsDeleteSubscription,
  setIsUpdateSubscription,
  setSubscriptionCurrentPage,
  setSubscriptionPageLimit,
  setSubscriptionSearchParam,
} from 'Store/Reducers/Settings/Subscription/SubscriptionSlice';
import { useFormik } from 'formik';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
import { subscriptionSchema } from 'Schema/Setting/masterSettingSchema';

let initialData = {
  name: '',
  duration: 0,
  price: 0,
  description: '',
  isActive: true,
};

export default function Subscription({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const [subscriptionDataValue, setSubscriptionDataValue] =
    useState(initialData);
  const [subscriptionModel, setSubscriptionModel] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const {
    subscriptionList,
    subscriptionLoading,
    isAddSubscription,
    isUpdateSubscription,
    isDeleteSubscription,
    subscriptionCurrentPage,
    subscriptionPageLimit,
    subscriptionSearchParam,
  } = useSelector(({ subscription }) => subscription);

  useEffect(() => {
    dispatch(
      getSubscriptionList({
        start: subscriptionCurrentPage,
        limit: subscriptionPageLimit,
        isActive: '',
        search: subscriptionSearchParam?.trim(),
      }),
    );
  }, [dispatch, setSubscriptionCurrentPage, setSubscriptionPageLimit]);

  useEffect(() => {
    if (isAddSubscription || isUpdateSubscription || isDeleteSubscription) {
      dispatch(
        getSubscriptionList({
          start: subscriptionCurrentPage,
          limit: subscriptionPageLimit,
          isActive: '',
          search: subscriptionSearchParam?.trim(),
        }),
      );
      setSubscriptionDataValue(initialData);
      resetForm();
      setSubscriptionModel(false);
    }
    if (isUpdateSubscription) {
      dispatch(setIsUpdateSubscription(false));
    }
    if (isAddSubscription) {
      dispatch(setIsAddSubscription(false));
    }
    if (isDeleteSubscription) {
      dispatch(setIsDeleteSubscription(false));
    }
  }, [dispatch, isAddSubscription, isUpdateSubscription, isDeleteSubscription]);

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
      //             dispatch(getSubscription({ subscription_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setSubscriptionDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching subscription data:', error);
      //               });

      //             setSubscriptionModel(true);
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
              dispatch(getSubscription({ subscription_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setSubscriptionDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching subscription data:', error);
                });

              setSubscriptionModel(true);
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

  const statusBodyTemplate = subscription => {
    return (
      <Tag
        value={subscription.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(subscription)}
      ></Tag>
    );
  };

  const getSeverity = subscription => {
    switch (subscription.isActive) {
      case true:
        return 'active';

      case false:
        return 'inactive';

      default:
        return null;
    }
  };

  const onPageChange = page => {
    let pageIndex = subscriptionCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setSubscriptionCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setSubscriptionCurrentPage(page === 0 ? 0 : 1));
    dispatch(setSubscriptionPageLimit(page));
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      subscription_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteSubscription(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          subscription_id: values?._id,
          name: values?.name,
          duration: values?.duration,
          price: values?.price,
          description: values?.description,
          isActive: values?.isActive,
        };
        dispatch(editSubscription(payload));
      } else {
        dispatch(addSubscription(values));
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
    initialValues: subscriptionDataValue,
    validationSchema: subscriptionSchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    resetForm();
    setSubscriptionModel(false);
    setSubscriptionDataValue(initialData);
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
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setSubscriptionCurrentPage(1));
    dispatch(
      getSubscriptionList({
        start: 1,
        limit: subscriptionPageLimit,
        isActive: '',
        search: e.target.value.trim(),
      }),
    );
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {subscriptionLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Subscription</h3>
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
                            value={subscriptionSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(
                                setSubscriptionSearchParam(e.target.value),
                              );
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setSubscriptionDataValue(initialData);
                              setSubscriptionModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" />
                            Create Subscription
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
                value={subscriptionList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="name"
                  header="Subscription Name"
                  sortable
                ></Column>
                <Column field="duration" header="Duration" sortable></Column>
                <Column field="price" header="Price" sortable></Column>
                <Column
                  field="description"
                  header="Description"
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
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={subscriptionList?.list}
                pageLimit={subscriptionPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={subscriptionCurrentPage}
                totalCount={subscriptionList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'subscription'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Subscription' : 'Create Subscription'}
        visible={subscriptionModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="name">
                  Subscription Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="name"
                  placeholder="Subscription Name"
                  className="input_wrap"
                  value={values?.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.name && errors?.name && (
                  <p className="text-danger">{errors?.name}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="duration">
                  Duration <span className="text-danger fs-6">*</span>
                </label>
                <InputNumber
                  id="duration"
                  placeholder="Duration"
                  className="input_wrap"
                  value={values?.duration}
                  name="duration"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('duration', e.value);
                  }}
                  required
                />
                {touched?.duration && errors?.duration && (
                  <p className="text-danger">{errors?.duration}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="price">
                  Price <span className="text-danger fs-6">*</span>
                </label>
                <InputNumber
                  id="price"
                  placeholder="Price"
                  name="price"
                  useGrouping={false}
                  value={values?.price}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('price', e.value);
                  }}
                  required
                />
                {touched?.price && errors?.price && (
                  <p className="text-danger">{errors?.price}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="description">Description</label>
                <InputText
                  id="description"
                  placeholder="Description"
                  className="input_wrap"
                  value={values?.description}
                  useGrouping={false}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.description && errors?.description && (
                  <p className="text-danger">{errors?.description}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
