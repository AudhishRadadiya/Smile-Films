import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StarBorder from '../../Assets/Images/star-border.png';
import BussinesIcon from '../../Assets/Images/bussiness-icon.png';
// import StarBackground from '../../Assets/Images/star-bg.png';
// import PayaBles from '../../Assets/Images/payables-icon.png';
// import ReceIvables from '../../Assets/Images/receivables-icon.png';
// import FavoritesIcon from '../../Assets/Images/favorites_title_icon.png';
// import paymentsReceived from '../../Assets/Images/payments-received-icon.png';
// import ProjectsTimesheet from '../../Assets/Images/projects-and-timesheet-icon.png';
// import EmployeePerformance from '../../Assets/Images/employee-performance-icon.png';

const Reports = () => {
  return (
    <div className="main_Wrapper overflow-auto">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="page_title">
                <h3 className="m-0">Reports</h3>
              </div>
            </Col>
          </Row>
        </div>
        <div className="overflow-auto main_data_Wrapper">
          {/* <div className="favorite_list_contant ">
            <div className="favorite_title d-flex align-items-center justify-content-sm-start justify-content-center ">
              <div className="favorite_title_img">
                <img src={FavoritesIcon} alt="" className="w-100 h-100" />
              </div>
              <h3 className="m-0 favorites_title">Favorites</h3>
            </div>
            <div className="favorite_content">
              <Row>
                <Col lg={3} md={4} sm={6} className="favorite_list">
                  <div className="favorite_list_item d-flex align-items-center justify-content-sm-start justify-content-center ">
                    <div className="favorite_image">
                      <img
                        src={StarBackground}
                        alt=""
                        className="w-100 h-100"
                      />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </div> */}
          <div className="reports_page_area">
            <Row>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center">
                  <div className="title_img d-flex align-items-center">
                    <img src={BussinesIcon} alt="" />
                  </div>
                  <h3 className="m-0 ">Business Overview</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/account-ledger'} className="list_name">
                      Ledger
                    </Link>
                  </div>
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>

                    <Link to={'/balance-sheet'} className="list_name">
                      Balance Sheet
                    </Link>
                  </div>
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>

                    <Link to={'/trading'} className="list_name">
                      Trading
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center">
                  <div className="title_img d-flex align-items-center"></div>
                  <h3 className="m-0 ">{''}</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/billing'} className="list_name">
                      Invoices
                    </Link>
                  </div>
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>

                    <Link to={'/receipt-payment'} className="list_name">
                      Receipt & Payment
                    </Link>
                  </div>
                </div>
              </Col>
              {/* <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={ReceIvables} alt="" />
                  </div>
                  <h3 className="m-0 ">Receivables</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={PayaBles} alt="" />
                  </div>
                  <h3 className="m-0 ">Payables</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={paymentsReceived} alt="" />
                  </div>
                  <h3 className="m-0 ">Payments Received</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={ProjectsTimesheet} alt="" />
                  </div>
                  <h3 className="m-0 ">Purchases and Expenses</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={EmployeePerformance} alt="" />
                  </div>
                  <h3 className="m-0 ">Projects and Timesheet</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={4} sm={6} className="menu_list_partition ">
                <div className="list_title d-flex align-items-center justify-content-sm-start justify-content-center ">
                  <div className="title_img d-flex align-items-center">
                    <img src={BussinesIcon} alt="" />
                  </div>
                  <h3 className="m-0 ">Employee Performance</h3>
                </div>
                <div className="list_menu">
                  <div className="list_icon d-flex align-items-baseline justify-content-sm-start justify-content-center ">
                    <div className="star_icon">
                      <img src={StarBorder} alt="" className="w-100 h-100 " />
                    </div>
                    <Link to={'/profit-loss'} className="list_name">
                      Profit & Loss
                    </Link>
                  </div>
                </div>
              </Col> */}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
