import CustomPaginator from 'Components/Common/CustomPaginator';
import _ from 'lodash';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Col, Row } from 'react-bootstrap';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';
import FilterIcon from '../../../Assets/Images/filter.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AssignedWorkedStatusFilterList,
  ClientProjectsStatusList,
} from 'Helper/CommonList';
import {
  getProjectList,
  setClientProjectCurrentPage,
  setClientProjectPageLimit,
  setClientProjectSearchParam,
  setClientProjectStatus,
} from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

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

const getSeverity = product => {
  switch (product) {
    case 'Running':
      return 'info';
    case 'Completed':
      return 'success';
    default:
      return null;
  }
};

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [checked, setChecked] = useState({
  //   run: false,
  //   complete: false,
  // });

  const {
    clientProjectList,
    clientProjectStatus,
    clientProjectLoading,
    clientProjectPageLimit,
    clientProjectCurrentPage,
    clientProjectSearchParam,
  } = useSelector(({ clientProject }) => clientProject);

  const getProjectListApi = useCallback(
    (currentPage = 1, pageLimit = 10, searchParam = '', status = '') => {
      dispatch(
        getProjectList({
          start: currentPage,
          limit: pageLimit,
          isActive: '',
          search: searchParam?.trim(),
          project_status: status,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getProjectListApi(
      clientProjectCurrentPage,
      clientProjectPageLimit,
      clientProjectSearchParam,
      clientProjectStatus,
    );
  }, []);

  const onPageChange = page => {
    if (page !== clientProjectCurrentPage) {
      let pageIndex = clientProjectCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setClientProjectCurrentPage(pageIndex));
      getProjectListApi(
        pageIndex,
        clientProjectPageLimit,
        clientProjectSearchParam,
        clientProjectStatus,
      );
    }
  };

  const onPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setClientProjectCurrentPage(updatedCurrentPage));
    dispatch(setClientProjectPageLimit(page));

    const pageValue =
      page === 0
        ? clientProjectList?.totalRows
          ? clientProjectList?.totalRows
          : 0
        : page;
    const prevPageValue =
      clientProjectPageLimit === 0
        ? clientProjectList?.totalRows
          ? clientProjectList?.totalRows
          : 0
        : clientProjectPageLimit;
    if (
      prevPageValue < clientProjectList?.totalRows ||
      pageValue < clientProjectList?.totalRows
    ) {
      getProjectListApi(
        updatedCurrentPage,
        page,
        clientProjectSearchParam,
        clientProjectStatus,
      );
    }
  };

  const handleSearchInput = (e, pageLimit, projectStatus) => {
    dispatch(setClientProjectCurrentPage(1));
    getProjectListApi(1, pageLimit, e.target.value, projectStatus);
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

  const OrderTemplate = rowData => {
    return (
      <span
        className="cursor_pointer hover_text"
        onClick={() => {
          navigate(`/project-details/${rowData?._id}`);
        }}
      >
        {rowData?.inquiry_no}
      </span>
    );
  };

  const CompanyNameTemplate = data => {
    return <span>{data?.couple_name}</span>;
  };

  const dataSizeBodyTemplate = rowData => {
    const dataSize = rowData?.data_size ? `${rowData?.data_size} GB` : '-';
    return <span>{dataSize}</span>;
  };

  const dateBodyTemplate = rowData => {
    let order_or_due_date = '';
    if (rowData?.inquiry_type === 'Exposing') {
      const orderStartDate = moment(rowData?.order_start_date)?.format(
        'DD-MM-YYYY',
      );
      const orderEndDate = moment(rowData?.order_end_date)?.format(
        'DD-MM-YYYY',
      );
      const exposingDate = `${orderStartDate ? orderStartDate : ''} ${
        orderEndDate ? ' To ' + orderEndDate : ''
      }`;

      order_or_due_date = exposingDate;
    } else {
      order_or_due_date = rowData?.due_date;
    }

    return <span>{order_or_due_date}</span>;
  };

  const projectStatusBodyTemplate = rowData => {
    const Status = AssignedWorkedStatusFilterList?.find(
      item => item?.value === rowData?.project_status,
    );

    return (
      <Tag
        value={Status?.label}
        severity={getSeverityStatus(Status?.label)}
      ></Tag>
    );
  };

  // const handleCheckBokChange = async e => {
  //   let data = [];
  //   let copy = {
  //     ...checked,
  //     [e.target.name]: e.target.checked,
  //   };
  //   setChecked({
  //     ...checked,
  //     [e.target.name]: e.target.checked,
  //   });

  //   if (copy.run === true) {
  //     data.push(1);
  //   }

  //   if (copy.complete === true) {
  //     data.push(2);
  //   }

  //   await dispatch(setClientProjectStatus(data));
  //   await dispatch(
  //     getProjectList({
  //       start: clientProjectCurrentPage,
  //       limit: clientProjectPageLimit,
  //       isActive: '',
  //       search: clientProjectSearchParam?.trim(),
  //       project_status: data,
  //     }),
  //   );
  // };

  const onChangeMultiSelector = e => {
    dispatch(setClientProjectStatus(e?.value));

    dispatch(
      getProjectList({
        start: clientProjectCurrentPage,
        limit: clientProjectPageLimit,
        isActive: '',
        search: clientProjectSearchParam?.trim(),
        project_status: e.value,
      }),
    );
  };

  const statusItemTemplate = option => {
    return <Tag value={option.label} severity={getSeverity(option.label)} />;
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
                          debounceHandleSearchInput(
                            e,
                            clientProjectPageLimit,
                            clientProjectStatus,
                          );
                          dispatch(setClientProjectSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li className="inquiry_multeselect w-auto">
                    <MultiSelect
                      options={ClientProjectsStatusList}
                      value={clientProjectStatus}
                      name="items"
                      onChange={e => {
                        onChangeMultiSelector(e);
                      }}
                      placeholder="Filter by Status"
                      className="btn_primary w-100"
                      itemTemplate={statusItemTemplate}
                    />
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
                                        name="run"
                                        onChange={e => handleCheckBokChange(e)}
                                        checked={checked?.run}
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
                                        name="complete"
                                        onChange={e => handleCheckBokChange(e)}
                                        checked={checked?.complete}
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
                  </li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={clientProjectList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="inquiry_no"
              header="Order No"
              sortable
              body={OrderTemplate}
            ></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="couple_name"
              header="Couple Name"
              body={CompanyNameTemplate}
              sortable
            ></Column>
            <Column field="inquiry_type" header="Item Type" sortable></Column>
            <Column field="item_name" header="Item Names" sortable></Column>
            <Column
              field="project_type"
              header="Project Type"
              sortable
            ></Column>
            <Column
              field="due_date"
              header="Order/Due Date"
              sortable
              body={dateBodyTemplate}
            ></Column>
            <Column
              field="data_size"
              header="Data Size"
              sortable
              body={dataSizeBodyTemplate}
            ></Column>
            <Column
              field="project_status"
              header="Project Status"
              sortable
              body={projectStatusBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={clientProjectList?.list}
            pageLimit={clientProjectPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={clientProjectCurrentPage}
            totalCount={clientProjectList?.totalRows}
          />
        </div>
      </div>
    </div>
  );
}
