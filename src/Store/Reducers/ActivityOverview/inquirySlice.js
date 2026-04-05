import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

let initialState = {
  inquiryList: [],
  inquiryLoading: false,
  isAddInquiry: false,
  isUpdateInquiry: false,
  isDeleteInquiry: false,
  inquiryPageLimit: 10,
  inquiryCurrentPage: 1,
  inquirySearchParam: '',
  inquirySelectedProgressIndex: 1,
  inquiryStatus: [],
  selectedInquiryData: {},
  inquiryNo: '',
  inquiryData: {
    inquiry_no: '',
    create_date: new Date(),
    client_company_id: '',
    remark: '',
    inquiry_type: 1,
    editing_inquiryTable: [],
    exposing_inquiryTable: [],
    editing_inquiry: [],
    exposing_inquiry: [],
    couple_name: '',
  },
  addSelectedInquiryData: {},
  updateSelectedInquiryData: {},
  isGetInintialValuesInquiry: {
    add: false,
    update: false,
  },
  selectedInquiryFlowData: {},
  getInquiryStepData: {},
  inquiryStepLoading: false,
  isAddInquiryStep: false,
  inquiryFlowExQuotationData: {},
  inquiryFlowExQuotesApprovedData: {},
  inquiryFlowEditingQuotationData: {},
  inquiryFlowEditingQuotesApprovedData: {},
};

/**
 * @desc list-inquiry
 * @param (limit, start, isActive,search,inquiryStatus)
 */

