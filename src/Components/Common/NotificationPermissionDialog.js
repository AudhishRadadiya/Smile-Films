import React from 'react';
import NotificationIcon from '../../Assets/Images/notification-icon.svg';

const NotificationPermissionDialog = ({ onClose }) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white p-4 p-md-5 rounded-4 shadow-lg w-100"
        style={{ maxWidth: '480px' }}
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h3 className="d-flex align-items-center justify-content-center mb-3">
          <img src={NotificationIcon} alt="Notification" />
        </h3>

        <div className="px-2">
          <p className="text-center notification_content fw-medium">
            Notifications are currently <strong>blocked</strong> by your
            browser.
          </p>

          <ol className="mt-3 mb-4 ps-3 text-dark small">
            <li>Click the 🔒 icon near your browser’s address bar.</li>
            <li>
              Choose <strong>Site Settings</strong>.
            </li>
            <li>
              Find <strong>Notifications</strong> and set it to{' '}
              <strong>Allow</strong>.
            </li>
            <li>Refresh the page and try again.</li>
          </ol>

          <div className="d-flex justify-content-center gap-2">
            <button onClick={onClose} className="btn_primary btn btn-primary">
              Got it
            </button>
            <button onClick={onClose} className="btn_border_dark">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionDialog;
