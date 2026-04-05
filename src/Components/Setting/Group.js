import React, { useState, useCallback, useEffect } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../Assets/Images/plus.svg';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import CompanySidebar from './CompanySidebar';
// import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import _ from 'lodash';
import {
  deleteGroup,
  getGroup,
  getGroupList,
  // setGroupCurrentPage,
  // setGroupPageLimit,
  setGroupSearchParam,
  setIsAddGroup,
  setIsDeleteGroup,
  setIsUpdateGroup,
  addGroup,
  editGroup,
  getDropdownListGroup,
} from 'Store/Reducers/Settings/AccountMaster/GroupSlice';
import Loader from 'Components/Common/Loader';
import { Checkbox } from 'primereact/checkbox';
import { groupSchema } from 'Schema/Setting/accountMasterSchema';

let initialData = {
  group_name: '',
  group_under_1: '',
  group_under_2: '',
  group_under_3: '',
  group_header: '',
  isActive: true,
};

let dropdownInitialValue = {
  groupHeaderList: [],
  underlist_1: [],
  underlist_2: [],
  underlist_3: [],
};

export default function Group({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const {
    groupList,
    // groupCurrentPage,
    // groupPageLimit,
    isAddGroup,
    isUpdateGroup,
    isDeleteGroup,
    groupSearchParam,
    groupLoading,
    // selectedGroupData,
  } = useSelector(({ group }) => group);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [groupModel, setGroupModel] = useState(false);
  const [dropdownList, setDropdownList] = useState(dropdownInitialValue);
  const [groupDataValue, setGroupDataValue] = useState(initialData);

  // const updatedGroupListingData = useMemo(() => {
  //   let dummyArray = [];
  //   if (groupList?.list?.length > 0) {
  //     groupList?.list.forEach(item => {
  //       item.groups?.forEach(d => {
  //         dummyArray.push({ ...d });
  //       });
  //     });
  //   }
  //   return dummyArray;
  // }, [groupList]);

  const getGroupListApi = useCallback(
    (search = '') => {
      dispatch(
        getGroupList({
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getGroupListApi();
  }, [getGroupListApi]);

  useEffect(() => {
    if (isAddGroup || isUpdateGroup || isDeleteGroup) {
      getGroupListApi(groupSearchParam);
      resetForm();
      setGroupDataValue(initialData);
      setGroupModel(false);
    }
    if (isUpdateGroup) {
      dispatch(setIsUpdateGroup(false));
    }
    if (isAddGroup) {
      dispatch(setIsAddGroup(false));
    }
    if (isDeleteGroup) {
      dispatch(setIsDeleteGroup(false));
    }
  }, [dispatch, isAddGroup, isUpdateGroup, isDeleteGroup]);

  const getRequiredList = useCallback(() => {
    dispatch(
      getDropdownListGroup({
        parent_id: null,
      }),
    )
      .then(response => {
        let groupHeaderList = response.payload?.data?.map(item => {
          return { label: item?.group_name, value: item?._id };
        });

        setDropdownList({
          ...dropdownList,
          groupHeaderList: groupHeaderList,
        });
      })
      .catch(error => {
        console.error('Error fetching dropdownList data:', error);
      });
  }, [dispatch, dropdownList]);

  // const headerTemplate = data => {
  //   return (
  //     <div className="flex align-items-center gap-2">
  //       <span className="font-bold">{data?.group_under}</span>
  //     </div>
  //   );
  // };

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          group_name: values?.group_name,
          isActive: values?.isActive,
          parent_id: values?.parent_id,
          group_id: values?._id,
        };
        dispatch(editGroup(payload));
      } else {
        const payload = {
          group_name: values?.group_name,
          isActive: values?.isActive,
          parent_id: values?.group_under_3
            ? values?.group_under_3
            : values?.group_under_2
            ? values?.group_under_2
            : values?.group_under_1
            ? values?.group_under_1
            : values?.group_header,
        };
        dispatch(addGroup(payload));
      }
      setDropdownList(dropdownInitialValue);
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: groupDataValue,
    validationSchema: groupSchema,
    onSubmit: submitHandle,
  });

  const EditData = useCallback(
    row => {
      setGroupModel(true);
      dispatch(getGroup({ group_id: row?._id }))
        .then(response => {
          let responseData = response.payload;
          setGroupDataValue({
            ...responseData,
            group_header: responseData?.parent_id,
          });
        })
        .catch(error => {
          console.error('Error fetching group data:', error);
        });
    },
    [dispatch],
  );

  // const actionBodyTemplate = row => {
  //   return (
  //     <div className="dropdown_action_wrap">
  //       <Dropdown className="dropdown_common position-static">
  //         <Dropdown.Toggle
  //           id="dropdown-basic"
  //           className="action_btn"
  //           disabled={is_edit_access || is_delete_access ? false : true}
  //         >
  //           <img src={ActionBtn} alt="" />
  //         </Dropdown.Toggle>
  //         <Dropdown.Menu>
  //           {is_edit_access && (
  //             <Dropdown.Item onClick={() => {}}>
  //               <img src={EditIcon} alt="EditIcon" /> Edit
  //             </Dropdown.Item>
  //           )}
  //           {is_delete_access && (
  //             <Dropdown.Item
  //               onClick={() => {
  //                 setDeleteId(row?._id);
  //                 setDeletePopup(true);
  //               }}
  //             >
  //               <img src={TrashIcon} alt="TrashIcon" /> Delete
  //             </Dropdown.Item>
  //           )}
  //         </Dropdown.Menu>
  //       </Dropdown>
  //     </div>
  //   );
  // };

  /*   const onPageChange = page => {
    let pageIndex = groupCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setGroupCurrentPage(pageIndex));
  }; */

  /*   const onPageRowsChange = page => {
    dispatch(setGroupCurrentPage(page === 0 ? 0 : 1));
    dispatch(setGroupPageLimit(page));
  }; */

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      group_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteGroup(deleteItemObj));
    }
    setDeletePopup(false);
    setDeleteId('');
  }, [dispatch, deleteId]);

  // const countryTemplate = option => {
  //   return (
  //     <div className="d-flex align-items-center justify-content-between">
  //       <div>{option.label}</div>
  //       <div>{option.code}</div>
  //     </div>
  //   );
  // };

  const handleGroupHeaderChange = useCallback(
    e => {
      let name = e.target.name;
      let value = e.target.value;
      dispatch(
        getDropdownListGroup({
          parent_id: value,
        }),
      )
        .then(response => {
          let groupUnderList = response.payload?.data?.map(item => {
            return { label: item?.group_name, value: item?._id };
          });

          setDropdownList({
            ...dropdownList,
            underlist_1: groupUnderList,
            underlist_2: [],
            underlist_3: [],
          });
        })
        .catch(error => {
          console.error('Error fetching dropdownList data:', error);
        });
      setFieldValue(name, value);
      setFieldValue('group_under_1', '');
      setFieldValue('group_under_2', '');
      setFieldValue('group_under_3', '');
    },
    [dispatch, dropdownList, setFieldValue],
  );

  const handleUnder1Change = useCallback(
    e => {
      const { name, value } = e.target;
      dispatch(
        getDropdownListGroup({
          parent_id: value,
        }),
      )
        .then(response => {
          let groupUnderList = response.payload?.data?.map(item => {
            return { label: item?.group_name, value: item?._id };
          });

          setDropdownList({
            ...dropdownList,
            underlist_2: groupUnderList,
            underlist_3: [],
          });
        })
        .catch(error => {
          console.error('Error fetching dropdownList data:', error);
        });

      setFieldValue(name, value);
      setFieldValue('group_under_2', '');
      setFieldValue('group_under_3', '');
    },
    [dispatch, dropdownList, setFieldValue],
  );

  const handleUnder2Change = useCallback(
    e => {
      const { name, value } = e.target;
      dispatch(
        getDropdownListGroup({
          parent_id: value,
        }),
      )
        .then(response => {
          let groupUnderList = response.payload?.data?.map(item => {
            return { label: item?.group_name, value: item?._id };
          });

          setDropdownList({
            ...dropdownList,
            underlist_3: groupUnderList,
          });
        })
        .catch(error => {
          console.error('Error fetching dropdownList data:', error);
        });

      setFieldValue(name, value);
      setFieldValue('group_under_3', '');
    },
    [dispatch, dropdownList, setFieldValue],
  );

  const onCancel = useCallback(() => {
    resetForm();
    setGroupDataValue(initialData);
    setGroupModel(false);
  }, [resetForm]);

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Checkbox
          inputId="ingredient1"
          name="isActive"
          value={values?.isActive || false}
          onBlur={handleBlur}
          onChange={handleChange}
          checked={values?.isActive}
          required
        />
        {touched?.isActive && errors?.isActive && (
          <p className="text-danger">{errors?.isActive}</p>
        )}
        <label htmlFor="ingredient1" className="ms-2">
          Active
        </label>
      </div>
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    // dispatch(setGroupCurrentPage(1));
    getGroupListApi(e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {groupLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Group</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={groupSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setGroupSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setGroupDataValue(initialData);
                              getRequiredList();
                              setGroupModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Group
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="group_wrapper">
              <div className="group_header">
                <ul>
                  <li>Group</li>
                  <li>Action</li>
                </ul>
              </div>
              <div className="group_content_wrapper">
                <ul>
                  {groupList?.length > 0 &&
                    groupList?.map((data, index) => {
                      return (
                        <li className="parent" key={index}>
                          <span className="parent_title">
                            {data?.group_name}
                          </span>
                          <ul>
                            {data?.child?.length > 0 &&
                              data?.child?.map((item, i) => {
                                return (
                                  <li className="inner_child" key={i}>
                                    <div className="inner_child_title">
                                      <span>{item?.group_name}</span>
                                      <div className="dropdown_action_wrap">
                                        {/* <Dropdown className="dropdown_common position-static">
                                          <Dropdown.Toggle
                                            id="dropdown-basic"
                                            className="action_btn"
                                            disabled={
                                              is_edit_access || is_delete_access
                                                ? false
                                                : true
                                            }
                                          >
                                            <img src={ActionBtn} alt="" />
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            {is_edit_access && (
                                              <Dropdown.Item
                                                onClick={() => {
                                                  EditData(item);
                                                }}
                                              >
                                                <img
                                                  src={EditIcon}
                                                  alt="EditIcon"
                                                />{' '}
                                                Edit
                                              </Dropdown.Item>
                                            )}
                                            {is_delete_access && (
                                              <Dropdown.Item
                                                onClick={() => {
                                                  setDeleteId(item?._id);
                                                  setDeletePopup(true);
                                                }}
                                              >
                                                <img
                                                  src={TrashIcon}
                                                  alt="TrashIcon"
                                                />{' '}
                                                Delete
                                              </Dropdown.Item>
                                            )}
                                          </Dropdown.Menu>
                                        </Dropdown> */}

                                        <div className="d-flex gap-3">
                                          {is_edit_access && (
                                            <img
                                              alt=""
                                              src={EditIcon}
                                              className="cursor_pointer"
                                              onClick={() => {
                                                EditData(item);
                                              }}
                                            />
                                          )}
                                          {is_delete_access && (
                                            <img
                                              src={TrashIcon}
                                              alt=""
                                              className="cursor_pointer"
                                              onClick={() => {
                                                setDeleteId(item?._id);
                                                setDeletePopup(true);
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <ul>
                                      {item?.child?.length > 0 &&
                                        item?.child?.map((d, i) => {
                                          return (
                                            <li className="inner_child" key={i}>
                                              <div className="inner_child_title">
                                                <span>{d?.group_name}</span>
                                                <div className="dropdown_action_wrap">
                                                  {/* <Dropdown className="dropdown_common position-static">
                                                    <Dropdown.Toggle
                                                      id="dropdown-basic"
                                                      className="action_btn"
                                                      disabled={
                                                        is_edit_access ||
                                                        is_delete_access
                                                          ? false
                                                          : true
                                                      }
                                                    >
                                                      <img
                                                        src={ActionBtn}
                                                        alt=""
                                                      />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                      {is_edit_access && (
                                                        <Dropdown.Item
                                                          onClick={() => {
                                                            EditData(d);
                                                          }}
                                                        >
                                                          <img
                                                            src={EditIcon}
                                                            alt="EditIcon"
                                                          />{' '}
                                                          Edit
                                                        </Dropdown.Item>
                                                      )}
                                                      {is_delete_access && (
                                                        <Dropdown.Item
                                                          onClick={() => {
                                                            setDeleteId(d?._id);
                                                            setDeletePopup(
                                                              true,
                                                            );
                                                          }}
                                                        >
                                                          <img
                                                            src={TrashIcon}
                                                            alt="TrashIcon"
                                                          />{' '}
                                                          Delete
                                                        </Dropdown.Item>
                                                      )}
                                                    </Dropdown.Menu>
                                                  </Dropdown> */}

                                                  <div className="d-flex gap-3">
                                                    {is_edit_access && (
                                                      <img
                                                        alt=""
                                                        src={EditIcon}
                                                        className="cursor_pointer"
                                                        onClick={() => {
                                                          EditData(d);
                                                        }}
                                                      />
                                                    )}
                                                    {is_delete_access && (
                                                      <img
                                                        src={TrashIcon}
                                                        alt=""
                                                        className="cursor_pointer"
                                                        onClick={() => {
                                                          setDeleteId(d?._id);
                                                          setDeletePopup(true);
                                                        }}
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              <ul>
                                                {d?.child?.length > 0 &&
                                                  d?.child?.map((x, i) => {
                                                    return (
                                                      <li
                                                        className="inner_child"
                                                        key={i}
                                                      >
                                                        <div className="inner_child_title">
                                                          <span>
                                                            {x?.group_name}
                                                          </span>
                                                          <div className="dropdown_action_wrap">
                                                            {/* <Dropdown className="dropdown_common position-static">
                                                              <Dropdown.Toggle
                                                                id="dropdown-basic"
                                                                className="action_btn"
                                                                disabled={
                                                                  is_edit_access ||
                                                                  is_delete_access
                                                                    ? false
                                                                    : true
                                                                }
                                                              >
                                                                <img
                                                                  src={
                                                                    ActionBtn
                                                                  }
                                                                  alt=""
                                                                />
                                                              </Dropdown.Toggle>
                                                              <Dropdown.Menu>
                                                                {is_edit_access && (
                                                                  <Dropdown.Item
                                                                    onClick={() => {
                                                                      EditData(
                                                                        x,
                                                                      );
                                                                    }}
                                                                  >
                                                                    <img
                                                                      src={
                                                                        EditIcon
                                                                      }
                                                                      alt="EditIcon"
                                                                    />{' '}
                                                                    Edit
                                                                  </Dropdown.Item>
                                                                )}
                                                                {is_delete_access && (
                                                                  <Dropdown.Item
                                                                    onClick={() => {
                                                                      setDeleteId(
                                                                        x?._id,
                                                                      );
                                                                      setDeletePopup(
                                                                        true,
                                                                      );
                                                                    }}
                                                                  >
                                                                    <img
                                                                      src={
                                                                        TrashIcon
                                                                      }
                                                                      alt="TrashIcon"
                                                                    />{' '}
                                                                    Delete
                                                                  </Dropdown.Item>
                                                                )}
                                                              </Dropdown.Menu>
                                                            </Dropdown> */}

                                                            <div className="d-flex gap-3">
                                                              {is_edit_access && (
                                                                <img
                                                                  alt=""
                                                                  src={EditIcon}
                                                                  className="cursor_pointer"
                                                                  onClick={() => {
                                                                    EditData(x);
                                                                  }}
                                                                />
                                                              )}
                                                              {is_delete_access && (
                                                                <img
                                                                  src={
                                                                    TrashIcon
                                                                  }
                                                                  alt=""
                                                                  className="cursor_pointer"
                                                                  onClick={() => {
                                                                    setDeleteId(
                                                                      x?._id,
                                                                    );
                                                                    setDeletePopup(
                                                                      true,
                                                                    );
                                                                  }}
                                                                />
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <ul>
                                                          {x?.child?.length >
                                                            0 &&
                                                            x?.child?.map(
                                                              (f, i) => {
                                                                return (
                                                                  <li
                                                                    className="inner_child"
                                                                    key={i}
                                                                  >
                                                                    <div className="inner_child_title">
                                                                      <span>
                                                                        {
                                                                          f?.group_name
                                                                        }
                                                                      </span>
                                                                      <div className="dropdown_action_wrap">
                                                                        {/* <Dropdown className="dropdown_common position-static">
                                                                          <Dropdown.Toggle
                                                                            id="dropdown-basic"
                                                                            className="action_btn"
                                                                            disabled={
                                                                              is_edit_access ||
                                                                              is_delete_access
                                                                                ? false
                                                                                : true
                                                                            }
                                                                          >
                                                                            <img
                                                                              src={
                                                                                ActionBtn
                                                                              }
                                                                              alt=""
                                                                            />
                                                                          </Dropdown.Toggle>
                                                                          <Dropdown.Menu>
                                                                            {is_edit_access && (
                                                                              <Dropdown.Item
                                                                                onClick={() => {
                                                                                  EditData(
                                                                                    f,
                                                                                  );
                                                                                }}
                                                                              >
                                                                                <img
                                                                                  src={
                                                                                    EditIcon
                                                                                  }
                                                                                  alt="EditIcon"
                                                                                />{' '}
                                                                                Edit
                                                                              </Dropdown.Item>
                                                                            )}
                                                                            {is_delete_access && (
                                                                              <Dropdown.Item
                                                                                onClick={() => {
                                                                                  setDeleteId(
                                                                                    f?._id,
                                                                                  );
                                                                                  setDeletePopup(
                                                                                    true,
                                                                                  );
                                                                                }}
                                                                              >
                                                                                <img
                                                                                  src={
                                                                                    TrashIcon
                                                                                  }
                                                                                  alt="TrashIcon"
                                                                                />{' '}
                                                                                Delete
                                                                              </Dropdown.Item>
                                                                            )}
                                                                          </Dropdown.Menu>
                                                                        </Dropdown> */}

                                                                        <div className="d-flex gap-3">
                                                                          {is_edit_access && (
                                                                            <img
                                                                              alt=""
                                                                              src={
                                                                                EditIcon
                                                                              }
                                                                              className="cursor_pointer"
                                                                              onClick={() => {
                                                                                EditData(
                                                                                  f,
                                                                                );
                                                                              }}
                                                                            />
                                                                          )}
                                                                          {is_delete_access && (
                                                                            <img
                                                                              src={
                                                                                TrashIcon
                                                                              }
                                                                              alt=""
                                                                              className="cursor_pointer"
                                                                              onClick={() => {
                                                                                setDeleteId(
                                                                                  f?._id,
                                                                                );
                                                                                setDeletePopup(
                                                                                  true,
                                                                                );
                                                                              }}
                                                                            />
                                                                          )}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </li>
                                                                );
                                                              },
                                                            )}
                                                        </ul>
                                                      </li>
                                                    );
                                                  })}
                                              </ul>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </li>
                                );
                              })}

                            {/* <li className="outer_child">
                              <div className="outer_child_title">
                                <span>Income (Trading) </span>
                                <div className="dropdown_action_wrap">
                                  <Dropdown className="dropdown_common position-static">
                                    <Dropdown.Toggle
                                      id="dropdown-basic"
                                      className="action_btn"
                                      disabled={
                                        is_edit_access || is_delete_access
                                          ? false
                                          : true
                                      }
                                    >
                                      <img src={ActionBtn} alt="" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {is_edit_access && (
                                        <Dropdown.Item
                                        // onClick={() => {
                                        //   getRequiredList();
                                        //   dispatch(getGroup({ group_id: row?._id }));
                                        //   setGroupModel(true);
                                        // }}
                                        >
                                          <img src={EditIcon} alt="EditIcon" />{' '}
                                          Edit
                                        </Dropdown.Item>
                                      )}
                                      {is_delete_access && (
                                        <Dropdown.Item
                                        // onClick={() => {
                                        //   setDeleteId(row?._id);
                                        //   setDeletePopup(true);
                                        // }}
                                        >
                                          <img
                                            src={TrashIcon}
                                            alt="TrashIcon"
                                          />{' '}
                                          Delete
                                        </Dropdown.Item>
                                      )}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </li>
                            <li className="outer_child">
                              <div className="outer_child_title">
                                <span>Job Work Expenses</span>
                                <div className="dropdown_action_wrap">
                                  <Dropdown className="dropdown_common position-static">
                                    <Dropdown.Toggle
                                      id="dropdown-basic"
                                      className="action_btn"
                                      disabled={
                                        is_edit_access || is_delete_access
                                          ? false
                                          : true
                                      }
                                    >
                                      <img src={ActionBtn} alt="" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {is_edit_access && (
                                        <Dropdown.Item
                                        // onClick={() => {
                                        //   getRequiredList();
                                        //   dispatch(getGroup({ group_id: row?._id }));
                                        //   setGroupModel(true);
                                        // }}
                                        >
                                          <img src={EditIcon} alt="EditIcon" />{' '}
                                          Edit
                                        </Dropdown.Item>
                                      )}
                                      {is_delete_access && (
                                        <Dropdown.Item
                                        // onClick={() => {
                                        //   setDeleteId(row?._id);
                                        //   setDeletePopup(true);
                                        // }}
                                        >
                                          <img
                                            src={TrashIcon}
                                            alt="TrashIcon"
                                          />{' '}
                                          Delete
                                        </Dropdown.Item>
                                      )}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </li> */}
                          </ul>
                        </li>
                      );
                    })}

                  {/* <li className="parent">
                    <span className="parent_title">Profit & Loss</span>
                    <ul>
                      <li className="outer_child">
                        <div className="outer_child_title">
                          <span>Job Work Expenses</span>
                          <div className="dropdown_action_wrap">
                            <Dropdown className="dropdown_common position-static">
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                className="action_btn"
                                disabled={
                                  is_edit_access || is_delete_access
                                    ? false
                                    : true
                                }
                              >
                                <img src={ActionBtn} alt="" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {is_edit_access && (
                                  <Dropdown.Item
                                  // onClick={() => {
                                  //   getRequiredList();
                                  //   dispatch(getGroup({ group_id: row?._id }));
                                  //   setGroupModel(true);
                                  // }}
                                  >
                                    <img src={EditIcon} alt="EditIcon" /> Edit
                                  </Dropdown.Item>
                                )}
                                {is_delete_access && (
                                  <Dropdown.Item
                                  // onClick={() => {
                                  //   setDeleteId(row?._id);
                                  //   setDeletePopup(true);
                                  // }}
                                  >
                                    <img src={TrashIcon} alt="TrashIcon" />{' '}
                                    Delete
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li> */}
                </ul>
              </div>
            </div>
            {/* <div className="data_table_wrapper">
              <DataTable
                value={updatedGroupListingData}
                rowGroupMode="subheader"
                groupRowsBy="group_under"
                sortField="group_under"
                scrollable
                rowGroupHeaderTemplate={headerTemplate}
              >
                <Column
                  field="group_name"
                  header="Group Name"
                  sortable
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={groupList?.list}
                pageLimit={groupPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={groupCurrentPage}
                totalCount={groupList?.totalRows}
              />
            </div> */}
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'group'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Group' : 'Create Group'}
        visible={groupModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setGroupModel(false)}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          {!values?._id && (
            <div className="form_group mb-3">
              <label htmlFor="GroupHeader">
                Group Header <span className="text-danger fs-6">*</span>
              </label>
              <ReactSelectSingle
                filter
                value={values?.group_header}
                name="group_header"
                onBlur={handleBlur}
                options={dropdownList?.groupHeaderList}
                onChange={e => handleGroupHeaderChange(e)}
                placeholder="Group Header"
                className="w-100"
              />

              {touched?.group_header &&
                errors?.group_header &&
                !values?.group_header && (
                  <p className="text-danger">{errors?.group_header}</p>
                )}
            </div>
          )}
          <div className="form_group mb-3">
            <label htmlFor="GroupName">
              Group Name <span className="text-danger fs-6">*</span>
            </label>
            <InputText
              id="GroupName"
              placeholder="Group Name"
              className="input_wrap"
              value={values?.group_name}
              name="group_name"
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
            {touched?.group_name && errors?.group_name && (
              <p className="text-danger">{errors?.group_name}</p>
            )}
          </div>
          {dropdownList?.underlist_1?.length > 0 && !values?._id && (
            <div className="form_group mb-3">
              <label>Under 1</label>
              <ReactSelectSingle
                filter
                name="group_under_1"
                value={values?.group_under_1}
                options={dropdownList?.underlist_1}
                onChange={e => handleUnder1Change(e)}
                placeholder="Group Under"
                className="w-100"
              />
            </div>
          )}
          {dropdownList?.underlist_2?.length > 0 && !values?._id && (
            <div className="form_group mb-3">
              <label>Under 2</label>
              <ReactSelectSingle
                filter
                name="group_under_2"
                value={values?.group_under_2}
                options={dropdownList?.underlist_2}
                onChange={e => handleUnder2Change(e)}
                placeholder="Group Under"
                className="w-100"
              />
            </div>
          )}
          {dropdownList?.underlist_3?.length > 0 && !values?._id && (
            <div className="form_group mb-3">
              <label>Under 3</label>
              <ReactSelectSingle
                filter
                name="group_under_3"
                value={values?.group_under_3}
                options={dropdownList?.underlist_3}
                onChange={e => setFieldValue('group_under_3', e.value)}
                placeholder="Group Under"
                className="w-100"
              />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
