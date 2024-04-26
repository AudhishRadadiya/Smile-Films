import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate, useParams } from 'react-router-dom';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import AddUserIcon from '../../Assets/Images/add-user.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import CloseImg from '../../Assets/Images/close.svg';
import Loader from 'Components/Common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExposingStep,
  assignedExposerItem,
  exposingEmployeeList,
  getExposingDetails,
  getExposingItems,
  removeExposerItem,
  setExposerAssignData,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import { generateUniqueId } from 'Helper/CommonHelper';
import { toast } from 'react-toastify';

export const QuotationData = [
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
];

const PopupCompany = [
  { label: 'ABC Company', value: 'abc company' },
  { label: 'BCD Company', value: 'bcd company' },
  { label: 'EFG Company', value: 'efg company' },
];
const PaymentType = [
  { label: 'Case', value: 'case' },
  { label: 'Bank', value: 'bank' },
  { label: 'Cheque', value: 'cheque' },
];

const ExpAssignToExposer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [confornation, setConfornation] = useState(false);
  // const [popupCompanySelect, setPopupCompanySelect] = useState([]);
  // const [paymentTypeSelect, setPaymentTypeSelect] = useState([]);
  const [isShowNext, setIsShowNext] = useState(false);

  const {
    exposingItemsLoading,
    exposingEmployeeLoading,
    assignedExposerLoading,
    exposingLoading,
    freelancersList,
    employeesList,
    exposerAssignData,

    getExposingStepData,
    exposingDetailsData,
    exposingItemsData,
    assignExposingEmployeeList,
  } = useSelector(({ exposing }) => exposing);

  const fetchAllData = useCallback(() => {
    dispatch(getExposingItems({ order_id: id }))
      .then(response => {
        const exposingItemData = response.payload;
        return { exposingItemData };
      })
      .then(({ exposingItemData }) => {
        dispatch(getExposingDetails({ order_id: id }))
          .then(response => {
            const responseData = response.payload;

            const exposingItemUpdated = exposingItemData?.map(item => {
              return {
                ...item,
                unique_id: generateUniqueId(),
                selectedAssigneesList: item?.employeeData,
              };
            });

            const assignExposerAlldata = {
              ...responseData,
              assignExposerTableList: exposingItemUpdated,
            };

            dispatch(setExposerAssignData(assignExposerAlldata));
            return { exposingItemData, responseData, assignExposerAlldata };
          })
          .catch(error => {
            console.error('Error fetching Items data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching Items data:', error);
      });
    dispatch(
      exposingEmployeeList({
        freelancer: false,
      }),
    );
    dispatch(
      exposingEmployeeList({
        freelancer: true,
      }),
    );
  }, [dispatch, id]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitHandle = useCallback(
    (value, { resetForm }) => {
      const checkAssigneeIsSelected = value?.assignExposerTableList?.every(
        item => {
          return item?.selectedAssigneesList?.length;
        },
      );

      if (checkAssigneeIsSelected) {
        const assignToExposerPayload = value?.assignExposerTableList.map(
          item => {
            const getExposerIdList = item?.selectedAssigneesList
              ?.map(
                employeesList =>
                  !employeesList?.is_freelancer &&
                  (employeesList?.employee_id
                    ? employeesList?.employee_id
                    : employeesList?._id),
              )
              ?.filter(value => value);
            const getFreelancerIdList = item?.selectedAssigneesList
              ?.map(
                freelancer =>
                  freelancer?.is_freelancer &&
                  (freelancer?.employee_id
                    ? freelancer?.employee_id
                    : freelancer?._id),
              )
              ?.filter(value => value);
            return {
              quotation_detail_id: item?._id,
              item_id: item?.item_id,
              employee_id: getExposerIdList,
              freelancer_id: getFreelancerIdList,
            };
          },
        );

        const payloadObj = {
          order_id: id,
          assigned_data: assignToExposerPayload,
        };

        dispatch(assignedExposerItem(payloadObj));
        setIsShowNext(true);
      } else {
        toast.error('Assign or Freelancer Details Are Required');
        setIsShowNext(false);
      }
    },
    [dispatch, id],
  );

  const { values, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: exposerAssignData,
    onSubmit: submitHandle,
  });

  const handleAddAssignee = useCallback(
    (rowData, employee) => {
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      const updatedSelectedAssignees = [
        ...rowData?.selectedAssigneesList,
        employee,
      ];

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selectedAssigneesList: updatedSelectedAssignees,
        };
        updateAssignExposerTable[index] = updatedObj;
      }
      setFieldValue('assignExposerTableList', updateAssignExposerTable);
    },
    [values?.assignExposerTableList, setFieldValue],
  );

  const handleDeleteAssignee = useCallback(
    (rowData, deletedItem) => {
      let updateSelectedAssignees = [...rowData?.selectedAssigneesList];
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      const filteredData = updateSelectedAssignees?.filter(
        x => x?._id !== deletedItem?._id,
      );

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selectedAssigneesList: filteredData,
        };
        updateAssignExposerTable[index] = updatedObj;
      }
      setFieldValue('assignExposerTableList', updateAssignExposerTable);

      // dispatch(removeExposerItem())
    },
    [values?.assignExposerTableList, setFieldValue],
  );

  const handleAssignees = (rowData, isFreelancer) => {
    const assigneesList = isFreelancer ? freelancersList : employeesList;
    return (
      <ul className="assign-body-wrap">
        {rowData?.selectedAssigneesList?.map(item => {
          if (item?.is_freelancer === isFreelancer) {
            return (
              <li>
                <div className="assign-profile-wrapper">
                  <div className="assign_profile">
                    <img src={item?.image} alt="" />
                  </div>
                  <div className="profile_user_name">
                    <h5 className="m-0">{item?.employee_name}</h5>
                  </div>
                  <div className="assign_profile">
                    <Button
                      className="btn_transparent"
                      onClick={() => {
                        handleDeleteAssignee(rowData, item);
                      }}
                    >
                      <img src={CloseImg} alt="" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          }
        })}
        <li>
          <div className="assign_dropdown_wrapper">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                <div className="assigned_exposer">
                  <div className="btn_doted">
                    <div className="add_exposer">
                      <img src={AddUserIcon} alt="" />
                    </div>
                    <div className="add_exposer">
                      <img className="add_icon" src={PlusIcon} alt="" />
                    </div>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  {assigneesList?.length > 0
                    ? assigneesList?.map(employee => {
                        return (
                          <div className="assign_dropdown">
                            <div
                              className="assign_profile"
                              onClick={() =>
                                handleAddAssignee(rowData, employee)
                              }
                            >
                              <img src={employee?.image} alt="" />
                              <h5 className="m-0">{employee?.employee_name}</h5>
                            </div>
                          </div>
                        );
                      })
                    : 'No data available'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </li>
      </ul>
    );
  };

  const FreelancerBodyTemplet = rowData => {
    // return (
    //   <div className="assigned_exposer">
    //     <Button className="btn_doted" onClick={() => setConfornation(true)}>
    //       <div className="add_exposer">
    //         <img src={AddUserIcon} alt="" />
    //       </div>
    //       <h5>Freelancer</h5>
    //       <div className="add_exposer">
    //         <img className="add_icon" src={PlusIcon} alt="" />
    //       </div>
    //     </Button>
    //   </div>
    // );

    return handleAssignees(rowData, true);
  };

  const AssignBodyTemplet = rowData => {
    return handleAssignees(rowData, false);
  };

  const eventDateTemplate = rowData => {
    const updatedDate = moment(rowData?.order_date)?.format('YYYY-MM-DD');
    return <span>{updatedDate}</span>;
  };

  return (
    <>
      {(exposingItemsLoading ||
        exposingLoading ||
        exposingEmployeeLoading ||
        assignedExposerLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="processing_main bg-white radius15 border">
          {/* <div className="billing_heading">
            <div className="processing_bar_wrapper">
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Order Form</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Quotation</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0 complete">Quotes Approve</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap current">
                <h4 className="m-0 active">Assign to Exposer</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap next">
                <h4 className="m-0">Overview</h4>
                <span className="line"></span>
              </div>
              <div className="verifide_wrap">
                <h4 className="m-0">Completed</h4>
                <span className="line"></span>
              </div>
            </div>
          </div> */}
          <div className="billing_details">
            <div className="mb25">
              <div className="process_order_wrap p-0 pb-3">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="d-flex align-items-center">
                        {/* <Link to="/quotes-approve">
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Link> */}
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setExposingSelectedProgressIndex(3));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Assign to Exposer</h2>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="date_number">
                      <ul className="justify-content-end">
                        <li>
                          <h6>Order No.</h6>
                          <h4>{values?.inquiry_no}</h4>
                        </li>
                        <li>
                          <h6>Creat Date</h6>
                          <h4>{values?.create_date}</h4>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col lg={8}>
                  <div className="job_company mt-3">
                    <Row className="g-3 g-sm-4">
                      <Col md={6}>
                        <div className="order-details-wrapper p10 border radius15">
                          <div className="pb10 border-bottom">
                            <h6 className="m-0">Job</h6>
                          </div>
                          <div className="details_box pt10">
                            <div className="details_box_inner">
                              <div className="order-date">
                                <span>Dates :</span>
                                <h5>
                                  {values?.start_date &&
                                    values?.end_date &&
                                    `${values?.start_date} To ${values?.end_date}`}
                                </h5>
                              </div>
                              <div className="order-date">
                                <span>Venue :</span>
                                <h5>{values?.venue}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="order-details-wrapper p10 border radius15">
                          <div className="pb10 border-bottom">
                            <h6 className="m-0">Company</h6>
                          </div>
                          <div className="details_box pt10">
                            <div className="details_box_inner">
                              <div className="order-date">
                                <span>Company Name :</span>
                                <h5>{values?.company_name}</h5>
                              </div>
                              <div className="order-date">
                                <span>Client Name :</span>
                                <h5>{values?.client_full_name}</h5>
                              </div>
                            </div>
                            <div className="details_box_inner">
                              <div className="order-date">
                                <span>Phone No :</span>
                                <h5>{values?.mobile_no}</h5>
                              </div>
                              <div className="order-date">
                                <span>Email :</span>
                                <h5>{values?.email_id}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper max_height Exposing_table border radius15">
              <DataTable
                value={values?.assignExposerTableList}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="item_name" header="Item Name" sortable></Column>
                <Column field="quantity" header="Quantity" sortable></Column>
                <Column
                  field="event_date"
                  header="Event Date"
                  sortable
                  body={eventDateTemplate}
                ></Column>
                <Column
                  field="assigned_exposer"
                  header="Assigned Exposer"
                  sortable
                  body={AssignBodyTemplet}
                ></Column>
                <Column
                  field="assigned_freelancer_exposer"
                  header="Assigned Freelancer Exposer"
                  sortable
                  body={FreelancerBodyTemplet}
                ></Column>
              </DataTable>
            </div>
            {/* <div class="delete_btn_wrap mt-4 p-0 text-end">
              <Link to="/exposing" class="btn_border_dark">
                Exit Page
              </Link>
              <Link to="/overview" class="btn_primary">
                Save
              </Link>
            </div> */}

            <div class="delete_btn_wrap mt-4 p-0 text-end">
              <Button
                onClick={() => {
                  navigate('/exposing');
                }}
                className="btn_border_dark"
              >
                Exit Page
              </Button>
              {!isShowNext && (
                <Button
                  className="btn_primary ms-2"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              )}
              {isShowNext && (
                <Button
                  onClick={() => {
                    if (getExposingStepData?.step < 4) {
                      let payload = {
                        order_id: id,
                        step: 4,
                      };
                      dispatch(addExposingStep(payload))
                        .then(response => {
                          dispatch(setExposingSelectedProgressIndex(5));
                        })
                        .catch(errors => {
                          console.error('Add Status:', errors);
                        });
                    } else {
                      dispatch(setExposingSelectedProgressIndex(5));
                    }
                  }}
                  className="btn_primary ms-2"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* freelancer popup */}
        {/* <Dialog
          className="modal_Wrapper overview_dialog"
          visible={confornation}
          onHide={() => setConfornation(false)}
          draggable={false}
          header="Assigned Freelancer Exposer"
        >
          <div className="delete_popup_wrapper">
            <div className="delete_popup_wrapper">
              <Row>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>First Name</label>
                    <ReactSelectSingle
                      filter
                      value={popupCompanySelect}
                      options={PopupCompany}
                      onChange={e => {
                        statePopupCompanyChange(e);
                      }}
                      placeholder="Select Company"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Email Address</label>
                    <input
                      placeholder="Write email address"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Phone Number</label>
                    <input
                      placeholder="Write number"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
                <Col sm={12}>
                  <div class="form_group mb-3">
                    <label>Address</label>
                    <input
                      placeholder="Write address"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Payment Type</label>
                    <ReactSelectSingle
                      filter
                      value={paymentTypeSelect}
                      options={PaymentType}
                      onChange={e => {
                        statePaymentTypeChange(e);
                      }}
                      placeholder="Select Company"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Amount</label>
                    <input
                      placeholder="Write Amount"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="payable_wrap">
                    <h5>
                      Net Payable : <span>00.00</span>
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="delete_btn_wrap">
              <button className="btn_border_dark">Cancel</button>
              <button className="btn_primary">Add</button>
            </div>
          </div>
        </Dialog> */}
      </div>
    </>
  );
};
export default memo(ExpAssignToExposer);
