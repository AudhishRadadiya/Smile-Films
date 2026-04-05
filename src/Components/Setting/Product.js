import React, { useState, useCallback, useEffect } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../Assets/Images/plus.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanySidebar from './CompanySidebar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
// import { Editor } from 'primereact/editor';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { useFormik } from 'formik';
import { productSchema } from 'Schema/Setting/masterSettingSchema';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from 'primereact/radiobutton';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductList,
  setProductCurrentPage,
  setProductPageLimit,
  setIsAddProduct,
  setIsDeleteProduct,
  setIsUpdateProduct,
  setProductSearchParam,
  getProductData,
} from 'Store/Reducers/Settings/Master/ProductSlice';
import { InputNumber } from 'primereact/inputnumber';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';

let initalData = {
  item_name: '',
  type: 1,
  item_description: '',
  item_price: 0,
  isActive: true,
};

export default function Product({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    productList,
    productCurrentPage,
    productPageLimit,
    isAddProduct,
    isUpdateProduct,
    isDeleteProduct,
    productSearchParam,
    productLoading,
  } = useSelector(({ product }) => product);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [productModel, setProductModel] = useState(false);

  const [productDataValue, setProductDataValue] = useState(initalData);

  const getProductListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getProductList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getProductListApi(productCurrentPage, productPageLimit, productSearchParam);
  }, []);

  useEffect(() => {
    if (isAddProduct || isUpdateProduct || isDeleteProduct) {
      getProductListApi(
        productCurrentPage,
        productPageLimit,
        productSearchParam,
      );
      resetForm();
      setProductDataValue(initalData);
      setProductModel(false);
    }
    if (isUpdateProduct) {
      dispatch(setIsUpdateProduct(false));
    }
    if (isAddProduct) {
      dispatch(setIsAddProduct(false));
    }
    if (isDeleteProduct) {
      dispatch(setIsDeleteProduct(false));
    }
  }, [dispatch, isAddProduct, isUpdateProduct, isDeleteProduct]);

  // const renderHeader = () => {
  //   return (
  //     <>
  //       <span className="ql-formats">
  //         <button className="ql-bold" aria-label="Bold"></button>
  //         <button className="ql-italic" aria-label="Italic"></button>
  //         <button className="ql-underline" aria-label="Underline"></button>
  //       </span>
  //       <span className="ql-formats">
  //         <button className="ql-color ql-picker ql-color-picker">
  //           <span className="ql-picker-label"></span>
  //           <span className="ql-picker-options"></span>
  //         </button>

  //         <button className="ql-list" aria-label="Ordered List"></button>
  //         <button className="ql-list" aria-label="Unordered List"></button>
  //       </span>
  //     </>
  //   );
  // };

  // const header = renderHeader();

  const actionBodyTemplate = row => {
    return (
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle
      //       id="dropdown-basic"
      //       className="action_btn"
      //       disabled={is_edit_access || is_delete_access ? false : true}
      //     >
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       {is_edit_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             dispatch(getProductData({ product_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setProductDataValue(responseData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching product data:', error);
      //               });
      //             setProductModel(true);
      //           }}
      //         >
      //           <img src={EditIcon} alt="EditIcon" /> Edit
      //         </Dropdown.Item>
      //       )}
      //       {is_delete_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             setDeleteId(row?._id);
      //             setDeletePopup(true);
      //           }}
      //         >
      //           <img src={TrashIcon} alt="TrashIcon" /> Delete
      //         </Dropdown.Item>
      //       )}
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        {is_edit_access && (
          <img
            alt=""
            src={EditIcon}
            className="cursor_pointer"
            onClick={() => {
              dispatch(getProductData({ product_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setProductDataValue(responseData);
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });
              setProductModel(true);
            }}
          />
        )}
        {is_delete_access && (
          <img
            src={TrashIcon}
            alt=""
            className="cursor_pointer"
            onClick={() => {
              setDeleteId(row?._id);
              setDeletePopup(true);
            }}
          />
        )}
      </div>
    );
  };

  const itemTypeBodyTemplate = value => {
    return value?.type === 1 ? 'Editing' : 'Exposing';
  };

  const statusBodyTemplate = product => {
    return (
      <Tag
        value={product.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(product)}
      ></Tag>
    );
  };

  const descBodyTemplate = product => {
    // const parsedContent =
    //   new DOMParser().parseFromString(product.item_description, 'text/html')
    //     .body.textContent || '';

    // const firstLine = parsedContent
    //   .split('\n')
    //   .find(line => line.trim() !== '');
    // return <p>{firstLine}</p>;
    return (
      <div dangerouslySetInnerHTML={{ __html: product?.item_description }} />
    );
  };

  const getSeverity = product => {
    switch (product.isActive) {
      case true:
        return 'active';

      case false:
        return 'inactive';

      default:
        return null;
    }
  };

  const onPageChange = useCallback(
    page => {
      if (page !== productCurrentPage) {
        let pageIndex = productCurrentPage;
        if (page?.page === 'Prev') pageIndex--;
        else if (page?.page === 'Next') pageIndex++;
        else pageIndex = page;
        dispatch(setProductCurrentPage(pageIndex));
        getProductListApi(pageIndex, productPageLimit, productSearchParam);
      }
    },
    [
      dispatch,
      getProductListApi,
      productCurrentPage,
      productPageLimit,
      productSearchParam,
    ],
  );

  const onPageRowsChange = useCallback(
    page => {
      dispatch(setProductCurrentPage(page === 0 ? 0 : 1));
      dispatch(setProductPageLimit(page));
      const pageValue =
        page === 0
          ? productList?.totalRows
            ? productList?.totalRows
            : 0
          : page;
      const prevPageValue =
        productPageLimit === 0
          ? productList?.totalRows
            ? productList?.totalRows
            : 0
          : productPageLimit;
      if (
        prevPageValue < productList?.totalRows ||
        pageValue < productList?.totalRows
      ) {
        getProductListApi(page === 0 ? 0 : 1, page, productSearchParam);
      }
    },
    [
      dispatch,
      productPageLimit,
      getProductListApi,
      productSearchParam,
      productList?.totalRows,
    ],
  );

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      product_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteProduct(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          item_name: values?.item_name,
          item_description: values?.item_description,
          product_id: values?._id,
          item_price: values?.item_price,
          isActive: values?.isActive,
          type: values?.type,
        };
        dispatch(editProduct(payload));
      } else {
        dispatch(addProduct(values));
      }
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: productDataValue,
    validationSchema: productSchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    resetForm();
    setProductDataValue(initalData);
    setProductModel(false);
  }, [resetForm]);

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Checkbox
          inputId="ingredient1"
          name="isActive"
          value={values?.isActive || false}
          onBlur={handleBlur}
          onChange={handleChange}
          checked={values?.isActive}
          required
        />
        {touched?.isActive && errors?.isActive && (
          <p className="text-danger">{errors?.isActive}</p>
        )}
        <label htmlFor="ingredient1" className="ms-2">
          Active
        </label>
      </div>
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          {values?._id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const handleSearchInput = e => {
    dispatch(setProductCurrentPage(1));
    getProductListApi(1, productPageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {productLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Product(Item)</h3>
                  </div>
                </Col>
                <Col sm={9}>
                  <div className="right_filter_wrapper">
                    <ul>
                      <li>
                        <div className="form_group">
                          <InputText
                            id="search"
                            placeholder="Search"
                            type="search"
                            className="input_wrap small search_wrap"
                            value={productSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setProductSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setProductDataValue(initalData);
                              setProductModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Product
                          </Button>
                        </li>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper">
              <DataTable
                value={productList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column field="item_name" header="Item Name" sortable></Column>
                <Column
                  field="type"
                  header="Item Type"
                  body={itemTypeBodyTemplate}
                ></Column>
                <Column
                  field="item_description"
                  header="Description"
                  className="with_concate"
                  sortable
                  body={descBodyTemplate}
                ></Column>
                <Column field="item_price" header="Price" sortable></Column>
                <Column
                  field="isActive"
                  header="Status"
                  sortable
                  body={statusBodyTemplate}
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                  style={{ width: '8%' }}
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={productList?.list}
                pageLimit={productPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={productCurrentPage}
                totalCount={productList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'product(item)'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Product' : 'Create Product'}
        visible={productModel}
        draggable={false}
        className="modal_Wrapper modal_medium"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Name">
                  Item Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="Name"
                  placeholder="Item Name"
                  className="input_wrap"
                  value={values?.item_name}
                  name="item_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {touched?.item_name && errors?.item_name && (
                  <p className="text-danger">{errors?.item_name}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Price">Price</label>
                <InputNumber
                  id="Price"
                  placeholder="Price"
                  name="item_price"
                  useGrouping={false}
                  maxFractionDigits={2}
                  value={values?.item_price}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue('item_price', e.value);
                  }}
                  required
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group radio_wrapper d-flex flex-wrap align-items-center mb20">
                <label className="me-3">
                  Item Type <span className="text-danger fs-6">*</span>
                </label>
                <div className="radio-inner-wrap d-flex align-items-center me-3">
                  <RadioButton
                    inputId="Editing"
                    name="type"
                    value={1}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.type === 1}
                  />
                  <label htmlFor="ingredient1" className="ms-sm-2 ms-1">
                    Editing
                  </label>
                </div>
                <div className="radio-inner-wrap d-flex align-items-center">
                  <RadioButton
                    inputId="Exposing"
                    name="type"
                    value={2}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values?.type === 2}
                  />
                  <label htmlFor="ingredient2" className="ms-sm-2 ms-1">
                    Exposing
                  </label>
                </div>
                {touched?.type && errors?.type && (
                  <p className="text-danger">{errors?.type}</p>
                )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group">
                <label htmlFor="Description">Description</label>
                {/* <Editor
                  name="item_description"
                  value={values?.item_description}
                  onTextChange={e =>
                    setFieldValue('item_description', e.textValue)
                  }
                  headerTemplate={header}
                  style={{ height: '235px' }}
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  name="item_description"
                  value={values?.item_description}
                  onChange={content =>
                    setFieldValue('item_description', content)
                  }
                  style={{ height: '235px' }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
