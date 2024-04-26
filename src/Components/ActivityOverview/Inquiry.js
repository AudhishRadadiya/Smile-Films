import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Col, Dropdown, Row } from 'react-bootstrap';
import ExportIcon from '../../Assets/Images/export.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Sidebar } from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InquiryStatusFilterList, InquiryStatusList } from 'Helper/CommonList';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAddSelectedInquiryData,
  clearUpdateSelectedInquiryData,
  deleteInquiry,
  editInquiry,
  getInquiryList,
  setInquiryCurrentPage,
  setInquiryPageLimit,
  setInquirySearchParam,
  setInquiryStatus,
  setIsAddInquiry,
  setIsDeleteInquiry,
  setIsGetInintialValuesInquiry,
  setIsUpdateInquiry,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';

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

  useEffect(() => {
    dispatch(
      getInquiryList({
        start: inquiryCurrentPage,
        limit: inquiryPageLimit,
        isActive: '',
        search: inquirySearchParam,
        inquiry_status: inquiryStatus,
      }),
    );
  }, [dispatch, inquiryCurrentPage, inquiryPageLimit]);

  useEffect(() => {
    if (isAddInquiry || isUpdateInquiry || isDeleteInquiry) {
      dispatch(
        getInquiryList({
          start: inquiryCurrentPage,
          limit: inquiryPageLimit,
          isActive: '',
          search: inquirySearchParam,
          inquiry_status: inquiryStatus,
        }),
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
    isAddInquiry,
    isUpdateInquiry,
    isDeleteInquiry,
    dispatch,
    inquiryCurrentPage,
    inquiryPageLimit,
    inquirySearchParam,
    inquiryStatus,
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
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="action_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInintialValuesInquiry({
                      ...isGetInintialValuesInquiry,
                      update: false,
                    }),
                  );
                  dispatch(clearUpdateSelectedInquiryData());
                  navigate(`/update-inquiry/${row?._id}`);
                }}
              >
                <img src={EditIcon} alt="EditIcon" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeleteId(row?._id);
                  setDeletePopup(true);
                }}
              >
                <img src={TrashIcon} alt="TrashIcon" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
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
    let pageIndex = inquiryCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setInquiryCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setInquiryCurrentPage(page === 0 ? 0 : 1));
    dispatch(setInquiryPageLimit(page));
  };

  const handleSearchInput = e => {
    dispatch(setInquiryCurrentPage(1));
    dispatch(
      getInquiryList({
        start: 1,
        limit: inquiryPageLimit,
        isActive: '',
        search: e.target.value,
        inquiry_status: inquiryStatus,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
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
                            search: inquirySearchParam,
                            inquiry_status: e.target.value,
                          }),
                        );
                      }}
                      placeholder="Filter by Status"
                      className="btn_primary w-100"
                      itemTemplate={statusItemTemplate}
                    />
                  </li>
                  <li>
                    <Link to="" className="btn_border icon_btn">
                      <img src={ExportIcon} alt="" />
                    </Link>
                  </li>
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
            <Column field="mobile_no" header="Contact Number" sortable></Column>
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
              header="Remark"
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
              sortable
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
