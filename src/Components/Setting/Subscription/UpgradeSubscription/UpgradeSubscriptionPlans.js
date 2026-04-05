import React, { memo, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import {
  setSelectedPlan,
  trialSubscription,
  createSubscription,
  getSubscriptionPlanList,
} from 'Store/Reducers/Settings/Subscription/SubscriptionPlanSlice';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from 'Helper/AuthTokenHelper';
import { Dialog } from 'primereact/dialog';

const UpgradeSubscriptionPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = getAuthToken();

  const [showPopup, setShowPopup] = useState(false);
  const [subscriptionSelectedPlan, setSubscriptionSelectedPlan] =
    useState(null);

  const { subscriptionPlanList, subscriptionPlanLoading } = useSelector(
    ({ subscriptionPlans }) => subscriptionPlans,
  );

  const getSubscriptionPlanHandler = useCallback(async () => {
    if (userData?.role === 1 || userData?.role === 2) {
      dispatch(
        getSubscriptionPlanList({
          isActive: '',
          start: 0,
          limit: 0,
        }),
      );
    }
  }, [dispatch, userData]);

  useEffect(() => {
    getSubscriptionPlanHandler();
  }, []);

  const handleContinue = async e => {
    e.preventDefault();
    if (
      subscriptionSelectedPlan &&
      subscriptionSelectedPlan?.name === 'Trial'
    ) {
      const { payload } = await dispatch(
        trialSubscription({
          subscription_id: subscriptionSelectedPlan?._id,
        }),
      );
      if (payload?.data?.err === 0) {
        navigate('/subscription-status');
      }
    } else {
      const response = await dispatch(
        createSubscription({ subscription_id: subscriptionSelectedPlan?._id }),
      );
      const clientSecret = response?.payload?.data?.clientSecret;
      if (clientSecret) {
        navigate(`/upgrade-subscription-payment/${clientSecret}`);
      }
    }
  };

  const handleSelectPlan = plan => {
    setSubscriptionSelectedPlan(plan);
    dispatch(setSelectedPlan(plan));
  };

  const handleBack = e => {
    navigate('/subscription-status');
  };

  useEffect(() => {
    if (userData?.role === 3 || userData?.role === 4) {
      setShowPopup(true);
    }
  }, [userData]);

  return (
    <>
      {showPopup ? (
        <Dialog
          visible={showPopup}
          onHide={() => setShowPopup(false)}
          header="Subscription Information"
          closable={false}
        >
          <div>
            <p>Please contact your admin.</p>
          </div>
          <div className="p-d-flex p-jc-end">
            <Button
              className="btn_border_dark mx-1"
              onClick={e => handleBack(e)}
            >
              Go Back
            </Button>
          </div>
        </Dialog>
      ) : (
        <div className="subscription_pricing_main_wrap">
          {subscriptionPlanLoading && <Loader />}
          <div className="subscription_wrap text-center">
            <h1 className="text_light mb-xxl-5 mb-3">Subscription Plans</h1>
            <p className="text_light mb-5">
              Choose a plan that’s right for you{' '}
            </p>
            <div className="subscription_plan_wrap">
              <Row className="g-3 justify-content-lg-start justify-content-center">
                {subscriptionPlanList?.list?.length > 0 &&
                  subscriptionPlanList?.list
                    ?.filter(plan => plan.isActive === true)
                    .map((plan, key) => (
                      <Col lg={4} sm={6} key={`plan_list_${key}`}>
                        <Card className="subscription_plan_box">
                          <h2 className="plan_title">
                            <span>{plan.name}</span>
                          </h2>
                          <h1>₹{plan.price}</h1>
                          <h3 className="text_light">
                            The Duration of this plan is {plan.duration} Months
                          </h3>
                          <Button
                            className="btn_primary w-100"
                            onClick={() => handleSelectPlan(plan)}
                            disabled={
                              userData?.isTrailUsed && plan?.name === 'Trial'
                            }
                          >
                            {subscriptionSelectedPlan?._id === plan?._id ||
                            (userData?.isTrailUsed && plan?.name === 'Trial')
                              ? 'Selected'
                              : 'Select plan'}
                          </Button>
                        </Card>
                      </Col>
                    ))}
              </Row>
              <div className="btn_group mt50">
                <Button
                  className="btn_border_dark mx-1"
                  onClick={e => handleBack(e)}
                >
                  Go Back
                </Button>
                <Button
                  className="btn_primary mx-1"
                  onClick={e => handleContinue(e)}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(UpgradeSubscriptionPlans);
