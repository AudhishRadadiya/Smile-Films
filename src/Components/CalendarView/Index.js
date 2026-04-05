import React, { useEffect } from 'react';
import Loader from 'Components/Common/Loader';
import EditingCalendar from './EditingCalendar';
import ExposingCalendar from './ExposingCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, TabPanel } from 'primereact/tabview';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { setActiveCalenderTabIndex } from 'Store/Reducers/Calendar/CalendarSlice';
import {
  exposingEmployeeList,
  setEmployeesList,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';

export default function Calender() {
  const dispatch = useDispatch();

  const { exposingItemLoading, exposingEmployeeLoading } = useSelector(
    ({ exposing }) => exposing,
  );

  const { editingItemLoading } = useSelector(({ editing }) => editing);

  const { activeCalenderTabIndex } = useSelector(({ calendar }) => calendar);

  useEffect(() => {
    let type = 2;

    if (activeCalenderTabIndex === 1) {
      type = activeCalenderTabIndex;
    } else {
      type = 2;
    }

    dispatch(
      exposingEmployeeList({
        freelancer: false,
        type,
      }),
    );
  }, [dispatch, activeCalenderTabIndex]);

  // const showItemsNameandCompanyName = item => {
  //   let buttonTooltip = `${item?.item_name} - ${item?.client_name}`;

  //   if (buttonTooltip?.length > 30) {
  //     return (
  //       <Button
  //         tooltip={buttonTooltip}
  //         tooltipOptions={{ position: 'top' }}
  //         className="btn_transparent text_dark item_name_with_tooltip"
  //       >
  //         {`${item?.item_name} - ${item?.client_name}`}
  //       </Button>
  //     );
  //   } else {
  //   return buttonTooltip;
  //   }
  // };

  return (
    <>
      {(exposingItemLoading ||
        exposingEmployeeLoading ||
        editingItemLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="calender_Wrapper">
          <TabView
            activeIndex={activeCalenderTabIndex}
            onTabChange={async e => {
              dispatch(setActiveCalenderTabIndex(e.index));
              dispatch(setEmployeesList([]));
            }}
          >
            <TabPanel header="Exposing Calendar">
              <ExposingCalendar />
            </TabPanel>
            <TabPanel header="Editing Calendar">
              <EditingCalendar />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
}
