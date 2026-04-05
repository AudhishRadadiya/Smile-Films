import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { InputNumber } from 'primereact/inputnumber';
import { checkWordLimit } from 'Helper/CommonHelper';
import { InquiryStatusList } from 'Helper/CommonList';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  addDeletedHistory,
  getDeletedHistoryList,
  setIsCompletedProject,
  setDeletedHistoryList,
  setSelectedDeletedHistory,
  setDeletedHistoryPageLimit,
  setDeletedHistorySearchParam,
  setDeletedHistoryCurrentPage,
  setCompletedDeletedHistoryList,
} from 'Store/Reducers/ActivityOverview/DeletedHistory/DeletedHistorySlice';
import { deletedHistorySchema } from 'Schema/ActivityOverview/activityOverviewSchema';

const getSeverity = product => {
  switch (product) {
    case 'In Progress':
      return 'warning';
    case 'Pending':
      return 'primary';
    case 'Completed':
      return 'success';
    case 'Initial':
      return 'info';
    case 'Cancelled':
      return 'danger';
    default:
      return null;
  }
};

export default function DeletedHistory() {
  const dispatch = useDispatch();

  const [showDeletedHistoryPopup, setShowDeletedHistoryPopup] = useState(false);

  const {
    deletedHistoryListLoading,
    addDeletedHistoryLoading,
    isCompletedProject,
    deletedHistoryList,
    selectedDeletedHistory,
    completedDeletedHistoryList,

    deletedHistoryPageLimit,
    deletedHistoryCurrentPage,
    deletedHistorySearchParam,
  } = useSelector(({ deletedHistory }) => deletedHistory);

  const getDeletedHistoryListApi = useCallback(
    (start = 1, limit = 10, search = '', completed_project = '') => {
      dispatch(
        getDeletedHistoryList({
          start: start,
          limit: limit,
          search: search?.trim(),
          completed_project: completed_project,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getDeletedHistoryListApi(
      deletedHistoryCurrentPage,
      deletedHistoryPageLimit,
      deletedHistorySearchParam,
      isCompletedProject,
    );
  }, []);

  const onPageChange = page => {
    if (page !== deletedHistoryCurrentPage) {
      let pageIndex = deletedHistoryCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setDeletedHistoryCurrentPage(pageIndex));

      getDeletedHistoryListApi(
        pageIndex,
        deletedHistoryPageLimit,
        deletedHistorySearchParam,
        isCompletedProject,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setDeletedHistoryCurrentPage(page === 0 ? 0 : 1));
    dispatch(setDeletedHistoryPageLimit(page));

    const deletedHistoryData = isCompletedProject
      ? completedDeletedHistoryList
      : deletedHistoryList;

    const pageValue =
      page === 0
        ? deletedHistoryData?.totalRows
          ? deletedHistoryData?.totalRows
          : 0
        : page;

    const prevPageValue =
      deletedHistoryPageLimit === 0
        ? deletedHistoryData?.totalRows
          ? deletedHistoryData?.totalRows
          : 0
        : deletedHistoryPageLimit;
    if (
      prevPageValue < deletedHistoryData?.totalRows ||
      pageValue < deletedHistoryData?.totalRows
    ) {
      getDeletedHistoryListApi(
        page === 0 ? 0 : 1,
        page,
        deletedHistorySearchParam,
        isCompletedProject,
      );
    }
  };

  const handleSearchInput = (e, pageLimit, isCompleted) => {
    dispatch(setDeletedHistoryCurrentPage(1));

    getDeletedHistoryListApi(1, pageLimit, e.target.value?.trim(), isCompleted);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const handlefieldChange = (e, eventValue, rowData) => {
    const value = eventValue;
    const name = e.target.name;

    const updateCompletedHistoryData = [...completedDeletedHistoryList?.list];

    const updatedList = updateCompletedHistoryData?.map(item => {
      if (item?._id === rowData?._id) {
        const updatedObj = {
          ...item,
          [name]: value,
        };
        if (value) {
          dispatch(setSelectedDeletedHistory(updatedObj));
        } else {
          dispatch(setSelectedDeletedHistory({}));
        }
        return updatedObj;
      } else {
        return {
          ...item,
          is_disabled: value ? true : false,
        };
      }
    });

    if (isCompletedProject) {
      dispatch(
        setCompletedDeletedHistoryList({
          ...completedDeletedHistoryList,
          list: updatedList,
        }),
      );
    } else {
      dispatch(
        setDeletedHistoryList({
          ...deletedHistoryList,
          list: updatedList,
        }),
      );
    }
  };

  const selectionTemplate = (data, row) => {
    const fieldName = row?.column?.props?.field;
    return (
      <Checkbox
        name={fieldName}
        onChange={e => {
          handlefieldChange(e, e.target.checked, data);
        }}
        checked={data[fieldName]}
        disabled={data?.is_disabled}
      />
    );
  };

  const statusBodyTemplate = product => {
    const Status = InquiryStatusList?.find(
      item => item?.value === product?.inquiry_status,
    );
    return (
      <Tag value={Status?.label} severity={getSeverity(Status?.label)}></Tag>
    );
  };

  const handleCompletedHistoryDataTable = () => {
    return (
      <div className="data_table_wrapper">
        <DataTable
          value={completedDeletedHistoryList?.list}
          sortField="price"
          sortOrder={1}
          rows={10}
        >
          <Column
            field="select_completed_history"
            style={{ zIndex: '10', minWidth: '82px' }}
            body={selectionTemplate}
            frozen
          ></Column>
          <Column field="inquiry_no" header="Order No." sortable></Column>
          <Column field="create_date" header="Create Date" sortable></Column>
          <Column field="company_name" header="Company Name" sortable></Column>
          <Column field="couple_name" header="Client Name" sortable></Column>
          <Column field="item_name" header="Item Names" sortable></Column>
          <Column field="data_size" header="Data Size" sortable></Column>
          <Column
            field="last_modify_date"
            header="Last Modified Date"
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            sortable
            body={statusBodyTemplate}
            className="with_concate"
          ></Column>
        </DataTable>
        <CustomPaginator
          dataList={completedDeletedHistoryList?.list}
          pageLimit={deletedHistoryPageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={deletedHistoryCurrentPage}
          totalCount={completedDeletedHistoryList?.totalRows}
        />
      </div>
    );
  };

  const itemNameTemplate = rowData => {
    return <span>{rowData?.item_name?.join(', ')}</span>;
  };

  const handleDeletedHistoryDataTable = () => {
    return (
      <div className="data_table_wrapper">
        <DataTable
          value={deletedHistoryList?.list}
          sortField="price"
          sortOrder={1}
          rows={10}
        >
          <Column field="inquiry_no" header="Order No." sortable></Column>
          <Column field="create_date" header="Create Date" sortable></Column>
          <Column field="company_name" header="Company Name" sortable></Column>
          <Column field="client_name" header="Client Name" sortable></Column>
          <Column field="inquiry_type" header="Inquiry Type" sortable></Column>
          <Column
            field="item_name"
            header="Item Names"
            body={itemNameTemplate}
            sortable
          ></Column>
          <Column field="confirm_by" header="Confirm By" sortable></Column>
          <Column field="delete_date" header="Deleting Date" sortable></Column>
          <Column
            field="describe"
            header="Describe"
            sortable
            className="with_concate"
          ></Column>
        </DataTable>
        <CustomPaginator
          dataList={deletedHistoryList?.list}
          pageLimit={deletedHistoryPageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={deletedHistoryCurrentPage}
          totalCount={deletedHistoryList?.totalRows}
        />
      </div>
    );
  };

  const submitHandle = useCallback(
    value => {
      dispatch(
        addDeletedHistory({
          order_id: value?._id,
          no_of_files_deleting: value?.no_of_files_deleting,
          describe: value?.description,
        }),
      )
        .then(res => {
          setShowDeletedHistoryPopup(false);

          getDeletedHistoryListApi(
            deletedHistoryCurrentPage,
            deletedHistoryPageLimit,
            deletedHistorySearchParam,
            isCompletedProject,
          );
        })
        .catch(err => {
          console.error('error', err);
        });
    },
    [
      dispatch,
      isCompletedProject,
      deletedHistoryPageLimit,
      deletedHistoryCurrentPage,
      deletedHistorySearchParam,
    ],
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
    initialValues: {
      description: '',
      no_of_files_deleting: '',
    },
    validationSchema: deletedHistorySchema,
    onSubmit: submitHandle,
  });

  const footerContent = (
    <div className="footer_button">
      <Button
        className="btn_border_dark"
        onClick={() => {
          setShowDeletedHistoryPopup(false);
          resetForm();
        }}
      >
        Cancel
      </Button>
      <Button className="btn_primary" onClick={handleSubmit} type="submit">
        Confirm
      </Button>
    </div>
  );

  return (
    <>
      {(deletedHistoryListLoading || addDeletedHistoryLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center gy-3">
              <Col md={4}>
                <div className="page_title">
                  <h3 className="m-0">Deleted History</h3>
                </div>
              </Col>
              <Col md={8}>
                <div className="right_filter_wrapper">
                  <ul className="deleted_ul">
                    <li>
                      <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                        <div className="form_group checkbox_wrap">
                          <Checkbox
                            onChange={e => {
                              dispatch(setIsCompletedProject(e.checked));
                              dispatch(setDeletedHistoryList({}));
                              dispatch(setCompletedDeletedHistoryList({}));
                              dispatch(setDeletedHistoryCurrentPage(1));
                              dispatch(setDeletedHistoryPageLimit(10));
                              dispatch(setDeletedHistorySearchParam(''));

                              getDeletedHistoryListApi(1, 10, '', e.checked);
                            }}
                            checked={isCompletedProject}
                          ></Checkbox>
                        </div>
                        <span>Show Completed Project</span>
                      </div>
                    </li>
                    <li>
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={deletedHistorySearchParam}
                          onChange={e => {
                            debounceHandleSearchInput(
                              e,
                              deletedHistoryPageLimit,
                              isCompletedProject,
                            );
                            dispatch(
                              setDeletedHistorySearchParam(e.target.value),
                            );
                          }}
                        />
                      </div>
                    </li>
                    {isCompletedProject && (
                      <li>
                        <Button
                          className="btn_primary"
                          onClick={() => setShowDeletedHistoryPopup(true)}
                          disabled={
                            completedDeletedHistoryList?.list?.length &&
                            Object.keys(selectedDeletedHistory)?.length
                              ? false
                              : true
                          }
                        >
                          Delete
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          {isCompletedProject
            ? handleCompletedHistoryDataTable()
            : handleDeletedHistoryDataTable()}
        </div>
      </div>
      <Dialog
        header={'Delete Confirmation'}
        visible={showDeletedHistoryPopup}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => {
          setShowDeletedHistoryPopup(false);
          resetForm();
        }}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="no_of_files_deleting" l>
                  No of file Deleting{' '}
                  <span className="text-danger fs-6">*</span>
                </label>
                <InputNumber
                  id="no_of_files_deleting"
                  placeholder="No of file deleting"
                  name="no_of_files_deleting"
                  value={values?.no_of_files_deleting}
                  onChange={e => {
                    if (!e.value || checkWordLimit(e.value, 8)) {
                      setFieldValue(
                        'no_of_files_deleting',
                        e.value ? e.value : '',
                      );
                    }
                  }}
                  maxLength="8"
                  onBlur={handleBlur}
                  useGrouping={false}
                />
                {touched?.no_of_files_deleting &&
                  errors?.no_of_files_deleting && (
                    <p className="text-danger">
                      {errors?.no_of_files_deleting}
                    </p>
                  )}
              </div>
            </Col>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="description">Write the Description</label>
                <InputText
                  id="description"
                  name="description"
                  value={values?.description}
                  onChange={handleChange}
                  placeholder="Project Type"
                  onBlur={handleBlur}
                  className="input_wrap"
                />
                {touched?.description && errors?.description && (
                  <p className="text-danger">{errors?.description}</p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </>
  );
}
