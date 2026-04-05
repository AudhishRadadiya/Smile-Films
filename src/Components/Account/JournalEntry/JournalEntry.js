import React, { useCallback, useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import CustomPaginator from 'Components/Common/CustomPaginator';
import PlusIcon from '../../../Assets/Images/plus.svg';
import ActionBtn from '../../../Assets/Images/action.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteJournalEntry,
  listJournalEntry,
  setJournalEntryCurrentPage,
  setJournalEntryEndDate,
  setJournalEntryPageLimit,
  setJournalEntrySearchParam,
  setJournalEntryStartDate,
  setDate,
  setIsGetInitialValuesJournalEntry,
} from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';
import moment from 'moment';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';
import { Button } from 'primereact/button';

export default function JournalEntry() {
  const dispatch = useDispatch();
  const {
    listJournalEntryData,
    journalEntryPageLimit,
    journalEntrySearchParam,
    journalEntryStartDate,
    journalEntryEndDate,
    journalEntryCurrentPage,
    listJournalEntryLoading,
    deleteJournalEntryLoading,
    date,
    isGetInitialValuesJournalEntry,
  } = useSelector(({ journalEntry }) => journalEntry);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const getList = useCallback(
    (start = 1, limit = 10, search = '', start_date = '', end_date = '') => {
      dispatch(
        listJournalEntry({
          start: start,
          limit: limit,
          search: search?.trim(),
          start_date: start_date,
          end_date: end_date,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    // dispatch(
    //   listJournalEntry({
    //     start: journalEntryCurrentPage,
    //     limit: journalEntryPageLimit,
    //     search: journalEntrySearchParam,
    //     start_date: journalEntryStartDate,
    //     end_date: journalEntryEndDate,
    //   }),
    // );
    getList(
      journalEntryCurrentPage,
      journalEntryPageLimit,
      journalEntrySearchParam,
      journalEntryStartDate,
      journalEntryEndDate,
    );
  }, []);

  const onPageChange = page => {
    if (page !== journalEntryCurrentPage) {
      let pageIndex = journalEntryCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setJournalEntryCurrentPage(pageIndex));
      // dispatch(
      //   listJournalEntry({
      //     start: journalEntryCurrentPage,
      //     limit: journalEntryPageLimit,
      //     search: journalEntrySearchParam,
      //     start_date: journalEntryStartDate,
      //     end_date: journalEntryEndDate,
      //   }),
      // );
      getList(
        pageIndex,
        journalEntryPageLimit,
        journalEntrySearchParam,
        journalEntryStartDate,
        journalEntryEndDate,
      );
    }
  };

  const onPageRowsChange = page => {
    dispatch(setJournalEntryCurrentPage(page === 0 ? 0 : 1));
    dispatch(setJournalEntryPageLimit(page));
    const pageValue =
      page === 0
        ? listJournalEntryData?.totalRows
          ? listJournalEntryData?.totalRows
          : 0
        : page;
    const prevPageValue =
      journalEntryPageLimit === 0
        ? listJournalEntryData?.totalRows
          ? listJournalEntryData?.totalRows
          : 0
        : journalEntryPageLimit;
    if (
      prevPageValue < listJournalEntryData?.totalRows ||
      pageValue < listJournalEntryData?.totalRows
    ) {
      getList(
        page === 0 ? 0 : 1,
        page,
        journalEntrySearchParam,
        journalEntryStartDate,
        journalEntryEndDate,
      );
    }
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        journal_entry_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteJournalEntry(deleteItemObj))
          .then(response => {
            dispatch(
              listJournalEntry({
                start: journalEntryCurrentPage,
                limit: journalEntryPageLimit,
                search: journalEntrySearchParam?.trim(),
                start_date: journalEntryStartDate,
                end_date: journalEntryEndDate,
              }),
            );
          })
          .catch(error => {
            console.error('Error fetching delete data:', error);
          });
      }
      setDeletePopup(false);
    },
    [dispatch, deleteId],
  );

  const handleSearchInput = e => {
    dispatch(setJournalEntryCurrentPage(1));
    dispatch(
      listJournalEntry({
        start: journalEntryCurrentPage,
        limit: journalEntryPageLimit,
        search: e.target.value?.trim(),
        start_date: journalEntryStartDate,
        end_date: journalEntryEndDate,
      }),
    );
  };

  const handleDate = useCallback(
    e => {
      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setJournalEntryCurrentPage(1));

        const sendData = {
          start: journalEntryCurrentPage,
          limit: journalEntryPageLimit,
          search: journalEntrySearchParam?.trim(),
          start_date: e.value?.[0]
            ? moment(e.value?.[0])?.format('YYYY-MM-DD')
            : '',
          end_date: e.value?.[1]
            ? moment(e.value?.[1])?.format('YYYY-MM-DD')
            : '',
        };

        dispatch(listJournalEntry(sendData));
      }
    },
    [
      dispatch,
      journalEntryCurrentPage,
      journalEntryPageLimit,
      journalEntrySearchParam,
    ],
  );
  const debounceHandleSearchInput = useCallback(
    _.debounce(e => {
      handleSearchInput(e);
    }, 800),
    [journalEntryEndDate, journalEntryStartDate],
  );

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
      //             setIsGetInitialValuesJournalEntry({
      //               ...isGetInitialValuesJournalEntry,
      //               update: false,
      //             }),
      //           );
      //           navigate(`/edit-journal-entry/${data?._id}`);
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
              setIsGetInitialValuesJournalEntry({
                ...isGetInitialValuesJournalEntry,
                update: false,
              }),
            );
            navigate(`/edit-journal-entry/${data?._id}`);
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

  const PaymentCompanyName = data => {
    return (
      <Link to={`/view-journal-entry/${data?._id}`} className="hover_text">
        {data.payment_company_name}
      </Link>
    );
  };

  const CreateDateTemplate = data => {
    return moment(data.create_date)?.format('DD-MM-YYYY');
  };

  return (
    <div className="main_Wrapper">
      {(listJournalEntryLoading || deleteJournalEntryLoading) && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">Journal Entry</h3>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper mt-2 mt-lg-0">
                <ul className="entry_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        id=" ConsumptionDate"
                        value={date}
                        placeholder="Select Date Range"
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        onChange={e => {
                          dispatch(setDate(e?.value));

                          dispatch(
                            setJournalEntryStartDate(
                              e.value?.[0]
                                ? moment(e.value?.[0])?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );
                          dispatch(
                            setJournalEntryEndDate(
                              e.value?.[1]
                                ? moment(e.value?.[1])?.format('YYYY-MM-DD')
                                : '',
                            ),
                          );

                          handleDate(e);
                        }}
                        readOnlyInput
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
                        value={journalEntrySearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setJournalEntrySearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      onClick={() => {
                        dispatch(
                          setIsGetInitialValuesJournalEntry({
                            ...isGetInitialValuesJournalEntry,
                            add: false,
                          }),
                        );
                        navigate('/create-journal-entry');
                      }}
                      className="btn_primary"
                    >
                      <img src={PlusIcon} alt="" /> Create Journal Entry
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={listJournalEntryData ? listJournalEntryData?.list : []}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="payment_no" header="Payment No." sortable></Column>
            <Column
              field="create_date"
              header="Date"
              sortable
              body={CreateDateTemplate}
            ></Column>
            <Column
              field="payment_company_name"
              header="Payment Company Name"
              body={PaymentCompanyName}
              sortable
            ></Column>
            <Column
              field="receive_client_name"
              header="Receive Client Name"
              sortable
            ></Column>
            <Column field="total_amount" header="Amount" sortable></Column>
            <Column
              field="payment_type"
              header="Payment Type"
              sortable
            ></Column>
            <Column
              field="action"
              header="Action"
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={listJournalEntryData?.list}
            pageLimit={journalEntryPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={journalEntryCurrentPage}
            totalCount={listJournalEntryData?.totalRows}
          />
          <ConfirmDeletePopup
            moduleName={'Journal Entry'}
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
