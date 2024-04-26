import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import PlusIcon from '../../../Assets/Images/plus.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';

export const ExpensesData = [
  {
    no: '1',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '2',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '3',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '4',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '5',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '6',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '7',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '8',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '9',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '10',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '11',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
  {
    no: '12',
    date: '10/07/2023',
    expense_no: '#310',
    expense_category: 'ABC Company',
    amount: '₹ 33,000',
    payment_type: 'Bank',
  },
];

export default function Expenses() {
  const [setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);
  const [date, setDate] = useState();

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

  const actionBodyTemplate = () => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="action_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <img src={EditIcon} alt="EditIcon" /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                // setDeleteId(id)
                setDeletePopup(true);
              }}
            >
              <img src={TrashIcon} alt="TrashIcon" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const ExpensenoTemplate = () => {
    return <Link to="/view-expenses">#301</Link>;
  };

  return (
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">Expenses</h3>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper">
                <ul className="expenses_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={date}
                        placeholder="Date Range"
                        showIcon
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        onChange={e => setDate(e.value)}
                      />
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
                  <li>
                    <Link className="btn_primary" to="/create-expenses">
                      <img src={PlusIcon} alt="" /> Create Expenses
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={ExpensesData}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="no" header="No." sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column
              field="expense_no"
              header="Expense No."
              sortable
              body={ExpensenoTemplate}
            ></Column>
            <Column
              field="expense_category"
              header="Expense Category"
              sortable
            ></Column>
            <Column field="amount" header="Amount" sortable></Column>
            <Column
              field="payment_type"
              header="Payment Type"
              sortable
            ></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={ExpensesData}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={ExpensesData?.length}
          />
        </div>
      </div>
    </div>
  );
}
