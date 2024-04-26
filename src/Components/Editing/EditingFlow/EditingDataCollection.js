import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import {
  addStep,
  getEditingFlow,
  setEditingQuotationData,
  setEditingSelectedProgressIndex,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useDispatch, useSelector } from 'react-redux';
import CommentDataCollection from './CommentDataCollection';
import Loader from 'Components/Common/Loader';
import { useFormik } from 'formik';
import { editDataCollection } from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import { InputText } from 'primereact/inputtext';
// import { DataCollectionList } from 'Helper/CommonList';
import { totalCount } from 'Helper/CommonHelper';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';
import moment from 'moment';
import { editingDataCollectionSchema } from 'Schema/Editing/editingSchema';
import { getDevicesList } from 'Store/Reducers/Settings/Master/DevicesSlice';

export default function EditingDataCollection() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingItemOptionList, setEditingItemOptionList] = useState([]);
  const [isShowNext, setIsShowNext] = useState(false);
  const { commentLoading, selectedEditingData, editingLoading, getStepData } =
    useSelector(({ editing }) => editing);
  const { dataCollectionLoading } = useSelector(
    ({ dataCollection }) => dataCollection,
  );
  const { devicesList, devicesLoading } = useSelector(({ devices }) => devices);

  useEffect(() => {
    dispatch(getEditingFlow({ order_id: id }));
    dispatch(
      getDevicesList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
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
            setEditingItemOptionList(data);
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching package data:', error);
      });
    // if (getStepData?.step >= 1) {
    //   setIsShowNext(true);
    // }
  }, [dispatch]);

  const DataCollectionListOption = useMemo(() => {
    if (devicesList?.list?.length > 0) {
      let updatedData = devicesList?.list.map(item => {
        return { label: item?.device_name, value: item?._id };
      });
      return updatedData;
    }
  }, [devicesList]);

  const handleitemList = (fieldName, fieldValue, e) => {
    const data = e?.selectedOption;
    let editingList = [];
    let totalDataCollection = 0;
    if (!values?.editing_inquiry?.includes(data?._id)) {
      let newObj = {};
      if (data?.isPackage === true) {
        newObj = {
          item_id: data?._id,
          item_name: data?.package_name,
          quantity: 1,
          due_date: '',
          description: data?.remark,
          data_collection_source: [],
          data_size: '',
        };
      } else {
        newObj = {
          item_id: data?._id,
          item_name: data?.item_name,
          quantity: 1,
          due_date: '',
          description: data?.item_description,
          data_collection_source: [],
          data_size: '',
        };
      }
      editingList = [...values?.editingTable, newObj];
    } else {
      editingList = values?.editingTable?.filter(
        item => item?.item_id !== data?._id,
      );
      totalDataCollection = totalCount(editingList, 'data_size');
      setFieldValue('total_data_collection', totalDataCollection);
    }
    setFieldValue('editingTable', editingList);
    setFieldValue(fieldName, fieldValue);
  };

  const handleEditingTableChange = (item, fieldName, fieldValue) => {
    const editingList = [...values?.editingTable];
    const index = editingList?.findIndex(x => x?.item_id === item?.item_id);
    const oldObj = editingList[index];
    let totalDataCollection = 0;
    const updatedObj = {
      ...oldObj,
      [fieldName]: fieldValue,
    };
    if (index >= 0) editingList[index] = updatedObj;
    if (fieldName === 'data_size') {
      totalDataCollection = totalCount(editingList, 'data_size');
      setFieldValue('total_data_collection', totalDataCollection);
    }
    setFieldValue('editingTable', editingList);
  };

  const handleDeleteEditingItem = item => {
    let dummyList = values?.editingTable.filter(
      d => d?.item_id !== item?.item_id,
    );
    const totalDataCollection = totalCount(dummyList, 'data_size');
    setFieldValue('total_data_collection', totalDataCollection);
    setFieldValue('editingTable', dummyList);
    let itemData = values?.editing_inquiry?.filter(d => d !== item?.item_id);
    setFieldValue('editing_inquiry', itemData);
  };

  const editingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const DescriptionTemplate = data => {
    // return (
    //   <>
    //     <div className="max_250">
    //       <p>{data?.description}</p>
    //     </div>
    //   </>
    // );
    return (
      <div
        className="editor_text_wrapper max_700"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    );
  };

  const DataCollectionTemplate = data => {
    return (
      <div className="form_group">
        <MultiSelect
          value={data?.data_collection_source}
          options={DataCollectionListOption}
          name="data_collection_source"
          onChange={e => {
            handleEditingTableChange(data, e.target.name, e.target.value);
          }}
          disabled={isShowNext}
          placeholder="Data Collection Source"
          className="w-100"
          filter
          showSelectAll={false}
        />
        <p className="mt10">{values?.data_collection_source}</p>
      </div>
    );
  };

  const dueDateBodyTemplate = data => {
    return (
      <div className="form_group date_select_wrapper w_150 hover_date">
        <Calendar
          id="Creat Date"
          placeholder="Select Date"
          showIcon
          dateFormat="dd-mm-yy"
          disabled={isShowNext}
          value={data?.due_date}
          name="due_date"
          readOnlyInput
          onChange={e => {
            const utcDate = new Date(e.value);
            handleEditingTableChange(data, e.target.name, utcDate);
          }}
        />
      </div>
    );
  };

  const dataSizeBodyTemplate = data => {
    return (
      <div className="form_group d-flex">
        <InputText
          id="Data Size"
          placeholder="Data size"
          name="data_size"
          value={data?.data_size}
          disabled={isShowNext}
          onChange={e => {
            handleEditingTableChange(data, e.target.name, e.target.value);
          }}
          required
        />
      </div>
    );
  };

  const actionBodyTemplate = data => {
    return (
      <div className="dropdown_action_wrap">
        <Button
          onClick={() => {
            handleDeleteEditingItem(data);
          }}
          className="btn_transparent"
        >
          <img src={TrashIcon} alt="TrashIcon" />
        </Button>
      </div>
    );
  };

  const submitHandle = useCallback(
    async (values, { resetForm }) => {
      const isDataCollectionSource = values?.editingTable?.some(item => {
        return item?.data_collection_source.length === 0;
      });

      const isDueDate = values?.editingTable?.some(item => {
        return !item?.due_date;
      });

      const isDataSize = values?.editingTable?.some(item => {
        return !item?.data_size;
      });

      if (!isDataCollectionSource && !isDataSize && !isDueDate) {
        let updatedList = values?.editingTable?.map(d => {
          return {
            ...d,
            orderItems_id: d?._id,
            due_date: moment(new Date(d?.due_date))?.format('YYYY-MM-DD'),
          };
        });

        let payload = {
          order_id: id,
          data_collection: updatedList,
        };
        dispatch(editDataCollection(payload))
          .then(response => {
            dispatch(getEditingFlow({ order_id: id }))
              .then(responseData => {
                resetForm();
                setIsShowNext(true);
              })
              .catch(error => {
                console.error('Error fetching Editing Flow:', error);
              });
          })
          .catch(error => {
            console.error('Error fetching while edit data collection:', error);
          });
      } else {
        toast.error('Data Collection Details Are Required');
      }
    },

    [id, dispatch],
  );

  const { values, errors, touched, setFieldValue, resetForm, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: selectedEditingData,
      validationSchema: editingDataCollectionSchema,
      onSubmit: submitHandle,
    });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          colSpan={5}
          className="text-start"
          footer="Total Data Collection"
        />
        <Column footer={`${values?.total_data_collection} GB`} />
        <Column footer="" />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="p20 p15-xs">
      {(commentLoading ||
        dataCollectionLoading ||
        editingLoading ||
        devicesLoading) && <Loader />}
      <Row>
        <Col xxl={8} xl={7}>
          <div className="process_order_wrap p-0 pb-3 mb20">
            <Row className="align-items-center">
              <Col sm={6}>
                <div className="back_page">
                  <Button className="btn_as_text d-flex align-items-center">
                    <Button
                      className="btn_transparent"
                      onClick={() => {
                        navigate('/editing');
                      }}
                    >
                      <img src={ArrowIcon} alt="ArrowIcon" />
                    </Button>
                    <h2 className="m-0 ms-2 fw_500">Data Collection</h2>
                  </Button>
                </div>
              </Col>
              <Col sm={6}>
                <div className="date_number">
                  <ul className="justify-content-end">
                    <li>
                      <h6>Order No.</h6>
                      <h4>{values?.inquiry_no}</h4>
                    </li>
                    <li>
                      <h6>Create Date</h6>
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
          <div className="job_company">
            <Row className="g-3 g-sm-4">
              <Col md={6}>
                <div className="order-details-wrapper p10 border radius15 h-100">
                  <div className="pb10 border-bottom">
                    <h6 className="m-0">Job</h6>
                  </div>
                  <div className="details_box pt10">
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Items :</span>
                        <h5>{values?.item_name}</h5>
                      </div>
                      <div className="order-date">
                        <span>Couple Name :</span>
                        <h5>{values?.couple_name}</h5>
                      </div>
                    </div>
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Data Size :</span>
                        <h5>{values?.data_size} GB</h5>
                      </div>
                      <div className="order-date">
                        <span>Project Type :</span>
                        <h5>{values?.project_type_value}</h5>
                      </div>
                      <div className="order-date">
                        <span>Due Date :</span>
                        <h5>{values?.due_date}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="order-details-wrapper p10 border radius15 h-100">
                  <div className="pb10 border-bottom">
                    <h6 className="m-0">Company</h6>
                  </div>
                  <div className="details_box pt10">
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Company Name :</span>
                        <h5>{values?.company_name}</h5>
                      </div>
                      <div className="order-date">
                        <span>Client Name :</span>
                        <h5>{values?.client_full_name}</h5>
                      </div>
                    </div>
                    <div className="details_box_inner">
                      <div className="order-date">
                        <span>Phone No :</span>
                        <h5>{values?.mobile_no}</h5>
                      </div>
                      <div className="order-date">
                        <span>Email :</span>
                        <h5>{values?.email_id}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="order_items">
            <h3>Data Collection Details</h3>
            <Row>
              <Col xxl={4} sm={6}>
                <div className="form_group">
                  <MultiSelect
                    filter
                    value={values?.editing_inquiry}
                    name="editing_inquiry"
                    options={editingItemOptionList}
                    onChange={e => {
                      handleitemList(e.target.name, e.value, e);
                    }}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={editingItemsTemplate}
                    placeholder="Select Editing Items"
                    className="w-100"
                    showSelectAll={false}
                    disabled={isShowNext}
                  />
                  {touched?.editing_inquiry && errors?.editing_inquiry && (
                    <p className="text-danger">{errors?.editing_inquiry}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper overflow-hidden border radius15 vertical_top max_height data_collection_wrapper">
            <DataTable
              value={values?.editingTable}
              sortField="item_name"
              sortOrder={1}
              rows={10}
              footerColumnGroup={footerGroup}
            >
              <Column
                field="item_name"
                header="Item"
                sortable
                // body={ItemsBodyTemplate}
              ></Column>
              <Column
                field="description"
                header="Description"
                body={DescriptionTemplate}
                sortable
              ></Column>
              <Column
                field="data_collection_source"
                header="Data Collection Source"
                sortable
                body={DataCollectionTemplate}
              ></Column>
              <Column
                field="due_date"
                header="Due Date"
                sortable
                body={dueDateBodyTemplate}
              >
                {' '}
              </Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column
                field="data_size"
                header="Data Size"
                sortable
                body={dataSizeBodyTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
          </div>
        </Col>
        <CommentDataCollection />
      </Row>
      <div className="btn_group text-end mt20">
        <Button
          onClick={() => {
            navigate('/editing');
          }}
          className="btn_border_dark"
        >
          Exit Page
        </Button>
        {!isShowNext && (
          <Button className="btn_primary ms-2" onClick={handleSubmit}>
            Save
          </Button>
        )}
        {isShowNext && (
          <Button
            onClick={() => {
              if (!getStepData?.step || getStepData?.step < 1) {
                let payload = {
                  order_id: id,
                  step: 1,
                };
                dispatch(addStep(payload))
                  .then(response => {
                    dispatch(setEditingSelectedProgressIndex(2));
                    dispatch(setEditingQuotationData({}));
                  })
                  .catch(errors => {
                    console.error('Add Status:', errors);
                  });
              } else {
                dispatch(setEditingSelectedProgressIndex(2));
                dispatch(setEditingQuotationData({}));
              }
            }}
            className="btn_primary ms-2"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
