import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { useFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { InputNumber } from 'primereact/inputnumber';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getBillingData,
  listEmployeeCommission,
  setBillingDetail,
  updateBilling,
} from 'Store/Reducers/Accounting/Billing/BillingSlice';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../../Assets/Images/plus.svg';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import UserIcon from '../../../Assets/Images/add-user.svg';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import { convertIntoNumber, generateUniqueId } from 'Helper/CommonHelper';
import { getExposingItems } from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { getClientBilling } from 'Store/Reducers/ClientFlow/Project/ClientProjectSlice';

export default function EditBilling() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [checker, setChecker] = useState(0);
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState(false);
  const [updateButtonText, setUpdateButtonText] = useState(false);
  // const [totalCommissionAmt, setTotalCommissionAmt] = useState(false);
  const [updatedExposingItemsData, setUpdatedExposingItemsData] = useState([]);
  const [editorRate, setEditorRate] = useState(null);
  const [conversationRate, setConversationRate] = useState(1);

  const {
    billingData,
    billingDetail,
    billingListLoading,
    billingDataLoading,
    updateBillingLoading,
    listEmployeeCommissionData,
    listEmployeeCommissionLoading,
  } = useSelector(({ billing }) => billing);
  const { clientBillingLoading } = useSelector(
    ({ clientProject }) => clientProject,
  );
  const { exposingItemsData, exposingItemsLoading } = useSelector(
    ({ exposing }) => exposing,
  );

  const requireLoadData = useCallback(async () => {
    const billingResponse = await dispatch(getBillingData({ invoice_id: id }));

    if (billingResponse?.payload) {
      const res = billingResponse?.payload;
      // const currencyAmount = res?.sub_total
      //   ? convertIntoNumber(res?.sub_total * res?.conversation_rate)
      //   : 0;

      setEditorRate(res?.editor_rate ? res?.editor_rate : '');
      setConversationRate(res?.conversation_rate ? res?.conversation_rate : 1);

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

            const filteredResponse =
              response && response?.length > 0
                ? response?.map(item => {
                    const removeChecker = item?.employeeData?.filter(
                      empData => !empData?.is_checker,
                    );
                    return {
                      ...item,
                      employeeData: removeChecker,
                      package_id: item?.package_id,
                    };
                  })
                : [];

            const updatedExposingData =
              filteredResponse && filteredResponse?.length > 0
                ? filteredResponse.map((item, index) => {
                    const updatedEmployeeData = item.employeeData.map(emp => {
                      const commissionData = res2.find(
                        commission =>
                          commission?.order_item_id === item?.item_status_id &&
                          commission?.employee_id === emp?.employee_id,
                      );

                      setChecker(
                        prev => prev + (commissionData?.percentage || 0),
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
                : [];

            // setUpdatedExposingItemsData();

            const updatedBillingData = {
              ...res,
              exposing_items_data: updatedExposingData,
              total_commission_amount: res?.commission_amount,
            };

            dispatch(setBillingDetail(updatedBillingData));
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

  const submitHandle = useCallback(
    (values, { resetForm }) => {
      const send_billing_data = {
        order_id: values?.order_id ? values?.order_id : null,
        quotation_id: values?.quotation_id ? values?.quotation_id : null,
        invoice_id: id ? id : null,
        amount: values?.sub_total ? values?.sub_total : 0,
        editor_rate: editorRate ? (editorRate < 1 ? 1 : editorRate) : 1,
        // commission_percentage: commission_percentage
        //   ? commission_percentage
        //   : 0,
        // commission_amount: totalCommissionAmt
        //   ? convertIntoNumber(totalCommissionAmt)
        //   : 0,
        // profit_amount: profit_amount ? profit_amount : 0,
        commission_percentage: values?.commission_percentage
          ? values?.commission_percentage
          : 0,
        commission_amount: values?.total_commission_amount
          ? values?.total_commission_amount
          : 0,
        profit_amount: values?.profit_amount ? values?.profit_amount : 0,
      };

      const commission_data =
        values?.exposing_items_data?.length > 0
          ? values?.exposing_items_data
              ?.map(product =>
                product?.employeeData?.map(emp => ({
                  ...(emp?.commission_id && {
                    commission_id: emp?.commission_id
                      ? emp?.commission_id
                      : null,
                  }),
                  order_item_id: emp?.order_item_id ? emp?.order_item_id : null,
                  employee_id: emp?.employee_id ? emp?.employee_id : null,
                  percentage: emp?.commission_percentage_item
                    ? emp?.commission_percentage_item
                    : 0,
                  amount: emp?.commission_amount_item
                    ? emp?.commission_amount_item
                    : 0,
                  package_id: product?.package_id ? product?.package_id : null,
                })),
              )
              .flat()
          : [];

      const sendData = {
        ...send_billing_data,
        commission_data: commission_data,
      };

      dispatch(updateBilling(sendData))
        .then(() => {
          resetForm();
          navigate('/billing');
        })
        .catch(error => console.error('Error updating billing:', error));
    },
    [id, dispatch, navigate, editorRate],
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
    enableReinitialize: true,
    initialValues: billingDetail,
    // validationSchema: validationSchemaJournalEntry,
    onSubmit: submitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" colSpan={5} />
        <Column
          footer={`${'₹'} ${values?.sub_total ? values?.sub_total : 0}
        `}
        />
      </Row>
    </ColumnGroup>
  );

  // const totalCommissionAmt = useMemo(() => {
  //   const calculatedCommission = values?.exposing_items_data?.reduce(
  //     (total, item) => {
  //       const itemCommission = item.employeeData.reduce(
  //         (itemTotal, employee) => {
  //           return (
  //             parseFloat(itemTotal ? itemTotal : 0) +
  //             parseFloat(
  //               employee?.commission_amount_item
  //                 ? employee?.commission_amount_item
  //                 : 0,
  //             )
  //           );
  //         },
  //         0,
  //       );

  //       return (
  //         parseFloat(total ? total : 0) +
  //         parseFloat(itemCommission ? itemCommission : 0)
  //       );
  //     },
  //     0,
  //   );

  //   return calculatedCommission;
  // }, [values?.exposing_items_data]);

  const DistributesfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column
          footer={
            // totalCommissionAmt ? convertIntoNumber(totalCommissionAmt) : 0
            values?.total_commission_amount
              ? convertIntoNumber(values?.total_commission_amount)
              : 0
          }
        />
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
              <img src={emp?.image ? emp?.image : UserIcon} alt="profileimg" />
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

  const handlePercentageAndAmountCommonChange = (check_emp_id, row, obj) => {
    let updatedList = [...(values?.exposing_items_data || [])];

    const index = updatedList?.findIndex(
      x => x?.item_unique_index === row?.item_unique_index,
    );

    if (index !== -1) {
      const updatedItem = { ...updatedList[index] };
      // const commissionAmount =
      //   (convertIntoNumber(row?.amount) * convertIntoNumber(value)) / 100;

      const empIndex = updatedItem?.employeeData?.findIndex(
        employee => employee?.emp_unique_index === check_emp_id,
      );

      if (empIndex !== -1) {
        const updatedEmployeeData = [...updatedItem?.employeeData];
        updatedEmployeeData[empIndex] = {
          ...updatedEmployeeData[empIndex],
          // commission_percentage_item: value,
          // commission_amount_item: commissionAmount,
          ...obj,
        };

        updatedItem.employeeData = updatedEmployeeData;

        updatedList[index] = updatedItem;
        setFieldValue('exposing_items_data', updatedList);
        // setUpdatedExposingItemsData(updatedList);
      }
    }

    const calculatedTotalCommission = updatedList?.reduce((total, item) => {
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

    const commissionPercentage =
      (calculatedTotalCommission * 100) / values?.sub_total;

    const profitAmount = values?.sub_total - calculatedTotalCommission;

    setFieldValue(
      'total_commission_amount',
      convertIntoNumber(calculatedTotalCommission),
    );
    setFieldValue(
      'commission_percentage',
      convertIntoNumber(commissionPercentage),
    );
    setFieldValue('profit_amount', convertIntoNumber(profitAmount));
  };

  const handlePercentageChange = async (check_emp_id, row, value) => {
    // const calculationValue = (row?.rate * row?.commission_rate) / row?.conversation_rate;
    const calculationValue =
      (row?.amount * (editorRate || 1)) / row?.conversation_rate;
    const calculatedRate =
      (convertIntoNumber(calculationValue) * convertIntoNumber(value)) / 100;

    const udatedData = {
      commission_percentage_item: value,
      commission_amount_item: convertIntoNumber(calculatedRate),
    };

    handlePercentageAndAmountCommonChange(check_emp_id, row, udatedData);
  };

  const handleCommissionAmountChange = async (check_emp_id, row, value) => {
    // const calculatedRate = (row?.rate * row?.commission_rate) / row?.conversation_rate;
    const calculatedRate =
      (row?.amount * (editorRate || 1)) / row?.conversation_rate;

    const clculatedCommissionPercentage =
      (value / convertIntoNumber(calculatedRate)) * 100;

    const udatedData = {
      commission_amount_item: value,
      commission_percentage_item: convertIntoNumber(
        clculatedCommissionPercentage,
      ),
    };

    handlePercentageAndAmountCommonChange(check_emp_id, row, udatedData);
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
            onChange={e => {
              handleCommissionAmountChange(
                item?.emp_unique_index,
                data,
                e.value,
              );
            }}
            useGrouping={false}
            minFractionDigits={0}
            maxFractionDigits={2}
          />
        </div>
      );
    });
  };

  const commissionRateTemplate = rowData => {
    const calculationValue =
      (rowData?.amount * (editorRate || 1)) / rowData?.conversation_rate;
    // const calculationValue = rowData?.amount;
    // (rowData?.rate * rowData?.commission_rate) / rowData?.conversation_rate;
    return <span>{convertIntoNumber(calculationValue)}</span>;
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
            onChange={e => {
              handlePercentageChange(
                item?.emp_unique_index,
                data,
                !e.value ? 0 : e.value > 100 ? 100 : e.value,
              );
            }}
            className="mb-2"
            min={0}
            max={100}
            maxLength={4}
            minFractionDigits={0}
            maxFractionDigits={2}
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

  const amountTemplate = rowData => {
    return (
      <div className="d-flex">
        <span className="me-1">{'₹'}</span>
        <span>{convertIntoNumber(rowData?.amount)}</span>
      </div>
    );
  };

  const rateTemplate = rowData => {
    return (
      <div className="d-flex">
        <span className="me-1">{'₹'}</span>
        <span>{convertIntoNumber(rowData?.rate)}</span>
      </div>
    );
  };

  const handleGiveCommissionButton = () => {
    setVisible(true);
    requireLoadData();
  };

  // const commission_percentage = (
  //   (values?.total_commission_amount * 100) /
  //   parseFloat(
  //     billingData?.sub_total
  //       ? billingData?.sub_total * billingData?.conversation_rate
  //       : 0,
  //   )
  // )?.toFixed(2);

  // const commission_percentage = useMemo(() => {
  //   const total_commission_amount = totalCommissionAmt
  //     ? convertIntoNumber(totalCommissionAmt)
  //     : 0;
  //   const calculated_sub_total = values?.sub_total
  //     ? convertIntoNumber(values?.sub_total * values?.conversation_rate)
  //     : 0;

  //   const calculation = (total_commission_amount * 100) / calculated_sub_total;
  //   return calculation;
  // }, [values, totalCommissionAmt]);

  // const commission_amount = convertIntoNumber(totalCommissionAmt);

  // const profit_amount = useMemo(() => {
  //   const calculated_sub_total = values?.sub_total
  //     ? convertIntoNumber(values?.sub_total * values?.conversation_rate)
  //     : 0;
  //   const total_commission_amount = totalCommissionAmt
  //     ? convertIntoNumber(totalCommissionAmt)
  //     : 0;

  //   return calculated_sub_total - total_commission_amount;
  // }, [values, totalCommissionAmt]);

  // const profit_amount = (
  //   convertIntoNumber(
  //     billingData?.sub_total
  //       ? billingData?.sub_total * billingData?.conversation_rate
  //       : 0,
  //   ) - values?.total_commission_amount
  // )?.toFixed(2);

  const headerTemplate = data => {
    return (
      <>
        <hr />
        <div className="flex align-items-center gap-2">
          <span className="font-bold">{data?.package_name || ''}</span>
        </div>
        {/* <hr /> */}
      </>
    );
  };

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
                <h3 class="m-0">Edit Billing</h3>
              </div>
            </Col>
            <Col lg={6}>
              <ul className="billing-btn justify-content-end">
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
                      onClick={
                        () => navigate(`/view-billing/${id}`)
                        //    setPreview(true)
                      }
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
                <h2>{values?.quotation_name ? values?.quotation_name : ''}</h2>
                <div class="payment_status_type">
                  {values?.status > 2 && (
                    <span class="p-tag p-component p-tag-success">Paid</span>
                  )}
                </div>
                <div className="date_number">
                  <ul>
                    <li>
                      <h6>Invoice No.</h6>
                      <h4>{values?.invoice_no ? values?.invoice_no : 0}</h4>
                    </li>
                    <li>
                      <h6>Invoice Date</h6>
                      <h4>
                        {values?.invoice_date
                          ? moment(values?.invoice_date)?.format('DD-MM-YYYY')
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
                            {values?.item_name?.length === 1
                              ? values?.item_name[0]
                              : values?.item_name?.join(', ')}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Couple Name :</span>
                          <h5>
                            {values?.couple_name ? values?.couple_name : ''}
                          </h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Data Size :</span>
                          <h5>
                            {values?.data_size
                              ? values?.data_size?.toFixed(2)
                              : 0}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Project Type :</span>
                          <h5>
                            {values?.project_type_value
                              ? values?.project_type_value
                              : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Due Date :</span>
                          <h5>
                            {values?.due_date
                              ? moment(values?.due_date)?.format('DD-MM-YYYY')
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
                            {values?.company_name ? values?.company_name : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Client Name :</span>
                          <h5>
                            {values?.client_name ? values?.client_name : ''}
                          </h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Phone No :</span>
                          <h5>
                            {values?.company_number
                              ? values?.company_number
                              : ''}
                          </h5>
                        </div>
                        <div class="order-date">
                          <span>Email :</span>
                          <h5>
                            {values?.company_email ? values?.company_email : ''}
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
                {values?.total_commission_amount > 0 && checker > 0
                  ? 'Update Commission'
                  : 'Give Commission'}
              </Button>
            )}
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={
                values?.quotation_detail?.length ? values?.quotation_detail : []
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
              <Column
                field="rate"
                header="Rate"
                sortable
                body={rateTemplate}
              ></Column>
              <Column
                field="amount"
                header="Amount"
                sortable
                body={amountTemplate}
              ></Column>
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
                      __html: values?.terms_condition
                        ? values?.terms_condition
                        : '',
                    }}
                  ></div>
                </div>
              </Col>
              <Col xxl={4} lg={6}>
                {values?.total_commission_amount > 0 && !preview && (
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
                          <h5>{values?.sub_total ? values?.sub_total : 0}</h5>
                        </div>
                      </div>
                      <div className="sub-total-wrapper">
                        <div className="subtotal-title">
                          <h5>Commission Percentage</h5>
                        </div>
                        <div className="subtotal-input">
                          <input
                            value={
                              values?.commission_percentage
                                ? values?.commission_percentage
                                : 0
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
                            value={values?.total_commission_amount || 0}
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
                            {values?.profit_amount ? values?.profit_amount : 0}
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
                          {'₹'} {values?.sub_total ? values?.sub_total : 0}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>{`Tax (${
                          values?.tax_percentage
                            ? values?.tax_percentage + '%'
                            : ''
                        })`}</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>
                          {'₹'} {values?.tax ? values?.tax : 0}
                        </h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>
                          {'₹'} {values?.discount ? values?.discount : 0}
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
                          {'₹'}{' '}
                          {values?.total_amount ? values?.total_amount : 0}
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
              <Button
                className="btn_border_dark filter_btn"
                onClick={() => navigate('/billing')}
              >
                Exit Page
              </Button>
            </li>
            <li>
              {!preview && (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn_primary filter_btn"
                >
                  Update
                </Button>
              )}
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
        onHide={() => {
          setVisible(false);
          requireLoadData();
        }}
        draggable={false}
        header="Commission Distributes"
      >
        {conversationRate > 1 && (
          <div className="my-2">
            <label className="mx-3">Editor Rate: </label>
            <InputNumber
              name="editor_rate"
              placeholder="Enter Editor Rate"
              value={editorRate}
              className="mb-2"
              onChange={e => {
                if (e.value < 1) {
                  setEditorRate(1);
                } else {
                  setEditorRate(e.value);
                }
              }}
              useGrouping={false}
              maxFractionDigits={2}
            />
          </div>
        )}

        <div className="data_table_wrapper max_height">
          <DataTable
            value={
              values?.exposing_items_data?.length
                ? values?.exposing_items_data
                : []
            }
            rowGroupMode="subheader"
            sortField="package_name"
            sortMode="single"
            groupRowsBy="package_name"
            sortOrder={1}
            scrollable
            footerColumnGroup={DistributesfooterGroup}
            rows={10}
            rowGroupHeaderTemplate={headerTemplate}
          >
            <Column field="item_name" header="Item Name"></Column>
            <Column
              field="assigned_employee"
              header="Assigned Employee"
              body={AssignedTemplate}
            ></Column>
            <Column
              field="rate"
              header="Rate"
              body={commissionRateTemplate}
            ></Column>
            <Column
              field="commission_percentage_item"
              header="Percentage"
              body={percentageTemplate}
            ></Column>
            <Column
              field="commission_amount_item"
              header="Amount"
              body={commissionAmount}
            ></Column>
          </DataTable>
        </div>
        <div className="delete_btn_wrap pr20">
          <button
            className="btn_border"
            onClick={() => {
              setVisible(false);
              requireLoadData();
            }}
          >
            Cancel
          </button>
          <button
            className="btn_primary"
            onClick={() => {
              setVisible(false);
              setUpdateButtonText(
                values?.total_commission_amount > 0 && checker > 0
                  ? true
                  : false,
              );
            }}
          >
            {updateButtonText ? 'Update' : 'Save'}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
