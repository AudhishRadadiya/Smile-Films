import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CompanySidebar from '../CompanySidebar';
import CompanyLogo from '../../../Assets/Images/company_logo.png';
import UploadLogo from '../../../Assets/Images/upload-logo.svg';
import { InputText } from 'primereact/inputtext';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { companySchema } from 'Schema/Setting/companySchema';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useDispatch, useSelector } from 'react-redux';
import { getCountryList } from 'Store/Reducers/Settings/Master/CountrySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { toast } from 'react-toastify';
import { uploadFile } from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';
import {
  addCompany,
  clearAddSelectedCompanyData,
  clearUpdateSelectedCompanyData,
  editCompany,
  setAddSelectedCompanyData,
  setIsGetInitialValues,
  setUpdateSelectedCompanyData,
} from 'Store/Reducers/Settings/CompanySetting/CompanySlice';
import { Checkbox } from 'primereact/checkbox';
import { BusinessType } from 'Helper/CommonList';
import Loader from 'Components/Common/Loader';
import TrashIcon from '../../../Assets/Images/trash.svg';

export default function CompanyDetail({ initialValues }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    addSelectedCompanyData,
    updateSelectedCompanyData,
    isGetInitialValues,
    companyLoading,
  } = useSelector(({ company }) => company);
  const { uploadfileLoading } = useSelector(({ employee }) => employee);
  const [dropdownOption, setDropdownOption] = useState({
    countryOptionList: [],
    stateOptionList: [],
    cityOptionList: [],
  });

  const loadData = useCallback(async () => {
    const res = await dispatch(
      getCountryList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );

    if (res?.payload?.data?.list?.length) {
      const countyData = res?.payload?.data?.list?.map(item => {
        return { label: item?.country, value: item?._id };
      });
      // if (countyData?.length) {
      //   setDropdownOption({ ...dropdownOption, countryOptionList: countyData });
      // }
      if (countyData?.length) {
        setDropdownOption(prevState => ({
          ...prevState,
          countryOptionList: countyData,
        }));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitHandle = useCallback(
    async values => {
      if (id) {
        let payload = {
          ...values,
          company_id: id,
        };
        dispatch(editCompany(payload));
        dispatch(
          setIsGetInitialValues({ ...isGetInitialValues, update: false }),
        );
        dispatch(clearUpdateSelectedCompanyData());
      } else {
        dispatch(addCompany(values));
        dispatch(setIsGetInitialValues({ ...isGetInitialValues, add: false }));
        dispatch(clearAddSelectedCompanyData());
      }
      navigate('/company-list');
    },
    [id, dispatch, navigate, isGetInitialValues],
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
    validationSchema: companySchema,
    onSubmit: submitHandle,
  });

  const fetchData = useCallback(async () => {
    const isSuccessState = await dispatch(
      getStateList({
        country_id: values?.country,
        start: 0,
        limit: 0,
        isActive: true,
      }),
    );

    if (isSuccessState?.payload?.data?.list?.length) {
      const stateData = isSuccessState?.payload?.data?.list?.map(item => {
        return { label: item?.state, value: item?._id };
      });

      if (stateData?.length && values?.state) {
        const isSuccessCity = await dispatch(
          getCityList({
            country_id: values?.country,
            state_id: values?.state,
            start: 0,
            limit: 0,
            isActive: true,
          }),
        );

        if (isSuccessCity?.payload?.data?.list?.length) {
          const cityData = isSuccessCity?.payload?.data?.list?.map(item => {
            return { label: item?.city, value: item?._id };
          });

          if (cityData?.length) {
            setDropdownOption(prevState => ({
              ...prevState,
              stateOptionList: stateData,
              cityOptionList: cityData,
            }));

            // setDropdownOption({
            //   ...dropdownOption,
            //   stateOptionList: stateData,
            //   cityOptionList: cityData,
            // });
          }
        } else {
          setDropdownOption(prevState => ({
            ...prevState,
            cityOptionList: [],
          }));
          // setDropdownOption({ ...dropdownOption, cityOptionList: [] });
        }
      }
    } else {
      // setDropdownOption({
      //   ...dropdownOption,
      //   stateOptionList: [],
      //   cityOptionList: [],
      // });
      setDropdownOption(prevState => ({
        ...prevState,
        stateOptionList: [],
        cityOptionList: [],
      }));
    }
  }, [dispatch, values?.country, values?.state, dropdownOption]);

  useEffect(() => {
    if (id && values?.country && values?.state) {
      fetchData();
    }
  }, [id, values?.country, values?.state]);

  const handleCountryChange = useCallback(
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

        if (stateData?.length) {
          setDropdownOption({ ...dropdownOption, stateOptionList: stateData });
        }
      } else {
        setDropdownOption({ ...dropdownOption, stateOptionList: [] });
      }
    },
    [dispatch, dropdownOption],
  );

  const handleStateChange = useCallback(
    async e => {
      const isSuccessCity = await dispatch(
        getCityList({
          country_id: values?.country,
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

        if (cityData?.length) {
          setDropdownOption({ ...dropdownOption, cityOptionList: cityData });
        }
      } else {
        setDropdownOption({ ...dropdownOption, cityOptionList: [] });
      }
    },
    [dispatch, dropdownOption],
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

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
      dispatch(
        setUpdateSelectedCompanyData({
          ...updateSelectedCompanyData,
          [fieldName]: fieldValue,
          ...(fieldName === 'country' && {
            state: '',
          }),
          ...((fieldName === 'country' || fieldName === 'state') && {
            city: '',
          }),
        }),
      );
    } else {
      dispatch(
        setAddSelectedCompanyData({
          ...addSelectedCompanyData,
          [fieldName]: fieldValue,
          ...(fieldName === 'country' && {
            state: '',
          }),
          ...((fieldName === 'country' || fieldName === 'state') && {
            city: '',
          }),
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleCancel = () => {
    if (id) {
      dispatch(setIsGetInitialValues({ ...isGetInitialValues, update: false }));
      dispatch(clearUpdateSelectedCompanyData());
    } else {
      dispatch(setIsGetInitialValues({ ...isGetInitialValues, add: false }));
      dispatch(clearAddSelectedCompanyData());
    }
    navigate('/company-list');
  };

  console.log('values', values);

  return (
    <div className="main_Wrapper">
      {(uploadfileLoading || companyLoading) && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap add_cmnylist_right">
          <div className="bg-white radius15">
            <div className="company_profile_title p20 p15-xs border-bottom">
              <Row className="align-items-center">
                <Col sm={5}>
                  <h2 className="m-0">Company Profile</h2>
                </Col>
                <Col sm={7}>
                  <ul className=" mt-2 mt-sm-0 d-flex justify-content-end">
                    <li>
                      <Button
                        onClick={handleCancel}
                        className="btn_border_dark"
                      >
                        Exit Page
                      </Button>
                    </li>
                    <li>
                      <Button
                        className="btn_primary ms-2"
                        onClick={handleSubmit}
                        // onClick={() => navigate('/company-list')}
                      >
                        {id ? 'Update' : 'Save'} Company
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
            <div className="add_company_list_wrap p20 p15-xs">
              <Row>
                <Col lg={4} md={12}>
                  <Row>
                    <Col sm={6}>
                      <div className="form_group mb-3 position-relative">
                        <label htmlFor="Number">
                          Company Logo{' '}
                          <span className="text-danger fs-6">*</span>
                        </label>
                        {values?.company_logo && (
                          <div className="company_logo_wrap">
                            <img
                              loading="lazy"
                              src={values?.company_logo}
                              alt=""
                            />
                          </div>
                        )}

                        <div className="upload_logo mb-3">
                          <InputText
                            type="file"
                            id="UploadFile"
                            accept=".png, .jpg, .jpeg"
                            value={''}
                            name="company_logo"
                            style={{ visibility: 'hidden', opacity: 0 }}
                            onChange={e =>
                              fileHandler(e.target.name, e.target.files)
                            }
                          />
                          <label
                            htmlFor="UploadFile"
                            className="cursor-pointer"
                          >
                            <img
                              src={UploadLogo}
                              alt="Upload Logo"
                              className="me-2"
                            />
                            Upload Logo
                          </label>
                          {values?.company_logo && (
                            <label className="ml-2 trash_icon">
                              <img
                                src={TrashIcon}
                                alt=""
                                onClick={() => {
                                  setFieldValue('company_logo', '');
                                }}
                              />
                            </label>
                          )}
                          {touched?.company_logo && errors?.company_logo && (
                            <p className="text-danger">
                              {errors?.company_logo}
                            </p>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="number">Company Number</label>
                        <InputText
                          id="number"
                          placeholder="Company Number"
                          className="input_wrap"
                          name="number"
                          value={values?.number || ''}
                          onBlur={handleBlur}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={8}>
                  <Row>
                    <Col lg={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="company_name">
                          Company Name{' '}
                          <span className="text-danger fs-6">*</span>
                        </label>
                        <InputText
                          id="company_name"
                          placeholder="Company Name"
                          className="input_wrap"
                          name="company_name"
                          value={values?.company_name || ''}
                          onBlur={handleBlur}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          required
                        />
                        {touched?.company_name && errors?.company_name && (
                          <p className="text-danger">{errors?.company_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="legal_name">
                          Legal Name <span className="text-danger fs-6">*</span>
                        </label>
                        <InputText
                          id="legal_name"
                          placeholder="Legal Name"
                          className="input_wrap"
                          name="legal_name"
                          value={values?.legal_name || ''}
                          onBlur={handleBlur}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          required
                        />
                        {touched?.legal_name && errors?.legal_name && (
                          <p className="text-danger">{errors?.legal_name}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="business_type">
                          Business Type{' '}
                          <span className="text-danger fs-6">*</span>
                        </label>
                        <ReactSelectSingle
                          filter
                          id="business_type"
                          value={values?.business_type || ''}
                          name="business_type"
                          options={BusinessType}
                          onBlur={handleBlur}
                          onChange={e => {
                            commonUpdateFieldValue(e.target.name, e.value);
                          }}
                          placeholder="Business Type"
                        />
                        {touched?.business_type && errors?.business_type && (
                          <p className="text-danger">{errors?.business_type}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mb-3">
                        <label htmlFor="director_name">
                          Director Name{' '}
                          <span className="text-danger fs-6">*</span>
                        </label>
                        <InputText
                          id="director_name"
                          placeholder="Director Name"
                          className="input_wrap"
                          name="director_name"
                          value={values?.director_name || ''}
                          onBlur={handleBlur}
                          onChange={e => {
                            commonUpdateFieldValue(
                              e.target.name,
                              e.target.value,
                            );
                          }}
                          required
                        />
                        {touched?.director_name && errors?.director_name && (
                          <p className="text-danger">{errors?.director_name}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="website">Website</label>
                    <InputText
                      id="website"
                      placeholder="Website"
                      className="input_wrap"
                      name="website"
                      value={values?.website || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="email_id">
                      Email Id <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="email_id"
                      placeholder="Email Id"
                      className="input_wrap"
                      name="email_id"
                      value={values?.email_id || ''}
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
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="mobile_no">
                      Mobile No <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="mobile_no"
                      placeholder="Mobile No"
                      className="input_wrap"
                      name="mobile_no"
                      value={values?.mobile_no || ''}
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
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="pan_no">
                      PAN No <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="pan_no"
                      placeholder="PAN No"
                      className="input_wrap"
                      name="pan_no"
                      value={values?.pan_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      required
                    />
                    {touched?.pan_no && errors?.pan_no && (
                      <p className="text-danger">{errors?.pan_no}</p>
                    )}
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="tan_no">TAN No</label>
                    <InputText
                      id="tan_no"
                      placeholder="TAN No"
                      className="input_wrap"
                      name="tan_no"
                      value={values?.tan_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="gst_no">
                      GST No <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="gst_no"
                      placeholder="GST No"
                      className="input_wrap"
                      name="gst_no"
                      value={values?.gst_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      required
                    />
                    {touched?.gst_no && errors?.gst_no && (
                      <p className="text-danger">{errors?.gst_no}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <h2 className="mt20 mt10-xl mb30 mb20-xl">Address Details</h2>
              <Row>
                <Col xs={12}>
                  <div className="form_group mb-3">
                    <label htmlFor="address">
                      Address <span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      id="address"
                      placeholder="Address"
                      className="input_wrap"
                      name="address"
                      value={values?.address || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                      required
                    />
                    {touched?.address && errors?.address && (
                      <p className="text-danger">{errors?.address}</p>
                    )}
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="country">
                      Country <span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      id="country"
                      value={values?.country || ''}
                      name="country"
                      options={dropdownOption?.countryOptionList}
                      onBlur={handleBlur}
                      onChange={e => {
                        handleCountryChange(e.value);
                        commonUpdateFieldValue(e.target.name, e.value);
                      }}
                      placeholder="Select Country"
                    />
                    {touched?.country && errors?.country && (
                      <p className="text-danger">{errors?.country}</p>
                    )}
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="state">
                      State <span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      id="state"
                      value={values?.state || ''}
                      name="state"
                      options={dropdownOption?.stateOptionList}
                      onBlur={handleBlur}
                      onChange={e => {
                        setFieldValue('state', e.value);
                        handleStateChange(e.value);
                      }}
                      placeholder="Select State"
                    />
                    {touched?.state && errors?.state && (
                      <p className="text-danger">{errors?.state}</p>
                    )}
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="city">
                      City <span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      id="city"
                      value={values?.city || ''}
                      name="city"
                      options={dropdownOption?.cityOptionList}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.value);
                      }}
                      placeholder="Select City"
                      onBlur={handleBlur}
                    />
                    {touched?.city && errors?.city && (
                      <p className="text-danger">{errors?.city}</p>
                    )}
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="pin_code">
                      Pin Code <span className="text-danger fs-6">*</span>
                    </label>
                    <InputNumber
                      id="pin_code"
                      placeholder="Pin Code"
                      name="pin_code"
                      useGrouping={false}
                      value={values?.pin_code || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(
                          e.originalEvent.target.name,
                          e.value,
                        );
                      }}
                      required
                    />
                    {touched?.pin_code && errors?.pin_code && (
                      <p className="text-danger">{errors?.pin_code}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <h2 className="mt20 mt10-xl mb30 mb20-xl">Bank Details</h2>
              <Row>
                <Col xs={12}>
                  <div className="form_group mb-3">
                    <label htmlFor="bank_address">Address</label>
                    <InputText
                      id="bank_address"
                      placeholder="Address"
                      className="input_wrap"
                      name="bank_address"
                      value={values?.bank_address || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
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
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="branch_name">Branch Name</label>
                    <InputText
                      id="branch_name"
                      placeholder="Branch Name"
                      className="input_wrap"
                      name="branch_name"
                      value={values?.branch_name || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
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
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="account_no">Account No</label>
                    <InputNumber
                      id="account_no"
                      placeholder="Account No"
                      name="account_no"
                      useGrouping={false}
                      value={values?.account_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(
                          e.originalEvent.target.name,
                          e.value,
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="iban_no">IBAN No</label>
                    <InputText
                      id="iban_no"
                      placeholder="IBAN No"
                      className="input_wrap"
                      name="iban_no"
                      value={values?.iban_no || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="swift_code">SWIFT Code</label>
                    <InputText
                      id="swift_code"
                      placeholder="SWIFT Code"
                      className="input_wrap"
                      name="swift_code"
                      value={values?.swift_code || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label htmlFor="upi_code">UPI Code</label>
                    <InputText
                      id="upi_code"
                      placeholder="UPI Code"
                      className="input_wrap"
                      name="upi_code"
                      value={values?.upi_code || ''}
                      onBlur={handleBlur}
                      onChange={e => {
                        commonUpdateFieldValue(e.target.name, e.target.value);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6}>
                  <div className="form_group mb-3">
                    <label>Status</label>
                    <div className="checkbox_wrap">
                      <Checkbox
                        inputId="StatusActive"
                        name="isActive"
                        value={values?.isActive}
                        checked={values?.isActive}
                        onChange={e =>
                          commonUpdateFieldValue(
                            e.target.name,
                            e.target.checked,
                          )
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
          </div>
        </div>
      </div>
    </div>
  );
}
