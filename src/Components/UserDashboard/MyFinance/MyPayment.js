import React, { useCallback, useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  getDetailsMyPay,
  getListMyPay,
  setMyPaymentCurrentPage,
  setMyPaymentMonth,
  setMyPaymentPageLimit,
  setMyPaymentYear,
} from 'Store/Reducers/UserFlow/MyFinance/MyPaymentSlice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { numberToWords } from 'Helper/CommonHelper';

export default function MyPayment() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const {
    myPayList,
    myPayListLoading,
    myPaymentCurrentPage,
    myPaymentPageLimit,
    myPaymentYear,
    myPaymentMonth,
    myPayDetails,
  } = useSelector(({ myPayment }) => myPayment);

  // const totalAmount = myPayDetails?.totalAmount || 0;
  // const amountInWords = numberToWords(totalAmount);

  const getMyPayment = useCallback(
    (
      start = 1,
      limit = 10,
      year = myPaymentYear,
      month = myPaymentMonth,
      preview = false,
    ) => {
      dispatch(
        getListMyPay({
          start: start,
          limit: limit,
          year: year,
          month: month,
          preview: preview,
        }),
      );
    },
    [dispatch, myPaymentMonth, myPaymentYear],
  );

  useEffect(() => {
    getMyPayment();
  }, [getMyPayment]);

  const currentYear = moment().year();
  const fiveYears = Array.from(
    { length: 5 },
    (_, index) => currentYear - index,
  );
  const YearOption = fiveYears.map(year => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const handleYearChange = e => {
    dispatch(setMyPaymentCurrentPage(1));
    dispatch(setMyPaymentYear(e.value));
  };

  const currentMonth = moment().month();
  const MonthOption = Array.from({ length: 5 }, (_, index) => {
    const monthIndex = currentMonth - index;
    const months = monthIndex < 0 ? 12 + monthIndex : monthIndex;
    return {
      label: moment().month(months).format('MMM').toUpperCase(),
      value: (months + 1).toString(),
    };
  });

  const handleMonthChange = month => {
    if (month?.value !== null) {
      dispatch(setMyPaymentMonth(month?.value));
      dispatch(setMyPaymentCurrentPage(1));
    }
  };

  const paymentMonthName = moment()
    .month(myPaymentMonth - 1)
    .format('MMM');

  const justifyTemplate = option => {
    return <span>{option?.label}</span>;
  };

  const onPageChange = page => {
    if (page !== myPaymentCurrentPage) {
      let pageIndex = myPaymentCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setMyPaymentCurrentPage(pageIndex));

      getMyPayment(pageIndex, myPaymentPageLimit, myPaymentCurrentPage);
    }
  };

  const onPageRowsChange = page => {
    dispatch(setMyPaymentCurrentPage(page === 0 ? 0 : 1));
    dispatch(setMyPaymentPageLimit(page));
    const pageValue =
      page === 0 ? (myPayList?.totalRows ? myPayList?.totalRows : 0) : page;
    const prevPageValue =
      myPaymentPageLimit === 0
        ? myPayList?.totalRows
          ? myPayList?.totalRows
          : 0
        : myPaymentPageLimit;

    if (
      prevPageValue < myPayList?.totalRows ||
      pageValue < myPayList?.totalRows
    ) {
      getMyPayment(page === 0 ? 0 : 1, page);
    }
  };

  const calculateTotalAmount = useCallback(() => {
    return (
      myPayList?.list?.reduce((total, pay) => {
        return total + (pay?.amount ? parseFloat(pay?.amount) : 0);
      }, 0) || 0
    );
  }, [myPayList]);

  const MyPayFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={6} />
        <Column footer={`₹ ${calculateTotalAmount()}`} />
      </Row>
    </ColumnGroup>
  );

  const CreateDateTemplate = data => {
    return moment(data?.create_date)?.format('DD-MM-YYYY');
  };

  const handlePreview = () => {
    dispatch(
      getDetailsMyPay({
        start: myPaymentCurrentPage,
        limit: myPaymentPageLimit,
        year: myPaymentYear,
        month: myPaymentMonth,
        preview: true,
      }),
    );
    setVisible(true);
  };

  const handleDownload = useCallback(() => {
    dispatch(
      getDetailsMyPay({
        start: myPaymentCurrentPage,
        limit: myPaymentPageLimit,
        year: myPaymentYear,
        month: myPaymentMonth,
        pdf: true,
        preview: true,
      }),
    )
      .then(res => {
        const response = res?.payload?.data;
        if (response?.link) {
          window.open(response?.link);
        }
        setVisible(false);
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, [
    dispatch,
    myPaymentCurrentPage,
    myPaymentPageLimit,
    myPaymentYear,
    myPaymentMonth,
  ]);

  const CreateInvoiceTemplate = rowData => {
    return rowData?.invoice_no || '0';
  };

  const CreateAmountTemplate = rowData => {
    return rowData?.amount || '0';
  };

  const CreatePercentageTemplate = rowData => {
    return rowData?.commision_percentage || '-';
  };

  const RateTemplate = rowData => {
    return rowData?.commission_amount || '-';
  };

  const CreateItemTemplate = rowData => {
    return rowData?.item_name || '-';
  };

  return (
    <div className="main_Wrapper">
      {myPayListLoading && <Loader />}
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
                      onClick={handlePreview}
                    >
                      <img src={ShowIcon} alt="" /> Preview Slip
                    </Button>
                  </li>
                  <li>
                    <div className="calender_filter_Wrap d-flex align-items-center justify-content-end">
                      <SelectButton
                        value={myPaymentMonth}
                        onChange={handleMonthChange}
                        itemTemplate={justifyTemplate}
                        options={MonthOption}
                        optionLabel="value"
                      />
                    </div>
                  </li>
                  <li>
                    <div class="form_group">
                      <ReactSelectSingle
                        filter
                        value={myPaymentYear}
                        options={YearOption}
                        onChange={e => {
                          handleYearChange(e);
                        }}
                        placeholder="Select month"
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
            value={myPayList?.list || []}
            sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={MyPayFooterGroup}
          >
            <Column field="order_no" header="Order No." sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              sortable
            ></Column>
            <Column field="couple_name" header="Couple Name" sortable></Column>
            <Column
              field="entry_date"
              header="Entry Date"
              sortable
              body={CreateDateTemplate}
            ></Column>
            <Column
              field="invoice_no"
              header="Invoice No."
              sortable
              body={CreateInvoiceTemplate}
            ></Column>
            <Column
              field="item_name"
              header="Item Name"
              sortable
              body={CreateItemTemplate}
            ></Column>
            <Column
              field="commission_amount"
              header="Rate"
              body={RateTemplate}
              sortable
            ></Column>
            <Column
              field="commission_percentage"
              header="Commission %"
              sortable
              body={CreatePercentageTemplate}
            ></Column>
            <Column
              field="amount"
              header="Commission Amount"
              sortable
              body={CreateAmountTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={myPayList?.list || []}
            pageLimit={
              !myPayList?.totalRows || myPayList?.totalRows === 0
                ? 0
                : myPaymentPageLimit
            }
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={
              !myPayList?.totalRows || myPayList?.totalRows === 0
                ? 0
                : myPaymentCurrentPage
            }
            totalCount={myPayList?.totalRows}
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
          <h2>{`Pay Slip ${paymentMonthName}  ${myPaymentYear}`}</h2>
        </div>
        <div className="delete_popup_wrapper">
          <div className="client_payment_details">
            <Row className="justify-content-between">
              <Col lg={5}>
                <div className="voucher_head">
                  <h5>{myPayDetails?.company_name}</h5>
                </div>
                <div className="user_bank_details">
                  <p>{myPayDetails?.address || '-'}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="client_payment_details p-0">
            <div className="voucher_head">
              <h4>{myPayDetails?.employee_name || '-'}</h4>
            </div>
            <ul>
              <li>
                <h5 className="text_gray">Employee No.</h5>
                <h4 className="m-0">{myPayDetails?.employee_no || '-'}</h4>
              </li>
              <li>
                <h5 className="text_gray">Joining Date</h5>
                <h4 className="m-0">
                  {moment(myPayDetails?.joining_date)?.format('DD-MM-YYYY') ||
                    '-'}
                </h4>
              </li>
              <li>
                <h5 className="text_gray">Role</h5>
                <h4 className="m-0">{myPayDetails?.role || '-'}</h4>
              </li>
            </ul>
            <ul>
              <li>
                <h5 className="text_gray">Bank</h5>
                <h4 className="m-0">{myPayDetails?.bank_name || '-'}</h4>
              </li>
              <li>
                <h5 className="text_gray">Bank IFSC</h5>
                <h4 className="m-0">{myPayDetails?.ifsc_code || '-'}</h4>
              </li>
              <li>
                <h5 className="text_gray">Bank Account</h5>
                <h4 className="m-0">{myPayDetails?.account_no || '-'}</h4>
              </li>
              <li>
                <h5 className="text_gray">Account Type</h5>
                <h4 className="m-0">{myPayDetails?.account_type || '-'}</h4>
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
                  <h5>{myPayDetails?.totalAmount || '-'}</h5>
                </div>
                <div className="salary_details">
                  <h5 className="salary_type">Net Salary in Words</h5>
                  <h5>{myPayDetails?.amountWords || '-'}</h5>
                </div>
              </li>
            </ul>
          </div>
          <div className="delete_btn_wrap">
            <button className="btn_primary" onClick={handleDownload}>
              <img src={DownloadIcon} alt="DownloadIcon" /> Download
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
