import React, { useCallback, useEffect, useState } from 'react';
import ProfileImg from '../../Assets/Images/emp-img.jpg';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { myProfile, setCurrentUser } from 'Store/Reducers/Auth/ProfileSlice';
import Loader from 'Components/Common/Loader';
import { useFormik } from 'formik';
import { bloodGroup, maritalStatus } from 'Helper/CommonList';
import {
  editEmployee,
  uploadFile,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';
import AddUpload from '../../Assets/Images/add-upload-img.svg';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getAuthToken } from 'Helper/AuthTokenHelper';
import { editClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

export default function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, myProfileLoading } = useSelector(
    ({ profile }) => profile,
  );

  let UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) {
    UserPreferences = JSON.parse(window?.atob(UserPreferences));
  }

  const check_condition = UserPreferences?.role === 4;

  useEffect(() => {
    dispatch(myProfile());
  }, [dispatch]);

  const submitHandle = useCallback(
    async values => {
      if (check_condition) {
        let payload = {
          client_company_id: values._id,
          client_full_name: values?.client_full_name,
          email_id: values?.email_id,
          mobile_no: values?.mobile_no,
          address: values?.address,
          company_name: values?.company_name,
          image: values?.image,
        };
        dispatch(editClientCompany(payload))
          .then(response => {
            let payload = { ...currentUser, values };
            dispatch(setCurrentUser(payload));
            const userData = getAuthToken();
            if (userData) {
              userData.employee.image = values?.image;
              userData.employee.first_name = values?.first_name;
              userData.employee.last_name = values?.last_name;
              localStorage.setItem(
                'UserPreferences',
                window.btoa(JSON.stringify(userData)),
              );
            }
            navigate('/home');
          })
          .catch(error => {
            console.error('Error fetching while update profile:', error);
          });
      } else {
        let payload = {
          employee_id: values._id,
          user_email_id: values?.email,
          mobile_no: values?.mobile,
          first_name: values?.first_name,
          last_name: values?.last_name,
          email: values?.email,
          birth_date: values?.birth_date,
          gender: values?.gender,
          blood_group: values?.blood_group,
          marital_status: values?.marital_status,
          current_address: values?.current_address,
          group_name: values?.group_name,
          image: values?.image,
        };
        dispatch(editEmployee(payload))
          .then(response => {
            let payload = { ...currentUser, values };
            dispatch(setCurrentUser(payload));
            const userData = getAuthToken();
            if (userData) {
              userData.employee.image = values?.image;
              userData.employee.first_name = values?.first_name;
              userData.employee.last_name = values?.last_name;
              localStorage.setItem(
                'UserPreferences',
                window.btoa(JSON.stringify(userData)),
              );
            }
            navigate('/home');
          })
          .catch(error => {
            console.error('Error fetching while update profile:', error);
          });
      }
    },
    [dispatch],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: currentUser,
    // validationSchema: currentUserSchema,
    onSubmit: submitHandle,
  });

  const fileHandler = async (key, files) => {
    const uploadedFile = files[0];

    if (files[0]) {
      const fileSizeLimit = 10 * 1024 * 1024; // 10MB limit

      if (uploadedFile?.size <= fileSizeLimit) {
        const result = await dispatch(uploadFile(uploadedFile));
        if (result) {
          const fileName = result?.payload?.data?.file;
          setFieldValue(key, fileName);
        }
      } else {
        toast.error(`Upload File must not be larger than 10mb.`);
      }
    }
  };

  const onDownload = useCallback(e => {
    e.stopPropagation();
  }, []);

  const onRemove = useCallback(
    (e, key) => {
      e.stopPropagation();
      e.preventDefault();
      setFieldValue(key, '');
    },
    [setFieldValue],
  );

  function getInitialsAndWord(name) {
    const words = name.split(' ');

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length > 1) {
      const firstLetter = words[0].charAt(0).toUpperCase();
      const secondLetter = words[1].charAt(0).toUpperCase();
      return `${firstLetter} ${secondLetter}`;
    } else {
      return '';
    }
  }

  return (
    <div className="main_Wrapper">
      {myProfileLoading && <Loader />}
      <div className="overview_profile_wrap p20 border radius15 bg-white">
        <div className="profile_left">
          {/* <img src={ProfileImg} alt="ProfileImg" /> */}
          <div className="profile_img_wrap">
            {values?.image ? (
              <img
                src={values?.image || ProfileImg}
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
                {!check_condition && values?.first_name && values?.last_name
                  ? `${values?.first_name?.charAt(0)?.toUpperCase()}
                          ${values?.last_name?.charAt(0)?.toUpperCase()}`
                  : check_condition && values?.company_name
                  ? `${getInitialsAndWord(values?.company_name)}
                         `
                  : 'UN'}
              </div>
            )}

            {!check_condition && (
              <div className="upload_profile_custom">
                <InputText
                  type="file"
                  id="UserUploadFile"
                  accept=".png, .jpg, .jpeg"
                  value={''}
                  style={{ visibility: 'hidden', opacity: 0 }}
                  onChange={e => fileHandler('image', e.target.files)}
                />
                <label htmlFor="UserUploadFile">
                  <img src={AddUpload} alt="AddUploadImage" />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="profile_right">
          <h3 className="mb30 mb10-md mt-3 mt-sm-0">
            {currentUser?.first_name && currentUser?.last_name
              ? currentUser?.first_name + ' ' + currentUser?.last_name
              : check_condition && currentUser?.company_name
              ? currentUser?.company_name
              : ''}
          </h3>
          <ul className="d-flex flex-wrap">
            {check_condition ? (
              <li>
                <h5>Name</h5>
                <h4>{currentUser?.company_name}</h4>
              </li>
            ) : (
              ''
            )}
            <li>
              <h5>Email</h5>
              <h4>
                {currentUser?.email
                  ? currentUser?.email
                  : currentUser?.email_id
                  ? currentUser?.email_id
                  : ''}
              </h4>
            </li>
            <li>
              <h5>Mobile</h5>
              <h4>
                {currentUser?.mobile
                  ? currentUser?.mobile
                  : currentUser?.mobile_no
                  ? currentUser?.mobile_no
                  : ''}
              </h4>
            </li>
            {/* <li>
              <h5>ID card</h5>
              <h4>{currentUser?.id_card}</h4>
            </li> */}
          </ul>
          <hr className="my5" />
          <ul className="d-flex flex-wrap">
            {check_condition ? (
              <li>
                <h5>Address</h5>
                <h4>{currentUser?.address}</h4>
              </li>
            ) : (
              <>
                <li>
                  <h5>Role</h5>
                  <h4>{currentUser?.role}</h4>
                </li>
                <li>
                  <h5>Business Unit</h5>
                  <h4>{currentUser?.bussness_unit}</h4>
                </li>
                <li>
                  <h5>Emp No</h5>
                  <h4>{currentUser?.emp_no}</h4>
                </li>
                <li>
                  <h5>Joining date</h5>
                  <h4>
                    {currentUser?.joining_date
                      ? moment(currentUser?.joining_date)?.format('DD-MM-YYYY')
                      : ''}{' '}
                  </h4>
                </li>
              </>
            )}
            {/* <li>
              <h5>Password</h5>
              <h4>{currentUser?.password}</h4>
            </li> */}
          </ul>
        </div>
      </div>
      <h4 className="my20">Primary Details</h4>
      <div className="primary_detail_wrap p20 radius15 bg-white border mb30">
        <Row>
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>First Name</label>
                <InputText
                  id="FirstName"
                  placeholder="Enter First Name"
                  className="input_wrap"
                  name="first_name"
                  value={values?.first_name || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Last Name</label>
                <InputText
                  id="LastName"
                  placeholder="Enter Last Name"
                  className="input_wrap"
                  name="last_name"
                  value={values?.last_name || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Name</label>
                <InputText
                  id="Name"
                  placeholder="Enter Name"
                  className="input_wrap"
                  name="client_full_name"
                  value={values?.client_full_name || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Email</label>
                <InputText
                  id="Email"
                  placeholder="Enter Email"
                  className="input_wrap"
                  name="email"
                  value={values?.email || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Email</label>
                <InputText
                  id="Email"
                  placeholder="Enter Email"
                  className="input_wrap"
                  name="email_id"
                  value={values?.email_id || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Mobile No</label>
                <InputText
                  id="MobileNo"
                  placeholder="Enter Mobile No"
                  className="input_wrap"
                  name="mobile"
                  value={values?.mobile || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Mobile No</label>
                <InputText
                  id="MobileNo"
                  placeholder="Enter Mobile No"
                  className="input_wrap"
                  name="mobile_no"
                  value={values?.mobile_no || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label>Gender</label>
                <div className="radio_wrapper d-flex align-items-center">
                  <div className="radio-inner-wrap d-flex align-items-center me-3">
                    <RadioButton
                      inputId="Male"
                      name="gender"
                      value={1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values?.gender === 1}
                    />
                    <label htmlFor="ingredient1" className="ms-2">
                      Male
                    </label>
                  </div>
                  <div className="radio-inner-wrap d-flex align-items-center me-3">
                    <RadioButton
                      inputId="Female"
                      name="gender"
                      value={2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values?.gender === 2}
                    />
                    <label htmlFor="ingredient2" className="ms-2">
                      Female
                    </label>
                  </div>
                  <div className="radio-inner-wrap d-flex align-items-center">
                    <RadioButton
                      inputId="Other"
                      name="gender"
                      value={3}
                      checked={values?.gender === 3}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="ingredient2" className="ms-2">
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="birth_date">Birth Date</label>
                <Calendar
                  id="birth_date"
                  placeholder="Birth Date"
                  showIcon
                  dateFormat="dd-mm-yy"
                  readOnlyInput
                  value={values?.birth_date || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showButtonBar
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="blood_group">Blood Group</label>
                <ReactSelectSingle
                  filter
                  id="blood_group"
                  options={bloodGroup}
                  placeholder="Blood Group"
                  value={values?.blood_group || ''}
                  name="blood_group"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('blood_group', e.value);
                  }}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="marital_status">Marital Status</label>
                <ReactSelectSingle
                  filter
                  id="marital_status"
                  options={maritalStatus}
                  placeholder="Marital Status"
                  value={values?.marital_status || ''}
                  name="marital_status"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('marital_status', e.value);
                  }}
                />
              </div>
            </Col>
          )}
          {!check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="current_address">Current Address</label>
                <InputTextarea
                  id="current_address"
                  placeholder="Current Address"
                  className="input_wrap"
                  rows={3}
                  name="current_address"
                  value={values?.current_address || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {check_condition && (
            <Col xl={3} lg={4} sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="address">Current Address</label>
                <InputTextarea
                  id="address"
                  placeholder="Current Address"
                  className="input_wrap"
                  rows={3}
                  name="address"
                  value={values?.address || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </Col>
          )}
          {/* <Col xl={3} lg={4} sm={6}>
            <div className="form_group mb-3">
              <label htmlFor="permanent_address">Permanent Address</label>
              <InputTextarea
                id="permanent_address"
                placeholder="Permanent Address"
                className="input_wrap"
                rows={3}
                name="current_address"
              />
            </div>
          </Col> */}
        </Row>
      </div>
      <div className="btn_group d-flex justify-content-end">
        <Button
          className="btn_border_dark"
          onClick={e => {
            navigate(-1);
          }}
        >
          Exit Page
        </Button>
        <Button
          className="btn_primary ms-2"
          type="submit"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
