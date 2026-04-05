import React, { useState, useCallback, useEffect, memo } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { emailRegex } from 'Helper/CommonHelper';
import { RadioButton } from 'primereact/radiobutton';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addEmployee,
  editEmployee,
  setIsGetInitialValuesEmployee,
  uploadFile,
  clearAddSelectedEmployeeData,
  clearUpdateSelectedEmployeeData,
  setAddSelectedEmployeeData,
  setUpdateSelectedEmployeeData,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';
import Loader from 'Components/Common/Loader';
import EmpImg from '../../../Assets/Images/emp-img.jpg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import AddUpload from '../../../Assets/Images/add-upload-img.svg';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import { accountType, bloodGroup, maritalStatus } from 'Helper/CommonList';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getCompanyList } from 'Store/Reducers/Settings/CompanySetting/CompanySlice';
import { getRoleList } from 'Store/Reducers/Settings/Master/RolesAndPermissionSlice';
import { getDropdownGroupList } from 'Store/Reducers/Settings/AccountMaster/GroupSlice';

const EmployeeDetail = ({ initialValues }) => {
  window.scrollTo(0, 0);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [roleOptionList, setRoleOptionList] = useState([]);
  const [dropdownOptionList, setDropdownOptionList] = useState({
    cityOptionList: [],
    stateOptionList: [],
    groupOptionList: [],
    countryOptionList: [],
    companyOptionList: [],
    exposingItemOptionList: [],
  });

  const { cityLoading } = useSelector(({ city }) => city);
  const { stateLoading } = useSelector(({ state }) => state);
  const { countryLoading } = useSelector(({ country }) => country);
  const { productLoading } = useSelector(({ product }) => product);
  const { packageLoading } = useSelector(({ packages }) => packages);
  const { roleLoading } = useSelector(({ rolePermission }) => rolePermission);
  const { companyLoading } = useSelector(({ company }) => company);
  const { groupLoading } = useSelector(({ group }) => group);
  const {
    employeeLoading,
    uploadfileLoading,
    addSelectedEmployeeData,
    getEmployeeNumberLoading,
    updateSelectedEmployeeData,
    isGetInitialValuesEmployee,
  } = useSelector(({ employee }) => employee);

  const employeeSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(1, 'First Name must be at least 1 characters')
      .max(100, 'First Name cannot exceed 100 characters')
      .required('First Name is required'),
    last_name: Yup.string()
      .min(1, 'Last Name must be at least 1 characters')
      .max(100, 'Last Name cannot exceed 100 characters')
      .required('Last Name is required'),
    email_id: Yup.string()
      .matches(emailRegex, 'Invalid email address')
      .required('Email is required'),
    mobile_no: Yup.string()
      .matches(/^\d{10}$/, 'Mobile Number must be a 10-digit number')
      .required('Mobile Number is required'),
    user_email_id: Yup.string()
      // .email('Invalid Email')
      .matches(emailRegex, 'Invalid email address')
      .required('User Email is required'),
    company_name: Yup.string().required('Company name is required'),
    gender: Yup.string().required('Please select a gender'),
    blood_group: Yup.string().nullable(),
    marital_status: Yup.string().required('Marital status is required'),
    role: Yup.string().required('Role is required'),
    group_name: Yup.string().required('Group Name is required'),
    opening_balance: Yup.number()
      .max(10000000, 'Opening Balance should be maximum 10000000')
      .notRequired(),
    country: Yup.string().notRequired(),
    state: Yup.string().notRequired(),
    city: Yup.string().notRequired(),
    password: id ? Yup.string() : Yup.string().required('Password is required'),
    isChecker: Yup.boolean().notRequired(),
    // editing_package: Yup.string().when('isChecker', value => {
    //   return value.includes(true)
    //     ? Yup.string().required('Please select a Item')
    //     : Yup.string().notRequired();
    // }),
    editing_package: Yup.array().when('isChecker', {
      is: true,
      then: () => Yup.array().min(1, 'Please select a Item'),
      otherwise: () => Yup.array().notRequired(),
    }),
  });

  const fetchPackageAndProductData = async (type = 1) => {
    const packageData = await dispatch(
      getPackageList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        ...(type !== 3 && { type }),
      }),
    );

    const updatedPackageData =
      packageData?.payload?.data?.list?.map(item => ({
        label: item?.package_name,
        value: item?._id,
      })) || [];

    const productData = await dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        ...(type !== 3 && { type }),
      }),
    );

    const updatedProductData =
      productData?.payload?.data?.list?.map(item => ({
        label: item?.item_name,
        value: item?._id,
      })) || [];

    return { updatedPackageData, updatedProductData };
  };

  useEffect(() => {
    if (Object.keys(initialValues)?.length > 0) {
      // dispatch(
      //   getPackageList({
      //     start: 0,
      //     limit: 0,
      //     isActive: true,
      //     search: '',
      //     type: 1,
      //   }),
      // )
      //   .then(packageResponse => {
      //     const packageData =
      //       packageResponse?.payload?.data?.list?.map(item => ({
      //         label: item?.package_name,
      //         value: item?._id,
      //       })) || [];

      //     return { packageData };
      //   })
      //   .then(({ packageData }) => {
      //     return dispatch(
      //       getProductList({
      //         start: 0,
      //         limit: 0,
      //         isActive: true,
      //         search: '',
      //         type: 1,
      //       }),
      //     ).then(productResponse => {
      //       const productData =
      //         productResponse?.payload?.data?.list?.map(item => ({
      //           label: item?.item_name,
      //           value: item?._id,
      //         })) || [];

      //       return { packageData, productData };
      //     });
      //   })

      fetchPackageAndProductData(initialValues?.type ? initialValues?.type : 1)
        .then(({ updatedPackageData, updatedProductData }) => {
          return dispatch(
            getCompanyList({
              start: 0,
              limit: 0,
              isActive: true,
              search: '',
            }),
          )
            .then(companyResponse => {
              const companyData = companyResponse?.payload?.list || [];

              return dispatch(
                getDropdownGroupList({
                  start: 0,
                  limit: 0,
                  isActive: true,
                  search: '',
                }),
              )
                .then(async groupResponse => {
                  let cityData = [];
                  let stateData = [];
                  const nameList = [];

                  const isSuccessCountry = await dispatch(
                    getCountryList({
                      start: 0,
                      limit: 0,
                      isActive: true,
                      search: '',
                    }),
                  );

                  const countryData = isSuccessCountry.payload?.data?.list?.map(
                    item => {
                      return { label: item?.country, value: item?._id };
                    },
                  );

                  if (initialValues?.country && id) {
                    const isSuccessState = await dispatch(
                      getStateList({
                        country_id: initialValues?.country,
                        start: 0,
                        limit: 0,
                        isActive: true,
                      }),
                    );

                    const isSuccessCity = await dispatch(
                      getCityList({
                        country_id: initialValues?.country,
                        state_id: initialValues?.state,
                        start: 0,
                        limit: 0,
                        isActive: true,
                      }),
                    );

                    stateData = isSuccessState.payload?.data?.list?.map(
                      item => ({
                        label: item?.state,
                        value: item?._id,
                      }),
                    );

                    cityData = isSuccessCity.payload?.data?.list?.map(item => ({
                      label: item?.city,
                      value: item?._id,
                    }));
                  }

                  groupResponse?.payload?.forEach(item => {
                    nameList.push({
                      label: item?.group_name,
                      value: item?._id,
                    });
                  });

                  const groupOptionList = [{ label: 'Name', items: nameList }];

                  const companyDataOption = companyData.map(item => ({
                    label: item?.company_name,
                    value: item?._id,
                  }));

                  const exposingItemOptionList = [
                    { label: 'Package', items: updatedPackageData },
                    { label: 'Product', items: updatedProductData },
                  ];

                  setDropdownOptionList({
                    ...dropdownOptionList,
                    groupOptionList,
                    exposingItemOptionList,
                    cityOptionList: cityData,
                    stateOptionList: stateData,
                    countryOptionList: countryData,
                    companyOptionList: companyDataOption,
                  });
                })
                .catch(error => {
                  console.error('Error fetching group data:', error);
                });
            })
            .catch(error => {
              console.error('Error fetching company data:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching package data:', error);
        });
    }
    if (id && initialValues?.company_name) {
      handleCompanySelect(initialValues?.company_name);
      setFieldValue('password', '');
    }
  }, [dispatch, initialValues]);

  // useEffect(() => {
  //   if (roleList?.list?.length > 0 && productList?.list?.length > 0) {
  //     const roleData = roleList?.list?.map(item => {
  //       return { label: item?.name, value: item?._id };
  //     });
  //     const productItemData = productList?.list?.map(item => {
  //       return { label: item?.item_name, value: item?._id };
  //     });

  //     setDropdownOptionList({
  //       ...dropdownOptionList,
  //       exposingItemOptionList: productItemData,
  //       roleOptionList: roleData,
  //     });
  //   }
  // }, [roleList, productList]);

  const loadStateData = useCallback(
    async e => {
      const isSuccessState = await dispatch(
        getStateList({
          country_id: e,
          start: 0,
          limit: 0,
          isActive: true,
        }),
      );
      if (isSuccessState?.payload?.data?.list?.length) {
        const stateData = isSuccessState?.payload?.data?.list?.map(item => {
          return { label: item?.state, value: item?._id };
        });

        setDropdownOptionList({
          ...dropdownOptionList,
          stateOptionList: stateData,
        });
      }
    },
    [dispatch, dropdownOptionList],
  );

  const loadCityData = useCallback(
    async (e, countryData) => {
      const isSuccessCity = await dispatch(
        getCityList({
          country_id: countryData,
          state_id: e,
          start: 0,
          limit: 0,
          isActive: true,
        }),
      );

      if (isSuccessCity?.payload?.data?.list?.length) {
        const cityData = isSuccessCity?.payload?.data?.list?.map(item => {
          return { label: item?.city, value: item?._id };
        });

        setDropdownOptionList({
          ...dropdownOptionList,
          cityOptionList: cityData,
        });
      }
    },
    [dispatch, dropdownOptionList],
  );

  const fileHandler = async (key, files) => {
    const uploadedFile = files[0];

    if (files[0]) {
      const fileSizeLimit = 10 * 1024 * 1024; // 10MB limit

      if (uploadedFile?.size <= fileSizeLimit) {
        const result = await dispatch(uploadFile(uploadedFile));
        if (result) {
          const fileName = result?.payload?.data?.file;
          commonUpdateFieldValue(key, fileName);
        }
      } else {
        toast.error(`Upload File must not be larger than 10mb.`);
      }
    }
  };
  const groupLableTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
      dispatch(
        setUpdateSelectedEmployeeData({
          ...updateSelectedEmployeeData,
          [fieldName]: fieldValue,
        }),
      );
    } else {
      dispatch(
        setAddSelectedEmployeeData({
          ...addSelectedEmployeeData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleMultiFieldValues = fieldObject => {
    if (id) {
      dispatch(
        setUpdateSelectedEmployeeData({
          ...updateSelectedEmployeeData,
          ...fieldObject,
        }),
      );
    } else {
      dispatch(
        setAddSelectedEmployeeData({
          ...addSelectedEmployeeData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const handleCompanySelect = Value => {
    dispatch(
      getRoleList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        company_id: Value,
      }),
    ).then(responseData => {
      const roleData = responseData?.payload?.data?.list?.map(item => {
        return { label: item?.name, value: item?._id };
      });
      setRoleOptionList(roleData);
    });
  };

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const payload = {
        ...values,
        ...(id && { employee_id: id }),
        birth_date: values?.birth_date
          ? moment(values?.birth_date).format('YYYY-MM-DD')
          : '',
        joining_date: values?.joining_date
          ? moment(values?.joining_date).format('YYYY-MM-DD')
          : '',
      };

      if (id) {
        dispatch(editEmployee(payload))
          .then(response => {
            if (response.payload?.data) {
              navigate('/employee');
              dispatch(
                setIsGetInitialValuesEmployee({
                  ...isGetInitialValuesEmployee,
                  update: false,
                }),
              );
              dispatch(clearUpdateSelectedEmployeeData());
              resetForm();
            }
          })
          .catch(error => {
            console.error('Error fetching while Edit employee:', error);
          });
      } else {
        dispatch(addEmployee(payload))
          .then(response => {
            if (response.payload?.data) {
              navigate('/employee');
              dispatch(
                setIsGetInitialValuesEmployee({
                  ...isGetInitialValuesEmployee,
                  add: false,
                }),
              );
              dispatch(clearAddSelectedEmployeeData());
              resetForm();
            }
          })
          .catch(error => {
            console.error('Error fetching while Add employee:', error);
          });
      }
    },
    [id, dispatch, navigate, isGetInitialValuesEmployee],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: employeeSchema,
    onSubmit: submitHandle,
  });

  const handleCancel = () => {
    if (id) {
      dispatch(
        setIsGetInitialValuesEmployee({
          ...isGetInitialValuesEmployee,
          update: false,
        }),
      );
      dispatch(clearUpdateSelectedEmployeeData());
    } else {
      dispatch(
        setIsGetInitialValuesEmployee({
          ...isGetInitialValuesEmployee,
          add: false,
        }),
      );
      dispatch(clearAddSelectedEmployeeData());
    }
    navigate('/employee');
  };

  const handleItemType = useCallback(
    (fieldName, fieldValue) => {
      setFieldValue(fieldName, fieldValue);

      fetchPackageAndProductData(fieldValue).then(
        ({ updatedPackageData, updatedProductData }) => {
          const changeFieldValues = {
            [fieldName]: fieldValue,
            editing_package: [],
          };

          handleMultiFieldValues(changeFieldValues);

          const exposingItemOptionList = [
            { label: 'Package', items: updatedPackageData },
            { label: 'Product', items: updatedProductData },
          ];

          setDropdownOptionList({
            ...dropdownOptionList,
            exposingItemOptionList,
          });
        },
      );
    },
    [dropdownOptionList],
  );

  return (
    <div className="main_Wrapper">
      {(roleLoading ||
        cityLoading ||
        groupLoading ||
        stateLoading ||
        companyLoading ||
        countryLoading ||
        packageLoading ||
        productLoading ||
        employeeLoading ||
        uploadfileLoading ||
        getEmployeeNumberLoading) && <Loader />}
      <div className="create_emp_wrap">
        <div className="create_emp_left_wrap p20 p15-xs radius15 bg-white border">
          <div className="emp_id_card_wrap">
            <div className="profile_img_wrap">
              {values?.image ? (
                <img
                  src={values?.image || EmpImg}
                  alt=""
                  className="user_img"
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    fontSize: 'xxx-large',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {values?.first_name && values?.last_name
                    ? `${values?.first_name?.charAt(0)?.toUpperCase()}
                          ${values?.last_name?.charAt(0)?.toUpperCase()}`
                    : 'UN'}
                </div>
              )}
              {/* <img src={EmpImg} alt="EmployeeImg" /> */}
              <div className="upload_profile_custom">
                <InputText
                  type="file"
                  id="UserUploadFile"
                  accept=".png, .jpg, .jpeg"
                  value={''}
                  name="image"
                  style={{ visibility: 'hidden', opacity: 0 }}
                  onChange={e => fileHandler(e.target.name, e.target.files)}
                />
                <label htmlFor="UserUploadFile">
                  <img src={AddUpload} alt="AddUploadImage" />
                </label>
              </div>
              {values?.image && (
                <div
                  className="profile_trash_icon"
                  onClick={() => {
                    setFieldValue('image', '');
                  }}
                >
                  <label className="ml-2">
                    <img src={TrashIcon} alt="" />
                  </label>
                  <span>Remove Profile</span>
                </div>
              )}
            </div>
            <h2>
              {values?.first_name
                ? values?.first_name + ' ' + values?.last_name
                : 'Full Name'}
            </h2>
            <h3> {values?.role_name}</h3>
            <h3 className="mb25">
              Emp No: {values?.emp_no ? values?.emp_no : 'N/A'}
            </h3>
            <ul>
              <li>
                <label>Location</label>
                <span>
                  {values?.current_address ? values?.current_address : 'N/A'}
                </span>
              </li>
              <li>
                <label>Blood Group</label>
                <span>
                  {' '}
                  {values?.blood_group
                    ? bloodGroup?.find(x => x?.value === values?.blood_group)
                        ?.label
                    : 'N/A'}
                </span>
              </li>
            </ul>
            {/* <Button className="btn_primary mt15">Download</Button> */}
          </div>
        </div>
        <div className="create_emp_right_wrap add_cmnylist_right">
          <h4>Primary Details</h4>
          <div className="primary_details_wrap bg-white radius15 border p20 p15-xs mb20">
            <Row>
              <Col xl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="first_name">
                    First Name <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="first_name"
                    placeholder="First Name"
                    className="input_wrap"
                    name="first_name"
                    value={values?.first_name}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {touched?.first_name && errors?.first_name && (
                    <p className="text-danger">{errors?.first_name}</p>
                  )}
                </div>
              </Col>
              <Col xl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="last_name">
                    Last Name <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="last_name"
                    placeholder="Last Name"
                    className="input_wrap"
                    name="last_name"
                    value={values?.last_name}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {touched?.last_name && errors?.last_name && (
                    <p className="text-danger">{errors?.last_name}</p>
                  )}
                </div>
              </Col>
              <Col xl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="email_id">
                    Emails <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="email_id"
                    placeholder="Email"
                    className="input_wrap"
                    name="email_id"
                    value={values?.email_id}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {touched?.email_id && errors?.email_id && (
                    <p className="text-danger">{errors?.email_id}</p>
                  )}
                </div>
              </Col>
              <Col xl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="mobile_no">
                    Mobile No <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="mobile_no"
                    placeholder="Mobile No"
                    className="input_wrap"
                    name="mobile_no"
                    value={values?.mobile_no}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {touched?.mobile_no && errors?.mobile_no && (
                    <p className="text-danger">{errors?.mobile_no}</p>
                  )}
                </div>
              </Col>
              <Col xl={4} sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="birth_date">Birth Date</label>
                  <Calendar
                    id="birth_date"
                    placeholder="Birth Date"
                    showIcon
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    name="birth_date"
                    value={values?.birth_date}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    onBlur={handleBlur}
                    showButtonBar
                  />
                </div>
              </Col>
              <Col xl={4} sm={6}>
                <div className="form_group">
                  <label className="me-3">Gender</label>
                  <div className="radio_wrapper d-flex flex-wrap align-items-center mb20">
                    <div className="radio-inner-wrap d-flex align-items-center me-3">
                      <RadioButton
                        inputId="Male"
                        name="gender"
                        value={1}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                        onBlur={handleBlur}
                        checked={values?.gender === 1}
                      />
                      <label htmlFor="Male" className="ms-md-2 ms-1">
                        Male
                      </label>
                    </div>
                    <div className="radio-inner-wrap d-flex align-items-center me-3">
                      <RadioButton
                        inputId="Female"
                        name="gender"
                        value={2}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                        onBlur={handleBlur}
                        checked={values?.gender === 2}
                      />
                      <label htmlFor="Female" className="ms-md-2 ms-1">
                        Female
                      </label>
                    </div>
                    <div className="radio-inner-wrap d-flex align-items-center">
                      <RadioButton
                        inputId="Other"
                        name="gender"
                        value={3}
                        checked={values?.gender === 3}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                        onBlur={handleBlur}
                      />
                      <label htmlFor="Other" className="ms-md-2 ms-1">
                        Other
                      </label>
                    </div>
                    {touched?.gender && errors?.gender && (
                      <p className="text-danger">{errors?.gender}</p>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl={12} lg={12}>
                <Row>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="blood_group">Blood Group</label>
                      <ReactSelectSingle
                        filter
                        id="blood_group"
                        options={bloodGroup}
                        placeholder="Blood Group"
                        value={values?.blood_group}
                        name="blood_group"
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="marital_status">
                        Marital Status{' '}
                        <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        id="marital_status"
                        options={maritalStatus}
                        placeholder="Marital Status"
                        value={values?.marital_status}
                        name="marital_status"
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.value);
                        }}
                      />
                      {touched?.marital_status &&
                        errors?.marital_status &&
                        !values?.marital_status && (
                          <p className="text-danger">
                            {errors?.marital_status}
                          </p>
                        )}
                    </div>
                  </Col>

                  <Col xl={4} sm={6}>
                    <div className="form_group">
                      <label className="me-3">Item Type</label>
                      <div className="radio_wrapper d-flex flex-wrap align-items-center mb20">
                        <div className="radio-inner-wrap d-flex align-items-center me-3">
                          <RadioButton
                            inputId="Editing"
                            name="type"
                            value={1}
                            onBlur={handleBlur}
                            onChange={e => {
                              handleItemType(e.target.name, e.target.value);
                            }}
                            checked={values?.type === 1}
                          />
                          <label htmlFor="ingredient1" className="ms-sm-2 ms-1">
                            Editing
                          </label>
                        </div>
                        <div className="radio-inner-wrap d-flex align-items-center me-3">
                          <RadioButton
                            inputId="Exposing"
                            name="type"
                            value={2}
                            onBlur={handleBlur}
                            onChange={e => {
                              handleItemType(e.target.name, e.target.value);
                            }}
                            checked={values?.type === 2}
                          />
                          <label htmlFor="ingredient2" className="ms-sm-2 ms-1">
                            Exposing
                          </label>
                        </div>
                        <div className="radio-inner-wrap d-flex align-items-center">
                          <RadioButton
                            inputId="Both"
                            name="type"
                            value={3}
                            onBlur={handleBlur}
                            onChange={e => {
                              handleItemType(e.target.name, e.target.value);
                            }}
                            checked={values?.type === 3}
                          />
                          <label htmlFor="ingredient3" className="ms-sm-2 ms-1">
                            Both
                          </label>
                        </div>
                      </div>
                      {touched?.type && errors?.type && (
                        <p className="text-danger">{errors?.type}</p>
                      )}
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="address">Address</label>
                      <InputTextarea
                        id="address"
                        placeholder="Address"
                        className="input_wrap"
                        rows={3}
                        name="current_address"
                        value={values?.current_address}
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="country">Country</label>
                      <ReactSelectSingle
                        filter
                        id="country"
                        name="country"
                        placeholder="Select Country"
                        value={values?.country || ''}
                        options={dropdownOptionList?.countryOptionList}
                        onChange={e => {
                          setFieldValue('country', e.value);
                          setFieldValue('state', '');
                          setFieldValue('city', '');
                          setDropdownOptionList({
                            ...dropdownOptionList,
                            stateOptionList: [],
                            cityOptionList: [],
                          });
                          loadStateData(e.value);
                        }}
                        onBlur={handleBlur}
                      />
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="state">State</label>
                      <ReactSelectSingle
                        filter
                        id="state"
                        name="state"
                        placeholder="Select State"
                        value={values?.state || ''}
                        options={dropdownOptionList?.stateOptionList}
                        onChange={e => {
                          setFieldValue('state', e.value);
                          setDropdownOptionList({
                            ...dropdownOptionList,
                            cityOptionList: [],
                          });
                          loadCityData(e.value, values?.country);
                        }}
                        onBlur={handleBlur}
                      />
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label htmlFor="city">City</label>
                      <ReactSelectSingle
                        filter
                        id="city"
                        name="city"
                        placeholder="Select City"
                        value={values?.city || ''}
                        options={dropdownOptionList?.cityOptionList}
                        onChange={e => {
                          setFieldValue('city', e.value);
                        }}
                        onBlur={handleBlur}
                      />
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <label>
                        Group Name <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        options={dropdownOptionList?.groupOptionList}
                        value={values?.group_name}
                        name="group_name"
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue(e.target.name, e.value);
                        }}
                        optionLabel="label"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        optionGroupTemplate={groupLableTemplate}
                        placeholder="Group Name"
                      />
                      {touched &&
                        touched?.group_name &&
                        errors &&
                        errors?.group_name &&
                        !values?.group_name && (
                          <p className="text-danger">{errors?.group_name}</p>
                        )}
                    </div>
                  </Col>
                  <Col xl={4} sm={6}>
                    <div className="form_group mb-3">
                      <div className="opn_balance_wrap d-flex justify-content-between mb10">
                        <label htmlFor="OpeningBalance">Opening Balance</label>
                        <div className="radio_wrapper d-flex align-items-center">
                          <div className="radio-inner-wrap d-flex align-items-center me-2">
                            <RadioButton
                              inputId="Credits"
                              name="opening_balance_type"
                              value={1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values?.opening_balance_type === 1}
                            />
                            <label htmlFor="Credits" className="ms-md-2 ms-1">
                              Credits
                            </label>
                          </div>
                          <div className="radio-inner-wrap d-flex align-items-center">
                            <RadioButton
                              inputId="Debits"
                              name="opening_balance_type"
                              value={2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values?.opening_balance_type === 2}
                            />
                            <label htmlFor="Debits" className="ms-md-2 ms-1">
                              Debits
                            </label>
                          </div>
                        </div>
                      </div>
                      <InputNumber
                        id="opening_balance"
                        name="opening_balance"
                        placeholder="opening Balance"
                        value={values?.opening_balance}
                        onChange={e => {
                          setFieldValue('opening_balance', e.value);
                        }}
                        min={0}
                        onBlur={handleBlur}
                        useGrouping={false}
                        maxFractionDigits={2}
                      />
                      {touched?.opening_balance && errors?.opening_balance && (
                        <p className="text-danger">{errors?.opening_balance}</p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl={4} lg={12}>
                {/* <div className="upload_file_custom">
                    <InputText
                      type="file"
                      id="fileUpload"
                      accept="image/*"
                      value={''}
                    />
                    <label htmlFor="fileUpload">
                      <iframe
                        src={UploadIcon}
                        alt="PAN Card"
                        className="img-fluid"
                        title="Pan Card"
                      /
                      <div className="upload_text">
                        Upload your images Choose
                        <span className="text_primary d-block">
                          Files PNG, JPG
                        </span>
                      </div>
                    </label>
                  </div> */}
              </Col>
            </Row>
          </div>
          <h4>Bank Details</h4>
          <div className="bank_details_wrap bg-white radius15 border p20 p15-xs mb20">
            <Row>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="bank_first_name">
                    First Name (As per Bank Passbook)
                  </label>
                  <InputText
                    id="bank_first_name"
                    placeholder="First Name"
                    className="input_wrap"
                    name="bank_first_name"
                    value={values?.bank_first_name || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="bank_last_name">
                    Last Name (As per Bank Passbook)
                  </label>
                  <InputText
                    id="bank_last_name"
                    placeholder="Last Name"
                    className="input_wrap"
                    name="bank_last_name"
                    value={values?.bank_last_name || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="bank_name">Bank Name</label>
                  <InputText
                    id="bank_name"
                    placeholder="Bank Name"
                    className="input_wrap"
                    name="bank_name"
                    value={values?.bank_name || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="account_type">Account Type</label>
                  <ReactSelectSingle
                    filter
                    id="account_type"
                    options={accountType}
                    value={values?.account_type || ''}
                    name="account_type"
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.value);
                    }}
                    placeholder="Account Type"
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="account_no">Account Number</label>
                  <InputText
                    id="account_no"
                    placeholder="Account Number"
                    className="input_wrap"
                    name="account_no"
                    value={values?.account_no || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="ifsc_code">IFSC Code</label>
                  <InputText
                    id="ifsc_code"
                    placeholder="IFSC Code"
                    className="input_wrap"
                    name="ifsc_code"
                    value={values?.ifsc_code || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <h4>Office Details</h4>
          <div className="office_details_wrap bg-white radius15 border p20 p15-xs mb20">
            <Row>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="company_name">
                    Company Name <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="company_name"
                    options={dropdownOptionList?.companyOptionList}
                    value={values?.company_name}
                    name="company_name"
                    onBlur={handleBlur}
                    onChange={e => {
                      handleCompanySelect(e.value);
                      commonUpdateFieldValue(e.target.name, e.value);
                    }}
                    placeholder="Select Company name"
                  />
                  {touched?.company_name &&
                    errors?.company_name &&
                    !values?.company_name && (
                      <p className="text-danger">{errors?.company_name}</p>
                    )}
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="user_email_id">
                    User Email ID <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    id="user_email_id"
                    placeholder="User Email ID"
                    className="input_wrap"
                    name="user_email_id"
                    value={values?.user_email_id || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  />
                  {touched?.user_email_id && errors?.user_email_id && (
                    <p className="text-danger">{errors?.user_email_id}</p>
                  )}
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="password">
                    Password <span className="text-danger fs-6">*</span>
                  </label>
                  <Password
                    id="password"
                    placeholder="Password"
                    className="w-100"
                    name="password"
                    feedback={false}
                    value={values?.password || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    toggleMask
                  />
                  {/* <InputText
                    id="password"
                    placeholder="Password"
                    className="input_wrap"
                    name="password"
                    value={values?.password}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    required
                  /> */}
                  {touched?.password && errors?.password && (
                    <p className="text-danger">{errors?.password}</p>
                  )}
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="emp_no">Emp No</label>
                  <InputText
                    id="emp_no"
                    placeholder="Emp No"
                    className="input_wrap"
                    name="emp_no"
                    value={values?.emp_no || ''}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group date_select_wrapper mb-3">
                  <label htmlFor="joining_date">Joining Date</label>
                  <Calendar
                    id="joining_date"
                    placeholder="Joining Date"
                    showIcon
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    name="joining_date"
                    value={values?.joining_date || ''}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.target.value);
                    }}
                    onBlur={handleBlur}
                    showButtonBar
                  />
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label htmlFor="Role">
                    Role <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    id="role"
                    options={roleOptionList}
                    value={values?.role || ''}
                    name="role"
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue(e.target.name, e.value);
                    }}
                    placeholder="Select Role"
                    required
                  />
                  {touched &&
                    touched?.role &&
                    errors &&
                    errors?.role &&
                    !values?.role && (
                      <p className="text-danger">{errors?.role}</p>
                    )}
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <div className="d-flex align-items-center mb10">
                    <Checkbox
                      inputId="ingredient1"
                      name="isChecker"
                      value={values?.isChecker || false}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.checked);
                      }}
                      checked={values?.isChecker}
                      required
                    />
                    <label htmlFor="ingredient1" className="ms-2">
                      Checker
                    </label>
                  </div>
                  {values?.isChecker && (
                    <MultiSelect
                      options={dropdownOptionList?.exposingItemOptionList}
                      value={values?.editing_package}
                      name="editing_package"
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      onBlur={handleBlur}
                      optionLabel="label"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionGroupTemplate={groupLableTemplate}
                      placeholder="Select Items"
                      className="w-100"
                    />
                  )}
                  {/* {touched &&
                    touched?.editing_package &&
                    errors &&
                    errors?.editing_package &&
                    !values?.editing_package && (
                      <p className="text-danger">{errors?.editing_package}</p>
                    )} */}
                  {touched?.editing_package && errors?.editing_package && (
                    <p className="text-danger">{errors?.editing_package}</p>
                  )}
                </div>
              </Col>
              <Col xxl={4} sm={6}>
                <div className="radio_wrapper d-flex flex-wrap align-items-center mb20">
                  <div className="radio-inner-wrap d-flex align-items-center me-3">
                    <RadioButton
                      inputId="Fix Salary"
                      name="salary_type"
                      value={1}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      onBlur={handleBlur}
                      checked={values?.salary_type === 1}
                    />
                    <label htmlFor="Fix Salary" className="ms-2">
                      Fix Salary
                    </label>
                  </div>
                  <div className="radio-inner-wrap d-flex align-items-center me-3">
                    <RadioButton
                      inputId="Commission"
                      name="salary_type"
                      value={2}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      onBlur={handleBlur}
                      checked={values?.salary_type === 2}
                    />
                    <label htmlFor="Commission" className="ms-2">
                      Commission
                    </label>
                  </div>
                  <div className="radio-inner-wrap d-flex align-items-center">
                    <RadioButton
                      inputId="Freelancer"
                      name="salary_type"
                      value={3}
                      checked={values?.salary_type === 3}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="Freelancer" className="ms-2">
                      Freelancer
                    </label>
                  </div>
                </div>
                <InputText
                  id="salary_amount"
                  placeholder="Salary Amount"
                  className="input_wrap"
                  name="salary_amount"
                  value={values?.salary_amount || ''}
                  onBlur={handleBlur}
                  onChange={e => {
                    commonUpdateFieldValue(e.target.name, e.target.value);
                  }}
                />
              </Col>
              <Col xxl={4} sm={6}>
                <div className="form_group mb-3">
                  <label>Status</label>
                  <div className="checkbox_wrap">
                    <Checkbox
                      inputId="StatusActive"
                      name="isActive"
                      value={values?.isActive}
                      checked={values?.isActive}
                      onChange={e =>
                        commonUpdateFieldValue(e.target.name, e.target.checked)
                      }
                    />
                    <label htmlFor="StatusActive">Active</label>
                  </div>
                  {touched?.isActive && errors?.isActive && (
                    <p className="text-danger">{errors?.isActive}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="btn_group d-flex justify-content-end">
            <Button onClick={handleCancel} className="btn_border_dark mx-1">
              Exit Page
            </Button>
            <Button
              className="btn_primary mx-1"
              type="submit"
              onClick={handleSubmit}
            >
              {id ? 'Update Employee' : 'Save Employee'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(EmployeeDetail);
