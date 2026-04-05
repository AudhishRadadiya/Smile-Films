// import { clearToken, getAuthToken } from 'Helper/AuthTokenHelper';
// import { clearCurrentUser } from 'Store/Reducers/Auth/ProfileSlice';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const dispatch = useDispatch();
//   const { userPermissions } = useSelector(({ auth }) => auth);
//   const userData = getAuthToken();

//   /*  let userData = localStorage.getItem('UserPreferences');
//   if (userData) {
//     userData = JSON.parse(window?.atob(userData));
//   } */

//   const handleAccess = roleName => {
//     const userPermission = localStorage.getItem('UserPreferences');
//     if (userPermission) {
//       // Setting
//       //SubscriptionActivePlans
//       // if(roleName?.main_module === ''){
//       //   return {
//       //     is_create_access: true,
//       //     is_edit_access: true,
//       //     is_view_access: access?.view,
//       //     is_export_access: access?.export,
//       //     is_delete_access: access?.delete,
//       //   };
//       // }

//       const permissions =
//         userPermissions?.length > 0
//           ? userPermissions
//           : JSON?.parse(window?.atob(userPermission))?.permission;
//       const isMainModule = permissions?.find(
//         x =>
//           x?.name?.trim()?.toLowerCase() ==
//           roleName?.mainModule?.trim()?.toLowerCase(),
//       );
//       const access = isMainModule?.permission?.find(
//         x => x?.sub_module_key == roleName?.subModule,
//       );

//       if (access)
//         return {
//           is_create_access: access?.create,
//           is_edit_access: access?.edit,
//           is_view_access: access?.view,
//           is_export_access: access?.export,
//           is_delete_access: access?.delete,
//         };
//     }
//   };

//   // if (userData) {
//   //   return children;
//   // } else {
//   //   return <Navigate to="/" />;
//   // }
//   let hasAccess = {
//     is_create_access: false,
//     is_edit_access: false,
//     is_view_access: false,
//     is_export_access: false,
//     is_delete_access: false,
//   };
//   const role = children?.props?.role;
//   if (role) {
//     hasAccess = handleAccess(role) ? handleAccess(role) : hasAccess;
//   }

//   if (!userData) {
//     clearToken();
//     dispatch(clearCurrentUser());
//     return <Navigate to="/" replace={true} />;
//   } else if (
//     window.location.pathname === '/subscription-plans' ||
//     window.location.pathname?.includes('/payment')
//   ) {
//     if (!userData?.isSubscriptionActive) {
//       return React.cloneElement(children, { hasAccess, ...children.props });
//     }
//     //return <Navigate to="/home" replace={true} />;
//   }
//   return userData?.isSubscriptionActive ? (
//     hasAccess?.is_view_access ? (
//       // <children.type hasAccess={hasAccess} {...children[1].props} />
//       React.cloneElement(children, { hasAccess, ...children.props })
//     ) : (
//       <Navigate to="/access-denied" replace={true} />
//     )
//   ) : userData?.isSubscriptionActive ? (
//     <Navigate to="/home" replace={true} />
//   ) : (
//     <Navigate to="/subscription-plans" replace={true} />
//   );
// };

// export default PrivateRoute;

/*-----------------------------------------------------------------------*/

import { clearToken, getAuthToken } from 'Helper/AuthTokenHelper';
import { checkPermissionForLandingPage } from 'Helper/CommonHelper';
import { clearCurrentUser } from 'Store/Reducers/Auth/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const userData = getAuthToken();

  const role = children?.props?.role;
  const currentPath = window.location.pathname;

  let hasAccess = {
    is_create_access: false,
    is_edit_access: false,
    is_view_access: false,
    is_export_access: false,
    is_delete_access: false,
  };

  const { userPermissions } = useSelector(({ auth }) => auth);

  const handleAccess = roleName => {
    const userPermission = localStorage.getItem('UserPreferences');
    if (userPermission) {
      const permissions =
        userPermissions?.length > 0
          ? userPermissions
          : JSON?.parse(window?.atob(userPermission))?.permission;

      const isMainModule = permissions?.find(
        x =>
          x?.name?.trim()?.toLowerCase() ===
          roleName?.mainModule?.trim()?.toLowerCase(),
      );
      const access = isMainModule?.permission?.find(
        x => x?.sub_module_key === roleName?.subModule,
      );

      if (access)
        return {
          is_create_access: access?.create,
          is_edit_access: access?.edit,
          is_view_access: access?.view,
          is_export_access: access?.export,
          is_delete_access: access?.delete,
        };
    }
  };

  if (role) {
    hasAccess = handleAccess(role) ? handleAccess(role) : hasAccess;
  }

  if (!userData) {
    clearToken();
    dispatch(clearCurrentUser());
    return <Navigate to="/" replace={true} />;
  } else if (
    userData?.isSubscriptionActive &&
    (currentPath === '/subscription-plans' || currentPath === '/payment')
  ) {
    const checkedPermissionData = checkPermissionForLandingPage(userData);
    return <Navigate to={checkedPermissionData?.path} replace={true} />;
  } else if (
    !userData?.isSubscriptionActive &&
    currentPath !== '/subscription-plans' &&
    !currentPath?.includes('/payment')
  ) {
    return <Navigate to="/subscription-plans" replace={true} />;
  }

  // if (!userData) {
  //   clearToken();
  //   dispatch(clearCurrentUser());
  //   return <Navigate to="/" replace={true} />;
  // } else if (
  //   userData?.isSubscriptionActive &&
  //   (window.location.pathname === '/subscription-plans' ||
  //     window.location.pathname === '/payment')
  // ) {
  //   return <Navigate to="/home" replace={true} />;
  // }

  return hasAccess?.is_view_access ? (
    // React.cloneElement(children, { hasAccess, ...children.props })
    <children.type hasAccess={hasAccess} roleData={children?.props} />
  ) : (
    <Navigate to="/access-denied" replace={true} />
  );
};

export default PrivateRoute;
