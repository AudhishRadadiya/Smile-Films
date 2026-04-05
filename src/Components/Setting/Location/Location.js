import React from 'react';
import CompanySidebar from '../CompanySidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import CountryLocation from './CountryLocation';
import CityLocation from './CityLocation';
import StateLocation from './StateLocation';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveIndex } from 'Store/Reducers/Settings/Master/CountrySlice';

export default function Location({ hasAccess }) {
  const dispatch = useDispatch();
  const { activeIndex } = useSelector(({ country }) => country);
  return (
    <div className="main_Wrapper">
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="location_wrap">
            <TabView
              activeIndex={activeIndex}
              onTabChange={e => {
                dispatch(setActiveIndex(e.index));
              }}
            >
              <TabPanel header="Country">
                <CountryLocation hasAccess={hasAccess} />
              </TabPanel>
              <TabPanel header="State">
                <StateLocation hasAccess={hasAccess} />
              </TabPanel>
              <TabPanel header="City">
                <CityLocation hasAccess={hasAccess} />
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
}
