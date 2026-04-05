import React from 'react';
import CompanySidebar from './CompanySidebar';

export default function Setting({ hasAccess }) {
  return (
    <div className="main_Wrapper">
      <div className="setting_main_wrap">
        <CompanySidebar />
        <div className="setting_right_wrap"></div>
      </div>
    </div>
  );
}
