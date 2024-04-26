import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Checkbox } from 'primereact/checkbox';

export const DeletedHistoryData = [
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
  {
    order_no: '#56123',
    create_date: '15/06/2023',
    company_name: 'ABC Company',
    client_name: 'Rajesh Singhania',
    inquiry_type: 'Editing',
    item_Names: 'Wedding',
    confirm_by: 'Wedding',
    deleting_date: 'In Progress',
    describe: 'Individuals Family Person Photos... ',
  },
];

export default function DeletedHistory() {
  const [pageLimit, setPageLimit] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);

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
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={4}>
              <div className="page_title">
                <h3 className="m-0">Deleted History</h3>
              </div>
            </Col>
            <Col md={8}>
              <div className="right_filter_wrapper">
                <ul className="deleted_ul">
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setChecked(e.checked)}
                          checked={checked}
                        ></Checkbox>
                      </div>
                      <span>Show Completed Project</span>
                    </div>
                  </li>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={DeletedHistoryData}
            selectionMode={rowClick ? null : 'checkbox'}
            selection={selectedProducts}
            onSelectionChange={e => setSelectedProducts(e.value)}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column field="order_no" header="Order No." sortable></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              sortable
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column
              field="inquiry_type"
              header="Inquiry Type"
              sortable
            ></Column>
            <Column field="item_Names" header="Item Names" sortable></Column>
            <Column field="confirm_by" header="Confirm By" sortable></Column>
            <Column
              field="deleting_date"
              header="Deleting Date"
              sortable
            ></Column>
            <Column
              field="describe"
              header="Describe"
              sortable
              className="with_concate"
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={DeletedHistory}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={DeletedHistory?.length}
          />
        </div>
      </div>
    </div>
  );
}
