import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

let initialState = {
  clientProjectList: {},
  clientProjectLoading: false,
  clientProjectOverviewData: {},
  clientProjectOverviewLoading: false,
  clientCommentList: [],
  clientCommentLoading: false,
  isAddClientComment: false,
  ClientOrderNoteList: [],
  isAddClientOrderNote: false,
  clientOrderNoteLoading: false,
  clientQuotationLoading: false,
  isUpdateClientQuotation: false,
  clientQuotationList: [],
  selectedClientQuotationData: {},
  clientProjectPageLimit: 10,
  clientProjectCurrentPage: 1,
  clientProjectSearchParam: '',
  clientProjectStatus: '',
  clientCommentData: {
    order_id: '',
    comment: '',
  },
  clientOrderNoteData: {
    order_id: '',
    order_note: '',
  },
  clientBillingLoading: false,
  clientBillingList: [],
  selectedClientBillingData: {},

  clientEditOrder: {},
  clientEditOrderLoading: false,
};

/**
 * @desc list-projects
 * @param (limit, start, isActive,search,year)
 */

export const getProjectList = createAsyncThunk(
  'client_company/projects/list-projects',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/list-projects', data)
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
                due_date: item?.due_date
                  ? moment(item?.due_date)?.format('DD-MM-YYYY')
                  : '',
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
            // resolve(data);
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
 * @desc get-project_overview
 * @param (limit, start, isActive,search,year)
 */

export const getClientProjectOverviewData = createAsyncThunk(
  'client_company/projects/projects-overview',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/projects-overview', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const updated = {
            ...data,
            create_date: data?.create_date
              ? moment(data?.create_date)?.format('DD-MM-YYYY')
              : '',
            due_date: data?.due_date
              ? moment(data?.due_date)?.format('DD-MM-YYYY')
              : '',
            // item_name:
            //   data?.item_name?.length === 1
            //     ? data?.item_name[0]
            //     : data?.item_name?.join(', '),
            inquiry_type: data?.inquiry_type === 1 ? 'Editing' : 'Exposing',
          };
          if (err === 0) {
            resolve(updated);
            // resolve(data);
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

export const getClientCommentList = createAsyncThunk(
  'client_company/projects/list-comment',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/list-comment', data)
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

export const addClientComment = createAsyncThunk(
  'client_company/projects/add-comment',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/add-comment', data)
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

export const editClientOrder = createAsyncThunk(
  'client_company/projects/edit-order',

  data => {
    return new Promise((resolve, reject) => {
      axios

        .post('client_company/projects/edit-order', data)

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

export const getClientOrderNote = createAsyncThunk(
  'client_company/projects/get-order_note',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/get-order_note', data)
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
 * @desc add-order_note
 */

export const addClientOrderNote = createAsyncThunk(
  'client_company/projects/add-order_note',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/add-order_note', data)
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

export const getClientQuotationList = createAsyncThunk(
  'client_company/projects/list-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/list-quotation', data)
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

export const getClientQuotation = createAsyncThunk(
  'client_company/projects/get-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/get-quotation', data)
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
                due_date: d?.due_date
                  ? moment(d?.due_date)?.format('DD-MM-YYYY')
                  : '',
              };
            });
            updatedData = {
              ...data,
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
 * @desc edit-quotation
 */

export const editClientQuotation = createAsyncThunk(
  'client_company/projects/edit-quotation',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/edit-quotation', data)
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
 * @desc list-billing
 * @param (order_id)
 */

export const getClientBillingList = createAsyncThunk(
  'client_company/projects/list-billing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/list-billing', data)
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
 * @desc get-billing
 */

export const getClientBilling = createAsyncThunk(
  'client_company/projects/get-billing',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('client_company/projects/get-billing', data)
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
                due_date: d?.due_date
                  ? moment(d?.due_date)?.format('DD-MM-YYYY')
                  : '',
              };
            });
            updatedData = {
              ...data,
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

const clientProjectSlice = createSlice({
  name: 'ClientProject',
  initialState,
  reducers: {
    setClientProjectPageLimit: (state, action) => {
      state.clientProjectPageLimit = action.payload;
    },
    setClientProjectSearchParam: (state, action) => {
      state.clientProjectSearchParam = action.payload;
    },
    setClientProjectCurrentPage: (state, action) => {
      state.clientProjectCurrentPage = action.payload;
    },
    setClientProjectStatus: (state, action) => {
      state.clientProjectStatus = action.payload;
    },
    setIsAddClientComment: (state, action) => {
      state.isAddClientComment = action.payload;
    },
    setIsAddClientOrderNote: (state, action) => {
      state.isAddClientOrderNote = action.payload;
    },
  },
  extraReducers: {
    [getProjectList.pending]: state => {
      state.clientProjectList = {};
      state.clientProjectLoading = true;
    },
    [getProjectList.rejected]: state => {
      state.clientProjectList = {};
      state.clientProjectLoading = false;
    },
    [getProjectList.fulfilled]: (state, action) => {
      state.clientProjectList = action.payload;
      state.clientProjectLoading = false;
    },
    [getClientProjectOverviewData.pending]: state => {
      state.clientProjectOverviewData = {};
      state.clientProjectOverviewLoading = true;
    },
    [getClientProjectOverviewData.rejected]: state => {
      state.clientProjectOverviewData = {};
      state.clientProjectOverviewLoading = false;
    },
    [getClientProjectOverviewData.fulfilled]: (state, action) => {
      state.clientProjectOverviewData = action.payload;
      state.clientProjectOverviewLoading = false;
    },
    [getClientCommentList.pending]: state => {
      state.clientCommentList = [];
      state.clientCommentLoading = true;
    },
    [getClientCommentList.rejected]: state => {
      state.clientCommentList = [];
      state.clientCommentLoading = false;
    },
    [getClientCommentList.fulfilled]: (state, action) => {
      state.clientCommentList = action.payload;
      state.clientCommentLoading = false;
    },
    [addClientComment.pending]: state => {
      state.isAddClientComment = false;
      state.clientCommentLoading = true;
    },
    [addClientComment.rejected]: state => {
      state.isAddClientComment = false;
      state.clientCommentLoading = false;
    },
    [addClientComment.fulfilled]: state => {
      state.isAddClientComment = true;
      state.clientCommentLoading = false;
    },
    [getClientOrderNote.pending]: state => {
      state.ClientOrderNoteList = [];
      state.clientOrderNoteLoading = true;
    },
    [getClientOrderNote.rejected]: state => {
      state.ClientOrderNoteList = [];
      state.clientOrderNoteLoading = false;
    },
    [getClientOrderNote.fulfilled]: (state, action) => {
      state.ClientOrderNoteList = action.payload;
      state.clientOrderNoteLoading = false;
    },
    [addClientOrderNote.pending]: state => {
      state.isAddClientOrderNote = false;
      state.clientOrderNoteLoading = true;
    },
    [addClientOrderNote.rejected]: state => {
      state.isAddClientOrderNote = false;
      state.clientOrderNoteLoading = false;
    },
    [addClientOrderNote.fulfilled]: state => {
      state.isAddClientOrderNote = true;
      state.clientOrderNoteLoading = false;
    },
    [getClientQuotation.pending]: state => {
      state.selectedClientQuotationData = {};
      state.clientQuotationLoading = true;
    },
    [getClientQuotation.rejected]: state => {
      state.selectedClientQuotationData = {};
      state.clientQuotationLoading = false;
    },
    [getClientQuotation.fulfilled]: (state, action) => {
      state.selectedClientQuotationData = action.payload;
      state.clientQuotationLoading = false;
    },
    [getClientQuotationList.pending]: state => {
      state.clientQuotationList = [];
      state.clientQuotationLoading = true;
    },
    [getClientQuotationList.rejected]: state => {
      state.clientQuotationList = [];
      state.clientQuotationLoading = false;
    },
    [getClientQuotationList.fulfilled]: (state, action) => {
      state.clientQuotationList = action.payload;
      state.clientQuotationLoading = false;
    },
    [editClientQuotation.pending]: state => {
      state.isUpdateClientQuotation = false;
      state.clientQuotationLoading = true;
    },
    [editClientQuotation.rejected]: state => {
      state.isUpdateClientQuotation = false;
      state.clientQuotationLoading = false;
    },
    [editClientQuotation.fulfilled]: state => {
      state.isUpdateClientQuotation = true;
      state.clientQuotationLoading = false;
    },
    [getClientBillingList.pending]: state => {
      state.clientBillingList = [];
      state.clientBillingLoading = true;
    },
    [getClientBillingList.rejected]: state => {
      state.clientBillingList = [];
      state.clientBillingLoading = false;
    },
    [getClientBillingList.fulfilled]: (state, action) => {
      state.clientBillingList = action.payload;
      state.clientBillingLoading = false;
    },
    [getClientBilling.pending]: state => {
      state.selectedClientBillingData = {};
      state.clientBillingLoading = true;
    },
    [getClientBilling.rejected]: state => {
      state.selectedClientBillingData = {};
      state.clientBillingLoading = false;
    },
    [getClientBilling.fulfilled]: (state, action) => {
      state.selectedClientBillingData = action.payload;
      state.clientBillingLoading = false;
    },

    [editClientOrder.pending]: state => {
      state.clientEditOrder = {};
      state.clientEditOrderLoading = true;
    },

    [editClientOrder.rejected]: state => {
      state.clientEditOrder = {};
      state.clientEditOrderLoading = false;
    },

    [editClientOrder.fulfilled]: (state, action) => {
      state.clientEditOrder = action.payload;
      state.clientEditOrderLoading = false;
    },
  },
});

export const {
  setClientProjectPageLimit,
  setClientProjectCurrentPage,
  setClientProjectSearchParam,
  setClientProjectStatus,
  setIsAddClientComment,
  setIsAddClientOrderNote,
} = clientProjectSlice.actions;

export default clientProjectSlice.reducer;
