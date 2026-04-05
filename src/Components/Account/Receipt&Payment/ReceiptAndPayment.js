import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Row } from 'react-bootstrap';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import TrashIcon from '../../../Assets/Images/trash.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  deleteReceiptPayment,
  getReceiptPaymentlist,
  setClearAddReceiptPaymentData,
  setIsGetInitialValuesReceiptPayment,
  setReceiptAndPaymentCurrentPage,
  setReceiptAndPaymentDate,
  setReceiptAndPaymentPageLimit,
  setReceiptAndPaymentSearchParam,
} from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';
import { Password } from 'primereact/password';

export const receiptPaymentDeleteSchema = Yup.object().shape({
  admin_password: Yup.string().required('Admin Password is required'),
});

export default function ReceiptAndPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState(false);

  const {
    receiptPaymentList,
    receiptAndPaymentDate,
    receiptPaymentLoading,
    receiptAndPaymentPageLimit,
    receiptAndPaymentCurrentPage,
    receiptAndPaymentSearchParam,
    addEditPaymentReceiptLoading,
    isGetInitialValuesReceiptPayment,
  } = useSelector(({ receiptAndPayment }) => receiptAndPayment);

  const fetchRequiredData = useCallback(() => {
    dispatch(
      getReceiptPaymentlist({
        start: receiptAndPaymentCurrentPage,
        limit: receiptAndPaymentPageLimit,
        search: receiptAndPaymentSearchParam?.trim(),
        start_date:
          receiptAndPaymentDate?.length && receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
        end_date:
          receiptAndPaymentDate?.length && receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
      }),
    );
  }, [
    dispatch,
    receiptAndPaymentDate,
    receiptAndPaymentPageLimit,
    receiptAndPaymentCurrentPage,
    receiptAndPaymentSearchParam,
  ]);

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const res = await dispatch(deleteReceiptPayment(values));

      if (res?.payload) {
        resetForm();
        setDeletePopup(false);

        dispatch(setReceiptAndPaymentCurrentPage(1));

        const startDate =
          receiptAndPaymentDate?.length && receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          receiptAndPaymentDate?.length && receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '';

        await dispatch(
          getReceiptPaymentlist({
            start: 1,
            limit: receiptAndPaymentPageLimit,
            search: receiptAndPaymentSearchParam?.trim(),
            start_date: startDate,
            end_date: endDate,
          }),
        );
      }
    },
    [dispatch],
  );

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      admin_password: '',
      receipt_payment_id: '',
    },
    validationSchema: receiptPaymentDeleteSchema,
    onSubmit: submitHandle,
  });

  const onPageChange = page => {
    if (page !== receiptAndPaymentCurrentPage) {
      let pageIndex = receiptAndPaymentCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setReceiptAndPaymentCurrentPage(pageIndex));
      dispatch(
        getReceiptPaymentlist({
          start: pageIndex,
          limit: receiptAndPaymentPageLimit,
          search: receiptAndPaymentSearchParam?.trim(),
          start_date: receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
          end_date: receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
        }),
      );
    }
  };

  const onPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setReceiptAndPaymentCurrentPage(updatedCurrentPage));
    dispatch(setReceiptAndPaymentPageLimit(page));

    const pageValue =
      page === 0
        ? receiptPaymentList?.totalRows
          ? receiptPaymentList?.totalRows
          : 0
        : page;
    const prevPageValue =
      receiptAndPaymentPageLimit === 0
        ? receiptPaymentList?.totalRows
          ? receiptPaymentList?.totalRows
          : 0
        : receiptAndPaymentPageLimit;

    if (
      prevPageValue < receiptPaymentList?.totalRows ||
      pageValue < receiptPaymentList?.totalRows
    ) {
      dispatch(
        getReceiptPaymentlist({
          start: updatedCurrentPage,
          limit: page,
          search: receiptAndPaymentSearchParam?.trim(),
          start_date: receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
          end_date: receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
        }),
      );
    }
  };

  const actionBodyTemplate = row => {
    return (
      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            dispatch(
              setIsGetInitialValuesReceiptPayment({
                ...isGetInitialValuesReceiptPayment,
                edit: false,
              }),
            );
            navigate(`/edit-receipt-payment/${row?._id}`);
          }}
        />
        <img
          src={TrashIcon}
          alt=""
          className="cursor_pointer"
          onClick={() => {
            setDeletePopup(true);
            setFieldValue('receipt_payment_id', row._id);
          }}
        />
      </div>
    );
  };

  const AccountTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          dispatch(
            setIsGetInitialValuesReceiptPayment({
              ...isGetInitialValuesReceiptPayment,
              view: false,
            }),
          );
          navigate(`/view-receipt-payment/${rowData?._id}`, {
            state: { iseView: true },
          });
        }}
      >
        {rowData?.account_name}
      </div>
    );
  };

  const paymentNoTemplate = rowData => {
    return <span>{rowData?.type === 1 ? 'Receipt' : 'Payment'}</span>;
  };

  const paymentTypeTemplate = rowData => {
    return (
      <span>
        {rowData?.payment_type === 1
          ? 'Cash'
          : rowData?.payment_type === 2
          ? 'Bank'
          : 'Cheque'}
      </span>
    );
  };

  // const statusBodyTemplate = rowData => {
  //   const Status = ReceiptAndPaymentStatus?.find(
  //     item => item?.value === rowData?.status,
  //   );

  //   return (
  //     Status && (
  //       <Tag
  //         value={Status?.label}
  //         className="cursor_pointer"
  //         severity={getSeverityReceiptAndPayment(Status?.label)}
  //       ></Tag>
  //     )
  //   );
  // };

  const handleReceiptAndPaymentDate = useCallback(
    e => {
      dispatch(setReceiptAndPaymentDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setReceiptAndPaymentCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';

        dispatch(
          getReceiptPaymentlist({
            start: 1,
            limit: receiptAndPaymentPageLimit,
            search: receiptAndPaymentSearchParam?.trim(),
            start_date: startDate,
            end_date: endDate,
          }),
        );
      }
    },
    [dispatch, receiptAndPaymentPageLimit, receiptAndPaymentSearchParam],
  );

  const handleSearchInput = async (e, pageLimit, selecteddate) => {
    dispatch(setReceiptAndPaymentCurrentPage(1));

    const startDate =
      selecteddate?.length && selecteddate[0]
        ? moment(selecteddate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      selecteddate?.length && selecteddate[1]
        ? moment(selecteddate[1])?.format('YYYY-MM-DD')
        : '';

    await dispatch(
      getReceiptPaymentlist({
        start: 1,
        limit: pageLimit,
        search: e.target.value?.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {(addEditPaymentReceiptLoading || receiptPaymentLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center gy-3">
              <Col xl={3}>
                <div className="page_title">
                  <h3 className="m-0">Receipt / Payment</h3>
                </div>
              </Col>
              <Col xl={9}>
                <div className="right_filter_wrapper mt-2 mt-lg-0">
                  <ul className="receipt_ul">
                    <li>
                      <div className="date_select text-end">
                        <Calendar
                          id="ReceiptAndPaymentDate"
                          value={receiptAndPaymentDate}
                          placeholder="Select Date Range"
                          selectionMode="range"
                          dateFormat="dd-mm-yy"
                          onChange={e => {
                            handleReceiptAndPaymentDate(e);
                          }}
                          readOnlyInput
                          showButtonBar
                          showIcon
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={receiptAndPaymentSearchParam}
                          onChange={e => {
                            debounceHandleSearchInput(
                              e,
                              receiptAndPaymentPageLimit,
                              receiptAndPaymentDate,
                            );
                            dispatch(
                              setReceiptAndPaymentSearchParam(e.target.value),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          dispatch(
                            setIsGetInitialValuesReceiptPayment({
                              ...isGetInitialValuesReceiptPayment,
                              add: false,
                            }),
                          );
                          dispatch(setClearAddReceiptPaymentData());
                          navigate('/create-receipt-payment');
                        }}
                      >
                        <img src={PlusIcon} alt="" /> Create Receipt / Payment
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper">
            <DataTable
              value={receiptPaymentList?.list}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column field="payment_no" header="Payment No." sortable></Column>
              <Column field="payment_date" header="Date" sortable></Column>
              <Column
                field="account_name"
                header="Account Name"
                body={AccountTemplate}
                sortable
              ></Column>
              <Column
                field="client_name"
                header="Client Name"
                sortable
              ></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column
                field="type"
                header="Receipt / Payment"
                sortable
                body={paymentNoTemplate}
              ></Column>
              <Column
                field="payment_type"
                header="Payment Type"
                sortable
                body={paymentTypeTemplate}
              ></Column>
              {/* <Column
                field="status"
                header="Status"
                sortable
                body={statusBodyTemplate}
              ></Column> */}
              <Column
                field="action"
                header="Action"
                sortable
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={receiptPaymentList?.list}
              pageLimit={receiptAndPaymentPageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={receiptAndPaymentCurrentPage}
              totalCount={receiptPaymentList?.totalRows}
            />
          </div>
        </div>
        <Dialog
          header="Delete Confirmation"
          visible={deletePopup}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => {
            setDeletePopup(false);
            resetForm();
          }}
        >
          <div className="delete_wrapper py-4">
            <p className="ms-1">
              <div className="form_group mb-3">
                <label htmlFor="AdminPassword">
                  Admin Password <span className="text-danger fs-6">*</span>
                </label>
                <Password
                  id="AdminPassword"
                  name="admin_password"
                  className="w-100"
                  placeholder="Enter Admin Password"
                  value={values?.admin_password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  feedback={false}
                  required
                  toggleMask
                />
                {touched?.admin_password && errors?.admin_password && (
                  <p className="text-danger">{errors?.admin_password}</p>
                )}
              </div>
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              className="btn_border_dark"
              onClick={() => {
                setDeletePopup(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn_primary ms-3"
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  );
}
