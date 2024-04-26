import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from 'Components/Common/Loader';
import {
  getExposingStep,
  setExposingSelectedProgressIndex,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';

const ExposingProgress = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    exposingSelectedProgressIndex,
    getExposingStepData,
    exposingStepLoading,
  } = useSelector(({ exposing }) => exposing);

  useEffect(() => {
    let payload = {
      order_id: id,
    };
    dispatch(getExposingStep(payload))
      .then(response => {
        let data = response.payload;
        let step = data?.step
          ? data?.step === 6
            ? data?.step
            : data?.step + 1
          : 1;

        dispatch(setExposingSelectedProgressIndex(step));
      })
      .catch(error => {
        console.error('Error fetching step data:', error);
      });
  }, [dispatch, id]);

  return (
    <div className="billing_heading">
      {exposingStepLoading && <Loader />}
      <div className="processing_bar_wrapper">
        <div
          className={
            exposingSelectedProgressIndex === 1
              ? 'verifide_wrap current'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 1
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 2 ||
                  exposingSelectedProgressIndex === 3 ||
                  exposingSelectedProgressIndex === 4 ||
                  exposingSelectedProgressIndex === 5 ||
                  exposingSelectedProgressIndex === 6
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Order Form
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            exposingSelectedProgressIndex === 2
              ? 'verifide_wrap current'
              : exposingSelectedProgressIndex === 1
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 2
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 3 ||
                  exposingSelectedProgressIndex === 4 ||
                  exposingSelectedProgressIndex === 5 ||
                  exposingSelectedProgressIndex === 6
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Quotation
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            exposingSelectedProgressIndex === 3
              ? 'verifide_wrap current'
              : exposingSelectedProgressIndex === 2
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 3
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 4 ||
                  exposingSelectedProgressIndex === 5 ||
                  exposingSelectedProgressIndex === 6
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Quotes Approve
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            exposingSelectedProgressIndex === 4
              ? 'verifide_wrap current'
              : exposingSelectedProgressIndex === 3
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 4
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 5 ||
                  exposingSelectedProgressIndex === 6
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Assign to Exposer
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            exposingSelectedProgressIndex === 5
              ? 'verifide_wrap current'
              : exposingSelectedProgressIndex === 4
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 5
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 6
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Overview
          </h4>
          <span className="line"></span>
        </div>
        <div
          className={
            exposingSelectedProgressIndex === 6
              ? 'verifide_wrap current'
              : exposingSelectedProgressIndex === 5
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              exposingSelectedProgressIndex === 6
                ? 'm-0 active'
                : exposingSelectedProgressIndex === 7 ||
                  exposingSelectedProgressIndex === 8 ||
                  exposingSelectedProgressIndex === 9
                ? 'm-0 complete'
                : 'm-0'
            }
          >
            Completed
          </h4>
          <span className="line"></span>
        </div>

        {/* {getExposingStepData?.is_rework && (
          <>
            <div
              className={
                exposingSelectedProgressIndex === 7
                  ? 'verifide_wrap current'
                  : exposingSelectedProgressIndex === 6
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  exposingSelectedProgressIndex === 7
                    ? 'm-0 active'
                    : exposingSelectedProgressIndex === 8 ||
                      exposingSelectedProgressIndex === 9
                    ? 'm-0 complete'
                    : 'm-0'
                }
              >
                Rework
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                exposingSelectedProgressIndex === 8
                  ? 'verifide_wrap current'
                  : exposingSelectedProgressIndex === 7
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  exposingSelectedProgressIndex === 8
                    ? 'm-0 active'
                    : exposingSelectedProgressIndex === 9
                    ? 'm-0 complete'
                    : 'm-0'
                }
              >
                Overview
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                exposingSelectedProgressIndex === 9
                  ? 'verifide_wrap current'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  exposingSelectedProgressIndex === 9 ? 'm-0 active' : 'm-0'
                }
              >
                Complete
              </h4>
              <span className="line"></span>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};
export default memo(ExposingProgress);
