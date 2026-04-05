import _ from 'lodash';
import { Tag } from 'primereact/tag';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  getAssignedWorkList,
  setAssignWorkedEditingData,
  setAssignedWorkedCurrentPage,
  setAssignedWorkedPageLimit,
  setAssignedWorkedSearchParam,
  setAssignedWorkedStatus,
  setSelectedAssignedProjectStatusFilter,
  setSelectedAssignedProjectFilter,
} from 'Store/Reducers/UserFlow/AssignedWorkedSlice';
import Loader from 'Components/Common/Loader';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { AssignedWorkedStatusFilterList } from 'Helper/CommonList';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import UserIcon from '../../../Assets/Images/add-user.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import {
  AssignedProjectFilterOptions,
  AssignedProjectStatusFilterOptions,
} from 'Global/Constants';

const getSeverityStatus = product => {
  switch (product) {
    case 'Initial':
      return 'info';
    case 'Library Done':
      return 'orange';
    case 'IN Progress':
      return 'warning';
    case 'IN Checking':
      return 'danger';
    case 'Completed':
      return 'success';
    case 'Exporting':
      return 'primary';

    default:
      return null;
  }
};

const getSeverity = status => {
  switch (status) {
    case 1:
      return 'info';
    case 2:
      return 'orange';
    case 3:
      return 'warning';
    case 4:
      return 'danger';
    case 5:
      return 'primary';
    case 6:
      return 'success';

    default:
      return null;
  }
};

const getSeverityValue = item => {
  switch (item) {
    case 1:
      return 'Intial';
    case 2:
      return 'Library Done';
    case 3:
      return 'In Progress';
    case 4:
      return 'In Checking';
    case 5:
      return 'Exporting';
    case 6:
      return 'Completed';
    default:
      return null;
  }
};

