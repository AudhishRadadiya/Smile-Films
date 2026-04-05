import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useFormik } from 'formik';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import CompanySidebar from '../CompanySidebar';
import { DataTable } from 'primereact/datatable';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import {
  addChangeFinancialYear,
  deleteChangeFinancialYear,
  getChangeFinancialYearData,
  getChangeFinancialYearList,
  setChangeYearCurrentPage,
  setChangeYearPageLimit,
  setChangeYearSearchParam,
  setIsAddChangeFinancialYear,
  setIsDeleteChangeFinancialYear,
  setIsUpdateChangeFinancialYear,
  updateChangeFinancialYear,
} from 'Store/Reducers/Settings/Master/ChangeFinancialYearSlice';
import { Tag } from 'primereact/tag';
import Loader from 'Components/Common/Loader';
import { changeFinancialYearTypeSchema } from 'Schema/Setting/masterSettingSchema';

let initialData = {
  financial_year_id: '',
  start_date: '',
  end_date: '',
  isActive: false,
  default: false,
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

const ChangeYear = ({ hasAccess }) => {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;

  const dispatch = useDispatch();

  const [changeYearModel, setChangeYearModel] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [financialYearData, setFinancialYearData] = useState(initialData);

  const {
    changeYearList,
    changeYearLoading,
    isAddChangeFinancialYear,
    isUpdateChangeFinancialYear,
    isDeleteChangeFinancialYear,
    changeYearPageLimit,
    changeYearCurrentPage,
    changeYearSearchParam,
  } = useSelector(({ changeFinancialYear }) => changeFinancialYear);

  const getChangeFinancialYearListApi = useCallback(
    (start = 1, limit = 10, search = '') => {
      dispatch(
        getChangeFinancialYearList({
          start: start,
          limit: limit,
          search: search?.trim(),
          isActive: '',
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getChangeFinancialYearListApi(
      changeYearCurrentPage,
      changeYearPageLimit,
      changeYearSearchParam,
    );
  }, []);

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
      //             dispatch(
      //               getChangeFinancialYearData({ financial_year_id: row?._id }),
      //             )
      //               .then(response => {
      //                 const responseData = response.payload?.data;

      //                 const financialData = {
      //                   financial_year_id: responseData?._id,
      //                   start_date: new Date(responseData?.start_date),
      //                   end_date: new Date(responseData?.end_date),
      //                   isActive: responseData?.isActive,
      //                 };

      //                 setFinancialYearData(financialData);
      //               })
      //               .catch(error => {
      //                 console.error('Error fetching product data:', error);
      //               });

      //             setChangeYearModel(true);
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
              dispatch(
                getChangeFinancialYearData({ financial_year_id: row?._id }),
              )
                .then(response => {
                  const responseData = response.payload?.data;

                  const financialData = {
                    financial_year_id: responseData?._id,
                    start_date: new Date(responseData?.start_date),
                    end_date: new Date(responseData?.end_date),
                    isActive: responseData?.isActive,
                  };

                  setFinancialYearData(financialData);
                })
                .catch(error => {
                  console.error('Error fetching product data:', error);
                });

              setChangeYearModel(true);
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

  const submitHandle = useCallback(
    async values => {
      let res;

      const startDate = moment(values.start_date).format('YYYY-MM-DD');
      const endDate = moment(values.end_date).format('YYYY-MM-DD');

      const payload = {
        ...values,
        end_date: endDate,
        start_date: startDate,
        ...(!!values?.financial_year_id && {
          financial_year_id: values?.financial_year_id,
        }),
      };

      if (values?.financial_year_id) {
        res = await dispatch(updateChangeFinancialYear(payload));
      } else {
        res = await dispatch(addChangeFinancialYear(payload));
      }
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    resetForm,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: financialYearData,
    validationSchema: changeFinancialYearTypeSchema,
    onSubmit: submitHandle,
  });

  useEffect(() => {
    if (
      isAddChangeFinancialYear ||
      isUpdateChangeFinancialYear ||
      isDeleteChangeFinancialYear
    ) {
      getChangeFinancialYearListApi(
        changeYearCurrentPage,
        changeYearPageLimit,
        changeYearSearchParam,
      );
      resetForm();
      setChangeYearModel(false);
      setFinancialYearData(initialData);
    }
    if (isUpdateChangeFinancialYear) {
      dispatch(setIsUpdateChangeFinancialYear(false));
    }
    if (isAddChangeFinancialYear) {
      dispatch(setIsAddChangeFinancialYear(false));
    }
    if (isDeleteChangeFinancialYear) {
      dispatch(setIsDeleteChangeFinancialYear(false));
    }
  }, [
    dispatch,
    isAddChangeFinancialYear,
    isUpdateChangeFinancialYear,
    isDeleteChangeFinancialYear,
  ]);

  const onCancel = useCallback(() => {
    resetForm();
    setChangeYearModel(false);
    setFinancialYearData(initialData);
  }, [resetForm]);

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      financial_year_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteChangeFinancialYear(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const onPageChange = page => {
    if (page !== changeYearCurrentPage) {
      let pageIndex = changeYearCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setChangeYearCurrentPage(pageIndex));
      getChangeFinancialYearListApi(
        pageIndex,
        changeYearPageLimit,
        changeYearSearchParam,
      );
    }
  };

  const onPageRowsChange = page => {
    const currentPage = page === 0 ? 0 : 1;

    dispatch(setChangeYearCurrentPage(currentPage));
    dispatch(setChangeYearPageLimit(page));
    const pageValue =
      page === 0
        ? changeYearList?.totalRows
          ? changeYearList?.totalRows
          : 0
        : page;
    const prevPageValue =
      changeYearPageLimit === 0
        ? changeYearList?.totalRows
          ? changeYearList?.totalRows
          : 0
        : changeYearPageLimit;
    if (
      prevPageValue < changeYearList?.totalRows ||
      pageValue < changeYearList?.totalRows
    ) {
      getChangeFinancialYearListApi(currentPage, page, changeYearSearchParam);
    }
  };

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-between align-items-center">
      <div className="d-flex gap-3 align-items-center">
        <div>
          <Checkbox
            inputId="Active"
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
          <label htmlFor="Active" className="ms-2">
            Active
          </label>
        </div>
        <div>
          <Checkbox
            inputId="Default"
            name="default"
            value={values?.default || false}
            onBlur={handleBlur}
            onChange={handleChange}
            checked={values?.default}
            required
          />
          {touched?.default && errors?.default && (
            <p className="text-danger">{errors?.default}</p>
          )}
          <label htmlFor="Default" className="ms-2">
            Default
          </label>
        </div>
      </div>
      <div className="footer_button">
        <Button className="btn_border_dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="btn_primary" onClick={handleSubmit} type="submit">
          {values?.financial_year_id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );

  const yearBodyTemplate = item => {
    const startDate = moment(item.start_date).format('DD-MM-YYYY');
    const endDate = moment(item.end_date).format('DD-MM-YYYY');

    const formattedDateRange = `${startDate} to ${endDate}`;

    return <div>{formattedDateRange}</div>;
  };

  const statusBodyTemplate = item => {
    return (
      <Tag
        value={item.isActive === true ? 'Active' : 'Inactive'}
        severity={getSeverity(item)}
      ></Tag>
    );
  };

  const handleSearchInput = e => {
    dispatch(setChangeYearCurrentPage(1));
    getChangeFinancialYearList(1, changeYearPageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {changeYearLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col sm={3}>
                  <div className="page_title">
                    <h3 className="m-0">Change Year</h3>
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
                            value={changeYearSearchParam}
                            onChange={e => {
                              debounceHandleSearchInput(e);
                              dispatch(
                                setChangeYearSearchParam(e.target.value),
                              );
                            }}
                          />
                        </div>
                      </li>
                      {is_create_access === true && (
                        <li>
                          <Button
                            onClick={() => {
                              setChangeYearModel(true);
                              setFinancialYearData(initialData);
                            }}
                            className="btn_primary"
                          >
                            <img src={PlusIcon} alt="" /> Add Financial Year
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
                value={changeYearList?.list}
                sortField="price"
                sortOrder={1}
                rows={10}
              >
                <Column
                  field="year"
                  header="Year"
                  sortable
                  body={yearBodyTemplate}
                ></Column>
                <Column field="default" header="Default" sortable></Column>
                <Column
                  field="status"
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
                dataList={changeYearList?.list}
                pageLimit={changeYearPageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={changeYearCurrentPage}
                totalCount={changeYearList?.totalRows}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeletePopup
        moduleName={'device'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Dialog
        header={
          values?.financial_year_id
            ? 'Update Financial Year'
            : 'Add Financial Year'
        }
        visible={changeYearModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={onCancel}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="joining_date">
                  Start Date <span className="text-danger fs-6">*</span>
                </label>
                <Calendar
                  id="Start Date"
                  name="start_date"
                  dateFormat="dd-mm-yy"
                  placeholder="Start Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.start_date || ''}
                  required
                  showIcon
                  showButtonBar
                  readOnlyInput
                />
                {touched?.start_date && errors?.start_date && (
                  <p className="text-danger">{errors?.start_date}</p>
                )}
              </div>
            </Col>
            <Col xs={6}>
              <div className="form_group date_select_wrapper mb-3">
                <label htmlFor="joining_date">
                  End Date <span className="text-danger fs-6">*</span>
                </label>
                <Calendar
                  id="End Date"
                  name="end_date"
                  placeholder="End Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.end_date || ''}
                  dateFormat="dd-mm-yy"
                  showIcon
                  required
                  showButtonBar
                  readOnlyInput
                />
                {touched?.end_date && errors?.end_date && (
                  <p className="text-danger">{errors?.end_date}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
};

export default ChangeYear;
