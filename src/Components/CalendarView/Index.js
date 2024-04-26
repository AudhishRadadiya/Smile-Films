import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ExposingCalendar from './ExposingCalendar';
import EditingCalendar from './EditingCalendar';

export default function Calender() {
  return (
    <div className="main_Wrapper">
      <div className="calender_Wrapper">
        <TabView>
          <TabPanel header="Exposing Calendar">
            <ExposingCalendar />
          </TabPanel>
          <TabPanel header="Editing Calendar">
            <EditingCalendar />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