export default function AssignedProjects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [saveFilterModal, setSaveFilterModal] = useState(false);

  const {
    assignedWorkLoading,
    assignedWorkList,
    assignedWorkedSearchParam,
    assignedWorkedCurrentPage,
    assignedWorkedPageLimit,
    assignedWorkedStatus,
    selectedAssignedProjectStatusFilter,
    selectedAssignedProjectFilter,
  } = useSelector(({ assignedWorked }) => assignedWorked);

  const fetchRequiredDetails = useCallback(
    (
      currentPage = 1,
      pageLimit = 10,
      globalSearch = '',
      orderStatus = [],
      projectFilter = 'all',
      projectStatusFilter = 'all',
    ) => {
      const payload = {
        start: currentPage,
        limit: pageLimit,
        order_status: orderStatus,
        search: globalSearch?.trim(),
      };

      if (projectStatusFilter !== 'all') {
        payload[projectStatusFilter] = true;
      }

      if (projectFilter !== 'all') {
        payload[projectFilter] = true;
      }

      dispatch(getAssignedWorkList(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchRequiredDetails(
      assignedWorkedCurrentPage,
      assignedWorkedPageLimit,
      assignedWorkedSearchParam,
      assignedWorkedStatus,
      selectedAssignedProjectFilter,
      selectedAssignedProjectStatusFilter,
    );

    // return () => {
    //   dispatch(setAssignedWorkedStatus([]));
    // };
  }, []);

  const bgColumnColor = data => {
    if (data.is_rework) return 'danger';
    if (data.is_checker) return 'success';
    if (
      !data.is_rework &&
      !data.is_checker &&
      data.order_status > 0 &&
      data.order_status < 7 &&
      data.order_status !== 6
    ) {
      return 'primary';
    }
    return 'transparent';
  };

  const statusItemTemplate = option => {
    return (
      <Tag
        value={option?.label}
        severity={getSeverityStatus(option?.label)}
        className="d-block text-center"
      />
    );
  };

  const companyBodyTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          navigate(
            `${
              rowData?.inquiry_type === 1
                ? '/project-work-editing/'
                : '/project-work-exposing/'
            }${rowData?._id}`,
          );
          dispatch(setAssignWorkedEditingData({}));
          // navigate('/add-edit-assigned-projects');
        }}
      >
        {rowData?.company_name}
      </div>
    );
  };

  const statusBodyTemplate = rowData => {
    const Status = AssignedWorkedStatusFilterList?.find(
      item => item?.value === rowData?.order_status,
    );
    return (
      <Tag
        value={Status?.label}
        className="cursor_pointer"
        severity={getSeverityStatus(Status?.label)}
      ></Tag>
    );
  };

  const handleDelete = useCallback(async => {
    setDeletePopup(false);
  }, []);

  const onPageChange = page => {
    if (page !== assignedWorkedCurrentPage) {
      let pageIndex = assignedWorkedCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setAssignedWorkedCurrentPage(pageIndex));
      fetchRequiredDetails(
        pageIndex,
        assignedWorkedPageLimit,
        assignedWorkedSearchParam,
        assignedWorkedStatus,
        selectedAssignedProjectFilter,
        selectedAssignedProjectStatusFilter,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setAssignedWorkedCurrentPage(page === 0 ? 0 : 1));
    dispatch(setAssignedWorkedPageLimit(page));

    const pageValue =
      page === 0
        ? assignedWorkList?.totalRows
          ? assignedWorkList?.totalRows
          : 0
        : page;
    const prevPageValue =
      assignedWorkedPageLimit === 0
        ? assignedWorkList?.totalRows
          ? assignedWorkList?.totalRows
          : 0
        : assignedWorkedPageLimit;
    if (
      prevPageValue < assignedWorkList?.totalRows ||
      pageValue < assignedWorkList?.totalRows
    ) {
      fetchRequiredDetails(
        page === 0 ? 0 : 1,
        page,
        assignedWorkedSearchParam,
        assignedWorkedStatus,
        selectedAssignedProjectFilter,
        selectedAssignedProjectStatusFilter,
      );
    }
  };

  const ItemNameTemplate = rowData => {
    return (
      <>
        <div className="item_name_wrapper">
          <Button
            className="btn_as_text"
            placeholder="bottom"
            tooltip={rowData?.item_name}
            type="button"
            label={rowData?.item_name}
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </>
    );
  };

  const orderNumberTemplate = rowData => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <span>{rowData?.inquiry_no}</span>
        {rowData?.is_new && (
          <div className="new_record_update">
            <Tag severity="info" value="New"></Tag>
          </div>
        )}
      </div>
    );
  };

  const WorkTypeTemplete = rowData => {
    return (
      <Tag
        value={rowData?.inquiry_type === 1 ? 'Editing' : 'Exposing'}
        severity={bgColumnColor(rowData)}
      ></Tag>
    );
  };

  const SpecificTemplate = rowData => {
    return (
      <>
        <div
          className="item_name_wrapper with_concate"
          dangerouslySetInnerHTML={{ __html: rowData?.remark }}
        />
      </>
    );
  };

  const handleSearchInput = e => {
    const searchValue = e.target.value?.trim();

    let filter = 'all';

    if (selectedAssignedProjectStatusFilter !== 'all' && e.target.value) {
      dispatch(setSelectedAssignedProjectStatusFilter('all'));
      filter = 'all';
    }

    if (selectedAssignedProjectStatusFilter !== 'running' && !e.target.value) {
      dispatch(setSelectedAssignedProjectStatusFilter('running'));
      filter = 'running';
    }

    dispatch(setAssignedWorkedCurrentPage(1)); // Reset to first page
    fetchRequiredDetails(
      1,
      assignedWorkedPageLimit,
      searchValue,
      assignedWorkedStatus,
      selectedAssignedProjectFilter,
      filter,
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [selectedAssignedProjectFilter, selectedAssignedProjectStatusFilter],
  );

  const allowExpansion = rowData => {
    return rowData?.itemData?.length;
  };

  const itemStatusBodyTemplate = product => {
    return (
      <Tag
        value={getSeverityValue(product?.status)}
        severity={getSeverity(product?.status)}
      ></Tag>
    );
  };

  const dueDateBodyTemplate = rowData => {
    const updatedDueDate = rowData?.due_date
      ? moment(rowData?.due_date).format('DD-MM-YYYY')
      : '';
    return <span>{updatedDueDate}</span>;
  };

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const assignedEmployeeBodyTemplet = useCallback(
    data => {
      return (
        <ul className="assign-body-wrap edit-assign-body-wrap">
          {data?.employeeData &&
            data?.employeeData?.length > 0 &&
            data?.employeeData?.map((item, index) => {
              return (
                <li key={index}>
                  <div className="assign-profile-wrapper">
                    <div className="assign_profile">
                      <img
                        src={item?.image ? item?.image : UserIcon}
                        alt="profileimg"
                        onError={handleDefaultUser}
                      />
                    </div>
                    <div className="profile_user_name">
                      <h5 className="m-0">{item?.employee_name}</h5>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      );
    },
    [handleDefaultUser],
  );

  const eventDateTemplate = rowData => {
    const orderStartDate = rowData?.order_start_date
      ? moment(rowData?.order_start_date).format('DD-MM-YYYY')
      : '';

    const orderEndDate = rowData?.order_end_date
      ? moment(rowData?.order_end_date).format('DD-MM-YYYY')
      : '';

    return (
      <span>
        {orderStartDate
          ? orderStartDate + (orderEndDate ? ' To ' + orderEndDate : '')
          : orderEndDate
          ? ' To ' + orderEndDate
          : ''}
      </span>
    );
  };

  const rowExpansionTemplate = useCallback(
    (data, i) => {
      return (
        <div className="inner_table_wrap" key={i}>
          <DataTable value={data?.itemData}>
            <Column field="item_name" header="Item Name" sortable></Column>
            <Column
              field="due_date"
              header="Assigned Employee"
              sortable
              body={assignedEmployeeBodyTemplet}
            ></Column>
            {data?.inquiry_type === 1 && (
              <Column
                field="due_date"
                header="Due Date"
                sortable
                body={dueDateBodyTemplate}
              ></Column>
            )}
            {data?.inquiry_type === 2 && (
              <Column
                field="event_date"
                header="Event Date"
                sortable
                body={eventDateTemplate}
              ></Column>
            )}
            <Column
              field="status"
              header="Item Status"
              sortable
              body={itemStatusBodyTemplate}
            ></Column>
          </DataTable>
        </div>
      );
    },
    [assignedEmployeeBodyTemplet],
  );

  return (
    <>
      {assignedWorkLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center gy-3">
              <Col md={5}>
                <div className="d-lg-flex d-md-block d-sm-flex justify-content-lg-start justify-content-between">
                  <div className="page_title pe-lg-4 pe-2">
                    <h3 className="m-0">Assigned Projects</h3>
                  </div>
                  <div>
                    <ul className="dots_status_wrapper">
                      <li>Checker</li>
                      <li>Rework</li>
                      <li>Running</li>
                      {/* <li>Both</li> */}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col md={7}>
                <div className="right_filter_wrapper">
                  <ul className="assign_ul">
                    <li>
                      <div class="form_group">
                        <ReactSelectSingle
                          value={selectedAssignedProjectFilter}
                          options={AssignedProjectFilterOptions}
                          onChange={e => {
                            const selectedFilter = e.value;
                            dispatch(
                              setSelectedAssignedProjectFilter(selectedFilter),
                            );
                            fetchRequiredDetails(
                              assignedWorkedCurrentPage,
                              assignedWorkedPageLimit,
                              assignedWorkedSearchParam,
                              assignedWorkedStatus,
                              selectedFilter,
                              selectedAssignedProjectStatusFilter,
                            );
                          }}
                          placeholder="Select Filter"
                        />
                      </div>
                    </li>
                    <li>
                      <div class="form_group">
                        <ReactSelectSingle
                          value={selectedAssignedProjectStatusFilter}
                          options={AssignedProjectStatusFilterOptions}
                          onChange={e => {
                            const selectedFilter = e.value;
                            const assignedWorkedStatusDefault = [];
                            dispatch(
                              setSelectedAssignedProjectStatusFilter(
                                selectedFilter,
                              ),
                            );
                            dispatch(
                              setAssignedWorkedStatus(
                                assignedWorkedStatusDefault,
                              ),
                            );
                            fetchRequiredDetails(
                              assignedWorkedCurrentPage,
                              assignedWorkedPageLimit,
                              assignedWorkedSearchParam,
                              assignedWorkedStatusDefault,
                              selectedAssignedProjectFilter,
                              selectedFilter,
                            );
                          }}
                          placeholder="Select Filter"
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={assignedWorkedSearchParam}
                          onChange={e => {
                            debounceHandleSearchInput(e);
                            dispatch(
                              setAssignedWorkedSearchParam(e.target.value),
                            );
                          }}
                        />
                      </div>
                    </li>
                    {/* <li>
                    <Button
                      className="btn_border filter_btn"
                      onClick={e => op.current.toggle(e)}
                    >
                      <img src={FilterIcon} alt="" /> Filter by Status
                    </Button>
                    <OverlayPanel
                      className="payment-status-overlay"
                      ref={op}
                      hideCloseIcon
                    >
                      <div className="overlay_body payment-status">
                        <div className="overlay_select_filter_row">
                          <div className="filter_row w-100">
                            <Row>
                              <Col sm={12}>
                                <div className="payment_status_wrap mb-2">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="p-tag p-component p-tag-info">
                                      Partial
                                    </span>
                                  </div>
                                </div>
                              </Col>
                              <Col sm={12}>
                                <div className="payment_status_wrap">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="p-tag p-component p-tag-danger">
                                      Due
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </OverlayPanel>
                  </li> */}
                    <li className="inquiry_multeselect w-auto">
                      <MultiSelect
                        options={AssignedWorkedStatusFilterList}
                        value={assignedWorkedStatus}
                        name="items"
                        onChange={e => {
                          const selectedStatus = e.target.value;
                          const assignedProjectStatusFilterDefault = 'all';
                          dispatch(setAssignedWorkedStatus(selectedStatus));
                          dispatch(
                            setSelectedAssignedProjectStatusFilter(
                              assignedProjectStatusFilterDefault,
                            ),
                          );
                          fetchRequiredDetails(
                            assignedWorkedCurrentPage,
                            assignedWorkedPageLimit,
                            assignedWorkedSearchParam,
                            selectedStatus,
                            selectedAssignedProjectFilter,
                            assignedProjectStatusFilterDefault,
                          );
                        }}
                        placeholder="Filter by Status"
                        className="btn_primary w-100"
                        itemTemplate={statusItemTemplate}
                      />
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper">
            <DataTable
              value={assignedWorkList?.list}
              expandedRows={expandedRows}
              // sortField="price"
              // sortOrder={1}
              // rows={10}
              onRowToggle={e => {
                setExpandedRows(e?.data);
              }}
              rowExpansionTemplate={data =>
                data?.itemData?.length && rowExpansionTemplate(data)
              }
              // rowClassName={bg_bolor}
            >
              <Column
                className="expander_toggle"
                expander={allowExpansion}
                style={{ width: '3rem' }}
              />
              <Column
                field="inquiry_no"
                header="Order No."
                sortable
                body={orderNumberTemplate}
              ></Column>
              <Column
                field="create_date"
                header="Create Date"
                sortable
              ></Column>
              <Column
                header="Work Type"
                body={WorkTypeTemplete}
                sortable
              ></Column>
              <Column
                field="company_name"
                header="Company Name"
                sortable
                body={companyBodyTemplate}
              ></Column>
              <Column
                field="couple_name"
                header="Couple Name"
                sortable
              ></Column>
              <Column
                field="item_name"
                header="Item Names"
                sortable
                body={ItemNameTemplate}
              ></Column>
              <Column field="data_size" header="Data Size" sortable></Column>
              <Column field="due_date" header="Due Date" sortable></Column>
              <Column
                field="specific_requirement"
                header="Specific Requirement"
                sortable
                className="with_concate_break max_500"
                body={SpecificTemplate}
              ></Column>
              <Column
                field="status"
                header="Project Status"
                sortable
                body={statusBodyTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={assignedWorkList?.list}
              pageLimit={assignedWorkedPageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={assignedWorkedCurrentPage}
              totalCount={assignedWorkList?.totalRows}
            />
          </div>
        </div>
        <Dialog
          header="Save Personal Filters"
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setSaveFilterModal(false)}
        >
          <div className="form_group mb-3">
            <InputText placeholder="Name your filter" />
          </div>
          <Button
            className="btn_primary"
            onClick={() => setSaveFilterModal(false)}
          >
            Save Filter
          </Button>
        </Dialog>
        <ConfirmDeletePopup
          moduleName={'assigned Project'}
          deletePopup={deletePopup}
          handleDelete={handleDelete}
          setDeletePopup={setDeletePopup}
        />
      </div>
    </>
  );
}
