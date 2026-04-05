import React, { useCallback, useEffect, useState } from 'react';
import CompanySidebar from './CompanySidebar';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { getSubscriptionStatusList } from 'Store/Reducers/Settings/Master/SubscriptionStatusSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function SubscriptionStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptionStatusList, subscriptionStatusLoading } = useSelector(
    ({ subscriptionStatus }) => subscriptionStatus,
  );

  const getSubscriptionPlanHandler = useCallback(() => {
    dispatch(getSubscriptionStatusList());
  }, [dispatch]);

  useEffect(() => {
    getSubscriptionPlanHandler();
  }, []);

  return (
    <div className="main_Wrapper">
      {subscriptionStatusLoading && <Loader />}
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap">
          <div className="table_main_Wrapper">
            <div className="top_filter_wrap">
              <Row className="align-items-center gy-2">
                <Col xs={6}>
                  <div className="page_title">
                    <h3 className="m-0">Subscription</h3>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="right_filter_wrapper">
                    <ul className="justify-content-end">
                      <li className="p-0">
                        <Button
                          className="btn_primary"
                          // onClick={() => navigate('/subscription-plans')}
                          onClick={() =>
                            navigate('/upgrade-subscription-plans')
                          }
                        >
                          Upgrade Plan
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="p20 p15-xs">
              <div className="border radius15 p20">
                <h4>Current Active Plan</h4>
                <Row className="align-items-center g-3 mb-3">
                  <Col xs={6}>
                    <h2 className="m-0">{subscriptionStatusList?.plan_name}</h2>
                  </Col>
                  <Col xs={6} className="text-end">
                    <h5 className="text_red">Expiry Date</h5>
                    <h5>
                      {moment(subscriptionStatusList?.due_date)?.format(
                        'DD/MM/YYYY',
                      )}
                    </h5>
                  </Col>
                </Row>
                <div className="subscription_detail_wrap pt20 border-top">
                  <Row className="g-3">
                    <Col xxl={2} md={3} xs={6}>
                      <h5 className="text_grey">Payment Type</h5>
                      <h5>Online</h5>
                    </Col>
                    <Col xxl={2} md={3} xs={6}>
                      <h5 className="text_grey">Business Unit</h5>
                      <h5>{subscriptionStatusList?.company_name}</h5>
                    </Col>

                    <Col xxl={2} md={3} xs={6}>
                      <h5 className="text_grey">Duration</h5>
                      <h5>{subscriptionStatusList?.duration}</h5>
                    </Col>
                    <Col xxl={2} md={3} xs={6}>
                      <h5 className="text_grey">Joining date</h5>
                      <h5>
                        {moment(
                          subscriptionStatusList?.subscription_start_date,
                        )?.format('DD/MM/YYYY')}
                      </h5>
                    </Col>
                    {/* <Col xxl={2} md={3} xs={6}>
                      <h5 className="text_grey">Due date</h5>
                      <h5>13/04/2024</h5>
                    </Col> */}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
