import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import ProjectOverview from './ProjectOverview';
import ProjectComments from './ProjectComments';

export default function ProjectDetails() {
  return (
    <div className="main_Wrapper">
      <div className="setting_right_wrap Profile_main bg-white radius15 border">
        <div className="tab_list_wrap">
          <div className="title_right_wrapper">
            <ul>
              <li>
                <div className="form_group">
                  <InputText
                    id="search"
                    placeholder="Search"
                    type="search"
                    className="input_wrap small search_wrap"
                  />
                </div>
              </li>
              <li>
                <Link to="/create-employee" className="btn_border_dark">
                  Exit Page
                </Link>
              </li>
            </ul>
          </div>
          <TabView>
            <TabPanel header="Project Overview">
              <ProjectOverview />
            </TabPanel>
            <TabPanel header="Comments">
              <ProjectComments />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
}
