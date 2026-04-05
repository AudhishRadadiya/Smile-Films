import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  assignedWorkListData: {},
  assignedWorkListLoading: false,
  assignedWorkCurrentPage: 1,
  assignedWorkPageLimit: 10,
  assignedWorkYear: '',
  assignedWorkMonth: '',
};

/**
 * @desc employee/assigned-work/list-assigned-work:
 */

export const getAssignedWorkList = createAsyncThunk(
  'employee/assigned-work/list-assigned-work',
  (payload, thunkAPI) => {
    return new Promise((resolve, reject) => {
      axios
        .post('employee/assigned-work/list-assigned-work', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          if (err === 0) {
            resolve(data);
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

const MyFinanceSlice = createSlice({
  name: 'myFinance',
  initialState,
  reducers: {
    setAssignedWorkCurrentPage: (state, action) => {
      state.assignedWorkCurrentPage = action.payload;
    },
    setAssignedWorkPageLimit: (state, action) => {
      state.assignedWorkPageLimit = action.payload;
    },
    setAssignedWorkYear: (state, action) => {
      state.assignedWorkYear = action.payload;
    },
    setAssignedWorkMonth: (state, action) => {
      state.assignedWorkMonth = action.payload;
    },
  },
  extraReducers: {
    [getAssignedWorkList.pending]: state => {
      state.assignedWorkListLoading = true;
    },
    [getAssignedWorkList.rejected]: state => {
      state.assignedWorkListData = {};
      state.assignedWorkListLoading = false;
    },
    [getAssignedWorkList.fulfilled]: (state, action) => {
      state.assignedWorkListData = action.payload;
      state.assignedWorkListLoading = false;
    },
  },
});

export const {
  setAssignedWorkCurrentPage,
  setAssignedWorkPageLimit,
  setAssignedWorkYear,
  setAssignedWorkMonth,
} = MyFinanceSlice.actions;

export default MyFinanceSlice.reducer;
