import React, { useCallback, useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import PlusIcon from '../../../Assets/Images/plus.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
  deletePurchaseInvoice,
  getPurchaseInvoiceList,
  setIsGetInitialValuesPurchaseInvoice,
  setPurchaseInvoiceCurrentPage,
  setPurchaseInvoiceDate,
  setPurchaseInvoicePageLimit,
  setPurchaseInvoiceSearchParam,
} from 'Store/Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';

export default function PurchaseInvoice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    purchaseInvoicePageLimit,
    purchaseInvoiceCurrentPage,
    purchaseInvoiceSearchParam,
    purchaseInvoiceList,
    purchaseInvoiceLoading,
    isGetInitialValuesPurchaseInvoice,
    purchaseInvoiceDate,
  } = useSelector(({ purchaseInvoice }) => purchaseInvoice);

  const fetchRequiredData = useCallback(
    async (
      currentPage = 1,
      pageLimit = 10,
      searchParam = '',
      startDate = '',
      endDate = '',
    ) => {
      await dispatch(
        getPurchaseInvoiceList({
          start: currentPage,
          limit: pageLimit,
          search: searchParam?.trim(),
          start_date: startDate,
          end_date: endDate,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const startDate =
      purchaseInvoiceDate?.length && purchaseInvoiceDate[0]
        ? moment(purchaseInvoiceDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      purchaseInvoiceDate?.length && purchaseInvoiceDate[1]
        ? moment(purchaseInvoiceDate[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(
      purchaseInvoiceCurrentPage,
      purchaseInvoicePageLimit,
      purchaseInvoiceSearchParam,
      startDate,
      endDate,
    );
  }, []);

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
      //           dispatch(
      //             setIsGetInitialValuesPurchaseInvoice({
      //               ...isGetInitialValuesPurchaseInvoice,
      //               update: false,
      //             }),
      //           );
      //           navigate(`/edit-purchase-invoice/${data?._id}`);
      //         }}
      //       >
      //         <img src={EditIcon} alt="EditIcon" /> Edit
      //       </Dropdown.Item>
      //       <Dropdown.Item
      //         onClick={() => {
      //           setDeleteId(data?._id);
      //           setDeletePopup(true);
      //         }}
      //       >
      //         <img src={TrashIcon} alt="TrashIcon" /> Delete
      //       </Dropdown.Item>
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>

      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            dispatch(
              setIsGetInitialValuesPurchaseInvoice({
                ...isGetInitialValuesPurchaseInvoice,
                update: false,
              }),
            );
            navigate(`/edit-purchase-invoice/${data?._id}`);
          }}
        />
        <img
          src={TrashIcon}
          alt=""
          className="cursor_pointer"
          onClick={() => {
            setDeleteId(data?._id);
            setDeletePopup(true);
          }}
        />
      </div>
    );
  };

  const InvoiceNoTemplate = data => {
    return <span>{data?.purchase_invoice_no}</span>;
  };

  const PurchaseTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          dispatch(
            setIsGetInitialValuesPurchaseInvoice({
              ...isGetInitialValuesPurchaseInvoice,
              view: false,
            }),
          );
          navigate(`/view-purchase-invoice/${rowData?._id}`, {
            state: { iseView: true },
          });
        }}
      >
        {rowData?.client_company}
      </div>
    );
  };

  const PurchaseDateTemplate = data => {
    return moment(data.create_date)?.format('DD-MM-YYYY');
  };

  const onPageChange = page => {
    if (page !== purchaseInvoiceCurrentPage) {
      let pageIndex = purchaseInvoiceCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setPurchaseInvoiceCurrentPage(pageIndex));

      const startDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[0]
          ? moment(purchaseInvoiceDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[1]
          ? moment(purchaseInvoiceDate[1])?.format('YYYY-MM-DD')
          : '';

      fetchRequiredData(
        pageIndex,
        purchaseInvoicePageLimit,
        purchaseInvoiceSearchParam,
        startDate,
        endDate,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setPurchaseInvoiceCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPurchaseInvoicePageLimit(page));

    const pageValue =
      page === 0
        ? purchaseInvoiceList?.totalRows
          ? purchaseInvoiceList?.totalRows
          : 0
        : page;
    const prevPageValue =
      purchaseInvoicePageLimit === 0
        ? purchaseInvoiceList?.totalRows
          ? purchaseInvoiceList?.totalRows
          : 0
        : purchaseInvoicePageLimit;

    if (
      prevPageValue < purchaseInvoiceList?.totalRows ||
      pageValue < purchaseInvoiceList?.totalRows
    ) {
      const startDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[0]
          ? moment(purchaseInvoiceDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[1]
          ? moment(purchaseInvoiceDate[1])?.format('YYYY-MM-DD')
          : '';

      fetchRequiredData(
        page === 0 ? 0 : 1,
        page,
        purchaseInvoiceSearchParam,
        startDate,
        endDate,
      );
    }
  };

  const handleDate = useCallback(
    async e => {
      if (e?.value?.[0] !== null && e?.value?.[1] !== null) {
        const startDate = e.value?.[0]
          ? moment(e.value[0])?.format('YYYY-MM-DD')
          : '';

        const endDate = e.value?.[1]
          ? moment(e.value[1])?.format('YYYY-MM-DD')
          : '';

        dispatch(setPurchaseInvoiceCurrentPage(1));

        fetchRequiredData(
          purchaseInvoiceCurrentPage,
          purchaseInvoicePageLimit,
          purchaseInvoiceSearchParam,
          startDate,
          endDate,
        );

        // await dispatch(
        //   getPurchaseInvoiceList({
        //     start: purchaseInvoiceCurrentPage,
        //     limit: purchaseInvoicePageLimit,
        //     search: purchaseInvoiceSearchParam,
        //     start_date: e.value?.[0]
        //       ? moment(e.value[0])?.format('YYYY-MM-DD')
        //       : '',
        //     end_date: e.value?.[1]
        //       ? moment(e.value[1])?.format('YYYY-MM-DD')
        //       : '',
        //   }),
        // );
      }
    },
    [
      dispatch,
      purchaseInvoiceCurrentPage,
      purchaseInvoicePageLimit,
      purchaseInvoiceSearchParam,
    ],
  );

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        purchase_invoice_id: deleteId,
      };

      const startDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[0]
          ? moment(purchaseInvoiceDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        purchaseInvoiceDate?.length && purchaseInvoiceDate[1]
          ? moment(purchaseInvoiceDate[1])?.format('YYYY-MM-DD')
          : '';

      if (deleteId) {
        dispatch(deletePurchaseInvoice(deleteItemObj))
          .then(response => {
            fetchRequiredData(
              purchaseInvoiceCurrentPage,
              purchaseInvoicePageLimit,
              purchaseInvoiceSearchParam,
              startDate,
              endDate,
            );
            // dispatch(
            //   getPurchaseInvoiceList({
            //     start: purchaseInvoiceCurrentPage,
            //     limit: purchaseInvoicePageLimit,
            //     search: purchaseInvoiceSearchParam,
            //     start_date: startDate,
            //     end_date: endDate,
            //   }),
            // );
          })
          .catch(error => {
            console.error('Error fetching delete data:', error);
          });
      }
      setDeletePopup(false);
    },
    [
      dispatch,
      deleteId,
      purchaseInvoiceDate,
      purchaseInvoicePageLimit,
      purchaseInvoiceCurrentPage,
      purchaseInvoiceSearchParam,
    ],
  );

  const handlePurchaseInvoiceDate = useCallback(
    e => {
      dispatch(setPurchaseInvoiceDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setPurchaseInvoiceCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';

        // dispatch(
        //   getPurchaseInvoiceList({
        //     start: 1,
        //     limit: purchaseInvoicePageLimit,
        //     search: purchaseInvoiceSearchParam,
        //     start_date: startDate,
        //     end_date: endDate,
        //   }),
        // );

        fetchRequiredData(
          1,
          purchaseInvoicePageLimit,
          purchaseInvoiceSearchParam,
          startDate,
          endDate,
        );
      }
    },
    [dispatch, purchaseInvoicePageLimit, purchaseInvoiceSearchParam],
  );

  const handleSearchInput = async (e, pageLimit, selecteddate) => {
    dispatch(setPurchaseInvoiceCurrentPage(1));

    const startDate =
      selecteddate?.length && selecteddate[0]
        ? moment(selecteddate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      selecteddate?.length && selecteddate[1]
        ? moment(selecteddate[1])?.format('YYYY-MM-DD')
        : '';

    // await dispatch(
    //   getPurchaseInvoiceList({
    //     start: 1,
    //     limit: pageLimit,
    //     search: e.target.value?.trim(),
    //     start_date: startDate,
    //     end_date: endDate,
    //   }),
    // );

    fetchRequiredData(1, pageLimit, e.target.value?.trim(), startDate, endDate);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {purchaseInvoiceLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-2">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">Purchase Invoice</h3>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper">
                <ul className="expenses_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={purchaseInvoiceDate}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        showButtonBar
                        onChange={e => {
                          handlePurchaseInvoiceDate(e);
                        }}
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
                        value={purchaseInvoiceSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            purchaseInvoicePageLimit,
                            purchaseInvoiceDate,
                          );
                          dispatch(
                            setPurchaseInvoiceSearchParam(e.target.value),
                          );
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => {
                        dispatch(
                          setIsGetInitialValuesPurchaseInvoice({
                            ...isGetInitialValuesPurchaseInvoice,
                            add: false,
                          }),
                        );
                        navigate('/create-purchase-invoice');
                      }}
                      className="btn_primary"
                    >
                      <img src={PlusIcon} alt="" /> Create Purchase Invoice
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper purchase_invoice_table">
          <DataTable
            value={purchaseInvoiceList ? purchaseInvoiceList?.list : []}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="purchase_invoice_no."
              header="Invoice No."
              sortable
              body={InvoiceNoTemplate}
            ></Column>
            <Column
              field="date"
              header="Create Date"
              body={PurchaseDateTemplate}
              sortable
            ></Column>
            <Column
              field="client_company"
              header="Client Company"
              sortable
              body={PurchaseTemplate}
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column field="total_amount" header="Amount" sortable></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={purchaseInvoiceList?.list}
            pageLimit={purchaseInvoicePageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={purchaseInvoiceCurrentPage}
            totalCount={purchaseInvoiceList?.totalRows}
          />
          <ConfirmDeletePopup
            moduleName={'Purchase Invoice'}
            deletePopup={deletePopup}
            deleteId={deleteId}
            handleDelete={handleDelete}
            setDeletePopup={setDeletePopup}
          />
        </div>
      </div>
    </div>
  );
}
