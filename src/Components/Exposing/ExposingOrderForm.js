import React, { memo, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import {
  addExposingStep,
  editExposingFlow,
  getExposingFlow,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { totalCount } from 'Helper/CommonHelper';
import { getFormattedDate } from 'Helper/CommonList';
import { exposingOrderFormSchema } from 'Schema/Exposing/exposingSchema';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

const ExposingOrderForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowNext, setIsShowNext] = useState(false);
  const [exposingItemOptionList, setExposingItemOptionList] = useState([]);
  const [clientCompanyOptionList, setClientCompanyOptionList] = useState([]);

  const { clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );
  const { packageLoading, productLoading } = useSelector(
    ({ product }) => product,
  );
  const { exposingLoading, selectedExposingData, getExposingStepData } =
    useSelector(({ exposing }) => exposing);

  useEffect(() => {
    dispatch(getExposingFlow({ order_id: id }));
    dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    ).then(response => {
      const companyData = response.payload?.data?.list?.map(item => ({
        label: item?.company_name,
        value: item?._id,
      }));

      setClientCompanyOptionList(companyData);
      return companyData;
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getPackageList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    )
      .then(response => {
        const packageData = response.payload?.data?.list?.map(item => ({
          ...item,
          label: item?.package_name,
          value: item?._id,
          isPackage: true,
        }));

        return { packageData };
      })
      .then(({ packageData }) => {
        dispatch(
          getProductList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        )
          .then(response => {
            const productData = response.payload?.data?.list?.map(item => ({
              ...item,
              label: item?.item_name,
              value: item?._id,
              isPackage: false,
            }));
            let data = [
              { label: 'Package', items: [...packageData] },
              { label: 'Product', items: [...productData] },
            ];
            setExposingItemOptionList(data);
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching package data:', error);
      });
  }, [dispatch]);

  const submitHandle = useCallback(
    (value, { resetForm }) => {
      const orderTableData = value?.exposing_order_table?.map(item => {
        return {
          ...(item?._id && { orderItems_id: item?._id }),
          item_id: item?.item_id ? item?.item_id : '',
          item_name: item?.item_name ? item?.item_name : '',
          quantity: item?.quantity ? item?.quantity : 0,
          order_date: item?.order_date
            ? getFormattedDate(item?.order_date)
            : '',
          rate: item?.rate ? item?.rate : 0,
          amount: item?.amount ? item?.amount : 0,
          description: item?.description ? item?.description : '',
        };
      });

      const payloadObj = {
        order_id: id,
        remark: value?.remark ? value?.remark : '',
        venue: value?.venue ? value?.venue : '',
        is_editing: value?.is_editing ? value?.is_editing : false,
        delivery_date: getFormattedDate(value?.delivery_date),
        exposing_item: orderTableData,
      };

      dispatch(editExposingFlow(payloadObj))
        .then(response => {
          dispatch(getExposingFlow({ order_id: id }))
            .then(responseData => {
              resetForm();
              setIsShowNext(true);
            })
            .catch(error => {
              console.error('Error fetching Exposing Flow:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching while edit order form:', error);
        });
    },
    [dispatch, id],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedExposingData,
    validationSchema: exposingOrderFormSchema,
    onSubmit: submitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={5} />
        <Column footer={values?.total_amount_collection} colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const DescriptionTemplate = rowData => {
    return (
      <>
        <div className="description_text">
          <p>{rowData?.description}</p>
        </div>
      </>
    );
  };

  const exposingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const EventBodyTemplet = (rowData, item) => {
    const fieldName = item?.field;
    return (
      <div className="form_group date_select_wrapper w_150 hover_date">
        <Calendar
          showIcon
          dateFormat="dd-mm-yy"
          name={fieldName}
          value={rowData[fieldName]}
          onChange={e => {
            const orderDate = new Date(e.value);
            handleExposingTableChange(rowData, e.target.name, orderDate);
          }}
          onBlur={handleBlur}
          showButtonBar
        />
      </div>
    );
  };

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let totalAmountCollection = 0;
    let exposingOrderList = [];

    if (!values?.selected_exposing_order_item?.includes(data?._id)) {
      let newObj = {};

      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          description: data?.remark,
          order_date: new Date(),
          quantity: 1,
          rate: data?.price,
          amount: data?.price,
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          description: data?.item_description,
          order_date: new Date(),
          quantity: 1,
          rate: data?.item_price,
          amount: data?.item_price,
        };
      }

      exposingOrderList = [...values?.exposing_order_table, newObj];
    } else {
      exposingOrderList = values?.exposing_order_table?.filter(
        item => item?.item_id !== data?._id,
      );
    }
    totalAmountCollection = totalCount(exposingOrderList, 'amount');
    setFieldValue('total_amount_collection', totalAmountCollection);
    setFieldValue('exposing_order_table', exposingOrderList);
    setFieldValue(fieldName, fieldValue);
  };

  const handleExposingTableChange = (item, fieldName, fieldValue) => {
    let totalAmountCollection = 0;
    let exposingOrderTableData = [...values?.exposing_order_table];

    const index = exposingOrderTableData?.findIndex(
      x => x?.item_id === item?.item_id,
    );

    if (index >= 0) {
      const oldObj = exposingOrderTableData[index];

      const updatedObj = {
        ...oldObj,
        [fieldName]: fieldValue,
      };
      exposingOrderTableData[index] = updatedObj;
    }

    if (fieldName === 'data_size') {
      totalAmountCollection = totalCount(exposingOrderTableData, 'amount');
      setFieldValue('total_amount_collection', totalAmountCollection);
    }
    setFieldValue('exposing_order_table', exposingOrderTableData);
  };

  return (
    <>
      {exposingLoading ||
        clientCompanyLoading ||
        packageLoading ||
        (productLoading && <Loader />)}
      <div className="main_Wrapper">
        <div className="processing_main bg-white radius15 border">
          <div className="process_order_wrap">
            <Row className="align-items-center">
              <Col sm={5}>
                <div className="back_page">
                  <div className="btn_as_text d-flex align-items-center">
                    {/* <Link to="/exposing">
                    <img src={ArrowIcon} alt="ArrowIcon" />
                    </Link> */}
                    <Button
                      className="btn_transparent"
                      onClick={() => {
                        navigate('/exposing');
                      }}
                    ></Button>
                    <h2 className="m-0 ms-2 fw_500">Order Form</h2>
                  </div>
                </div>
              </Col>
              <Col sm={7}>
                <div className="date_number">
                  <ul className="justify-content-end">
                    <li>
                      <h6>Order No.</h6>
                      <h4>{values?.inquiry_no}</h4>
                    </li>
                    <li>
                      <h6>Creat Date</h6>
                      <h4>{values?.create_date}</h4>
                    </li>
                    <li>
                      <h6>Confirm By </h6>
                      <h4>{values?.confirm_by ? values?.confirm_by : ''}</h4>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="billing_details">
            <Row>
              <Col lg={6}>
                <Row className="align-items-end">
                  <Col sm={6}>
                    <div class="form_group mb-3">
                      <label>Company</label>
                      <ReactSelectSingle
                        filter
                        name="client_company_id"
                        value={values?.client_company_id}
                        options={clientCompanyOptionList}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Select Company"
                        disabled
                      />
                    </div>
                  </Col>
                  {/* <Col sm={6}>
                  <div className="addclient_popup">
                    <Button
                      className="btn_primary filter_btn mb-3"
                      onClick={() => setVisible(true)}
                    >
                      <img src={PlusIcon} alt="PlusIcon" />
                      New Client
                    </Button>
                  </div>
                </Col> */}
                  <Col sm={6}>
                    <div class="form_group mb-3">
                      <label>Client Name</label>
                      <input
                        name="client_full_name"
                        value={values?.client_full_name}
                        onChange={handleChange}
                        disabled
                        placeholder="Client Name"
                        class="p-inputtext p-component input_wrap"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="align-items-end">
                  <Col sm={6}>
                    <div class="form_group mb-3">
                      <label>Email Address</label>
                      <input
                        placeholder="Write email address"
                        class="p-inputtext p-component input_wrap"
                        name="email_id"
                        value={values?.email_id}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div class="form_group mb-3">
                      <label>Phone Number</label>
                      <input
                        placeholder="Write number"
                        type="number"
                        class="p-inputtext p-component input_wrap"
                        name="mobile_no"
                        value={values?.mobile_no}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={6}>
                <div className="delivery_timing">
                  <ul>
                    <li>
                      <div className="form_group mb-3">
                        <label>Delivery Date</label>
                        <div className="date_select">
                          <Calendar
                            id="Delivery Date"
                            placeholder="Select Delivery Date"
                            showIcon
                            dateFormat="dd-mm-yy"
                            name="delivery_date"
                            value={values?.delivery_date || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            showButtonBar
                          />
                          {touched?.delivery_date && errors?.delivery_date && (
                            <p className="text-danger">
                              {errors?.delivery_date}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                    {/* <li>
                    <div className="form_group mb-3">
                      <label className="d-block">Timing</label>
                      <Calendar
                        id="calendar-timeonly"
                        value={time}
                        placeholder="00:00"
                        onChange={e => setTime(e.value)}
                        timeOnly
                      />
                    </div>
                  </li> */}
                    <li>
                      {/* <div className="checkbox_wrap_main d-flex align-items-center gap-2 mb-2 mb-sm-3">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setEdit(e.checked)}
                          checked={edit}
                        ></Checkbox>
                      </div>
                      <span>Yes Editing</span>
                    </div> */}

                      <div className="radio_wrapper d-flex flex-wrap align-items-center mb20">
                        <div className="radio-inner-wrap d-flex align-items-center me-3">
                          <RadioButton
                            inputId="YesEditing"
                            name="is_editing"
                            onBlur={handleBlur}
                            onChange={() => {
                              setFieldValue('is_editing', !values?.is_editing);
                            }}
                            checked={values?.is_editing}
                          />
                          <label htmlFor="ingredient1" className="ms-sm-2 ms-1">
                            Yes Editing
                          </label>
                        </div>
                        <div className="radio-inner-wrap d-flex align-items-center">
                          <RadioButton
                            inputId="NoEditing"
                            name="is_editing"
                            onBlur={handleBlur}
                            onChange={() => {
                              setFieldValue('is_editing', !values?.is_editing);
                            }}
                            checked={!values?.is_editing}
                          />
                          <label htmlFor="ingredient2" className="ms-sm-2 ms-1">
                            No Editing
                          </label>
                        </div>
                      </div>
                    </li>
                    {/* <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2 mb-2 mb-sm-3">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setNoEdit(e.checked)}
                          checked={noEdit}
                        ></Checkbox>
                      </div>
                      <span>No Editing</span>
                    </div>
                  </li> */}
                  </ul>
                </div>
                <div class="form_group mb-3">
                  <label>Venue</label>
                  <input
                    name="venue"
                    value={values?.venue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Venue"
                    class="p-inputtext p-component input_wrap"
                  />
                  {errors?.venue && (
                    <p className="text-danger">{errors?.venue}</p>
                  )}
                </div>
                <div class="form_group mb-3">
                  <label>Remark</label>
                  <input
                    name="remark"
                    value={values?.remark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Remark"
                    class="p-inputtext p-component input_wrap"
                  />
                </div>
              </Col>
            </Row>
            <div className="order_items">
              <h3>Order Item</h3>
              <Row>
                <Col xl={2} lg={4} sm={6}>
                  <div class="form_group">
                    <MultiSelect
                      filter
                      value={values?.selected_exposing_order_item}
                      name="selected_exposing_order_item"
                      options={exposingItemOptionList}
                      onChange={e => {
                        handleitemList(e.target.name, e.value, e);
                      }}
                      optionLabel="label"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionGroupTemplate={exposingItemsTemplate}
                      placeholder="Select Editing Items"
                      className="w-100"
                      showSelectAll={false}
                      onBlur={handleBlur}
                    />
                    {touched?.selected_exposing_order_item &&
                      errors?.selected_exposing_order_item && (
                        <p className="text-danger">
                          {errors?.selected_exposing_order_item}
                        </p>
                      )}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="data_table_wrapper max_height border radius15 overflow-hidden">
              <DataTable
                value={values?.exposing_order_table}
                sortField="price"
                sortOrder={1}
                rows={10}
                footerColumnGroup={footerGroup}
              >
                <Column field="item_name" header="Item" sortable></Column>
                <Column
                  field="description"
                  header="Description"
                  body={DescriptionTemplate}
                  sortable
                ></Column>
                <Column
                  field="order_date"
                  header="Event Date"
                  sortable
                  body={EventBodyTemplet}
                ></Column>
                <Column field="quantity" header="Quantity" sortable></Column>
                <Column field="rate" header="Rate" sortable></Column>
                <Column field="amount" header="Amount" sortable></Column>
              </DataTable>
            </div>
            <div class="delete_btn_wrap mt-4 p-0 text-end">
              <Button
                onClick={() => {
                  navigate('/exposing');
                }}
                className="btn_border_dark"
              >
                Exit Page
              </Button>
              {!isShowNext && (
                <Button
                  className="btn_primary ms-2"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              )}
              {isShowNext && (
                <Button
                  onClick={() => {
                    if (
                      !getExposingStepData?.step ||
                      getExposingStepData?.step < 1
                    ) {
                      let payload = {
                        order_id: id,
                        step: 1,
                      };
                      dispatch(addExposingStep(payload))
                        .then(response => {
                          dispatch(setExposingSelectedProgressIndex(2));
                        })
                        .catch(errors => {
                          console.error('Add Status:', errors);
                        });
                    } else {
                      dispatch(setExposingSelectedProgressIndex(2));
                    }
                  }}
                  className="btn_primary ms-2"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(ExposingOrderForm);
