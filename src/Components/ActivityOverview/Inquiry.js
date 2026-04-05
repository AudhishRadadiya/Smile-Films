import React, { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';

import {
  clearAddSelectedInquiryData,
  clearUpdateSelectedInquiryData,
  deleteInquiry,
  editInquiry,
  getInquiryList,
  setInquiryCurrentPage,
  setInquiryPageLimit,
  setInquirySearchParam,
  setInquirySelectedProgressIndex,
  setInquiryStatus,
  setIsAddInquiry,
  setIsDeleteInquiry,
  setIsGetInintialValuesInquiry,
  setIsUpdateInquiry,
  setSelectedInquiryFlowData,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../Assets/Images/plus.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { InquiryStatusFilterList, InquiryStatusList } from 'Helper/CommonList';

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

const initialValues = {
  inquiry_no: '',
  create_date: '',
  company_name: '',
  client_name: '',
  contact_number: '',
  inquiry_type: '',
  item_Names: '',
  remark: '',
  reference: '',
  inquiry_status: '',
  item_name: '',
};

export default function Inquiry({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(initialValues);
  const {
    inquiryCurrentPage,
    inquiryPageLimit,
    inquirySearchParam,
    inquiryStatus,
    inquiryList,
    inquiryLoading,
    isDeleteInquiry,
    isUpdateInquiry,
    isAddInquiry,
    isGetInintialValuesInquiry,
  } = useSelector(({ inquiry }) => inquiry);

  const getInquiryListApi = useCallback(
    (start = 1, limit = 10, search = '', inquiry_status = '') => {
      dispatch(
        getInquiryList({
          start: start,
          limit: limit,
          isActive: '',
          search: search?.trim(),
          inquiry_status: inquiry_status,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getInquiryListApi(
      inquiryCurrentPage,
      inquiryPageLimit,
      inquirySearchParam,
      inquiryStatus,
    );
  }, []);

  useEffect(() => {
    if (isAddInquiry || isUpdateInquiry || isDeleteInquiry) {
      getInquiryListApi(
        inquiryCurrentPage,
        inquiryPageLimit,
        inquirySearchParam,
        inquiryStatus,
      );
    }
    if (isUpdateInquiry) {
      dispatch(setIsUpdateInquiry(false));
    }
    if (isAddInquiry) {
      dispatch(setIsAddInquiry(false));
    }
    if (isDeleteInquiry) {
      dispatch(setIsDeleteInquiry(false));
    }
  }, [
    dispatch,
    isAddInquiry,
    inquiryStatus,
    isUpdateInquiry,
    isDeleteInquiry,
    inquiryPageLimit,
    getInquiryListApi,
    inquiryCurrentPage,
    inquirySearchParam,
  ]);

  const statusItemTemplate = option => {
    return (
      <Tag
        value={option?.label}
        severity={getSeverity(option?.label)}
        className="d-block text-center"
      />
    );
  };

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
      //               setIsGetInintialValuesInquiry({
      //                 ...isGetInintialValuesInquiry,
      //                 update: false,
      //               }),
      //             );

      //             const inquiryStep = row?.inquiry_step
      //               ? row?.inquiry_step === 3
      //                 ? row?.inquiry_step
      //                 : row?.inquiry_step + 1
      //               : 1;
      //             dispatch(setInquirySelectedProgressIndex(inquiryStep));
      //             dispatch(setSelectedInquiryFlowData({}));
      //             // dispatch(setInquirySelectedProgressIndex(1));
      //             dispatch(clearUpdateSelectedInquiryData());
      //             navigate(`/update-inquiry-flow/${row?._id}`);
      //             // navigate(`/update-inquiry/${row?._id}`);
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
                setIsGetInintialValuesInquiry({
                  ...isGetInintialValuesInquiry,
                  update: false,
                }),
              );

              const inquiryStep = row?.inquiry_step
                ? row?.inquiry_step === 3
                  ? row?.inquiry_step
                  : row?.inquiry_step + 1
                : 1;
              dispatch(setInquirySelectedProgressIndex(inquiryStep));
              dispatch(setSelectedInquiryFlowData({}));
              dispatch(clearUpdateSelectedInquiryData());
              navigate(`/update-inquiry-flow/${row?._id}`);
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

  const companyBodyTemplate = data => {
    return (
      <span
        onClick={e => {
          setSelectedData(data);
          setVisible(true);
        }}
        className="hover_text"
      >
        {data?.company_name}
      </span>
    );
  };

  const mobileBodyTemplate = rowData => {
    const phoneNumber = rowData?.mobile_no?.join(', ');
    return <span>{phoneNumber}</span>;
  };

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

  const statusBodyTemplate = product => {
    const Status = InquiryStatusList?.find(
      item => item?.value === product?.inquiry_status,
    );
    return (
      <Tag
        value={Status?.label}
        className="cursor_pointer"
        severity={getSeverity(Status?.label)}
        onClick={e => {
          setSelectedData(product);
          setVisible(true);
        }}
      ></Tag>
    );
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      inquiry_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteInquiry(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const onPageChange = page => {
    if (page !== inquiryCurrentPage) {
      let pageIndex = inquiryCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setInquiryCurrentPage(pageIndex));
      getInquiryListApi(
        pageIndex,
        inquiryPageLimit,
        inquirySearchParam,
        inquiryStatus,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setInquiryCurrentPage(page === 0 ? 0 : 1));
    dispatch(setInquiryPageLimit(page));
    const pageValue =
      page === 0 ? (inquiryList?.totalRows ? inquiryList?.totalRows : 0) : page;
    const prevPageValue =
      inquiryPageLimit === 0
        ? inquiryList?.totalRows
          ? inquiryList?.totalRows
          : 0
        : inquiryPageLimit;
    if (
      prevPageValue < inquiryList?.totalRows ||
      pageValue < inquiryList?.totalRows
    ) {
      getInquiryListApi(
        page === 0 ? 0 : 1,
        page,
        inquirySearchParam,
        inquiryStatus,
      );
    }
  };

  const handleSearchInput = e => {
    dispatch(setInquiryCurrentPage(1));
    dispatch(
      getInquiryList({
        start: 1,
        limit: inquiryPageLimit,
        isActive: '',
        search: e.target.value?.trim(),
        inquiry_status: inquiryStatus,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [inquiryStatus],
  );

  return (
    <div className="main_Wrapper">
      {inquiryLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col lg={3}>
              <div className="page_title">
                <h3 className="m-0">Inquiry</h3>
              </div>
            </Col>
            <Col lg={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li className="search_wrapper">
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={inquirySearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setInquirySearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li className="inquiry_multeselect w-auto">
                    <MultiSelect
                      options={InquiryStatusFilterList}
                      value={inquiryStatus}
                      name="items"
                      onChange={e => {
                        dispatch(setInquiryStatus(e.target.value));
                        dispatch(
                          getInquiryList({
                            start: inquiryCurrentPage,
                            limit: inquiryPageLimit,
                            isActive: '',
                            search: inquirySearchParam.trim(),
                            inquiry_status: e.target.value,
                          }),
                        );
                      }}
                      placeholder="Filter by Status"
                      className="btn_primary w-100"
                      itemTemplate={statusItemTemplate}
                    />
                  </li>
                  {/* <li>
                    <Link to="" className="btn_border icon_btn">
                      <img src={ExportIcon} alt="" />
                    </Link>
                  </li> */}
                  {is_create_access === true && (
                    <li>
                      <Button
                        onClick={() => {
                          dispatch(
                            setIsGetInintialValuesInquiry({
                              ...isGetInintialValuesInquiry,
                              add: false,
                            }),
                          );
                          dispatch(clearAddSelectedInquiryData());
                          navigate('/create-inquiry');
                          // navigate('/create-inquiry-flow');
                        }}
                        className="btn_primary"
                      >
                        <img src={PlusIcon} alt="" /> Create Inquiry
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
            value={inquiryList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="inquiry_no" header="Inquiry No." sortable></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              sortable
              body={companyBodyTemplate}
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="mobile_no"
              header="Contact Number"
              sortable
              body={mobileBodyTemplate}
            ></Column>
            <Column
              field="inquiry_type"
              header="Inquiry Type"
              sortable
            ></Column>
            <Column
              field="item_name"
              header="Item Names"
              body={itemsNameBodyTemplate}
              sortable
            ></Column>
            <Column
              field="remark"
              header="Description"
              sortable
              className="with_concate"
            ></Column>
            <Column field="reference" header="Reference" sortable></Column>
            <Column
              field="inquiry_status"
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
            dataList={inquiryList?.list}
            pageLimit={inquiryPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={inquiryCurrentPage}
            totalCount={inquiryList?.totalRows}
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
        moduleName={'Inquiry'}
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
      >
        <div className="company_inquiry_title text-center mb25">
          <h2>{selectedData?.company_name}</h2>
          <h5>{selectedData?.client_name}</h5>
        </div>
        <div className="company_inquiry_detail">
          <ul>
            <li>
              <label>
                Inquiry No.<span>:</span>
              </label>
              <span>{selectedData?.inquiry_no}</span>
            </li>
            <li>
              <label>
                Created Date<span>:</span>
              </label>
              <span>{selectedData?.create_date}</span>
            </li>
            <li>
              <label>
                Contact Number<span>:</span>
              </label>
              <span>{selectedData?.mobile_no}</span>
            </li>
            <li>
              <label>
                Inquiry Type<span>:</span>
              </label>
              <span>{selectedData?.inquiry_type}</span>
            </li>
            <li>
              <label>
                Item Names<span>:</span>
              </label>
              <span>{selectedData?.item_name}</span>
            </li>
            <li>
              <label>
                Reference<span>:</span>
              </label>
              <span>{selectedData?.reference}</span>
            </li>
            <li>
              <label>
                Status<span>:</span>
              </label>
              <span className="w-auto">
                <ReactSelectSingle
                  value={selectedData?.inquiry_status}
                  options={InquiryStatusList}
                  name="inquiry_status"
                  itemTemplate={statusItemTemplate}
                  className="select_with_tag"
                  onChange={e => {
                    setSelectedData({
                      ...selectedData,
                      inquiry_status: e.value,
                    });
                  }}
                  valueTemplate={statusItemTemplate}
                  placeholder="Select Status"
                />
              </span>
            </li>
            <li>
              <label className="w-100 mb10">Remark</label>
              <InputTextarea
                value={selectedData?.remark}
                onChange={e => {
                  setSelectedData({
                    ...selectedData,
                    remark: e.target.value,
                  });
                }}
                rows={5}
              />
            </li>
          </ul>
          <div className="text-center">
            <Button
              className="btn_primary"
              onClick={() => {
                let payload = {
                  inquiry_id: selectedData?._id,
                  inquiry_status: selectedData?.inquiry_status,
                  remark: selectedData?.remark,
                };
                dispatch(editInquiry(payload));
                setSelectedData(initialValues);
                setVisible(false);
              }}
            >
              <img src={EditIcon} alt="" />
              Save Inquiry
            </Button>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
