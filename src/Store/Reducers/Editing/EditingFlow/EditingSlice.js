import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { convertIntoNumber, totalCount } from 'Helper/CommonHelper';

let initialState = {
  sortEditingOrder: 1,
  sortEditingField: '',
  editingList: {},
  editingLoading: false,
  selectedEditingData: {},
  editingCurrentPage: 1,
  editingPageLimit: 20,
  editingSearchParam: '',
  editingFilterValue: '',
  editingStepFilterValue: '',
  editingEmployeeFilterValue: '',
  editingSelectedProgressIndex: 1,
  editingSelectedReworkProgressIndex: 1,
  commentList: [],
  commentLoading: false,
  orderNoteLoading: false,
  editingOrderNoteList: [],
  isAddComment: false,
  commentData: {
    order_id: '',
    comment: '',
  },
  orderNoteList: [],
  editingCollectionData: {},
  selectedQuatationData: {},
  quotationLoading: false,
  editingQuotationData: {},
  quotationList: [],
  isAddQuotation: false,
  isUpdateQuotation: false,
  quotationApprovedData: {},
  isAddInvoice: false,
  invoiceLoading: false,
  editingAssignData: {},
  assignedEditorLoading: false,
  isAssignedEditor: false,
  editingOverviewData: {},
  editingCompletedData: {},
  editingReworkOverviewData: {},
  editingReworkCompletedData: {},
  assignEmployeeList: [],
  employeeLoading: false,
  checkerLoading: false,
  isAddChecker: false,
  isRemoveEditor: false,
  orderLoading: false,
  isEditOrder: false,
  editingReworkData: {},
  reworkLoading: false,
  isAddRework: false,
  isAddStep: false,
  stepLoading: false,
  getStepData: {},
  itemsLoading: false,
  itemsData: {},
  groupLoading: false,
  isCreateGroup: false,
  isEditGroup: false,
  quotationNameData: {},
  quotationNameLoading: false,
  editingItemList: [],
  editingItemLoading: false,
};

/**
 * @desc list-editing_flow
 * @param (limit, start, isActive,search)
 */

