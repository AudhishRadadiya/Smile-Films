import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import ActionBtn from '../../../Assets/Images/action.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Checkbox } from 'primereact/checkbox';
import { Link } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { setInquiryStatus } from 'Store/Reducers/ActivityOverview/inquirySlice';
import { useDispatch, useSelector } from 'react-redux';
import { InquiryStatusList } from 'Helper/CommonList';

export const inquiryData = [
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Jasmin & Ryan',
    item_Names: 'Wedding, Teaser, Pre-we...',
    item_type: 'Exposing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Completed',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Sophia & Ethan',
    item_Names: 'Wedding, Teaser, Pre-we...',
    item_type: 'Exposing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'In Progress',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Olivia & Liam',
    item_Names: 'Editing',
    item_type: 'Exposing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Initial',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Ava & Noah',
    item_Names: 'Pre-Wedding',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'In Progress',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Mia & Oliver',
    item_Names: 'Editing',
    item_type: 'Exposing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Initial',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Isabella & Lucas',
    item_Names: 'Teaser',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Cancelled',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Charlotte & Henry',
    item_Names: 'Exposing',
    item_type: 'Exposing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Initial',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Harper & Elijah',
    item_Names: 'Teaser',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Cancelled',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Amelia & William',
    item_Names: 'Exposing',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Initial',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Sanjay & Sangita',
    item_Names: 'Pre-Wedding',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Cancelled',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Naresh & Jamna',
    item_Names: 'Exposing',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Pending',
    action: 'action',
  },
  {
    order_no: '#56123',
    company_name: 'ABC Company',
    couple_name: 'Kapil & Krupa',
    item_Names: 'Wedding',
    item_type: 'Editing',
    invoice_no: '#8964',
    inquiry_date: '27/07/2023',
    amount: '₹ 33,000',
    commission: 'Yes',
    status: 'Cancelled',
    action: 'action',
  },
];

export default function Billing() {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);

  const { filterStatus } = useSelector(({ inquiry }) => inquiry);

  const statusBodyTemplate = product => {
    return (
      <Tag value={product.status} severity={getSeverity(product.status)}></Tag>
    );
  };

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

  const CompanyNameTemplate = () => {
    return <Link to="/view-billing">ABC Company</Link>;
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

  const statusItemTemplate = option => {
    return <Tag value={option.label} severity={getSeverity(option.label)} />;
  };

  const actionBodyTemplate = () => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="action_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <img src={EditIcon} alt="EditIcon" /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                // setDeleteId(id)
                setDeletePopup(true);
              }}
            >
              <img src={TrashIcon} alt="TrashIcon" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const onPageChange = page => {
    let pageIndex = currentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    setCurrentPage(pageIndex);
  };

  const onPageRowsChange = page => {
    setCurrentPage(page === 0 ? 0 : 1);
    setPageLimit(page);
  };

  return (
    <div className="main_Wrapper">
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
                          onChange={e => setChecked(e.checked)}
                          checked={checked}
                        ></Checkbox>
                      </div>
                      <span>Show Editing</span>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setChecked(e.checked)}
                          checked={checked}
                        ></Checkbox>
                      </div>
                      <span>Show Exposing</span>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setChecked(e.checked)}
                          checked={checked}
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
                  <li className="inquiry_multeselect">
                    <MultiSelect
                      options={InquiryStatusList}
                      value={filterStatus}
                      name="items"
                      onChange={e => {
                        dispatch(setInquiryStatus(e.target.value));
                      }}
                      placeholder="Filter by Status"
                      className="btn_border w-100"
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
            value={inquiryData}
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
              field="inquiry_date"
              header="Invoice Date"
              sortable
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              className="with_concate"
            ></Column>
            <Column field="commission" header="Commission" sortable></Column>
            <Column
              field="payment_status"
              header="Payment Status"
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
            dataList={inquiryData}
            pageLimit={pageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={currentPage}
            totalCount={inquiryData?.length}
          />
        </div>
      </div>
    </div>
  );
}
