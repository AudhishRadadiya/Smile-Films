import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber, totalCount } from 'Helper/CommonHelper';

let initialState = {
  exposingList: {},
  exposingLoading: false,
  selectedExposingData: {},
  exposingDetailsData: {},
  exposingCurrentPage: 1,
  exposingPageLimit: 10,
  exposingSearchParam: '',
  getExposingStepData: {},
  exposingSelectedProgressIndex: 1,
  exposingQuotationData: {},
  exposingQuotationLoading: false,
  exposingQuotationList: {},
  selectedExposingQuatationData: {},
  quotationApprovedData: {},
  isUpdateQuotation: false,
  isAddExposingQuotation: false,
  exposingItemsData: {},
  exposingItemsLoading: false,
  exposerAssignData: {},
  freelancersList: [],
  employeesList: [],
  assignedExposerLoading: false,
  exposerOverviewData: {},
  exposerCompletedData: {},
  editExposingOrderLoading: false,
  isDeleteDataCollection: false,
  exposingItemList: [],
  exposingItemLoading: false,
};

/**
 * @desc get-exposing-list:
 */

export const getExposingList = createAsyncThunk(
  'exposing/list-exposing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('/exposing/list-exposing', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updated = [];

          if (data?.list?.length) {
            updated = data?.list?.map(item => {
              return {
                ...item,
                create_date: item?.create_date
                  ? moment(item?.create_date)?.format('DD-MM-YYYY')
                  : '',
                start_date: item?.start_date
                  ? moment(item?.start_date)?.format('DD-MM-YYYY')
                  : '',
                end_date: item?.end_date
                  ? moment(item?.end_date)?.format('DD-MM-YYYY')
                  : '',
                item_name:
                  item?.item_name?.length === 1
                    ? item?.item_name[0]
                    : item?.item_name?.join(', '),
                step: item?.step ? item?.step : 0,
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
 * @desc get-exposing-step
 */

export const getExposingStep = createAsyncThunk('exposing/get-step', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('exposing/get-step', data)
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
});

/**
 * @desc add-exposing-step
 */

export const addExposingStep = createAsyncThunk('exposing/add-step', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('exposing/add-step', data)
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
});

/**
 * @desc get-exposing_flow
 */

export const getExposingFlow = createAsyncThunk(
  'exposing/get-exposing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/get-exposing', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const itemList = [];

          const updatedOrderItemsList = data?.orderItems?.map(item => {
            itemList.push(item?.item_id);
            const startDate = item?.order_start_date
              ? new Date(item?.order_start_date)
              : null;
            const endDate = item?.order_end_date
              ? new Date(item?.order_end_date)
              : null;

            const convertedIntoDateArray =
              startDate && endDate ? [startDate, endDate] : [];
            return {
              ...item,
              order_date: convertedIntoDateArray,
              // order_date: item?.order_date
              //   ? new Date(item?.order_date?.split('T')[0])
              //   : '',
              order_start_date: item?.order_start_date
                ? new Date(item?.order_start_date?.split('T')[0])
                : '',
              order_end_date: item?.order_end_date
                ? new Date(item?.order_end_date?.split('T')[0])
                : '',
              amount: item.rate * item?.quantity,
            };
          });

          const totalAmountCollection = totalCount(
            updatedOrderItemsList,
            'amount',
          );

          const updated = {
            ...data,
            create_date: data?.create_date
              ? moment(data?.create_date)?.format('YYYY-MM-DD')
              : '',
            delivery_date: data?.delivery_date
              ? new Date(data?.delivery_date?.split('T')[0])
              : new Date(),
            is_editing: data?.is_editing ? data?.is_editing : false,
            mobile_no: Array.isArray(data?.mobile_no)
              ? data?.mobile_no?.join(', ')
              : data?.mobile_no,
            selected_exposing_order_item: itemList,
            exposing_order_table: updatedOrderItemsList,
            total_amount_collection: totalAmountCollection,
            venue: data?.venue ? data?.venue : '',
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
 * @desc get-exposing_details
 * @param (order_id)
 */

export const getExposingDetails = createAsyncThunk(
  'exposing/get-exposing_details',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/get-exposing_details', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const itemList = [];
          const discount = 0;

          const updatedOrderItemsList = data?.orderItems?.map(item => {
            itemList.push(item?.item_id);

            const startDate = item?.order_start_date
              ? new Date(item?.order_start_date)
              : null;
            const endDate = item?.order_end_date
              ? new Date(item?.order_end_date)
              : null;

            const convertedIntoDateArray =
              startDate || endDate ? [startDate, endDate] : [];
            return {
              ...item,
              order_date: convertedIntoDateArray,
              order_start_date: item?.order_start_date
                ? new Date(item?.order_start_date?.split('T')[0])
                : '',
              order_end_date: item?.order_end_date
                ? new Date(item?.order_end_date?.split('T')[0])
                : '',
              amount: item.rate * item?.quantity,
            };
          });

          const totalAmountCollection = totalCount(
            updatedOrderItemsList,
            'amount',
          );

          const updated = {
            ...data,
            create_date: data?.create_date
              ? moment(data?.create_date)?.format('YYYY-MM-DD')
              : '',
            start_date: data?.start_date
              ? moment(data?.start_date)?.format('YYYY-MM-DD')
              : '',
            end_date: data?.end_date
              ? moment(data?.end_date)?.format('YYYY-MM-DD')
              : '',
            selected_exposing_order_item: itemList,
            exposing_order_table: updatedOrderItemsList,
            total_amount_collection: totalAmountCollection,
            tax: (totalAmountCollection * 18) / 100,
            total_amount:
              convertIntoNumber(totalAmountCollection) -
              convertIntoNumber(discount) +
              convertIntoNumber(totalAmountCollection),
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
 * @desc add-quotation
 */

export const exposingAddQuotation = createAsyncThunk(
  'exposing/add-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/add-quotation', data)
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
 * @desc list-quotation
 * @param (order_id)
 */

export const getExposingQuotationList = createAsyncThunk(
  'exposing/list-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/list-quotation', data)
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
 * @desc edit-exposing
 */

export const editExposingFlow = createAsyncThunk(
  'exposing/edit-exposing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/edit-exposing', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          if (err === 0) {
            resolve(data);
            toast.success(msg);
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
 * @desc get-quotation
 */

export const getExposingQuotation = createAsyncThunk(
  'exposing/get-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/get-quotation', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updatedData = {};
          if (data?.link) {
            window.open(data?.link);
          } else {
            let itemList = [];
            const updatedList = data?.quotation_detail?.map(d => {
              itemList.push(d?.item_id);

              const startDate = d?.order_start_date
                ? new Date(d?.order_start_date)
                : null;
              const endDate = d?.order_end_date
                ? new Date(d?.order_end_date)
                : null;

              const convertedIntoDateArray =
                startDate || endDate ? [startDate, endDate] : [];

              return {
                ...d,
                // due_date: d?.due_date
                //   ? moment(d?.due_date)?.format('DD-MM-YYYY')
                //   : '',
                order_date: convertedIntoDateArray,
                order_start_date: d?.order_start_date
                  ? new Date(d?.order_start_date?.split('T')[0])
                  : '',
                order_end_date: d?.order_end_date
                  ? new Date(d?.order_end_date?.split('T')[0])
                  : '',
              };
            });
            updatedData = {
              ...data,
              created_at: data?.created_at
                ? moment(data?.created_at)?.format('YYYY-MM-DD')
                : '',
              order_date: data?.order_date
                ? moment(data?.order_date)?.format('DD-MM-YYYY')
                : '',
              quotation_detail: updatedList,
              selected_exposing_order_item: itemList,
            };
          }
          if (err === 0) {
            resolve(updatedData);
          } else {
            toast.error(msg);
            reject(updatedData);
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
 * @desc add-invoice
 */

export const addInvoice = createAsyncThunk('exposing/add-invoice', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('exposing/add-invoice', data)
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
});

/**
 * @desc edit-quotation
 */

export const editQuotation = createAsyncThunk(
  'exposing/edit-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/edit-quotation', data)
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
 * @desc get-exposing-items
 */

export const getExposingItems = createAsyncThunk('exposing/get-items', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('exposing/get-items', data)
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
});

/**
 * @desc edit-exposing-items
 */

export const editExposingItems = createAsyncThunk(
  'exposing/edit-item',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/edit-item', payload)
        .then(res => {
          const { data, err, msg } = res?.data;
          if (err === 0) {
            resolve(data);
            toast.success(msg);
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
 * @desc exposing-list-employee
 */
export const exposingEmployeeList = createAsyncThunk(
  'exposing/list-employee',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/list-employee', payload)
        .then(res => {
          const { data, err, msg } = res?.data;

          const responseList = data?.map(item => {
            return {
              ...item,
              label: item?.employee_name,
              value: item?._id,
              is_freelancer: payload?.freelancer,
            };
          });
          if (err === 0) {
            if (payload?.freelancer === true) {
              dispatch(setFreelancersList(responseList));
            } else {
              dispatch(setEmployeesList(responseList));
            }
            resolve(responseList);
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
 * @desc Assigned-Exposer-Item :
 */

export const assignedExposerItem = createAsyncThunk(
  'exposing/assigned-item-exposer',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/assigned-item-exposer', payload)
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
 * @desc Remove-Exposer-Item :
 */

export const removeExposerItem = createAsyncThunk(
  'exposing/remove-item-exposer',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/remove-item-exposer', payload)
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
 * @desc edit-exposing-order :
 */

export const editExposingOrder = createAsyncThunk(
  'exposing/edit-order',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/edit-order', payload)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data });
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
 * @desc delete-data_collection
 */

export const deleteDataCollection = createAsyncThunk(
  'editing/data_collection/delete-data_collection',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/data_collection/delete-data_collection', data)
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
 * @desc get-exposing-items
 */

export const getExposingItemList = createAsyncThunk(
  'exposing/exposing-items',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('exposing/exposing-items', payload)
        .then(res => {
          const { data, msg, err } = res?.data;

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

const ExposingSlice = createSlice({
  name: 'exposing',
  initialState,
  reducers: {
    setExposingCurrentPage: (state, action) => {
      state.exposingCurrentPage = action.payload;
    },
    setExposingPageLimit: (state, action) => {
      state.exposingPageLimit = action.payload;
    },
    setExposingSearchParam: (state, action) => {
      state.exposingSearchParam = action.payload;
    },
    setExposingSelectedProgressIndex: (state, action) => {
      state.exposingSelectedProgressIndex = action.payload;
    },
    setExposingQuotationData: (state, action) => {
      state.exposingQuotationData = action.payload;
    },
    setIsAddExposingQuotation: (state, action) => {
      state.isAddExposingQuotation = action.payload;
    },
    setQuotationApprovedData: (state, action) => {
      state.quotationApprovedData = action.payload;
    },

    setEmployeesList: (state, action) => {
      state.employeesList = action.payload;
    },
    setFreelancersList: (state, action) => {
      state.freelancersList = action.payload;
    },
    setExposerAssignData: (state, action) => {
      state.exposerAssignData = action.payload;
    },
    setExposerOverviewData: (state, action) => {
      state.exposerOverviewData = action.payload;
    },
    setExposerCompletedData: (state, action) => {
      state.exposerCompletedData = action.payload;
    },

    setIsDeleteDataCollection: (state, action) => {
      state.isDeleteDataCollection = action.payload;
    },
  },
  extraReducers: {
    [getExposingQuotationList.pending]: state => {
      state.exposingQuotationList = [];
      state.exposingQuotationLoading = true;
    },
    [getExposingQuotationList.rejected]: state => {
      state.exposingQuotationList = [];
      state.exposingQuotationLoading = false;
    },
    [getExposingQuotationList.fulfilled]: (state, action) => {
      state.exposingQuotationList = action.payload;
      state.exposingQuotationLoading = false;
    },
    [getExposingList.pending]: state => {
      state.exposingLoading = true;
    },
    [getExposingList.rejected]: state => {
      state.exposingList = {};
      state.exposingLoading = false;
    },
    [getExposingList.fulfilled]: (state, action) => {
      state.exposingList = action.payload;
      state.exposingLoading = false;
    },
    [getExposingFlow.pending]: state => {
      state.selectedExposingData = {};
      state.exposingLoading = true;
    },
    [getExposingFlow.rejected]: state => {
      state.selectedExposingData = {};
      state.exposingLoading = false;
    },
    [getExposingFlow.fulfilled]: (state, action) => {
      state.selectedExposingData = action.payload;
      state.exposingLoading = false;
    },
    [editExposingFlow.pending]: state => {
      state.exposingLoading = true;
    },
    [editExposingFlow.rejected]: state => {
      state.exposingLoading = false;
    },
    [editExposingFlow.fulfilled]: (state, action) => {
      state.exposingLoading = false;
    },
    [getExposingDetails.pending]: state => {
      state.exposingDetailsData = {};
      state.exposingLoading = true;
    },
    [getExposingDetails.rejected]: state => {
      state.exposingDetailsData = {};
      state.exposingLoading = false;
    },
    [getExposingDetails.fulfilled]: (state, action) => {
      state.exposingDetailsData = action.payload;
      state.exposingLoading = false;
    },
    [getExposingQuotation.pending]: state => {
      state.selectedExposingQuatationData = {};
      state.exposingLoading = true;
    },
    [getExposingQuotation.rejected]: state => {
      state.selectedExposingQuatationData = {};
      state.exposingLoading = false;
    },
    [getExposingQuotation.fulfilled]: (state, action) => {
      state.selectedExposingQuatationData = action.payload;
      state.exposingLoading = false;
    },
    [getExposingStep.pending]: state => {
      state.getExposingStepData = {};
      state.exposingStepLoading = true;
    },
    [getExposingStep.rejected]: state => {
      state.getExposingStepData = {};
      state.exposingStepLoading = false;
    },
    [getExposingStep.fulfilled]: (state, action) => {
      state.getExposingStepData = action.payload;
      state.exposingStepLoading = false;
    },
    [addExposingStep.pending]: state => {
      state.isAddExposingStep = false;
      state.exposingStepLoading = true;
    },
    [addExposingStep.rejected]: state => {
      state.isAddExposingStep = false;
      state.exposingStepLoading = false;
    },
    [addExposingStep.fulfilled]: state => {
      state.isAddExposingStep = true;
      state.exposingStepLoading = false;
    },
    [exposingAddQuotation.pending]: state => {
      state.isAddExposingQuotation = false;
      state.exposingStepLoading = true;
    },
    [exposingAddQuotation.rejected]: state => {
      state.isAddExposingQuotation = false;
      state.exposingStepLoading = false;
    },
    [exposingAddQuotation.fulfilled]: state => {
      state.isAddExposingQuotation = true;
      state.exposingStepLoading = false;
    },
    [addInvoice.pending]: state => {
      state.isAddInvoice = false;
      state.invoiceLoading = true;
    },
    [addInvoice.rejected]: state => {
      state.isAddInvoice = false;
      state.invoiceLoading = false;
    },
    [addInvoice.fulfilled]: state => {
      state.isAddInvoice = true;
      state.invoiceLoading = false;
    },
    [editQuotation.pending]: state => {
      state.isUpdateQuotation = false;
      state.exposingLoading = true;
    },
    [editQuotation.rejected]: state => {
      state.isUpdateQuotation = false;
      state.exposingLoading = false;
    },
    [editQuotation.fulfilled]: state => {
      state.isUpdateQuotation = true;
      state.exposingLoading = false;
    },

    [getExposingItems.pending]: state => {
      state.exposingItemsData = {};
      state.exposingItemsLoading = true;
    },
    [getExposingItems.rejected]: state => {
      state.exposingItemsData = {};
      state.exposingItemsLoading = false;
    },
    [getExposingItems.fulfilled]: (state, action) => {
      state.exposingItemsData = action.payload;
      state.exposingItemsLoading = false;
    },
    [exposingEmployeeList.pending]: state => {
      state.exposingEmployeeLoading = true;
    },
    [exposingEmployeeList.rejected]: state => {
      state.exposingEmployeeLoading = false;
    },
    [exposingEmployeeList.fulfilled]: state => {
      state.exposingEmployeeLoading = false;
    },
    [assignedExposerItem.pending]: state => {
      state.assignedExposerLoading = true;
    },
    [assignedExposerItem.rejected]: state => {
      state.assignedExposerLoading = false;
    },
    [assignedExposerItem.fulfilled]: state => {
      state.assignedExposerLoading = false;
    },
    [removeExposerItem.pending]: state => {
      state.assignedExposerLoading = true;
    },
    [removeExposerItem.rejected]: state => {
      state.assignedExposerLoading = false;
    },
    [removeExposerItem.fulfilled]: state => {
      state.assignedExposerLoading = false;
    },
    [editExposingItems.pending]: state => {
      state.exposingItemsLoading = true;
    },
    [editExposingItems.rejected]: state => {
      state.exposingItemsLoading = false;
    },
    [editExposingItems.fulfilled]: state => {
      state.exposingItemsLoading = false;
    },
    [editExposingOrder.pending]: state => {
      state.editExposingOrderLoading = true;
    },
    [editExposingOrder.rejected]: state => {
      state.editExposingOrderLoading = false;
    },
    [editExposingOrder.fulfilled]: state => {
      state.editExposingOrderLoading = false;
    },

    [deleteDataCollection.pending]: state => {
      state.isDeleteDataCollection = false;
      state.exposingLoading = true;
    },
    [deleteDataCollection.rejected]: state => {
      state.isDeleteDataCollection = false;
      state.exposingLoading = false;
    },
    [deleteDataCollection.fulfilled]: state => {
      state.isDeleteDataCollection = true;
      state.exposingLoading = false;
    },

    [getExposingItemList.pending]: state => {
      state.exposingItemList = [];
      state.exposingItemLoading = true;
    },
    [getExposingItemList.rejected]: state => {
      state.exposingItemList = [];
      state.exposingItemLoading = false;
    },
    [getExposingItemList.fulfilled]: (state, action) => {
      state.exposingItemList = action.payload;
      state.exposingItemLoading = false;
    },
  },
});

export const {
  setExposingCurrentPage,
  setExposingSearchParam,
  setExposingPageLimit,
  setExposingSelectedProgressIndex,
  setQuotationApprovedData,
  setExposingQuotationData,
  setIsAddExposingQuotation,
  setIsDeleteDataCollection,
  setExposerAssignData,
  setEmployeesList,
  setFreelancersList,
  setExposerOverviewData,
  setExposerCompletedData,
} = ExposingSlice.actions;

export default ExposingSlice.reducer;
