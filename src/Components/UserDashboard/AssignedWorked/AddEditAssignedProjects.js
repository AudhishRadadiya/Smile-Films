import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import RightArrow from '../../../Assets/Images/white-right-arrow.svg';
import UserImg from '../../../Assets/Images/emp-img.jpg';
import { Link } from 'react-router-dom';
import { Editor } from 'primereact/editor';
import { TabView, TabPanel } from 'primereact/tabview';
import Wedding from './Wedding';
import PreWedding from './PreWedding';
import ReactSelectSingle from '../../Common/ReactSelectSingle';

export default function AddEditAssignedProjects() {
  const [text, setText] = useState('');
  const [receiveSelect, setReceiveSelect] = useState([]);

  const stateReceiveChange = e => {
    setReceiveSelect(e.value);
  };

  const Receive = [
    { label: 'Receipt', value: 'Receipt' },
    { label: 'Payment', value: 'Payment' },
  ];

  return (
    <div className="main_Wrapper">
      <div className="add_assign_projects_wrap bg-white radius15 border">
        <div className="add_assign_title p20 p15-xs border-bottom">
          <Row className="align-items-center gy-3">
            <Col lg={3}>
              <div className="title_right_wrapper">
                <ul className="justify-content-start">
                  <li className="search_mobile">
                    <div className="form_group">
                      <ReactSelectSingle
                        filter
                        value={receiveSelect}
                        options={Receive}
                        onChange={e => {
                          stateReceiveChange(e);
                        }}
                        placeholder="Select Group"
                      />
                    </div>
                  </li>
                  <li>
                    <h6 className="text_gray">Order No.</h6>
                    <h4 className="m-0">#564892</h4>
                  </li>
                  <li>
                    <h6 className="text_gray">Order No.</h6>
                    <h4 className="m-0">#564892</h4>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={9}>
              <div className="title_right_wrapper">
                <ul className="add_assign_ul">
                  <li>
                    <Link to="/conversation" className="btn_primary btn_right">
                      Group Chat
                      <img src={RightArrow} alt="RightArrowIcon" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/reporting" className="btn_primary btn_right">
                      Today’s Reporting
                      <img src={RightArrow} alt="RightArrowIcon" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/assigned-projects" className="btn_border_dark">
                      Exit Page
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="add_assign_inner p20 p15-xs">
          <Row className="g-4">
            <Col xs={12}>
              <div className="location_wrap">
                <TabView>
                  <TabPanel header="Wedding">
                    <Wedding />
                  </TabPanel>
                  <TabPanel header="Pre-wedding">
                    <PreWedding />
                  </TabPanel>
                </TabView>
              </div>
            </Col>
            <Col lg={6}>
              <div className="order-details-wrapper p10 border radius15 mb20">
                <div className="pb10 border-bottom">
                  <h6 className="m-0">Job</h6>
                </div>
                <div className="details_box pt10">
                  <div className="details_box_inner">
                    <div className="order-date">
                      <span>Items :</span>
                      <h5>Wedding Package, Reel, Teaser</h5>
                    </div>
                    <div className="order-date">
                      <span>Couple Name :</span>
                      <h5>Kapil & Krupa</h5>
                    </div>
                  </div>
                  <div className="details_box_inner">
                    <div className="order-date">
                      <span>Data Size :</span>
                      <h5>280 GB</h5>
                    </div>
                    <div className="order-date">
                      <span>Project Type :</span>
                      <h5>A</h5>
                    </div>
                    <div className="order-date">
                      <span>Due Date :</span>
                      <h5>16/07/2023</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="comment_box_wrap comment_main radius15 border mt-xl-0 mt-4">
                <div className="comment_box_title py15 px20 border-bottom">
                  <h6 className="m-0">Comments</h6>
                </div>
                <div className="comment_box_inner p15">
                  <ul>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="form_group mb-3">
                    <Editor
                      value={text}
                      onTextChange={e => setText(e.htmlValue)}
                      style={{ height: '80px' }}
                      placeholder="Write here"
                    />
                  </div>
                  <Button className="btn_primary">Comment</Button>
                </div>
                {/* <div class="quotation_save_data">
                  <h6>No Quotation saved</h6>
                </div> */}
              </div>
            </Col>
            <Col lg={6}>
              <div className="comment_box_wrap comment_main_wrap radius15 border mt-xl-0 mt-4">
                <div className="comment_box_title py15 px20 border-bottom">
                  <h6 className="m-0">Comments</h6>
                </div>
                <div className="comment_box_inner p15">
                  <h2 className="mb15">Wedding Works</h2>
                  <Link to="" className="text_light_Blue mb15 d-block">
                    https://www.example.nl.examplelogin.nl/mail/login/
                  </Link>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <ul>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="comment_img">
                        <img src={UserImg} alt="UserImg" />
                      </div>
                      <div className="comment_right">
                        <h5>
                          Rajesh Singhania
                          <span className="text_grey ms-1">6 day ago</span>
                        </h5>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </p>
                        <p>Lorem Ipsum is simply dummy text</p>
                      </div>
                    </li>
                  </ul>
                  <div className="form_group mb-3">
                    <Editor
                      value={text}
                      onTextChange={e => setText(e.htmlValue)}
                      style={{ height: '80px' }}
                      placeholder="Write here"
                    />
                  </div>
                  <Button className="btn_grey">Comment</Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
