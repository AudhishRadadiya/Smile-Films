import React, { useState, useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  geteditingList,
  listEmployee,
  setEditingCurrentPage,
  setEditingEmployeeFilterValue,
  setEditingFilterValue,
  setEditingPageLimit,
  setEditingSearchParam,
  setEditingSelectedProgressIndex,
  setEditingStepFilterValue,
  setGetStepData,
  setSortEditingField,
  setSortEditingOrder,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import {
  clearAddSelectedDataCollectionData,
  deleteDataCollection,
  setIsGetInintialValuesDataCollection,
} from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import { getAuthToken } from 'Helper/AuthTokenHelper';
import EditIcon from '../../../Assets/Images/edit.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { convertIntoNumber } from 'Helper/CommonHelper';
import TrashIcon from '../../../Assets/Images/trash.svg';
import process from '../../../Assets/Images/process.png';
import UserIcon from '../../../Assets/Images/add-user.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';

const editingListFilterOptions = [
  { label: 'Assigned', value: 1 },
  { label: 'Unassigned', value: 2 },
  { label: 'Both', value: 3 },
];

const editingStepFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Data Collection', value: 1 },
  { label: 'Quotation', value: 2 },
  { label: 'Quotation Approved', value: 3 },
  { label: 'Assigned to Editor', value: 4 },
  { label: 'Overview', value: 5 },
  { label: 'Completed', value: 6 },
  { label: 'Rework', value: 7 },
  { label: 'Rework Overview', value: 8 },
  { label: 'Rework Completed', value: 9 },
];

