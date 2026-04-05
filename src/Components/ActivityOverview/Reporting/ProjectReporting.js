import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getEmployeeReportingList,
  setReportingCurrentPage,
  setReportingPageLimit,
} from 'Store/Reducers/ActivityOverview/AdminReportingFlow/AdminReportingSlice';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

export default function ProjectReporting() {
  const dispatch = useDispatch();
  const {
    getEmployeeReportingListData,
    reportingCurrentPage,
    reportingPageLimit,
  } = useSelector(({ adminReporting }) => adminReporting);

  const getReportingListFromAPI = useCallback(
    (start = 1, limit = 10, missing = false) => {
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
    getReportingListFromAPI(reportingCurrentPage, reportingPageLimit);
  }, []);

  const employeesNameBodyTemplate = data => {
    return (
      <Link to={`/user-reporting/${data?._id}`} className="hover_text">
        {data?.employee_name}
      </Link>
    );
  };

  const statusBodyTemplate = product => {
    return <Tag value={'Done'} severity={getSeverity('Done')}></Tag>;
  };

  const createDateBodyTemplate = data => {
    const createdDate = moment(data?.create_date).format('DD-MM-YYYY');

    const convertToLocalTime = utcString => {
      const date = new Date(utcString);
      const options = { hour: '2-digit', minute: '2-digit' };
      const localTime = date.toLocaleTimeString([], options);
      return localTime;
    };

    const utcString = data?.create_date;
    const localTime = convertToLocalTime(utcString);

    return (
      <>
        {createdDate} | {localTime}
      </>
    );
  };

  const reportingDateBodyTemplate = data => {
    return <>{moment(data.reporting_date).format('DD-MM-YYYY')}</>;
  };

  const workingHoursTemplate = data => {
    return data?.working_hours?.slice(0, -3);
  };

  const getSeverity = product => {
    switch (product) {
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
    if (page !== reportingCurrentPage) {
      let pageIndex = reportingCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setReportingCurrentPage(pageIndex));

      getReportingListFromAPI(pageIndex, reportingPageLimit);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setReportingCurrentPage(page === 0 ? 0 : 1));
    dispatch(setReportingPageLimit(page));
    const pageValue =
      page === 0
        ? getEmployeeReportingListData?.totalRows
          ? getEmployeeReportingListData?.totalRows
          : 0
        : page;
    const prevPageValue =
      reportingPageLimit === 0
        ? getEmployeeReportingListData?.totalRows
          ? getEmployeeReportingListData?.totalRows
          : 0
        : reportingPageLimit;
    if (
      prevPageValue < getEmployeeReportingListData?.totalRows ||
      pageValue < getEmployeeReportingListData?.totalRows
    ) {
      getReportingListFromAPI(page === 0 ? 0 : 1, page);
    }
  };

  return (
    <div className="reportig_table_wrap">
      <h3 className="mb0 p20">Project Reporting</h3>
      <DataTable
        value={
          getEmployeeReportingListData &&
          getEmployeeReportingListData?.list?.length > 0
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
          field="reporting_date"
          header="Reporting Date"
          body={reportingDateBodyTemplate}
          sortable
        ></Column>
        <Column field="order_no" header="Order No" sortable></Column>
        <Column field="item_name" header="Item Name" sortable></Column>
        <Column
          field="working_hours"
          header="Working Hours"
          sortable
          className="with_concate"
          body={workingHoursTemplate}
        ></Column>
        <Column
          field="create_date"
          header="Create Date & Time"
          sortable
          body={createDateBodyTemplate}
        ></Column>
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
            : reportingPageLimit
        }
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={
          !getEmployeeReportingListData?.totalRows ||
          getEmployeeReportingListData?.totalRows === 0
            ? 0
            : reportingCurrentPage
        }
        totalCount={getEmployeeReportingListData?.totalRows}
      />
    </div>
  );
}
