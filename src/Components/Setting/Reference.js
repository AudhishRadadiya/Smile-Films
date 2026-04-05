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
  addReference,
  deleteReference,
  editReference,
  getReferenceList,
  setReferenceCurrentPage,
  setReferencePageLimit,
  setIsAddReference,
  setIsDeleteReference,
  setIsUpdateReference,
  setReferenceSearchParam,
  getReferenceData,
} from 'Store/Reducers/Settings/Master/ReferenceSlice';
import { useFormik } from 'formik';
import { referencesTypeSchema } from 'Schema/Setting/masterSettingSchema';

let initialData = {
  reference_name: '',
  isActive: true,
};

export default function Reference({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    referenceList,
    referenceCurrentPage,
    referencePageLimit,
    isAddReference,
    isUpdateReference,
    isDeleteReference,
    referenceSearchParam,
    referenceLoading,
  } = useSelector(({ references }) => references);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [referenceModel, setReferenceModel] = useState(false);
  const [referenceDataValue, setReferenceDataValue] = useState(initialData);

  const getReferenceListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getReferenceList({
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
    getReferenceListApi(
      referenceCurrentPage,
      referencePageLimit,
      referenceSearchParam,
    );
  }, []);

  useEffect(() => {
    if (isAddReference || isUpdateReference || isDeleteReference) {
      getReferenceListApi(
        referenceCurrentPage,
        referencePageLimit,
        referenceSearchParam,
      );
      resetForm();
      setReferenceModel(false);
      setReferenceDataValue(initialData);
    }
    if (isUpdateReference) {
      dispatch(setIsUpdateReference(false));
    }
    if (isAddReference) {
      dispatch(setIsAddReference(false));
    }
    if (isDeleteReference) {
      dispatch(setIsDeleteReference(false));
    }
  }, [dispatch, isAddReference, isUpdateReference, isDeleteReference]);

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
      //             dispatch(getReferenceData({ reference_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setReferenceDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching reference data:', error);
      //               });
      //             setReferenceModel(true);
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
              dispatch(getReferenceData({ reference_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setReferenceDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching reference data:', error);
                });
              setReferenceModel(true);
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
    if (page !== referenceCurrentPage) {
      let pageIndex = referenceCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setReferenceCurrentPage(pageIndex));
      getReferenceListApi(pageIndex, referencePageLimit, referenceSearchParam);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setReferenceCurrentPage(page === 0 ? 0 : 1));
    dispatch(setReferencePageLimit(page));
    const pageValue =
      page === 0
        ? referenceList?.totalRows
          ? referenceList?.totalRows
          : 0
        : page;
    const prevPageValue =
      referencePageLimit === 0
        ? referenceList?.totalRows
          ? referenceList?.totalRows
          : 0
        : referencePageLimit;
    if (
      prevPageValue < referenceList?.totalRows ||
      pageValue < referenceList?.totalRows
    ) {
      getReferenceListApi(page === 0 ? 0 : 1, page, referenceSearchParam);
    }
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      reference_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteReference(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          reference_name: values?.reference_name,
          reference_id: values?._id,
          isActive: values?.isActive,
        };
        dispatch(editReference(payload));
      } else {
        dispatch(addReference(values));
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
    initialValues: referenceDataValue,
    validationSchema: referencesTypeSchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    resetForm();
    setReferenceModel(false);
    setReferenceDataValue(initialData);
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
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setReferenceCurrentPage(1));
    getReferenceListApi(1, referencePageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {referenceLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Reference</h3>
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
                            value={referenceSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setReferenceSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setReferenceDataValue(initialData);
                              setReferenceModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Reference
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
                value={referenceList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="reference_name"
                  header="Reference"
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
                dataList={referenceList?.list}
                pageLimit={referencePageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={referenceCurrentPage}
                totalCount={referenceList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'reference'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Reference' : 'Create Reference'}
        visible={referenceModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="Name">
                  Reference Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="Name"
                  placeholder="Reference Name"
                  className="input_wrap"
                  value={values?.reference_name || ''}
                  name="reference_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.reference_name && errors?.reference_name && (
                  <p className="text-danger">{errors?.reference_name}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
