import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  selectedEmployee: {},
  selectedEditingEmployee: {},
  selectedEmployeeEvents: [],
  activeCalenderTabIndex: 0,
  monthAsPerSelectedEmployee: new Date(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setSelectedEditingEmployee: (state, action) => {
      state.selectedEditingEmployee = action.payload;
    },
    setSelectedEmployeeEvents: (state, action) => {
      state.selectedEmployeeEvents = action.payload;
    },
    setMonthAsPerSelectedEmployee: (state, action) => {
      state.monthAsPerSelectedEmployee = action.payload;
    },
    setActiveCalenderTabIndex: (state, action) => {
      state.activeCalenderTabIndex = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setSelectedEmployee,
  setSelectedEditingEmployee,
  setSelectedEmployeeEvents,
  setActiveCalenderTabIndex,
  setMonthAsPerSelectedEmployee,
} = calendarSlice.actions;

export default calendarSlice.reducer;
