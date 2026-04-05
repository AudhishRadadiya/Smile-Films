import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkPermissionForLandingPage } from 'Helper/CommonHelper';

const PublicRoute = ({ children }) => {
  let userData = localStorage.getItem('UserPreferences');
  if (userData) {
    userData = JSON.parse(window?.atob(userData));
  }
  if (!userData) {
    return children;
  } else {
    const checkedPermissionData = checkPermissionForLandingPage(userData);
    return <Navigate to={checkedPermissionData?.path} />;
  }
};

export default PublicRoute;
