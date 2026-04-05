import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getExpenseView,
  setIsGetInitialValuesExpenses,
  setViewExpensesData,
} from 'Store/Reducers/Account/Expenses/ExpensesSlice';
import ExpensesDetails from './ExpensesDetails';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { generateUniqueId } from 'Helper/CommonHelper';

export default function ViewExpense() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesExpenses, viewExpensesData } = useSelector(
    ({ expenses }) => expenses,
  );

  const handleExpensesDetails = async () => {
    const response = await dispatch(
      getExpenseView({
        expense_id: id,
      }),
    );

    if (response?.payload?.data) {
      const expensesDetails = response?.payload?.data;

      const updatedExpensesItems = expensesDetails?.expenseItem?.map(item => {
        return {
          ...item,
          unique_id: generateUniqueId(),
        };
      });

      const calculateTotalAmount = expensesDetails?.expenseItem?.reduce(
        (acc, curr) => acc + curr?.amount_paid,
        0,
      );

      return {
        ...expensesDetails,
        expense_date: expensesDetails?.expense_date
          ? new Date(expensesDetails?.expense_date?.split('T')[0])
          : '',
        expenses_items: updatedExpensesItems,
        sub_total: calculateTotalAmount,
      };
    }
  };

  const handleUpdatePurchaseInvoice = async () => {
    let categoriesData = [];
    let backAccountData = [];

    dispatch(
      setIsGetInitialValuesExpenses({
        ...isGetInitialValuesExpenses,
        view: true,
      }),
    );

    const accountsResponse = await dispatch(
      getAccountList({
        start: 1,
        limit: 10,
        isActive: '',
        search: '',
        group_type: '',
      }),
    );

    const accountsData = accountsResponse?.payload?.data?.list;

    if (accountsData?.length) {
      accountsData?.map(item => {
        if (item?.groupName === 'Bank Accounts') {
          backAccountData =
            item?.accounts?.length &&
            item?.accounts?.map(account => {
              return {
                label: account?.account_name,
                value: account?._id,
              };
            });
        }

        if (item?.groupName === 'Expense Account') {
          categoriesData =
            item?.accounts?.length &&
            item?.accounts?.map(account => {
              return {
                label: account?.account_name,
                value: account?._id,
              };
            });
        }
      });
    }

    const updatedExpensesDetails = await handleExpensesDetails();

    const expensesData = {
      ...updatedExpensesDetails,
      bank_account_options: backAccountData,
      expense_category_options: categoriesData,
    };

    setInitialData(expensesData);
    dispatch(setViewExpensesData(expensesData));
  };

  const handleAddReceiptPaymentData = async () => {
    if (isGetInitialValuesExpenses?.view === true) {
      const updatedExpensesDetails = await handleExpensesDetails();

      const expensesData = {
        ...viewExpensesData,
        ...updatedExpensesDetails,
      };
      setInitialData(expensesData);
      dispatch(setViewExpensesData(expensesData));
    } else {
      handleUpdatePurchaseInvoice();
    }
  };

  useEffect(() => {
    handleAddReceiptPaymentData();
  }, []);

  return <ExpensesDetails initialValues={initialData} />;
}

// export default function ViewExpense() {
//   const { expensesList, expensesDetailLoading } = useSelector(
//     ({ expenses }) => expenses,
//   );
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const getPaymentTypeLabel = value => {
//     switch (value) {
//       case 1:
//         return 'Cash';
//       case 2:
//         return 'Bank';
//       case 3:
//         return 'Cheque';
//       default:
//         return '';
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       dispatch(getExpenseView({ expense_id: id }));
//     }
//   }, [id, dispatch]);

//   return (
//     <div className="main_Wrapper">
//       {expensesDetailLoading && <Loader />}
//       <div className="bg-white radius15 border h-100">
//         <div className="billing_heading">
//           <Row className="align-items-center g-2">
//             <Col sm={4}>
//               <div class="page_title">
//                 <h3 class="m-0">Expense</h3>
//               </div>
//             </Col>
//           </Row>
//         </div>
//         <div className="p20 p10-sm border-bottom">
//           <div className="client_pyment_wrapper">
//             <Row>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5>Payment No</h5>
//                   <h4>{expensesList?.expense_no}</h4>
//                 </div>
//               </Col>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5>Create Date</h5>
//                   <h4>
//                     {moment(expensesList?.expense_date).format('YYYY-MM-DD')}
//                   </h4>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <div className="client_pyment_details">
//             <Row className="g-3">
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Expense Category</h5>
//                   <h5>{expensesList?.expense_category_name}</h5>
//                 </div>
//               </Col>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Payment Type</h5>
//                   <h5>{getPaymentTypeLabel(expensesList?.payment_type)}</h5>
//                   {/* <h5>{expensesList?.payment_type}</h5> */}
//                 </div>
//               </Col>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Payment Out From</h5>

//                   <h5>{expensesList?.payment_out_from_name}</h5>
//                 </div>
//               </Col>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Amount</h5>
//                   <h5>{expensesList?.amount}</h5>
//                 </div>
//               </Col>
//               <Col lg={2} md={3} sm={4} className="col-6">
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Remark</h5>
//                   <h5>{expensesList?.remark}</h5>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//         <div className="billing_heading">
//           <Row className="justify-content-between align-items-center g-2">
//             <Col lg={4} md={5}>
//               <div className="Receipt_Payment_head_wrapper">
//                 <div className="Receipt_Payment_head_txt">
//                   <h3 className="m-0">Add Expense Items</h3>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>
//         <div className="data_table_wrapper max_height">
//           <DataTable
//             value={expensesList?.expenseItem ? expensesList?.expenseItem : []}
//             sortField="price"
//             sortOrder={1}
//             rows={10}
//           >
//             <Column field="item_name" header="Item Name" sortable></Column>
//             <Column field="quantity" header="Quantity" sortable></Column>
//             <Column field="rate" header="Rate" sortable></Column>
//             <Column field="amount_paid" header="Amount Paid" sortable></Column>
//           </DataTable>
//         </div>
//         <div class="title_right_wrapper">
//           <ul class="justify-content-end">
//             <li>
//               <button
//                 class="p-button p-component btn_border_dark filter_btn"
//                 data-pc-name="button"
//                 data-pc-section="root"
//               >
//                 Exit Page
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
