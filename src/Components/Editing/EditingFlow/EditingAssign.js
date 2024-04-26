import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import Close from '../../../Assets/Images/close.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import {
  addStep,
  assignedEditorItem,
  createGroup,
  editingFlowGroupEdit,
  getEditingFlow,
  getItems,
  listEmployee,
  setEditingAssignData,
  setEditingSelectedProgressIndex,
  setIsAssignedEditor,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { useFormik } from 'formik';
import moment from 'moment';
import CommentDataCollection from './CommentDataCollection';
import { Dropdown } from 'primereact/dropdown';
import UserIcon from '../../../Assets/Images/add-user.svg';
import { toast } from 'react-toastify';

export default function EditingAssign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [createGroupModel, setCreateGroupModel] = useState(false);
  const [groupData, setGroupData] = useState({
    group_name: '',
    send_message_key: 'member',
  });
  const [isShowNext, setIsShowNext] = useState(false);
  const [isShowGroup, setIsShowGroup] = useState(false);
  const {
    editingLoading,
    editingAssignData,
    assignedEditorLoading,
    commentLoading,
    assignEmployeeList,
    employeeLoading,
    isAssignedEditor,
    getStepData,
    itemsLoading,
  } = useSelector(({ editing }) => editing);

  const handleGroupData = responseData => {
    if (responseData?.group_id) {
      setGroupData({
        group_name: responseData?.group_name,
        send_message_key: responseData?.group_status,
      });
    }
  };

  const fetchAllData = useCallback(() => {
    dispatch(getItems({ order_id: id }))
      .then(response => {
        const ItemData = response.payload;
        return { ItemData };
      })
      .then(({ ItemData }) => {
        dispatch(getEditingFlow({ order_id: id }))
          .then(response => {
            const responseData = response.payload;
            if (responseData?.group_id) {
              handleGroupData(responseData);
            }

            return { ItemData, responseData };
          })
          .then(({ ItemData, responseData }) => {
            dispatch(listEmployee())
              .then(response => {
                const responseList = response.payload;
                let updatedList = ItemData?.map(data => {
                  let checkIsNotProjectOwner = data?.employeeData?.find(
                    d => d?.project_owner === true,
                  );

                  let IsProjectOwner = checkIsNotProjectOwner ? true : false;

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

                  const isAssignEmployee = data?.employeeData?.some(item => {
                    return item?.assignedEmployee?.length === 0;
                  });

                  if (!isAssignEmployee && IsProjectOwner) {
                    setIsShowNext(true);
                  }

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
                    viewAssignedEmployee:
                      data?.employeeData?.length > 0
                        ? filteredEmployeeList
                        : [],
                    project_owner:
                      data?.employeeData?.length > 0 ? IsProjectOwner : false,
                    is_disabled:
                      data?.employeeData?.length > 0 ? !IsProjectOwner : false,
                  };
                });
                const updated = {
                  ...responseData,
                  editingTable: updatedList,
                };
                dispatch(setEditingAssignData(updated));
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
    if (isAssignedEditor) {
      dispatch(setIsAssignedEditor(false));
    }

    if (getStepData?.step >= 4) {
      setIsShowGroup(true);
    }
  }, [dispatch, getStepData, id, isAssignedEditor]);

  useEffect(() => {
    fetchAllData();
  }, [dispatch, id, isAssignedEditor, getStepData]);

  const handleAssignEmployeeChange = (e, data) => {
    const newEmployee = e.value;
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(
      x => x?.item_id === data?.item_id && data?._id === x?._id,
    );
    const oldObj = editingList[index];
    const assignedEmployee = [...oldObj.assignedEmployee, newEmployee];

    const AssignedEmployeeList = data?.employeeList?.filter(
      d => !d?._id?.includes(newEmployee),
    );
    const viewAssignedEmployee = data?.employeeList?.filter(
      d => d?._id === newEmployee,
    );
    const newViewAssignedEmployee = [
      ...oldObj.viewAssignedEmployee,
      ...viewAssignedEmployee,
    ];

    const updatedObj = {
      ...oldObj,
      assignedEmployee: assignedEmployee,
      employeeList: AssignedEmployeeList,
      viewAssignedEmployee: newViewAssignedEmployee,
    };
    if (index >= 0) editingList[index] = updatedObj;
    setFieldValue('editingTable', editingList);
    const isProjectOwner = editingList?.some(item => {
      return item?.project_owner === true;
    });

    const isAssignEmployee = editingList?.some(item => {
      return item?.assignedEmployee?.length === 0;
    });

    if (!isAssignEmployee && isProjectOwner) {
      setIsShowNext(true);
    } else {
      setIsShowNext(false);
    }
  };

  const handleDeleteEmployee = (data, item) => {
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(x => x?.item_id === data?.item_id);
    const oldObj = editingList[index];

    const assignedEmployee = oldObj.assignedEmployee?.filter(
      itemId => itemId !== item.value,
    );

    const AssignedEmployeeList = assignEmployeeList?.filter(
      d => !assignedEmployee?.includes(d?._id),
    );

    const viewAssignedEmployee = oldObj.viewAssignedEmployee?.filter(
      d => d?._id !== item?._id,
    );

    const updatedObj = {
      ...oldObj,
      assignedEmployee: assignedEmployee,
      employeeList: AssignedEmployeeList,
      viewAssignedEmployee: viewAssignedEmployee,
    };
    if (index >= 0) editingList[index] = updatedObj;
    setFieldValue('editingTable', editingList);
    const isProjectOwner = editingList?.some(item => {
      return item?.project_owner === true;
    });

    const isAssignEmployee = editingList?.some(item => {
      return item?.assignedEmployee?.length === 0;
    });

    if (!isAssignEmployee && isProjectOwner) {
      setIsShowNext(true);
    } else {
      setIsShowNext(false);
    }
  };

  const handleProjectOwnerChange = (e, data) => {
    const editingList = [...values?.editingTable];

    let updatedList = editingList.map((d, index) => {
      if (d?.item_id === data?.item_id) {
        return { ...d, project_owner: e, is_disabled: false };
      } else {
        return {
          ...d,
          project_owner: false,
          is_disabled: e,
        };
      }
    });
    setFieldValue('editingTable', updatedList);
    const isProjectOwner = updatedList?.some(item => {
      return item?.project_owner === true;
    });

    const isAssignEmployee = updatedList?.some(item => {
      return item?.assignedEmployee?.length === 0;
    });

    if (!isAssignEmployee && isProjectOwner) {
      setIsShowNext(true);
    } else {
      setIsShowNext(false);
    }
  };

  const countryOptionTemplate = option => {
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

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const AssignBodyTemplet = data => {
    return (
      <ul className="assign-body-wrap edit-assign-body-wrap">
        {data?.viewAssignedEmployee &&
          data?.viewAssignedEmployee?.length > 0 &&
          data?.viewAssignedEmployee?.map((item, index) => {
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
                      handleDeleteEmployee(data, item);
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
              itemTemplate={countryOptionTemplate}
              onChange={e => {
                handleAssignEmployeeChange(e, data);
              }}
            />

            {/* <Dropdown
              className="dropdown_common position-static"
              
            >
              <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                <div className="assigned_exposer">
                  <div className="btn_doted">
                    <img src={AddUserIcon} alt="" />
                    <img className="add_icon" src={PlusIcon} alt="" />
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  {data?.employeeList &&
                    data?.employeeList?.length > 0 &&
                    data?.employeeList?.map(item => {
                      return (
                        <div className="assign_dropdown">
                          <div className="assign_profile">
                            <img src={item?.image} alt="profileimg" />
                            <h5 className="m-0">{item?.employee_name}</h5>
                          </div>
                        </div>
                      );
                    })}
                 
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </div>
        </li>
      </ul>
    );
  };

  const ProjectOwnerBodyTemplet = data => {
    return (
      <Checkbox
        onChange={e => handleProjectOwnerChange(e.checked, data)}
        checked={data?.project_owner}
        disabled={data?.is_disabled}
      ></Checkbox>
    );
  };

  const submitHandle = useCallback(
    values => {
      const isProjectOwner = values?.editingTable?.some(item => {
        return item?.project_owner === true;
      });

      const isAssignEmployee = values?.editingTable?.some(item => {
        return item?.assignedEmployee?.length === 0;
      });

      if (!isAssignEmployee && isProjectOwner) {
        let updatedList = values?.editingTable?.map(data => {
          return {
            quotation_detail_id: data?._id,
            item_id: data?.item_id,
            employee_id: data?.assignedEmployee,
            project_owner: data?.project_owner,
          };
        });
        let payload = {
          order_id: id,
          assigned_data: updatedList,
        };

        dispatch(assignedEditorItem(payload));
        setIsShowNext(true);
        setIsShowGroup(true);
      } else {
        toast.error('Assign Details Are Required');
        setIsShowNext(false);
        setIsShowGroup(false);
      }
    },
    [dispatch, id],
  );

  const { values, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: editingAssignData,
    onSubmit: submitHandle,
  });

  const footerContent = (
    <div className="footer_wrap text-end">
      <Button
        className="btn_primary"
        onClick={() => {
          let payload = values.group_id
            ? { ...groupData, group_id: values.group_id }
            : { ...groupData, order_id: id };

          values.group_id
            ? dispatch(editingFlowGroupEdit(payload))
            : dispatch(createGroup(payload));

          //for listing api:
          fetchAllData();

          setCreateGroupModel(false);
        }}
      >
        Save
      </Button>
    </div>
  );

  return (
    <div className="">
      {(commentLoading ||
        editingLoading ||
        employeeLoading ||
        assignedEditorLoading ||
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
                        <h2 className="m-0 ms-2 fw_500">Assign To Editor</h2>
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
                  <div className="text-end">
                    <Button
                      className="btn_primary"
                      onClick={() => setCreateGroupModel(true)}
                      disabled={!isShowGroup}
                    >
                      <img src={EditIcon} alt="EditIcon" />
                      {values.group_id ? values?.group_name : 'Create Group'}
                    </Button>
                  </div>
                </div>
                <div className="data_table_wrapper max_height">
                  <DataTable
                    value={values?.editingTable}
                    sortField="price"
                    sortOrder={1}
                    rows={10}
                  >
                    <Column
                      field="item_name"
                      header="Item Name"
                      sortable
                    ></Column>
                    <Column
                      field="quantity"
                      header="Quantity"
                      sortable
                    ></Column>
                    <Column
                      field="due_date"
                      header="Due Date"
                      sortable
                    ></Column>
                    <Column
                      field="data_size"
                      header="Data Size"
                      sortable
                    ></Column>
                    <Column
                      field="assigned_editors"
                      header="Assigned Editors"
                      sortable
                      body={AssignBodyTemplet}
                    ></Column>
                    <Column
                      field="project_owner"
                      header="Project Owner"
                      sortable
                      body={ProjectOwnerBodyTemplet}
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
          <Button onClick={handleSubmit} className="btn_primary ms-2">
            Save
          </Button>
          {isShowNext && (
            <Button
              onClick={() => {
                if (getStepData?.step < 4) {
                  let payload = {
                    order_id: id,
                    step: 4,
                  };
                  dispatch(addStep(payload))
                    .then(response => {
                      dispatch(setEditingSelectedProgressIndex(5));
                    })
                    .catch(errors => {
                      console.error('Add Status:', errors);
                    });
                } else {
                  dispatch(setEditingSelectedProgressIndex(5));
                }
              }}
              className="btn_primary ms-2"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      <Dialog
        header={values.group_id ? 'Edit Group' : 'Create Group'}
        visible={createGroupModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setCreateGroupModel(false)}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <div className="form_group mb-3">
            <div className="radio_wrapper mb-3">
              <label className="mb10">Who Can Send message ?</label>
              <div className="d-flex align-items-center">
                <div className="radio-inner-wrap d-flex align-items-center me-3">
                  <RadioButton
                    inputId="OnlyAdmins"
                    name="OnlyAdmins"
                    value="admin"
                    onChange={e =>
                      setGroupData({
                        ...groupData,
                        send_message_key: e.value,
                      })
                    }
                    checked={groupData?.send_message_key === 'admin'}
                  />
                  <label htmlFor="ingredient1" className="ms-2">
                    Only Admins
                  </label>
                </div>
                <div className="radio-inner-wrap d-flex align-items-center">
                  <RadioButton
                    inputId="AnyMember"
                    name="AnyMember"
                    value="member"
                    onChange={e =>
                      setGroupData({
                        ...groupData,
                        send_message_key: e.value,
                      })
                    }
                    checked={groupData?.send_message_key === 'member'}
                  />
                  <label htmlFor="ingredient2" className="ms-2">
                    Any Member
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="form_group">
            <label htmlFor="ChatName">Group Chat Name</label>
            <InputText
              id="ChatName"
              placeholder="Write group name"
              className="input_wrap"
              name="group_name"
              value={groupData.group_name || ''}
              onChange={e =>
                setGroupData({
                  ...groupData,
                  group_name: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Dialog>

      {/* conformation popup */}
    </div>
  );
}