export const getInquiryList = createAsyncThunk(
  'activity-overview/inquiry/list-inquiry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/list-inquiry', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updated = [];
          if (data?.list?.length) {
            updated = data?.list?.map(item => {
              return {
                ...item,
                create_date: moment(item?.create_date)?.format('DD-MM-YYYY'),
                item_name:
                  item?.item_name?.length === 1
                    ? item?.item_name[0]
                    : item?.item_name?.join(', '),
                inquiry_type: item?.inquiry_type === 1 ? 'Editing' : 'Exposing',
              };
            });
          }
          const newObj = {
            list: updated,
            pageNo: data?.pageNo ? data?.pageNo : '',
            totalRows: data?.totalRows ? data?.totalRows : 0,
          };
          if (err === 0) {
            resolve(newObj);
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
 * @desc inquiry-no
 */

export const getInquiryNo = createAsyncThunk(
  'activity-overview/inquiry/inquiry-no',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/inquiry-no', data)
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

/**
 * @desc add-inquiry
 */

export const addInquiry = createAsyncThunk(
  'activity-overview/inquiry/add-inquiry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/add-inquiry', data)
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
 * @desc edit-inquiry
 */

export const editInquiry = createAsyncThunk(
  'activity-overview/inquiry/edit-inquiry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/edit-inquiry', data)
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
 * @desc delete-inquiry
 */

export const deleteInquiry = createAsyncThunk(
  'activity-overview/inquiry/delete-inquiry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/delete-inquiry', data)
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
 * @desc get-inquiry
 */

export const getInquiry = createAsyncThunk(
  'activity-overview/inquiry/get-inquiry',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('activity-overview/inquiry/get-inquiry', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const itemList = [];

          let updatedList = data?.orderItems?.map(d => {
            let convertedIntoDateArray = [];
            itemList.push(d?.item_id);

            if (data?.inquiry_type === 2) {
              const startDate = d?.order_start_date
                ? new Date(d?.order_start_date)
                : null;
              const endDate = d?.order_end_date
                ? new Date(d?.order_end_date)
                : null;

              convertedIntoDateArray =
                startDate || endDate ? [startDate, endDate] : [];
            }

            return {
              ...d,
              ...(data?.inquiry_type === 1 && {
                due_date: new Date(d?.due_date),
              }),
              ...(data?.inquiry_type === 2 && {
                order_date: convertedIntoDateArray,
              }),
            };
          });

          const updated = {
            ...data,
            create_date: new Date(data?.create_date),
            editing_inquiryTable: data?.inquiry_type === 1 ? updatedList : [],
            exposing_inquiryTable: data?.inquiry_type === 2 ? updatedList : [],
            editing_inquiry: data?.inquiry_type === 1 ? itemList : [],
            exposing_inquiry: data?.inquiry_type === 2 ? itemList : [],
            client_full_name: data?.client_full_name,
            reference: data?.refrence_value,
            email_id: data?.email_id,
            mobile_no: data?.mobile_no,
            address: data?.address,
            country: data?.country_value,
            state: data?.state_value,
            city: data?.city_value,
            pin_code: data?.pincode,
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

/**
 * @desc get-inquiry-step
 */

export const getInquiryStep = createAsyncThunk(
  'inquiry/get-inquiry_step',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('inquiry/get-inquiry_step', data)
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

/**
 * @desc add-inquiry-step
 */

export const addInquiryStep = createAsyncThunk(
  'inquiry/add-inquiry_step',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('inquiry/add-inquiry_step', data)
        .then(res => {
          const { err, msg, data } = res;
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

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    setIsDeleteInquiry: (state, action) => {
      state.isDeleteInquiry = action.payload;
    },
    setIsUpdateInquiry: (state, action) => {
      state.isUpdateInquiry = action.payload;
    },
    setIsAddInquiry: (state, action) => {
      state.isAddInquiry = action.payload;
    },
    setInquiryCurrentPage: (state, action) => {
      state.inquiryCurrentPage = action.payload;
    },
    setInquiryPageLimit: (state, action) => {
      state.inquiryPageLimit = action.payload;
    },
    setInquirySearchParam: (state, action) => {
      state.inquirySearchParam = action.payload;
    },
    setInquirySelectedProgressIndex: (state, action) => {
      state.inquirySelectedProgressIndex = action.payload;
    },
    setInquiryList: (state, action) => {
      state.inquiryList = action.payload;
    },
    setInquiryStatus: (state, action) => {
      state.inquiryStatus = action.payload;
    },
    setAddSelectedInquiryData: (state, action) => {
      state.addSelectedInquiryData = action.payload;
    },
    setIsGetInintialValuesInquiry: (state, action) => {
      state.isGetInintialValuesInquiry = action.payload;
    },
    clearAddSelectedInquiryData: state => {
      state.addSelectedInquiryData = initialState.inquiryData;
    },
    setUpdateSelectedInquiryData: (state, action) => {
      state.updateSelectedInquiryData = action.payload;
    },
    clearUpdateSelectedInquiryData: state => {
      state.updateSelectedInquiryData = initialState.inquiryData;
    },
    setSelectedInquiryFlowData: (state, action) => {
      state.selectedInquiryFlowData = action.payload;
    },
    setInquiryFlowExQuotationData: (state, action) => {
      state.inquiryFlowExQuotationData = action.payload;
    },
    setInquiryFlowExQuotesApprovedData: (state, action) => {
      state.inquiryFlowExQuotesApprovedData = action.payload;
    },
    setInquiryFlowEditingQuotationData: (state, action) => {
      state.inquiryFlowEditingQuotationData = action.payload;
    },
    setInquiryFlowEditingQuotesApprovedData: (state, action) => {
      state.inquiryFlowEditingQuotesApprovedData = action.payload;
    },
  },
  extraReducers: {
    [getInquiryList.pending]: state => {
      state.inquiryLoading = true;
    },
    [getInquiryList.rejected]: state => {
      state.inquiryList = [];
      state.inquiryLoading = false;
    },
    [getInquiryList.fulfilled]: (state, action) => {
      state.inquiryList = action.payload;
      state.inquiryLoading = false;
    },
    [getInquiryNo.pending]: state => {
      state.inquiryNo = '';
      state.inquiryLoading = true;
    },
    [getInquiryNo.rejected]: state => {
      state.inquiryNo = '';
      state.inquiryLoading = false;
    },
    [getInquiryNo.fulfilled]: (state, action) => {
      state.inquiryNo = action.payload;
      state.inquiryLoading = false;
    },
    [addInquiry.pending]: state => {
      state.isAddInquiry = false;
      state.inquiryLoading = true;
    },
    [addInquiry.rejected]: state => {
      state.isAddInquiry = false;
      state.inquiryLoading = false;
    },
    [addInquiry.fulfilled]: state => {
      state.isAddInquiry = true;
      state.inquiryLoading = false;
    },
    [editInquiry.pending]: state => {
      state.isUpdateInquiry = false;
      state.inquiryLoading = true;
    },
    [editInquiry.rejected]: state => {
      state.isUpdateInquiry = false;
      state.inquiryLoading = false;
    },
    [editInquiry.fulfilled]: state => {
      state.isUpdateInquiry = true;
      state.inquiryLoading = false;
    },
    [deleteInquiry.pending]: state => {
      state.isDeleteInquiry = false;
      state.inquiryLoading = true;
    },
    [deleteInquiry.rejected]: state => {
      state.isDeleteInquiry = false;
      state.inquiryLoading = false;
    },
    [deleteInquiry.fulfilled]: state => {
      state.isDeleteInquiry = true;
      state.inquiryLoading = false;
    },
    [getInquiry.pending]: state => {
      state.selectedInquiryData = {};
      state.inquiryLoading = true;
    },
    [getInquiry.rejected]: state => {
      state.selectedInquiryData = {};
      state.inquiryLoading = false;
    },
    [getInquiry.fulfilled]: (state, action) => {
      state.selectedInquiryData = action.payload;
      state.inquiryLoading = false;
    },
    [getInquiryStep.pending]: state => {
      state.getInquiryStepData = {};
      state.inquiryStepLoading = true;
    },
    [getInquiryStep.rejected]: state => {
      state.getInquiryStepData = {};
      state.inquiryStepLoading = false;
    },
    [getInquiryStep.fulfilled]: (state, action) => {
      state.getInquiryStepData = action.payload;
      state.inquiryStepLoading = false;
    },
    [addInquiryStep.pending]: state => {
      state.isAddInquiryStep = false;
      state.inquiryStepLoading = true;
    },
    [addInquiryStep.rejected]: state => {
      state.isAddInquiryStep = false;
      state.inquiryStepLoading = false;
    },
    [addInquiryStep.fulfilled]: state => {
      state.isAddInquiryStep = true;
      state.inquiryStepLoading = false;
    },
  },
});

export const {
  setIsAddInquiry,
  setIsUpdateInquiry,
  setIsDeleteInquiry,
  setInquiryList,
  setInquirySearchParam,
  setInquiryPageLimit,
  setInquiryCurrentPage,
  setInquiryStatus,
  setInquirySelectedProgressIndex,
  setAddSelectedInquiryData,
  setIsGetInintialValuesInquiry,
  clearAddSelectedInquiryData,
  setUpdateSelectedInquiryData,
  setSelectedInquiryFlowData,
  clearUpdateSelectedInquiryData,
  setInquiryFlowExQuotationData,
  setInquiryFlowExQuotesApprovedData,
  setInquiryFlowEditingQuotationData,
  setInquiryFlowEditingQuotesApprovedData,
} = inquirySlice.actions;

export default inquirySlice.reducer;
