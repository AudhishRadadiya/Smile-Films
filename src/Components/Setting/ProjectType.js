import React, { useEffect, useState, useCallback } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
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
import { useFormik } from 'formik';
import { projectTypeSchema } from 'Schema/Setting/masterSettingSchema';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProjectType,
  deleteProjectType,
  editProjectType,
  getProjectTypeList,
  setProjectTypeCurrentPage,
  setProjectTypePageLimit,
  setIsAddProjectType,
  setIsDeleteProjectType,
  setIsUpdateProjectType,
  setProjectTypeSearchParam,
  getProjectType,
} from 'Store/Reducers/Settings/Master/ProjectTypeSlice';

let initalData = {
  project_type: '',
  project_price: 0,
  isActive: true,
};

export default function ProjectType({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    projectTypeList,
    projectTypeCurrentPage,
    projectTypePageLimit,
    isAddProjectType,
    isUpdateProjectType,
    isDeleteProjectType,
    projectTypeSearchParam,
    projectTypeLoading,
  } = useSelector(({ projectType }) => projectType);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [projectTypeModel, setProjectTypeModel] = useState(false);
  const [projectTypeDataValue, setProjectTypeDataValue] = useState(initalData);

  const getProjectTypeListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getProjectTypeList({
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
    getProjectTypeListApi(
      projectTypeCurrentPage,
      projectTypePageLimit,
      projectTypeSearchParam,
    );
  }, []);

  useEffect(() => {
    if (isAddProjectType || isUpdateProjectType || isDeleteProjectType) {
      getProjectTypeListApi(
        projectTypeCurrentPage,
        projectTypePageLimit,
        projectTypeSearchParam,
      );
      resetForm();
      setProjectTypeModel(false);
      setProjectTypeDataValue(initalData);
    }
    if (isUpdateProjectType) {
      dispatch(setIsUpdateProjectType(false));
    }
    if (isAddProjectType) {
      dispatch(setIsAddProjectType(false));
    }
    if (isDeleteProjectType) {
      dispatch(setIsDeleteProjectType(false));
    }
  }, [dispatch, isAddProjectType, isUpdateProjectType, isDeleteProjectType]);

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
      //             dispatch(getProjectType({ project_type_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setProjectTypeDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching project type data:', error);
      //               });
      //             setProjectTypeModel(true);
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
              dispatch(getProjectType({ project_type_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setProjectTypeDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching project type data:', error);
                });
              setProjectTypeModel(true);
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
      if (page !== projectTypeCurrentPage) {
        let pageIndex = projectTypeCurrentPage;
        if (page?.page === 'Prev') pageIndex--;
        else if (page?.page === 'Next') pageIndex++;
        else pageIndex = page;
        dispatch(setProjectTypeCurrentPage(pageIndex));
        getProjectTypeListApi(
          pageIndex,
          projectTypePageLimit,
          projectTypeSearchParam,
        );
      }
    },
    [
      dispatch,
      getProjectTypeListApi,
      projectTypeCurrentPage,
      projectTypePageLimit,
      projectTypeSearchParam,
    ],
  );

  const onPageRowsChange = page => {
    dispatch(setProjectTypeCurrentPage(page === 0 ? 0 : 1));
    dispatch(setProjectTypePageLimit(page));
    const pageValue =
      page === 0
        ? projectTypeList?.totalRows
          ? projectTypeList?.totalRows
          : 0
        : page;
    const prevPageValue =
      projectTypePageLimit === 0
        ? projectTypeList?.totalRows
          ? projectTypeList?.totalRows
          : 0
        : projectTypePageLimit;
    if (
      prevPageValue < projectTypeList?.totalRows ||
      pageValue < projectTypeList?.totalRows
    ) {
      getProjectTypeListApi(page === 0 ? 0 : 1, page, projectTypeSearchParam);
    }
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      project_type_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteProjectType(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          project_type: values?.project_type,
          project_type_id: values?._id,
          project_price: values?.project_price,
          isActive: values?.isActive,
        };
        dispatch(editProjectType(payload));
      } else {
        dispatch(addProjectType(values));
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
    initialValues: projectTypeDataValue,
    validationSchema: projectTypeSchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    resetForm();
    setProjectTypeDataValue(initalData);
    setProjectTypeModel(false);
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
    dispatch(setProjectTypeCurrentPage(1));
    getProjectTypeListApi(1, projectTypePageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );
  return (
    <div className="main_Wrapper">
      {projectTypeLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Project Type</h3>
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
                            value={projectTypeSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(
                                setProjectTypeSearchParam(e.target.value),
                              );
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setProjectTypeDataValue(initalData);
                              setProjectTypeModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Project
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
                value={projectTypeList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="project_type"
                  header="Project Type"
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
                dataList={projectTypeList?.list}
                pageLimit={projectTypePageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={projectTypeCurrentPage}
                totalCount={projectTypeList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'project type'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Project Type' : 'Create Project Type'}
        visible={projectTypeModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="project_type" l>
                  Project Type <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="project_type"
                  placeholder="Project Type"
                  className="input_wrap"
                  value={values?.project_type}
                  name="project_type"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.project_type && errors?.project_type && (
                  <p className="text-danger">{errors?.project_type}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="project_price">
                  Price <span className="text-danger fs-6">*</span>
                </label>
                <InputNumber
                  id="project_price"
                  placeholder="Write Price"
                  name="project_price"
                  useGrouping={false}
                  value={values?.project_price}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('project_price', e.value);
                  }}
                  required
                />
                {touched?.project_price && errors?.project_price && (
                  <p className="text-danger">{errors?.project_price}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
