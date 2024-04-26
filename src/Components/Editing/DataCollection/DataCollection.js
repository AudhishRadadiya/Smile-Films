import React, { useState, useCallback, useEffect } from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../../Assets/Images/plus.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ActionBtn from '../../../Assets/Images/action.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ExportIcon from '../../../Assets/Images/export.svg';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAddSelectedDataCollectionData,
  clearUpdateSelectedDataCollectionData,
  deleteDataCollection,
  getDataCollectionList,
  setDataCollectionCurrentPage,
  setDataCollectionPageLimit,
  setDataCollectionSearchParam,
  setIsAddDataCollection,
  setIsDeleteDataCollection,
  setIsGetInintialValuesDataCollection,
  setIsUpdateDataCollection,
} from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';
import { DataCollectionList } from 'Helper/CommonList';

export default function DataCollection({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const {
    dataCollectionList,
    dataCollectionLoading,
    isAddDataCollection,
    isUpdateDataCollection,
    isDeleteDataCollection,
    dataCollectionPageLimit,
    dataCollectionCurrentPage,
    dataCollectionSearchParam,
    isGetInintialValuesDataCollection,
  } = useSelector(({ dataCollection }) => dataCollection);

  useEffect(() => {
    dispatch(
      getDataCollectionList({
        start: dataCollectionCurrentPage,
        limit: dataCollectionPageLimit,
        isActive: '',
        search: dataCollectionSearchParam,
      }),
    );
  }, [dispatch, dataCollectionCurrentPage, dataCollectionPageLimit]);

  useEffect(() => {
    if (
      isAddDataCollection ||
      isUpdateDataCollection ||
      isDeleteDataCollection
    ) {
      dispatch(
        getDataCollectionList({
          start: dataCollectionCurrentPage,
          limit: dataCollectionPageLimit,
          isActive: '',
          search: dataCollectionSearchParam,
        }),
      );
    }
    if (isUpdateDataCollection) {
      dispatch(setIsUpdateDataCollection(false));
    }
    if (isAddDataCollection) {
      dispatch(setIsAddDataCollection(false));
    }
    if (isDeleteDataCollection) {
      dispatch(setIsDeleteDataCollection(false));
    }
  }, [
    isAddDataCollection,
    isUpdateDataCollection,
    isDeleteDataCollection,
    dispatch,
    dataCollectionCurrentPage,
    dataCollectionPageLimit,
    dataCollectionSearchParam,
  ]);

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
            {' '}
            {is_edit_access && (
              <Dropdown.Item
                onClick={() => {
                  dispatch(
                    setIsGetInintialValuesDataCollection({
                      ...isGetInintialValuesDataCollection,
                      update: false,
                    }),
                  );
                  dispatch(clearUpdateSelectedDataCollectionData());
                  navigate(`/update-data-collection/${row?._id}`);
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

  const onPageChange = page => {
    let pageIndex = dataCollectionCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setDataCollectionCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setDataCollectionCurrentPage(page === 0 ? 0 : 1));
    dispatch(setDataCollectionPageLimit(page));
  };

  const handleDelete = useCallback(() => {
    const deleteItemObj = {
      order_id: deleteId,
    };
    if (deleteId) {
      dispatch(deleteDataCollection(deleteItemObj));
    }
    setDeletePopup(false);
  }, [dispatch, deleteId]);

  const handleSearchInput = e => {
    dispatch(setDataCollectionCurrentPage(1));
    dispatch(
      getDataCollectionList({
        start: 1,
        limit: dataCollectionPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const customDateSort = event => {
    const { data, order } = event;

    const sortedData = [...data]?.sort((a, b) => {
      const dateA = new Date(a?.create_date?.split('-')?.reverse()?.join('-'));
      const dateB = new Date(b?.create_date?.split('-')?.reverse()?.join('-'));

      if (order === 1) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    return sortedData;
  };

  const remarkBodyTemplate = item => {
    return (
      <div
        className="inner_editor_text"
        dangerouslySetInnerHTML={{ __html: item?.remark }}
      />
    );
  };

  const deviceTemplate = data => {
    let device = data?.device_name;
    let result;

    if (device?.length <= 0) {
      result = '';
    } else if (device?.length === 1) {
      result = device;
    } else {
      result = device?.flat().join(',');
    }
    return result;
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

  return (
    <div className="main_Wrapper">
      {dataCollectionLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Data Collection</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul className="deleted_ul">
                  <li className="search_wrapper">
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={dataCollectionSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(
                            setDataCollectionSearchParam(e.target.value),
                          );
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Dropdown className="dropdown_common export_dropdown position-static">
                      <OverlayTrigger
                        overlay={props => <Tooltip {...props}>Export</Tooltip>}
                        placement="bottom"
                      >
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          className="btn_border icon_btn"
                          placeholder="Right"
                        >
                          <img src={ExportIcon} alt="" width={20} height={20} />
                        </Dropdown.Toggle>
                      </OverlayTrigger>
                      <Dropdown.Menu>
                        <Dropdown.Item>PDF</Dropdown.Item>
                        <Dropdown.Item>XLS</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  {is_create_access === true && (
                    <li>
                      <Button
                        onClick={() => {
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
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={dataCollectionList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="inquiry_no" header="Collection No" sortable></Column>
            <Column
              field="create_date"
              header="Create Date"
              sortable
              customSort={customDateSort}
            ></Column>
            <Column
              field="company_name"
              header="Company Name"
              sortable
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column
              field="item_name"
              header="Item Names"
              sortable
              body={itemsNameBodyTemplate}
            ></Column>
            <Column
              field="project_type"
              header="Project Type"
              sortable
            ></Column>
            <Column
              field="device_name"
              header="Device Name"
              body={deviceTemplate}
              sortable
            ></Column>
            <Column field="data_size" header="Data Size" sortable></Column>
            <Column
              field="remark"
              header="Remark"
              sortable
              body={remarkBodyTemplate}
              className="with_concate"
            ></Column>
            <Column field="confirm_by" header="Confirm By" sortable></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={dataCollectionList?.list}
            pageLimit={dataCollectionPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={dataCollectionCurrentPage}
            totalCount={dataCollectionList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
}
