import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import AddUserIcon from '../../../Assets/Images/add-user.svg';
import CompleteIcon from '../../../Assets/Images/complete-green.svg';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import {
  addStep,
  editOrder,
  getEditingFlow,
  getStep,
  setEditingCompletedData,
  setEditingSelectedProgressIndex,
} from 'Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useFormik } from 'formik';
import Loader from 'Components/Common/Loader';
import CommentDataCollection from './CommentDataCollection';
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from 'react-toastify';

export default function EditingCompleted() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [createGroupModel, setCreateGroupModel] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const ProjectStatus = [
    { label: 'Initial', value: 1 },
    { label: 'Library Done', value: 2 },
    { label: 'IN Progress', value: 3 },
    { label: 'IN Checking', value: 4 },
    { label: 'Completed', value: 5 },
    { label: 'Exporting', value: 6 },
  ];

  const { editingLoading, editingCompletedData, commentLoading, getStepData } =
    useSelector(({ editing }) => editing);

  useEffect(() => {
    dispatch(getEditingFlow({ order_id: id }))
      .then(response => {
        const responseData = response.payload;
        if (getStepData?.is_rework === true) {
          setShowNext(true);
        }
        const updatedData = {
          ...responseData,
          is_rework: getStepData?.is_rework,
        };
        dispatch(setEditingCompletedData(updatedData));
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, [dispatch, id, getStepData]);

  const footerContent = (
    <div className="footer_wrap text-end">
      <Button
        className="btn_primary"
        onClick={() => setCreateGroupModel(false)}
      >
        Save
      </Button>
    </div>
  );
  const statusItemTemplate = option => {
    return (
      <Tag value={option?.label} severity={getSeverityStatus(option?.label)} />
    );
  };
  const getSeverityStatus = product => {
    switch (product) {
      case 'Initial':
        return 'info';
      case 'Library Done':
        return 'orange';
      case 'IN Progress':
        return 'warning';
      case 'IN Checking':
        return 'danger';
      case 'Completed':
        return 'success';
      case 'Exporting':
        return 'primary';
      default:
        return null;
    }
  };

  const handleProjectStatusChange = e => {
    setFieldValue('order_status', e.value);
    let payload = {
      order_id: id,
      project_status: e.value,
    };
    dispatch(editOrder(payload))
      .then(response => {
        dispatch(getEditingFlow({ order_id: id }));
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      });
  };

  const submitHandle = useCallback(
    async values => {
      if (values?.final_work) {
        let payload = {
          order_id: id,
          final_work: values?.final_work,
        };
        dispatch(editOrder(payload))
          .then(response => {
            let payload = {
              order_id: id,
              step: 6,
            };
            dispatch(addStep(payload))
              .then(response => {
                dispatch(getEditingFlow({ order_id: id }));
              })
              .catch(errors => {
                console.error('Add Status:', errors);
              });
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      } else {
        toast.error('Final Work Are Required');
      }
    },
    [dispatch],
  );

  const { values, setFieldValue, handleChange, handleBlur, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: editingCompletedData,
      onSubmit: submitHandle,
    });

  return (
    <div className="">
      {(commentLoading || editingLoading) && <Loader />}

      <div className="billing_details">
        <div className="mb25">
          <Row className="g-3 g-sm-4">
            <Col xxl={8} xl={7}>
              <div className="process_order_wrap p-0 pb-3 mb20">
                <Row className="align-items-center">
                  <Col sm={6}>
                    <div className="back_page">
                      <div className="btn_as_text d-flex align-items-center">
                        <Button
                          className="btn_transparent"
                          onClick={() => {
                            dispatch(setEditingSelectedProgressIndex(5));
                          }}
                        >
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </Button>
                        <h2 className="m-0 ms-2 fw_500">Completed</h2>
                      </div>
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
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job_company mb40">
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
              <div className="completed_wrapper max_660">
                <div className="complete_img text-center">
                  <img src={CompleteIcon} alt="completeicon" />
                  <h2>This Job is Completed</h2>
                </div>
                <div className="d-sm-flex align-items-center justify-content-center mb-3">
                  <h5 className="m-0 me-sm-2 mb-sm-0 mb-2">Project Status</h5>
                  <div className="form_group">
                    <ReactSelectSingle
                      value={values?.order_status}
                      options={ProjectStatus}
                      itemTemplate={statusItemTemplate}
                      onChange={e => {
                        handleProjectStatusChange(e);
                      }}
                      valueTemplate={statusItemTemplate}
                      placeholder="Project Status"
                      className="w-100"
                    />
                  </div>
                </div>
                <div className="data-submit-wrapper mb20">
                  <div className="data_inner">
                    <div className="form_group mb-3">
                      <InputTextarea
                        id="Remark"
                        placeholder="Past link here"
                        className="input_wrap"
                        rows={6}
                        name="final_work"
                        value={values?.final_work}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="delete_btn_wrap justify-content-center text-center">
                      <button className="btn_border_dark me-2">Cancel</button>
                      <button className="btn_primary" onClick={handleSubmit}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="checkbox_wrap_main d-flex align-items-center justify-content-end gap-2">
                  <div className="form_group checkbox_wrap">
                    <Checkbox
                      onChange={() => {
                        let payload = {
                          order_id: id,
                          is_rework: true,
                        };
                        dispatch(addStep(payload))
                          .then(response => {
                            setShowNext(true);
                            dispatch(
                              getStep({
                                order_id: id,
                              }),
                            );
                          })
                          .catch(errors => {
                            console.error('Add rework:', errors);
                          });
                      }}
                      checked={values?.is_rework}
                    ></Checkbox>
                  </div>
                  <span>Rework</span>
                </div>
              </div>
            </Col>
            <CommentDataCollection />
          </Row>
        </div>
        <div className="btn_group text-end mt20">
          <Button
            onClick={() => {
              navigate('/editing');
            }}
            className="btn_border_dark mx-1"
          >
            Exit Page
          </Button>
          {showNext && (
            <Button
              onClick={() => {
                dispatch(setEditingSelectedProgressIndex(7));
              }}
              className="btn_border_dark mx-1"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      <Dialog
        header="Edit Checker"
        visible={createGroupModel}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setCreateGroupModel(false)}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <div className="form_group mb-3">
            <h5 className="mb20">Checker</h5>
            <Button className="btn_doted">
              <div className="add_exposer">
                <img src={AddUserIcon} alt="" />
              </div>
              <h5>Freelancer</h5>
              <div className="add_exposer">
                <img className="add_icon" src={PlusIcon} alt="" />
              </div>
            </Button>
          </div>
        </div>
      </Dialog>

      {/* conformation popup */}
    </div>
  );
}
