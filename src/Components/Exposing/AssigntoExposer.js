import React, { useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import AddUserIcon from '../../Assets/Images/add-user.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import ProfileImg from '../../Assets/Images/profile-img.svg';
import CloseImg from '../../Assets/Images/close.svg';

export const QuotationData = [
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
  },
];

export default function AssigntoExposer() {
  const [confornation, setConfornation] = useState(false);
  const [popupCompanySelect, setPopupCompanySelect] = useState([]);
  const [paymentTypeSelect, setPaymentTypeSelect] = useState([]);

  const FreelancerBodyTemplet = () => {
    return (
      <div className="assigned_exposer">
        <Button className="btn_doted" onClick={() => setConfornation(true)}>
          <div className="add_exposer">
            <img src={AddUserIcon} alt="" />
          </div>
          <h5>Freelancer</h5>
          <div className="add_exposer">
            <img className="add_icon" src={PlusIcon} alt="" />
          </div>
        </Button>
      </div>
    );
  };

  const AssignBodyTemplet = () => {
    return (
      <ul className="assign-body-wrap">
        <li>
          <div className="assign-profile-wrapper">
            <div className="assign_profile">
              <img src={ProfileImg} alt="profileimg" />
            </div>
            <div className="profile_user_name">
              <h5 className="m-0">Keval</h5>
            </div>
            <div className="assign_profile">
              <Button className="btn_transparent">
                <img src={CloseImg} alt="" />
              </Button>
            </div>
          </div>
        </li>
        <li>
          <div className="assign-profile-wrapper">
            <div className="assign_profile">
              <img src={ProfileImg} alt="profileimg" />
            </div>
            <div className="profile_user_name">
              <h5 className="m-0">Manshi</h5>
            </div>
            <div className="assign_profile">
              <Button className="btn_transparent">
                <img src={CloseImg} alt="" />
              </Button>
            </div>
          </div>
        </li>
        <li>
          <div className="assign_dropdown_wrapper">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                <div className="assigned_exposer">
                  <div className="btn_doted">
                    <div className="add_exposer">
                      <img src={AddUserIcon} alt="" />
                    </div>
                    <div className="add_exposer">
                      <img className="add_icon" src={PlusIcon} alt="" />
                    </div>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Manshi</h5>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Vandana</h5>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Kapil</h5>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Keval</h5>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Akash</h5>
                    </div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </li>
      </ul>
    );
  };

  const statePopupCompanyChange = e => {
    setPopupCompanySelect(e.value);
  };

  const statePaymentTypeChange = e => {
    setPaymentTypeSelect(e.value);
  };

  const PopupCompany = [
    { label: 'ABC Company', value: 'abc company' },
    { label: 'BCD Company', value: 'bcd company' },
    { label: 'EFG Company', value: 'efg company' },
  ];
  const PaymentType = [
    { label: 'Case', value: 'case' },
    { label: 'Bank', value: 'bank' },
    { label: 'Cheque', value: 'cheque' },
  ];

  return (
    <div className="main_Wrapper">
      <div className="processing_main bg-white radius15 border">
        <div className="billing_heading">
          <div className="processing_bar_wrapper">
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Order Form</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Quotation</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Quotes Approve</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Assign to Exposer</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap next">
              <h4 className="m-0">Overview</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Completed</h4>
              <span className="line"></span>
            </div>
          </div>
        </div>
        <div className="billing_details">
          <div className="mb25">
            <div className="process_order_wrap p-0 pb-3">
              <Row className="align-items-center">
                <Col sm={6}>
                  <div className="back_page">
                    <div className="d-flex align-items-center">
                      <Link to="/quotes-approve">
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </Link>
                      <h2 className="m-0 ms-2 fw_500">Assign to Exposer</h2>
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="date_number">
                    <ul className="justify-content-end">
                      <li>
                        <h6>Order No.</h6>
                        <h4>#564892</h4>
                      </li>
                      <li>
                        <h6>Creat Date</h6>
                        <h4>27/06/2023</h4>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col lg={8}>
                <div className="job_company mt-3">
                  <Row className="g-3 g-sm-4">
                    <Col md={6}>
                      <div className="order-details-wrapper p10 border radius15">
                        <div className="pb10 border-bottom">
                          <h6 className="m-0">Job</h6>
                        </div>
                        <div className="details_box pt10">
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Dates :</span>
                              <h5>27/08/2023 To 29/08/2023</h5>
                            </div>
                            <div className="order-date">
                              <span>Venue :</span>
                              <h5>Omkar Exotica, Ankleswar</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="order-details-wrapper p10 border radius15">
                        <div className="pb10 border-bottom">
                          <h6 className="m-0">Company</h6>
                        </div>
                        <div className="details_box pt10">
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Company Name :</span>
                              <h5>ABC Enterprise</h5>
                            </div>
                            <div className="order-date">
                              <span>Client Name :</span>
                              <h5>Rajesh Singhania</h5>
                            </div>
                          </div>
                          <div className="details_box_inner">
                            <div className="order-date">
                              <span>Phone No :</span>
                              <h5>+91 9876541230</h5>
                            </div>
                            <div className="order-date">
                              <span>Email :</span>
                              <h5>rajeshsinghania@gmail.com</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height Exposing_table border radius15">
            <DataTable
              value={QuotationData}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column field="item_name" header="Item Name" sortable></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="event_date" header="Event Date" sortable></Column>
              <Column
                field="assigned_exposer"
                header="Assigned Exposer"
                sortable
                body={AssignBodyTemplet}
              ></Column>
              <Column
                field="assigned_freelancer_exposer"
                header="Assigned Freelancer Exposer"
                sortable
                body={FreelancerBodyTemplet}
              ></Column>
            </DataTable>
          </div>
          <div class="delete_btn_wrap mt-4 p-0 text-end">
            <Link to="/exposing" class="btn_border_dark">
              Exit Page
            </Link>
            <Link to="/overview" class="btn_primary">
              Save
            </Link>
          </div>
        </div>
      </div>

      {/* freelancer popup */}
      <Dialog
        className="modal_Wrapper overview_dialog"
        visible={confornation}
        onHide={() => setConfornation(false)}
        draggable={false}
        header="Assigned Freelancer Exposer"
      >
        <div className="delete_popup_wrapper">
          <div className="delete_popup_wrapper">
            <Row>
              <Col sm={6}>
                <div class="form_group mb-3">
                  <label>First Name</label>
                  <ReactSelectSingle
                    filter
                    value={popupCompanySelect}
                    options={PopupCompany}
                    onChange={e => {
                      statePopupCompanyChange(e);
                    }}
                    placeholder="Select Company"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <div class="form_group mb-3">
                  <label>Email Address</label>
                  <input
                    placeholder="Write email address"
                    class="p-inputtext p-component input_wrap"
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div class="form_group mb-3">
                  <label>Phone Number</label>
                  <input
                    placeholder="Write number"
                    class="p-inputtext p-component input_wrap"
                  />
                </div>
              </Col>
              <Col sm={12}>
                <div class="form_group mb-3">
                  <label>Address</label>
                  <input
                    placeholder="Write address"
                    class="p-inputtext p-component input_wrap"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <div class="form_group mb-3">
                  <label>Payment Type</label>
                  <ReactSelectSingle
                    filter
                    value={paymentTypeSelect}
                    options={PaymentType}
                    onChange={e => {
                      statePaymentTypeChange(e);
                    }}
                    placeholder="Select Company"
                  />
                </div>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col sm={6}>
                <div class="form_group mb-3">
                  <label>Amount</label>
                  <input
                    placeholder="Write Amount"
                    class="p-inputtext p-component input_wrap"
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="payable_wrap">
                  <h5>
                    Net Payable : <span>00.00</span>
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="delete_btn_wrap">
            <button className="btn_border_dark">Cancel</button>
            <button className="btn_primary">Add</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
