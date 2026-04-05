import React, { useEffect, useState, useCallback } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
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
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import {
  deleteRoles,
  getRoleList,
  setRoleCurrentPage,
  setRolePageLimit,
  seIsDeleteRole,
  setRoleSearchParam,
} from 'Store/Reducers/Settings/Master/RolesAndPermissionSlice';

export default function RolePermission({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    roleList,
    roleLoading,
    isDeleteRole,
    rolePageLimit,
    roleCurrentPage,
    roleSearchParam,
  } = useSelector(({ rolePermission }) => rolePermission);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const getRoleListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getRoleList({
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
    getRoleListApi(roleCurrentPage, rolePageLimit, roleSearchParam);
  }, []);

  useEffect(() => {
    if (isDeleteRole) {
      getRoleListApi(roleCurrentPage, rolePageLimit, roleSearchParam);
      dispatch(seIsDeleteRole(false));
    }
  }, [isDeleteRole]);

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
      //       {' '}
      //       {is_edit_access && (
      //         <Dropdown.Item
      //           onClick={() => navigate(`/edit-role-permission/${row?._id}`)}
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
            onClick={() => navigate(`/edit-role-permission/${row?._id}`)}
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

  const onPageChange = page => {
    if (page !== roleCurrentPage) {
      let pageIndex = roleCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setRoleCurrentPage(pageIndex));
      getRoleListApi(pageIndex, rolePageLimit, roleSearchParam);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setRoleCurrentPage(page === 0 ? 0 : 1));
    dispatch(setRolePageLimit(page));
    const pageValue =
      page === 0 ? (roleList?.totalRows ? roleList?.totalRows : 0) : page;
    const prevPageValue =
      rolePageLimit === 0
        ? roleList?.totalRows
          ? roleList?.totalRows
          : 0
        : rolePageLimit;
    if (
      prevPageValue < roleList?.totalRows ||
      pageValue < roleList?.totalRows
    ) {
      getRoleListApi(page === 0 ? 0 : 1, page, roleSearchParam);
    }
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      role_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteRoles(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const handleSearchInput = e => {
    dispatch(setRoleCurrentPage(1));
    getRoleListApi(1, rolePageLimit, e.target.value);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {roleLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col md={3}>
                  <div className="page_title">
                    <h3 className="m-0">Role & Permission</h3>
                  </div>
                </Col>
                <Col md={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={roleSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setRoleSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Link
                            to="/add-role-permission"
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Add Roll & Permission
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper client_company_wrap">
              <DataTable
                value={roleList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="name" header="Role" sortable></Column>
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
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={roleList?.list}
                pageLimit={rolePageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={roleCurrentPage}
                totalCount={roleList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'role & permission'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
