import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStep,
  setEditingSelectedProgressIndex,
} from '../../../Store/Reducers/Editing/EditingFlow/EditingSlice';
import { useParams } from 'react-router-dom';
import Loader from 'Components/Common/Loader';

export default function EditingProgress() {
  const dispatch = useDispatch();
  const { id } = useParams();
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
            : data?.step >= 5 && data?.is_rework === false
            ? data?.step
            : data?.step + 1
          : 1;

        dispatch(setEditingSelectedProgressIndex(step));
      })
      .catch(error => {
        console.error('Error fetching step data:', error);
      });
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
                    ? 'm-0 complete'
                    : 'm-0'
                }
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
                    ? 'm-0 complete'
                    : 'm-0'
                }
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
                    ? 'm-0 complete'
                    : 'm-0'
                }
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
                ? 'm-0 complete'
                : 'm-0'
            }
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
}
