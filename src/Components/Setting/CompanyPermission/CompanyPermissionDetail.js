import { useCallback, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  editCompanyPermission,
  clearSetUpdateCompanyList,
  setIsAddUpdateCompany,
} from 'Store/Reducers/Settings/CompanySetting/CompanyAndPermissionSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from 'Components/Common/Loader';
import { companyPermissionSchema } from 'Schema/Setting/masterSettingSchema';
import { permissions } from 'Store/Reducers/Auth/authSlice';

const subPermissions = ['is_active'];

export default function CompanyPermissionDetail({ initialValues }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAddUpdateCompany, allModuleList, companyPermissionLoading } =
    useSelector(({ companyPermission }) => companyPermission);

  const submitHandle = useCallback(
    async values => {
      const payload = {
        company_name: values?.company_name,
        permission: [],
        isActive: values?.isActive,
        ...(id && { company_id: id }),
        ...(initialValues.isActive !== values?.isActive && {
          status: 'change',
        }),
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
          is_active: true,
        });
      }
      if (id) {
        dispatch(editCompanyPermission(payload))
          .then(() => {
            dispatch(permissions());
          })
          .catch(error => {
            console.error('Permission Error:', error);
          });
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
    validationSchema: companyPermissionSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (isAddUpdateCompany) {
      resetForm();
      dispatch(clearSetUpdateCompanyList());
      dispatch(setIsAddUpdateCompany(false));
      navigate('/company-permission');
    }
  }, [isAddUpdateCompany]);

  const handleCheckboxes = useCallback(
    (mainI, subI, val) => {
      setFieldValue(`permission[${mainI}].submodules[${subI}].is_active`, val);
    },
    [setFieldValue],
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

  const handleCancel = () => {
    dispatch(clearSetUpdateCompanyList());
    navigate('/company-permission');
  };

  return (
    <div className="main_Wrapper">
      {companyPermissionLoading && <Loader />}
      <div className="add_company_permission_wrap p20 border bg-white radius15">
        <Row className="align-items-center">
          <Col lg={4} md={5} sm={6}>
            <div className="form_group mb30 mb15-sm">
              <label htmlFor="company_name">
                Company Name <span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="company_name"
                name="company_name"
                value={values?.company_name}
                placeholder="Write Company Name"
                className="input_wrap"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
              />
              {touched?.company_name && errors?.company_name && (
                <p className="text-danger">{errors?.company_name}</p>
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
                                <div className="add_company_check_wrap">
                                  <ul>
                                    <li>
                                      <div className="d-flex align-items-center">
                                        <Checkbox
                                          inputId="is_active"
                                          name="is_active"
                                          value={y?.is_active}
                                          onChange={e =>
                                            setFieldValue(
                                              `permission[${mainI}].submodules[${subI}].is_active`,
                                              e.target.checked,
                                            )
                                          }
                                          checked={
                                            values?.permission[mainI]
                                              ?.submodules[subI]?.is_active
                                          }
                                        />
                                        <label
                                          htmlFor="is_active"
                                          className="ms-2"
                                        >
                                          isActive
                                        </label>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
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
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
