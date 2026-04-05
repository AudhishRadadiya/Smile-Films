import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpensesDetails from './ExpensesDetails';
import {
  getExpenseView,
  setIsGetInitialValuesExpenses,
  setUpdateExpensesData,
} from 'Store/Reducers/Account/Expenses/ExpensesSlice';
import { generateUniqueId } from 'Helper/CommonHelper';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

export default function EditExpense() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { expensesInitial, isGetInitialValuesExpenses, updateExpensesData } =
    useSelector(({ expenses }) => expenses);

  const handleUpdateExpensesData = async () => {
    let updatedExpensesDetails = {};
    let categoriesData = [];
    let backAccountData = [];

    dispatch(
      setIsGetInitialValuesExpenses({
        ...isGetInitialValuesExpenses,
        update: true,
      }),
    );

    const response = await dispatch(
      getExpenseView({
        expense_id: id,
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

    accountsResponse?.payload?.data?.list?.map(item => {
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

      const updatedData = {
        ...expensesDetails,
        expense_date: expensesDetails?.expense_date
          ? new Date(expensesDetails?.expense_date?.split('T')[0])
          : '',
        expenses_items: updatedExpensesItems,
        sub_total: calculateTotalAmount,
      };

      updatedExpensesDetails = updatedData;
    }

    const expensesData = {
      ...expensesInitial,
      ...updatedExpensesDetails,
      bank_account_options: backAccountData,
      expense_category_options: categoriesData,
    };

    setInitialData(expensesData);
    dispatch(setUpdateExpensesData(expensesData));
  };

  useEffect(() => {
    if (isGetInitialValuesExpenses?.update === true) {
      setInitialData(updateExpensesData);
    } else {
      handleUpdateExpensesData();
    }
  }, []);

  return (
    <>
      <ExpensesDetails initialValues={initialData} isEdit={true} />
    </>
  );
}
