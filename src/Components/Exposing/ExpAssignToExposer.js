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
  getExposingStep,
  removeExposerItem,
  setExposerAssignData,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useFormik } from 'formik';
import moment from 'moment';
import { generateUniqueId } from 'Helper/CommonHelper';
import { toast } from 'react-toastify';
import UserIcon from '../../Assets/Images/add-user.svg';

const ExpAssignToExposer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowNext, setIsShowNext] = useState(false);

  const {
    employeesList,
    freelancersList,
    exposerAssignData,
    exposingLoading,
    exposingItemsLoading,
    assignedExposerLoading,
    exposingEmployeeLoading,

    exposingItemsData,
    exposingDetailsData,
    getExposingStepData,
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
            const exposingDetails = response.payload;
            return { exposingItemData, exposingDetails };
          })
          .then(({ exposingItemData, exposingDetails }) => {
            dispatch(
              exposingEmployeeList({
                freelancer: false,
              }),
            ).then(res => {
              const employeeList = res.payload;

              dispatch(
                exposingEmployeeList({
                  freelancer: true,
                }),
              ).then(res => {
                const freelancerList = res.payload;
                const assigneeOptions = [...employeeList, ...freelancerList];

                // Filtered both are options:
                const exposingItemUpdated = exposingItemData?.map(item => {
                  const filteredOptions = assigneeOptions?.filter(obj => {
                    const matchObj = item?.employeeData?.some(
                      obj2 => obj2?.employee_id === obj?._id,
                    );
                    return !matchObj && obj;
                  });

                  const freelancerOptionsList = filteredOptions?.filter(
                    obj => obj?.is_freelancer === true,
                  );
                  const employeeOptionsList = filteredOptions?.filter(
                    obj => obj?.is_freelancer !== true,
                  );

                  // Filtered selected Employees:
                  const selectedEmployees = item?.employeeData
                    ?.map(employee => {
                      if (!employee?.is_freelancer) {
                        return {
                          ...employee,
                          label: employee?.employee_name,
                          value: employee?.employee_id,
                        };
                      }
                    })
                    .filter(item => item);

                  // Filtered selected Freelancers:
                  const selectedFreelances = item?.employeeData
                    ?.map(freelancer => {
                      if (freelancer?.is_freelancer) {
                        return {
                          ...freelancer,
                          label: freelancer?.employee_name,
                          value: freelancer?.employee_id,
                        };
                      }
                    })
                    .filter(item => item);

                  return {
                    ...item,
                    unique_id: generateUniqueId(),
                    selected_employees: selectedEmployees,
                    selected_freelances: selectedFreelances,
                    selectedAssigneesList: item?.employeeData,
                    employee_options_list: employeeOptionsList,
                    freelancer_options_list: freelancerOptionsList,
                  };
                });

                const assignExposerAlldata = {
                  ...exposingDetails,
                  mobile_no: Array.isArray(exposingDetails?.mobile_no)
                    ? exposingDetails?.mobile_no?.join(', ')
                    : exposingDetails?.mobile_no,
                  assignExposerTableList: exposingItemUpdated,
                };

                dispatch(setExposerAssignData(assignExposerAlldata));
              });
            });
          })
          .catch(error => {
            console.error('Error fetching Items data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching Items data:', error);
      });
  }, [dispatch, id]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitHandle = useCallback(
    (value, { resetForm }) => {
      const checkAssigneeIsSelected = value?.assignExposerTableList?.every(
        item => {
          return (
            item?.selected_employees?.length ||
            item?.selected_freelances?.length
          );
        },
      );

      if (checkAssigneeIsSelected) {
        const assignToExposerPayload = value?.assignExposerTableList.map(
          item => {
            const getExposerIdList = item?.selected_employees
              ?.map(
                employeesList =>
                  !employeesList?.is_freelancer &&
                  (employeesList?.employee_id
                    ? employeesList?.employee_id
                    : employeesList?._id),
              )
              ?.filter(value => value);
            const getFreelancerIdList = item?.selected_freelances
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

  // const handleAddAssignee = useCallback(
  //   (rowData, employee) => {
  //     let updateAssignExposerTable = [...values?.assignExposerTableList];

  //     const updatedSelectedAssignees = [
  //       ...rowData?.selectedAssigneesList,
  //       employee,
  //     ];

  //     const index = updateAssignExposerTable?.findIndex(
  //       x => x?.unique_id === rowData?.unique_id,
  //     );

  //     if (index !== -1) {
  //       const oldObj = updateAssignExposerTable[index];

  //       const updatedObj = {
  //         ...oldObj,
  //         selectedAssigneesList: updatedSelectedAssignees,
  //       };
  //       updateAssignExposerTable[index] = updatedObj;
  //     }
  //     setFieldValue('assignExposerTableList', updateAssignExposerTable);
  //   },
  //   [values?.assignExposerTableList, setFieldValue],
  // );

  // const handleDeleteAssignee = useCallback(
  //   (rowData, deletedItem) => {
  //     let updateSelectedAssignees = [...rowData?.selectedAssigneesList];
  //     let updateAssignExposerTable = [...values?.assignExposerTableList];

  //     const filteredData = updateSelectedAssignees?.filter(
  //       x => x?._id !== deletedItem?._id,
  //     );

  //     const index = updateAssignExposerTable?.findIndex(
  //       x => x?.unique_id === rowData?.unique_id,
  //     );

  //     if (index !== -1) {
  //       const oldObj = updateAssignExposerTable[index];

  //       const updatedObj = {
  //         ...oldObj,
  //         selectedAssigneesList: filteredData,
  //       };
  //       updateAssignExposerTable[index] = updatedObj;
  //     }
  //     setFieldValue('assignExposerTableList', updateAssignExposerTable);

  //     // dispatch(removeExposerItem())
  //   },
  //   [values?.assignExposerTableList, setFieldValue],
  // );

  // const handleAssignees = (rowData, isFreelancer) => {
  //   const assigneesList = isFreelancer ? freelancersList : employeesList;
  //   return (
  //     <ul className="assign-body-wrap">
  //       {rowData?.selectedAssigneesList?.map(item => {
  //         if (item?.is_freelancer === isFreelancer) {
  //           return (
  //             <li>
  //               <div className="assign-profile-wrapper">
  //                 <div className="assign_profile">
  //                   <img src={item?.image ? item?.image : UserIcon} alt="" />
  //                 </div>
  //                 <div className="profile_user_name">
  //                   <h5 className="m-0">{item?.employee_name}</h5>
  //                 </div>
  //                 <div className="assign_profile">
  //                   <Button
  //                     className="btn_transparent"
  //                     onClick={() => {
  //                       handleDeleteAssignee(rowData, item);
  //                     }}
  //                   >
  //                     <img src={CloseImg} alt="" />
  //                   </Button>
  //                 </div>
  //               </div>
  //             </li>
  //           );
  //         }
  //       })}
  //       <li>
  //         <div className="assign_dropdown_wrapper">
  //           {/* <Dropdown
  //             className="dropdown_common position-static"
  //             options={data?.employeeList}
  //             value={data?.assignedEmployee}
  //             itemTemplate={countryOptionTemplate}
  //             onChange={e => {
  //               handleAssignEmployeeChange(e, data);
  //             }}
  //           /> */}
  //           <Dropdown className="dropdown_common position-static">
  //             <Dropdown.Toggle id="dropdown-basic" className="action_btn">
  //               <div className="assigned_exposer">
  //                 <div className="btn_doted">
  //                   <div className="add_exposer">
  //                     <img src={AddUserIcon} alt="" />
  //                   </div>
  //                   <div className="add_exposer">
  //                     <img className="add_icon" src={PlusIcon} alt="" />
  //                   </div>
  //                 </div>
  //               </div>
  //             </Dropdown.Toggle>
  //             <Dropdown.Menu>
  //               <Dropdown.Item>
  //                 {assigneesList?.length > 0
  //                   ? assigneesList?.map(employee => {
  //                       return (
  //                         <div className="assign_dropdown">
  //                           <div
  //                             className="assign_profile"
  //                             onClick={() =>
  //                               handleAddAssignee(rowData, employee)
  //                             }
  //                           >
  //                             <img
  //                               src={
  //                                 employee?.image ? employee?.image : UserIcon
  //                               }
  //                               alt=""
  //                             />
  //                             <h5 className="m-0">{employee?.employee_name}</h5>
  //                           </div>
  //                         </div>
  //                       );
  //                     })
  //                   : 'No data available'}
  //               </Dropdown.Item>
  //             </Dropdown.Menu>
  //           </Dropdown>
  //         </div>
  //       </li>
  //     </ul>
  //   );
  // };

  const handleAssignFreelancer = useCallback(
    (rowData, freelancer) => {
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      // Add the freelancer:
      const addToSelectedFreelancer = rowData?.selected_freelances?.length
        ? [...rowData?.selected_freelances, freelancer]
        : [freelancer];

      // Remove the freelancer from derop-down:
      const removeFromFreelancerOptions =
        rowData?.freelancer_options_list?.filter(
          item => item?.value !== freelancer?.value,
        );

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selected_freelances: addToSelectedFreelancer,
          freelancer_options_list: removeFromFreelancerOptions,
        };

        updateAssignExposerTable[index] = updatedObj;

        setFieldValue('assignExposerTableList', updateAssignExposerTable);

        // const checkAssigneeIsSelected = updateAssignExposerTable?.every(
        //   item => {
        //     return (
        //       item?.selected_employees?.length ||
        //       item?.selected_freelances?.length
        //     );
        //   },
        // );

        // const getExposerIdList = updatedObj?.selected_employees
        //   ?.map(
        //     employeesList =>
        //       !employeesList?.is_freelancer &&
        //       (employeesList?.employee_id
        //         ? employeesList?.employee_id
        //         : employeesList?._id),
        //   )
        //   ?.filter(value => value);

        // const getFreelancerIdList = updatedObj?.selected_freelances
        //   ?.map(
        //     freelancer =>
        //       freelancer?.is_freelancer &&
        //       (freelancer?.employee_id
        //         ? freelancer?.employee_id
        //         : freelancer?._id),
        //   )
        //   ?.filter(value => value);

        // const payload = {
        //   quotation_detail_id: updatedObj?._id,
        //   item_id: updatedObj?.item_id,
        //   employee_id: getExposerIdList,
        //   freelancer_id: getFreelancerIdList,
        // };

        // const payloadObj = {
        //   order_id: id,
        //   assigned_data: payload,
        // };

        // dispatch(assignedExposerItem(payloadObj)).then(res => {
        //   if (checkAssigneeIsSelected) {
        //     setIsShowNext(true);
        //   } else {
        //     toast.error('Assign or Freelancer Details Are Required');
        //     setIsShowNext(false);
        //   }
        // });
      }
    },
    [setFieldValue, values],
  );

  const handleDeleteFreelancer = useCallback(
    (rowData, deletedItem) => {
      let updateSelectedFreelancers = [...rowData?.selected_freelances];
      let addToFreelancerOptions = [...rowData?.freelancer_options_list];
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      // Filtered the selected freelancers
      const filteredData = updateSelectedFreelancers?.filter(
        x => x?._id !== deletedItem?._id,
      );

      const findRemoveFreelancer = freelancersList?.filter(
        item => deletedItem?.value === item?.value,
      );

      if (findRemoveFreelancer?.length) {
        // Add the freelancer to Drop-Down List
        addToFreelancerOptions = rowData?.freelancer_options_list?.length
          ? [...rowData?.freelancer_options_list, deletedItem]
          : [deletedItem];
      }

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selected_freelances: filteredData,
          freelancer_options_list: addToFreelancerOptions,
        };
        updateAssignExposerTable[index] = updatedObj;
      }
      setFieldValue('assignExposerTableList', updateAssignExposerTable);

      // It's check any one (Employee or Freelancer) to specific item
      // const checkAssigneeIsSelected = updateAssignExposerTable?.every(item => {
      //   return (
      //     item?.selected_employees?.length || item?.selected_freelances?.length
      //   );
      // });

      // dispatch(
      //   removeExposerItem({
      //     exposer_id: deletedItem?.value,
      //   }),
      // ).then(res => {
      //   if (checkAssigneeIsSelected) {
      //     setIsShowNext(true);
      //   } else {
      //     toast.error('Assign or Freelancer Details Are Required');
      //     setIsShowNext(false);
      //   }
      // });
    },
    [freelancersList, setFieldValue, values],
  );

  const FreelancerBodyTemplet = rowData => {
    // return handleAssignees(rowData, true);

    return (
      <ul className="assign-body-wrap">
        {rowData?.selected_freelances?.map(item => {
          return (
            <li>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img src={item?.image ? item?.image : UserIcon} alt="" />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">{item?.employee_name}</h5>
                </div>
                <div className="assign_profile">
                  <Button
                    className="btn_transparent"
                    onClick={() => {
                      handleDeleteFreelancer(rowData, item);
                    }}
                  >
                    <img src={CloseImg} alt="" />
                  </Button>
                </div>
              </div>
            </li>
          );
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
                  {rowData?.freelancer_options_list?.length > 0
                    ? rowData?.freelancer_options_list?.map(freelancer => {
                        return (
                          <div className="assign_dropdown">
                            <div
                              className="assign_profile"
                              onClick={() =>
                                // handleAddAssignee(rowData, freelancer)
                                handleAssignFreelancer(rowData, freelancer)
                              }
                            >
                              <img
                                src={
                                  freelancer?.image
                                    ? freelancer?.image
                                    : UserIcon
                                }
                                alt=""
                              />
                              <h5 className="m-0">
                                {freelancer?.employee_name}
                              </h5>
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

  const handleAssignEmployees = useCallback(
    (rowData, employee) => {
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      const addToSelectedEmployees = rowData?.selected_employees?.length
        ? [...rowData?.selected_employees, employee]
        : [employee];

      const removeFromEmployeeOptions = rowData?.employee_options_list?.filter(
        item => item?.value !== employee?.value,
      );

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selected_employees: addToSelectedEmployees,
          employee_options_list: removeFromEmployeeOptions,
        };

        updateAssignExposerTable[index] = updatedObj;

        setFieldValue('assignExposerTableList', updateAssignExposerTable);

        // const checkAssigneeIsSelected = updateAssignExposerTable?.every(
        //   item => {
        //     return (
        //       item?.selected_employees?.length ||
        //       item?.selected_freelances?.length
        //     );
        //   },
        // );

        // const getExposerIdList = updatedObj?.selected_employees
        //   ?.map(
        //     employeesList =>
        //       !employeesList?.is_freelancer &&
        //       (employeesList?.employee_id
        //         ? employeesList?.employee_id
        //         : employeesList?._id),
        //   )
        //   ?.filter(value => value);

        // const getFreelancerIdList = updatedObj?.selected_freelances
        //   ?.map(
        //     freelancer =>
        //       freelancer?.is_freelancer &&
        //       (freelancer?.employee_id
        //         ? freelancer?.employee_id
        //         : freelancer?._id),
        //   )
        //   ?.filter(value => value);

        // const payload = {
        //   quotation_detail_id: updatedObj?._id,
        //   item_id: updatedObj?.item_id,
        //   employee_id: getExposerIdList,
        //   freelancer_id: getFreelancerIdList,
        // };

        // const payloadObj = {
        //   order_id: id,
        //   assigned_data: payload,
        // };

        // dispatch(assignedExposerItem(payloadObj)).then(res => {
        //   if (checkAssigneeIsSelected) {
        //     setIsShowNext(true);
        //   } else {
        //     toast.error('Assign or Freelancer Details Are Required');
        //     setIsShowNext(false);
        //   }
        // });
      }
    },
    [setFieldValue, values],
  );

  const handleDeleteAssignEmployees = useCallback(
    (rowData, deletedItem) => {
      let addToEmployeeOptions = [...rowData?.employee_options_list];
      let updateSelectedFreelancers = [...rowData?.selected_employees];
      let updateAssignExposerTable = [...values?.assignExposerTableList];

      const filteredData = updateSelectedFreelancers?.filter(
        x => x?._id !== deletedItem?._id,
      );

      const findRemoveEmployee = employeesList?.filter(
        item => deletedItem?.value === item?.value,
      );

      if (findRemoveEmployee?.length) {
        addToEmployeeOptions = rowData?.employee_options_list?.length
          ? [...rowData?.employee_options_list, deletedItem]
          : [deletedItem];
      }

      const index = updateAssignExposerTable?.findIndex(
        x => x?.unique_id === rowData?.unique_id,
      );

      if (index !== -1) {
        const oldObj = updateAssignExposerTable[index];

        const updatedObj = {
          ...oldObj,
          selected_employees: filteredData,
          employee_options_list: addToEmployeeOptions,
        };

        updateAssignExposerTable[index] = updatedObj;
      }

      setFieldValue('assignExposerTableList', updateAssignExposerTable);

      // const checkAssigneeIsSelected = updateAssignExposerTable?.every(item => {
      //   return (
      //     item?.selected_employees?.length || item?.selected_freelances?.length
      //   );
      // });

      // dispatch(
      //   removeExposerItem({
      //     exposer_id: deletedItem?.value,
      //   }),
      // ).then(res => {
      //   if (checkAssigneeIsSelected) {
      //     setIsShowNext(true);
      //   } else {
      //     toast.error('Assign or Freelancer Details Are Required');
      //     setIsShowNext(false);
      //   }
      // });
    },
    [employeesList, setFieldValue, values],
  );

  const AssignBodyTemplet = rowData => {
    // return handleAssignees(rowData, false);
    return (
      <ul className="assign-body-wrap">
        {rowData?.selected_employees?.map(item => {
          return (
            <li>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img src={item?.image ? item?.image : UserIcon} alt="" />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">{item?.employee_name}</h5>
                </div>
                <div className="assign_profile">
                  <Button
                    className="btn_transparent"
                    onClick={() => handleDeleteAssignEmployees(rowData, item)}
                  >
                    <img src={CloseImg} alt="" />
                  </Button>
                </div>
              </div>
            </li>
          );
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
                  {rowData?.employee_options_list?.length > 0
                    ? rowData?.employee_options_list?.map(employee => {
                        return (
                          <div className="assign_dropdown">
                            <div
                              className="assign_profile"
                              onClick={() =>
                                // handleAddAssignee(rowData, employee)
                                handleAssignEmployees(rowData, employee)
                              }
                            >
                              <img
                                src={
                                  employee?.image ? employee?.image : UserIcon
                                }
                                alt=""
                              />
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

  const packageWithItemNameTemplate = data => {
    const packageWithItem = `${
      data?.package_name ? data?.package_name + ' -' : ''
    } ${data?.item_name ? data?.item_name : ''}`;

    return packageWithItem;
  };

  const eventDateTemplate = rowData => {
    // const updatedDate = moment(rowData?.order_date)?.format('DD-MM-YYYY');
    // return <span>{updatedDate}</span>;

    const orderStartDate = rowData?.order_start_date
      ? moment(rowData?.order_start_date).format('DD-MM-YYYY')
      : '';

    const orderEndDate = rowData?.order_end_date
      ? moment(rowData?.order_end_date).format('DD-MM-YYYY')
      : '';

    return (
      <span>
        {orderStartDate
          ? orderStartDate + (orderEndDate ? ' To ' + orderEndDate : '')
          : orderEndDate
          ? ' To ' + orderEndDate
          : ''}
      </span>
    );
  };

  return (
    <>
      {(exposingItemsLoading ||
        exposingLoading ||
        exposingEmployeeLoading ||
        assignedExposerLoading) && <Loader />}
      {/* <div className="main_Wrapper"> */}
      <div className="processing_main">
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
                        <h6>Create Date</h6>
                        <h4>
                          {moment(values?.create_date)?.format('DD-MM-YYYY')}
                        </h4>
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
                                  `${moment(values?.start_date)?.format(
                                    'DD-MM-YYYY',
                                  )} To ${moment(values?.end_date)?.format(
                                    'DD-MM-YYYY',
                                  )}`}
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
              <Column
                field="item_name"
                header="Item Name"
                sortable
                body={packageWithItemNameTemplate}
              ></Column>
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
                        dispatch(getExposingStep({ order_id: id }));
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
      {/* </div> */}
    </>
  );
};
export default memo(ExpAssignToExposer);
