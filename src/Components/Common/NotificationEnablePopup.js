import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import NotificationIcon from '../../Assets/Images/notification-icon.svg';
import Cookies from 'js-cookie';
import {
  notificationSubscribe,
  setAllowNotificationToggle,
} from 'Store/Reducers/Notification/NotificationSlice';

const NotificationEnablePopup = ({ closeToast, data }) => {
  const dispatch = useDispatch();

  const handleAllowPermission = useCallback(async () => {
    const res = await dispatch(notificationSubscribe());

    if (res) {
      dispatch(setAllowNotificationToggle(true));
      closeToast();
    }
  }, [closeToast, dispatch]);

  return (
    <div
      className="d-flex flex-column w-100 notification-modal"
      onClick={e => e.stopPropagation()} // Prevent toast from closing when clicking inside
    >
      <h3 className="d-flex align-items-center justify-content-center">
        <img src={NotificationIcon} alt="" />
      </h3>

      <div className="ps-3 mt-2">
        <p className="text-center notification_content">{data.content}</p>

        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={handleAllowPermission}
            className="btn_primary btn btn-primary"
          >
            Allow
          </button>
          <button
            onClick={() => {
              Cookies.set('notificationPermissionNotAllow', true, {
                expires: 12,
              });
              closeToast();
            }}
            className="btn_border_dark "
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NotificationEnablePopup);
