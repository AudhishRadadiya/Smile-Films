import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanySidebar from '../CompanySidebar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../../Assets/Images/action.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { Tag } from 'primereact/tag';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmployeeList,
  setEmployeeCurrentPage,
  setEmployeePageLimit,
  setIsDeleteEmployee,
  setEmployeeSearchParam,
  deleteEmployee,
  setIsGetInitialValuesEmployee,
  clearAddSelectedEmployeeData,
  clearUpdateSelectedEmployeeData,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';
import moment from 'moment';

export default function Employee({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    employeeList,
    employeeLoading,
    isDeleteEmployee,
    employeePageLimit,
    employeeCurrentPage,
    employeeSearchParam,
    isGetInitialValuesEmployee,
  } = useSelector(({ employee }) => employee);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const getEmployeeListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getEmployeeList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getEmployeeListApi(
      employeeCurrentPage,
      employeePageLimit,
      employeeSearchParam,
    );
  }, []);

  useEffect(() => {
    if (isDeleteEmployee) {
      getEmployeeListApi(
        employeeCurrentPage,
        employeePageLimit,
        employeeSearchParam,
      );
      dispatch(setIsDeleteEmployee(false));
    }
  }, [dispatch, isDeleteEmployee]);

  const actionBodyTemplate = row => {
    return (
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle
      //       id="dropdown-basic"
      //       className="action_btn"
      //       disabled={is_edit_access || is_delete_access ? false : true}
      //     >
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       {is_edit_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             dispatch(
      //               setIsGetInitialValuesEmployee({
      //                 ...isGetInitialValuesEmployee,
      //                 update: false,
      //               }),
      //             );
      //             dispatch(clearUpdateSelectedEmployeeData());
      //             navigate(`/update-employee/${row?._id}`);
      //           }}
      //         >
      //           <img src={EditIcon} alt="EditIcon" /> Edit
      //         </Dropdown.Item>
      //       )}
      //       {is_delete_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             setDeleteId(row?._id);
      //             setDeletePopup(true);
      //           }}
      //         >
      //           <img src={TrashIcon} alt="TrashIcon" /> Delete
      //         </Dropdown.Item>
      //       )}
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        {is_edit_access && (
          <img
            alt=""
            src={EditIcon}
            className="cursor_pointer"
            onClick={() => {
              dispatch(
                setIsGetInitialValuesEmployee({
                  ...isGetInitialValuesEmployee,
                  update: false,
                }),
              );
              dispatch(clearUpdateSelectedEmployeeData());
              navigate(`/update-employee/${row?._id}`);
            }}
          />
        )}
        {is_delete_access && (
          <img
            src={TrashIcon}
            alt=""
            className="cursor_pointer"
            onClick={() => {
              setDeleteId(row?._id);
              setDeletePopup(true);
            }}
          />
        )}
      </div>
    );
  };

  const statusBodyTemplate = product => {
    return (
      <Tag
        value={product.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(product)}
      ></Tag>
    );
  };

  const getSeverity = product => {
    switch (product.isActive) {
      case true:
        return 'active';

      case false:
        return 'inactive';

      default:
        return null;
    }
  };

  const ItemTypeBodyTemplate = rowData => {
    return rowData?.type === 1
      ? 'Editing'
      : rowData?.type === 2
      ? 'Exposing'
      : 'Both';
  };

  const nameBodyTemplate = data => {
    return (
      <Link to={`/employee-profile/${data?._id}`} className="hover_text">
        {data?.first_name + ' ' + data?.last_name}
      </Link>
    );
  };

  const dateBodyTemplate = date => {
    const updateFormat = moment(new Date(date)).format('DD-MM-YYYY');
    return <span>{updateFormat}</span>;
  };

  const onPageChange = page => {
    if (page !== employeeCurrentPage) {
      let pageIndex = employeeCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setEmployeeCurrentPage(pageIndex));
      getEmployeeListApi(pageIndex, employeePageLimit, employeeSearchParam);
    }
  };

  const onPageRowsChange = useCallback(
    page => {
      dispatch(setEmployeeCurrentPage(page === 0 ? 0 : 1));
      dispatch(setEmployeePageLimit(page));
      const pageValue =
        page === 0
          ? employeeList?.totalRows
            ? employeeList?.totalRows
            : 0
          : page;
      const prevPageValue =
        employeePageLimit === 0
          ? employeeList?.totalRows
            ? employeeList?.totalRows
            : 0
          : employeePageLimit;
      if (
        prevPageValue < employeeList?.totalRows ||
        pageValue < employeeList?.totalRows
      ) {
        getEmployeeListApi(page === 0 ? 0 : 1, page, employeeSearchParam);
      }
    },
    [
      dispatch,
      employeeList?.totalRows,
      employeePageLimit,
      employeeSearchParam,
      getEmployeeListApi,
    ],
  );

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      employee_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteEmployee(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const handleSearchInput = e => {
    dispatch(setEmployeeCurrentPage(1));
    getEmployeeListApi(1, employeePageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {employeeLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Employee</h3>
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
                            value={employeeSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setEmployeeSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              dispatch(
                                setIsGetInitialValuesEmployee({
                                  ...isGetInitialValuesEmployee,
                                  add: false,
                                }),
                              );
                              dispatch(clearAddSelectedEmployeeData());
                              navigate('/create-employee');
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Employee
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper">
              <DataTable
                value={employeeList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="emp_no" header="Emp ID" sortable></Column>
                <Column
                  field="type"
                  header="Item Type"
                  sortable
                  body={ItemTypeBodyTemplate}
                ></Column>
                <Column
                  field="first_name"
                  header="Name"
                  sortable
                  body={nameBodyTemplate}
                ></Column>
                <Column field="email_id" header="Email" sortable></Column>
                <Column field="mobile_no" header="Mobile" sortable></Column>
                <Column
                  field="birth_date"
                  header="DOB"
                  sortable
                  body={e => dateBodyTemplate(e?.birth_date)}
                ></Column>
                <Column
                  field="joining_date"
                  header="DOJ"
                  sortable
                  body={e => dateBodyTemplate(e?.joining_date)}
                ></Column>
                <Column field="role.name" header="Role" sortable></Column>
                <Column
                  field="isActive"
                  header="Status"
                  sortable
                  body={statusBodyTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={employeeList?.list}
                pageLimit={employeePageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={employeeCurrentPage}
                totalCount={employeeList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'employee'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
