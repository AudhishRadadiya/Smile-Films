import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button, Col, Row } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers';

import {
  addReporting,
  editReporting,
  getOrderList,
  getReporting,
  getReportingList,
  setGetReportingData,
} from 'Store/Reducers/UserFlow/ReportingFlow/ReportingSlice';
import Loader from 'Components/Common/Loader';
import EditIcon from '../../../Assets/Images/edit.svg';
import InfoIcon from '../../../Assets/Images/info.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import CheckIcon from '../../../Assets/Images/check-green.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { getHolidayList } from 'Store/Reducers/ActivityOverview/holidaySlice';
import { validationSchemaReporting } from 'Schema/UserDashboard/Reporting/reportingSchema';
import { getEmployeeReporting } from 'Store/Reducers/ActivityOverview/AdminReportingFlow/AdminReportingSlice';

export default function Reporting({ userReportingID }) {
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState({});
  const [filterMonthOptions, setFilterMonthOptions] = useState([]);

  const {
    getReportingData,
    getOrderListData,
    addReportingLoading,
    getOrderListLoading,
    getReportingLoading,
    editReportingLoading,
    getReportingListLoading,
    getEmployeeReportingLoading,
  } = useSelector(({ reporting }) => reporting);
  const { holidayLoading } = useSelector(({ holiday }) => holiday);

  const WeeklyOffOnTable = (res, holidayList, monthNumber = '') => {
    let lastDate;
    if (!monthNumber || monthNumber === '') {
      lastDate = 30;
    } else {
      const currentYear = moment().year();
      const numberOfDays = moment({
        year: currentYear,
        month: monthNumber - 1,
      }).endOf('month');
      lastDate = numberOfDays.date();
    }

    for (let i = 0; i < lastDate; i++) {
      const currentYear = moment().year();
      const today =
        !monthNumber || monthNumber === 0
          ? moment()
          : moment({ year: currentYear, month: monthNumber - 1 }).endOf(
              'month',
            );

      const currentDate = today.clone().subtract(i, 'days').startOf('day');

      const isWeekend = currentDate.day() === 0;

      const holiday = holidayList?.payload?.find(item => {
        const holidayDate = moment(item.holiday_date, 'DD-MM-YYYY');
        const currentDateFormatted = moment(currentDate).format('DD-MM-YYYY');
        return currentDateFormatted === holidayDate.format('DD-MM-YYYY');
      });

      if (isWeekend) {
        setRows(prevRows => [
          ...prevRows,
          <tr
            key={`${currentDate.format('YYYY-MM-DD')}-weekend`}
            className="weekly_off"
          >
            <td>
              {currentDate.format('DD-MM-YYYY')}
              <div>{currentDate.format('dddd')}</div>
            </td>
            <td colSpan={9}>Full day weekly-off</td>
          </tr>,
        ]);
      } else if (holiday) {
        setRows(prevRows => [
          ...prevRows,
          <tr
            key={`${currentDate.format('YYYY-MM-DD')}-holiday`}
            className="weekly_off"
          >
            <td>
              {currentDate.format('DD-MM-YYYY')}
              <div>{currentDate.format('dddd')}</div>
            </td>
            <td colSpan={9}>{holiday.holiday_name} (Holiday)</td>
          </tr>,
        ]);
      } else {
        const workItem = res?.list?.find(item =>
          moment(item._id).isSame(currentDate, 'day'),
        );
        if (workItem) {
          const workRows = workItem.reporting.map((item, index) => {
            const createdDate = moment(item.created_at).format('DD-MM-YYYY');

            const convertToLocalTime = utcString => {
              const date = new Date(utcString);
              const options = { hour: '2-digit', minute: '2-digit' };
              const localTime = date.toLocaleTimeString([], options);
              return localTime;
            };

            const utcString = item.created_at;
            const localTime = convertToLocalTime(utcString);

            return (
              <tr key={`${currentDate.format('YYYY-MM-DD') + item._id}-work`}>
                {index === 0 && (
                  <td
                    rowSpan={
                      index === 0 && workItem.reporting.length > 1
                        ? workItem.reporting.length
                        : ''
                    }
                  >
                    {currentDate.format('DD-MM-YYYY')}
                    <div>{currentDate.format('dddd')}</div>
                  </td>
                )}
                <td>{item.order_no}</td>
                <td>{item.company_name}</td>
                <td>{item.couple_name || '-'}</td>
                <td>{item.item_name}</td>
                <td>{item.work_describe}</td>
                <td>{item.working_hour.slice(0, -3)}</td>
                <td>{`${createdDate} | ${localTime}`}</td>

                <td>
                  <Button className="btn_transparent">
                    <img src={CheckIcon} alt="" style={{ filter: 'inherit' }} />
                  </Button>
                </td>
                <td>
                  {!userReportingID && (
                    <Button
                      className="btn_transparent"
                      onClick={() => {
                        setIsEdit({ id: item._id });
                        handleAddReportingButton(item._id);
                      }}
                    >
                      <img src={EditIcon} alt="" />
                    </Button>
                  )}
                </td>
              </tr>
            );
          });
          setRows(prevRows => [...prevRows, ...workRows]);
        } else {
          setRows(prevRows => [
            ...prevRows,
            <tr
              key={`${currentDate.format('YYYY-MM-DD') + new Date()}-NotWorked`}
            >
              <td>
                {currentDate.format('DD-MM-YYYY')}{' '}
                <div>{currentDate.format('dddd')}</div>
              </td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                <Button className="btn_transparent">
                  <img src={InfoIcon} alt="" style={{ filter: 'inherit' }} />
                </Button>
              </td>
              <td></td>
            </tr>,
          ]);
        }
      }
    }
  };

  const getApiData = useCallback(
    async (month = '') => {
      try {
        setRows([]);
        setFilterMonthOptions([]);
        getFilterMonthsOptions();

        const holidays = await dispatch(
          getHolidayList({
            start: 0,
            limit: 0,
            year: '',
            search: '',
            isActive: '', // not required
          }),
        );

        let res;

        if (userReportingID) {
          res = await dispatch(
            getEmployeeReporting({
              employee_id: userReportingID,
              month: month === 0 ? '' : month,
            }),
          );
        } else {
          res = await dispatch(
            getReportingList({
              month: month === 0 ? '' : month,
            }),
          );
        }

        WeeklyOffOnTable(res.payload, holidays, month);
      } catch (error) {
        console.error('Error in getApiData:', error);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getApiData();
  }, [getApiData]);

  const getFilterMonthsOptions = () => {
    const months = [];
    for (let i = 1; i <= 6; i++) {
      const previousMonth = moment()
        .subtract(i, 'months')
        .format('MMM')
        .toUpperCase();

      const previousMonthValue = moment().subtract(i, 'months').month() + 1;

      months.push({ label: previousMonth, value: previousMonthValue });
    }
    months.unshift({ label: '30 DAYS', value: 0 });
    setFilterMonthOptions(months);
  };

  const Order = () => {
    return getOrderListData?.list?.map(item => ({
      label: item?.inquiry_no,
      value: item?._id,
    }));
  };

  const justifyTemplate = option => {
    return <span>{option.label}</span>;
  };

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      try {
        const {
          order_id,
          item_name,
          create_date,
          event_name,
          working_hour,
          work_describe,
          reporting_id,
        } = values;

        const sendPayload = {
          ...(reporting_id && { reporting_id: reporting_id }),
          order_id: order_id || '',
          item_name: item_name || '',
          reporting_date: create_date
            ? moment(create_date).format('YYYY-MM-DD')
            : '',
          event_name: event_name || null,
          working_hour: working_hour
            ? moment(working_hour, 'HH:mm:ss').format('HH:mm:ss')
            : '',
          work_describe: work_describe || '',
        };

        reporting_id
          ? await dispatch(editReporting(sendPayload))
          : await dispatch(addReporting(sendPayload));
        getApiData();
        resetForm();
        setShow(false);
        setIsEdit({});
        setFieldValue('reporting_id', '');
        dispatch(setGetReportingData({}));
      } catch (error) {
        console.error('Error adding reporting:', error);
      }
    },
    [dispatch],
  );

  const initialValues = useMemo(
    () => ({
      create_date:
        Object.keys(isEdit).length !== 0
          ? new Date(getReportingData?.reporting_date)
          : new Date(),

      order_no:
        Object.keys(isEdit).length !== 0 ? getReportingData?.order_id : '',
      order_id:
        Object.keys(isEdit).length !== 0 ? getReportingData?.order_id : '',
      company_name:
        Object.keys(isEdit).length !== 0 ? getReportingData?.company_name : '',
      couple_name:
        Object.keys(isEdit).length !== 0 ? getReportingData?.couple_name : '',
      item_name:
        Object.keys(isEdit).length !== 0 ? getReportingData?.item_name : '',
      event_name:
        Object.keys(isEdit).length !== 0 ? getReportingData?.event_name : '',
      working_hour:
        Object.keys(isEdit).length !== 0
          ? // ? new Date(`1970-01-01T${getReportingData?.working_hour}`)
            dayjs(getReportingData?.working_hour, 'HH:mm').format('HH:mm:ss')
          : '',
      work_describe:
        Object.keys(isEdit).length !== 0 ? getReportingData?.work_describe : '',
      orderNamesOption: Order() || [],
      itemNamesOption:
        Object.keys(isEdit).length !== 0
          ? getOrderListData?.list
              ?.find(order => order._id === getReportingData?.order_id)
              ?.itemData?.map(item => ({
                label: item.item_name,
                value: item._id,
              })) || []
          : [],
      eventNamesOption:
        Object.keys(isEdit).length !== 0
          ? getOrderListData?.list
              ?.find(order => order._id === getReportingData?.order_id)
              ?.itemData?.find(item => item._id === getReportingData?.item_name)
              ?.eventData?.map(event => ({
                label: event.event_name,
                value: event._id,
              })) || []
          : [],
      reporting_id:
        Object.keys(isEdit).length !== 0 ? getReportingData?._id : '',
    }),
    [isEdit, getReportingData, getOrderListData],
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
    validationSchema: validationSchemaReporting,
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: submitHandle,
  });

  const handleAddReportingButton = async id => {
    setShow(true);
    if (id) {
      await dispatch(getReporting({ reporting_id: id }));
      // handleOrderChange('order_id', values.order_id);
    }
    dispatch(getOrderList());
  };

  const handleOrderChange = (name, value) => {
    setFieldValue(name, value);
    const orderData = getOrderListData?.list?.find(item => item._id === value);
    if (orderData) {
      setFieldValue('company_name', orderData.company_name);
      setFieldValue('order_id', orderData._id);
      setFieldValue('couple_name', orderData.couple_name || '-');
      const itemNamesOption =
        orderData?.itemData?.map(item => ({
          label: item.item_name,
          value: item._id,
        })) || [];
      setFieldValue('itemNamesOption', itemNamesOption);
      setFieldValue('eventNamesOption', []);
      setFieldValue('event_name', '');
      setFieldValue('item_name', '');
    }
  };

  const handleCancelButton = () => {
    setShow(false);
    resetForm();
    setIsEdit({});
  };

  const handleItemChange = e => {
    setFieldValue(e.target.name, e.target.value);
    const orderData = getOrderListData?.list?.find(
      item => item?._id === values.order_no,
    );
    if (orderData) {
      const selectedItem = orderData.itemData.find(
        item => item._id === e.target.value,
      );
      if (selectedItem) {
        const eventNamesOption = selectedItem.eventData.map(event => ({
          label: event.event_name,
          value: event._id,
        }));
        setFieldValue('eventNamesOption', eventNamesOption);
      }
    }
  };

  return (
    <div className="main_Wrapper">
      {(addReportingLoading ||
        getReportingListLoading ||
        getOrderListLoading ||
        getReportingLoading ||
        getEmployeeReportingLoading ||
        holidayLoading ||
        editReportingLoading) && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Reporting</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="calender_filter_Wrap d-flex align-items-center justify-content-end">
                      <SelectButton
                        value={value}
                        onChange={e => {
                          if (e.value !== null) {
                            setValue(e.value ? e.value : 0);
                            getApiData(e.value === 0 ? '' : e.value);
                          }
                        }}
                        itemTemplate={justifyTemplate}
                        optionLabel="value"
                        options={filterMonthOptions}
                      />
                    </div>
                  </li>
                  <li>
                    {!userReportingID && (
                      <Button
                        className="btn_primary"
                        onClick={() => handleAddReportingButton()}
                      >
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add Reporting
                      </Button>
                    )}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper reporting_table_wrapper reporting_user_individual">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Date </span>
                  </th>
                  <th>
                    <span>Order No.</span>
                  </th>
                  <th>
                    <span>Company Name</span>
                  </th>
                  <th>
                    <span>Couple Name</span>
                  </th>
                  <th>
                    <span>Item Names</span>
                  </th>
                  <th>
                    <span>Work Describe</span>
                  </th>
                  <th>
                    <span>Working Hour</span>
                  </th>
                  <th>
                    <span>Created Date & time</span>
                  </th>
                  <th>
                    <span>Status</span>
                  </th>
                  <th>{!userReportingID && <span>Action</span>}</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        header={
          Object.keys(isEdit).length !== 0 ? 'Edit Reporting' : 'Add Reporting'
        }
        className="modal_medium modal_Wrapper"
        visible={show}
        onHide={() => handleCancelButton()}
        draggable={false}
      >
        <div className="delete_popup_wrapper">
          <Row>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>
                  Create Date <span className="text-danger fs-6">*</span>{' '}
                </label>
                <div className="date_select">
                  <Calendar
                    name="create_date"
                    value={values.create_date}
                    placeholder="Create Date"
                    dateFormat="dd-mm-yy"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxDate={new Date()}
                    showIcon
                    showButtonBar
                  />
                  {touched?.create_date && errors?.create_date && (
                    <p className="text-danger">{errors?.create_date}</p>
                  )}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>
                  Order No <span className="text-danger fs-6">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name="order_no"
                  value={values.order_no}
                  options={values.orderNamesOption || []}
                  onChange={e => {
                    handleOrderChange(e.target.name, e.target.value);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Order No"
                />
                {touched?.order_no && errors?.order_no && !values?.order_no && (
                  <p className="text-danger">{errors?.order_no}</p>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={values.company_name}
                  placeholder="Company Names"
                  className="p-inputtext p-component input_wrap"
                  disabled
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>Couple Name</label>
                <input
                  type="text"
                  name="couple_name"
                  value={values.couple_name}
                  placeholder="Couple Names"
                  className="p-inputtext p-component input_wrap"
                  disabled
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>
                  Item Names <span className="text-danger fs-6">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  name="item_name"
                  value={values.item_name}
                  options={values.itemNamesOption}
                  onChange={e => {
                    handleItemChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Item Names"
                  disabled={
                    values.itemNamesOption && values.itemNamesOption.length > 0
                      ? false
                      : true
                  }
                />
                {touched?.item_name &&
                  errors?.item_name &&
                  !values?.item_name && (
                    <p className="text-danger">{errors?.item_name}</p>
                  )}
              </div>
            </Col>
            <Col md={6}>
              {values.eventNamesOption &&
                values.eventNamesOption.length > 0 && (
                  <div className="form_group mb-3">
                    <label>Event Name</label>
                    <ReactSelectSingle
                      filter
                      name="event_name"
                      value={values.event_name}
                      options={values.eventNamesOption}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Event Names"
                    />
                    {touched?.event_name &&
                      errors?.event_name &&
                      !values?.event_name && (
                        <p className="text-danger">{errors?.event_name}</p>
                      )}
                  </div>
                )}
            </Col>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>
                  Working Hour <span className="text-danger fs-6">*</span>
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['TimeField', 'TimeField']}>
                    <TimeField
                      name="working_hour"
                      className="time_input_wrap"
                      label=""
                      format="HH:mm"
                      value={dayjs(values?.working_hour, 'HH:mm')}
                      onChange={newValue => {
                        let fieldValue = newValue;

                        if (newValue) {
                          fieldValue = newValue?.format('HH:mm');
                        } else {
                          fieldValue = '';
                        }

                        setFieldValue('working_hour', fieldValue);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>

                {/* <Calendar
                  type="text"
                  name="working_hour"
                  value={values.working_hour}
                  placeholder="HH:MM"
                  className="d-block"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  timeOnly
                /> */}
                {touched?.working_hour && errors?.working_hour && (
                  <p className="text-danger">{errors?.working_hour}</p>
                )}
              </div>
            </Col>
            <Col sm={12}>
              <div className="amount-condition-wrapper border radius15">
                <div className="p20 p10-md border-bottom">
                  <h5 className="m-0">
                    Work Describe <span className="text-danger fs-6">*</span>
                  </h5>
                </div>
                <div className="condition-content mb-3">
                  <InputTextarea
                    name="work_describe"
                    value={values.work_describe}
                    placeholder="Write here"
                    id="Remark"
                    className="border-0"
                    rows={6}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              {touched?.work_describe && errors?.work_describe && (
                <p className="text-danger">{errors?.work_describe}</p>
              )}
            </Col>
          </Row>

          <div className="delete_btn_wrap mt-3 p-0">
            <Button
              className="btn_border"
              type="submit"
              onClick={handleCancelButton}
            >
              Cancel
            </Button>
            <Button
              className="btn_primary"
              type="submit"
              onClick={handleSubmit}
            >
              {values.reporting_id ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
