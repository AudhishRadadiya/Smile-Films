import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CommonCalender from './CommonCalender';
import { Col, Row } from 'react-bootstrap';
import UserIcon from 'Assets/Images/add-user.svg';
import CloseIcon from 'Assets/Images/close-icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { generateUniqueId } from 'Helper/CommonHelper';
import { setSelectedEditingEmployee } from 'Store/Reducers/Calendar/CalendarSlice';
import { getEditingItemList } from 'Store/Reducers/Editing/EditingFlow/EditingSlice';

const EditingCalendar = () => {
  const dispatch = useDispatch();

  const [editingPopupInfo, setEditingPopupInfo] = useState(null);
  const [selectedEmployeeEvents, setSelectedEmployeeEvents] = useState([]);
  const [editingEmployeesOptions, setEditingEmployeesOptions] = useState([]);

  const { employeesList } = useSelector(({ exposing }) => exposing);
  const { selectedEditingEmployee } = useSelector(({ calendar }) => calendar);

  const handleEditingEmployeeEvents = useCallback(
    async selectedEditingEmployee => {
      // let months = []
      dispatch(setSelectedEditingEmployee(selectedEditingEmployee));

      const res = await dispatch(
        getEditingItemList({
          employee_id: selectedEditingEmployee?._id
            ? selectedEditingEmployee?._id
            : '',
        }),
      );

      if (res?.payload?.length) {
        const selectedEmployeeEventsData = res?.payload?.map((item, index) => {
          const orderDate = item?.order_date ? new Date(item?.order_date) : '';
          // const orderEndDate = item?.order_end_date
          //   ? new Date(item?.order_end_date)
          //   : '';

          // if (orderStartDate) {
          //   const startDateMonth = moment(orderStartDate).format('MM-DD-YYYY');
          //   months.push(startDateMonth);
          // }

          return {
            ...item,
            id: index,
            title: `${item?.item_name} - ${item?.client_full_name}`,
            allDay: true,
            start: orderDate,
            end: orderDate,
          };
        });

        setSelectedEmployeeEvents(selectedEmployeeEventsData);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (employeesList?.length) {
      const updatedOptions = employeesList?.map(item => {
        return {
          ...item,
          is_active: false,
          unique_id: generateUniqueId(),
        };
      });

      const allEmployeeOption = {
        employee_name: 'All Employees',
        value: 'All Employees',
        is_active: true,
        unique_id: generateUniqueId(),
      };
      const mergedOption = [allEmployeeOption, ...updatedOptions];

      handleEditingEmployeeEvents(allEmployeeOption);
      setEditingEmployeesOptions(mergedOption);
    }
  }, [employeesList]);

  const editingEmployeeListData = useMemo(() => {
    if (editingEmployeesOptions?.length) {
      return editingEmployeesOptions?.map(employee => {
        return (
          <li
            className={`hover_text ${
              employee?.is_active ? 'active_employee' : ''
            }`}
            onClick={() => {
              if (selectedEditingEmployee?.unique_id !== employee?.unique_id) {
                const updatedEmployees = editingEmployeesOptions.map(item => {
                  if (item?.unique_id === employee?.unique_id) {
                    return {
                      ...item,
                      is_active: true,
                    };
                  }
                  return {
                    ...item,
                    is_active: false,
                  };
                });
                setEditingEmployeesOptions(updatedEmployees);
                handleEditingEmployeeEvents(employee);
              }
            }}
          >
            {employee?.employee_name}
          </li>
        );
      });
    }
    return [];
  }, [editingEmployeesOptions, selectedEditingEmployee]);

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const editingEventPopup = useCallback(() => {
    const {
      client_company_name,
      client_full_name,
      order_date,
      inquiry_no,
      couple_name,
      due_date,
    } = editingPopupInfo?.event;

    const formattedDueDate = moment(due_date).format('D MMMM YYYY');
    const formattedOrderDate = moment(order_date).format('dddd, D MMMM YYYY');

    return (
      <div
        style={{
          position: 'absolute',
          top: editingPopupInfo?.y - 50,
          left: editingPopupInfo?.x + 120,
          background: 'white',
          border: '1px solid #ddd',
          padding: '10px 10px 20px 35px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          width: '450px',
          borderRadius: '8px',
        }}
        className="calender-popup-info"
      >
        <div className="d-flex justify-content-end">
          <button
            onClick={() => setEditingPopupInfo(null)}
            className="calender_close"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </div>
        <div className="calender_card_details">
          <h5 className="calender_user_name">
            {`${client_company_name} - ${client_full_name}`}
          </h5>
          <p>
            <span className="text_light_gray">{formattedOrderDate}</span>
          </p>
          <div className="calender_data">
            <p>
              <span className="text_light_gray">Order No:</span> {inquiry_no}
            </p>
            <p>
              <span className="text_light_gray">Couple Name:</span>{' '}
              {couple_name}
            </p>
            <p>
              <span className="text_light_gray">Due Date:</span>{' '}
              {formattedDueDate}
            </p>
          </div>
          <div>
            <p>
              <span className="text_light_gray">Assigned Exposer:</span>
            </p>
            <div className="assigned_info">
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img
                    src={UserIcon}
                    alt="profileimg"
                    onError={handleDefaultUser}
                  />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">item?</h5>
                </div>
              </div>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img
                    src={UserIcon}
                    alt="profileimg"
                    onError={handleDefaultUser}
                  />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">item?.employee_name</h5>
                </div>
              </div>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img
                    src={UserIcon}
                    alt="profileimg"
                    onError={handleDefaultUser}
                  />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">item?.employee_name</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [editingPopupInfo, handleDefaultUser]);

  return (
    <div className="table_main_Wrapper bg-white">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col md={3}>
            <div className="page_title">
              <h3 class="m-0">Editing Calendar</h3>
            </div>
          </Col>
          {/* <Col md={9}>
            <div className="right_filter_wrapper">
              <ul>
                <li>
                  <li class="search_input_wrap">
                    <div class="form_group">
                      <InputText
                        placeholder="Search"
                        className="input_wrap search_wrap"
                      />
                    </div>
                  </li>
                </li>
                <li>
                  <Dropdown className="dropdown_common export_dropdown position-static">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="btn_border icon_btn"
                    >
                      <img src={ExportIcon} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>PDF</Dropdown.Item>
                      <Dropdown.Item>XLS</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </Col> */}
        </Row>
      </div>
      <div className="calender_view_Wrapper">
        <div className="calender_filter_Wrap">
          <Accordion activeIndex={0}>
            <AccordionTab header="Employees ">
              <ul>{editingEmployeeListData}</ul>
            </AccordionTab>
          </Accordion>
        </div>
        <div className="calender_main_wrap">
          <CommonCalender
            editingPopupInfo={editingPopupInfo}
            setEditingPopupInfo={setEditingPopupInfo}
            selectedEmployeeEvents={selectedEmployeeEvents}
            editingEventPopup={editingEventPopup}
          />
        </div>
      </div>
    </div>
  );
};
export default EditingCalendar;
