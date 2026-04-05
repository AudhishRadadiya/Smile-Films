import React, { memo, useEffect } from 'react';
import Loader from 'Components/Common/Loader';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getInquiryStep,
  setInquirySelectedProgressIndex,
} from 'Store/Reducers/ActivityOverview/inquirySlice';

const InquiryProgress = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { inquiryStepLoading, inquirySelectedProgressIndex } = useSelector(
    ({ inquiry }) => inquiry,
  );

  useEffect(() => {
    let payload = {
      inquiry_id: id,
    };
    dispatch(getInquiryStep(payload))
      .then(response => {
        let data = response.payload;
        let inquiryStep = data?.inquiry_step
          ? data?.inquiry_step === 3
            ? data?.inquiry_step
            : data?.inquiry_step + 1
          : 1;

        dispatch(setInquirySelectedProgressIndex(inquiryStep));
      })
      .catch(error => {
        console.error('Error fetching step data:', error);
      });
  }, [dispatch, id]);

  return (
    <div className="billing_heading">
      {inquiryStepLoading && <Loader />}
      <div className="processing_bar_wrapper">
        <div
          className={
            inquirySelectedProgressIndex === 1
              ? 'verifide_wrap current'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              inquirySelectedProgressIndex === 1
                ? 'm-0 active'
                : inquirySelectedProgressIndex === 2 ||
                  inquirySelectedProgressIndex === 3
                ? 'm-0 complete cursor_pointer'
                : 'm-0'
            }
            onClick={() => {
              if ([2, 3].includes(inquirySelectedProgressIndex)) {
                dispatch(setInquirySelectedProgressIndex(1));
              }
            }}
          >
            Inquiry
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            inquirySelectedProgressIndex === 2
              ? 'verifide_wrap current'
              : inquirySelectedProgressIndex === 1
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              inquirySelectedProgressIndex === 2
                ? 'm-0 active'
                : inquirySelectedProgressIndex === 3
                ? 'm-0 complete cursor_pointer'
                : 'm-0'
            }
            onClick={() => {
              if (inquirySelectedProgressIndex === 3) {
                dispatch(setInquirySelectedProgressIndex(2));
              }
            }}
          >
            Quotation
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            inquirySelectedProgressIndex === 3
              ? 'verifide_wrap current'
              : inquirySelectedProgressIndex === 2
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              inquirySelectedProgressIndex === 3 ? 'm-0 active' : 'm-0'
            }
            // onClick={() => {
            //   if ([4, 5, 6].includes(inquirySelectedProgressIndex)) {
            //     dispatch(setExposingSelectedProgressIndex(3));
            //   }
            // }}
          >
            Quotes Approve
          </h4>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};
export default memo(InquiryProgress);
