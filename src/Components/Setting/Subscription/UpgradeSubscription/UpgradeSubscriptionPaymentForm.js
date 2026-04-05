import React, { memo, useCallback, useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { REACT_APP_GLOBAL_URL } from 'Helper/Environment';
import { toast } from 'react-toastify';
import Loader from 'Components/Common/Loader';

const UpgradeSubscriptionPaymentForm = ({ planId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      if (!stripe || !elements || !planId) {
        return;
      }

      setLoading(true);
      try {
        const result = await stripe.confirmPayment({
          payment_intent: planId,
          elements,
          confirmParams: {
            // return_url: `http://localhost:3000/subscription-status`,
            return_url: `${REACT_APP_GLOBAL_URL}/subscription-status`,
          },
        });

        if (result.error) {
          setLoading(false);
          console.error('Payment failed:', result.error.message);
          if (result.error?.type === 'validation_error') {
            toast.error(result.error.message);
          } else if (result.error?.type === 'invalid_request_error') {
            toast.error(
              'We encountered an issue processing your payment. Please try again later.',
            );
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded!');
          }
        }
      } catch (err) {
        console.error('Error', err);
        setLoading(false);
      }
    },
    [stripe, elements, planId],
  );

  return (
    <>
      {loading && <Loader />}
      <div className="payment_main_wrapper subscription_pricing_main_wrap">
        <div className="payment_wrapper">
          <form className="text-center" onSubmit={handleSubmit}>
            <h1>Payment</h1>
            <PaymentElement />
            <button className="btn_primary" disabled={!stripe}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default memo(UpgradeSubscriptionPaymentForm);
