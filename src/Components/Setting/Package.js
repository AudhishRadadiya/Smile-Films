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
import ReactSelectSingle from '../Common/ReactSelectSingle';
// import { Editor } from 'primereact/editor';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from 'primereact/radiobutton';
import {
  addPackage,
  deletePackage,
  editPackage,
  getPackageList,
  setPackageCurrentPage,
  setPackagePageLimit,
  setIsAddPackage,
  setIsDeletePackage,
  setIsUpdatePackage,
  setPackageSearchParam,
  getPackageData,
} from 'Store/Reducers/Settings/Master/PackageSlice';
import { useFormik } from 'formik';
import { getProjectTypeList } from 'Store/Reducers/Settings/Master/ProjectTypeSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { packageSchema } from 'Schema/Setting/masterSettingSchema';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { InputNumber } from 'primereact/inputnumber';

let initialData = {
  id: '',
  package_name: '',
  type: 1,
  items: '',
  project_type: '',
  price: 0,
  remark: '',
  isActive: true,
};

export default function Package({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const {
    packageList,
    packageCurrentPage,
    packagePageLimit,
    isAddPackage,
    isUpdatePackage,
    isDeletePackage,
    packageSearchParam,
    packageLoading,
  } = useSelector(({ packages }) => packages);

  const { productList, productLoading } = useSelector(({ product }) => product);
  const { projectTypeList, projectTypeLoading } = useSelector(
    ({ projectType }) => projectType,
  );

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [productModel, setProductModel] = useState(false);
  const [packageDataValue, setPackageDataValue] = useState({});
  const [dropdownOptionList, setDropdownOptionList] = useState({
    productTypeOptionList: [],
    ItemOptionList: [],
  });

  const getPackageListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getPackageList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
        }),
      );
    },
    [dispatch],
  );

  // let packageData = {
  //   id: packageDataValue?._id || '',
  //   package_name: packageDataValue?.package_name || '',
  //   items: packageDataValue?.items || '',
  //   project_type: packageDataValue?.project_type || '',
  //   price: packageDataValue?.price || '',
  //   remark: packageDataValue?.remark || '',
  //   isActive: packageDataValue?.isActive || false,
  // };

  useEffect(() => {
    getPackageListApi(packageCurrentPage, packagePageLimit, packageSearchParam);
  }, []);

  useEffect(() => {
    if (isAddPackage || isUpdatePackage || isDeletePackage) {
      getPackageListApi(
        packageCurrentPage,
        packagePageLimit,
        packageSearchParam,
      );
      setPackageDataValue(initialData);
      resetForm();
      setProductModel(false);
    }
    if (isUpdatePackage) {
      dispatch(setIsUpdatePackage(false));
    }
    if (isAddPackage) {
      dispatch(setIsAddPackage(false));
    }
    if (isDeletePackage) {
      dispatch(setIsDeletePackage(false));
    }
  }, [dispatch, isAddPackage, isUpdatePackage, isDeletePackage]);

  const getRequiredList = useCallback(type => {
    dispatch(
      getProjectTypeList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: type,
      }),
    );
  }, []);

  useEffect(() => {
    if (productList?.list?.length > 0 && projectTypeList?.list?.length > 0) {
      const itemData = productList?.list?.map(item => {
        return { label: item?.item_name, value: item?._id };
      });
      const productTypeData = projectTypeList?.list?.map(item => {
        return { label: item?.project_type, value: item?._id };
      });

      setDropdownOptionList({
        ...dropdownOptionList,
        ItemOptionList: itemData,
        productTypeOptionList: productTypeData,
      });
    }
  }, [productList, projectTypeList]);

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
      //       {' '}
      //       {is_edit_access && (
      //         <Dropdown.Item
      //           onClick={() => {
      //             dispatch(getPackageData({ package_id: row?._id }))
      //               .then(response => {
      //                 const responseData = response.payload?.data;
      //                 setPackageDataValue(responseData);
      //                 getRequiredList(responseData?.type);
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
              dispatch(getPackageData({ package_id: row?._id }))
                .then(response => {
                  const responseData = response.payload?.data;
                  setPackageDataValue(responseData);
                  getRequiredList(responseData?.type);
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

  const itemBodyTemplate = value => {
    let commaSeparatedString;
    const items = value?.items_name;
    if (items?.length === 1) {
      commaSeparatedString = items[0];
    } else {
      commaSeparatedString = items?.join(', ');
    }
    return commaSeparatedString;
  };

  const statusBodyTemplate = product => {
    return (
      <Tag
        value={product.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(product)}
      ></Tag>
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

  const onPageChange = page => {
    if (page !== packageCurrentPage) {
      let pageIndex = packageCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setPackageCurrentPage(pageIndex));
      getPackageListApi(pageIndex, packagePageLimit, packageSearchParam);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setPackageCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPackagePageLimit(page));
    const pageValue =
      page === 0 ? (packageList?.totalRows ? packageList?.totalRows : 0) : page;
    const prevPageValue =
      packagePageLimit === 0
        ? packageList?.totalRows
          ? packageList?.totalRows
          : 0
        : packagePageLimit;
    if (
      prevPageValue < packageList?.totalRows ||
      pageValue < packageList?.totalRows
    ) {
      getPackageListApi(page === 0 ? 0 : 1, page, packageSearchParam);
    }
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      package_id: deleteId,
    };
    if (deleteId) {
      dispatch(deletePackage(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const submitHandle = useCallback(
    values => {
      if (values?._id) {
        const payload = {
          ...values,
          package_id: values?._id,
        };
        dispatch(editPackage(payload));
      } else {
        dispatch(addPackage(values));
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
    initialValues: packageDataValue,
    validationSchema: packageSchema,
    onSubmit: submitHandle,
  });

  const onCancel = useCallback(() => {
    setPackageDataValue(initialData);
    resetForm();
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
    dispatch(setPackageCurrentPage(1));
    getPackageListApi(1, packagePageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handleInquiryTypeChange = (fieldName, fieldValue) => {
    setFieldValue(fieldName, fieldValue);
    setFieldValue('items', '');

    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: fieldValue,
      }),
    );
  };

  return (
    <div className="main_Wrapper">
      {(packageLoading || projectTypeLoading || productLoading) && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Package</h3>
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
                            value={packageSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(setPackageSearchParam(e.target.value));
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              getRequiredList(initialData?.type);
                              setPackageDataValue(initialData);
                              setProductModel(true);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Create Package
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
                value={packageList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="package_name"
                  header="Package Name"
                  sortable
                ></Column>
                <Column
                  field="type"
                  header="Item Type"
                  body={itemTypeBodyTemplate}
                ></Column>
                <Column
                  field="items_name"
                  header="Item"
                  body={itemBodyTemplate}
                  sortable
                ></Column>
                {/* <Column
                  field="remark"
                  header="Description"
                  className="with_concate"
                  sortable
                ></Column> */}
                <Column
                  field="project_type_name"
                  header="Project Type"
                  sortable
                ></Column>
                <Column field="price" header="Price" sortable></Column>
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
                ></Column>
              </DataTable>
              <CustomPaginator
                dataList={packageList?.list}
                pageLimit={packagePageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={packageCurrentPage}
                totalCount={packageList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'package'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={values?._id ? 'Update Package' : 'Create Package'}
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
                  Package Name <span className="text-danger fs-6">*</span>
                </label>
                <InputText
                  id="Name"
                  placeholder="Package Name"
                  className="input_wrap"
                  value={values?.package_name || ''}
                  name="package_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched?.package_name && errors?.package_name && (
                  <p className="text-danger">{errors?.package_name}</p>
                )}
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
                    onChange={e => {
                      handleInquiryTypeChange(
                        e?.target?.name,
                        e?.target?.value,
                      );
                    }}
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
                    onChange={e => {
                      handleInquiryTypeChange(
                        e?.target?.name,
                        e?.target?.value,
                      );
                    }}
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

            <Col sm={6}>
              <div className="form_group mb-3">
                <label>
                  Items <span className="text-danger fs-6">*</span>
                </label>
                <MultiSelect
                  options={dropdownOptionList?.ItemOptionList}
                  value={values?.items || ''}
                  name="items"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Items"
                  className="w-100"
                />
                {touched?.items && errors?.items && (
                  <p className="text-danger">{errors?.items}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>
                  Project Type <span className="text-danger fs-6">*</span>
                </label>
                <ReactSelectSingle
                  filter
                  options={dropdownOptionList?.productTypeOptionList}
                  value={values?.project_type || ''}
                  name="project_type"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Project Type"
                />
                {touched?.project_type && errors?.project_type && (
                  <p className="text-danger">{errors?.project_type}</p>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label htmlFor="Price">Price</label>
                {/* <InputText
                  id="Price"
                  placeholder="Price"
                  className="input_wrap"
                  name="price"
                  useGrouping={false}
                  value={values?.price || ''}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                /> */}
                <InputNumber
                  placeholder="Price"
                  name="price"
                  className="w-100"
                  useGrouping={false}
                  value={values?.price}
                  maxFractionDigits={2}
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue(e?.originalEvent?.target?.name, e?.value);
                  }}
                  required
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group">
                <label htmlFor="Description">Description</label>
                {/* <Editor
                  name="remark"
                  value={values?.remark}
                  onTextChange={e => setFieldValue('remark', e.textValue)}
                  style={{ height: '235px' }}
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  name="remark"
                  value={values?.remark}
                  style={{ height: '235px' }}
                  onChange={content => setFieldValue('remark', content)}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
