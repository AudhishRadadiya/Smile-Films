import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  expensesLoading: false,
  expensesNoLoading: false,
  addExpensesLoading: false,
  editExpensesLoading: false,
  expensesDetailLoading: false,
  expensesPageLimit: 10,
  expensesCurrentPage: 1,
  expensesSearchParam: '',

  expensesNumber: null,
  expensesList: {},
  expensesDate: '',

  isGetInitialValuesExpenses: {
    add: false,
    update: false,
    view: false,
  },
  addExpensesData: {},
  viewExpensesData: {},
  updateExpensesData: {},
  expensesInitial: {
    expense_no: '',
    expense_date: new Date(),
    expense_category_options: [],
    expense_category: '',
    payment_type: '',
    bank_account_options: [],
    payment_out_from: '',
    amount: '',
    remark: '',
    expenses_items: [],
  },
};

/**
 * @desc Expense - list-expense :
 */

export const getExpensesList = createAsyncThunk(
  'account/expense/list-expense',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/list-expense', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const newObj = {
            list: data?.list ? data?.list : [],
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
          };

          if (err === 0) {
            resolve({ data: newObj });
          } else {
            toast.error(msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

/**
 * @desc Expense - expense-no :
 */

export const getExpensesNumber = createAsyncThunk(
  'account/expense/expense-no',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/expense-no', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

/**
 * @desc Expense - add details :
 */

export const addExpenses = createAsyncThunk(
  'account/expense/add-expense',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/add-expense', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

/**
 * @desc Expense - delete :
 */

export const deleteExpenses = createAsyncThunk(
  'account/expense/delete-expense',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/delete-expense', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

/**
 * @desc Expense - edit page :
 */

export const editExpenses = createAsyncThunk(
  'account/expense/edit-expense',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/edit-expense', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

/**
 * @desc Expense - get details :
 */

export const getExpenseView = createAsyncThunk(
  'account/expense/get-expense-details',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/expense/get-expense-details', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

const ExpensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpensesSearchParam: (state, action) => {
      state.expensesSearchParam = action.payload;
    },
    setExpensesPageLimit: (state, action) => {
      state.expensesPageLimit = action.payload;
    },
    setExpensesCurrentPage: (state, action) => {
      state.expensesCurrentPage = action.payload;
    },
    setIsGetInitialValuesExpenses: (state, action) => {
      state.isGetInitialValuesExpenses = action.payload;
    },
    setAddExpensesData: (state, action) => {
      state.addExpensesData = action.payload;
    },
    setClearAddExpensesData: state => {
      state.addExpensesData = initialState.expensesInitial;
    },
    setUpdateExpensesData: (state, action) => {
      state.updateExpensesData = action.payload;
    },
    setClearUpdateExpensesData: state => {
      state.updateExpensesData = initialState.expensesInitial;
    },
    setViewExpensesData: (state, action) => {
      state.viewExpensesData = action.payload;
    },
    setClearViewEditExpensesData: state => {
      state.viewExpensesData = initialState.expensesInitial;
    },
    setExpensesDate: (state, action) => {
      state.expensesDate = action.payload;
    },
  },
  extraReducers: {
    [getExpensesList.pending]: state => {
      // state.expensesList = {};
      state.expensesLoading = true;
    },
    [getExpensesList.rejected]: state => {
      state.expensesList = {};
      state.expensesLoading = false;
    },
    [getExpensesList.fulfilled]: (state, action) => {
      state.expensesList = action.payload?.data;
      state.expensesLoading = false;
    },
    [getExpensesNumber.pending]: state => {
      // state.expensesNumber = null;
      state.expensesNoLoading = true;
    },
    [getExpensesNumber.rejected]: state => {
      state.expensesNumber = null;
      state.expensesNoLoading = false;
    },
    [getExpensesNumber.fulfilled]: (state, action) => {
      state.expensesNumber = action.payload?.data;
      state.expensesNoLoading = false;
    },
    [addExpenses.pending]: state => {
      state.addExpensesLoading = true;
    },
    [addExpenses.rejected]: state => {
      state.expensesList = {};
      state.addExpensesLoading = false;
    },
    [addExpenses.fulfilled]: (state, action) => {
      // state.isAddEditExpensesSuccess = true;
      state.expensesList = action.payload?.data;
      state.addExpensesLoading = false;
    },
    [deleteExpenses.pending]: state => {
      state.expensesLoading = true;
    },
    [deleteExpenses.rejected]: state => {
      state.expensesList = {};
      state.expensesLoading = false;
    },
    [deleteExpenses.fulfilled]: (state, action) => {
      // state.isDeleteExpenses = true;
      state.expensesList = action.payload?.data;
      state.expensesLoading = false;
    },
    [editExpenses.pending]: state => {
      state.expensesLoading = true;
    },
    [editExpenses.rejected]: state => {
      state.expensesList = {};
      state.expensesLoading = false;
    },
    [editExpenses.fulfilled]: (state, action) => {
      // state.isAddEditExpensesSuccess = true;
      state.expensesList = action.payload?.data;
      state.editExpensesLoading = false;
    },
    [getExpenseView.pending]: state => {
      state.expensesDetailLoading = true;
    },
    [getExpenseView.rejected]: state => {
      state.expensesList = {};
      state.expensesDetailLoading = false;
    },
    [getExpenseView.fulfilled]: (state, action) => {
      state.expensesList = action.payload?.data;
      state.expensesDetailLoading = false;
    },
  },
});

export const {
  setExpensesPageLimit,
  setExpensesCurrentPage,
  setExpensesSearchParam,
  setExpensesDate,
  setIsGetInitialValuesExpenses,
  setAddExpensesData,
  setClearAddExpensesData,
  setUpdateExpensesData,
  setClearUpdateExpensesData,
  setViewExpensesData,
  setClearViewEditExpensesData,
} = ExpensesSlice.actions;

export default ExpensesSlice.reducer;