export const geteditingList = createAsyncThunk(
  'editing/editing_flow/list-editing_flow',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/list-editing_flow', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          let updated = [];

          if (data?.list?.length) {
            updated = data?.list?.map(item => {
              return {
                ...item,
                create_date: moment(item?.create_date)?.format('DD-MM-YYYY'),
                due_date: moment(item?.due_date)?.format('DD-MM-YYYY'),
                item_name:
                  item?.item_name?.length === 1
                    ? item?.item_name[0]
                    : item?.item_name?.join(', '),
                step: item?.step ? item?.step : 0,
              };
            });
          }
          let newObj = {
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
 * @desc get-editing_flow
 */

export const getEditingFlow = createAsyncThunk(
  'editing/editing_flow/get-editing_flow',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-editing_flow', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const itemList = [];
          let updatedList = data?.orderItems?.map(d => {
            itemList.push(d?.item_id);
            return {
              ...d,
              due_date: d?.due_date ? new Date(d?.due_date) : '',
            };
          });
          const totalDataCollection = totalCount(updatedList, 'data_size');
          const updated = {
            ...data,
            create_date: data?.create_date
              ? moment(data?.create_date)?.format('DD-MM-YYYY')
              : '',
            due_date: data?.due_date
              ? moment(data?.due_date)?.format('DD-MM-YYYY')
              : '',
            data_size: convertIntoNumber(data?.data_size),
            editingTable: updatedList,
            editing_inquiry: itemList,
            item_name:
              data?.item_name?.length === 1
                ? data?.item_name[0]
                : data?.item_name?.join(', '),
            total_data_collection: totalDataCollection,
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
 * @desc quotation name
 */

export const getQuotationName = createAsyncThunk(
  '/editing/editing_flow/quotation-name',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('/editing/editing_flow/quotation-name')
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
 * @desc list-comment
 * @param (order_id)
 */

export const getCommentList = createAsyncThunk(
  'editing/editing_flow/list-comment',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/list-comment', data)
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
 * @desc order-note
 * @param (order_id)
 */

export const getOrderNoteList = createAsyncThunk(
  'editing/editing_flow/get-order_note',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-order_note', payload)
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
 * @desc add-comment
 */

export const addComment = createAsyncThunk(
  'editing/editing_flow/add-comment',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/add-comment', data)
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
 * @desc get-order_note
 * @param (order_id)
 */

export const getOrderNote = createAsyncThunk(
  'editing/editing_flow/get-order_note',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-order_note', data)
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
 * @desc get-quotation
 */

export const getQuotation = createAsyncThunk(
  'editing/editing_flow/get-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-quotation', data)
        .then(res => {
          const { data, err, msg } = res?.data;

          let updatedData = {};
          if (data?.link) {
            window.open(data?.link);
          } else {
            let itemList = [];
            const updatedList = data?.quotation_detail?.map(d => {
              itemList.push(d?.item_name);
              return {
                ...d,
                // due_date: d?.due_date
                //   ? moment(d?.due_date)?.format('DD-MM-YYYY')
                //   : '',
                due_date: d?.due_date ? new Date(d?.due_date) : '',
              };
            });
            updatedData = {
              ...data,
              created_at: data?.created_at
                ? moment(data?.created_at)?.format('DD-MM-YYYY')
                : '',
              due_date: data?.due_date
                ? moment(data?.due_date)?.format('DD-MM-YYYY')
                : '',
              quotation_detail: updatedList,
              editing_inquiry: itemList,
            };
          }
          if (err === 0) {
            resolve(updatedData);
            toast.success(data?.msg);
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
 * @desc list-quotation
 * @param (order_id)
 */

export const getQuotationList = createAsyncThunk(
  'editing/editing_flow/list-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/list-quotation', data)
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
 * @desc add-quotation
 */

export const addQuotation = createAsyncThunk(
  'editing/editing_flow/add-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/add-quotation', data)
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
 * @desc edit-quotation
 */

export const editQuotation = createAsyncThunk(
  'editing/editing_flow/edit-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/edit-quotation', data)
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
 * @desc add-invoice
 */

export const addInvoice = createAsyncThunk(
  'editing/editing_flow/add-invoice',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/add-invoice', data)
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
 * @desc assigned-editor-item
 */

export const assignedEditorItem = createAsyncThunk(
  'editing/editing_flow/assigned-item-editor',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/assigned-item-editor', data)
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
 * @desc list-employee
 */

export const listEmployee = createAsyncThunk(
  'editing/editing_flow/list-employee',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/list-employee', payload)
        .then(res => {
          const { data, err, msg } = res?.data;
          const responseList = data?.map(item => {
            return {
              ...item,
              label: item?.employee_name,
              value: item?._id,
            };
          });
          if (err === 0) {
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
 * @desc add-checker-item
 */

export const addChecker = createAsyncThunk(
  'editing/editing_flow/add-item-checker',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/add-item-checker', data)
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
 * @desc remove-editor-item
 */

export const removeEditorItem = createAsyncThunk(
  'editing/editing_flow/remove-item-editor',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/remove-item-editor', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            // toast.success(data?.msg);
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
 * @desc edit-order
 */

export const editOrder = createAsyncThunk(
  'editing/editing_flow/edit-order',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/edit-order', data)
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
 * @desc rework
 */

export const addRework = createAsyncThunk(
  'editing/editing_flow/rework',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/rework', data)
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
 * @desc add-step
 */

export const addStep = createAsyncThunk(
  'editing/editing_flow/add-step',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/add-step', data)
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
 * @desc get-step
 */

export const getStep = createAsyncThunk(
  'editing/editing_flow/get-step',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-step', data)
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
 * @desc get-items
 */

export const getItems = createAsyncThunk(
  'editing/editing_flow/get-items',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/get-items', data)
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
 * @desc Create Group
 */

export const createGroup = createAsyncThunk(
  'editing/editing_flow/create-group',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/create-group', data)
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
 * @desc Edit Group
 */

export const editingFlowGroupEdit = createAsyncThunk(
  'editing/editing_flow/edit-group',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing_flow/edit-group', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          if (err === 0) {
            resolve(data);
            toast.success(msg);
          } else {
            reject(data);
            toast.error(msg);
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
 * @desc get-editing-items
 */

export const getEditingItemList = createAsyncThunk(
  'editing/editing-items',
  payload => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/editing-items', payload)
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

const EditingSlice = createSlice({
  name: 'editing',
  initialState,
  reducers: {
    setSortEditingOrder: (state, action) => {
      state.sortEditingOrder = action.payload;
    },
    setSortEditingField: (state, action) => {
      state.sortEditingField = action.payload;
    },
    setEditingCurrentPage: (state, action) => {
      state.editingCurrentPage = action.payload;
    },
    setEditingPageLimit: (state, action) => {
      state.editingPageLimit = action.payload;
    },
    setEditingSearchParam: (state, action) => {
      state.editingSearchParam = action.payload;
    },
    setEditingFilterValue: (state, action) => {
      state.editingFilterValue = action.payload;
    },
    setEditingStepFilterValue: (state, action) => {
      state.editingStepFilterValue = action.payload;
    },
    setEditingEmployeeFilterValue: (state, action) => {
      state.editingEmployeeFilterValue = action.payload;
    },
    setEditingSelectedProgressIndex: (state, action) => {
      state.editingSelectedProgressIndex = action.payload;
    },
    setEditingSelectedReworkProgressIndex: (state, action) => {
      state.editingSelectedReworkProgressIndex = action.payload;
    },
    setIsAddComment: (state, action) => {
      state.isAddComment = action.payload;
    },
    setCommentData: (state, action) => {
      state.commentData = action.payload;
    },
    clearCommentList: (state, action) => {
      state.commentList = action.payload;
    },
    setEditingCollectionData: (state, action) => {
      state.editingCollectionData = action.payload;
    },
    setEditingQuotationData: (state, action) => {
      state.editingQuotationData = action.payload;
    },
    setIsAddQuotation: (state, action) => {
      state.isAddQuotation = action.payload;
    },
    setQuotationApprovedData: (state, action) => {
      state.quotationApprovedData = action.payload;
    },
    setEditingAssignData: (state, action) => {
      state.editingAssignData = action.payload;
    },
    setEditingOverviewData: (state, action) => {
      state.editingOverviewData = action.payload;
    },
    setEditingCompletedData: (state, action) => {
      state.editingCompletedData = action.payload;
    },
    setIsAssignedEditor: (state, action) => {
      state.isAssignedEditor = action.payload;
    },
    setEditingReworkData: (state, action) => {
      state.editingReworkData = action.payload;
    },
    setEditingReworkOverviewData: (state, action) => {
      state.editingReworkOverviewData = action.payload;
    },
    setEditingReworkCompletedData: (state, action) => {
      state.editingReworkCompletedData = action.payload;
    },
    setQuotationNameData: (state, action) => {
      state.quotationNameData = action.payload;
    },
    setGetStepData: (state, action) => {
      state.getStepData = action.payload;
    },
  },
  extraReducers: {
    [geteditingList.pending]: state => {
      state.editingLoading = true;
    },
    [geteditingList.rejected]: state => {
      state.editingList = {};
      state.editingLoading = false;
    },
    [geteditingList.fulfilled]: (state, action) => {
      state.editingList = action.payload;
      state.editingLoading = false;
    },
    [getEditingFlow.pending]: state => {
      state.selectedEditingData = {};
      state.editingLoading = true;
    },
    [getEditingFlow.rejected]: state => {
      state.selectedEditingData = {};
      state.editingLoading = false;
    },
    [getEditingFlow.fulfilled]: (state, action) => {
      state.selectedEditingData = action.payload;
      state.editingLoading = false;
    },
    [getQuotationName.pending]: state => {
      state.setQuotationNameData = {};
      state.quotationNameLoading = true;
    },
    [getQuotationName.rejected]: state => {
      state.setQuotationNameData = {};
      state.quotationNameLoading = false;
    },
    [getQuotationName.fulfilled]: (state, action) => {
      state.setQuotationNameData = action.payload;
      state.quotationNameLoading = false;
    },
    [getCommentList.pending]: state => {
      state.commentList = [];
      state.commentLoading = true;
    },
    [getCommentList.rejected]: state => {
      state.commentList = [];
      state.commentLoading = false;
    },
    [getCommentList.fulfilled]: (state, action) => {
      state.commentList = action.payload;
      state.commentLoading = false;
    },
    [getOrderNoteList.pending]: state => {
      state.editingOrderNoteList = [];
      state.orderNoteLoading = true;
    },
    [getOrderNoteList.rejected]: state => {
      state.editingOrderNoteList = [];
      state.orderNoteLoading = false;
    },
    [getOrderNoteList.fulfilled]: (state, action) => {
      state.editingOrderNoteList = action.payload;
      state.orderNoteLoading = false;
    },
    [addComment.pending]: state => {
      state.isAddComment = false;
      state.commentLoading = true;
    },
    [addComment.rejected]: state => {
      state.isAddComment = false;
      state.commentLoading = false;
    },
    [addComment.fulfilled]: state => {
      state.isAddComment = true;
      state.commentLoading = false;
    },
    [getOrderNote.pending]: state => {
      state.orderNoteList = {};
      state.commentLoading = true;
    },
    [getOrderNote.rejected]: state => {
      state.orderNoteList = {};
      state.commentLoading = false;
    },
    [getOrderNote.fulfilled]: (state, action) => {
      state.orderNoteList = action.payload;
      state.commentLoading = false;
    },
    [getQuotation.pending]: state => {
      state.selectedQuatationData = {};
      state.quotationLoading = true;
    },
    [getQuotation.rejected]: state => {
      state.selectedQuatationData = {};
      state.quotationLoading = false;
    },
    [getQuotation.fulfilled]: (state, action) => {
      state.selectedQuatationData = action.payload;
      state.quotationLoading = false;
    },
    [getQuotationList.pending]: state => {
      state.quotationList = [];
      state.quotationLoading = true;
    },
    [getQuotationList.rejected]: state => {
      state.quotationList = [];
      state.quotationLoading = false;
    },
    [getQuotationList.fulfilled]: (state, action) => {
      state.quotationList = action.payload;
      state.quotationLoading = false;
    },
    [addQuotation.pending]: state => {
      state.isAddQuotation = false;
      state.quotationLoading = true;
    },
    [addQuotation.rejected]: state => {
      state.isAddQuotation = false;
      state.quotationLoading = false;
    },
    [addQuotation.fulfilled]: state => {
      state.isAddQuotation = true;
      state.quotationLoading = false;
    },
    [editQuotation.pending]: state => {
      state.isUpdateQuotation = false;
      state.quotationLoading = true;
    },
    [editQuotation.rejected]: state => {
      state.isUpdateQuotation = false;
      state.quotationLoading = false;
    },
    [editQuotation.fulfilled]: state => {
      state.isUpdateQuotation = true;
      state.quotationLoading = false;
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
    [assignedEditorItem.pending]: state => {
      state.isAssignedEditor = false;
      state.assignedEditorLoading = true;
    },
    [assignedEditorItem.rejected]: state => {
      state.isAssignedEditor = false;
      state.assignedEditorLoading = false;
    },
    [assignedEditorItem.fulfilled]: state => {
      state.isAssignedEditor = true;
      state.assignedEditorLoading = false;
    },
    [listEmployee.pending]: state => {
      state.assignEmployeeList = [];
      state.employeeLoading = true;
    },
    [listEmployee.rejected]: state => {
      state.assignEmployeeList = [];
      state.employeeLoading = false;
    },
    [listEmployee.fulfilled]: (state, action) => {
      state.assignEmployeeList = action.payload;
      state.employeeLoading = false;
    },
    [addChecker.pending]: state => {
      state.isAddChecker = false;
      state.checkerLoading = true;
    },
    [addChecker.rejected]: state => {
      state.isAddChecker = false;
      state.checkerLoading = false;
    },
    [addChecker.fulfilled]: state => {
      state.isAddChecker = true;
      state.checkerLoading = false;
    },
    [removeEditorItem.pending]: state => {
      state.isRemoveEditor = false;
      state.assignedEditorLoading = true;
    },
    [removeEditorItem.rejected]: state => {
      state.isRemoveEditor = false;
      state.assignedEditorLoading = false;
    },
    [removeEditorItem.fulfilled]: state => {
      state.isRemoveEditor = true;
      state.assignedEditorLoading = false;
    },
    [editOrder.pending]: state => {
      state.isEditOrder = false;
      state.orderLoading = true;
    },
    [editOrder.rejected]: state => {
      state.isEditOrder = false;
      state.orderLoading = false;
    },
    [editOrder.fulfilled]: state => {
      state.isEditOrder = true;
      state.orderLoading = false;
    },
    [addRework.pending]: state => {
      state.isAddRework = false;
      state.reworkLoading = true;
    },
    [addRework.rejected]: state => {
      state.isAddRework = false;
      state.reworkLoading = false;
    },
    [addRework.fulfilled]: state => {
      state.isAddRework = true;
      state.reworkLoading = false;
    },
    [addStep.pending]: state => {
      state.isAddStep = false;
      state.stepLoading = true;
    },
    [addStep.rejected]: state => {
      state.isAddStep = false;
      state.stepLoading = false;
    },
    [addStep.fulfilled]: state => {
      state.isAddStep = true;
      state.stepLoading = false;
    },
    [getStep.pending]: state => {
      state.getStepData = {};
      state.stepLoading = true;
    },
    [getStep.rejected]: state => {
      state.getStepData = {};
      state.stepLoading = false;
    },
    [getStep.fulfilled]: (state, action) => {
      state.getStepData = action.payload;
      state.stepLoading = false;
    },
    [getItems.pending]: state => {
      state.itemsData = {};
      state.itemsLoading = true;
    },
    [getItems.rejected]: state => {
      state.itemsData = {};
      state.itemsLoading = false;
    },
    [getItems.fulfilled]: (state, action) => {
      state.itemsData = action.payload;
      state.itemsLoading = false;
    },
    [createGroup.pending]: state => {
      state.isCreateGroup = false;
      state.groupLoading = true;
    },
    [createGroup.rejected]: state => {
      state.isCreateGroup = false;
      state.groupLoading = false;
    },
    [createGroup.fulfilled]: (state, action) => {
      state.isCreateGroup = true;
      state.groupLoading = false;
    },
    [editingFlowGroupEdit.pending]: state => {
      state.isEditGroup = false;
      state.groupLoading = true;
    },
    [editingFlowGroupEdit.rejected]: state => {
      state.isEditGroup = false;
      state.groupLoading = false;
    },
    [editingFlowGroupEdit.fulfilled]: (state, action) => {
      state.isEditGroup = true;
      state.groupLoading = false;
    },
    [getEditingItemList.pending]: state => {
      state.editingItemList = [];
      state.editingItemLoading = true;
    },
    [getEditingItemList.rejected]: state => {
      state.editingItemList = [];
      state.editingItemLoading = false;
    },
    [getEditingItemList.fulfilled]: (state, action) => {
      state.editingItemList = action.payload;
      state.editingItemLoading = false;
    },
  },
});

export const {
  setSortEditingField,
  setSortEditingOrder,
  setEditingCurrentPage,
  setEditingPageLimit,
  setEditingSearchParam,
  setEditingFilterValue,
  setEditingStepFilterValue,
  setEditingEmployeeFilterValue,
  setEditingSelectedProgressIndex,
  setIsAddComment,
  setCommentData,
  clearCommentList,
  setEditingCollectionData,
  setEditingQuotationData,
  setIsAddQuotation,
  setQuotationApprovedData,
  setEditingAssignData,
  setEditingOverviewData,
  setEditingCompletedData,
  setIsAssignedEditor,
  setEditingSelectedReworkProgressIndex,
  setEditingReworkData,
  setEditingReworkOverviewData,
  setEditingReworkCompletedData,
  setGetStepData,
} = EditingSlice.actions;

export default EditingSlice.reducer;
