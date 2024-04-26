import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { useDispatch, useSelector } from 'react-redux';
import { holidaySchema } from 'Schema/ActivityOverview/activityOverviewSchema';
import {
  addHoliday,
  clearSelectedHolidayData,
  deleteHoliday,
  editHoliday,
  getHoliday,
  getHolidayList,
  setIsAddHoliday,
  setIsDeleteHoliday,
  setIsUpdateHoliday,
  setYear,
} from 'Store/Reducers/ActivityOverview/holidaySlice';
import Loader from 'Components/Common/Loader';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { getFormattedDate } from 'Helper/CommonHelper';

const yearList = [
  { label: '2023', value: 2023 },
  { label: '2024', value: 2024 },
];

export default function Holiday({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const [createHolidayModal, setCreateHolidayModal] = useState(false);
  const {
    selectedHolidayData,
    year,
    holidayList,
    holidayCurrentPage,
    holidayPageLimit,
    holidaySearchParam,
    holidayLoading,
    isAddHoliday,
    isUpdateHoliday,
    isDeleteHoliday,
  } = useSelector(({ holiday }) => holiday);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    if (isAddHoliday || isUpdateHoliday || isDeleteHoliday) {
      dispatch(
        getHolidayList({
          start: holidayCurrentPage,
          limit: holidayPageLimit,
          isActive: '',
          year: year,
          search: holidaySearchParam,
        }),
      );
    }
    if (isUpdateHoliday) {
      dispatch(setIsUpdateHoliday(false));
    }
    if (isAddHoliday) {
      dispatch(setIsAddHoliday(false));
    }
    if (isDeleteHoliday) {
      dispatch(setIsDeleteHoliday(false));
    }
  }, [
    isAddHoliday,
    isUpdateHoliday,
    isDeleteHoliday,
    dispatch,
    holidayCurrentPage,
    holidayPageLimit,
    holidaySearchParam,
  ]);

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      holiday_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteHoliday(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    (values, { resetForm }) => {
      if (values?._id) {
        const payload = {
          ...values,
          holiday_id: values?._id,
          holiday_date: getFormattedDate(values?.holiday_date),
        };
        dispatch(editHoliday(payload));
      } else {
        const payload = {
          ...values,
          holiday_date: getFormattedDate(values?.holiday_date),
        };
        dispatch(addHoliday(payload));
      }
      resetForm();
      dispatch(clearSelectedHolidayData());
      setCreateHolidayModal(false);
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
    initialValues: selectedHolidayData,
    validationSchema: holidaySchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    resetForm();
    setCreateHolidayModal(false);
    dispatch(clearSelectedHolidayData());
  }, [resetForm, dispatch]);

  const handleChangeYear = useCallback(
    e => {
      dispatch(setYear(e.value));
      dispatch(
        getHolidayList({
          start: holidayCurrentPage,
          limit: holidayPageLimit,
          isActive: '',
          year: e.value,
          search: holidaySearchParam,
        }),
      );
    },
    [dispatch],
  );

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-end align-items-center">
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <div className="holiday_wrap radius15 border bg-white">
      {holidayLoading && <Loader />}
      <div className="holiday_title py15 px20 px15-xs border-bottom">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <h3 className="m-0">Holiday</h3>
          <div className="d-flex align-items-center">
            <div className="form_group date_select_wrapper">
              <ReactSelectSingle
                filter
                id="year"
                options={yearList}
                value={year}
                onChange={e => {
                  handleChangeYear(e);
                }}
                placeholder="Select Year"
              />
            </div>
            {is_create_access && (
              <Button
                className="btn_primary ms-2"
                onClick={() => {
                  setCreateHolidayModal(true);
                }}
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="holiday_inner_wrap p20 p15-xs">
        <div className="table-responsive">
          <table className="table  m-0">
            <thead>
              <tr>
                <th>Holiday Date</th>
                <th>Holiday Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {holidayList?.length > 0 &&
                holidayList?.map(item => {
                  return (
                    <tr>
                      <td>{item?.holiday_date}</td>
                      <td>{item?.holiday_name}</td>
                      <td>
                        <ul className="d-flex align-items-center">
                          {is_edit_access && (
                            <li>
                              <Button
                                className="btn_transparent me-2"
                                onClick={() => {
                                  dispatch(
                                    getHoliday({
                                      holiday_id: item?._id,
                                    }),
                                  );
                                  setCreateHolidayModal(true);
                                }}
                              >
                                <img src={EditIcon} alt="EditIcon" />
                              </Button>
                            </li>
                          )}
                          {is_delete_access && (
                            <li>
                              <Button
                                className="btn_transparent"
                                onClick={() => {
                                  setDeleteId(item?._id);
                                  setDeletePopup(true);
                                }}
                              >
                                <img src={TrashIcon} alt="TrashIcon" />
                              </Button>
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        header="Add Holiday"
        visible={createHolidayModal}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="holiday_inner_wrap">
          <Row className="g-4">
            <Col sm={6}>
              <div className="form_group date_select_wrapper">
                <Calendar
                  id="HolidayDate"
                  placeholder="Date"
                  showIcon
                  dateFormat="dd-mm-yy"
                  readOnlyInput
                  name="holiday_date"
                  value={values?.holiday_date || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showButtonBar
                />
                {touched?.holiday_date && errors?.holiday_date && (
                  <p className="text-danger">{errors?.holiday_date}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group">
                <InputText
                  id="Holiday"
                  placeholder="Write Holiday Name"
                  type="text"
                  className="input_wrap"
                  name="holiday_name"
                  value={values?.holiday_name || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched?.holiday_name && errors?.holiday_name && (
                  <p className="text-danger">{errors?.holiday_name}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
