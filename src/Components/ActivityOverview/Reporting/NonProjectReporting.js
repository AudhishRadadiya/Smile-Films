import CustomPaginator from 'Components/Common/CustomPaginator';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const inquiryData = [
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    status: 'Done',
  },
];

export default function NonProjectReporting() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);

  const op = useRef(null);

  const employeesNameBodyTemplate = () => {
    return <Link to="/user-reporting">Kapil</Link>;
  };

  const statusBodyTemplate = product => {
    return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
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
    let pageIndex = currentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    setCurrentPage(pageIndex);
  };
  const onPageRowsChange = page => {
    setCurrentPage(page === 0 ? 0 : 1);
    setPageLimit(page);
  };
  return (
    <div className="reportig_table_wrap">
      <h3 className="mb0 p20">Non Project Reporting</h3>
      <DataTable value={inquiryData} sortField="price" sortOrder={1} rows={10}>
        <Column
          field="employeesName"
          header="Employees Name"
          body={employeesNameBodyTemplate}
          sortable
        ></Column>
        <Column field="employeesID" header="Employees ID" sortable></Column>
        <Column field="role" header="Role" sortable></Column>

        <Column
          field="status"
          header="Status"
          sortable
          body={statusBodyTemplate}
        ></Column>
      </DataTable>
      <CustomPaginator
        dataList={inquiryData}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
        totalCount={inquiryData?.length}
      />
    </div>
  );
}
