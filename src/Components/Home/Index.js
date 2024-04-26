import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Logo from '../../Assets/Images/logo.svg';
import DashbordIcon from '../../Assets/Images/dashboard-icon.svg';
import InquairyIcon from '../../Assets/Images/inquiry-icon.svg';
import DataCollectionIcon from '../../Assets/Images/data-collection-icon.svg';
import EditingIcon from '../../Assets/Images/editing-icon.svg';
import ExposingIcon from '../../Assets/Images/exposing-icon.svg';
import ProjectStatesIcon from '../../Assets/Images/project-states-icon.svg';
import BillingIcon from '../../Assets/Images/billing-icon.svg';
import ReceiptPaymentIcon from '../../Assets/Images/receipt-payment-icon.svg';
import CalanderIcon from '../../Assets/Images/calander-icon.svg';

export default function Homepage() {
  let UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) {
    UserPreferences = JSON.parse(window?.atob(UserPreferences));
  }
  let path =
    UserPreferences?.role === 1 || UserPreferences?.role === 2
      ? '/dashboard'
      : UserPreferences?.role === 3
      ? '/user-dashboard'
      : '/client-dashboard';

  return (
    <div>
      <div className="home_main_wrapper">
        <Row className="justify-content-between">
          <Col xl={5} lg={7} className="order-lg-0 order-1">
            <div className="home-right-wrappre">
              <Row>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to={path}>
                      <img src={DashbordIcon} alt="" />
                      <h4 className="mt-2">Dashboard</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/inquiry">
                      <img src={InquairyIcon} alt="" />
                      <h4 className="mt-2">Inquiry</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/data-collection">
                      <img src={DataCollectionIcon} alt="" />
                      <h4 className="mt-2">Data Collection</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/editing">
                      <img src={EditingIcon} alt="" />
                      <h4 className="mt-2">Editing</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/exposing">
                      <img src={ExposingIcon} alt="" />
                      <h4 className="mt-2">Exposing</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/project-status">
                      <img src={ProjectStatesIcon} alt="" />
                      <h4 className="mt-2">Project Status</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/billing">
                      <img src={BillingIcon} alt="" />
                      <h4 className="mt-2">Billing</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/receipt-payment">
                      <img src={ReceiptPaymentIcon} alt="" />
                      <h4 className="mt-2">Receipt / Payment</h4>
                    </Link>
                  </div>
                </Col>
                <Col sm={4} className="col-6">
                  <div className="home-icon-wrap text-center mb30">
                    <Link to="/calender-view">
                      <img src={CalanderIcon} alt="" />
                      <h4 className="mt-2">Calendar View</h4>
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={3}>
            <div className="homr_logo text-end">
              <img src={Logo} alt="" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
