import React, { useEffect } from 'react';
import UpdateInquity from './UpdateInquity';
import { useParams } from 'react-router-dom';
import InquiryProgress from './InquiryProgress';
import { useDispatch, useSelector } from 'react-redux';
import ExQuotationInquiryFlow from './Exposing/ExQuotationInquiryFlow';
import ExQuotesApproveInquiryFlow from './Exposing/ExQuotesApproveInquiryFlow';
import EditingQuotationInquiryFlow from './Editing/EditingQuotationInquiryFlow';
import EditingQuotesApproveInquiryFlow from './Editing/EditingQuotesApproveInquiryFlow';
import {
  getInquiry,
  setSelectedInquiryFlowData,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import Loader from 'Components/Common/Loader';

const getInquiryFlowComponent = (index, selectedInquiryData) => {
  switch (index) {
    case 1:
      return Object.keys(selectedInquiryData)?.length && <UpdateInquity />;
    case 2:
      return (
        Object.keys(selectedInquiryData)?.length &&
        (selectedInquiryData?.inquiry_type === 1 ? (
          <EditingQuotationInquiryFlow />
        ) : (
          <ExQuotationInquiryFlow />
        ))
      );
    case 3:
      return (
        Object.keys(selectedInquiryData)?.length &&
        (selectedInquiryData?.inquiry_type === 1 ? (
          <EditingQuotesApproveInquiryFlow />
        ) : (
          <ExQuotesApproveInquiryFlow />
        ))
      );
    default:
      return;
  }
};

export default function InquiryFlow() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    inquiryLoading,
    selectedInquiryFlowData,
    inquirySelectedProgressIndex,
  } = useSelector(({ inquiry }) => inquiry);

  useEffect(() => {
    dispatch(getInquiry({ inquiry_id: id }))
      .then(response => {
        const inquiryResponse = response.payload;
        dispatch(setSelectedInquiryFlowData(inquiryResponse));
        return { inquiryResponse };
      })
      .catch(error => {
        console.error('Error fetching inquiry data:', error);
      });
  }, [dispatch, id]);

  return (
    <>
      {inquiryLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="edit_assign_wrap processing_main bg-white radius15 border">
          <InquiryProgress />
          {getInquiryFlowComponent(
            inquirySelectedProgressIndex,
            selectedInquiryFlowData,
          )}
        </div>
      </div>
    </>
  );
}
