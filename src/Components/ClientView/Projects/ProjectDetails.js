import { useCallback, useEffect } from 'react';
import ProjectComments from './ProjectComments';
import ProjectOverview from './ProjectOverview';
import { Link, useParams } from 'react-router-dom';
import { TabPanel, TabView } from 'primereact/tabview';
import { useDispatch, useSelector } from 'react-redux';
import ProjectExposingOverView from './ProjectExposingOverView';
import { getClientProjectOverviewData } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { clientProjectOverviewData } = useSelector(
    ({ clientProject }) => clientProject,
  );

  const fetchRequiredData = useCallback(() => {
    dispatch(
      getClientProjectOverviewData({
        order_id: id,
      }),
    );
  }, [id, dispatch]);

  useEffect(() => {
    fetchRequiredData();
  }, [fetchRequiredData]);

  return (
    <div className="main_Wrapper">
      <div className="setting_right_wrap Profile_main bg-white radius15 border">
        <div className="tab_list_wrap">
          <div className="title_right_wrapper">
            <ul>
              <li>
                <Link to="/projects" className="btn_border_dark">
                  Exit Page
                </Link>
              </li>
            </ul>
          </div>
          {clientProjectOverviewData &&
          clientProjectOverviewData?.inquiry_type === 'Exposing' ? (
            <TabView>
              <TabPanel header="Project Overview">
                <ProjectExposingOverView />
              </TabPanel>
            </TabView>
          ) : (
            <TabView>
              <TabPanel header="Project Overview">
                <ProjectOverview />
              </TabPanel>
              <TabPanel header="Comments">
                <ProjectComments />
              </TabPanel>
            </TabView>
          )}
        </div>
      </div>
    </div>
  );
}
