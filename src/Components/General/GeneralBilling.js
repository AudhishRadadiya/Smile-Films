import { memo, useCallback, useEffect } from 'react';
import { Column } from 'primereact/column';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import PlusIcon from '../../Assets/Images/plus.svg';
// import TrashIcon from '../../Assets/Images/trash.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
  // deleteGeneralBilling,
  setIsGetInitialValuesGeneralBilling,
  getGeneralBillingList,
  setGeneralBillingCurrentPage,
  setGeneralBillingDate,
  setGeneralBillingPageLimit,
  setGeneralBillingSearchParam,
} from 'Store/Reducers/GeneralBilling/GeneralBillingSlice';
// import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';

const GeneralBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [deleteId, setDeleteId] = useState('');
  // const [deletePopup, setDeletePopup] = useState(false);

  const {
    generalBillingPageLimit,
    generalBillingCurrentPage,
    generalBillingSearchParam,
    generalBillingList,
    generalBillingLoading,
    generalBillingDate,
    isGetInitialValuesGeneralBilling,
  } = useSelector(({ generalBilling }) => generalBilling);

  const fetchRequiredData = useCallback(
    async (
      currentPage = 1,
      pageLimit = 10,
      searchParam = '',
      startDate = '',
      endDate = '',
    ) => {
      await dispatch(
        getGeneralBillingList({
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
      generalBillingDate?.length && generalBillingDate[0]
        ? moment(generalBillingDate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      generalBillingDate?.length && generalBillingDate[1]
        ? moment(generalBillingDate[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(
      generalBillingCurrentPage,
      generalBillingPageLimit,
      generalBillingSearchParam,
      startDate,
      endDate,
    );
  }, []);

  const actionBodyTemplate = data => {
    return (
      <div className="d-flex gap-3">
        <img
          alt=""
          src={EditIcon}
          className="cursor_pointer"
          onClick={() => {
            dispatch(
              setIsGetInitialValuesGeneralBilling({
                ...isGetInitialValuesGeneralBilling,
                edit: false,
              }),
            );
            navigate(`/edit-general-billing/${data?._id}`);
          }}
        />

        {/* <img
          src={TrashIcon}
          alt=""
          className="cursor_pointer"
          onClick={() => {
            setDeleteId(data?._id);
            setDeletePopup(true);
          }}
        /> */}
      </div>
    );
  };

  const BillingNoTemplate = data => {
    return <span>{data?.billing_no}</span>;
  };

  const BillingAmountTemplate = data => {
    return <span>{data?.currency_symbol + ' ' + data?.total_amount}</span>;
  };

  const BillingClientTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          dispatch(
            setIsGetInitialValuesGeneralBilling({
              ...isGetInitialValuesGeneralBilling,
              view: false,
            }),
          );
          navigate(`/view-general-billing/${rowData?._id}`, {
            state: { iseView: true },
          });
        }}
      >
        {rowData?.client_name}
      </div>
    );
  };

  const BillingDueDateTemplate = data => {
    return moment(data.due_date)?.format('DD-MM-YYYY');
  };

  const onPageChange = page => {
    if (page !== generalBillingCurrentPage) {
      let pageIndex = generalBillingCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setGeneralBillingCurrentPage(pageIndex));

      const startDate =
        generalBillingDate?.length && generalBillingDate[0]
          ? moment(generalBillingDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        generalBillingDate?.length && generalBillingDate[1]
          ? moment(generalBillingDate[1])?.format('YYYY-MM-DD')
          : '';

      fetchRequiredData(
        pageIndex,
        generalBillingPageLimit,
        generalBillingSearchParam,
        startDate,
        endDate,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setGeneralBillingCurrentPage(page === 0 ? 0 : 1));
    dispatch(setGeneralBillingPageLimit(page));

    const pageValue =
      page === 0
        ? generalBillingList?.totalRows
          ? generalBillingList?.totalRows
          : 0
        : page;
    const prevPageValue =
      generalBillingPageLimit === 0
        ? generalBillingList?.totalRows
          ? generalBillingList?.totalRows
          : 0
        : generalBillingPageLimit;

    if (
      prevPageValue < generalBillingList?.totalRows ||
      pageValue < generalBillingList?.totalRows
    ) {
      const startDate =
        generalBillingDate?.length && generalBillingDate[0]
          ? moment(generalBillingDate[0])?.format('YYYY-MM-DD')
          : '';
      const endDate =
        generalBillingDate?.length && generalBillingDate[1]
          ? moment(generalBillingDate[1])?.format('YYYY-MM-DD')
          : '';

      fetchRequiredData(
        page === 0 ? 0 : 1,
        page,
        generalBillingSearchParam,
        startDate,
        endDate,
      );
    }
  };

  // const handleDelete = useCallback(
  //   async => {
  //     const deleteItemObj = {
  //       general_billing_id: deleteId,
  //     };

  //     const startDate =
  //       generalBillingDate?.length && generalBillingDate[0]
  //         ? moment(generalBillingDate[0])?.format('YYYY-MM-DD')
  //         : '';
  //     const endDate =
  //       generalBillingDate?.length && generalBillingDate[1]
  //         ? moment(generalBillingDate[1])?.format('YYYY-MM-DD')
  //         : '';

  //     if (deleteId) {
  //       dispatch(deleteGeneralBilling(deleteItemObj))
  //         .then(response => {
  //           fetchRequiredData(
  //             generalBillingCurrentPage,
  //             generalBillingPageLimit,
  //             generalBillingSearchParam,
  //             startDate,
  //             endDate,
  //           );
  //         })
  //         .catch(error => {
  //           console.error('Error fetching delete data:', error);
  //         });
  //     }
  //     setDeletePopup(false);
  //   },
  //   [
  //     dispatch,
  //     deleteId,
  //     generalBillingDate,
  //     generalBillingPageLimit,
  //     generalBillingCurrentPage,
  //     generalBillingSearchParam,
  //   ],
  // );

  const handleGeneralBillingDate = useCallback(
    e => {
      dispatch(setGeneralBillingDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setGeneralBillingCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';

        fetchRequiredData(
          1,
          generalBillingPageLimit,
          generalBillingSearchParam,
          startDate,
          endDate,
        );
      }
    },
    [dispatch, generalBillingPageLimit, generalBillingSearchParam],
  );

  const handleSearchInput = async (e, pageLimit, selecteddate) => {
    dispatch(setGeneralBillingCurrentPage(1));

    const startDate =
      selecteddate?.length && selecteddate[0]
        ? moment(selecteddate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      selecteddate?.length && selecteddate[1]
        ? moment(selecteddate[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(1, pageLimit, e.target.value?.trim(), startDate, endDate);
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {generalBillingLoading && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-2">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">General Billing</h3>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper">
                <ul className="expenses_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={generalBillingDate}
                        placeholder="Select Date Range"
                        showIcon
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                        showButtonBar
                        onChange={e => {
                          handleGeneralBillingDate(e);
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
                        value={generalBillingSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(
                            e,
                            generalBillingPageLimit,
                            generalBillingDate,
                          );
                          dispatch(
                            setGeneralBillingSearchParam(e.target.value),
                          );
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => {
                        dispatch(
                          setIsGetInitialValuesGeneralBilling({
                            ...isGetInitialValuesGeneralBilling,
                            add: false,
                          }),
                        );
                        navigate('/create-general-billing');
                      }}
                      className="btn_primary"
                    >
                      <img src={PlusIcon} alt="" /> Create General Billing
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper purchase_invoice_table">
          <DataTable
            value={generalBillingList ? generalBillingList?.list : []}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="billing_no"
              header="Billing No."
              sortable
              body={BillingNoTemplate}
            ></Column>
            <Column
              field="client_name"
              header="Client Name"
              body={BillingClientTemplate}
              sortable
            ></Column>
            <Column
              field="due_date"
              header="Due Date"
              body={BillingDueDateTemplate}
              sortable
            ></Column>
            <Column field="mobile_number" header="Mobile No." sortable></Column>
            <Column
              field="payment_method"
              header="Payment Method"
              sortable
            ></Column>
            <Column
              field="total_amount"
              header="Amount"
              body={BillingAmountTemplate}
              sortable
            ></Column>
            <Column
              field="action"
              header="Action"
              sortable
              body={actionBodyTemplate}
            ></Column>
          </DataTable>

          <CustomPaginator
            dataList={generalBillingList?.list}
            pageLimit={generalBillingPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={generalBillingCurrentPage}
            totalCount={generalBillingList?.totalRows}
          />

          {/* <ConfirmDeletePopup
            moduleName={'General Billing'}
            deletePopup={deletePopup}
            deleteId={deleteId}
            handleDelete={handleDelete}
            setDeletePopup={setDeletePopup}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default memo(GeneralBilling);