export default function Editing({ hasAccess, roleData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = getAuthToken();

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const {
    editingList,
    editingCurrentPage,
    editingPageLimit,
    editingSearchParam,
    editingFilterValue,
    editingStepFilterValue,
    editingEmployeeFilterValue,
    editingLoading,
    sortEditingOrder,
    sortEditingField,
    assignEmployeeList,
  } = useSelector(({ editing }) => editing);

  const { dataCollectionLoading, isGetInintialValuesDataCollection } =
    useSelector(({ dataCollection }) => dataCollection);

  const employeeOptionList = useMemo(() => {
    let employeeData = [];

    if (assignEmployeeList?.length > 0) {
      employeeData = [{ label: 'All', value: '' }, ...assignEmployeeList];
    }

    return employeeData;
  }, [assignEmployeeList]);

  const dataCollectionPermissions = useMemo(() => {
    const permissionData = userData?.permission
      ?.find(
        role =>
          role?.name?.toLowerCase() ===
          roleData?.role?.mainModule?.toLowerCase(),
      )
      ?.permission?.find(permission => permission?.path === '/data-collection');

    return permissionData;
  }, [userData, roleData]);

  const getEditingListApi = useCallback(
    (
      start = 1,
      limit = 20,
      search = '',
      assignFilter = '',
      stepFilter = '',
      employee_id = '',
    ) => {
      dispatch(
        geteditingList({
          start,
          limit,
          isActive: '',
          search: search?.trim(),
          assignFilter,
          stepFilter,
          employee_id,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const overviewFilterIndex = 5;
    dispatch(setEditingStepFilterValue(overviewFilterIndex));

    getEditingListApi(
      editingCurrentPage,
      editingPageLimit,
      editingSearchParam,
      editingFilterValue,
      overviewFilterIndex,
      editingEmployeeFilterValue,
    );

    dispatch(
      listEmployee({
        type: 1,
      }),
    );

    return () => {
      dispatch(setEditingSearchParam(''));
    };
  }, [dispatch]);

  const onPageChange = page => {
    if (page !== editingCurrentPage) {
      let pageIndex = editingCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setEditingCurrentPage(pageIndex));
      getEditingListApi(
        pageIndex,
        editingPageLimit,
        editingSearchParam,
        editingFilterValue,
        editingStepFilterValue,
        editingEmployeeFilterValue,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setEditingCurrentPage(page === 0 ? 0 : 1));
    dispatch(setEditingPageLimit(page));
    const pageValue =
      page === 0 ? (editingList?.totalRows ? editingList?.totalRows : 0) : page;
    const prevPageValue =
      editingPageLimit === 0
        ? editingList?.totalRows
          ? editingList?.totalRows
          : 0
        : editingPageLimit;
    if (
      prevPageValue < editingList?.totalRows ||
      pageValue < editingList?.totalRows
    ) {
      getEditingListApi(
        page === 0 ? 0 : 1,
        page,
        editingSearchParam,
        editingFilterValue,
        editingStepFilterValue,
        editingEmployeeFilterValue,
      );
    }
  };

  const actionBodyTemplate = row => {
    return (
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle id="dropdown-basic" className="action_btn">
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       <Dropdown.Item
      //         onClick={() => {
      //           let step = row?.step
      //             ? row?.step === 9
      //               ? row?.step
      //               : row?.step === 5 && row?.is_rework === true
      //               ? row?.step + 1
      //               : row?.step > 5 && row?.is_rework === false
      //               ? row?.step
      //               : row?.step + 1
      //             : 1;

      //           dispatch(setEditingSelectedProgressIndex(step));
      //           navigate(`/editing-flow/${row?._id}`);
      //         }}
      //       >
      //         <img src={EditIcon} alt="EditIcon" /> Edit
      //       </Dropdown.Item>
      //       <Dropdown.Item
      //         onClick={() => {
      //           setDeleteId(row?._id);
      //           setDeletePopup(true);
      //         }}
      //       >
      //         <img src={TrashIcon} alt="TrashIcon" /> Delete
      //       </Dropdown.Item>
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            let step = row?.step
              ? row?.step === 9
                ? row?.step
                : row?.step === 5 && row?.is_rework === true
                ? row?.step + 1
                : row?.step > 5 && row?.is_rework === false
                ? row?.step
                : row?.step + 1
              : 1;

            dispatch(setEditingSelectedProgressIndex(step));
            navigate(`/editing-flow/${row?._id}`);
          }}
        />
        <img
          src={TrashIcon}
          alt=""
          className="cursor_pointer"
          onClick={() => {
            setDeleteId(row?._id);
            setDeletePopup(true);
          }}
        />
      </div>
    );
  };

  const companyBodyTemplate = row => {
    return (
      <span
        className="cursor_pointer hover_text"
        onClick={() => {
          let step = row?.step
            ? row?.step === 9
              ? row?.step
              : row?.step === 5 && row?.is_rework === true
              ? row?.step + 1
              : // : row?.step >= 5 && row?.is_rework === false
              row?.step > 5 && row?.is_rework === false
              ? row?.step
              : row?.step + 1
            : 1;

          dispatch(setEditingSelectedProgressIndex(step));
          navigate(`/editing-flow/${row?._id}`);
        }}
      >
        {row?.company_name}
      </span>
    );
  };

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const AssignBodyTemplate = data => {
    return data?.editors?.length > 0 ? (
      <ul className="assign-body-wrap">
        {data?.editors &&
          data?.editors?.length > 0 &&
          data?.editors?.slice(0, 2).map((item, index) => {
            return (
              <Button
                tooltip={`${item.employee_name} - ${item.item_name}`}
                tooltipOptions={{ position: 'top' }}
                className="bg-transparent border-0 p-0 custom-tooltip-btn"
              >
                <li key={index}>
                  <div
                    className={`assign-profile-wrapper ${getTagClassByStatus(
                      item?.employee_status,
                    )}`}
                  >
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
              </Button>
            );
          })}
        {data?.editors?.length > 2 && (
          <li>
            <div className="assign_dropdown_wrapper">
              <Dropdown className="dropdown_common position-static">
                <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                  {data?.editors?.length > 2 ? data?.editors?.length - 2 : 0}{' '}
                  More...
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    {data?.editors?.length > 2 &&
                      data?.editors?.slice(2)?.map(item => {
                        return (
                          <div
                            className={`assign_dropdown ${getTagClassByStatus(
                              item?.employee_status,
                            )}`}
                          >
                            <div className="assign_profile">
                              <img
                                src={item?.image ? item?.image : UserIcon}
                                alt="profileimg"
                                onError={handleDefaultUser}
                              />
                              <h5 className="m-0">{item?.employee_name}</h5>
                            </div>
                            <div className="profile_user_name">
                              <h6 className="text_gray m-0">
                                {item?.item_name}
                              </h6>
                            </div>
                          </div>
                        );
                      })}
                    {/* <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Vandana</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Pre-Wedding</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Kapil</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Teaser</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Keval</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Highlight</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Akash</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Photos</h6>
                    </div>
                  </div> */}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
        )}
      </ul>
    ) : (
      '-'
    );
  };

  const getStatus = step => {
    switch (step) {
      case 1:
        return 'Data Collection';
      case 2:
        return 'Quotation';
      case 3:
        return 'Quotation Approved';
      case 4:
        return 'Assigned to Editor';
      case 5:
        return 'Overview';
      case 6:
        return 'Completed';
      case 7:
        return 'Rework';
      case 8:
        return 'Rework Oveview';
      case 9:
        return 'Rework Completed';

      default:
        return null;
    }
  };

  const StatusBodyTemplate = data => {
    return (
      <div className="status_body_wrapper">
        <div className="verifide_wrap">
          {/* <h5 className="active m-0">1.Order Form</h5> */}
          {data?.step >= 6 &&
          data?.is_rework === false &&
          data?.status === 6 ? (
            <h5 className="complete m-0">
              {`${data?.step}.${getStatus(data?.step)}`}
            </h5>
          ) : data?.step > 0 ? (
            <h5 className="active m-0">
              {`${data?.step}.${getStatus(data?.step)}`}
            </h5>
          ) : (
            <h5 className="m-0">{`${data?.step + 1}.${getStatus(
              data?.step + 1,
            )}`}</h5>
          )}
          {/*{' '}
          <h5 className="complete m-0">
            {`${data?.step}.${getStatus(data?.step)}`}
          </h5>{' '}
          */}
        </div>
        {data?.step >= 6 && data?.is_rework === false ? (
          ' '
        ) : (
          <div className="process_wrap">
            <img src={process} alt="process" />
          </div>
        )}
        <div className="verifide_wrap">
          {/* <h5 className="text_gray m-0">2.Quotetion</h5> */}
          {data?.step === 9 ? (
            ''
          ) : data?.step === 6 && data?.is_rework === true ? (
            <h5 className="text_gray m-0">{`${data?.step + 1}.${getStatus(
              data?.step + 1,
            )}`}</h5>
          ) : data?.step >= 6 && data?.is_rework === false ? (
            ''
          ) : data?.step === 0 ? (
            <h5 className="text_gray m-0">{`${data?.step + 2}.${getStatus(
              data?.step + 2,
            )}`}</h5>
          ) : (
            <h5 className="text_gray m-0">{`${data?.step + 1}.${getStatus(
              data?.step + 1,
            )}`}</h5>
          )}
        </div>
      </div>
    );
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        order_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteDataCollection(deleteItemObj))
          .then(response => {
            getEditingListApi(
              editingCurrentPage,
              editingPageLimit,
              editingSearchParam,
              editingFilterValue,
              editingStepFilterValue,
              editingEmployeeFilterValue,
            );
          })
          .catch(error => {
            console.error('Error fetching delete data:', error);
          });
      }
      setDeletePopup(false);
    },
    [
      deleteId,
      dispatch,
      getEditingListApi,
      editingCurrentPage,
      editingPageLimit,
      editingSearchParam,
      editingFilterValue,
      editingStepFilterValue,
      editingEmployeeFilterValue,
    ],
  );

  const handleSearchInput = e => {
    dispatch(setEditingCurrentPage(1));

    const searchValue = e.target.value?.trim();
    const editingStepFilter = searchValue ? '' : 5;
    const editingFilter = searchValue ? 3 : '';

    if (searchValue) {
      dispatch(setEditingFilterValue(3));
      dispatch(setEditingStepFilterValue(''));
      dispatch(setEditingEmployeeFilterValue(''));
    } else {
      dispatch(setEditingFilterValue(''));
      dispatch(setEditingStepFilterValue(5));
      dispatch(setEditingEmployeeFilterValue(''));
    }

    getEditingListApi(
      editingCurrentPage,
      editingPageLimit,
      searchValue,
      editingFilter,
      editingStepFilter,
      '',
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const itemsNameBodyTemplate = data => {
    let buttonTooltip = data.item_name;
    return (
      <Button
        tooltip={buttonTooltip}
        tooltipOptions={{ position: 'top' }}
        className="btn_transparent text_dark item_name_with_tooltip"
      >
        {data?.item_name}
      </Button>
    );
  };

  const dataSizeBodyTemplate = rowData => {
    return <span>{convertIntoNumber(rowData?.data_size)}</span>;
  };

  const onSort = e => {
    dispatch(setSortEditingField(e.sortField));
    dispatch(setSortEditingOrder(e.sortOrder));
  };

  const getSeverityStatus = status => {
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

  const getTagClassByStatus = status => {
    return `p-tag p-tag-${getSeverityStatus(status)}`;
  };

  return (
    <div className="main_Wrapper editing_main_wrap">
      {(editingLoading || dataCollectionLoading) && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={5}>
              <div className="d-lg-flex d-md-block d-sm-flex justify-content-between">
                <div className="page_title pe-lg-4 pe-2">
                  <h3 className="m-0">Editing</h3>
                </div>
                <div>
                  <ul className="dots_status_wrapper2">
                    <li>Initial</li>
                    <li>Library Done</li>
                    <li>IN Progress</li>
                    <li>IN Checking</li>
                    <li>Checking Done</li>
                    <li>Exporting</li>
                    <li>Completed</li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col sm={7}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group select_list_filter">
                      <ReactSelectSingle
                        filter
                        placeholder="Select Employee"
                        value={editingEmployeeFilterValue}
                        onChange={e => {
                          dispatch(setEditingEmployeeFilterValue(e.value));
                          getEditingListApi(
                            editingCurrentPage,
                            editingPageLimit,
                            editingSearchParam,
                            editingFilterValue,
                            editingStepFilterValue,
                            e.value,
                          );
                        }}
                        options={employeeOptionList}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form_group select_list_filter">
                      <ReactSelectSingle
                        filter
                        placeholder="Select Status"
                        value={editingStepFilterValue}
                        onChange={e => {
                          dispatch(setEditingStepFilterValue(e.value));
                          getEditingListApi(
                            editingCurrentPage,
                            editingPageLimit,
                            editingSearchParam,
                            editingFilterValue,
                            e.value,
                            editingEmployeeFilterValue,
                          );
                        }}
                        options={editingStepFilterOptions}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="form_group select_list_filter">
                      <ReactSelectSingle
                        filter
                        placeholder="Select"
                        value={editingFilterValue}
                        onChange={e => {
                          dispatch(setEditingFilterValue(e.value));
                          getEditingListApi(
                            editingCurrentPage,
                            editingPageLimit,
                            editingSearchParam,
                            e.value,
                            editingStepFilterValue,
                            editingEmployeeFilterValue,
                          );
                        }}
                        options={editingListFilterOptions}
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
                        value={editingSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setEditingSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  {dataCollectionPermissions?.create === true && (
                    <li>
                      <Button
                        onClick={() => {
                          dispatch(setGetStepData({}));
                          dispatch(
                            setIsGetInintialValuesDataCollection({
                              ...isGetInintialValuesDataCollection,
                              add: false,
                            }),
                          );
                          dispatch(clearAddSelectedDataCollectionData());
                          navigate('/add-data-collection');
                        }}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" /> Collect Data
                      </Button>
                    </li>
                  )}
                  {/* <li>
                    <Link to="" className="btn_border icon_btn">
                      <img src={ExportIcon} alt="" />
                    </Link>
                  </li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper odd_even_row_color">
          <DataTable
            value={editingList?.list}
            sortField={sortEditingField}
            sortOrder={sortEditingOrder}
            className="editing_main_wrap_table"
            rows={10}
            onSort={onSort}
          >
            <Column field="inquiry_no" header="Order No." sortable></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              sortable
              body={companyBodyTemplate}
            ></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="item_name"
              header="Item Names"
              body={itemsNameBodyTemplate}
              sortable
            ></Column>
            <Column field="due_date" header="Due Date" sortable></Column>
            <Column
              field="data_size"
              header="Data Size"
              body={dataSizeBodyTemplate}
              sortable
            ></Column>
            <Column
              field="editors"
              header="Assigned Editors"
              sortable
              body={AssignBodyTemplate}
            ></Column>
            <Column
              field="step"
              header="Status"
              sortable
              body={StatusBodyTemplate}
            ></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={editingList?.list}
            pageLimit={editingPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={editingCurrentPage}
            totalCount={editingList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        moduleName={'Editing'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
