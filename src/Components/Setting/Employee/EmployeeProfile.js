import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CompanySidebar from '../CompanySidebar';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import Overview from './Overview';

export default function EmployeeProfile() {
  return (
    <div className="main_Wrapper">
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap bg-white radius15 border">
          <div className="tab_list_wrap">
            <div className="title_right_wrapper">
              <ul>
                <li>
                  <div className="form_group">
                    {/* <InputText
                      id="search"
                      placeholder="Search"
                      type="search"
                      className="input_wrap small search_wrap"
                    /> */}
                  </div>
                </li>
                <li>
                  <Link to="/employee" className="btn_border_dark">
                    Exit Page
                  </Link>
                </li>
              </ul>
            </div>
            <TabView>
              <TabPanel header="Overview">
                <Overview />
              </TabPanel>
              {/* <TabPanel header="Transaction">
                <Transaction />
              </TabPanel> */}
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
}
