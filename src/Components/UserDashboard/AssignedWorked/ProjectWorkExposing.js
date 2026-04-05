import Loader from 'Components/Common/Loader';
import { getSeverityStatus } from 'Helper/CommonList';
import { getExposingDetails } from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import {
  assignedWorkEditItem,
  assignedWorkedEditOrder,
  getAssignedWorkListItems,
  setAssignWorkedExposingData,
} from 'Store/Reducers/UserFlow/AssignedWorkedSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { memo, useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import RightArrow from '../../../Assets/Images/white-right-arrow.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { InputNumber } from 'primereact/inputnumber';
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ProjectWorkExposing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { exposingLoading } = useSelector(({ exposing }) => exposing);
  const {
    assignWorkedExposingData,
    assignedWorkItemsLoading,
    assignedWorkEditItemLoading,
    assignedWorkEditOrderLoading,
  } = useSelector(({ assignedWorked }) => assignedWorked);

  useEffect(() => {
    dispatch(getExposingDetails({ order_id: id }))
      .then(response => {
        const expoingDetails = response?.payload;
        return { expoingDetails };
      })
      .then(({ expoingDetails }) => {
        dispatch(getAssignedWorkListItems({ order_id: id })).then(response => {
          let itemsData = response.payload;
          const filteredItems = itemsData?.filter(
            item => item?.is_assign === true,
          );

          const updatedItemsData = filteredItems?.map(item => {
            const partitionWorkSubmitData = item?.work_submit_time?.split(':');
            const workSubmitHour = item?.work_submit_time
              ? Number(partitionWorkSubmitData[0])
              : 0;
            const workSubmitMinute = item?.work_submit_time
              ? Number(partitionWorkSubmitData[1])
              : 0;

            return {
              ...item,
              order_start_date: item?.order_start_date
                ? moment(item?.order_start_date).format('DD-MM-YYYY')
                : '',
              order_end_date: item?.order_end_date
                ? moment(item?.order_end_date).format('DD-MM-YYYY')
                : '',
              entry_place: item?.entry_place ? item?.entry_place : '',
              // entry_time: item?.entry_time
              // ? dayjs(item?.entry_time, 'HH:mm').format('HH:mm:ss')
              // : '', // for event entry time
              entry_time: item?.entry_time ? item?.entry_time : '', // for event entry time
              exit_place: item?.exit_place ? item?.exit_place : '',
              exit_time: item?.exit_time ? item?.exit_time : '', // for event exit time
              work_submit_place: item?.work_submit_place
                ? item?.work_submit_place
                : '',
              work_submit_hour: workSubmitHour,
              work_submit_minute: workSubmitMinute,
              // work_submit_time: item?.work_submit_time
              //   ? new Date(item?.work_submit_time)
              //   : '', // for event work submit time
              data_size: item?.data_size ? item?.data_size : '',
            };
          });

          const assignWorkExpoingData = {
            ...expoingDetails,
            create_date: expoingDetails?.create_date
              ? moment(
                  new Date(expoingDetails?.create_date?.split('T')[0]),
                ).format('DD-MM-YYYY')
              : '',
            event_item_list: updatedItemsData,
          };

          dispatch(setAssignWorkedExposingData(assignWorkExpoingData));
          return { expoingDetails, updatedItemsData };
        });
      })
      .catch(error => console.error('Error: fetching the data', error));
  }, []);

  const statusItemTemplate = option => {
    return (
      <Tag
        value={option?.label}
        severity={getSeverityStatus(option?.label)}
        className="d-block text-center"
      />
    );
  };

  const { values, handleChange, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: assignWorkedExposingData,
  });

  const handleProjectStatusChange = useCallback(
    e => {
      const fieldValue = e.target.value;
      setFieldValue('order_status', fieldValue);

      const payload = {
        order_id: id,
        order_status: fieldValue,
      };
      dispatch(assignedWorkedEditOrder(payload));
    },
    [dispatch, id, setFieldValue],
  );

  const handleSubmitEvent = useCallback(
    event_info => {
      const workSubmitHour = event_info?.work_submit_hour
        ? event_info?.work_submit_hour
        : '0';

      // const workSubmitHour = event_info?.work_submit_hour
      //   ? event_info?.work_submit_hour > 9
      //     ? event_info?.work_submit_hour
      //     : `0${event_info?.work_submit_hour}`
      //   : '00';
      // const workSubmitMinute = event_info?.work_submit_minute
      //   ? event_info?.work_submit_minute > 9
      //     ? event_info?.work_submit_minute
      //     : `0${event_info?.work_submit_minute}`
      //   : '00';
      const workSubmitMinute = event_info?.work_submit_minute
        ? event_info?.work_submit_minute
        : '0';
      const formattedWorkSubmitTime = `${workSubmitHour}:${workSubmitMinute}`;

      const payload = {
        item_status_id: event_info?.item_status_id,
        entry_place: event_info?.entry_place ? event_info?.entry_place : '',
        entry_time: event_info?.entry_time ? event_info?.entry_time : '',
        exit_place: event_info?.exit_place ? event_info?.exit_place : '',
        exit_time: event_info?.exit_time ? event_info?.exit_time : '',
        work_submit_place: event_info?.work_submit_place
          ? event_info?.work_submit_place
          : '',
        // work_submit_time: event_info?.work_submit_time
        //   ? event_info?.work_submit_time?.toString()
        //   : '',
        work_submit_time: formattedWorkSubmitTime,
        data_size: event_info?.data_size ? event_info?.data_size : '',
      };

      dispatch(assignedWorkEditItem(payload))
        .then(res => {
          dispatch(getAssignedWorkListItems({ order_id: id })).then(
            response => {
              const newItemsData = response.payload;
              let updatedEventList = [...values?.event_item_list];

              const index = updatedEventList?.findIndex(
                item => item?.item_status_id === event_info?.item_status_id,
              );
              const findNewObj = newItemsData?.find(
                item => item?.item_status_id === event_info?.item_status_id,
              );

              if (index !== -1) {
                const oldObj = updatedEventList[index];

                const partitionWorkSubmitData =
                  findNewObj?.work_submit_time?.split(':');

                const workSubmitHour = findNewObj?.work_submit_time
                  ? Number(partitionWorkSubmitData[0])
                  : 0;
                const workSubmitMinute = findNewObj?.work_submit_time
                  ? Number(partitionWorkSubmitData[1])
                  : 0;

                const newObj = {
                  ...oldObj,
                  ...findNewObj,
                  order_start_date: findNewObj?.order_start_date
                    ? moment(findNewObj?.order_start_date).format('DD-MM-YYYY')
                    : '',
                  order_end_date: findNewObj?.order_end_date
                    ? moment(findNewObj?.order_end_date).format('DD-MM-YYYY')
                    : '',
                  // entry_time: findNewObj?.entry_time
                  //   ? dayjs(findNewObj?.entry_time, 'HH:mm').format('HH:mm:ss')
                  //   : '',
                  // exit_time: findNewObj?.exit_time
                  //   ? dayjs(findNewObj?.exit_time, 'HH:mm').format('HH:mm:ss')
                  //   : '',
                  entry_time: findNewObj?.entry_time,
                  exit_time: findNewObj?.exit_time,
                  work_submit_hour: workSubmitHour,
                  work_submit_minute: workSubmitMinute,
                  // work_submit_time: findNewObj?.work_submit_time
                  //   ? new Date(findNewObj?.work_submit_time)
                  //   : '', // for event work submit time
                };

                updatedEventList[index] = newObj;
              }

              const assignWorkExpoingData = {
                ...assignWorkedExposingData,
                event_item_list: updatedEventList,
              };

              dispatch(setAssignWorkedExposingData(assignWorkExpoingData));
            },
          );
        })
        .catch(error => console.error('Error: ', error));
    },
    [assignWorkedExposingData, dispatch, id, values?.event_item_list],
  );

  return (
    <>
      {(exposingLoading ||
        assignedWorkItemsLoading ||
        assignedWorkEditItemLoading ||
        assignedWorkEditOrderLoading) && <Loader />}

      <div className="main_Wrapper">
        <div className="add_assign_projects_wrap bg-white radius15 border">
          <div className="add_assign_title p20 p15-xs border-bottom">
            <Row className="align-items-center gy-3">
              <Col lg={3}>
                <div className="title_right_wrapper">
                  <ul className="justify-content-start">
                    <li className="search_mobile">
                      <div className="form_group">
                        <ReactSelectSingle
                          value={values?.order_status}
                          options={[
                            { label: 'Initial', value: 1 },
                            { label: 'IN Progress', value: 3 },
                            { label: 'Completed', value: 6, disabled: true },
                          ]}
                          itemTemplate={statusItemTemplate}
                          name="order_status"
                          onChange={e => {
                            handleProjectStatusChange(e);
                          }}
                          valueTemplate={statusItemTemplate}
                          placeholder="Project Status"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col lg={9}>
                <div className="title_right_wrapper">
                  <ul className="add_assign_ul">
                    <li>
                      <Link to="/reporting" className="btn_primary btn_right">
                        Today’s Reporting
                        <img src={RightArrow} alt="RightArrowIcon" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/assigned-projects" className="btn_border_dark">
                        Exit Page
                      </Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

          <div className="overview_wrap p20 p15-sm">
            <Row className="g-3">
              <Col lg={5}>
                <div className="project_wapper">
                  <div className="project_inner">
                    <ul>
                      <li>
                        <h5 className="text_gray">Project No</h5>
                        <h3 className="fw_500">{values?.inquiry_no}</h3>
                      </li>
                      <li>
                        <h5 className="text_gray">Create Date</h5>
                        <h3 className="fw_500">{values?.create_date}</h3>
                      </li>
                      <li>
                        <h5 className="text_gray">Event Date</h5>
                        <h3>
                          {`${
                            values?.start_date
                              ? moment(values?.start_date).format(
                                  'DD-MM-YYYY',
                                ) + ' To '
                              : ''
                          }${
                            values?.end_date
                              ? moment(values?.end_date).format('DD-MM-YYYY')
                              : ''
                          }`}
                        </h3>
                      </li>
                    </ul>
                  </div>
                  <div className="project_inner">
                    <ul>
                      <li>
                        <h5 className="text_gray">Venue</h5>
                        <h3>{values?.venue}</h3>
                      </li>
                      <li>
                        <h5 className="text_gray">Work Type</h5>
                        <h3>{values?.inquiry_type === 2 ? 'Exposing' : ''}</h3>
                      </li>
                    </ul>
                  </div>
                  <div className="project_inner project_inner_wrap">
                    <ul>
                      <li>
                        <h5 className="text_gray">Items</h5>
                        <ul>
                          {values?.item_name?.map((itemName, index) => (
                            <li key={index}>{itemName}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="project_inner">
                    <ul>
                      <li>
                        <h5 className="text_gray">Remark</h5>
                        <h3>{values?.remark}</h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col lg={7}>
                {values?.event_item_list?.map((item, index) => {
                  return (
                    <div className="assigned_exposing_wrapper">
                      <div className="assigned_time_date">
                        <div className="event_date mb-4">
                          <h5>
                            Event Date :{' '}
                            {
                              // item?.order_date
                              `${
                                item?.order_start_date
                                  ? item?.order_start_date + ' To '
                                  : ''
                              }${
                                item?.order_end_date ? item?.order_end_date : ''
                              }`
                            }
                          </h5>
                          <h5>Event Name : {item?.item_name}</h5>
                        </div>
                        <Row>
                          <Col lg={6}>
                            <ul className="d-flex align-items-end gap-2">
                              <li>
                                <div className="form_group mb-3">
                                  <label>Entry Place / Time</label>
                                  <InputText
                                    placeholder="Entry Place"
                                    className="input_wrap"
                                    name={`event_item_list[${index}].entry_place`}
                                    value={
                                      values?.event_item_list[index]
                                        ?.entry_place
                                    }
                                    // value={item?.entry_place}
                                    onChange={handleChange}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="form_group mb-3">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      components={[
                                        'TimeField',
                                        'TimeField',
                                        'TimeField',
                                      ]}
                                    >
                                      <TimeField
                                        name={`event_item_list[${index}].entry_time`}
                                        className="time_input_wrap"
                                        label=""
                                        format="HH:mm"
                                        value={dayjs(
                                          dayjs().format('YYYY-MM-DD') +
                                            'T' +
                                            item.entry_time,
                                          'YYYY-MM-DDTHH:mm',
                                        )}
                                        onChange={newValue => {
                                          let fieldValue = newValue;

                                          if (newValue) {
                                            fieldValue =
                                              newValue?.format('HH:mm');
                                          } else {
                                            fieldValue = '';
                                          }

                                          setFieldValue(
                                            `event_item_list[${index}].entry_time`,
                                            fieldValue,
                                          );
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>

                                  {/* <Calendar
                                    name={`event_item_list[${index}].entry_time`}
                                    placeholder="HH : MM"
                                    // value={item?.entry_time}
                                    value={
                                      values?.event_item_list[index]?.entry_time
                                    }
                                    onChange={handleChange}
                                    timeOnly
                                  /> */}
                                </div>
                              </li>
                            </ul>
                          </Col>
                          <Col lg={6}>
                            <ul className="d-flex align-items-end gap-2">
                              <li>
                                <div className="form_group mb-3">
                                  <label>Exit Place / Time</label>
                                  <InputText
                                    placeholder="Exit Place"
                                    className="input_wrap"
                                    name={`event_item_list[${index}].exit_place`}
                                    value={
                                      values?.event_item_list[index]?.exit_place
                                    }
                                    onChange={handleChange}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="form_group mb-3">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      components={[
                                        'TimeField',
                                        'TimeField',
                                        'TimeField',
                                      ]}
                                    >
                                      <TimeField
                                        name={`event_item_list[${index}].exit_time`}
                                        className="time_input_wrap"
                                        label=""
                                        format="HH:mm"
                                        value={
                                          // dayjs(
                                          // dayjs().format('YYYY-MM-DD') +
                                          //   item.exit_time,
                                          // 'YYYY-MM-DD HH:mm:ss',
                                          // )
                                          dayjs(
                                            dayjs().format('YYYY-MM-DD') +
                                              'T' +
                                              item.exit_time,
                                            'YYYY-MM-DDTHH:mm',
                                          )
                                        }
                                        onChange={newValue => {
                                          let fieldValue = newValue;
                                          if (newValue) {
                                            fieldValue =
                                              newValue?.format('HH:mm:ss');
                                          } else {
                                            fieldValue = '';
                                          }

                                          setFieldValue(
                                            `event_item_list[${index}].exit_time`,
                                            fieldValue,
                                          );
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>

                                  {/* <Calendar
                                    name={`event_item_list[${index}].exit_time`}
                                    placeholder="HH : MM"
                                    // value={item?.exit_time}
                                    value={
                                      values?.event_item_list[index]?.exit_time
                                    }
                                    onChange={handleChange}
                                    timeOnly
                                  /> */}
                                </div>
                              </li>
                            </ul>
                          </Col>
                          <Col lg={6}>
                            <ul className="d-flex align-items-end gap-2">
                              <li>
                                <div className="form_group mb-3">
                                  <label>Work Submit Place / Time</label>
                                  <InputText
                                    placeholder="Work Submit Place"
                                    className="input_wrap"
                                    name={`event_item_list[${index}].work_submit_place`}
                                    value={
                                      values?.event_item_list[index]
                                        ?.work_submit_place
                                    }
                                    onChange={handleChange}
                                  />
                                </div>
                              </li>
                              <li className="w-50">
                                <div className="form_group input_time mb-3">
                                  {/* <Calendar
                                    name={`event_item_list[${index}].work_submit_time`}
                                    placeholder="HH : MM"
                                    value={
                                      values?.event_item_list[index]
                                        ?.work_submit_time
                                    }
                                    onChange={handleChange}
                                    timeOnly
                                  /> */}
                                  <div className="d-md-flex align-items-center justify-content-start">
                                    <InputNumber
                                      name={`event_item_list[${index}].work_submit_hour`}
                                      value={item?.work_submit_hour}
                                      onChange={e => {
                                        setFieldValue(
                                          `event_item_list[${index}].work_submit_hour`,
                                          e?.value,
                                        );
                                      }}
                                      useGrouping={false}
                                      minFractionDigits={0}
                                      min={0}
                                    />
                                    <span className="px-1">
                                      {'H'} {':'}
                                    </span>
                                    <InputNumber
                                      name={`event_item_list[${index}].work_submit_minute`}
                                      value={item?.work_submit_minute}
                                      onChange={e => {
                                        setFieldValue(
                                          `event_item_list[${index}].work_submit_minute`,
                                          e?.value,
                                        );
                                      }}
                                      useGrouping={false}
                                      minFractionDigits={0}
                                      min={0}
                                    />
                                    <span className="px-1">{'M'}</span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </Col>
                          <Col lg={6}>
                            <ul className="d-flex align-items-end gap-2">
                              <li>
                                <div className="form_group mb-3">
                                  <label>Submit Data Size</label>
                                  <InputText
                                    type="number"
                                    placeholder="Data Size"
                                    className="input_wrap"
                                    name={`event_item_list[${index}].data_size`}
                                    value={
                                      values?.event_item_list[index]?.data_size
                                    }
                                    onChange={handleChange}
                                  />
                                </div>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div className="save-button text-end">
                        <Button
                          className="btn_primary"
                          onClick={() => handleSubmitEvent(item)}
                          disabled={!item?.is_assign}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProjectWorkExposing);
