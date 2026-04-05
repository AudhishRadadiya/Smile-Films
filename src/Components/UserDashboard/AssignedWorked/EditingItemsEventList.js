import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { generateUniqueId } from 'Helper/CommonHelper';
import { getFormattedDate, getSeverityStatus } from 'Helper/CommonList';
import { editingEventSchema } from 'Schema/AssignedWorked/AssignedWorkedSchema';
import {
  setActiveTabData,
  getAssignedWorkListItems,
  setAssignWorkedEditingData,
  assignedWorkedEditingEventList,
  assignedWorkedEditingDeleteEventDetail,
  assignedWorkedEditingEditEventDetail,
  assignedWorkedEditingAddEventDetail,
} from 'Store/Reducers/UserFlow/AssignedWorkedSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import UserIcon from '../../../Assets/Images/add-user.svg';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditIcon from '../../../Assets/Images/edit.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { InputNumber } from 'primereact/inputnumber';

const color_code = [
  '#FCEACF',
  '#EBE8FF',
  '#CCEAFF',
  '#F6D5D5',
  '#E8F4EC',
  '#E9E4FF',
  '#FFE1CC',
  '#E5EBF0',
  '#BFE0C9',
];

const workFlowInitialData = {
  event_name: '',
  event_date: '',
  event_item_info: [
    {
      event_item_name: '',
      event_hour: 0,
      event_minute: 0,
      event_second: 0,
      unique_id: generateUniqueId(),
    },
  ],
  total_raw_hours: '',
  final_output_hour: 0,
  final_output_minute: 0,
  final_output_second: 0,
};

