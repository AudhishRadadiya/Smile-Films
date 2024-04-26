import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function AuthLayout() {
  // ... perhaps some authentication logic to protect routes?
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
