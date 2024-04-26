import React from 'react';
import EditingProgress from './EditingProgress';
import EditingDataCollection from './EditingDataCollection';
import EditingQuotation from './EditingQuotation';
import EditingQuotesApprove from './EditingQuotesApprove';
import EditingAssign from './EditingAssign';
import EditingOverview from './EditingOverview';
import EditingCompleted from './EditingCompleted';
import { useSelector } from 'react-redux';
import EditingRework from './EditingRework';
import EditingReworkOverview from './EditingReworkOverview';
import EditingReworkCompleted from './EditingReworkCompleted';
const getEditingFlowComponent = index => {
  switch (index) {
    case 1:
      // case 7:
      return <EditingDataCollection />;
    case 2:
      return <EditingQuotation />;
    case 3:
      return <EditingQuotesApprove />;
    case 4:
      // case 1:
      return <EditingAssign />;
    case 5:
      return <EditingOverview />;
    case 6:
      // case 1:
      return <EditingCompleted />;
    case 7:
      // case 1:
      return <EditingRework />;
    case 8:
      return <EditingReworkOverview />;
    case 9:
      // case 1:
      return <EditingReworkCompleted />;

    default:
      return;
  }
};
export default function EditingFlow() {
  const { editingSelectedProgressIndex } = useSelector(
    ({ editing }) => editing,
  );
  return (
    <div className="main_Wrapper">
      <div className="edit_assign_wrap processing_main bg-white radius15 border">
        <EditingProgress />
        {getEditingFlowComponent(editingSelectedProgressIndex)}
      </div>
    </div>
  );
}
