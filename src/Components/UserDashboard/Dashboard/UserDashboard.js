import { React, useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { TabView, TabPanel } from 'primereact/tabview';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
  getCheckReportingDay,
  getOngoingProjects,
  getPerformanceReport,
  getProjectStatus,
  getUpcomingProjects,
  getUserAnnouncementList,
  getUserHolidayList,
  setApproachDeadlineData,
  setCurrentWorkingData,
  setRecentCompletedData,
} from 'Store/Reducers/UserFlow/UserDashboardSlice';
import OngoingProject from './OngoingProject';
import UpComingProject from './UpComingProject';
import PerformanceMetric from './PerformanceMetric';
import VideoImg from '../../../Assets/Images/play-video.png';
import LeftIcon from '../../../Assets/Images/left-arrow.svg';
import RightIcon from '../../../Assets/Images/right-arrow.svg';
import WorkingIcon from '../../../Assets/Images/working-bag.svg';
import CompletedIcon from '../../../Assets/Images/completed-bag.svg';
import DeadlineIcon from '../../../Assets/Images/deadline-calender.svg';
import Loader from 'Components/Common/Loader';

export default function UserDashboard() {
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState({
    approachDeadlineIndex: 0,
    currentWorkingIndex: 0,
    recentCompletedIndex: 0,
  });

  const {
    userHolidayList,
    currentWorkingData,
    recentCompletedData,
    approachDeadlineData,
    userAnnouncementList,
    userProjectStatusData,
    userOngoingProjectsList,
    userHolidayLoading,
    userAnnouncementLoading,
    userProjectStatusLoading,
    userOngoingProjectLoading,
    userUpcomingProjectLoading,
    userPerformanceReportLoading,
    userCheckReportingDayLoading,
  } = useSelector(({ userDashboard }) => userDashboard);

  useEffect(() => {
    dispatch(getUserAnnouncementList());
    dispatch(getUserHolidayList());
    dispatch(getUpcomingProjects({ new: true }));
    dispatch(
      getOngoingProjects({
        start: 1,
        limit: 10,
      }),
    );
    dispatch(getPerformanceReport());
    dispatch(getProjectStatus());
    dispatch(getCheckReportingDay());
  }, [dispatch]);

  // const prevSlide = (indexName, statusName) => {
  //   const prevIndex =
  //     currentIndex[indexName] === 0
  //       ? userProjectStatusData[statusName]?.length - 1
  //       : currentIndex[indexName] - 1;

  //   const currentData = userProjectStatusData[statusName][prevIndex];
  //   setCurrentIndex({ ...currentIndex, [indexName]: prevIndex });

  //   if (indexName === 'approachDeadlineIndex') {
  //     dispatch(setApproachDeadlineData(currentData));
  //   } else if (indexName === 'currentWorkingIndex') {
  //     dispatch(setCurrentWorkingData(currentData));
  //   } else if (indexName === 'recentCompletedIndex') {
  //     dispatch(setRecentCompletedData(currentData));
  //   }
  // };

  // const nextSlide = (indexName, statusName) => {
  //   const nexIndex =
  //     currentIndex[indexName] === userProjectStatusData[statusName]?.length - 1
  //       ? 0
  //       : currentIndex[indexName] + 1;

  //   const currentData = userProjectStatusData[statusName][nexIndex];
  //   setCurrentIndex({ ...currentIndex, [indexName]: nexIndex });

  //   if (indexName === 'approachDeadlineIndex') {
  //     dispatch(setApproachDeadlineData(currentData));
  //   } else if (indexName === 'currentWorkingIndex') {
  //     dispatch(setCurrentWorkingData(currentData));
  //   } else if (indexName === 'recentCompletedIndex') {
  //     dispatch(setRecentCompletedData(currentData));
  //   }
  // };

  const handleSelect = (selectedIndex, sliderName) => {
    setCurrentIndex({ ...currentIndex, [sliderName]: selectedIndex });
  };

  return (
    <>
      {userUpcomingProjectLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="user_dashboard_top_wrap">
          <Row className="g-4">
            <Col xl={3} sm={6}>
              <div className="working_box p20 p15-xl radius15 border">
                <div className="working_box_title_wrap">
                  <div className="working_img">
                    <img src={DeadlineIcon} alt="DeadlineIcon" />
                  </div>
                  <div className="working_title d-flex justify-content-between">
                    <h4 className="m-0">Approaching deadlines</h4>
                    <h2 className="m-0">
                      {userProjectStatusData?.deadline_project?.length}
                    </h2>
                  </div>
                </div>
                <div className="user_dash_slider">
                  <div className="date_box mt20 delete_project_wrapper radius15">
                    <div className="delete_project_inner w-100">
                      <div className="client_delet_project w-100">
                        <>
                          <div className="client_delet_left w-100">
                            <div className="slider_wrapper">
                              <Carousel
                                interval={null}
                                activeIndex={
                                  currentIndex?.approachDeadlineIndex
                                }
                                onSelect={e =>
                                  handleSelect(e, 'approachDeadlineIndex')
                                }
                              >
                                {userProjectStatusData?.deadline_project?.map(
                                  item => {
                                    return (
                                      <Carousel.Item>
                                        <Carousel.Caption>
                                          <div className="slider_inner_wrap justify-content-between w-100 d-flex">
                                            <h4 className="m-0">
                                              {item?.inquiry_no}
                                            </h4>
                                            <h4 className="m-0">
                                              {item?.min_due_date
                                                ? moment(
                                                    item?.min_due_date?.split(
                                                      'T',
                                                    )[0],
                                                  ).format('DD-MM-YYYY')
                                                : ''}
                                            </h4>
                                          </div>
                                        </Carousel.Caption>
                                      </Carousel.Item>
                                    );
                                  },
                                )}
                              </Carousel>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="date_box radius15 mt20">
                {currentIndex?.approachDeadlineIndex !== 0 && (
                  <span>
                    <img
                      src={LeftIcon}
                      alt=""
                      style={{ cursor: 'pointer' }}
                      name="approachDeadlineIndex"
                      className="ms-2"
                      onClick={e =>
                        currentIndex[e.target.name] !== 0 &&
                        prevSlide(e.target.name, 'deadline_project')
                      }
                    />
                  </span>
                )}
                <h4 className="m-0">{approachDeadlineData?.inquiry_no}</h4>
                <h4 className="m-0">
                  {approachDeadlineData?.min_due_date
                    ? moment(
                        approachDeadlineData?.min_due_date?.split('T')[0],
                      ).format('DD-MM-YYYY')
                    : ''}
                </h4>
                {userProjectStatusData?.deadline_project?.length - 1 > 0 &&
                  currentIndex?.approachDeadlineIndex !==
                    userProjectStatusData?.deadline_project?.length - 1 && (
                    <span>
                      <img
                        src={RightIcon}
                        alt=""
                        style={{ cursor: 'pointer' }}
                        name="approachDeadlineIndex"
                        className="ms-2"
                        onClick={e =>
                          currentIndex[e.target.name] !==
                            userProjectStatusData?.deadline_project?.length -
                              1 && nextSlide(e.target.name, 'deadline_project')
                        }
                      />
                    </span>
                  )}
              </div> */}
              </div>
            </Col>
            <Col xl={3} sm={6}>
              <div className="working_box p20 p15-xl radius15 border">
                <div className="working_box_title_wrap">
                  <div className="working_img">
                    <img src={WorkingIcon} alt="WorkingIcon" />
                  </div>
                  <div className="working_title d-flex justify-content-between">
                    <h4 className="m-0">Current Working </h4>
                    <h2 className="m-0">
                      {userProjectStatusData?.ongoing_project?.length}
                    </h2>
                  </div>
                </div>
                <div className="user_dash_slider">
                  <div className="date_box mt20 delete_project_wrapper radius15">
                    <div className="delete_project_inner w-100">
                      <div className="client_delet_project w-100">
                        <div className="client_delet_left w-100">
                          <div className="slider_wrapper">
                            <Carousel
                              interval={null}
                              activeIndex={currentIndex?.currentWorkingIndex}
                              onSelect={e =>
                                handleSelect(e, 'currentWorkingIndex')
                              }
                            >
                              {userProjectStatusData?.ongoing_project?.map(
                                item => {
                                  return (
                                    <Carousel.Item>
                                      <Carousel.Caption>
                                        <div className="slider_inner_wrap justify-content-between w-100 d-flex">
                                          <h4 className="m-0">
                                            {item?.inquiry_no}
                                          </h4>
                                          <h4 className="m-0">
                                            {item?.min_due_date
                                              ? moment(
                                                  item?.min_due_date?.split(
                                                    'T',
                                                  )[0],
                                                ).format('DD-MM-YYYY')
                                              : ''}
                                          </h4>
                                        </div>
                                      </Carousel.Caption>
                                    </Carousel.Item>
                                  );
                                },
                              )}
                            </Carousel>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="date_box radius15 mt20">
                {currentIndex.currentWorkingIndex !== 0 && (
                  <span>
                    <img
                      src={LeftIcon}
                      alt=""
                      name="currentWorkingIndex"
                      className="ms-2"
                      style={{ cursor: 'pointer' }}
                      onClick={e =>
                        currentIndex[e.target.name] !== 0 &&
                        prevSlide(e.target.name, 'ongoing_project')
                      }
                    />
                  </span>
                )}
                <h4 className="m-0">{currentWorkingData?.inquiry_no}</h4>
                <h4 className="m-0 d-flex align-items-center">
                  {currentWorkingData?.min_due_date
                    ? moment(
                        currentWorkingData?.min_due_date?.split('T')[0],
                      ).format('DD-MM-YYYY')
                    : ''}
                </h4>
                {userProjectStatusData?.ongoing_project?.length - 1 > 0 &&
                  currentIndex.currentWorkingIndex !==
                    userProjectStatusData?.ongoing_project?.length - 1 && (
                    <span>
                      <img
                        src={RightIcon}
                        alt=""
                        style={{ cursor: 'pointer' }}
                        name="currentWorkingIndex"
                        className="ms-2"
                        onClick={e =>
                          currentIndex[e.target.name] !==
                            userProjectStatusData?.ongoing_project?.length -
                              1 && nextSlide(e.target.name, 'ongoing_project')
                        }
                      />
                    </span>
                  )}
              </div> */}
              </div>
            </Col>
            <Col xl={3} sm={6}>
              <div className="working_box p20 p15-xl radius15 border">
                <div className="working_box_title_wrap">
                  <div className="working_img">
                    <img src={CompletedIcon} alt="CompletedIcon" />
                  </div>
                  <div className="working_title d-flex justify-content-between">
                    <h4 className="m-0">Recent Completed</h4>
                    <h2 className="m-0">
                      {userProjectStatusData?.completed_project?.length}
                    </h2>
                  </div>
                </div>
                <div className="user_dash_slider">
                  <div className="date_box mt20 delete_project_wrapper radius15">
                    <div className="delete_project_inner w-100">
                      <div className="client_delet_project w-100">
                        <div className="client_delet_left w-100">
                          <div className="slider_wrapper">
                            <Carousel
                              interval={null}
                              activeIndex={currentIndex?.recentCompletedIndex}
                              onSelect={e =>
                                handleSelect(e, 'recentCompletedIndex')
                              }
                            >
                              {userProjectStatusData?.completed_project?.map(
                                (item, i) => {
                                  return (
                                    <Carousel.Item key={i}>
                                      <Carousel.Caption>
                                        <div className="slider_inner_wrap justify-content-between w-100 d-flex">
                                          <h4 className="m-0">
                                            {item?.inquiry_no}
                                          </h4>
                                          <h4 className="m-0">
                                            {item?.completed_date
                                              ? moment(
                                                  item?.completed_date?.split(
                                                    'T',
                                                  )[0],
                                                ).format('DD-MM-YYYY')
                                              : ''}
                                          </h4>
                                        </div>
                                      </Carousel.Caption>
                                    </Carousel.Item>
                                  );
                                },
                              )}
                            </Carousel>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="date_box radius15 mt20">
                {currentIndex.recentCompletedIndex !== 0 && (
                  <span>
                    <img
                      src={LeftIcon}
                      alt=""
                      style={{ cursor: 'pointer' }}
                      name="recentCompletedIndex"
                      className="ms-2"
                      onClick={e =>
                        currentIndex[e.target.name] !== 0 &&
                        prevSlide(e.target.name, 'completed_project')
                      }
                    />
                  </span>
                )}
                <h4 className="m-0">{recentCompletedData?.inquiry_no}</h4>
                <h4 className="m-0">
                  {recentCompletedData?.completed_date
                    ? moment(
                        recentCompletedData?.completed_date?.split('T')[0],
                      ).format('DD-MM-YYYY')
                    : ''}
                </h4>
                {userProjectStatusData?.completed_project?.length - 1 > 0 &&
                  currentIndex.currentWorkingIndex !==
                    userProjectStatusData?.completed_project?.length - 1 && (
                    <span>
                      <img
                        src={RightIcon}
                        alt=""
                        style={{ cursor: 'pointer' }}
                        name="recentCompletedIndex"
                        className="ms-2"
                        onClick={e =>
                          currentIndex[e.target.name] !==
                            userProjectStatusData?.completed_project?.length -
                              1 && nextSlide(e.target.name, 'completed_project')
                        }
                      />
                    </span>
                  )}
              </div> */}
              </div>
            </Col>
            <Col xl={3} sm={6}>
              <div className="festival_box p20 p15-xl border radius15">
                <h4>Upcoming Holiday</h4>
                <div className="p30 pb0 festival_inner">
                  <h2 className="mb15 mb10-xl">
                    {userHolidayList?.holiday_name}
                  </h2>
                  <h4>{userHolidayList?.holiday_date}</h4>
                </div>
                <img src={VideoImg} alt="VideoImg" />
              </div>
            </Col>
          </Row>
        </div>
        <div className="user_dashboard_inner_wrap mt20">
          <div className="location_wrap">
            <TabView>
              {userOngoingProjectsList?.list?.length &&
                userOngoingProjectsList?.list?.map((tab, i) => {
                  return (
                    <TabPanel key={i} header={`Project ${i + 1}`}>
                      <OngoingProject projectData={tab} />
                    </TabPanel>
                  );
                })}
            </TabView>
          </div>
          <Row className="g-4">
            <UpComingProject />
            <PerformanceMetric />
            <Col xl={4} lg={6}>
              <div className="announcement_wrap bg-white radius15 border h-100">
                <div className="ann_title p15 d-flex justify-content-between border-bottom">
                  <h4 className="m-0">Announcement</h4>
                  <h5 className="m-0">
                    Today, {moment(new Date()).format('ddd, D MMMM YYYY')}
                  </h5>
                </div>
                <div className="accordion_wrapper">
                  <Accordion>
                    {userAnnouncementList?.length > 0 &&
                      userAnnouncementList?.map((item, i) => {
                        return (
                          <AccordionTab
                            key={i}
                            header={item?.announcement_title}
                          >
                            <div className="accordion_inner">
                              {/* <p className="p0 border-0">{item?.announcement}</p> */}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item?.announcement,
                                }}
                                className="editor_text_wrapper"
                              />
                              <div className="d-flex align-items-center justify-content-between">
                                <h6>{item?.announcement_time}</h6>
                                <h6>{item?.announcement_date}</h6>
                              </div>
                            </div>
                          </AccordionTab>
                        );
                      })}
                  </Accordion>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
