import React, { useCallback, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRoles,
  editRoles,
  clearSetAddRoleList,
  clearSetUpdateRoleList,
  setIsAddUpdateRole,
} from 'Store/Reducers/Settings/Master/RolesAndPermissionSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { addRolePermissionSchema } from 'Schema/Setting/masterSettingSchema';
import Loader from 'Components/Common/Loader';

const subPermissions = ['create', 'view', 'delete', 'export', 'edit'];
export default function RolePermissionDetail({ initialValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAddUpdateRole, allModuleList, roleLoading } = useSelector(
    ({ rolePermission }) => rolePermission,
  );

  const submitHandle = useCallback(
    async values => {
      const payload = {
        role_name: values?.role_name,
        permission: [],
        isActive: values?.isActive,
        ...(id && { role_id: id }),
      };

      values?.permission?.forEach(main => {
        main?.submodules?.forEach(sub => {
          const { name, key, _id, ...rest } = sub;
          payload.permission.push({
            ...rest,
            sub_module_key: key,
          });
        });
      });
      let allObj = allModuleList?.find(d => d?.name === 'All');
      if (allObj) {
        payload.permission.push({
          main_module_key: allObj?.submodules[0]?.main_module_key,
          sub_module_key: allObj?.submodules[0]?.key,
          create: true,
          edit: true,
          view: true,
          export: true,
          delete: true,
        });
      }
      if (id) {
        dispatch(editRoles(payload));
      } else {
        dispatch(addRoles(payload));
      }
    },
    [dispatch, id, allModuleList],
  );

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addRolePermissionSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (isAddUpdateRole) {
      resetForm();
      dispatch(clearSetUpdateRoleList());
      dispatch(setIsAddUpdateRole(false));
      navigate('/role-permission');
    }
  }, [isAddUpdateRole]);

  const handleCheckboxes = useCallback(
    (mainI, subI, val) => {
      setFieldValue(`permission[${mainI}].submodules[${subI}].create`, val);
      setFieldValue(`permission[${mainI}].submodules[${subI}].view`, val);
      setFieldValue(`permission[${mainI}].submodules[${subI}].delete`, val);
      setFieldValue(`permission[${mainI}].submodules[${subI}].edit`, val);
      setFieldValue(`permission[${mainI}].submodules[${subI}].export`, val);
    },
    [setFieldValue],
  );

  const onSelectRowAll = useCallback(
    (mainIndex, subIndex, val) => {
      setFieldValue(`permission[${mainIndex}].isSelectedAll`, val);
      handleCheckboxes(mainIndex, subIndex, val);
    },
    [handleCheckboxes, setFieldValue],
  );

  const onSelectAll = useCallback(
    (mainIndex, val) => {
      setFieldValue(`permission[${mainIndex}].isSelectedAll`, val);
      for (
        let i = 0;
        i < values?.permission[mainIndex].submodules?.length;
        i++
      ) {
        handleCheckboxes(mainIndex, i, val);
      }
    },
    [handleCheckboxes, setFieldValue, values?.permission],
  );

  const areAllSubPermissionsSelected = useCallback(
    (mainIndex, subIndex) => {
      return subPermissions.every(
        permission =>
          values?.permission?.[mainIndex]?.submodules?.[subIndex]?.[
            permission
          ] === true,
      );
    },
    [values?.permission],
  );

  const areAllPermissionsSelected = useCallback(
    mainIndex => {
      return subPermissions.every(permission =>
        values?.permission?.[mainIndex]?.submodules?.every(
          sub => sub[permission] === true,
        ),
      );
    },
    [values?.permission],
  );

  // const onCancel = useCallback(() => {
  //   dispatch(clearSelectedRolePermissions());
  //   navigate('/role-and-permissions');
  // }, [dispatch, navigate]);

  const handleCancel = () => {
    if (id) {
      dispatch(clearSetUpdateRoleList());
    } else {
      dispatch(clearSetAddRoleList());
    }
    navigate('/role-permission');
  };

  return (
    <div className="main_Wrapper">
      {roleLoading && <Loader />}
      <div className="add_role_permission_wrap p20 border bg-white radius15">
        <Row className="align-items-center">
          <Col lg={4} md={5} sm={6}>
            <div className="form_group mb30 mb15-sm">
              <label htmlFor="RoleName">
                Role Name <span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="RoleName"
                name="role_name"
                value={values?.role_name}
                placeholder="Write Role Name"
                className="input_wrap"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched?.role_name && errors?.role_name && (
                <p className="text-danger">{errors?.role_name}</p>
              )}
            </div>
          </Col>
          <Col sm={4}>
            <div className="form_group mb10">
              <div className="d-flex align-items-center">
                <Checkbox
                  inputId="ingredient1"
                  name="isActive"
                  checked={values?.isActive}
                  onChange={e => setFieldValue('isActive', e.target.checked)}
                />
                {touched?.isActive && errors?.isActive && (
                  <p className="text-danger">{errors?.isActive}</p>
                )}
                <label htmlFor="ingredient1" className="ms-2">
                  Active
                </label>
              </div>
            </div>
          </Col>
        </Row>
        <div className="permission_wrapper">
          <h5>Permission</h5>
          <div className="accordion_wrapper">
            <Accordion activeIndex={0}>
              {values?.permission &&
                values?.permission?.length > 0 &&
                values?.permission?.map((data, mainI) => {
                  return (
                    <AccordionTab
                      key={mainI}
                      header={
                        <div className="d-flex justify-content-between flex-wrap align-items-center">
                          <span>{data?.name}</span>
                          <div className="d-flex align-items-center">
                            <Checkbox
                              inputId="ingredient1"
                              name="Active"
                              value={data?.isSelectedAll}
                              onChange={e =>
                                onSelectAll(mainI, e.target.checked)
                              }
                              checked={areAllPermissionsSelected(mainI)}
                            />
                            <label htmlFor="ingredient1" className="ms-2">
                              Select All
                            </label>
                          </div>
                        </div>
                      }
                    >
                      {data?.submodules?.map((y, subI) => {
                        return (
                          <div className="accordion_inner" key={subI}>
                            <Row>
                              <Col lg={2}>
                                <span>{y?.name}</span>
                              </Col>
                              <Col lg={8}>
                                <div className="add_role_check_wrap">
                                  <ul>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="Create"
                                          name="create"
                                          value={y?.create}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].create`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.create
                                          }
                                        />
                                        <label
                                          htmlFor="Create"
                                          className="ms-2"
                                        >
                                          Create
                                        </label>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="Edit"
                                          name="Edit"
                                          value={y?.edit}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].edit`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.edit
                                          }
                                        />
                                        <label htmlFor="Edit" className="ms-2">
                                          Edit
                                        </label>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="View"
                                          name="View"
                                          value={y?.view}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].view`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.view
                                          }
                                        />
                                        <label htmlFor="View" className="ms-2">
                                          View
                                        </label>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="Export"
                                          name="Export"
                                          value={y?.export}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].export`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.export
                                          }
                                        />
                                        <label
                                          htmlFor="Export"
                                          className="ms-2"
                                        >
                                          Export
                                        </label>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="Delete"
                                          name="Delete"
                                          value={y?.delete}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].delete`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.delete
                                          }
                                        />
                                        <label
                                          htmlFor="Delete"
                                          className="ms-2"
                                        >
                                          Delete
                                        </label>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="form_group checkbox_wrap with_input mt-0 justify-content-lg-end">
                                  <Checkbox
                                    inputId="Active"
                                    name="Active"
                                    value="Active"
                                    onChange={e =>
                                      onSelectRowAll(
                                        mainI,
                                        subI,
                                        e.target.checked,
                                        values,
                                      )
                                    }
                                    checked={areAllSubPermissionsSelected(
                                      mainI,
                                      subI,
                                    )}
                                  />
                                  <label htmlFor="Active" className="ms-1">
                                    Select All
                                  </label>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                      {/* <div className="accordion_inner">
                        <Row>
                          <Col lg={2}>
                            <span>Create Client</span>
                          </Col>
                          <Col lg={10}>
                            <div className="add_role_check_wrap">
                              <ul>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Create"
                                      name="inquiry"
                                      value="Create"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Create')}
                                    />
                                    <label htmlFor="Create" className="ms-2">
                                      Create
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Edit"
                                      name="inquiry"
                                      value="Edit"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Edit')}
                                    />
                                    <label htmlFor="Edit" className="ms-2">
                                      Edit
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="View"
                                      name="inquiry"
                                      value="View"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('View')}
                                    />
                                    <label htmlFor="View" className="ms-2">
                                      View
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Export"
                                      name="inquiry"
                                      value="Export"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Export')}
                                    />
                                    <label htmlFor="Export" className="ms-2">
                                      Export
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Delete"
                                      name="inquiry"
                                      value="Delete"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Delete')}
                                    />
                                    <label htmlFor="Delete" className="ms-2">
                                      Delete
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="accordion_inner">
                        <Row>
                          <Col lg={2}>
                            <span>Change Status</span>
                          </Col>
                          <Col lg={10}>
                            <div className="add_role_check_wrap">
                              <ul>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Create"
                                      name="inquiry"
                                      value="Create"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Create')}
                                    />
                                    <label htmlFor="Create" className="ms-2">
                                      Create
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Edit"
                                      name="inquiry"
                                      value="Edit"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Edit')}
                                    />
                                    <label htmlFor="Edit" className="ms-2">
                                      Edit
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="View"
                                      name="inquiry"
                                      value="View"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('View')}
                                    />
                                    <label htmlFor="View" className="ms-2">
                                      View
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Export"
                                      name="inquiry"
                                      value="Export"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Export')}
                                    />
                                    <label htmlFor="Export" className="ms-2">
                                      Export
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <Checkbox
                                      inputId="Delete"
                                      name="inquiry"
                                      value="Delete"
                                      onChange={onIngredientsChange}
                                      checked={ingredients.includes('Delete')}
                                    />
                                    <label htmlFor="Delete" className="ms-2">
                                      Delete
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                      </div> */}
                    </AccordionTab>
                  );
                })}
            </Accordion>
          </div>
          <div className="btn_group d-flex align-items-center justify-content-end">
            <Button className="btn_border_dark" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="btn_primary ms-2"
              onClick={handleSubmit}
              type="submit"
            >
              {id ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
