import React, { useState, useCallback, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompanyList,
  setCompanyCurrentPage,
  setCompanyPageLimit,
  setIsDeleteCompany,
  setCompanySearchParam,
  deleteCompany,
  setIsGetInitialValues,
  clearAddSelectedCompanyData,
  clearUpdateSelectedCompanyData,
} from 'Store/Reducers/Settings/CompanySetting/CompanySlice';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';
export const inquiryData = [
  {
    no: '1',
    company_name: 'Smile Films',
    business_type: 'Studio',
    director_name: 'Rupesh Zalavadiya',
    company_phone_no: '+91 9574470506',
    company_email: 'smilefilms2017@gmail.com',
    action: 'action',
  },
  {
    no: '2',
    company_name: 'ABC Films',
    business_type: 'Studio',
    director_name: 'Rupesh Zalavadiya',
    company_phone_no: '+91 9876543210',
    company_email: 'Abcfilms2017@gmail.com',
    action: 'action',
  },
];

export default function CompanyList({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    companyList,
    companyCurrentPage,
    companyPageLimit,
    isAddCompany,
    isUpdateCompany,
    isDeleteCompany,
    companySearchParam,
    companyLoading,
    isGetInitialValues,
  } = useSelector(({ company }) => company);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    dispatch(
      getCompanyList({
        start: companyCurrentPage,
        limit: companyPageLimit,
        isActive: '',
        search: companySearchParam,
      }),
    );
  }, [dispatch, companyCurrentPage, companyPageLimit]);

  useEffect(() => {
    if (isDeleteCompany) {
      dispatch(
        getCompanyList({
          start: companyCurrentPage,
          limit: companyPageLimit,
          isActive: '',
          search: companySearchParam,
        }),
      );
    }

    if (isDeleteCompany) {
      dispatch(setIsDeleteCompany(false));
    }
  }, [
    isAddCompany,
    isUpdateCompany,
    isDeleteCompany,
    dispatch,
    companyCurrentPage,
    companyPageLimit,
    companySearchParam,
  ]);

  const actionBodyTemplate = row => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="action_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInitialValues({
                      ...isGetInitialValues,
                      update: false,
                    }),
                  );
                  dispatch(clearUpdateSelectedCompanyData());
                  navigate(`/update-company/${row?._id}`);
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeleteId(row?._id);
                  setDeletePopup(true);
                }}
              >
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const onPageChange = page => {
    let pageIndex = companyCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setCompanyCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setCompanyCurrentPage(page === 0 ? 0 : 1));
    dispatch(setCompanyPageLimit(page));
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        company_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteCompany(deleteItemObj));
      }
      setDeletePopup(false);
    },
    [dispatch, deleteId],
  );

  const handleSearchInput = e => {
    dispatch(setCompanyCurrentPage(1));
    dispatch(
      getCompanyList({
        start: 1,
        limit: companyPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {companyLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2 justify-content-between">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Company</h3>
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
                            value={companySearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setCompanySearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            className="btn_primary"
                            onClick={() => {
                              dispatch(
                                setIsGetInitialValues({
                                  ...isGetInitialValues,
                                  add: false,
                                }),
                              );
                              dispatch(clearAddSelectedCompanyData());
                              navigate('/create-company');
                            }}
                          >
                            <img src={PlusIcon} alt="" /> Create Company
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
                value={companyList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="number" header="No" sortable></Column>
                <Column
                  field="company_name"
                  header="Company Name"
                  sortable
                ></Column>
                <Column
                  field="business_type"
                  header="Business Type"
                  sortable
                ></Column>
                <Column
                  field="director_name"
                  header="Director Name"
                  sortable
                ></Column>
                <Column
                  field="mobile_no"
                  header="Company Phone No"
                  sortable
                ></Column>
                <Column
                  field="email_id"
                  header="Company Email"
                  sortable
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={companyList?.list}
                pageLimit={companyPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={companyCurrentPage}
                totalCount={companyList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
