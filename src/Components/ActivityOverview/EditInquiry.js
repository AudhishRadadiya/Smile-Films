import {
  getInquiry,
  setIsGetInintialValuesInquiry,
  setUpdateSelectedInquiryData,
} from 'Store/Reducers/ActivityOverview/inquirySlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InquiryDetail from './InquiryDetail';

export default function EditInquiry() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isGetInintialValuesInquiry, updateSelectedInquiryData } = useSelector(
    ({ inquiry }) => inquiry,
  );
  const [initialData, setInitialData] = useState({});
  useEffect(() => {
    if (id) {
      if (isGetInintialValuesInquiry?.update === true) {
        setInitialData(updateSelectedInquiryData);
      } else {
        dispatch(
          setIsGetInintialValuesInquiry({
            ...isGetInintialValuesInquiry,
            update: true,
          }),
        );

        dispatch(getInquiry({ inquiry_id: id }))
          .then(response => {
            const responseData = response.payload;
            setInitialData(responseData);
            dispatch(setUpdateSelectedInquiryData(responseData));
          })
          .catch(error => {
            console.error('Error fetching employee data:', error);
          });
      }
    }
  }, [id, dispatch]);

  return <InquiryDetail initialValues={initialData} />;
}
