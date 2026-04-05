import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  productList: {},
  productLoading: false,
  isAddProduct: false,
  isUpdateProduct: false,
  isDeleteProduct: false,
  productPageLimit: 10,
  productCurrentPage: 1,
  productSearchParam: '',
  productData: {},
};

/**
 * @desc getProductList
 * @param (limit, start, isActive,search)
 */

export const getProductList = createAsyncThunk('setting/product/list', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/product/list', data)
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
});

/**
 * @desc createProduct
 */

export const addProduct = createAsyncThunk('setting/product/create', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/product/create', data)
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
        toast.error(errors?.response?.data?.msg);
        reject(errors);
      });
  });
});

/**
 * @desc updateProduct
 */

export const editProduct = createAsyncThunk('setting/product/edit', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/product/edit', data)
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
        // toast.error(errors);
        toast.error(errors?.response?.data?.msg);
        reject(errors);
      });
  });
});

/**
 * @desc deleteProduct
 */

export const deleteProduct = createAsyncThunk(
  'setting/product/delete',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('setting/product/delete', data)
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
 * @desc getProduct
 * @param (product_id)
 */

export const getProductData = createAsyncThunk('setting/product/get', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('setting/product/get', data)
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

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductCurrentPage: (state, action) => {
      state.productCurrentPage = action.payload;
    },
    setProductPageLimit: (state, action) => {
      state.productPageLimit = action.payload;
    },
    setIsDeleteProduct: (state, action) => {
      state.isDeleteProduct = action.payload;
    },
    setIsUpdateProduct: (state, action) => {
      state.isUpdateProduct = action.payload;
    },
    setIsAddProduct: (state, action) => {
      state.isAddProduct = action.payload;
    },
    setProductSearchParam: (state, action) => {
      state.productSearchParam = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
  },
  extraReducers: {
    [getProductList.pending]: state => {
      state.productLoading = true;
    },
    [getProductList.rejected]: state => {
      state.productList = {};
      state.productLoading = false;
    },
    [getProductList.fulfilled]: (state, action) => {
      state.productList = action.payload?.data;
      state.productLoading = false;
    },
    [addProduct.pending]: state => {
      state.isAddProduct = false;
      state.productLoading = true;
    },
    [addProduct.rejected]: state => {
      state.isAddProduct = false;
      state.productLoading = false;
    },
    [addProduct.fulfilled]: state => {
      state.isAddProduct = true;
      state.productLoading = false;
    },
    [editProduct.pending]: state => {
      state.isUpdateProduct = false;
      state.productLoading = true;
    },
    [editProduct.rejected]: state => {
      state.isUpdateProduct = false;
      state.productLoading = false;
    },
    [editProduct.fulfilled]: state => {
      state.isUpdateProduct = true;
      state.productLoading = false;
    },
    [deleteProduct.pending]: state => {
      state.isDeleteProduct = false;
      state.productLoading = true;
    },
    [deleteProduct.rejected]: state => {
      state.isDeleteProduct = false;
      state.productLoading = false;
    },
    [deleteProduct.fulfilled]: state => {
      state.isDeleteProduct = true;
      state.productLoading = false;
    },
    [getProductData.pending]: state => {
      state.productLoading = true;
    },
    [getProductData.rejected]: state => {
      state.productData = {};
      state.productLoading = false;
    },
    [getProductData.fulfilled]: (state, action) => {
      state.productData = action.payload?.data;
      state.productLoading = false;
    },
  },
});

export const {
  setProductCurrentPage,
  setProductPageLimit,
  setIsAddProduct,
  setIsUpdateProduct,
  setIsDeleteProduct,
  setProductSearchParam,
  setProductList,
} = productSlice.actions;

export default productSlice.reducer;
