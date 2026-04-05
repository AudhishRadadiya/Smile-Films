import Loader from 'Components/Common/Loader';
import {
  convertDate,
  fetchingDateFromComment,
  generateUniqueId,
} from 'Helper/CommonHelper';
import { AssignedWorkedStatusFilterList } from 'Helper/CommonList';
import {
  addComment,
  getCommentList,
  getEditingFlow,
  getOrderNoteList,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import {
  addCheckerCommentItem,
  assignedWorkEditItem,
  assignedWorkedEditOrder,
  assignedWorkedEditingEventList,
  getAssignedWorkListItems,
  getCheckerCommentList,
  setActiveTabData,
  setAssignWorkedEditingData,
} from 'Store/Reducers/UserFlow/AssignedWorkedSlice';
import { FormikProvider, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Tag } from 'primereact/tag';
import { memo, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import UserIcon from '../../../Assets/Images/add-user.svg';
import RightArrow from '../../../Assets/Images/white-right-arrow.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import EditingItemsEventLists from './EditingItemsEventList';

const getSeverityStatus = product => {
  switch (product) {
    case 'Initial':
      return 'info';
    case 'Library Done':
      return 'orange';
    case 'IN Progress':
      return 'warning';
    case 'IN Checking':
      return 'danger';
    case 'Completed':
      return 'success';
    case 'Exporting':
      return 'primary';
    default:
      return null;
  }
};

const ProjectWorkEditing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState('');
  const [checkerCommentText, setCheckerCommentText] = useState('');

  const { editingLoading, commentLoading, orderNoteLoading } = useSelector(
    ({ editing }) => editing,
  );
  const {
    activeTabData,
    assignedWorkItemsLoading,
    checkerCommentItemLoading,
    assignedWorkEventListLoading,
    assignedWorkEditItemLoading,
    assignedWorkEditOrderLoading,
    assignWorkedEditingData,
  } = useSelector(({ assignedWorked }) => assignedWorked);

  const { activeTabObj } = activeTabData;

  useEffect(() => {
    dispatch(getEditingFlow({ order_id: id }))
      .then(response => {
        const editingData = response.payload;
        return { editingData };
      })
      .then(({ editingData }) => {
        dispatch(getAssignedWorkListItems({ order_id: id }))
          .then(response => {
            const itemsCopyData = [...response?.payload];
            const itemsData = itemsCopyData?.sort((a, b) => {
              if (a.is_assign && !b.is_assign) {
                return -1;
              }
              if (!a.is_assign && b.is_assign) {
                return 1;
              }
              return 0;
            });

            return { editingData, itemsData };
          })
          .then(async ({ editingData, itemsData }) => {
            const tabItemData = itemsData[0];
            const response = await dispatch(
              assignedWorkedEditingEventList({
                order_id: id,
                order_item_id: tabItemData?.item_status_id,
              }),
            );

            const eventsList = response?.payload;
            return { editingData, itemsData, eventsList };
          })
          .then(async ({ editingData, itemsData, eventsList }) => {
            // let assignWorkEditingData = {
            //   ...editingData,
            // };

            const events = {
              total_row_hour: '00:00:00',
              final_output_hour: '00:00:00',
              ...eventsList,
            };

            let events_list = [];
            const itemObj = itemsData[0];

            if (eventsList?.list?.length) {
              events_list = eventsList?.list?.map(item => {
                return {
                  ...item,
                  event_date: new Date(item?.event_date),
                  event_item_info: item?.event_item_info?.map(item_info => {
                    return {
                      ...item_info,
                      unique_id: generateUniqueId(),
                    };
                  }),
                };
              });
            }

            const updatedEventData = {
              ...events,
              list: events_list,
            };

            const commentResponse = await dispatch(
              getCommentList({ order_id: id }),
            );
            const orderNoteResponse = await dispatch(
              getOrderNoteList({ order_id: id }),
            );

            // if (itemObj?.checker) {
            dispatch(
              setActiveTabData({ activeTabIndex: 0, activeTabObj: itemObj }),
            );
            const checkComments = await dispatch(
              getCheckerCommentList({
                item_status_id: itemObj?.item_status_id,
              }),
            );
            // assignWorkEditingData = {
            //   ...assignWorkEditingData,
            //   checker_comments_list: checkComments?.payload,
            // };
            // }

            const assignWorkEditingData = {
              ...editingData,
              items_list: itemsData,
              events_list: updatedEventData,
              editing_comments_list: commentResponse?.payload,
              comment_order_note_list: orderNoteResponse?.payload,
              checker_comments_list: checkComments?.payload,
              event_raw_time: [{ id: 0, name: '', time: '' }],
            };

            dispatch(setAssignWorkedEditingData(assignWorkEditingData));
            return assignWorkEditingData;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const statusItemTemplate = option => {
    return (
      <Tag
        value={option?.label}
        severity={getSeverityStatus(option?.label)}
        className="d-block text-center"
      />
    );
  };

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: assignWorkedEditingData,
  });

  const handleProjectStatusChange = useCallback(
    e => {
      const fieldName = e.target.name;
      const fieldValue = e.target.value;

      if (fieldName === 'project_work_status') {
        setFieldValue('order_status', fieldValue);

        const payload = {
          order_id: id,
          order_status: fieldValue,
        };

        dispatch(assignedWorkedEditOrder(payload))
          .then(res => {
            const editOrderData = res?.payload;
            return editOrderData ? editOrderData : {};
          })
          .then(({ editOrderData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(response => {
              const editingData = response.payload;
              dispatch(
                setAssignWorkedEditingData({
                  ...assignWorkedEditingData,
                  order_status: editingData?.order_status,
                }),
              );
              setFieldValue('order_status', editingData?.order_status);
            });
          });
      } else {
        if (values?.items_list?.length) {
          let updatedList = [...values?.items_list];

          const index = updatedList?.findIndex(
            x => x?.item_status_id === activeTabObj?.item_status_id,
          );

          if (index !== -1) {
            const oldObj = updatedList[index];

            const updatedObj = {
              ...oldObj,
              [fieldName]: fieldValue,
            };
            updatedList[index] = updatedObj;
            dispatch(
              setActiveTabData({ ...activeTabData, activeTabObj: updatedObj }),
            );
            setFieldValue('items_list', updatedList);

            // For update the event status:
            dispatch(
              assignedWorkEditItem({
                item_status_id: oldObj?.item_status_id,
                item_status: fieldValue,
              }),
            );
          }
        }
      }
    },
    [
      id,
      dispatch,
      activeTabObj,
      activeTabData,
      setFieldValue,
      values?.items_list,
    ],
  );

  const handleComments = useCallback(
    isCheckerComment => {
      if (isCheckerComment) {
        const fetchedCheckerComment =
          fetchingDateFromComment(checkerCommentText);
        if (fetchedCheckerComment) {
          setCheckerCommentText('');
          dispatch(
            addCheckerCommentItem({
              item_status_id: activeTabObj?.item_status_id,
              comment: checkerCommentText,
            }),
          ).then(res => {
            dispatch(
              getCheckerCommentList({
                item_status_id: activeTabObj?.item_status_id,
              }),
            ).then(response => {
              const checkerComments = response?.payload;
              dispatch(
                setAssignWorkedEditingData({
                  ...assignWorkedEditingData,
                  checker_comments_list: checkerComments,
                }),
              );
            });
          });
        }
      } else {
        const fetchedCommentData = fetchingDateFromComment(commentText);
        if (fetchedCommentData) {
          setCommentText('');
          dispatch(
            addComment({
              order_id: id,
              comment: commentText,
            }),
          ).then(res => {
            dispatch(getCommentList({ order_id: id })).then(response => {
              const commentResponse = response?.payload;
              dispatch(
                setAssignWorkedEditingData({
                  ...assignWorkedEditingData,
                  editing_comments_list: commentResponse,
                }),
              );
            });
          });
        }
      }
    },
    [
      id,
      dispatch,
      commentText,
      checkerCommentText,
      assignWorkedEditingData,
      activeTabObj?.item_status_id,
    ],
  );

  return (
    <FormikProvider>
      {(editingLoading ||
        assignedWorkItemsLoading ||
        checkerCommentItemLoading ||
        assignedWorkEventListLoading ||
        orderNoteLoading ||
        commentLoading ||
        assignedWorkEditItemLoading ||
        assignedWorkEditOrderLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="add_assign_projects_wrap bg-white radius15 border">
          <div className="add_assign_title p20 p15-xs border-bottom">
            <Row className="align-items-center gy-3">
              <Col lg={3}>
                <div className="title_right_wrapper">
                  <ul className="justify-content-start">
                    <li className="search_mobile">
                      <div className="form_group">
                        <ReactSelectSingle
                          value={values?.order_status || 1}
                          options={[
                            { label: 'Initial', value: 1 },
                            { label: 'Library Done', value: 2 },
                            { label: 'IN Progress', value: 3 },
                            { label: 'IN Checking', value: 4 },
                            { label: 'Exporting', value: 5 },
                            {
                              label: 'Completed',
                              value: 6,
                              disabled: true,
                            },
                          ]}
                          itemTemplate={statusItemTemplate}
                          name="project_work_status"
                          onChange={e => {
                            handleProjectStatusChange(e);
                          }}
                          valueTemplate={statusItemTemplate}
                          placeholder="Project Status"
                          disabled={
                            activeTabObj?.checker || activeTabObj?.is_owner
                              ? false
                              : true
                          }
                        />
                      </div>
                    </li>
                    <li>
                      <h6 className="text_gray">Order No.</h6>
                      <h4 className="m-0">{values?.inquiry_no}</h4>
                    </li>
                    <li>
                      <h6 className="text_gray">Create Date</h6>
                      <h4 className="m-0">{values?.create_date}</h4>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col lg={9}>
                <div className="title_right_wrapper">
                  <ul className="add_assign_ul">
                    <li>
                      <Link
                        to="/conversation"
                        className="btn_primary btn_right"
                      >
                        Group Chat
                        <img src={RightArrow} alt="RightArrowIcon" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/reporting" className="btn_primary btn_right">
                        Today’s Reporting
                        <img src={RightArrow} alt="RightArrowIcon" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/assigned-projects" className="btn_border_dark">
                        Exit Page
                      </Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="add_assign_inner p20 p15-xs">
            <Row className="g-4">
              <Col xs={12}>
                <div className="location_wrap">
                  <EditingItemsEventLists
                    // handleChange={handleChange}
                    // handleEventRawTime={handleEventRawTime}
                    // setFieldValue={setFieldValue}
                    fieldValue={values}
                    handleProjectStatusChange={handleProjectStatusChange}
                  />
                  {/* <TabView
                    activeIndex={activeTabIndex}
                    onTabChange={e => {
                      handleTabChange(
                        e.index,
                        e.originalEvent.target.textContent,
                      );
                    }}
                  >
                    {values?.items_list?.map(item => {
                      return (
                        <TabPanel header={item?.item_name}></TabPanel>
                        // <TabPanel header={item?.item_name}>
                        //   <Wedding />
                        // </TabPanel>
                        // <TabPanel header="Pre-wedding">
                        //   <PreWedding />
                        // </TabPanel>
                      );
                    })}
                  </TabView> */}
                </div>
              </Col>
              <Col lg={6}>
                <div className="order-details-wrapper p10 border radius15 mb20">
                  <div className="pb10 border-bottom">
                    <h6 className="m-0">Job</h6>
                  </div>
                  <div className="details_box pt10">
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Items :</span>
                        <h5>{values?.item_name}</h5>
                      </div>
                      <div className="order-date">
                        <span>Couple Name :</span>
                        <h5>{values?.couple_name}</h5>
                      </div>
                    </div>
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Data Size :</span>
                        <h5>{`${
                          values?.data_size ? values?.data_size : 0
                        } GB`}</h5>
                      </div>
                      <div className="order-date">
                        <span>Project Type :</span>
                        <h5>{values?.project_type_value}</h5>
                      </div>
                      <div className="order-date">
                        <span>Due Date :</span>
                        <h5>{values?.due_date}</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comment_box_wrap checker_height_small comment_main radius15 border mt-xl-0 mt-4">
                  <div className="comment_box_title py15 px20 border-bottom">
                    <h6 className="m-0">Checker Changes Comments</h6>
                  </div>
                  <div className="comment_box_inner p15 h-100">
                    <ul>
                      {values?.checker_comments_list?.map(comment => {
                        return (
                          <li>
                            <div
                              className={`comment_img ${
                                !comment?.user_image ? 'comment_dummy_icon' : ''
                              }`}
                            >
                              <img
                                src={
                                  comment?.user_image
                                    ? comment?.user_image
                                    : UserIcon
                                }
                                alt=""
                              />
                            </div>
                            <div className="comment_right">
                              <h5>
                                {comment?.user_name}
                                <span className="text_grey ms-1">
                                  {convertDate(comment?.created_at)}
                                </span>
                              </h5>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: comment?.comment,
                                }}
                              ></p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {activeTabObj?.checker && (
                      <>
                        <div className="form_group mb-3">
                          <Editor
                            value={checkerCommentText}
                            onTextChange={e =>
                              setCheckerCommentText(e.htmlValue)
                            }
                            style={{ height: '80px' }}
                          />
                        </div>
                        <Button
                          className="btn_primary"
                          onClick={() =>
                            checkerCommentText && handleComments(true)
                          }
                        >
                          Comment
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="comment_box_wrap comment_main_wrap radius15 border mt-xl-0 mt-4">
                  <div className="comment_box_title py15 px20 border-bottom">
                    <h6 className="m-0">Comments</h6>
                  </div>
                  <div className="comment_box_inner p15 h-100">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: values?.comment_order_note_list?.order_note,
                      }}
                    />
                    <ul>
                      {values?.editing_comments_list?.map(comment => {
                        return (
                          <li>
                            <div
                              className={`comment_img ${
                                !comment?.user_image ? 'comment_dummy_icon' : ''
                              }`}
                            >
                              <img
                                src={
                                  comment?.user_image
                                    ? comment?.user_image
                                    : UserIcon
                                }
                                alt=""
                              />
                            </div>
                            <div className="comment_right">
                              <h5>
                                {comment?.user_name}
                                <span className="text_grey ms-1">
                                  {convertDate(comment?.created_at)}
                                </span>
                              </h5>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: comment?.comment,
                                }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="form_group mb-3">
                      <Editor
                        value={commentText}
                        onTextChange={e => setCommentText(e.htmlValue)}
                        style={{ height: '80px' }}
                      />
                    </div>
                    <Button
                      className="btn_primary"
                      onClick={() => commentText && handleComments(false)}
                      // disabled={!commentText}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};
export default memo(ProjectWorkEditing);
