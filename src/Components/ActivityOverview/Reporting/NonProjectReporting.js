import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getEmployeeReportingList,
  setNonReportingCurrentPage,
  setNonReportingPageLimit,
} from 'Store/Reducers/ActivityOverview/AdminReportingFlow/AdminReportingSlice';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function NonProjectReporting() {
  const dispatch = useDispatch();
  const {
    getEmployeeReportingListData,
    nonReportingCurrentPage,
    nonReportingPageLimit,
  } = useSelector(({ adminReporting }) => adminReporting);

  const getReportingListFromAPI = useCallback(
    (start = 1, limit = 10, missing = true) => {
      dispatch(
        getEmployeeReportingList({
          start: start,
          limit: limit,
          missing: missing,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getReportingListFromAPI(nonReportingCurrentPage, nonReportingPageLimit);
  }, []);

  const employeesNameBodyTemplate = data => {
    return (
      <Link to={`/user-reporting/${data?._id}`} className="hover_text">
        {data?.employee_name}
      </Link>
    );
  };

  const statusBodyTemplate = product => {
    return <Tag value={'Missing'} severity={getSeverity('Pending')}></Tag>;
  };

  const getSeverity = product => {
    switch (product.status) {
      case 'Initial':
        return 'info';

      case 'In Progress':
        return 'primary';

      case 'Pending':
        return 'warning';

      case 'Cancelled':
        return 'danger';

      case 'Done':
        return 'success';

      default:
        return null;
    }
  };

  const onPageChange = page => {
    if (page !== nonReportingCurrentPage) {
      let pageIndex = nonReportingCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setNonReportingCurrentPage(pageIndex));

      getReportingListFromAPI(
        pageIndex,
        nonReportingPageLimit,
        nonReportingCurrentPage,
      );
    }
  };

  const onPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setNonReportingCurrentPage(updatedCurrentPage));
    dispatch(setNonReportingPageLimit(page));
    const pageValue =
      page === 0
        ? getEmployeeReportingListData?.totalRows
          ? getEmployeeReportingListData?.totalRows
          : 0
        : page;
    const prevPageValue =
      nonReportingPageLimit === 0
        ? getEmployeeReportingListData?.totalRows
          ? getEmployeeReportingListData?.totalRows
          : 0
        : nonReportingPageLimit;
    if (
      prevPageValue < getEmployeeReportingListData?.totalRows ||
      pageValue < getEmployeeReportingListData?.totalRows
    ) {
      getReportingListFromAPI(updatedCurrentPage, page);
    }
  };

  return (
    <div className="reportig_table_wrap">
      <h3 className="mb0 p20">Non Project Reporting</h3>
      <DataTable
        value={
          getEmployeeReportingListData?.list?.length
            ? getEmployeeReportingListData?.list
            : []
        }
        sortField="price"
        sortOrder={1}
        rows={10}
      >
        <Column
          field="employee_name"
          header="Employees Name"
          body={employeesNameBodyTemplate}
          sortable
        ></Column>
        <Column field="employee_id" header="Employees ID" sortable></Column>
        <Column field="role" header="Role" sortable></Column>

        <Column
          field="status"
          header="Status"
          sortable
          body={statusBodyTemplate}
        ></Column>
      </DataTable>
      <CustomPaginator
        dataList={getEmployeeReportingListData?.list || []}
        pageLimit={
          !getEmployeeReportingListData?.totalRows ||
          getEmployeeReportingListData?.totalRows === 0
            ? 0
            : nonReportingPageLimit
        }
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={
          !getEmployeeReportingListData?.totalRows ||
          getEmployeeReportingListData?.totalRows === 0
            ? 0
            : nonReportingCurrentPage
        }
        totalCount={getEmployeeReportingListData?.totalRows}
      />
    </div>
  );
}
