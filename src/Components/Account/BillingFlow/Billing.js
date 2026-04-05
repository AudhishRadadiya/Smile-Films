import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { useDispatch, useSelector } from 'react-redux';

import {
  getBillingList,
  setBillingCurrentPage,
  setBillingItemType,
  setBillingListCheckboxs,
  setBillingPageLimit,
  setBillingPaymentCompleted,
  setBillingPaymentStatus,
  setBillingSearchParam,
} from 'Store/Reducers/Accounting/Billing/BillingSlice';
import Loader from 'Components/Common/Loader';
import { BillingStatusList } from 'Helper/CommonList';
import EditIcon from '../../../Assets/Images/edit.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';

const getSeverity = product => {
  switch (product) {
    case 'Partial':
      return 'primary';
    case 'Due':
      return 'danger';
    case 'Completed':
      return 'success';
    default:
      return null;
  }
};

export default function Billing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [checkboxes, setCheckboxes] = useState({
  //   editing: false,
  //   exposing: false,
  //   paymentCompleted: false,
  // });

  const {
    billingListData,
    billingCurrentPage,
    billingPageLimit,
    billingSearchParam,
    billingItemType,
    billingPaymentStatus,
    billingPaymentCompleted,
    billingListCheckboxs,
    billingListLoading,
  } = useSelector(({ billing }) => billing);

  const getBillingListApi = useCallback(
    (
      start = 1,
      limit = 10,
      search = '',
      item_type = '',
      payment_status = '',
      payment_completed = '',
    ) => {
      dispatch(
        getBillingList({
          start: start,
          limit: limit,
          search: search?.trim(),
          item_type: item_type,
          payment_status: payment_status,
          payment_completed: payment_completed,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getBillingListApi(
      billingCurrentPage,
      billingPageLimit,
      billingSearchParam,
      billingItemType,
      billingPaymentStatus,
      billingPaymentCompleted,
    );
  }, []);

  const statusBodyTemplate = data => {
    return (
      <Tag
        value={data?.payment_status}
        severity={getSeverity(data?.payment_status)}
      ></Tag>
    );
  };

  const ItemNameTemplate = data => {
    let buttonTooltip = data?.item_name;
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

  const amountTemplate = rowData => {
    return (
      <div>
        <span>{rowData?.amount}</span>
        {rowData?.partial_amount ? (
          <span style={{ color: '#c94444' }}>
            {` (₹ ${rowData?.partial_amount || 0} pending)`}
          </span>
        ) : (
          ''
        )}
      </div>
    );
  };

  const CompanyNameTemplate = data => {
    return (
      <Link to={`/edit-billing/${data?._id}`} className="hover_text">
        {data?.company_name}
      </Link>
    );
  };

  const statusItemTemplate = option => {
    return <Tag value={option.label} severity={getSeverity(option.label)} />;
  };

  const actionBodyTemplate = data => {
    return (
      // <div className="dropdown_action_wrap">
      //   <Dropdown className="dropdown_common position-static">
      //     <Dropdown.Toggle id="dropdown-basic" className="action_btn">
      //       <img src={ActionBtn} alt="" />
      //     </Dropdown.Toggle>
      //     <Dropdown.Menu>
      //       <Dropdown.Item
      //         onClick={() => {
      //           navigate(`/edit-billing/${data?._id}`);
      //         }}
      //       >
      //         <img src={EditIcon} alt="EditIcon" /> Edit
      //       </Dropdown.Item>
      //       {/* <Dropdown.Item
      //         onClick={() => {
      //           // setDeleteId(id)
      //           setDeletePopup(true);
      //         }}
      //       >
      //         <img src={TrashIcon} alt="TrashIcon" /> Delete
      //       </Dropdown.Item> */}
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>
      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            navigate(`/edit-billing/${data?._id}`);
          }}
        />
      </div>
    );
  };

  const handleCheckboxChange = (name, checked) => {
    let data = [];

    let copy = {
      ...billingListCheckboxs,
      [name]: checked,
    };

    dispatch(
      setBillingListCheckboxs({
        ...billingListCheckboxs,
        [name]: checked,
      }),
    );

    const paymentCompletedData = copy.paymentCompleted === true ? 1 : 0;

    // setCheckboxes(prevState => ({
    //   ...prevState,
    //   [name]: checked,
    // }));

    if (copy.editing === true) {
      data.push(1);
    }

    if (copy.exposing === true) {
      data.push(2);
    }

    dispatch(setBillingItemType(data));
    dispatch(setBillingPaymentCompleted(paymentCompletedData));
    dispatch(setBillingCurrentPage(1));

    getBillingListApi(
      1,
      billingPageLimit,
      billingSearchParam,
      data,
      billingPaymentStatus,
      paymentCompletedData,
    );
  };

  const onPageChange = page => {
    if (page !== billingCurrentPage) {
      let pageIndex = billingCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(setBillingCurrentPage(pageIndex));
      getBillingListApi(
        pageIndex,
        billingPageLimit,
        billingSearchParam,
        billingItemType,
        billingPaymentStatus,
        billingPaymentCompleted,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setBillingCurrentPage(page === 0 ? 0 : 1));
    dispatch(setBillingPageLimit(page));
    const pageValue =
      page === 0
        ? billingListData?.totalRows
          ? billingListData?.totalRows
          : 0
        : page;
    const prevPageValue =
      billingPageLimit === 0
        ? billingListData?.totalRows
          ? billingListData?.totalRows
          : 0
        : billingPageLimit;
    if (
      prevPageValue < billingListData?.totalRows ||
      pageValue < billingListData?.totalRows
    ) {
      getBillingListApi(
        page === 0 ? 0 : 1,
        page,
        billingSearchParam,
        billingItemType,
        billingPaymentStatus,
        billingPaymentCompleted,
      );
    }
  };

  const onChangeMultiSelector = e => {
    dispatch(setBillingPaymentStatus(e.value));
    dispatch(setBillingCurrentPage(1));

    // dispatch(
    //   getBillingList({
    //     start: billingCurrentPage,
    //     limit: billingPageLimit,
    //     search: billingSearchParam,
    //     item_type: billingItemType,
    //     payment_status: e.value,
    //     payment_completed: billingPaymentCompleted,
    //   }),
    // );
    getBillingListApi(
      1,
      billingPageLimit,
      billingSearchParam,
      billingItemType,
      e.value,
      billingPaymentCompleted,
    );
  };

  const handleSearchInput = e => {
    dispatch(setBillingCurrentPage(1));
    // dispatch(
    //   getBillingList({
    //     start: billingCurrentPage,
    //     limit: billingPageLimit,
    //     search: e.target.value,
    //     item_type: billingItemType,
    //     payment_status: billingPaymentStatus,
    //     payment_completed: billingPaymentCompleted,
    //   }),
    // );
    getBillingListApi(
      billingCurrentPage,
      billingPageLimit,
      e.target.value?.trim(),
      billingItemType,
      billingPaymentStatus,
      billingPaymentCompleted,
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(e => {
      handleSearchInput(e);
    }, 800),
    [billingPaymentCompleted, billingPaymentStatus],
  );
  return (
    <div className="main_Wrapper">
      {billingListLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xxl={3} xl={2}>
              <div className="page_title">
                <h3 className="m-0">Billing Generate</h3>
              </div>
            </Col>
            <Col xxl={9} xl={10}>
              <div className="right_filter_wrapper">
                <ul className="billing_ul">
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          name="editing"
                          onChange={e =>
                            handleCheckboxChange('editing', e.checked)
                          }
                          checked={billingListCheckboxs?.editing}
                        ></Checkbox>
                      </div>
                      <span>Show Editing</span>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          name="exposing"
                          onChange={e =>
                            handleCheckboxChange('exposing', e.checked)
                          }
                          checked={billingListCheckboxs?.exposing}
                        ></Checkbox>
                      </div>
                      <span>Show Exposing</span>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          name="paymentCompleted"
                          onChange={e =>
                            handleCheckboxChange('paymentCompleted', e.checked)
                          }
                          checked={billingListCheckboxs?.paymentCompleted}
                        ></Checkbox>
                      </div>
                      <span>Payment Completed</span>
                    </div>
                  </li>
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={billingSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setBillingSearchParam(e.target.value));
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
                      options={BillingStatusList}
                      value={billingPaymentStatus}
                      name="items"
                      onChange={e => {
                        onChangeMultiSelector(e);
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
            value={billingListData ? billingListData?.list : []}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="order_no" header="Order No" sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              body={CompanyNameTemplate}
              sortable
            ></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="item_Names"
              header="Item Names"
              body={ItemNameTemplate}
              sortable
            ></Column>
            <Column field="item_type" header="Item Type" sortable></Column>
            <Column field="invoice_no" header="Invoice No" sortable></Column>
            <Column
              field="invoice_date"
              header="Invoice Date"
              sortable
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              className="with_concate"
              body={amountTemplate}
            ></Column>
            <Column field="commision" header="Commission" sortable></Column>
            <Column
              field="payment_status"
              header="Payment Status"
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
            dataList={billingListData?.list}
            pageLimit={billingPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={billingCurrentPage}
            totalCount={billingListData?.totalRows}
          />
        </div>
      </div>
    </div>
  );
}
