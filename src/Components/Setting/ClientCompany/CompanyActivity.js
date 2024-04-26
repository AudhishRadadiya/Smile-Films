import React, { useRef, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import FilterIcon from '../../../Assets/Images/filter.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EyesIcon from '../../../Assets/Images/eyes.svg';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Col, Row } from 'react-bootstrap';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { Tag } from 'primereact/tag';

export const employeeData = [
  {
    date: '1/08/2023',
    invoice_no: 'INV-000001',
    order_number: '123456',
    amount: '10,000',
    balance_due: '10,000',
    status: 'Overdue',
    view: 'Overdue',
  },
  {
    date: '1/08/2023',
    invoice_no: 'INV-000001',
    order_number: '123456',
    amount: '10,000',
    balance_due: '10,000',
    status: 'Overdue',
    view: 'Overdue',
  },
  {
    date: '1/08/2023',
    invoice_no: 'INV-000001',
    order_number: '123456',
    amount: '10,000',
    balance_due: '10,000',
    status: 'Overdue',
    view: 'Overdue',
  },
  {
    date: '1/08/2023',
    invoice_no: 'INV-000001',
    order_number: '123456',
    amount: '10,000',
    balance_due: '10,000',
    status: 'Overdue',
    view: 'Overdue',
  },
  {
    date: '1/08/2023',
    invoice_no: 'INV-000001',
    order_number: '123456',
    amount: '10,000',
    balance_due: '10,000',
    status: 'Overdue',
    view: 'Overdue',
  },
];

export default function CompanyActivity() {
  const op = useRef(null);
  const [checked, setChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);

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

  const statusBodyTemplate = product => {
    return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
  };

  const getSeverity = product => {
    switch (product.status) {
      case 'Overdue':
        return 'warning';

      default:
        return null;
    }
  };

  const viewBodyTemplate = () => {
    return (
      <Button className="btn_border_dark">
        <img src={EyesIcon} alt="EyesIcon" />
        View
      </Button>
    );
  };

  return (
    <div className="company_activity_wrap p30 p20-md p15-sm">
      <div className="accordion_wrapper activity_accordion_wrapper">
        <Accordion activeIndex={0}>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Invoice</span>
                <div className="title_right_wrapper">
                  <ul>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={employeeData}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column field="date" header="Date" sortable></Column>
                  <Column
                    field="invoice_no"
                    header="Invoice No"
                    sortable
                  ></Column>
                  <Column
                    field="order_number"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="amount" header="Amount" sortable></Column>
                  <Column
                    field="balance_due"
                    header="Balance Due"
                    sortable
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusBodyTemplate}
                  ></Column>
                  <Column
                    field="view"
                    header=""
                    body={viewBodyTemplate}
                    style={{ width: '8%' }}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={employeeData}
                  pageLimit={pageLimit}
                  onPageChange={onPageChange}
                  onPageRowsChange={onPageRowsChange}
                  currentPage={currentPage}
                  totalCount={employeeData?.length}
                />
              </div>
            </div>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Customer Payment</span>
                <div className="title_right_wrapper">
                  <ul>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={employeeData}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column field="date" header="Date" sortable></Column>
                  <Column
                    field="invoice_no"
                    header="Invoice No"
                    sortable
                  ></Column>
                  <Column
                    field="order_number"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="amount" header="Amount" sortable></Column>
                  <Column
                    field="balance_due"
                    header="Balance Due"
                    sortable
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusBodyTemplate}
                  ></Column>
                  <Column
                    field="view"
                    header=""
                    body={viewBodyTemplate}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={employeeData}
                  pageLimit={pageLimit}
                  onPageChange={onPageChange}
                  onPageRowsChange={onPageRowsChange}
                  currentPage={currentPage}
                  totalCount={employeeData?.length}
                />
              </div>
            </div>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="company_activity_inner_wrap d-flex justify-content-between align-items-center">
                <span>Quotes</span>
                <div className="title_right_wrapper">
                  <ul>
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
                                      <span className="s-tag tag_info">
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
                                      <span className="s-tag tab_danger">
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
                    </li>
                    <li>
                      <Button className="btn_primary">
                        <img src={PlusIcon} alt="PlusIcon" />
                        Add New
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            }
          >
            <div className="accordion_inner p-0">
              <div className="data_table_wrapper max_height">
                <DataTable
                  value={employeeData}
                  sortField="price"
                  sortOrder={1}
                  rows={10}
                >
                  <Column field="date" header="Date" sortable></Column>
                  <Column
                    field="invoice_no"
                    header="Invoice No"
                    sortable
                  ></Column>
                  <Column
                    field="order_number"
                    header="Order Number"
                    sortable
                  ></Column>
                  <Column field="amount" header="Amount" sortable></Column>
                  <Column
                    field="balance_due"
                    header="Balance Due"
                    sortable
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusBodyTemplate}
                  ></Column>
                  <Column
                    field="view"
                    header=""
                    body={viewBodyTemplate}
                  ></Column>
                </DataTable>
                <CustomPaginator
                  dataList={employeeData}
                  pageLimit={pageLimit}
                  onPageChange={onPageChange}
                  onPageRowsChange={onPageRowsChange}
                  currentPage={currentPage}
                  totalCount={employeeData?.length}
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
}
