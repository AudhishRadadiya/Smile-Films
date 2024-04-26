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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChecker,
  addRework,
  addStep,
  editOrder,
  getEditingFlow,
  getItems,
  listEmployee,
  removeEditorItem,
  setEditingReworkData,
  setEditingSelectedProgressIndex,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useFormik } from 'formik';
import CommentDataCollection from './CommentDataCollection';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { Dropdown } from 'primereact/dropdown';
import Close from '../../../Assets/Images/close.svg';
import { Checkbox } from 'primereact/checkbox';
import UserIcon from '../../../Assets/Images/add-user.svg';
import { toast } from 'react-toastify';

export default function EditingRework() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [createGroupModel, setCreateGroupModel] = useState(false);
  const {
    editingLoading,
    editingReworkData,
    assignEmployeeList,
    commentLoading,
    orderLoading,
    assignedEditorLoading,
    checkerLoading,
    employeeLoading,
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
            dispatch(listEmployee()).then(response => {
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
                  rework: data?.is_rework ? data?.is_rework : false,
                };
              });
              const updated = {
                ...responseData,
                editingTable: updatedList,
              };
              dispatch(setEditingReworkData(updated));
            });
          })

          .catch(error => {
            console.error('Error fetching employee data:', error);
          })

          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
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
              dispatch(setEditingReworkData(updated));
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
              dispatch(setEditingReworkData(updated));
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
              dispatch(setEditingReworkData(updated));
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
              dispatch(setEditingReworkData(updated));
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

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

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
        {data?.checker && Object.keys(data?.checker)?.length ? (
          <>
            <li>
              <div className="assign-profile-wrapper">
                <div className="assign_profile">
                  <img
                    src={data?.checker?.image ? data?.checker?.image : UserIcon}
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

  const handleReworkChange = (data, fieldName, fieldValue) => {
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(x => x?.item_id === data?.item_id);
    const oldObj = editingList[index];

    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) editingList[index] = updatedObj;
    setFieldValue('editingTable', editingList);
  };

  const reworkBodyTemplate = data => {
    return (
      <Checkbox
        name="rework"
        onChange={e =>
          handleReworkChange(data, e.target.name, e.target.checked)
        }
        checked={data?.rework}
      ></Checkbox>
    );
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
              dispatch(setEditingReworkData(updated));
            });
          })
          .catch(error => {
            console.error('Error fetching Editing flow data:', error);
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  };

  const submitHandle = useCallback(
    values => {
      const isAssignEmployee = values?.editingTable?.every(item => {
        return item?.employeeData?.length > 0;
      });

      const isChecker = values?.editingTable?.every(item => {
        return item?.checker;
      });

      const isRework = values?.editingTable?.some(item => {
        return item?.rework === true;
      });

      const isCompletedProject = values?.order_status >= 5;

      if (isAssignEmployee && isChecker && isCompletedProject && isRework) {
        let updatedList = values?.editingTable?.map(data => {
          return {
            item_id: data?._id,
            rework: data?.rework,
          };
        });
        let payload = {
          order_id: id,
          order_item: updatedList,
        };

        dispatch(addRework(payload))
          .then(response => {
            let payload = {
              order_id: id,
              step: 7,
            };
            dispatch(addStep(payload))
              .then(response => {
                dispatch(setEditingSelectedProgressIndex(8));
              })
              .catch(errors => {
                console.error('Add Status:', errors);
              });
          })
          .catch(error => {
            console.error('Error fetching add rework:', error);
          });
      } else {
        toast.error('Rework Details Are Required');
      }
    },
    [dispatch, id],
  );

  const { values, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: editingReworkData,
    onSubmit: submitHandle,
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
                            dispatch(setEditingSelectedProgressIndex(3));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Rework</h2>
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
                      field="rework"
                      header="Rework"
                      sortable
                      body={reworkBodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </Col>
            {/* <Col xxl={4} xl={5}>
              <div className="comment_box_wrap radius15 border">
                <div className="comment_box_title py15 px20 border-bottom">
                  <h6 className="m-0">Comments</h6>
                </div>
                <div className="comment_box_inner p20 p15-xs">
                  <h2 className="mb15">Wedding Works</h2>
                  <Link to="" className="text_light_Blue mb15 d-block">
                    https://www.example.nl.examplelogin.nl/mail/login/
                  </Link>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <ul>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="form_group mb-3">
                    <Editor
                      value={text}
                      onTextChange={e => setText(e.htmlValue)}
                      style={{ height: '80px' }}
                      placeholder="Write here"
                    />
                  </div>
                  <Button className="btn_grey">Comment</Button>
                </div>
              </div>
            </Col> */}
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
          <Button onClick={handleSubmit} className="btn_primary ms-2">
            Save
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
