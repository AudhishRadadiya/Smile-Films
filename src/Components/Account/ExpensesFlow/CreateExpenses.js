import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExpensesDetails from './ExpensesDetails';
import {
  getExpensesNumber,
  setAddExpensesData,
  setIsGetInitialValuesExpenses,
} from 'Store/Reducers/Account/Expenses/ExpensesSlice';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

export default function RecordExpenses() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { expensesInitial, isGetInitialValuesExpenses, addExpensesData } =
    useSelector(({ expenses }) => expenses);

  const handleAddExpensesData = () => {
    dispatch(
      setIsGetInitialValuesExpenses({
        ...isGetInitialValuesExpenses,
        add: true,
      }),
    );

    dispatch(getExpensesNumber())
      .then(res => {
        const expenseNumber = res?.payload;
        return { expenseNumber };
      })
      .then(({ expenseNumber }) => {
        dispatch(
          getAccountList({
            start: 1,
            limit: 10,
            isActive: '',
            search: '',
            group_type: 'Expense Account',
          }),
        ).then(response => {
          const expenseCategories = response?.payload;

          dispatch(
            getAccountList({
              start: 1,
              limit: 10,
              isActive: '',
              search: '',
              group_type: 'Bank Accounts',
            }),
          ).then(response => {
            const bankAccounts = response?.payload;
            let updatedCategories = [];
            let updatedBankAccounts = [];

            expenseCategories?.data?.list?.map(item => {
              const updatedCategoriesList = item?.accounts?.map(account => {
                return {
                  value: account?._id,
                  label: account?.account_name,
                };
              });
              updatedCategories = updatedCategoriesList;
            });

            bankAccounts?.data?.list?.map(item => {
              const updatedBankAccountslist = item?.accounts?.map(account => {
                return {
                  value: account?._id,
                  label: account?.account_name,
                };
              });
              updatedBankAccounts = updatedBankAccountslist;
            });

            const updatedData = {
              ...expensesInitial,
              expense_no: expenseNumber?.data,
              bank_account_options: updatedBankAccounts,
              expense_category_options: updatedCategories,
            };

            setInitialData(updatedData);
            dispatch(setAddExpensesData(updatedData));

            return { expenseNumber, expenseCategories, bankAccounts };
          });
        });
      })
      .catch(error => console.error('error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesExpenses?.add === true) {
      setInitialData(addExpensesData);
    } else {
      handleAddExpensesData();
    }
  }, []);

  return (
    <>
      <ExpensesDetails initialValues={initialData} isEdit={false} />
    </>
  );
}
