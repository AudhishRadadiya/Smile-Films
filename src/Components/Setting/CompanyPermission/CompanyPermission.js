import { useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanySidebar from '../CompanySidebar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import EditIcon from '../../../Assets/Images/edit.svg';
import { Tag } from 'primereact/tag';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import {
  getCompanyPermissionList,
  setCompanyCurrentPage,
  setCompanyPageLimit,
  setCompanySearchParam,
} from 'Store/Reducers/Settings/CompanySetting/CompanyAndPermissionSlice';

export default function CompanyPermission({ hasAccess }) {
  const { is_edit_access } = hasAccess;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    companyPermissionList,
    companyPermissionLoading,
    companyPageLimit,
    companyCurrentPage,
    companySearchParam,
  } = useSelector(({ companyPermission }) => companyPermission);

  const getCompanyListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getCompanyPermissionList({
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
    getCompanyListApi(companyCurrentPage, companyPageLimit, companySearchParam);
  }, []);

  const actionBodyTemplate = row => {
    return (
      <div className="d-flex gap-3">
        {is_edit_access && (
          <img
            alt="Edit"
            src={EditIcon}
            className="cursor_pointer"
            onClick={() => navigate(`/edit-company-permission/${row?._id}`)}
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
    if (page !== companyCurrentPage) {
      let pageIndex = companyCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setCompanyCurrentPage(pageIndex));
      getCompanyListApi(pageIndex, companyPageLimit, companySearchParam);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setCompanyCurrentPage(page === 0 ? 0 : 1));
    dispatch(setCompanyPageLimit(page));
    const pageValue =
      page === 0
        ? companyPermissionList?.totalRows
          ? companyPermissionList?.totalRows
          : 0
        : page;
    const prevPageValue =
      companyPageLimit === 0
        ? companyPermissionList?.totalRows
          ? companyPermissionList?.totalRows
          : 0
        : companyPageLimit;
    if (
      prevPageValue < companyPermissionList?.totalRows ||
      pageValue < companyPermissionList?.totalRows
    ) {
      getCompanyListApi(page === 0 ? 0 : 1, page, companySearchParam);
    }
  };

  const handleSearchInput = e => {
    dispatch(setCompanyCurrentPage(1));
    getCompanyListApi(1, companyPageLimit, e.target.value);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {companyPermissionLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col md={3}>
                  <div className="page_title">
                    <h3 className="m-0">Company & Permission</h3>
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
                            value={companySearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setCompanySearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper client_company_wrap">
              <DataTable
                value={companyPermissionList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="company_name" header="Company" sortable></Column>
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
                  style={{ width: '9%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={companyPermissionList?.list}
                pageLimit={companyPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={companyCurrentPage}
                totalCount={companyPermissionList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
