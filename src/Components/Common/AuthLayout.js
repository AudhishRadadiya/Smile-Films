import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useParams } from 'react-router-dom';

export default function AuthLayout() {
  const { planId } = useParams();

  // ... perhaps some authentication logic to protect routes?
  return (
    <>
      {window.location.pathname !== '/subscription-plans' &&
        !window.location.pathname?.includes(`/payment/${planId}`) && <Header />}
      {/* !window.location.pathname !== '/payment' && <Header /> */}
      <Outlet />
    </>
  );
}
