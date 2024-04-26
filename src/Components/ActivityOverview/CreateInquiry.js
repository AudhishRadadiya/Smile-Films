import { setIsGetInintialValuesInquiry } from 'Store/Reducers/ActivityOverview/inquirySlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InquiryDetail from './InquiryDetail';

export default function CreateInquiry() {
  const dispatch = useDispatch();
  const { inquiryData, isGetInintialValuesInquiry, addSelectedInquiryData } =
    useSelector(({ inquiry }) => inquiry);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (isGetInintialValuesInquiry?.add === true) {
      setInitialData(addSelectedInquiryData);
    } else {
      dispatch(
        setIsGetInintialValuesInquiry({
          ...isGetInintialValuesInquiry,
          add: true,
        }),
      );
      setInitialData(inquiryData);
    }
  }, []);

  return <InquiryDetail initialValues={initialData} />;
}
