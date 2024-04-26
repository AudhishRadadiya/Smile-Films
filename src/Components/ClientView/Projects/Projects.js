import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Column } from 'primereact/column';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import FilterIcon from '../../../Assets/Images/filter.svg';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Checkbox } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProjectList,
  setClientProjectCurrentPage,
  setClientProjectPageLimit,
  setClientProjectSearchParam,
} from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';
import Loader from 'Components/Common/Loader';
import _ from 'lodash';

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const op = useRef(null);
  const [checked, setChecked] = useState(false);

  const {
    clientProjectCurrentPage,
    clientProjectPageLimit,
    clientProjectSearchParam,
    clientProjectList,
    clientProjectLoading,
  } = useSelector(({ clientProject }) => clientProject);

  useEffect(() => {
    dispatch(
      getProjectList({
        start: clientProjectCurrentPage,
        limit: clientProjectPageLimit,
        isActive: '',
        search: clientProjectSearchParam,
      }),
    );
  }, [dispatch]);

  const onPageChange = page => {
    let pageIndex = clientProjectCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setClientProjectCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setClientProjectCurrentPage(page === 0 ? 0 : 1));
    dispatch(setClientProjectPageLimit(page));
  };

  const handleSearchInput = e => {
    dispatch(setClientProjectCurrentPage(1));
    dispatch(
      getProjectList({
        start: 1,
        limit: clientProjectPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  const ItemNameTemplate = product => {
    return (
      <>
        <div className="item_name_wrapper">
          <Button
            className="btn_as_text"
            placeholder="bottom"
            tooltip="Wedding, Teaser, Pre-Wedding"
            type="button"
            label="Wedding, Teaser, Pre-Wedding"
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </>
    );
  };

  const CompanyNameTemplate = data => {
    return (
      <span
        className="cursor_pointer"
        onClick={() => {
          navigate(`/project-details/${data?._id}`);
        }}
      >
        {data?.couple_name}
      </span>
    );
  };

  return (
    <div className="main_Wrapper">
      {clientProjectLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xxl={3} sm={2}>
              <div className="page_title">
                <h3 className="m-0">Projects</h3>
              </div>
            </Col>
            <Col xxl={9} sm={10}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={clientProjectSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setClientProjectSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li>
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
                                      Running
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
                                    <span className="p-tag p-component p-tag-success">
                                      Completed
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </OverlayPanel>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={clientProjectList}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="inquiry_no" header="Order No" sortable></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="couple_name"
              header="Couple Name"
              body={CompanyNameTemplate}
              sortable
            ></Column>
            <Column field="inquiry_type" header="Item Type" sortable></Column>
            <Column
              field="item_name"
              header="Item Names"
              // body={ItemNameTemplate}
              sortable
            ></Column>
            <Column
              field="project_type"
              header="Project Type"
              sortable
            ></Column>
            <Column field="due_date" header="Due Date" sortable></Column>
            <Column field="data_size" header="Data Size" sortable></Column>
          </DataTable>
          <CustomPaginator
            dataList={clientProjectList}
            pageLimit={clientProjectPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={clientProjectCurrentPage}
            totalCount={clientProjectList?.length}
          />
        </div>
      </div>
    </div>
  );
}
