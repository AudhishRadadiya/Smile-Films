import { generateUniqueId, getFormattedDate } from 'Helper/CommonHelper';
import { Type } from 'Helper/CommonList';
import { clientCompanyInInquirySchema } from 'Schema/Setting/clientComapnySchema';
import { addClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getCityList } from 'Store/Reducers/Settings/Master/CitySlice';
import { getStateList } from 'Store/Reducers/Settings/Master/StateSlice';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { memo, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelectSingle from '../Common/ReactSelectSingle';

const clientCompanyData = {
  company_name: '',
  client_full_name: '',
  email_id: '',
  mobile_no: [
    {
      mobile_no: '',
      unique_id: generateUniqueId(),
    },
  ],
  address: '',
  group_name: '',
  country: '',
  state: '',
  city: '',
  pin_code: '',
  reference: '',
  type: '',
  currency: '',
  opening_balance_type: 1,
  opening_balance: '',
  credits_limits: '',
  pay_due_date: '',
  isActive: true,
};

const CreateClientCompanyInInquiry = ({
  createCompanyModal,
  setCreateCompanyModal,
}) => {
  const dispatch = useDispatch();
  const { countryList } = useSelector(({ country }) => country);
  const { currencyList } = useSelector(({ currency }) => currency);
  const { referenceList } = useSelector(({ references }) => references);
  const { dropdownGroupList } = useSelector(({ group }) => group);

  const [ingredients, setIngredients] = useState([]);
  const [dropdownOptionList, setDropdownOptionList] = useState({
    countryList: [],
    referenceOptionList: [],
    currencyList: [],
    stateList: [],
    cityList: [],
    typeList: [],
    companyList: [],
    dropdownGroupOptionList: [],
  });

  const onIngredientsChange = e => {
    let _ingredients = [...ingredients];

    if (e.checked) _ingredients.push(e.value);
    else _ingredients.splice(_ingredients.indexOf(e.value), 1);

    setIngredients(_ingredients);
  };

  useEffect(() => {
    if (
      countryList?.list?.length > 0 &&
      referenceList?.list?.length > 0 &&
      currencyList?.list?.length > 0 &&
      dropdownGroupList?.length
    ) {
      const countyData = countryList?.list?.map(item => {
        return { label: item?.country, value: item?._id };
      });
      const referenceData = referenceList?.list?.map(item => {
        return { label: item?.reference_name, value: item?._id };
      });
      const currencyData = currencyList?.list?.map(item => {
        return { label: item?.currency_name, value: item?._id };
      });
      const groupList = dropdownGroupList?.map(item => ({
        label: item?.group_name,
        value: item?._id,
      }));

      setDropdownOptionList({
        ...dropdownOptionList,
        countryList: countyData,
        referenceOptionList: referenceData,
        currencyList: currencyData,
        dropdownGroupOptionList: groupList,
      });
    }
  }, [countryList, referenceList, currencyList, dropdownGroupList]);

  const groupLableTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const submitHandle = useCallback(
    async values => {
      const updatedMobileNumbers = values?.mobile_no?.map(mobileNumber => {
        return mobileNumber?.mobile_no;
      });

      const payload = {
        ...values,
        mobile_no: updatedMobileNumbers,
        email_id: values?.email_id?.trim(),
        pay_due_date: getFormattedDate(values?.pay_due_date),
      };

      dispatch(addClientCompany(payload));
      resetForm();
      setCreateCompanyModal(false);
    },
    [dispatch],
  );
  const {
    values,
    errors,
    touched,
    resetForm,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: clientCompanyData,
    validationSchema: clientCompanyInInquirySchema,
    onSubmit: submitHandle,
  });

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
          stateList: stateData,
        });
      }
    },
    [dispatch, dropdownOptionList],
  );

  const loadCityData = useCallback(
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

        setDropdownOptionList({
          ...dropdownOptionList,
          cityList: cityData,
        });
      }
    },
    [dispatch, dropdownOptionList, values?.country],
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
        <Button
          className="btn_border"
          onClick={() => setCreateCompanyModal(false)}
        >
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      header="Create Client Company"
      visible={createCompanyModal}
      draggable={false}
      className="modal_Wrapper modal_medium"
      onHide={() => setCreateCompanyModal(false)}
      footer={footerContent}
    >
      <div className="create_client_company_wrap">
        <Row>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="Company">
                Company<span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="Company"
                placeholder="Company"
                className="input_wrap"
                name="company_name"
                value={values?.company_name || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.company_name && errors?.company_name && (
                <p className="text-danger">{errors?.company_name}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="ClientFullName">
                Client Full Name<span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="ClientFullName"
                placeholder="Client Name"
                className="input_wrap"
                name="client_full_name"
                value={values?.client_full_name || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.client_full_name && errors?.client_full_name && (
                <p className="text-danger">{errors?.client_full_name}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="EmailAddress">
                Email Address<span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="EmailAddress"
                placeholder="Email Address"
                className="input_wrap"
                name="email_id"
                value={values?.email_id || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.email_id && errors?.email_id && (
                <p className="text-danger">{errors?.email_id}</p>
              )}
            </div>
          </Col>
          {/* <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="PhoneNumber">
                Phone Number<span className="text-danger fs-6">*</span>
              </label>
              <InputText
                id="PhoneNumber"
                placeholder="Phone Number"
                className="input_wrap"
                name="mobile_no"
                value={values?.mobile_no || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.mobile_no && errors?.mobile_no && (
                <p className="text-danger">{errors?.mobile_no}</p>
              )}
            </div>
          </Col> */}
          {values?.mobile_no?.length > 0 &&
            values?.mobile_no?.map((item, index) => {
              return (
                <Col sm={6}>
                  <div className="form_group mb-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span>Phone Number {index + 1} </span>
                        <span className="text-danger fs-6">*</span>
                      </div>
                      <div>
                        {index === 0 && values?.mobile_no?.length < 3 && (
                          <Button
                            className="btn_transparent text_primary btn_right add_btn"
                            onClick={e => {
                              e.preventDefault();
                              if (values?.mobile_no?.length < 3) {
                                setFieldValue('mobile_no', [
                                  ...values?.mobile_no,
                                  {
                                    unique_id: generateUniqueId(),
                                    mobile_no: '',
                                  },
                                ]);
                              }
                            }}
                          >
                            ADD
                            <img src={PlusIcon} alt="PlusIcon" />
                          </Button>
                        )}
                        {index > 0 && (
                          <Button
                            className="btn_transparent add_btn"
                            onClick={() => {
                              const updatedData = values?.mobile_no?.filter(
                                value => value?.unique_id !== item?.unique_id,
                              );
                              setFieldValue('mobile_no', updatedData);
                            }}
                          >
                            <img src={TrashIcon} alt="TrashIcon" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <InputText
                      placeholder="Write number"
                      className="input_wrap"
                      name={`mobile_no[${index}].mobile_no`}
                      value={item?.mobile_no || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.mobile_no?.length &&
                      touched?.mobile_no?.length &&
                      touched?.mobile_no[index]?.mobile_no &&
                      errors?.mobile_no[index]?.mobile_no && (
                        <p className="text-danger">
                          {errors?.mobile_no[index]?.mobile_no}
                        </p>
                      )}
                  </div>
                </Col>
              );
            })}
          <Col xs={6}>
            <div className="form_group mb-3">
              <label htmlFor="Address">Address</label>
              <InputText
                id="Address"
                placeholder="Address"
                className="input_wrap"
                name="address"
                value={values?.address || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched?.address && errors?.address && (
                <p className="text-danger">{errors?.address}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="group_name">
                Group Name <span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="group_name"
                name="group_name"
                placeholder="Group Name"
                value={values?.group_name}
                options={dropdownOptionList?.dropdownGroupOptionList || []}
                onBlur={handleBlur}
                onChange={e => setFieldValue('group_name', e.value)}
                optionGroupTemplate={groupLableTemplate}
              />
              {touched?.group_name && errors?.group_name && (
                <p className="text-danger">{errors?.group_name}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                Country<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="country"
                options={dropdownOptionList?.countryList}
                value={values?.country || ''}
                name="country"
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('country', e.value);
                  loadStateData(e.value);
                }}
                placeholder="Select Country"
              />
              {touched?.country && errors?.country && !values?.country && (
                <p className="text-danger">{errors?.country}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                State<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="state"
                options={dropdownOptionList?.stateList}
                value={values?.state || ''}
                name="state"
                onChange={e => {
                  setFieldValue('state', e.value);
                  loadCityData(e.value);
                }}
                onBlur={handleBlur}
                placeholder="Select State"
              />
              {touched?.state && errors?.state && !values?.state && (
                <p className="text-danger">{errors?.state}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                City<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="city"
                options={dropdownOptionList?.cityList}
                value={values?.city || ''}
                name="city"
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('city', e.value);
                }}
                placeholder="Select City"
              />
              {touched?.city && errors?.city && !values?.city && (
                <p className="text-danger">{errors?.city}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="PinCode">Pin code</label>
              <InputNumber
                id="PinCode"
                placeholder="Pin code"
                useGrouping={false}
                name="pin_code"
                value={values?.pin_code || ''}
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('pin_code', e.value);
                }}
              />
              {touched?.pin_code && errors?.pin_code && (
                <p className="text-danger">{errors?.pin_code}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                Reference<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="reference"
                options={dropdownOptionList?.referenceOptionList}
                value={values?.reference || ''}
                name="reference"
                placeholder="Select Reference"
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('reference', e.value);
                }}
              />
              {touched?.reference && errors?.reference && (
                <p className="text-danger">{errors?.reference}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                Type<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="type"
                options={Type}
                value={values?.type || ''}
                name="type"
                onChange={e => {
                  setFieldValue('type', e.value);
                }}
                placeholder="Select Type"
                onBlur={handleBlur}
              />
              {touched?.type && errors?.type && (
                <p className="text-danger">{errors?.type}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label>
                Currency<span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                id="currency"
                options={dropdownOptionList?.currencyList}
                value={values?.currency || ''}
                name="currency"
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('currency', e.value);
                }}
                placeholder="Select Currency"
              />
              {touched?.currency && errors?.currency && (
                <p className="text-danger">{errors?.currency}</p>
              )}
            </div>
          </Col>
          <Col sm={6}>
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
                placeholder="Opening Balance"
                value={values?.opening_balance || ''}
                onChange={e => {
                  setFieldValue('opening_balance', e.value);
                }}
                min={0}
                onBlur={handleBlur}
                useGrouping={false}
                maxFractionDigits={2}
              />
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="CreditsLimits">Credit Limits</label>
              <InputNumber
                id="credits_limits"
                placeholder="Credit Limits"
                name="credits_limits"
                useGrouping={false}
                value={values?.credits_limits || ''}
                onBlur={handleBlur}
                onChange={e => {
                  setFieldValue('credits_limits', e.value);
                }}
              />
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group date_select_wrapper mb-3">
              <label htmlFor="pay_due_date">Pay Due Date</label>
              <Calendar
                id="pay_due_date"
                placeholder="Select Due Date"
                showIcon
                dateFormat="dd-mm-yy"
                readOnlyInput
                value={values?.pay_due_date || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                showButtonBar
              />
            </div>
          </Col>
        </Row>
      </div>
    </Dialog>
  );
};
export default memo(CreateClientCompanyInInquiry);
