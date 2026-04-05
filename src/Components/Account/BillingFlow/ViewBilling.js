import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
// import EmailIcon from '../../../Assets/Images/email-icon.svg';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import ProfileImg from '../../../Assets/Images/profile-img.svg';
// import CloseImg from '../../../Assets/Images/close.svg';
// import EditImg from '../../../Assets/Images/edit.svg';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getBillingData,
  listEmployeeCommission,
  updateBilling,
} from 'Store/Reducers/Accounting/Billing/BillingSlice';
import { useDispatch, useSelector } from 'react-redux';
// import { useFormik } from 'formik';
import moment from 'moment';
// import ReactQuill from 'react-quill';
// import { quillFormats, quillModules } from 'Helper/reactQuillHelper';
import { getExposingItems } from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
// import { employeeData } from './../../Setting/Employee/Transaction';
import { InputNumber } from 'primereact/inputnumber';
import { generateUniqueId } from 'Helper/CommonHelper';
import Loader from 'Components/Common/Loader';
import { getClientBilling } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

export default function ViewBilling() {
  const [visible, setVisible] = useState(false);
  const [updatedExposingItemsData, setUpdatedExposingItemsData] = useState([]);
  const [preview, setPreview] = useState(true);
  // const [editTotal, setEditTotal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    billingData,
    listEmployeeCommissionData,
    billingListLoading,
    billingDataLoading,
    updateBillingLoading,
    listEmployeeCommissionLoading,
  } = useSelector(({ billing }) => billing);
  const { exposingItemsData, exposingItemsLoading } = useSelector(
    ({ exposing }) => exposing,
  );
  const { clientBillingLoading } = useSelector(
    ({ clientProject }) => clientProject,
  );

  const requireLoadData = useCallback(async () => {
    const billingResponse = await dispatch(getBillingData({ invoice_id: id }));

    if (billingResponse?.payload) {
      const res = billingResponse?.payload;
      const listEmployeeCommissionResponse = await dispatch(
        listEmployeeCommission({
          order_id: res?.order_id ? res?.order_id : null,
          quotation_id: res?.quotation_id ? res?.quotation_id : null,
          invoice_id: id ? id : null,
        }),
      );

      if (listEmployeeCommissionResponse?.payload) {
        const res2 = listEmployeeCommissionResponse?.payload;

        dispatch(getExposingItems({ order_id: res?.order_id }))
          .then(res3 => {
            const response = res3?.payload;
            setUpdatedExposingItemsData(
              response && response?.length > 0
                ? response.map((item, index) => {
                    const updatedEmployeeData = item.employeeData.map(emp => {
                      const commissionData = res2.find(
                        commission =>
                          commission?.order_item_id === item?.item_status_id &&
                          commission?.employee_id === emp?.employee_id,
                      );

                      return {
                        ...emp,
                        emp_unique_index:
                          commissionData?._id || generateUniqueId(),
                        commission_percentage_item:
                          commissionData?.percentage || 0,
                        commission_amount_item: commissionData?.amount || 0,
                        order_item_id:
                          commissionData?.order_item_id || item?.item_status_id,
                      };
                    });

                    return {
                      ...item,
                      item_unique_index: index,
                      employeeData: updatedEmployeeData,
                    };
                  })
                : [],
            );
          })
          .catch(error => {
            console.error('Error fetching exposing items:', error);
          });
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    requireLoadData();
    // dispatch(getBillingData({ invoice_id: id }))
    //   .then(res => {
    //     const response = res?.payload;
    //     return dispatch(
    //       listEmployeeCommission({
    //         order_id: response?.order_id ? response?.order_id : null,
    //         quotation_id: response?.quotation_id
    //           ? response?.quotation_id
    //           : null,
    //         invoice_id: id ? id : null,
    //       }),
    //     );
    //   })
    //   .catch(error => {
    //     console.error('Error fetching billing data:', error);
    //   });
  }, []);

  const submitHandle = () => {
    const send_billing_data = {
      order_id: billingData?.order_id ? billingData?.order_id : null,
      quotation_id: billingData?.quotation_id
        ? billingData?.quotation_id
        : null,
      invoice_id: id ? id : null,
      amount: billingData?.sub_total ? billingData?.sub_total : 0,
      commission_percentage: commission_percentage ? commission_percentage : 0,
      commission_amount: commission_amount ? commission_amount : 0,
      profit_amount: profit_amount ? profit_amount : 0,
    };

    const commission_data =
      updatedExposingItemsData?.length > 0
        ? updatedExposingItemsData
            ?.map(product =>
              product?.employeeData?.map(emp => ({
                ...(emp?.commission_id && {
                  commission_id: emp?.commission_id ? emp?.commission_id : null,
                }),
                order_item_id: emp?.order_item_id ? emp?.order_item_id : null,
                employee_id: emp?.employee_id ? emp?.employee_id : null,
                percentage: emp?.commission_percentage_item
                  ? emp?.commission_percentage_item
                  : 0,
                amount: emp?.commission_amount_item
                  ? emp?.commission_amount_item
                  : 0,
              })),
            )
            .flat()
        : [];

    const sendData = {
      ...send_billing_data,
      commission_data: commission_data,
    };

    dispatch(updateBilling(sendData));
    navigate('/billing');
  };

  // const {
  //   values,
  //   errors,
  //   touched,
  //   setFieldValue,
  //   handleBlur,
  //   handleChange,
  //   handleSubmit,
  //   resetForm,
  // } = useFormik({
  //   enableReinitialize: true,
  //   initialValues:
  //     updatedExposingItemsData && updatedExposingItemsData?.length > 0
  //       ? updatedExposingItemsData
  //       : [],
  //   // validationSchema: validationSchemaJournalEntry,
  //   onSubmit: submitHandle,
  // });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={5} />
        <Column footer={billingData?.sub_total ? billingData?.sub_total : 0} />
      </Row>
    </ColumnGroup>
  );

  const totalCommissionAmt = updatedExposingItemsData.reduce((total, item) => {
    const itemCommission = item.employeeData.reduce((itemTotal, employee) => {
      return (
        parseFloat(itemTotal ? itemTotal : 0) +
        parseFloat(
          employee?.commission_amount_item
            ? employee?.commission_amount_item
            : 0,
        )
      );
    }, 0);

    return (
      parseFloat(total ? total : 0) +
      parseFloat(itemCommission ? itemCommission : 0)
    );
  }, 0);

  const DistributesfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer={totalCommissionAmt ? totalCommissionAmt : 0} />
      </Row>
    </ColumnGroup>
  );

  const AssignedTemplate = data => {
    return (
      <div className="d-flex flex-column">
        {data?.employeeData?.map(emp => (
          <div
            className={`mb-2 ${
              emp?.is_freelancer === true ? 'bg_orange ' : ''
            }assign-profile-wrapper`}
            key={emp?.employee_id}
          >
            <div className="assign_profile">
              <img
                src={emp?.image ? emp?.image : ProfileImg}
                alt="profileimg"
              />
            </div>
            <div className="profile_user_name">
              <h5 className="m-0">
                {emp?.employee_name ? emp?.employee_name : ''}
              </h5>
            </div>

            {/* 
            <div className="assign-user-cancel item_name_wrapper">
              <Button className="btn_transparent">
                <img src={CloseImg} alt="closeimg" />
              </Button>
            </div>
             */}
          </div>
        ))}
      </div>
    );
  };

  const handlePercentageChange = (check_emp_id, value, row) => {
    let updatedList = [...updatedExposingItemsData];

    const index = updatedList?.findIndex(
      x => x?.item_unique_index === row?.item_unique_index,
    );

    if (index !== -1) {
      const updatedItem = { ...updatedList[index] };
      const commissionAmount =
        (parseFloat(row?.amount) * parseFloat(value)) / 100;

      const empIndex = updatedItem?.employeeData?.findIndex(
        employee => employee?.emp_unique_index === check_emp_id,
      );

      if (empIndex !== -1) {
        const updatedEmployeeData = [...updatedItem?.employeeData];
        updatedEmployeeData[empIndex] = {
          ...updatedEmployeeData[empIndex],
          commission_percentage_item: value,
          commission_amount_item: commissionAmount,
        };

        updatedItem.employeeData = updatedEmployeeData;

        updatedList[index] = updatedItem;

        setUpdatedExposingItemsData(updatedList);
      }
    }
  };

  const commissionAmount = data => {
    return data?.employeeData?.map(item => {
      return (
        <div className="d-flex flex-column" key={item?.employee_id}>
          <InputNumber
            name="commission_amount_item"
            value={
              item?.commission_amount_item ? item?.commission_amount_item : 0
            }
            className="mb-2"
            disabled
          />
        </div>
      );
    });
  };

  const percentageTemplate = data => {
    return data?.employeeData?.map(item => {
      return (
        <div className="d-flex flex-column" key={item?.employee_id}>
          <InputNumber
            name="commission_percentage_item"
            value={
              item?.commission_percentage_item
                ? item?.commission_percentage_item
                : 0
            }
            // placeholder="0"
            onChange={e => {
              handlePercentageChange(item?.emp_unique_index, e.value, data);
            }}
            className="mb-2"
            // min={0}
            // max={100}
            // maxLength={2}
            // minFractionDigits={1}
            // maxFractionDigits={2}
          />
        </div>
      );
    });
  };

  const customNoColumn = (data, index) => {
    return <span>{index?.rowIndex + 1 ? index?.rowIndex + 1 : '-'}</span>;
  };

  const descriptionBodyTemplate = data => {
    return (
      <div
        className="editor_text_wrapper"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const handleGiveCommissionButton = () => {
    setVisible(true);
    requireLoadData();
  };

  const commission_percentage = (
    (parseFloat(totalCommissionAmt ? totalCommissionAmt : 0) * 100) /
    parseFloat(billingData?.sub_total ? billingData?.sub_total : 0)
  )?.toFixed(2);

  const commission_amount =
    totalCommissionAmt && totalCommissionAmt?.toFixed(2);

  const profit_amount = (
    parseFloat(billingData?.sub_total ? billingData?.sub_total : 0) -
    parseFloat(commission_amount ? commission_amount : 0)
  )?.toFixed(2);

  return (
    <div className="main_Wrapper">
      {(billingListLoading ||
        billingDataLoading ||
        updateBillingLoading ||
        listEmployeeCommissionLoading ||
        exposingItemsLoading ||
        clientBillingLoading) && <Loader />}
      <div className="bg-white radius15 border">
        <div className="billing_heading">
          <Row className="align-items-center">
            <Col lg={6}>
              <div class="page_title">
                <h3 class="m-0">View Billing</h3>
              </div>
            </Col>
            <Col lg={6}>
              <ul className="billing-btn justify-content-end mt-2 mt-lg-0">
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => {
                      dispatch(
                        getClientBilling({
                          invoice_id: id,
                          pdf: true,
                        }),
                      );
                    }}
                  >
                    <img src={PdfIcon} alt="" /> Save As PDF
                  </Button>
                </li>
                <li>
                  {!preview && (
                    <Button
                      className="btn_primary filter_btn"
                      onClick={() => setPreview(true)}
                    >
                      <img src={ShowIcon} alt="" /> Preview
                    </Button>
                  )}
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="billing_details">
          <Row className="g-3 g-sm-4">
            <Col lg={4}>
              <div className="weeding_package_wrapper">
                <h2>
                  {billingData?.quotation_name
                    ? billingData?.quotation_name
                    : ''}
                </h2>
                <div class="payment_status_type">
                  {billingData?.status > 2 && (
                    <span class="p-tag p-component p-tag-success">Paid</span>
                  )}
                </div>
                <div className="date_number">
                  <ul>
                    <li>
                      <h6>Invoice No.</h6>
                      <h4>
                        {billingData?.invoice_no ? billingData?.invoice_no : 0}
                      </h4>
                    </li>
                    <li>
                      <h6>Invoice Date</h6>
                      <h4>
                        {billingData?.invoice_date
                          ? moment(billingData?.invoice_date)?.format(
                              'DD-MM-YYYY',
                            )
                          : ''}
                      </h4>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col xxl={8}>
              <Row className="g-3 g-sm-4">
                <Col lg={6}>
                  <div className="order-details-wrapper p10 border radius15">
                    <div className="pb10 border-bottom">
                      <h6 className="m-0">Job</h6>
                    </div>
                    <div className="details_box pt10">
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Items :</span>
                          <h5>
                            {billingData?.item_name?.length === 1
                              ? billingData?.item_name[0]
                              : billingData?.item_name?.join(', ')}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Couple Name :</span>
                          <h5>
                            {billingData?.couple_name
                              ? billingData?.couple_name
                              : ''}
                          </h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Data Size :</span>
                          <h5>
                            {billingData?.data_size
                              ? billingData?.data_size?.toFixed(2)
                              : 0}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Project Type :</span>
                          <h5>
                            {billingData?.project_type_value
                              ? billingData?.project_type_value
                              : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Due Date :</span>
                          <h5>
                            {billingData?.due_date
                              ? moment(billingData?.due_date)?.format(
                                  'DD-MM-YYYY',
                                )
                              : ''}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="order-details-wrapper p10 border radius15">
                    <div className="pb10 border-bottom">
                      <h6 className="m-0">Company</h6>
                    </div>
                    <div className="details_box pt10">
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Company Name :</span>
                          <h5>
                            {billingData?.company_name
                              ? billingData?.company_name
                              : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Client Name :</span>
                          <h5>
                            {billingData?.client_name
                              ? billingData?.client_name
                              : ''}
                          </h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Phone No :</span>
                          <h5>
                            {billingData?.company_number
                              ? billingData?.company_number
                              : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Email :</span>
                          <h5>
                            {billingData?.company_email
                              ? billingData?.company_email
                              : ''}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="commision_btn text-end mt20 mb20">
            {!preview && (
              <Button
                className="btn_primary"
                onClick={() => {
                  handleGiveCommissionButton();
                }}
              >
                <img src={PlusIcon} alt="" />
                {totalCommissionAmt > 0
                  ? 'Update Commission'
                  : 'Give Commission'}
              </Button>
            )}
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={
                billingData?.quotation_detail &&
                billingData?.quotation_detail.length > 0
                  ? billingData?.quotation_detail
                  : []
              }
              sortField="price"
              sortOrder={1}
              footerColumnGroup={footerGroup}
              rows={10}
            >
              <Column
                field="srNo"
                header="Sr No."
                sortable
                body={customNoColumn}
              ></Column>
              <Column field="item_name" header="Item" sortable></Column>
              <Column
                field="description"
                header="Description"
                sortable
                body={descriptionBodyTemplate}
              ></Column>
              <Column field="quantity" header="Qty" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="amount_condition mt20">
            <Row className="justify-content-between g-3 g-md-4">
              <Col xxl={4} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="p20 border-bottom">
                    <h5 className="m-0">Terms & Condition</h5>
                  </div>
                  <div
                    className="condition-content p20"
                    dangerouslySetInnerHTML={{
                      __html: billingData?.terms_condition
                        ? billingData?.terms_condition
                        : '',
                    }}
                  ></div>
                </div>
              </Col>
              <Col xxl={4} lg={6}>
                {totalCommissionAmt > 0 && !preview && (
                  <div className="amount-condition-wrapper border radius15">
                    <div className="condition-content p20">
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5 className="fw_600">Commission Distributes</h5>
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Amount</h5>
                        </div>
                        <div className="subtotal-input">
                          <h5>
                            {billingData?.sub_total
                              ? billingData?.sub_total
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Commission Percentage</h5>
                        </div>
                        <div className="subtotal-input">
                          <input
                            value={
                              commission_percentage ? commission_percentage : 0
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Commission Amount</h5>
                        </div>
                        <div className="subtotal-input">
                          <input
                            value={commission_amount ? commission_amount : 0}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="sub-total-wrapper total-amount">
                        <div className="subtotal-title">
                          <h5 className="fw_700">Profit Amount</h5>
                        </div>
                        <div className="subtotal-input">
                          <h5 className="fw_700 text_green">
                            {profit_amount ? profit_amount : 0}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Col>
              <Col xxl={4} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>
                          {billingData?.sub_total ? billingData?.sub_total : 0}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>{billingData?.tax ? billingData?.tax : 0}</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>
                          {billingData?.discount ? billingData?.discount : 0}
                        </h5>
                      </div>
                    </div>
                    {/* <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setSubTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Additional Charges
                          </h5>
                        </Button>
                        <Button
                          className="btn_as_text"
                          onClick={() => setAdditionalEditTotal(true)}
                        >
                          <h5>
                            <img src={EditImg} alt="" />
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setExtraTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Extra Charges
                          </h5>
                        </Button>
                        <Button
                          className="btn_as_text ml20"
                          onClick={() => setEditTotal(true)}
                        >
                          <h5>
                            <img src={EditImg} alt="" />
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div> */}
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700">
                          {billingData?.total_amount
                            ? billingData?.total_amount
                            : 0}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="title_right_wrapper">
          <ul className="justify-content-end">
            <li>
              {!preview && (
                <Button
                  className="btn_primary filter_btn"
                  onClick={submitHandle}
                  type="submit"
                >
                  Save
                </Button>
              )}
            </li>
            <li>
              <Button
                className="btn_border_dark filter_btn"
                onClick={() => navigate('/billing')}
              >
                Exit Page
              </Button>
            </li>
          </ul>
        </div>
      </div>
      {/* Additional Changes edit popup
      <Dialog
        className="modal_small modal_Wrapper"
        visible={additionaleditTotal}
        onHide={() => setAdditionalEditTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button
            className="btn_border"
            onClick={() => setAdditionalEditTotal(false)}
          >
            Cancel
          </button>
          <button
            className="btn_primary"
            onClick={() => setAdditionalEditTotal(false)}
          >
            Save
          </button>
        </div>
      </Dialog> */}
      {/* Additional Changes popup */}
      {/* <Dialog
        className="modal_small modal_Wrapper"
        visible={subTotal}
        onHide={() => setSubTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setSubTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setSubTotal(false)}>
            Save
          </button>
        </div>
      </Dialog> */}
      {/* Extra Charges edit popup */}
      {/* <Dialog
        className="modal_small modal_Wrapper"
        visible={editTotal}
        onHide={() => setEditTotal(false)}
        draggable={false}
        header="Extra Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setEditTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setEditTotal(false)}>
            Save
          </button>
        </div>
      </Dialog> */}
      {/* Extra Charges popup */}
      {/* <Dialog
        className="modal_small modal_Wrapper"
        visible={extraTotal}
        onHide={() => setExtraTotal(false)}
        draggable={false}
        header="Extra Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setExtraTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setExtraTotal(false)}>
            Save
          </button>
        </div>
      </Dialog> */}
      {/* give commition popup */}
      <Dialog
        className="modal_Wrapper commission_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
        header="Commission Distributes"
      >
        <div className="data_table_wrapper max_height border">
          <DataTable
            value={
              updatedExposingItemsData && updatedExposingItemsData?.length > 0
                ? updatedExposingItemsData
                : []
            }
            sortField="price"
            sortOrder={1}
            footerColumnGroup={DistributesfooterGroup}
            rows={10}
          >
            <Column field="item_name" header="Item Name" sortable></Column>
            <Column
              field="assigned_employee"
              header="Assigned Employee"
              sortable
              body={AssignedTemplate}
            ></Column>
            <Column field="amount" header="Rate" sortable></Column>
            <Column
              field="commission_percentage_item"
              header="Percentage"
              body={percentageTemplate}
              sortable
            ></Column>
            <Column
              field="commission_amount_item"
              header="Amount"
              body={commissionAmount}
              sortable
            ></Column>
          </DataTable>
        </div>
        <div className="delete_btn_wrap pr20">
          <button className="btn_border" onClick={() => setVisible(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setVisible(false)}>
            {totalCommissionAmt > 0 ? 'Update' : 'Save'}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
