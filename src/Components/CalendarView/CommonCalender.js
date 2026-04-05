import React, { memo } from 'react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector } from 'react-redux';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const CommonCalender = ({
  selectedEmployeeEvents,
  exposingPopupInfo,
  setExposingPopupInfo,
  exposingEventPopup,
  editingPopupInfo,
  setEditingPopupInfo,
  editingEventPopup,
}) => {
  const { activeCalenderTabIndex } = useSelector(({ calendar }) => calendar);

  // const handleSelect = ({ start, end }) => {
  //   const title = window.prompt('New Event name');
  //   if (title)
  //     setEventsData([
  //       ...eventsData,
  //       {
  //         start,
  //         end,
  //         title,
  //       },
  //     ]);
  // };

  const handleEventClick = (event, e) => {
    const rect = e.target.getBoundingClientRect();

    if (activeCalenderTabIndex === 1) {
      setEditingPopupInfo({
        event,
        x: rect.x,
        y: rect.y,
      });
    } else {
      setExposingPopupInfo({
        event,
        x: rect.x,
        y: rect.y,
      });
    }
  };

  const CustomEventWrapper = ({ event, children }) => (
    <div
      onClick={e => handleEventClick(event, e)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );

  return (
    <>
      <Calendar
        selectable
        views={['day', 'week', 'month']}
        defaultView="month"
        localizer={localizer}
        defaultDate={new Date()}
        // date={monthAsPerSelectedEmployee}
        events={selectedEmployeeEvents}
        components={{
          eventWrapper: CustomEventWrapper,
        }}
        // step={60}
        // timeslots={1}
        // min={new Date(2024, 8, 1, 0, 0)} // Min time
        // max={new Date(2024, 8, 1, 23, 59)} // Max time
        // onNavigate={date => dispatch(setMonthAsPerSelectedEmployee(date))}
        // onView={view => dispatch(setMonthAsPerSelectedEmployee(view))}
        // onSelectEvent={event => {
        //   alert(event.title);
        // }}
        // onSelectSlot={handleSelect}
      />
      {editingPopupInfo && editingEventPopup()}
      {exposingPopupInfo && exposingEventPopup()}
    </>
  );
};

export default memo(CommonCalender);