const EditingItemsEventList = props => {
  const { fieldValue, handleProjectStatusChange } = props;
  const { id } = useParams();
  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);
  const [eventDeleteData, setEventDeleteData] = useState({});
  const [eventData, setEventData] = useState(workFlowInitialData);
  const [showEventDataPopup, setShowEventDataPopup] = useState(false);

  const { activeTabData, assignWorkedEditingData } = useSelector(
    ({ assignedWorked }) => assignedWorked,
  );
  const { activeTabIndex, activeTabObj } = activeTabData;

  const submitEventHandle = useCallback(
    async value => {
      let res;

      const total_final_hours = value?.final_output_hour
        ? value?.final_output_hour
        : '00';
      const total_final_minutes = value?.final_output_minute
        ? value?.final_output_minute
        : '00';
      const total_final_seconds = value?.final_output_second
        ? value?.final_output_second
        : '00';
      const formattedFinalOutputTime = `${total_final_hours}:${total_final_minutes}:${total_final_seconds}`;

      const updatedEventData = value?.event_item_info?.map(event => {
        const total_event_hours = event?.event_hour ? event?.event_hour : '00';
        const total_event_minutes = event?.event_minute
          ? event?.event_minute
          : '00';
        const total_event_seconds = event?.event_second
          ? event?.event_second
          : '00';
        const formattedEventTime = `${total_event_hours}:${total_event_minutes}:${total_event_seconds}`;

        return {
          ...(value?._id && { eventItem_id: event?._id }),
          event_item_name: event?.event_item_name,
          event_hour: formattedEventTime,
        };
      });

      let payload = {
        order_id: id,
        order_item_id: activeTabObj?.item_status_id,
        event_name: value?.event_name,
        event_date: getFormattedDate(value?.event_date),
        event_item: updatedEventData,
        final_output_hours: formattedFinalOutputTime,
        total_raw_hours: value?.total_raw_hours
          ? value?.total_raw_hours
          : '00:00:00',
      };

      if (value?._id) {
        payload = {
          ...payload,
          event_id: value?._id,
        };
        res = await dispatch(assignedWorkedEditingEditEventDetail(payload));
      } else {
        res = await dispatch(assignedWorkedEditingAddEventDetail(payload));
      }

      if (res) {
        dispatch(
          assignedWorkedEditingEventList({
            order_id: id,
            order_item_id: activeTabObj?.item_status_id,
          }),
        )
          .then(response => {
            const eventsList = response?.payload;
            const updatedEventData = {
              ...eventsList,
              list: eventsList?.list?.map(item => {
                return {
                  ...item,
                  event_date: new Date(item?.event_date),
                  event_item_info: item?.event_item_info?.map(item_info => {
                    return {
                      ...item_info,
                      unique_id: generateUniqueId(),
                    };
                  }),
                };
              }),
            };
            dispatch(
              setAssignWorkedEditingData({
                ...assignWorkedEditingData,
                events_list: updatedEventData,
              }),
            );
          })
          .then(() => {
            dispatch(getAssignedWorkListItems({ order_id: id })).then(res => {
              const response = res?.payload;
              const obj = response?.find(
                x => x?.item_status_id === activeTabObj?.item_status_id,
              );
              dispatch(
                setActiveTabData({
                  ...activeTabData,
                  activeTabObj: {
                    ...activeTabData?.activeTabObj,
                    ...obj,
                  },
                }),
              );
            });
          });
      }

      setShowEventDataPopup(false);
      setEventData(workFlowInitialData);
    },
    [activeTabObj, assignWorkedEditingData, dispatch, id],
  );

  const {
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: eventData,
    validationSchema: editingEventSchema,
    onSubmit: submitEventHandle,
  });

  useMemo(() => {
    const totalTime = values?.event_item_info?.reduce(
      (accumulator, currentValue) => {
        accumulator.seconds += currentValue.event_second;
        accumulator.minutes += currentValue.event_minute;
        accumulator.hours += currentValue.event_hour;

        if (accumulator.seconds >= 60) {
          accumulator.minutes += Math.floor(accumulator.seconds / 60);
          accumulator.seconds %= 60;
        }

        if (accumulator.minutes >= 60) {
          accumulator.hours += Math.floor(accumulator.minutes / 60);
          accumulator.minutes %= 60;
        }

        return accumulator;
      },
      { hours: 0, minutes: 0, seconds: 0 },
    );

    const total_hours = totalTime.hours.toString().padStart(2, '0');
    const total_minutes = totalTime.minutes.toString().padStart(2, '0');
    const total_seconds = totalTime.seconds.toString().padStart(2, '0');

    const formattedTime = `${total_hours}:${total_minutes}:${total_seconds}`;

    setFieldValue('total_raw_hours', formattedTime);

    return formattedTime ? formattedTime : '00:00:00';
  }, [values?.event_item_info]);

  const handleEventDelete = useCallback(() => {
    const payload = {
      order_id: id,
      order_item_id: eventDeleteData?.order_item_id,
      event_id: eventDeleteData._id,
    };

    dispatch(assignedWorkedEditingDeleteEventDetail(payload)).then(res => {
      dispatch(
        assignedWorkedEditingEventList({
          order_id: id,
          order_item_id: activeTabObj?.item_status_id,
        }),
      )
        .then(response => {
          const eventsList = response?.payload;
          const updatedEventData = {
            ...eventsList,
            list: eventsList?.list?.map(item => {
              return {
                ...item,
                event_date: new Date(item?.event_date),
                event_item_info: item?.event_item_info?.map(item_info => {
                  return {
                    ...item_info,
                    unique_id: generateUniqueId(),
                  };
                }),
              };
            }),
          };
          dispatch(
            setAssignWorkedEditingData({
              ...assignWorkedEditingData,
              events_list: updatedEventData,
            }),
          );
        })
        .then(() => {
          dispatch(getAssignedWorkListItems({ order_id: id })).then(res => {
            const response = res?.payload;
            const obj = response?.find(
              x => x?.item_status_id === activeTabObj?.item_status_id,
            );
            dispatch(
              setActiveTabData({
                ...activeTabData,
                activeTabObj: {
                  ...activeTabData?.activeTabObj,
                  ...obj,
                },
              }),
            );
          });
        });
    });

    setDeletePopup(false);
    setEventDeleteData({});
  }, [id, dispatch, activeTabObj, eventDeleteData, assignWorkedEditingData]);

  const handleTabChange = useCallback(
    (tabIndex, selectedTabItem, tabName) => {
      // set active tab data when change the tab.
      dispatch(
        setActiveTabData({
          activeTabIndex: tabIndex,
          activeTabObj: selectedTabItem,
        }),
      );

      // set default empty data when change the tab.
      // dispatch(
      //   setAssignWorkedEditingData({
      //     ...assignWorkedEditingData,
      //     events_list: {},
      //   }),
      // );

      // get events list according to change tab.
      dispatch(
        assignedWorkedEditingEventList({
          order_id: id,
          order_item_id: selectedTabItem?.item_status_id,
        }),
      )
        .then(response => {
          const eventsList = response?.payload;

          return { eventsList };
        })
        .then(({ eventsList }) => {
          dispatch(getAssignedWorkListItems({ order_id: id })).then(
            response => {
              const itemsCopyData = [...response?.payload];
              const itemsData = itemsCopyData?.sort((a, b) => {
                if (a.is_assign && !b.is_assign) {
                  return -1;
                }
                if (!a.is_assign && b.is_assign) {
                  return 1;
                }
                return 0;
              });

              let updatedItems = [];

              const events = {
                total_row_hour: '00:00:00',
                final_output_hour: '00:00:00',
                ...eventsList,
              };

              if (eventsList?.list?.length) {
                updatedItems = eventsList?.list?.map(item => {
                  const updatedEventItems = item?.event_item_info?.map(
                    item_info => {
                      return {
                        ...item_info,
                        unique_id: generateUniqueId(),
                      };
                    },
                  );
                  return {
                    ...item,
                    event_date: new Date(item?.event_date),
                    event_item_info: updatedEventItems?.length
                      ? updatedEventItems
                      : [],
                  };
                });
              }

              const updatedEventData = {
                ...events,
                list: updatedItems,
              };

              dispatch(
                setAssignWorkedEditingData({
                  ...assignWorkedEditingData,
                  events_list: updatedEventData,
                  items_list: itemsData,
                }),
              );

              return { eventsList, itemsData };
            },
          );
        });
    },
    [assignWorkedEditingData, dispatch, id],
  );

  const statusItemTemplate = option => {
    return (
      <Tag
        value={option?.label}
        severity={getSeverityStatus(option?.label)}
        className="d-block text-center"
      />
    );
  };

  const handleTabItemsName = item => {
    return (
      <div>
        <div className="text_gray package_title">{item?.package_name}</div>
        <div>{item?.item_name}</div>
      </div>
    );
  };

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  return (
    <div className="wedding_wrap">
      <div className="bg_light_blue py15 px20 border radius15">
        <TabView
          activeIndex={activeTabData?.activeTabIndex}
          onTabChange={e => {
            const selectedIndex = e.index;
            const selectedItem = fieldValue?.items_list[selectedIndex];

            if (
              selectedItem?.item_status_id !==
              activeTabData?.activeTabObj?.item_status_id
            ) {
              dispatch(
                setAssignWorkedEditingData({
                  ...assignWorkedEditingData,
                  events_list: {},
                }),
              );
              handleTabChange(
                selectedIndex,
                selectedItem,
                e.originalEvent.target.textContent,
              );
            }
          }}
        >
          {fieldValue?.items_list?.map(item => {
            return (
              <TabPanel
                header={
                  <OverlayTrigger
                    overlay={props => (
                      <Tooltip {...props}>
                        {item?.employees?.map(employee => {
                          return (
                            <div className="d-flex gap-2 align-items-center assigned_tooltip_user">
                              <div className="assigned_user">
                                <img
                                  src={
                                    employee?.image ? employee.image : UserIcon
                                  }
                                  alt=""
                                  onError={handleDefaultUser}
                                />
                              </div>
                              <div>
                                <h5 className="m-0">{employee?.name}</h5>
                              </div>
                            </div>
                          );
                        })}
                      </Tooltip>
                    )}
                    placement="top"
                  >
                    {handleTabItemsName(item)}
                  </OverlayTrigger>
                }
              ></TabPanel>
            );
          })}
        </TabView>
        <div className="table-responsive">
          <table className="Wedding_table table table-borderless m-0">
            <thead>
              <tr>
                <th>
                  <Button
                    className="btn_primary"
                    onClick={() => {
                      if (activeTabObj?.is_assign) {
                        setShowEventDataPopup(true);
                        setEventData({
                          ...workFlowInitialData,
                          event_item_info: [
                            {
                              unique_id: generateUniqueId(),
                              event_hour: 0,
                              event_minute: 0,
                              event_second: 0,
                              event_item_name: '',
                            },
                          ],
                        });
                      }
                    }}
                    disabled={!activeTabObj?.is_assign}
                  >
                    <img src={PlusIcon} alt="PlusIcon" /> Create
                  </Button>
                </th>
                <th>
                  <div className="wedding_time">
                    <h4>
                      {fieldValue?.events_list?.final_output_hour
                        ? fieldValue?.events_list?.final_output_hour
                        : '00:00:00'}
                    </h4>
                    <h6 className="m-0 text_gray">Final Output Hour</h6>
                  </div>
                </th>
                <th>
                  <div className="wedding_time">
                    <h4>
                      {fieldValue?.events_list?.total_row_hour
                        ? fieldValue?.events_list?.total_row_hour
                        : '00:00:00'}
                    </h4>
                    <h6 className="m-0 text_gray">Total Raw Hour</h6>
                  </div>
                </th>
                <th>
                  <ReactSelectSingle
                    value={activeTabData?.activeTabObj?.status || 1}
                    options={[
                      {
                        label: 'Initial',
                        value: 1,
                        disabled: activeTabObj?.checker,
                      },
                      {
                        label: 'Library Done',
                        value: 2,
                        disabled: activeTabObj?.checker,
                      },
                      {
                        label: 'IN Progress',
                        value: 3,
                        disabled: activeTabObj?.checker,
                      },
                      {
                        label: 'IN Checking',
                        value: 4,
                        disabled: activeTabObj?.checker,
                      },
                      {
                        label: 'Checking Done',
                        value: 7,
                        disabled: activeTabObj?.checker ? false : true,
                      },
                      {
                        label: 'Exporting',
                        value: 5,
                        disabled: activeTabObj?.checker,
                      },
                      {
                        label: 'Completed',
                        value: 6,
                        disabled:
                          fieldValue?.events_list?.final_output_hour ===
                            '00:00:00' ?? activeTabObj?.checker,
                      },
                    ]}
                    itemTemplate={statusItemTemplate}
                    name="status"
                    onChange={e => {
                      handleProjectStatusChange(e);
                    }}
                    valueTemplate={statusItemTemplate}
                    placeholder="Event Status"
                    className="w-100"
                    // disabled={!activeTabObj?.is_assign}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {fieldValue?.events_list?.list?.map((event, index) => {
                const colorIndex = index % color_code?.length;
                const eventDate = moment(event?.event_date).format(
                  'DD-MM-YYYY',
                );

                const updatedEventData = event?.event_item_info.map(item => {
                  const partitionTime = item?.event_hour?.split(':');
                  return {
                    ...item,
                    event_hour: Number(partitionTime[0]),
                    event_minute: Number(partitionTime[1]),
                    event_second: Number(partitionTime[2]),
                  };
                });

                return (
                  <>
                    <tr
                      // className="orange_table_bg"
                      style={{ backgroundColor: color_code[colorIndex] }}
                    >
                      <td>
                        <div className="function_time">
                          <h4>{event?.event_name}</h4>
                          <h6 className="mb-0 text_gray">Date : {eventDate}</h6>
                        </div>
                      </td>
                      <td>
                        <div className="function_time text-center">
                          <h4>
                            {event?.final_output_hours
                              ? event?.final_output_hours
                              : '00:00:00'}
                          </h4>
                          <h6 className="mb-0 text_gray">Final Output Hour</h6>
                        </div>
                      </td>
                      <td>
                        <div className="function_time text-center">
                          <h4>
                            {event?.total_raw_hours
                              ? event?.total_raw_hours
                              : '00:00:00'}
                          </h4>
                          <h6 className="mb-0 text_gray">Total Raw Hour</h6>
                        </div>
                      </td>
                      <td>
                        {activeTabObj?.is_assign && (
                          <div className="delete_btn_wrap mt-0">
                            <Button
                              className="btn_transparent"
                              onClick={() => {
                                if (activeTabObj?.is_assign) {
                                  setShowEventDataPopup(true);

                                  const partitionFinalHours =
                                    event?.final_output_hours?.split(':');

                                  setEventData({
                                    ...event,
                                    event_item_info: updatedEventData,
                                    final_output_hour: Number(
                                      partitionFinalHours[0],
                                    ),
                                    final_output_minute: Number(
                                      partitionFinalHours[1],
                                    ),
                                    final_output_second: Number(
                                      partitionFinalHours[2],
                                    ),
                                  });
                                }
                              }}
                              disabled={!activeTabObj?.is_assign}
                            >
                              <img src={EditIcon} alt="EditIcon" />
                            </Button>
                            <Button
                              className="btn_transparent"
                              onClick={() => {
                                if (activeTabObj?.is_assign) {
                                  setDeletePopup(true);
                                  setEventDeleteData(event);
                                }
                              }}
                              disabled={!activeTabObj?.is_assign}
                            >
                              <img src={TrashIcon} alt="TrashIcon" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {event?.event_item_info?.map(event_info => {
                      return (
                        <tr>
                          <td colSpan={2}>
                            <h4 className="fw_400 m-0">
                              {event_info?.event_item_name}
                            </h4>
                          </td>
                          <td>
                            <h4 className="fw_400 m-0 text-center">
                              {event_info?.event_hour}
                            </h4>
                          </td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog
        header={`${values?._id ? 'Edit' : 'Create'} Workflow`}
        className="modal_Wrapper modal_medium create_modal_wrapper"
        visible={showEventDataPopup}
        onHide={() => {
          setShowEventDataPopup(false);
          setEventData(workFlowInitialData);
        }}
        draggable={false}
      >
        <Row>
          <Col md={6}>
            <div className="form_group mb-3">
              <label>Event Name</label>{' '}
              <span className="text-danger fs-6">*</span>
              <InputText
                name="event_name"
                className="input_wrap"
                placeholder="Write a Event name"
                value={values?.event_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched?.event_name && errors?.event_name && (
                <p className="text-danger">{errors?.event_name}</p>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="form_group mb-3">
              <label>Event Date</label>{' '}
              <span className="text-danger fs-6">*</span>
              <div className="date_select text-end">
                <Calendar
                  name="event_date"
                  dateFormat="dd-mm-yy"
                  placeholder="Select Event Date"
                  value={values?.event_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showIcon
                  showButtonBar
                />
                {touched?.event_date && errors?.event_date && (
                  <p className="text-danger text-start">{errors?.event_date}</p>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt20 mb20">
          <h3 className="mb20">Camera Details</h3>
          <Row>
            {values?.event_item_info?.length > 0 &&
              values?.event_item_info?.map((item, index) => {
                return (
                  <Col md={6}>
                    <ul className="d-sm-flex gap-2">
                      <li className="camera_details_wrapper">
                        <div className="form_group mb-3">
                          <label className="title_label">
                            Camera & Time {index + 1}
                          </label>
                          <span className="text-danger fs-6">*</span>
                          <InputText
                            placeholder="Write name"
                            className="input_wrap"
                            name={`event_item_info[${index}].event_item_name`}
                            value={item?.event_item_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors?.event_item_info?.length &&
                            touched?.event_item_info?.length &&
                            touched?.event_item_info[index]?.event_item_name &&
                            errors?.event_item_info[index]?.event_item_name && (
                              <p className="text-danger">
                                {
                                  errors?.event_item_info[index]
                                    ?.event_item_name
                                }
                              </p>
                            )}
                        </div>
                      </li>
                      <li>
                        <div className="form_group input_time mb-3">
                          <div className="d-sm-inline-block d-flex align-items-center flex-row-reverse">
                            {index === 0 ? (
                              <Button
                                className="btn_transparent btn_right add_btn"
                                onClick={() => {
                                  setFieldValue('event_item_info', [
                                    ...values?.event_item_info,
                                    {
                                      unique_id: generateUniqueId(),
                                      event_item_name: '',
                                      event_hour: 0,
                                      event_minute: 0,
                                      event_second: 0,
                                    },
                                  ]);
                                }}
                              >
                                ADD
                                <img src={PlusIcon} alt="PlusIcon" />
                              </Button>
                            ) : (
                              <Button
                                className="btn_transparent add_btn"
                                onClick={() => {
                                  const updatedData =
                                    values?.event_item_info?.filter(
                                      value =>
                                        value?.unique_id !== item?.unique_id,
                                    );
                                  setFieldValue('event_item_info', updatedData);
                                }}
                              >
                                <img src={TrashIcon} alt="TrashIcon" />
                              </Button>
                            )}

                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={[
                                'TimePicker',
                                'TimePicker',
                                'TimePicker',
                              ]}
                            >
                              <TimePicker
                                className="time_input_wrap"
                                name={`event_item_info[${index}].event_hour`}
                                views={['hours', 'minutes', 'seconds']}
                                onChange={newValue => {
                                  let fieldValue = newValue;
                                  if (newValue) {
                                    fieldValue = newValue?.format('HH:mm:ss');
                                  } else {
                                    fieldValue = '';
                                  }

                                  setFieldValue(
                                    `event_item_info[${index}].event_hour`,
                                    fieldValue,
                                  );
                                }}
                                ampm={false}
                                onBlur={handleBlur}
                                timeSteps={{ minutes: 1, seconds: 1 }}
                              />
                            </DemoContainer>
                          </LocalizationProvider> */}

                            <div className="d-md-flex align-items-center justify-content-end">
                              <InputNumber
                                name={`event_item_info[${index}].event_hour`}
                                value={item?.event_hour}
                                className="mb-2"
                                onChange={e => {
                                  setFieldValue(
                                    `event_item_info[${index}].event_hour`,
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
                                name={`event_item_info[${index}].event_minute`}
                                value={item?.event_minute}
                                className="mb-2"
                                onChange={e => {
                                  setFieldValue(
                                    `event_item_info[${index}].event_minute`,
                                    e?.value,
                                  );
                                }}
                                useGrouping={false}
                                minFractionDigits={0}
                                min={0}
                                max={60}
                              />
                              <span className="px-1">
                                {'M'} {':'}
                              </span>
                              <InputNumber
                                name={`event_item_info[${index}].event_second`}
                                value={item?.event_second}
                                className="mb-2"
                                onChange={e => {
                                  setFieldValue(
                                    `event_item_info[${index}].event_second`,
                                    e?.value,
                                  );
                                }}
                                useGrouping={false}
                                minFractionDigits={0}
                                min={0}
                                max={60}
                              />
                              <span className="px-1">{'S'}</span>
                            </div>
                          </div>
                          {/* {errors?.event_item_info?.length &&
                            touched?.event_item_info?.length &&
                            touched?.event_item_info[index]?.event_hour &&
                            errors?.event_item_info[index]?.event_hour && (
                              <p className="text-danger">
                                {errors?.event_item_info[index]?.event_hour}
                              </p>
                            )} */}
                        </div>
                      </li>
                    </ul>
                  </Col>
                );
              })}
          </Row>
        </div>
        <Row className="align-items-end">
          <Col md={8}>
            <ul className="d-sm-flex gap-3">
              <li>
                <div className="form_group mb-sm-0 mb-3">
                  <label>Total Item Raw Hours</label>{' '}
                  <span className="text-danger fs-6">*</span>
                  <InputText
                    name="total_raw_hours"
                    className="input_wrap"
                    value={values?.total_raw_hours}
                    placeholder="HH:MM:SS"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                  />
                  {touched?.total_raw_hours && errors?.total_raw_hours && (
                    <p className="text-danger">{errors?.total_raw_hours}</p>
                  )}
                </div>
              </li>
              <li>
                <div className="form_group input_time mb-3">
                  <label>Final Output Hours</label>
                  <div>
                    <InputNumber
                      name="final_output_hour"
                      value={values?.final_output_hour}
                      className="mb-2"
                      onChange={e => {
                        setFieldValue('final_output_hour', e?.value);
                      }}
                      min={0}
                      useGrouping={false}
                      minFractionDigits={0}
                    />
                    <span className="px-1">
                      {'H'} {':'}
                    </span>
                    <InputNumber
                      name="final_output_minute"
                      value={values?.final_output_minute}
                      className="mb-2"
                      onChange={e => {
                        setFieldValue('final_output_minute', e?.value);
                      }}
                      min={0}
                      max={60}
                      useGrouping={false}
                      minFractionDigits={0}
                    />
                    <span className="px-1">
                      {'M'} {':'}
                    </span>
                    <InputNumber
                      name="final_output_second"
                      value={values?.final_output_second}
                      className="mb-2"
                      onChange={e => {
                        setFieldValue('final_output_second', e?.value);
                      }}
                      min={0}
                      max={60}
                      useGrouping={false}
                      minFractionDigits={0}
                    />
                    <span className="px-1">{'S'}</span>
                  </div>

                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={['TimePicker', 'TimePicker', 'TimePicker']}
                    >
                      <TimePicker
                        className="time_input_wrap"
                        name="final_output_hours"
                        views={['hours', 'minutes', 'seconds']}
                        onChange={newValue => {
                          let fieldValue = newValue;
                          if (newValue) {
                            fieldValue = newValue?.format('HH:mm:ss');
                          } else {
                            fieldValue = '';
                          }

                          setFieldValue('final_output_hours', fieldValue);
                        }}
                        ampm={false}
                        onBlur={handleBlur}
                        timeSteps={{ minutes: 1, seconds: 1 }}
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                </div>
              </li>
            </ul>
          </Col>
          <Col lg={4}>
            <div className="delete_btn_wrap mt-md-0 mt-3">
              <button
                className="btn_border_dark"
                onClick={() => {
                  setShowEventDataPopup(false);
                  setEventData(workFlowInitialData);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn_primary"
                onClick={handleSubmit}
              >
                {values?._id ? 'Update' : 'Save'}
              </button>
            </div>
          </Col>
        </Row>
      </Dialog>
      <ConfirmDeletePopup
        moduleName="Event"
        deletePopup={deletePopup}
        handleDelete={handleEventDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
};
export default memo(EditingItemsEventList);
