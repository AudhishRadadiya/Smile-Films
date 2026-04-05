import React, { memo, useCallback, useMemo } from 'react';
import moment from 'moment';
import { useFormik } from 'formik';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button, Col, Row } from 'react-bootstrap';
import { ColumnGroup } from 'primereact/columngroup';
import { InputNumber } from 'primereact/inputnumber';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  addJournalEntry,
  editJournalEntry,
  setClearCreateJournalEntryData,
  setClearUpdateJournalEntryData,
  setCreateJournalEntryData,
  setIsGetInitialValuesJournalEntry,
  setUpdateJournalEntryData,
} from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';
import { validationSchemaJournalEntry } from '../../../Schema/Accounting/JournalEntry/journalEntrySchema';

const payment = [
  { label: 'Cash', value: 1 },
  { label: 'Bank', value: 2 },
  { label: 'Cheque', value: 3 },
];

const JournalEntryDetails = ({ initialValues }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const {
    paymentNoLoading,
    addJournalEntryLoading,
    getJournalEntryLoading,
    editJournalEntryLoading,
    createJournalEntryData,
    updateJournalEntryData,
    isGetInitialValuesJournalEntry,
  } = useSelector(({ journalEntry }) => journalEntry);

  const { clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { accountLoading } = useSelector(({ account }) => account);

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (id) {
      if (locationPath[1] === 'edit-journal-entry') {
        dispatch(
          setUpdateJournalEntryData({
            ...updateJournalEntryData,
            ...fieldObject,
          }),
        );
      }
    } else {
      dispatch(
        setCreateJournalEntryData({
          ...createJournalEntryData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const commonUpdateFieldValue = (fieldName, fieldValue) => {
    if (id) {
      if (locationPath[1] === 'edit-journal-entry') {
        dispatch(
          setUpdateJournalEntryData({
            ...updateJournalEntryData,
            [fieldName]: fieldValue,
          }),
        );
      }
    } else {
      dispatch(
        setCreateJournalEntryData({
          ...createJournalEntryData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  const handleJournalEntry = useCallback(
    async sendData => {
      try {
        if (id) {
          const res = await dispatch(editJournalEntry(sendData));

          if (res?.payload) {
            dispatch(
              setIsGetInitialValuesJournalEntry({
                ...isGetInitialValuesJournalEntry,
                update: false,
              }),
            );
            dispatch(setClearUpdateJournalEntryData());
            navigate('/journal-entry');
          }
        } else {
          const res = await dispatch(addJournalEntry(sendData));
          if (res?.payload) {
            dispatch(
              setIsGetInitialValuesJournalEntry({
                ...isGetInitialValuesJournalEntry,
                add: false,
              }),
            );
            dispatch(setClearCreateJournalEntryData());
            navigate('/journal-entry');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [id, dispatch, navigate, isGetInitialValuesJournalEntry],
  );

  const submitHandle = useCallback(
    values => {
      const updatedJournalEntryDetails = values?.journalEntryData?.map(
        (item, index) => {
          return {
            journal_entry_detail_id: item?._id,
            type: index + 1,
            account_id: item?.account_id,
            credit: item?.credit,
            debit: item?.debit,
          };
        },
      );

      const payload = {
        ...(id && { journal_entry_id: id }),
        payment_no: values?.payment_no,
        create_date: moment(values?.create_date)?.format('YYYY-MM-DD'),
        payment_type: values?.payment_type,
        payment_group: values?.payment_group,
        remark: values?.remark,
        journal_entry_details: updatedJournalEntryDetails,
      };

      handleJournalEntry(payload);
    },
    [id, handleJournalEntry],
  );

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: validationSchemaJournalEntry,
      onSubmit: submitHandle,
    });

  const totalDebitAndCredit = useMemo(() => {
    let calculatedTotalCredit = 0;
    let calculatedTotalDebit = 0;

    if (values?.journalEntryData?.length) {
      calculatedTotalCredit = values?.journalEntryData?.reduce(
        (total, entry) =>
          total + (entry?.credit ? parseFloat(entry?.credit || 0) : 0),
        0,
      );
      calculatedTotalDebit = values?.journalEntryData?.reduce(
        (total, entry) =>
          total + (entry?.debit ? parseFloat(entry?.debit || 0) : 0),
        0,
      );
    }
    return { calculatedTotalCredit, calculatedTotalDebit };
  }, [values?.journalEntryData]);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={2} />
        <Column footer={` ${totalDebitAndCredit?.calculatedTotalDebit}`} />
        <Column footer={` ${totalDebitAndCredit?.calculatedTotalCredit}`} />
      </Row>
    </ColumnGroup>
  );

  const handleTableSelectChange = (rowData, fieldName, value) => {
    const updatedData = [...values?.journalEntryData];

    const index = updatedData.findIndex(item => item === rowData);

    if (index !== -1) {
      updatedData[index] = {
        ...updatedData[index],
        [fieldName]: value,
      };

      commonUpdateFieldValue('journalEntryData', updatedData);
    }
  };

  const AccountTemplate = data => {
    return (
      <div className="form_group d-flex">
        <ReactSelectSingle
          filter
          name="account_id"
          placeholder="Select Account"
          value={data?.account_id}
          options={values?.account_list}
          onChange={e => {
            handleTableSelectChange(data, e.target.name, e.target.value);
          }}
          onBlur={handleBlur}
          required
        />
      </div>
    );
  };

  const CreditTemplate = data => {
    return (
      <>
        {data?.transaction_type === 'CR' ? (
          <InputNumber
            placeholder="Enter Amount"
            name="credit"
            value={
              !isNaN(values?.journalEntryData[0]?.credit)
                ? values?.journalEntryData[0]?.credit > 1000000000
                  ? 1000000000
                  : values?.journalEntryData[0]?.credit
                : 0
            }
            onChange={e => {
              const regex = new RegExp(`^\\d{0,10}(?:\\.\\d{1,2})?$`);
              if (regex.test(e?.value ? e?.value : 0)) {
                handleTableSelectChange(
                  data,
                  e.originalEvent.target.name,
                  !e.value ? 0 : e.value > 1000000000 ? 1000000000 : e.value,
                );
              }
            }}
            required
            minFractionDigits={0}
            maxFractionDigits={2}
            min={0}
            useGrouping={false}
            // max={1000000000}
            maxLength="10"
          />
        ) : (
          <p>0</p>
        )}
      </>
    );
  };

  const DebitTemplate = data => {
    return (
      <>
        {data?.transaction_type === 'DB' ? (
          <InputNumber
            placeholder="Enter Amount"
            name="debit"
            value={
              !isNaN(values?.journalEntryData[1]?.debit)
                ? values?.journalEntryData[1]?.debit > 1000000000
                  ? 1000000000
                  : values?.journalEntryData[1]?.debit
                : 0
            }
            onChange={e => {
              const regex = new RegExp(`^\\d{0,10}(?:\\.\\d{1,2})?$`);
              if (regex.test(e?.value ? e?.value : 0)) {
                handleTableSelectChange(
                  data,
                  e.originalEvent.target.name,
                  !e.value ? 0 : e.value > 1000000000 ? 1000000000 : e.value,
                );
              }
            }}
            required
            minFractionDigits={0}
            maxFractionDigits={2}
            min={0}
            useGrouping={false}
            // max={1000000000}
            maxLength={10}
          />
        ) : (
          <p>0</p>
        )}
      </>
    );
  };

  return (
    <div className="main_Wrapper">
      {(clientCompanyLoading ||
        paymentNoLoading ||
        addJournalEntryLoading ||
        accountLoading ||
        getJournalEntryLoading ||
        editJournalEntryLoading) && <Loader />}
      <div className="bg-white radius15 border h-100">
        <div className="billing_heading">
          <Row className="align-items-center g-2">
            <Col sm={6}>
              <div class="page_title">
                <h3 class="m-0">
                  {id ? 'Edit Journal Entry' : 'Add Journal Entry'}
                </h3>
              </div>
            </Col>
          </Row>
        </div>
        <div className="p20 p10-sm border-bottom">
          <Row>
            <Col lg={9}>
              <Row>
                <Col xxl={2} xl={3} lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>
                      Payment No<span className="text-danger fs-6">*</span>
                    </label>
                    <InputText
                      placeholder="Payment Number"
                      className="input_wrap"
                      value={values?.payment_no ? values.payment_no : ''}
                      disabled
                    />
                  </div>
                </Col>
                <Col xxl={2} xl={3} lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>
                      Create Date<span className="text-danger fs-6">*</span>
                    </label>
                    <div className="date_select text-end">
                      <Calendar
                        showIcon
                        required
                        showButtonBar
                        id="Create Date"
                        name="create_date"
                        placeholder="Select Date"
                        value={values?.create_date ? values?.create_date : ''}
                        dateFormat="dd-mm-yy"
                        onBlur={handleBlur}
                        onChange={e => {
                          commonUpdateFieldValue('create_date', e.target.value);
                        }}
                      />
                    </div>
                    {touched?.create_date && errors?.create_date && (
                      <p className="text-danger">{errors?.create_date}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4} md={6}>
                  <div className="form_group mb-3">
                    <label>
                      Payment Type<span className="text-danger fs-6">*</span>
                    </label>
                    <ReactSelectSingle
                      filter
                      options={payment}
                      name="payment_type"
                      value={values?.payment_type ? values?.payment_type : ''}
                      onChange={e => {
                        let changeFielsValue = {
                          payment_type: e.value,
                        };
                        if (e.value === 1) {
                          changeFielsValue = {
                            ...changeFielsValue,
                            payment_group: '',
                          };
                        }
                        handleChangeFieldsdData(changeFielsValue);
                      }}
                      placeholder="Select Payment Type"
                      onBlur={handleBlur}
                    />
                    {touched?.payment_type &&
                      errors?.payment_type &&
                      !values?.payment_type && (
                        <p className="text-danger">{errors?.payment_type}</p>
                      )}
                  </div>
                  {values &&
                    (values?.payment_type === 2 ||
                      values?.payment_type === 3) && (
                      <>
                        <div className="form_group mb-3 mb-md-0">
                          <label>
                            Payment Group
                            <span className="text-danger fs-6">*</span>
                          </label>
                          <ReactSelectSingle
                            filter
                            options={values?.payment_group_list}
                            onChange={e =>
                              commonUpdateFieldValue('payment_group', e.value)
                            }
                            onBlur={handleBlur}
                            value={values?.payment_group}
                            placeholder="Select Payment Type"
                            name="payment_group"
                          />
                        </div>
                        {touched?.payment_group && errors?.payment_group && (
                          <p className="text-danger">{errors?.payment_group}</p>
                        )}
                      </>
                    )}
                </Col>

                <Col lg={8} md={6}>
                  <div className="form_group">
                    <label htmlFor="Remark">Description</label>
                    <InputTextarea
                      placeholder="Write here"
                      id="Remark"
                      className="input_wrap"
                      name="remark"
                      rows={6}
                      value={values?.remark}
                      onChange={e => {
                        commonUpdateFieldValue('remark', e.target.value);
                      }}
                      onBlur={handleBlur}
                    />
                    {touched?.remark && errors?.remark && (
                      <p className="text-danger">{errors?.remark}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="billing_heading">
          <Row className="justify-content-between align-items-center">
            <Col lg={6}>
              <div className="Receipt_Payment_head_wrapper">
                <div className="Receipt_Payment_head_txt">
                  <h3 className="m-0">Payment Transaction Record</h3>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper max_height">
          <DataTable
            value={values?.journalEntryData || []}
            // sortField="price"
            sortOrder={1}
            rows={10}
            footerColumnGroup={footerGroup}
          >
            <Column field="transaction_type" header="CR/DB"></Column>
            <Column
              field="account_id"
              header="Account Name"
              body={AccountTemplate}
            ></Column>
            <Column field="debit" header="Debit" body={DebitTemplate}></Column>
            <Column
              field="credit"
              header="Credit"
              body={CreditTemplate}
            ></Column>
          </DataTable>
        </div>
        <div className="title_right_wrapper button_padding_manage">
          <ul className="justify-content-end">
            <li>
              <Link to="/journal-entry" className="btn_border_dark filter_btn">
                Exit Page
              </Link>
            </li>
            <li>
              <Button
                className="btn_primary"
                onClick={handleSubmit}
                type="submit"
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(JournalEntryDetails);
