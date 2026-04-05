import React, { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from 'Components/Common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStep,
  setEditingSelectedProgressIndex,
  setGetStepData,
} from '../../../Store/Reducers/Editing/EditingFlow/EditingSlice';

const EditingProgress = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { editingSelectedProgressIndex, getStepData, stepLoading } =
    useSelector(({ editing }) => editing);

  useEffect(() => {
    let payload = {
      order_id: id,
    };
    dispatch(getStep(payload))
      .then(response => {
        let data = response.payload;
        // let step = data?.step ? data?.step : 1;
        let step = data?.step
          ? data?.step === 9
            ? data?.step
            : data?.step === 5 && data?.is_rework === true
            ? data?.step + 1
            : data?.step > 5 && data?.is_rework === false
            ? data?.step
            : data?.step + 1
          : 1;

        dispatch(setEditingSelectedProgressIndex(step));
      })
      .catch(error => {
        console.error('Error fetching step data:', error);
      });

    return () => {
      dispatch(setGetStepData({}));
    };
  }, [dispatch, id]);

  return (
    <div className="billing_heading">
      {stepLoading && <Loader />}
      <div className="processing_bar_wrapper">
        {getStepData?.is_rework === false && (
          <>
            <div
              className={
                editingSelectedProgressIndex === 1
                  ? 'verifide_wrap current'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 1
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 2 ||
                      editingSelectedProgressIndex === 3 ||
                      editingSelectedProgressIndex === 4 ||
                      editingSelectedProgressIndex === 5 ||
                      editingSelectedProgressIndex === 6
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if ([2, 3, 4, 5, 6].includes(editingSelectedProgressIndex)) {
                    dispatch(setEditingSelectedProgressIndex(1));
                  }
                }}
              >
                Data Collection
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 2
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 1
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 2
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 3 ||
                      editingSelectedProgressIndex === 4 ||
                      editingSelectedProgressIndex === 5 ||
                      editingSelectedProgressIndex === 6
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if ([3, 4, 5, 6].includes(editingSelectedProgressIndex)) {
                    dispatch(setEditingSelectedProgressIndex(2));
                  }
                }}
              >
                Quotation
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 3
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 2
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 3
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 4 ||
                      editingSelectedProgressIndex === 5 ||
                      editingSelectedProgressIndex === 6
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if ([4, 5, 6].includes(editingSelectedProgressIndex)) {
                    dispatch(setEditingSelectedProgressIndex(3));
                  }
                }}
              >
                Quotes Approve
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 4
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 3
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 4
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 5 ||
                      editingSelectedProgressIndex === 6
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if ([5, 6].includes(editingSelectedProgressIndex)) {
                    dispatch(setEditingSelectedProgressIndex(4));
                  }
                }}
              >
                Assign to Editor
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 5
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 4
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 5
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 6
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if (editingSelectedProgressIndex === 6) {
                    dispatch(setEditingSelectedProgressIndex(5));
                  }
                }}
              >
                Overview
              </h4>
              <span className="line"></span>
            </div>
          </>
        )}
        <div
          className={
            editingSelectedProgressIndex === 6
              ? 'verifide_wrap current'
              : editingSelectedProgressIndex === 5
              ? 'verifide_wrap next'
              : 'verifide_wrap'
          }
        >
          <h4
            className={
              editingSelectedProgressIndex === 6
                ? 'm-0 active'
                : editingSelectedProgressIndex === 7 ||
                  editingSelectedProgressIndex === 8 ||
                  editingSelectedProgressIndex === 9
                ? 'm-0 complete cursor_pointer'
                : 'm-0'
            }
            onClick={() => {
              if ([7, 8, 9].includes(editingSelectedProgressIndex)) {
                dispatch(setEditingSelectedProgressIndex(6));
              }
            }}
          >
            Completed
          </h4>
          <span className="line"></span>
        </div>

        {getStepData?.is_rework && (
          <>
            <div
              className={
                editingSelectedProgressIndex === 7
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 6
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 7
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 8 ||
                      editingSelectedProgressIndex === 9
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if ([8, 9].includes(editingSelectedProgressIndex)) {
                    dispatch(setEditingSelectedProgressIndex(7));
                  }
                }}
              >
                Rework
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 8
                  ? 'verifide_wrap current'
                  : editingSelectedProgressIndex === 7
                  ? 'verifide_wrap next'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 8
                    ? 'm-0 active'
                    : editingSelectedProgressIndex === 9
                    ? 'm-0 complete cursor_pointer'
                    : 'm-0'
                }
                onClick={() => {
                  if (editingSelectedProgressIndex === 9) {
                    dispatch(setEditingSelectedProgressIndex(8));
                  }
                }}
              >
                Overview
              </h4>
              <span className="line"></span>
            </div>
            <div
              className={
                editingSelectedProgressIndex === 9
                  ? 'verifide_wrap current'
                  : 'verifide_wrap'
              }
            >
              <h4
                className={
                  editingSelectedProgressIndex === 9 ? 'm-0 active' : 'm-0'
                }
              >
                Complete
              </h4>
              <span className="line"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default memo(EditingProgress);
