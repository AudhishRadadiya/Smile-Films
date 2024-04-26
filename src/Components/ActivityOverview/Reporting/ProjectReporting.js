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
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
  {
    employeesName: 'Kapil',
    employeesID: '11',
    role: 'Designer',
    reportingDate: '23/06/2023',
    orderNo: '#564892',
    itemName: 'Wedding Package, Reel, Teaser',
    workingHours: '15:30:00',
    createDateTime: '08/05/2006 | 03:05:15 PM',
    status: 'Done',
  },
];

export default function ProjectReporting() {
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
      <h3 className="mb0 p20">Project Reporting</h3>
      <DataTable value={inquiryData} sortField="price" sortOrder={1} rows={10}>
        <Column
          field="employeesName"
          header="Employees Name"
          body={employeesNameBodyTemplate}
          sortable
        ></Column>
        <Column field="employeesID" header="Employees ID" sortable></Column>
        <Column field="role" header="Role" sortable></Column>
        <Column field="reportingDate" header="Reporting Date" sortable></Column>
        <Column field="orderNo" header="Order No" sortable></Column>
        <Column field="itemName" header="Item Name" sortable></Column>
        <Column
          field="workingHours"
          header="Working Hours"
          sortable
          className="with_concate"
        ></Column>
        <Column
          field="createDateTime"
          header="Create Date & Time "
          sortable
        ></Column>
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
