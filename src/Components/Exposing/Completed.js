import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import CompleteIcon from '../../Assets/Images/complete-green.svg';

export default function Completed() {
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
            <div className="verifide_wrap">
              <h4 className="m-0 complete">Overview</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Completed</h4>
              <span className="line"></span>
            </div>
          </div>
        </div>
        <div className="billing_details">
          <div className="mb30">
            <div className="process_order_wrap p-0 pb-3">
              <Row className="align-items-center">
                <Col className="col-6">
                  <div className="back_page">
                    <div className="btn_as_text d-flex align-items-center">
                      <Link to="/overview">
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </Link>
                      <h2 className="m-0 ms-2 fw_500">Completed </h2>
                    </div>
                  </div>
                </Col>
                <Col className="col-6">
                  <div className="text-end">
                    <Link to="/exposing" className="btn_border_dark">
                      Exit Page
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="job_company mt-3">
              <Row className="gy-3">
                <Col lg={4}>
                  <div class="date_number mb-3 mb-lg-0">
                    <ul>
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
                <Col lg={4} md={6}>
                  <div className="order-details-wrapper p10 border radius15  mb-3 mb-md-0">
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
                <Col lg={4} md={6}>
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
          </div>
          <div className="completed_wrapper">
            <div className="complete_img text-center">
              <img src={CompleteIcon} alt="completeicon" />
              <h2>This Project is Completed</h2>
            </div>
            <div className="data-submit-wrapper">
              <h5>Data Submit</h5>
              <div className="data_inner">
                <Link to="/">
                  <p>
                    unknown+link&sca_esv=561605647&rlz=1C1VDKB_enIN1006IN1006&sxsrf=AB5stBhKPhOrPL2Qo0ExOjN7oZJsWmaTLg%3A1693480801841&ei=YXfwZJXrMsXa4-EPi6ucwAo&ved
                  </p>
                </Link>
                <div className="delete_btn_wrap justify-content-center text-center">
                  <button className="btn_border_dark me-2">Cancel</button>
                  <button className="btn_primary">Submit</button>
                </div>
              </div>
              <div className="request_send text-center">
                <button className="btn_yellow">
                  Send Confirmation Request{' '}
                </button>
                <h5 className="mb-0 mt-3 fw_400">
                  Get Data Received Confection From Client
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
