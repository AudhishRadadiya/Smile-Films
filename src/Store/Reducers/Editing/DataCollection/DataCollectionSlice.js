import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { totalCount } from 'Helper/CommonHelper';

let initialState = {
  dataCollectionList: [],
  dataCollectionLoading: false,
  isAddDataCollection: false,
  isUpdateDataCollection: false,
  isDeleteDataCollection: false,
  dataCollectionPageLimit: 10,
  dataCollectionCurrentPage: 1,
  dataCollectionSearchParam: '',
  dataCollectionStatus: [],
  selectedDataCollectionData: {},
  dataCollectionData: {
    inquiry_no: '',
    create_date: new Date(),
    client_company_id: '',
    editing_hour: '',
    editing_minute: '',
    editing_second: '',
    couple_name: '',
    data_collection_source: [],
    data_size: '',
    data_size_type: '',
    remark: '',
    inquiry_type: 1,
    editingTable: [],
    editing_inquiry: [],
    total_data_collection: 0,
    project_type: '',
  },
  addSelectedDataCollectionData: {},
  updateSelectedDataCollectionData: {},
  isGetInintialValuesDataCollection: {
    add: false,
    update: false,
  },
};

/**
 * @desc list-data_collection
 * @param (limit, start, isActive,search)
 */

export const getDataCollectionList = createAsyncThunk(
  'editing/data_collection/list-data_collection',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/data_collection/list-data_collection', data)
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
 * @desc add-data_collection
 */

export const addDataCollection = createAsyncThunk(
  'editing/data_collection/add-data_collection',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/data_collection/add-data_collection', data)
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
 * @desc edit-data_collection
 */

export const editDataCollection = createAsyncThunk(
  'editing/data_collection/edit-data_collection',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/data_collection/edit-data_collection', data)
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
 * @desc get-data_collection
 */

export const getDataCollection = createAsyncThunk(
  'editing/data_collection/get-data_collection',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('editing/data_collection/get-data_collection', data)
        .then(res => {
          const { data, err, msg } = res?.data;
          const itemList = [];
          let updatedList = data?.orderItems?.map(d => {
            itemList.push(d?.item_id);
            return {
              ...d,
              due_date: new Date(d?.due_date),
            };
          });
          const totalDataCollection = totalCount(updatedList, 'data_size');
          const updated = {
            ...data,
            create_date: new Date(data?.create_date),
            editingTable: updatedList,
            editing_inquiry: itemList,
            client_full_name: data?.client_full_name,
            reference: data?.refrence_value,
            email_id: data?.email_id,
            mobile_no: data?.mobile_no,
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

const dataCollectionSlice = createSlice({
  name: 'dataCollection',
  initialState,
  reducers: {
    setIsDeleteDataCollection: (state, action) => {
      state.isDeleteDataCollection = action.payload;
    },
    setIsUpdateDataCollection: (state, action) => {
      state.isUpdateDataCollection = action.payload;
    },
    setIsAddDataCollection: (state, action) => {
      state.isAddDataCollection = action.payload;
    },
    setDataCollectionCurrentPage: (state, action) => {
      state.dataCollectionCurrentPage = action.payload;
    },
    setDataCollectionPageLimit: (state, action) => {
      state.dataCollectionPageLimit = action.payload;
    },
    setDataCollectionSearchParam: (state, action) => {
      state.dataCollectionSearchParam = action.payload;
    },
    setDataCollectionList: (state, action) => {
      state.dataCollectionList = action.payload;
    },
    setDataCollectionStatus: (state, action) => {
      state.dataCollectionStatus = action.payload;
    },
    setAddSelectedDataCollectionData: (state, action) => {
      state.addSelectedDataCollectionData = action.payload;
    },
    setIsGetInintialValuesDataCollection: (state, action) => {
      state.isGetInintialValuesDataCollection = action.payload;
    },
    clearAddSelectedDataCollectionData: state => {
      state.addSelectedDataCollectionData = initialState.dataCollectionData;
    },
    setUpdateSelectedDataCollectionData: (state, action) => {
      state.updateSelectedDataCollectionData = action.payload;
    },
    clearUpdateSelectedDataCollectionData: state => {
      state.updateSelectedDataCollectionData = initialState.dataCollectionData;
    },
  },
  extraReducers: {
    [getDataCollectionList.pending]: state => {
      state.dataCollectionList = [];
      state.dataCollectionLoading = true;
    },
    [getDataCollectionList.rejected]: state => {
      state.dataCollectionList = [];
      state.dataCollectionLoading = false;
    },
    [getDataCollectionList.fulfilled]: (state, action) => {
      state.dataCollectionList = action.payload;
      state.dataCollectionLoading = false;
    },

    [addDataCollection.pending]: state => {
      state.isAddDataCollection = false;
      state.dataCollectionLoading = true;
    },
    [addDataCollection.rejected]: state => {
      state.isAddDataCollection = false;
      state.dataCollectionLoading = false;
    },
    [addDataCollection.fulfilled]: state => {
      state.isAddDataCollection = true;
      state.dataCollectionLoading = false;
    },
    [editDataCollection.pending]: state => {
      state.isUpdateDataCollection = false;
      state.dataCollectionLoading = true;
    },
    [editDataCollection.rejected]: state => {
      state.isUpdateDataCollection = false;
      state.dataCollectionLoading = false;
    },
    [editDataCollection.fulfilled]: state => {
      state.isUpdateDataCollection = true;
      state.dataCollectionLoading = false;
    },
    [deleteDataCollection.pending]: state => {
      state.isDeleteDataCollection = false;
      state.dataCollectionLoading = true;
    },
    [deleteDataCollection.rejected]: state => {
      state.isDeleteDataCollection = false;
      state.dataCollectionLoading = false;
    },
    [deleteDataCollection.fulfilled]: state => {
      state.isDeleteDataCollection = true;
      state.dataCollectionLoading = false;
    },
    [getDataCollection.pending]: state => {
      state.selectedDataCollectionData = {};
      state.dataCollectionLoading = true;
    },
    [getDataCollection.rejected]: state => {
      state.selectedDataCollectionData = {};
      state.dataCollectionLoading = false;
    },
    [getDataCollection.fulfilled]: (state, action) => {
      state.selectedDataCollectionData = action.payload;
      state.dataCollectionLoading = false;
    },
  },
});

export const {
  setIsAddDataCollection,
  setIsUpdateDataCollection,
  setIsDeleteDataCollection,
  setDataCollectionList,
  setDataCollectionSearchParam,
  setDataCollectionPageLimit,
  setDataCollectionCurrentPage,
  setDataCollectionStatus,
  setAddSelectedDataCollectionData,
  setIsGetInintialValuesDataCollection,
  clearAddSelectedDataCollectionData,
  setUpdateSelectedDataCollectionData,
  clearUpdateSelectedDataCollectionData,
} = dataCollectionSlice.actions;

export default dataCollectionSlice.reducer;
