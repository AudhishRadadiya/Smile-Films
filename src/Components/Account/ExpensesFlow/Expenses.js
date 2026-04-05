import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  deleteExpenses,
  getExpensesList,
  setExpensesCurrentPage,
  setExpensesDate,
  setExpensesPageLimit,
  setExpensesSearchParam,
  setIsGetInitialValuesExpenses,
} from 'Store/Reducers/Account/Expenses/ExpensesSlice';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';

const Payment = [
  { label: 'Cash', value: 1 },
  { label: 'Bank', value: 2 },
  { label: 'Cheque', value: 3 },
];

export default function Expenses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    expensesList,
    expensesCurrentPage,
    expensesPageLimit,
    expensesSearchParam,
    expensesLoading,
    expensesDate,
    isGetInitialValuesExpenses,
  } = useSelector(({ expenses }) => expenses);

  const fetchRequiredData = useCallback(
    (start = 1, limit = 10, search = '', startDate = '', endDate = '') => {
      dispatch(
        getExpensesList({
          start: start,
          limit: limit,
          search: search?.trim(),
          start_date: startDate,
          end_date: endDate,
        }),
      );
    },
    [dispatch, expensesCurrentPage, expensesPageLimit, expensesSearchParam],
  );

  useEffect(() => {
    const startDate =
      expensesDate?.length && expensesDate[0]
        ? moment(expensesDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      expensesDate?.length && expensesDate[1]
        ? moment(expensesDate[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(
      expensesCurrentPage,
      expensesPageLimit,
      expensesSearchParam,
      startDate,
      endDate,
    );
  }, []);

  const getPaymentLabel = value => {
    const payment = Payment.find(item => item.value === value);
    return payment ? payment.label : '';
  };

  const PaymentTypeTemplate = data => {
    return getPaymentLabel(data.payment_type);
  };

  const actionBodyTemplate = data => {
    return (
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle id="dropdown-basic" className="action_btn">
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       <Dropdown.Item
      //         onClick={() => {
      //           dispatch(
      //             setIsGetInitialValuesExpenses({
      //               ...isGetInitialValuesExpenses,
      //               update: false,
      //             }),
      //           );
      //           navigate(`/edit-expenses/${data?._id}`);
      //         }}
      //       >
      //         <img src={EditIcon} alt="EditIcon" /> Edit
      //       </Dropdown.Item>
      //       <Dropdown.Item
      //         onClick={() => {
      //           setDeleteId(data?._id);
      //           setDeletePopup(true);
      //         }}
      //       >
      //         <img src={TrashIcon} alt="TrashIcon" /> Delete
      //       </Dropdown.Item>
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            dispatch(
              setIsGetInitialValuesExpenses({
                ...isGetInitialValuesExpenses,
                update: false,
              }),
            );
            navigate(`/edit-expenses/${data?._id}`);
          }}
        />
        <img
          src={TrashIcon}
          alt=""
          className="cursor_pointer"
          onClick={() => {
            setDeleteId(data?._id);
            setDeletePopup(true);
          }}
        />
      </div>
    );
  };

  const ExpensesTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          dispatch(
            setIsGetInitialValuesExpenses({
              ...isGetInitialValuesExpenses,
              view: false,
            }),
          );
          navigate(`/view-expenses/${rowData?._id}`, {
            state: { iseView: true },
          });
        }}
      >
        {rowData?.expense_no}
      </div>
    );
  };

  const ExpensesDateTemplate = data => {
    return moment(data?.expense_date)?.format('DD-MM-YYYY');
  };

  const onPageChange = page => {
    if (page !== expensesCurrentPage) {
      let pageIndex = expensesCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setExpensesCurrentPage(pageIndex));

      const startDate =
        expensesDate?.length && expensesDate[0]
          ? moment(expensesDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        expensesDate?.length && expensesDate[1]
          ? moment(expensesDate[1])?.format('YYYY-MM-DD')
          : '';

      fetchRequiredData(
        pageIndex,
        expensesPageLimit,
        expensesSearchParam,
        startDate,
        endDate,
      );
      // dispatch(
      //   getExpensesList({
      //     start: pageIndex,
      //     limit: expensesPageLimit,
      //     search: expensesSearchParam,
      //     start_date: startDate,
      //     end_date: endDate,
      //   }),
      // );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setExpensesCurrentPage(page === 0 ? 0 : 1));
    dispatch(setExpensesPageLimit(page));
    const pageValue =
      page === 0
        ? expensesList?.totalRows
          ? expensesList?.totalRows
          : 0
        : page;
    const prevPageValue =
      expensesPageLimit === 0
        ? expensesList?.totalRows
          ? expensesList?.totalRows
          : 0
        : expensesPageLimit;

    if (
      prevPageValue < expensesList?.totalRows ||
      pageValue < expensesList?.totalRows
    ) {
      const startDate =
        expensesDate?.length && expensesDate[0]
          ? moment(expensesDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        expensesDate?.length && expensesDate[1]
          ? moment(expensesDate[1])?.format('YYYY-MM-DD')
          : '';

      // dispatch(
      //   getExpensesList({
      //     start: page === 0 ? 0 : 1,
      //     limit: page,
      //     search: expensesSearchParam,
      //     start_date: startDate,
      //     end_date: endDate,
      //   }),
      // );
      fetchRequiredData(
        page === 0 ? 0 : 1,
        page,
        expensesSearchParam,
        startDate,
        endDate,
      );
    }
  };

  const handleExpensesDate = useCallback(
    e => {
      dispatch(setExpensesDate(e?.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setExpensesCurrentPage(1));
        const startDate =
          e?.value?.length && e?.value[0]
            ? moment(e?.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e?.value?.length && e?.value[1]
            ? moment(e?.value[1])?.format('YYYY-MM-DD')
            : '';

        // dispatch(
        //   getExpensesList({
        //     start: 1,
        //     limit: expensesPageLimit,
        //     search: expensesSearchParam,
        //     start_date: startDate,
        //     end_date: endDate,
        //   }),
        // );

        fetchRequiredData(
          1,
          expensesPageLimit,
          expensesSearchParam,
          startDate,
          endDate,
        );
      }
    },
    [dispatch, expensesPageLimit, expensesSearchParam],
  );

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        expense_id: deleteId,
      };

      const startDate =
        expensesDate?.length && expensesDate[0]
          ? moment(expensesDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        expensesDate?.length && expensesDate[1]
          ? moment(expensesDate[1])?.format('YYYY-MM-DD')
          : '';

      if (deleteId) {
        dispatch(deleteExpenses(deleteItemObj))
          .then(response => {
            // dispatch(
            //   getExpensesList({
            //     start: expensesCurrentPage,
            //     limit: expensesPageLimit,
            //     search: expensesSearchParam,
            //     start_date: startDate,
            //     end_date: endDate,
            //   }),
            // );
            fetchRequiredData(
              expensesCurrentPage,
              expensesPageLimit,
              expensesSearchParam,
              startDate,
              endDate,
            );
          })
          .catch(error => {
            console.error('Error fetching delete data:', error);
          });
      }
      setDeletePopup(false);
    },
    [
      deleteId,
      dispatch,
      expensesDate,
      expensesPageLimit,
      expensesCurrentPage,
      expensesSearchParam,
    ],
  );

  const handleSearchInput = (e, pageLimit, expenseDate) => {
    dispatch(setExpensesCurrentPage(1));

    const startDate =
      expenseDate?.length && expenseDate[0]
        ? moment(expenseDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      expenseDate?.length && expenseDate[1]
        ? moment(expenseDate[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(1, pageLimit, e.target.value?.trim(), startDate, endDate);

    // dispatch(
    //   getExpensesList({
    //     start: 1,
    //     limit: pageLimit,
    //     search: e.target.value?.trim(),
    //     start_date: startDate,
    //     end_date: endDate,
    //   }),
    // );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {expensesLoading && <Loader />}
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
                        value={expensesDate}
                        placeholder="Select Date Range"
                        onChange={e => {
                          handleExpensesDate(e);
                        }}
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
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
                        value={expensesSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            expensesPageLimit,
                            expensesDate,
                          );
                          dispatch(setExpensesSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => {
                        dispatch(
                          setIsGetInitialValuesExpenses({
                            ...isGetInitialValuesExpenses,
                            add: false,
                          }),
                        );
                        navigate('/create-expenses');
                      }}
                      className="btn_primary"
                    >
                      <img src={PlusIcon} alt="" /> Create Expenses
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={expensesList ? expensesList?.list : []}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="expense_no"
              header="Expense No."
              sortable
              body={ExpensesTemplate}
            ></Column>
            <Column
              field="expense_date"
              header="Create Date"
              body={ExpensesDateTemplate}
              sortable
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
              body={PaymentTypeTemplate}
              sortable
            ></Column>
            <Column
              field="action"
              header="Action"
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={expensesList?.list}
            pageLimit={expensesPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={expensesCurrentPage}
            totalCount={expensesList?.totalRows}
          />
          <ConfirmDeletePopup
            deletePopup={deletePopup}
            deleteId={deleteId}
            handleDelete={handleDelete}
            setDeletePopup={setDeletePopup}
          />
        </div>
      </div>
    </div>
  );
}
