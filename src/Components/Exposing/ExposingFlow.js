import React from 'react';
import { useSelector } from 'react-redux';
import ExposingProgress from './ExposingProgress';
import ExposingOrderForm from './ExposingOrderForm';
import ExpAssignToExposer from './ExpAssignToExposer';
import ExposingOverview from './ExposingOverview';
import ExposingCompleted from './ExposingCompleted';
import ExposingQuotation from './ExposingQuotation';
import ExposingQuotesApprove from './ExposingQuotesApprove';

const getEditingFlowComponent = index => {
  switch (index) {
    case 1:
      return <ExposingOrderForm />;
    case 2:
      return <ExposingQuotation />;
    case 3:
      return <ExposingQuotesApprove />;
    case 4:
      return <ExpAssignToExposer />;
    case 5:
      return <ExposingOverview />;
    case 6:
      return <ExposingCompleted />;
    default:
      return;
  }
};

export default function ExposingFlow() {
  const { exposingSelectedProgressIndex } = useSelector(
    ({ exposing }) => exposing,
  );
  return (
    <div className="main_Wrapper">
      <div className="edit_assign_wrap processing_main bg-white radius15 border">
        <ExposingProgress />
        {getEditingFlowComponent(exposingSelectedProgressIndex)}
      </div>
    </div>
  );
}
