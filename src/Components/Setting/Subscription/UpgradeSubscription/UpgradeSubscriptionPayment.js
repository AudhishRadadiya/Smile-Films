import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import UpgradeSubscriptionPaymentForm from './UpgradeSubscriptionPaymentForm';

const stripePromise = loadStripe(
  'pk_test_51OyXpjSCn5rlGoEy1MJiy8apjitBVJhPEGY4nhdN20t8ZXRX3k8jO5yjVpcz2awCGLEdFu9Vbvqp94mOI4qLJufJ00lninY0kl',
);

const UpgradeSubscriptionPayment = () => {
  const { planId } = useParams();
  const options = {
    clientSecret: planId,
  };

  return (
    <>
      {planId && (
        <Elements stripe={stripePromise} options={options}>
          <UpgradeSubscriptionPaymentForm {...{ planId }} />
        </Elements>
      )}
    </>
  );
};

export default memo(UpgradeSubscriptionPayment);
