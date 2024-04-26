import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ProfileImg from '../../Assets/Images/profile-img.svg';
import InfoIcon from '../../Assets/Images/Info-icon.svg';

export const QuotationData = [
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
    date_size: '280 GB',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
    date_size: '280 GB',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
    date_size: '280 GB',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
    date_size: '280 GB',
  },
  {
    item_name: 'Tradition-Photo',
    quantity: '1',
    event_date: '28/08/2023',
    date_size: '280 GB',
  },
];

export default function Overview() {
  const [confornation, setConfornation] = useState(false);

  const ConfectionTemplet = () => {
    return (
      <div className="assigned_exposer">
        <Button className="btn_as_text" onClick={() => setConfornation(true)}>
          <div className="confection_text">
            <img src={InfoIcon} alt="InfoIcon" />
            <h6 className="m-0 text_yellow">
              Please Give Confirmation that you Received Data
            </h6>
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
          </div>
        </li>
      </ul>
    );
  };

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
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Assign to Exposer</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Overview</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap next">
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
                    <div className="btn_as_text d-flex align-items-center">
                      <Link to="/assign-to-exposer">
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </Link>
                      <h2 className="m-0 ms-2 fw_500">Overview</h2>
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
              <Column field="date_size" header="Date Size" sortable></Column>
              <Column
                field="assigned_freelancer_exposer"
                header="Assigned Freelancer Exposer"
                sortable
                body={ConfectionTemplet}
              ></Column>
            </DataTable>
          </div>
          <div class="delete_btn_wrap mt-4 p-0 text-end">
            <Link to="/exposing" class="btn_border_dark">
              Exit Page
            </Link>
            <Link to="/completed" class="btn_primary">
              Save
            </Link>
          </div>
        </div>
      </div>

      {/* conformation popup */}
      <Dialog
        className="modal_Wrapper conformation_dialog"
        visible={confornation}
        onHide={() => setConfornation(false)}
        draggable={false}
        header="Data Received Confirmation"
      >
        <div className="delete_popup_wrapper conformation_wrapper">
          <div class="details_box pt10">
            <div class="details_box_inner">
              <div class="order-date">
                <h5>Employee Name :</h5>
                <h4>Divyesh</h4>
              </div>
              <div class="order-date">
                <h5>Order No :</h5>
                <h4>#56123</h4>
              </div>
              <div class="order-date">
                <h5>Event Date :</h5>
                <h4>27/07/2003</h4>
              </div>
            </div>
            <div class="details_box_inner">
              <div class="order-date">
                <h5>Item Name :</h5>
                <h4>Wireless</h4>
              </div>
              <div class="order-date">
                <h5>Quantity :</h5>
                <h4>1</h4>
              </div>
              <div class="order-date">
                <h5>Data Size :</h5>
                <h4>500 GB</h4>
              </div>
            </div>
          </div>
          <div className="conformation_msg">
            <p>
              Please confirm that you've received all the data for this order.
              from your Employee, Click <span>'Confirm'</span> if you've
              received the data.
            </p>
          </div>
          <div className="delete_btn_wrap justify-content-center">
            <button className="btn_border_dark me-2">Cancel</button>
            <button className="btn_green">Confirmed</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
