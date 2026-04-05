import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation, useParams } from 'react-router-dom';

const stripePromise = loadStripe(
  'pk_test_51OyXpjSCn5rlGoEy1MJiy8apjitBVJhPEGY4nhdN20t8ZXRX3k8jO5yjVpcz2awCGLEdFu9Vbvqp94mOI4qLJufJ00lninY0kl',
);

const Payment = () => {
  const { planId } = useParams();
  const options = {
    clientSecret: planId,
  };

  return (
    <>
      {planId && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm {...{ planId }} />
        </Elements>
      )}
    </>
  );
};

export default Payment;
