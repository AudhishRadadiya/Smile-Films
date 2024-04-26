import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import AddUserIcon from '../../../Assets/Images/add-user.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChecker,
  addStep,
  editOrder,
  getEditingFlow,
  getItems,
  listEmployee,
  removeEditorItem,
  setEditingOverviewData,
  setEditingSelectedProgressIndex,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useFormik } from 'formik';
import CommentDataCollection from './CommentDataCollection';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { Dropdown } from 'primereact/dropdown';
import Close from '../../../Assets/Images/close.svg';
import UserIcon from '../../../Assets/Images/add-user.svg';

export default function EditingOverview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [createGroupModel, setCreateGroupModel] = useState(false);
  const [isShowNext, setIsShowNext] = useState(false);
  const {
    editingLoading,
    editingOverviewData,
    assignEmployeeList,
    commentLoading,
    orderLoading,
    assignedEditorLoading,
    checkerLoading,
    employeeLoading,
    getStepData,
    itemsLoading,
  } = useSelector(({ editing }) => editing);

  useEffect(() => {
    dispatch(getItems({ order_id: id }))
      .then(response => {
        const ItemData = response.payload;

        return { ItemData };
      })
      .then(({ ItemData }) => {
        dispatch(getEditingFlow({ order_id: id }))
          .then(response => {
            const responseData = response.payload;

            return { ItemData, responseData };
          })
          .then(({ ItemData, responseData }) => {
            dispatch(listEmployee())
              .then(response => {
                const responseList = response.payload;
                let updatedList = ItemData?.map(data => {
                  let filteredEmployeeList = responseList?.filter(employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  });
                  let filteredIds = data?.employeeData?.map(
                    item => item.employee_id,
                  );

                  let AssignedEmployeeList = responseList?.filter(employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  });
                  let updatedCheckerList = data?.checkerData?.map(d => {
                    return {
                      ...d,
                      label: d?.employee_name,
                      value: d?.employee_id,
                    };
                  });

                  return {
                    ...data,
                    due_date: data?.due_date
                      ? moment(data?.due_date)?.format('DD-MM-YYYY')
                      : '',
                    employeeList:
                      data?.employeeData?.length > 0
                        ? AssignedEmployeeList
                        : responseList,
                    assignedEmployee:
                      data?.employeeData?.length > 0 ? filteredIds : [],
                    checkerList: updatedCheckerList,
                    checker: data?.checker,
                  };
                });
                const updated = {
                  ...responseData,
                  editingTable: updatedList,
                };
                const isAssignEmployee = responseData?.orderItems?.every(
                  item => {
                    return item?.employeeData?.length > 0;
                  },
                );

                const isChecker = responseData?.orderItems?.every(item => {
                  return item?.checker;
                });

                const isCompletedProject = responseData?.order_status >= 5;
                if (isAssignEmployee && isChecker && isCompletedProject) {
                  setIsShowNext(true);
                } else {
                  setIsShowNext(false);
                }

                dispatch(setEditingOverviewData(updated));
              })

              .catch(error => {
                console.error('Error fetching employee data:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching Editing flow data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching Items data:', error);
      });
    // if (isAssignedEditor) {
    //   dispatch(setIsAssignedEditor(false));
    // }
  }, [dispatch, id]);
  const handleCheckerChange = (e, data) => {
    const newEmployee = e.value;
    let payload = {
      order_id: id,
      item_id: data?.item_id,
      employee_id: newEmployee,
      is_checker: true,
      quotation_detail_id: data?._id,
    };
    dispatch(addChecker(payload))
      .then(response => {
        dispatch(getItems({ order_id: id }))
          .then(response => {
            const ItemData = response.payload;

            return { ItemData };
          })
          .then(({ ItemData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(responseData => {
              const response = responseData.payload;
              let updatedList = ItemData?.map(data => {
                let filteredEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  },
                );
                let filteredIds = data?.employeeData?.map(
                  item => item.employee_id,
                );

                let AssignedEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  },
                );
                let updatedCheckerList = data?.checkerData?.map(d => {
                  return {
                    ...d,
                    label: d?.employee_name,
                    value: d?.employee_id,
                  };
                });

                return {
                  ...data,
                  due_date: data?.due_date
                    ? moment(data?.due_date)?.format('DD-MM-YYYY')
                    : '',
                  employeeList:
                    data?.employeeData?.length > 0
                      ? AssignedEmployeeList
                      : assignEmployeeList,
                  assignedEmployee:
                    data?.employeeData?.length > 0 ? filteredIds : [],
                  checkerList: updatedCheckerList,
                  checker: data?.checker,
                };
              });
              const updated = {
                ...response,
                editingTable: updatedList,
              };
              const isAssignEmployee = response?.orderItems?.every(item => {
                return item?.employeeData?.length > 0;
              });

              const isChecker = response?.orderItems?.every(item => {
                return item?.checker;
              });

              const isCompletedProject = response?.order_status >= 5;

              if (isAssignEmployee && isChecker && isCompletedProject) {
                setIsShowNext(true);
              } else {
                setIsShowNext(false);
              }

              dispatch(setEditingOverviewData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching editing data:', error);
          })
          .catch(error => {
            console.error('Error fetching item data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching add editor data:', error);
      });
  };

  const handleAssignEmployeeChange = (e, data) => {
    const newEmployee = e.value;
    let payload = {
      order_id: id,
      item_id: data?.item_id,
      employee_id: newEmployee,
      is_checker: false,
      old_employee_id: '',
      quotation_detail_id: data?._id,
    };
    dispatch(addChecker(payload))
      .then(response => {
        dispatch(getItems({ order_id: id }))
          .then(response => {
            const ItemData = response.payload;

            return { ItemData };
          })
          .then(({ ItemData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(responseData => {
              const response = responseData.payload;
              let updatedList = ItemData?.map(data => {
                let filteredEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  },
                );
                let filteredIds = data?.employeeData?.map(
                  item => item.employee_id,
                );

                let AssignedEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  },
                );
                let updatedCheckerList = data?.checkerData?.map(d => {
                  return {
                    ...d,
                    label: d?.employee_name,
                    value: d?.employee_id,
                  };
                });

                return {
                  ...data,
                  due_date: data?.due_date
                    ? moment(data?.due_date)?.format('DD-MM-YYYY')
                    : '',
                  employeeList:
                    data?.employeeData?.length > 0
                      ? AssignedEmployeeList
                      : assignEmployeeList,
                  assignedEmployee:
                    data?.employeeData?.length > 0 ? filteredIds : [],
                  checkerList: updatedCheckerList,
                  checker: data?.checker,
                };
              });
              const updated = {
                ...response,
                editingTable: updatedList,
              };
              const isAssignEmployee = response?.orderItems?.every(item => {
                return item?.employeeData?.length > 0;
              });

              const isChecker = response?.orderItems?.every(item => {
                return item?.checker;
              });
              const isCompletedProject = response?.order_status >= 5;

              if (isAssignEmployee && isChecker && isCompletedProject) {
                setIsShowNext(true);
              } else {
                setIsShowNext(false);
              }

              dispatch(setEditingOverviewData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching editing data:', error);
          })
          .catch(error => {
            console.error('Error fetching item data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching add editor data:', error);
      });
  };

  const handleRemoveCheckerChange = data => {
    let payload = {
      editor_id: data?._id,
    };
    dispatch(removeEditorItem(payload))
      .then(response => {
        dispatch(getItems({ order_id: id }))
          .then(response => {
            const ItemData = response.payload;

            return { ItemData };
          })
          .then(({ ItemData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(responseData => {
              const response = responseData.payload;
              let updatedList = ItemData?.map(data => {
                let filteredEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  },
                );
                let filteredIds = data?.employeeData.map(
                  item => item.employee_id,
                );

                let AssignedEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  },
                );
                let updatedCheckerList = data?.checkerData?.map(d => {
                  return {
                    ...d,
                    label: d?.employee_name,
                    value: d?.employee_id,
                  };
                });

                return {
                  ...data,
                  due_date: data?.due_date
                    ? moment(data?.due_date)?.format('DD-MM-YYYY')
                    : '',
                  employeeList:
                    data?.employeeData?.length > 0
                      ? AssignedEmployeeList
                      : assignEmployeeList,
                  assignedEmployee:
                    data?.employeeData?.length > 0 ? filteredIds : [],
                  checkerList: updatedCheckerList,
                  checker: data?.checker,
                };
              });
              const updated = {
                ...response,
                editingTable: updatedList,
              };
              const isAssignEmployee = response?.orderItems?.every(item => {
                return item?.employeeData?.length > 0;
              });

              const isChecker = response?.orderItems?.every(item => {
                return item?.checker;
              });

              const isCompletedProject = response?.order_status >= 5;

              if (isAssignEmployee && isChecker && isCompletedProject) {
                setIsShowNext(true);
              } else {
                setIsShowNext(false);
              }

              dispatch(setEditingOverviewData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching editing data:', error);
          })

          .catch(error => {
            console.error('Error fetching item data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching remove checker data:', error);
      });
  };

  const handleDeleteEmployee = data => {
    let payload = {
      editor_id: data?._id,
    };
    dispatch(removeEditorItem(payload))
      .then(response => {
        dispatch(getItems({ order_id: id }))
          .then(response => {
            const ItemData = response.payload;

            return { ItemData };
          })
          .then(({ ItemData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(responseData => {
              const response = responseData.payload;
              let updatedList = ItemData?.map(data => {
                let filteredEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  },
                );
                let filteredIds = data?.employeeData.map(
                  item => item.employee_id,
                );

                let AssignedEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  },
                );
                let updatedCheckerList = data?.checkerData?.map(d => {
                  return {
                    ...d,
                    label: d?.employee_name,
                    value: d?.employee_id,
                  };
                });

                return {
                  ...data,
                  due_date: data?.due_date
                    ? moment(data?.due_date)?.format('DD-MM-YYYY')
                    : '',
                  employeeList:
                    data?.employeeData?.length > 0
                      ? AssignedEmployeeList
                      : assignEmployeeList,
                  assignedEmployee:
                    data?.employeeData?.length > 0 ? filteredIds : [],
                  checkerList: updatedCheckerList,
                  checker: data?.checker,
                };
              });
              const updated = {
                ...response,
                editingTable: updatedList,
              };
              const isAssignEmployee = response?.orderItems?.every(item => {
                return item?.employeeData?.length > 0;
              });

              const isChecker = response?.orderItems?.every(item => {
                return item?.checker;
              });
              const isCompletedProject = response?.order_status >= 5;

              if (isAssignEmployee && isChecker && isCompletedProject) {
                setIsShowNext(true);
              } else {
                setIsShowNext(false);
              }

              dispatch(setEditingOverviewData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching editing data:', error);
          })

          .catch(error => {
            console.error('Error fetching item data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching remove editor data:', error);
      });
  };

  const checkerOptionTemplate = option => {
    return (
      <div className="edit_assign_dropdown">
        <img
          alt={option.employee_name}
          src={option?.image ? option?.image : UserIcon}
          onError={handleDefaultUser}
          style={{ width: '18px' }}
        />
        <div>{option.employee_name}</div>
      </div>
    );
  };
  const checkerBodyTemplet = data => {
    return (
      <ul className="assign-body-wrap edit-assign-body-wrap">
        {/* <li>
          <Button
            className="btn_transparent"
            onClick={() => setCreateGroupModel(true)}
          >
            <img src={EditIcon} alt="EditIcon" />
          </Button>
        </li>
        <li>
          <div className="assign-profile-wrapper">
            <div className="assign_profile">
              <img src={ProfileImg} alt="profileimg" />
            </div>
            <div className="profile_user_name">
              <h5 className="m-0">Keval</h5>
            </div>
          </div>
        </li> */}
        {data?.checker && Object.keys(data?.checker)?.length ? (
          <>
            <li>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img
                    src={data?.image ? data?.image : UserIcon}
                    alt="profileimg"
                    onError={handleDefaultUser}
                  />
                </div>
                <div className="profile_user_name">
                  <h5 className="m-0">{data?.checker?.employee_name}</h5>
                </div>
                <Button
                  className="btn_transparent"
                  onClick={() => {
                    handleRemoveCheckerChange(data?.checker);
                  }}
                >
                  <img src={Close} alt="CloseIcon" />
                </Button>
              </div>
            </li>
          </>
        ) : (
          <li>
            <div className="assign_dropdown_wrapper ">
              <Dropdown
                className="dropdown_common position-static"
                options={data?.checkerList}
                itemTemplate={checkerOptionTemplate}
                // value={data?.assignedEmployee}
                onChange={e => {
                  handleCheckerChange(e, data);
                }}
              />
            </div>
          </li>
        )}
      </ul>
    );
  };

  const employeeOptionTemplate = option => {
    return (
      <div className="edit_assign_dropdown">
        <img
          alt={option.employee_name}
          src={option?.image ? option?.image : UserIcon}
          onError={handleDefaultUser}
          // className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          // style={{ width: '18px' }}
        />
        <div>{option.employee_name}</div>
      </div>
    );
  };

  const assignedEmployeeBodyTemplet = data => {
    return (
      <ul className="assign-body-wrap edit-assign-body-wrap">
        {data?.employeeData &&
          data?.employeeData?.length > 0 &&
          data?.employeeData?.map((item, index) => {
            return (
              <li key={index}>
                <div className="assign-profile-wrapper">
                  <div className="assign_profile">
                    <img
                      src={item?.image ? item?.image : UserIcon}
                      alt="profileimg"
                      onError={handleDefaultUser}
                    />
                  </div>
                  <div className="profile_user_name">
                    <h5 className="m-0">{item?.employee_name}</h5>
                  </div>
                  <Button
                    className="btn_transparent"
                    onClick={() => {
                      handleDeleteEmployee(item);
                    }}
                  >
                    <img src={Close} alt="CloseIcon" />
                  </Button>
                </div>
              </li>
            );
          })}
        <li>
          <div className="assign_dropdown_wrapper">
            <Dropdown
              className="dropdown_common position-static"
              options={data?.employeeList}
              value={data?.assignedEmployee}
              itemTemplate={employeeOptionTemplate}
              onChange={e => {
                handleAssignEmployeeChange(e, data);
              }}
            />
          </div>
        </li>
      </ul>
    );
  };

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const footerContent = (
    <div className="footer_wrap text-end">
      <Button
        className="btn_primary"
        onClick={() => setCreateGroupModel(false)}
      >
        Save
      </Button>
    </div>
  );

  const statusItemTemplate = option => {
    return (
      <Tag value={option?.label} severity={getSeverityStatus(option?.label)} />
    );
  };

  const getSeverityValue = item => {
    switch (item) {
      case 1:
        return 'Intial';
      case 2:
        return 'Library Done';
      case 3:
        return 'In Progress';
      case 4:
        return 'In Checking';
      case 5:
        return 'Completed';
      case 6:
        return 'Exporting';
      default:
        return null;
    }
  };

  const statusBodyTemplate = product => {
    return (
      <Tag
        value={getSeverityValue(product?.status)}
        severity={getSeverity(product)}
      ></Tag>
    );
  };

  const getSeverity = product => {
    switch (product.status) {
      case 1:
        return 'info';
      case 2:
        return 'orange';
      case 3:
        return 'warning';
      case 4:
        return 'danger';
      case 5:
        return 'success';
      case 6:
        return 'primary';

      default:
        return null;
    }
  };

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

  const ProjectStatus = [
    { label: 'Initial', value: 1 },
    { label: 'Library Done', value: 2 },
    { label: 'IN Progress', value: 3 },
    { label: 'IN Checking', value: 4 },
    { label: 'Completed', value: 5 },
    { label: 'Exporting', value: 6 },
  ];

  const handleProjectStatusChange = e => {
    setFieldValue('order_status', e.value);
    let payload = {
      order_id: id,
      project_status: e.value,
    };
    dispatch(editOrder(payload))
      .then(response => {
        dispatch(getItems({ order_id: id }))
          .then(response => {
            const ItemData = response.payload;

            return { ItemData };
          })
          .then(({ ItemData }) => {
            dispatch(getEditingFlow({ order_id: id })).then(responseData => {
              const response = responseData.payload;
              let updatedList = ItemData?.map(data => {
                let filteredEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return data?.employeeData?.some(
                      item => item.employee_id === employee._id,
                    );
                  },
                );
                let filteredIds = data?.employeeData.map(
                  item => item.employee_id,
                );

                let AssignedEmployeeList = assignEmployeeList?.filter(
                  employee => {
                    return !filteredEmployeeList?.some(
                      item => item._id === employee._id,
                    );
                  },
                );
                let updatedCheckerList = data?.checkerData?.map(d => {
                  return {
                    ...d,
                    label: d?.employee_name,
                    value: d?.employee_id,
                  };
                });

                return {
                  ...data,
                  due_date: data?.due_date
                    ? moment(data?.due_date)?.format('DD-MM-YYYY')
                    : '',
                  employeeList:
                    data?.employeeData?.length > 0
                      ? AssignedEmployeeList
                      : assignEmployeeList,
                  assignedEmployee:
                    data?.employeeData?.length > 0 ? filteredIds : [],

                  checkerList: updatedCheckerList,
                  checker: data?.checker,
                };
              });
              const updated = {
                ...response,
                editingTable: updatedList,
              };
              const isAssignEmployee = response?.orderItems?.every(item => {
                return item?.employeeData?.length > 0;
              });

              const isChecker = response?.orderItems?.every(item => {
                return item?.checker;
              });
              const isCompletedProject = response?.order_status >= 5;

              if (isAssignEmployee && isChecker && isCompletedProject) {
                setIsShowNext(true);
              } else {
                setIsShowNext(false);
              }
              dispatch(setEditingOverviewData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching editing data:', error);
          })

          .catch(error => {
            console.error('Error fetching item data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching order status:', error);
      });
  };

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: editingOverviewData,
  });

  return (
    <div className="">
      {(commentLoading ||
        editingLoading ||
        orderLoading ||
        assignedEditorLoading ||
        checkerLoading ||
        employeeLoading ||
        itemsLoading) && <Loader />}
      <div className="billing_details">
        <div className="mb25">
          <Row className="g-3 g-sm-4">
            <Col xxl={8} xl={7}>
              <div className="process_order_wrap p-0 pb-3">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setEditingSelectedProgressIndex(4));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Overview</h2>
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
                          <h4>{values?.create_date}</h4>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job_company my20">
                <Row className="g-3 g-sm-4">
                  <Col md={6}>
                    <div className="order-details-wrapper p10 border radius15 h-100">
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
                            <h5>{values?.data_size} GB</h5>
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
                  </Col>
                  <Col md={6}>
                    <div className="order-details-wrapper p10 border radius15 h-100">
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
              <div className="table_main_Wrapper h-auto">
                <div className="top_filter_wrap">
                  <div className="d-flex align-items-center justify-content-end">
                    <h5 className="m-0 me-2">Project Status</h5>
                    <div className="form_group">
                      <ReactSelectSingle
                        value={values?.order_status}
                        options={ProjectStatus}
                        itemTemplate={statusItemTemplate}
                        onChange={e => {
                          handleProjectStatusChange(e);
                        }}
                        valueTemplate={statusItemTemplate}
                        placeholder="Project Status"
                        className="w-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="data_table_wrapper max_height">
                  <DataTable
                    value={values?.editingTable}
                    sortField="item_name"
                    sortOrder={1}
                    rows={10}
                  >
                    <Column
                      field="item_name"
                      header="Item Name"
                      sortable
                    ></Column>
                    <Column
                      field="checker"
                      header="Checker"
                      sortable
                      body={checkerBodyTemplet}
                    ></Column>
                    <Column
                      field="assigned_editors"
                      header="Assigned Employee"
                      sortable
                      body={assignedEmployeeBodyTemplet}
                    ></Column>
                    <Column
                      field="due_date"
                      header="Due Date"
                      sortable
                    ></Column>
                    <Column
                      field="status"
                      header="Status"
                      sortable
                      body={statusBodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </Col>

            <CommentDataCollection />
          </Row>
        </div>
        <div className="btn_group text-end mt20">
          <Button
            onClick={() => {
              navigate('/editing');
            }}
            className="btn_border_dark"
          >
            Exit Page
          </Button>

          <Button
            onClick={() => {
              if (getStepData?.step < 5) {
                let payload = {
                  order_id: id,
                  step: 5,
                };
                dispatch(addStep(payload))
                  .then(response => {
                    dispatch(setEditingSelectedProgressIndex(6));
                  })
                  .catch(errors => {
                    console.error('Add Status:', errors);
                  });
              } else {
                dispatch(setEditingSelectedProgressIndex(6));
              }
            }}
            className="btn_primary ms-2"
            disabled={!isShowNext}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog
        header="Edit Checker"
        visible={createGroupModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setCreateGroupModel(false)}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <div className="form_group mb-3">
            <h5 className="mb20">Checker</h5>
            <Button className="btn_doted">
              <div className="add_exposer">
                <img src={AddUserIcon} alt="" />
              </div>
              <h5>Freelancer</h5>
              <div className="add_exposer">
                <img className="add_icon" src={PlusIcon} alt="" />
              </div>
            </Button>
          </div>
        </div>
      </Dialog>

      {/* conformation popup */}
    </div>
  );
}
