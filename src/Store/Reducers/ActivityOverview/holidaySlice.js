import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  holidayList: [],
  holidayLoading: false,
  isAddHoliday: false,
  isUpdateHoliday: false,
  isDeleteHoliday: false,
  holidayPageLimit: 10,
  holidayCurrentPage: 1,
  holidaySearchParam: '',
  selectedHolidayData: {
    holiday_date: '',
    holiday_name: '',
  },
  year: new Date()?.getFullYear(),
};

/**
 * @desc list-holiday
 * @param (limit, start, isActive,search,year)
 */

const customDateSort = data => {
  const sortedData = [...data]?.sort((a, b) => {
    const parseDate = dateStr => {
      // Try to parse the date using moment library
      const momentDate = moment(dateStr, ['YYYY-MM-DD', 'DD-MM-YYYY'], true);

      // If momentDate is valid, return its native Date representation
      if (momentDate.isValid()) {
        return momentDate.toDate();
      }

      // If parsing with moment fails, try a more manual approach
      const [day, month, year] = dateStr?.split('-').map(Number);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day);
      }

      // If all parsing attempts fail, return null
      return null;
    };

    const dateA = parseDate(a.holiday_date);
    const dateB = parseDate(b.holiday_date);

    if (!dateA || !dateB) {
      // Handle cases where date parsing fails
      return 0;
    }

    return dateA - dateB;
  });
  return sortedData;
};

export const getHolidayList = createAsyncThunk(
  'activity-overview/holiday/list-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/holiday/list-holiday', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          const updated = data?.list?.map(item => {
            return {
              ...item,
              holiday_date: moment(item?.holiday_date)?.format('DD-MM-YYYY'),
            };
          });
          let newData = customDateSort(updated);
          if (err === 0) {
            resolve(newData);
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
 * @desc add-holiday
 */

export const addHoliday = createAsyncThunk(
  'activity-overview/holiday/add-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/holiday/add-holiday', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc edit-holiday
 */

export const editHoliday = createAsyncThunk(
  'activity-overview/holiday/edit-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/holiday/edit-holiday', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc delete-holiday
 */

export const deleteHoliday = createAsyncThunk(
  'activity-overview/holiday/delete-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/holiday/delete-holiday', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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
 * @desc get-holiday
 */

export const getHoliday = createAsyncThunk(
  'activity-overview/holiday/get-holiday',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/holiday/get-holiday', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const utcDate = new Date(data?.holiday_date);

          const localDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds(),
          );
          const updated = {
            ...data,

            holiday_date: localDate,
          };
          if (err === 0) {
            resolve(updated);
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

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    setIsDeleteHoliday: (state, action) => {
      state.isDeleteHoliday = action.payload;
    },
    setIsUpdateHoliday: (state, action) => {
      state.isUpdateHoliday = action.payload;
    },
    setIsAddHoliday: (state, action) => {
      state.isAddHoliday = action.payload;
    },
    setHolidayList: (state, action) => {
      state.holidayList = action.payload;
    },
    clearSelectedHolidayData: (state, action) => {
      state.selectedHolidayData = initialState.selectedHolidayData;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
  extraReducers: {
    [getHolidayList.pending]: state => {
      state.holidayLoading = true;
    },
    [getHolidayList.rejected]: state => {
      state.holidayList = {};
      state.holidayLoading = false;
    },
    [getHolidayList.fulfilled]: (state, action) => {
      state.holidayList = action.payload;
      state.holidayLoading = false;
    },
    [addHoliday.pending]: state => {
      state.isAddHoliday = false;
      state.holidayLoading = true;
    },
    [addHoliday.rejected]: state => {
      state.isAddHoliday = false;
      state.holidayLoading = false;
    },
    [addHoliday.fulfilled]: state => {
      state.isAddHoliday = true;
      state.holidayLoading = false;
    },
    [editHoliday.pending]: state => {
      state.isUpdateHoliday = false;
      state.holidayLoading = true;
    },
    [editHoliday.rejected]: state => {
      state.isUpdateHoliday = false;
      state.holidayLoading = false;
    },
    [editHoliday.fulfilled]: state => {
      state.isUpdateHoliday = true;
      state.holidayLoading = false;
    },
    [deleteHoliday.pending]: state => {
      state.isDeleteHoliday = false;
      state.holidayLoading = true;
    },
    [deleteHoliday.rejected]: state => {
      state.isDeleteHoliday = false;
      state.holidayLoading = false;
    },
    [deleteHoliday.fulfilled]: state => {
      state.isDeleteHoliday = true;
      state.holidayLoading = false;
    },
    [getHoliday.pending]: state => {
      state.selectedHolidayData = {};
      state.holidayLoading = true;
    },
    [getHoliday.rejected]: state => {
      state.selectedHolidayData = {};
      state.holidayLoading = false;
    },
    [getHoliday.fulfilled]: (state, action) => {
      state.selectedHolidayData = action.payload;
      state.holidayLoading = false;
    },
  },
});

export const {
  setIsAddHoliday,
  setIsUpdateHoliday,
  setIsDeleteHoliday,
  setHolidayList,
  clearSelectedHolidayData,
  setYear,
} = holidaySlice.actions;

export default holidaySlice.reducer;
