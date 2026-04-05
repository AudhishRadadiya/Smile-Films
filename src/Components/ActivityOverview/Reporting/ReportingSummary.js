import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import NonProjectReporting from './NonProjectReporting';
import ProjectReporting from './ProjectReporting';
import { getEmployeeReportingList } from 'Store/Reducers/ActivityOverview/AdminReportingFlow/AdminReportingSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';

export default function ReportingSummary() {
  const [reportingTab, setReportingTab] = useState('project_reporting');
  const [totalRowsCount, setTotalRowsCount] = useState({
    projectReporting: 0,
    nonProjectReporting: 0,
  });

  const dispatch = useDispatch();
  const { getEmployeeReportingListLoading } = useSelector(
    ({ adminReporting }) => adminReporting,
  );

  useEffect(() => {
    dispatch(
      getEmployeeReportingList({ start: 1, limit: 10, missing: true }),
    ).then(response => {
      setTotalRowsCount(prevState => ({
        ...prevState,
        nonProjectReporting: response.payload.totalRows,
      }));
      dispatch(
        getEmployeeReportingList({ start: 1, limit: 10, missing: false }),
      ).then(response => {
        setTotalRowsCount(prevState => ({
          ...prevState,
          projectReporting: response.payload.totalRows,
        }));
      });
    });
  }, [dispatch]);

  return (
    <div className="main_Wrapper">
      {getEmployeeReportingListLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap border-0">
          <h3 className="mb20">Reporting</h3>
          <div className="reporting_tab_wrapper">
            <Row>
              <Col xl={6} lg={8}>
                <ul>
                  <li>
                    <div
                      className={
                        reportingTab === 'project_reporting'
                          ? 'reporting_tab project_reporting active'
                          : 'reporting_tab project_reporting'
                      }
                      onClick={() => setReportingTab('project_reporting')}
                    >
                      <h5>Project Reporting</h5>
                      <p>{totalRowsCount.projectReporting || 0}</p>
                    </div>
                  </li>
                  <li>
                    <div
                      className={
                        reportingTab === 'non_project_reporting'
                          ? 'reporting_tab non_project_reporting active'
                          : 'reporting_tab non_project_reporting'
                      }
                      onClick={() => setReportingTab('non_project_reporting')}
                    >
                      <h5>Non Project Reporting</h5>
                      <p>{totalRowsCount.nonProjectReporting || 0}</p>
                    </div>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
        <div className="data_table_wrapper">
          {reportingTab === 'project_reporting' ? (
            <ProjectReporting />
          ) : (
            <NonProjectReporting />
          )}
        </div>
      </div>
    </div>
  );
}
