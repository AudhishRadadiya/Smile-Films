import React, { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import DownloadIcon from '../../../Assets/Images/download-icon.svg';
import LogoImg from '../../../Assets/Images/logo.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';

export const inquiryData = [
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
  {
    entry_date: '27/07/2023',
    invoice_no: '#56123',
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    commission: '25%',
    commission_amount: '₹ 6,000',
  },
];

export default function MyPay() {
  const [value, setValue] = useState('30 DAYS');
  const [visible, setVisible] = useState(false);
  const [orderSelect, setOrderSelect] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(30);

  const stateOrderChange = e => {
    setOrderSelect(e.value);
  };
  const Order = [
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
  ];

  const justifyOptions = [
    { value: '30 DAYS' },
    { value: 'JUN' },
    { value: 'May' },
    { value: 'APR' },
    { value: 'MAR' },
    { value: 'FEB' },
    { value: 'JAN' },
  ];
  const justifyTemplate = option => {
    return <span>{option.value}</span>;
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

  const MyPayfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={6} />
        <Column footer="₹ 45,000" />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center g-4">
            <Col lg={3}>
              <div className="page_title">
                <h3 className="m-0">My Pay</h3>
              </div>
            </Col>
            <Col lg={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <Button
                      className="btn_border_dark filter_btn"
                      onClick={() => setVisible(true)}
                    >
                      <img src={ShowIcon} alt="" /> Preview Slip
                    </Button>
                  </li>
                  <li>
                    <div className="calender_filter_Wrap d-flex align-items-center justify-content-end">
                      <SelectButton
                        value={value}
                        onChange={e => setValue(e.value)}
                        itemTemplate={justifyTemplate}
                        optionLabel="value"
                        options={justifyOptions}
                      />
                    </div>
                  </li>
                  <li>
                    <div class="form_group">
                      <ReactSelectSingle
                        filter
                        value={orderSelect}
                        options={Order}
                        onChange={e => {
                          stateOrderChange(e);
                        }}
                        placeholder="2023"
                      />
                    </div>
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
            footerColumnGroup={MyPayfooterGroup}
          >
            <Column field="entry_date" header="Entry Date" sortable></Column>
            <Column field="invoice_no" header="Invoice No." sortable></Column>
            <Column field="order_no" header="Order No." sortable></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="item_names"
              header="Item Names"
              body={ItemNameTemplate}
              sortable
            ></Column>
            <Column field="commission" header="Commission %" sortable></Column>
            <Column
              field="commission_amount"
              header="Commission Amount"
              sortable
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

      {/* preview popup */}
      <Dialog
        header={
          <div className="dialog_logo">
            <img src={LogoImg} alt="" />
          </div>
        }
        className="modal_Wrapper payment_dialog quotation_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="voucher_text">
          <h2>Pay Slip July 2023</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>Smile Films</h5>
                </div>
                <div className="user_bank_details">
                  <p>
                    406 DHARA ARCADE, NEAR MAHADEV CHOWK MOTA VARACHHA SURAT
                    GUJARAT 394101
                  </p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_payment_details p-0">
            <div className="voucher_head">
              <h4>ArYan Kapoor</h4>
            </div>
            <ul>
              <li>
                <h5 className="text_gray">Employee No.</h5>
                <h4 className="m-0">210</h4>
              </li>
              <li>
                <h5 className="text_gray">Joining Date</h5>
                <h4 className="m-0">20 May 20219</h4>
              </li>
              <li>
                <h5 className="text_gray">Role</h5>
                <h4 className="m-0">Admin</h4>
              </li>
              <li>
                <h5 className="text_gray">Sub Role</h5>
                <h4 className="m-0">N/A</h4>
              </li>
            </ul>
            <ul>
              <li>
                <h5 className="text_gray">Bank</h5>
                <h4 className="m-0">HDFC Bank</h4>
              </li>
              <li>
                <h5 className="text_gray">Bank IFSC</h5>
                <h4 className="m-0">HDFC000489</h4>
              </li>
              <li>
                <h5 className="text_gray">Bank Account</h5>
                <h4 className="m-0">9013537809123</h4>
              </li>
              <li>
                <h5 className="text_gray">Account Type</h5>
                <h4 className="m-0">Saving</h4>
              </li>
            </ul>
          </div>
          <div className="client_payment_details p-0">
            <div className="voucher_head">
              <h4>Salary Details</h4>
            </div>
            <ul className="salary_details_wrap">
              <li>
                <div className="salary_details mb20">
                  <h5 className="salary_type">Net Salary payable</h5>
                  <h5>₹ 46,800</h5>
                </div>
                <div className="salary_details">
                  <h5 className="salary_type">Net Salary in Words</h5>
                  <h5>Fourthy six Thousand Eight hundred Only</h5>
                </div>
              </li>
            </ul>
          </div>
          <div className="delete_btn_wrap">
            <button className="btn_primary" onClick={() => setVisible(false)}>
              <img src={DownloadIcon} alt="DownloadIcon" /> Download
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
