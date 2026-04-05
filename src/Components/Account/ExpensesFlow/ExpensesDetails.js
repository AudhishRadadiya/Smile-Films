import React, { memo, useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';
import { ColumnGroup } from 'primereact/columngroup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import TrashIcon from '../../../Assets/Images/trash.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import {
  checkWordLimit,
  convertIntoNumber,
  generateUniqueId,
  getFormattedDate,
  totalCount,
} from 'Helper/CommonHelper';
import {
  validationAddExpensesItem,
  validationExpenses,
} from 'Schema/Accounting/Expenses/expenses';
import {
  addExpenses,
  editExpenses,
  setAddExpensesData,
  setClearAddExpensesData,
  setClearUpdateExpensesData,
  setIsGetInitialValuesExpenses,
  setUpdateExpensesData,
} from 'Store/Reducers/Account/Expenses/ExpensesSlice';
import { toast } from 'react-toastify';

const paymentTypeOptions = [
  { label: 'Cash', value: 1 },
  { label: 'Bank', value: 2 },
  { label: 'Cheque', value: 3 },
];

const addItemIntialValues = {
  item_name: '',
  quantity: '',
  rate: '',
};

const ExpensesDetails = ({ initialValues, isEdit }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const checkViewPermission =
    id && (state?.iseView || locationPath[1] === 'view-expenses');

  const [showExpensePopup, setShowExpensePopup] = useState(false);
  const [addExpenseDetails, setAddExpenseItemDetails] =
    useState(addItemIntialValues);

  const {
    expensesDetailLoading,
    expensesNoLoading,
    expensesLoading,
    addExpensesLoading,
    addExpensesData,
    updateExpensesData,
    isGetInitialValuesExpenses,
  } = useSelector(({ expenses }) => expenses);
  const { accountLoading } = useSelector(({ account }) => account);

  const submitHandle = useCallback(
    async value => {
      if (!value?.expenses_items?.length) {
        toast.error('Please add at least one item');
        return;
      }

      const updatedExpensesItems = value?.expenses_items?.map(item => {
        return {
          ...(item?._id && { expense_item_id: item?._id }),
          item_name: item?.item_name,
          quantity: convertIntoNumber(item?.quantity),
          rate: convertIntoNumber(item?.rate),
          amount_paid: convertIntoNumber(item?.amount_paid),
        };
      });

      const payload = {
        ...(id && { expense_id: id }),
        expense_no: value?.expense_no,
        payment_type: value?.payment_type,
        expense_date: getFormattedDate(value?.expense_date),
        amount: convertIntoNumber(value?.sub_total),
        expense_category: value?.expense_category,
        payment_out_from: value?.payment_out_from,
        remark: value?.remark,
        expense_item: updatedExpensesItems,
      };

      if (id) {
        const res = await dispatch(editExpenses(payload));

        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesExpenses({
              ...isGetInitialValuesExpenses,
              update: false,
            }),
          );
          dispatch(setClearUpdateExpensesData());
          navigate('/expenses');
        }
      } else {
        const res = await dispatch(addExpenses(payload));
        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesExpenses({
              ...isGetInitialValuesExpenses,
              add: false,
            }),
          );
          dispatch(setClearAddExpensesData());
          navigate('/expenses');
        }
      }
    },
    [dispatch, id, isGetInitialValuesExpenses, navigate],
  );

  const { values, errors, touched, setFieldValue, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: validationExpenses,
      onSubmit: submitHandle,
    });

  const addItemSubmitHandle = useCallback(
    value => {
      let commonFieldObj = {};

      if (value?.unique_id) {
        let updatedExpensesData = [...values?.expenses_items];

        const index = updatedExpensesData?.findIndex(
          x => x?.unique_id === value?.unique_id,
        );

        if (index !== -1) {
          const oldObj = updatedExpensesData[index];
          const paidAmount =
            convertIntoNumber(value?.quantity) * convertIntoNumber(value?.rate);

          const updatedObj = {
            ...oldObj,
            ...value,
            amount_paid: paidAmount,
          };
          updatedExpensesData[index] = updatedObj;

          const calculateSubTotalAmount = totalCount(
            updatedExpensesData,
            'amount_paid',
          );

          commonFieldObj = {
            expenses_items: updatedExpensesData,
            sub_total: calculateSubTotalAmount,
          };
        }
      } else {
        const expenseItem = {
          ...value,
          amount_paid:
            convertIntoNumber(value?.quantity) * convertIntoNumber(value?.rate),
          unique_id: generateUniqueId(),
        };

        const updatedExpensesData = values?.expenses_items?.length
          ? [...values?.expenses_items, expenseItem]
          : [expenseItem];

        const calculateSubTotalAmount = totalCount(
          updatedExpensesData,
          'amount_paid',
        );

        commonFieldObj = {
          expenses_items: updatedExpensesData,
          sub_total: calculateSubTotalAmount,
        };
      }

      handleChangeFieldsdData(commonFieldObj);
      setShowExpensePopup(false);
      setAddExpenseItemDetails(addItemIntialValues);
    },
    [values?.expenses_items],
  );

  const subFormik = useFormik({
    enableReinitialize: true,
    initialValues: addExpenseDetails,
    validationSchema: validationAddExpensesItem,
    onSubmit: addItemSubmitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={3} />
        <Column
          footer={`₹ ${values?.sub_total ? values?.sub_total : 0}`}
          colSpan={2}
        />
      </Row>
    </ColumnGroup>
  );

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-end align-items-center">
      <div className="footer_button">
        <Button
          className="btn_border_dark"
          onClick={() => {
            setShowExpensePopup(false);
            setAddExpenseItemDetails(addItemIntialValues);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={subFormik?.handleSubmit}
          className="btn_primary"
        >
          {subFormik?.values?.unique_id ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );

  const ActionTemplet = rowData => {
    return (
      <div className="d-flex gap-2">
        <div className="dropdown_action_wrap">
          <Button
            onClick={() => {
              setShowExpensePopup(true);
              setAddExpenseItemDetails(rowData);
            }}
            className="btn_transparent"
            disabled={checkViewPermission}
          >
            <img src={EditIcon} alt="EditIcon" />
          </Button>
        </div>
        <div className="dropdown_action_wrap">
          <Button
            onClick={() => {
              handleDelete(rowData);
            }}
            className="btn_transparent"
            disabled={checkViewPermission}
          >
            <img src={TrashIcon} alt="TrashIcon" />
          </Button>
        </div>
      </div>
    );
  };

  const handleDelete = useCallback(
    data => {
      const updatedExpensesData = values?.expenses_items?.filter(
        item => item?.unique_id !== data?.unique_id,
      );

      const calculateSubTotalAmount = totalCount(
        updatedExpensesData,
        'amount_paid',
      );

      const commonFieldObj = {
        expenses_items: updatedExpensesData,
        sub_total: calculateSubTotalAmount,
      };

      handleChangeFieldsdData(commonFieldObj);
    },
    [values?.expenses_items],
  );

  const handleChangeFieldsdData = (fieldObject = {}) => {
    if (id) {
      if (locationPath[1] === 'edit-expenses') {
        dispatch(
          setUpdateExpensesData({
            ...updateExpensesData,
            ...fieldObject,
          }),
        );
      }
    } else {
      dispatch(
        setAddExpensesData({
          ...addExpensesData,
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
      if (locationPath[1] === 'edit-expenses') {
        dispatch(
          setUpdateExpensesData({
            ...updateExpensesData,
            [fieldName]: fieldValue,
          }),
        );
      }
    } else {
      dispatch(
        setAddExpensesData({
          ...addExpensesData,
          [fieldName]: fieldValue,
        }),
      );
    }

    setFieldValue(fieldName, fieldValue);
  };

  return (
    <>
      {(expensesDetailLoading ||
        expensesNoLoading ||
        expensesLoading ||
        addExpensesLoading ||
        accountLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="bg-white radius15 border h-100">
          <div className="billing_heading">
            <Row className="align-items-center g-2">
              <Col sm={6}>
                <div class="page_title">
                  <h3 class="m-0">
                    {id ? (checkViewPermission ? 'View' : 'Update') : 'Add'}{' '}
                    Expense
                  </h3>
                </div>
              </Col>
            </Row>
          </div>
          <div className="p20 p10-sm border-bottom">
            <Row>
              <Col xxl={3} xl={5} lg={6}>
                <Row>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Expense No <span className="text-danger fs-6">*</span>
                      </label>
                      <InputText
                        placeholder="Expense Number"
                        className="input_wrap"
                        value={values?.expense_no}
                        onChange={e => {
                          commonUpdateFieldValue('expense_no', e.target.value);
                        }}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Create Date <span className="text-danger fs-6">*</span>
                      </label>
                      <div className="date_select">
                        <Calendar
                          name="expense_date"
                          placeholder="Select Create Date"
                          value={values?.expense_date}
                          onChange={e => {
                            commonUpdateFieldValue(
                              'expense_date',
                              e.target.value,
                            );
                          }}
                          onBlur={handleBlur}
                          maxDate={new Date()}
                          dateFormat="dd-mm-yy"
                          className="w-100"
                          showIcon
                          required
                          showButtonBar
                          disabled={checkViewPermission}
                        />
                        {touched?.expense_date && errors?.expense_date && (
                          <p className="text-danger">{errors?.expense_date}</p>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Expense Category <span className="text-danger fs-6">*</span>{' '}
                  </label>
                  <ReactSelectSingle
                    filter
                    name="expense_category"
                    options={values?.expense_category_options || []}
                    value={values?.expense_category}
                    placeholder="Select Category"
                    onChange={e => {
                      commonUpdateFieldValue(
                        'expense_category',
                        e.target.value,
                      );
                    }}
                    onBlur={handleBlur}
                    disabled={checkViewPermission}
                  />
                  {touched?.expense_category && errors?.expense_category && (
                    <p className="text-danger">{errors?.expense_category}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={6}>
                <div className="form_group mb-3">
                  <label>
                    Payment Type <span className="text-danger fs-6">*</span>
                  </label>
                  <ReactSelectSingle
                    filter
                    name="payment_type"
                    placeholder="Select Payment Type"
                    options={paymentTypeOptions}
                    value={values?.payment_type}
                    onChange={e => {
                      commonUpdateFieldValue('payment_type', e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={checkViewPermission}
                  />
                  {touched?.payment_type && errors?.payment_type && (
                    <p className="text-danger">{errors?.payment_type}</p>
                  )}
                </div>
              </Col>
              <Col lg={3} md={6}>
                {values && values?.payment_type !== 1 && (
                  <>
                    <div className="form_group mb-3">
                      <label>
                        Payment Out From
                        <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="payment_out_from"
                        placeholder="Select Payment Out From"
                        options={values?.bank_account_options || []}
                        value={values?.payment_out_from}
                        onChange={e => {
                          commonUpdateFieldValue(
                            'payment_out_from',
                            e.target.value,
                          );
                        }}
                        onBlur={handleBlur}
                        disabled={checkViewPermission}
                      />
                      {touched?.payment_out_from &&
                        errors?.payment_out_from && (
                          <p className="text-danger">
                            {errors?.payment_out_from}
                          </p>
                        )}
                    </div>
                  </>
                )}
              </Col>
              {/* <Col lg={3} md={6}>
              <div className="form_group mb-3">
                <label>Amount</label>
                <InputText
                  id="Amount"
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  className="input_wrap"
                  // rows={6}
                  value={calculateTotalAmount()}
                  // value={values?.amount ? values?.amount : ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
              </div>
              {touched?.amount && errors?.amount && (
                <p className="text-danger">{errors?.amount}</p>
              )}
            </Col> */}
              <Col lg={6}>
                <div className="form_group mb-3">
                  <label>Remark</label>
                  <InputText
                    id="Remark"
                    name="remark"
                    placeholder="Remark"
                    value={values?.remark}
                    onBlur={handleBlur}
                    onChange={e => {
                      commonUpdateFieldValue('remark', e.target.value);
                    }}
                    className="input_wrap"
                    rows={6}
                    disabled={checkViewPermission}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="billing_heading">
            <Row className="justify-content-between align-items-center">
              <Col lg={6} md={4} className="col-6">
                <div className="Receipt_Payment_head_wrapper">
                  <div className="Receipt_Payment_head_txt">
                    <h3 className="m-0">Expense Items</h3>
                  </div>
                </div>
              </Col>
              {!checkViewPermission && (
                <Col xxl={4} xl={5} lg={6} md={7} className="col-6">
                  <div className="d-flex align-items-center flex-wrap gap-2 gap-sm-3 justify-content-end mt-3 mt-md-0">
                    <Button
                      className="btn_primary filter_btn"
                      onClick={() => {
                        setShowExpensePopup(true);
                        setAddExpenseItemDetails(addItemIntialValues);
                        subFormik?.resetForm();
                      }}
                    >
                      <img src={PlusIcon} alt="" /> Add Item
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </div>
          <div className="data_table_wrapper max_height">
            <DataTable
              value={values?.expenses_items || []}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={footerGroup}
            >
              <Column
                field="item_name"
                header="Item/Service Name"
                sortable
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column
                field="amount_paid"
                header="Amount Paid"
                sortable
              ></Column>
              <Column
                field="action"
                header="Action"
                sortable
                body={ActionTemplet}
              ></Column>
            </DataTable>
          </div>
          <div className="title_right_wrapper button_padding_manage">
            <ul className="justify-content-end">
              <li>
                <Button
                  onClick={() => {
                    navigate('/expenses');
                  }}
                  className="btn_border_dark filter_btn"
                >
                  Exit Page
                </Button>
              </li>
              {!checkViewPermission && (
                <li>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn_primary"
                  >
                    {id ? 'Update' : 'Save'}
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <Dialog
          header={`${
            subFormik?.values?.unique_id ? 'Update' : 'Add'
          } Expense Item`}
          visible={showExpensePopup}
          onHide={() => {
            setShowExpensePopup(false);
            setAddExpenseItemDetails(addItemIntialValues);
          }}
          draggable={false}
          footer={footerContent}
          className="modal_Wrapper modal_medium"
        >
          <div className="create_client_company_wrap">
            <Row>
              <Col md={6}>
                <div className="form_group mb-3">
                  <label>
                    Expense Item <span className="text-danger fs-6">*</span>
                  </label>
                  <InputText
                    name="item_name"
                    placeholder=" Enter Expense Item"
                    value={subFormik?.values?.item_name}
                    onChange={subFormik?.handleChange}
                    onBlur={subFormik?.handleBlur}
                    className="input_wrap"
                  />
                  {subFormik?.touched?.item_name &&
                    subFormik?.errors?.item_name && (
                      <p className="text-danger">
                        {subFormik?.errors?.item_name}
                      </p>
                    )}
                </div>
              </Col>
              <Col md={6}>
                <div className="form_group mb-3">
                  <label htmlFor="quantity">
                    Quantity <span className="text-danger fs-6">*</span>
                  </label>
                  <InputNumber
                    name="quantity"
                    placeholder="Enter Quantity"
                    value={subFormik?.values?.quantity}
                    onBlur={subFormik?.handleBlur}
                    onChange={e => {
                      if (!e.value || checkWordLimit(e.value, 10)) {
                        subFormik?.setFieldValue('quantity', e.value);
                      }
                    }}
                    useGrouping={false}
                    maxLength="10"
                  />
                  {subFormik?.touched?.quantity &&
                    subFormik?.errors?.quantity && (
                      <p className="text-danger">
                        {subFormik?.errors?.quantity}
                      </p>
                    )}
                </div>
              </Col>
              <Col md={6}>
                <div className="form_group mb-3">
                  <label htmlFor="rate">
                    Rate <span className="text-danger fs-6">*</span>
                  </label>
                  <InputNumber
                    name="rate"
                    placeholder="Enter Rate"
                    value={subFormik?.values?.rate}
                    onBlur={subFormik?.handleBlur}
                    onChange={e => {
                      if (!e.value || checkWordLimit(e.value, 10)) {
                        subFormik?.setFieldValue('rate', e.value);
                      }
                    }}
                    useGrouping={false}
                    maxFractionDigits={2}
                    maxLength="10"
                  />
                  {subFormik?.touched?.rate && subFormik?.errors?.rate && (
                    <p className="text-danger">{subFormik?.errors?.rate}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default memo(ExpensesDetails);
