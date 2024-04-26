import React, { useEffect, useState } from 'react';

import DataCollectionDetail from './DataCollectionDetail';
import { useDispatch, useSelector } from 'react-redux';
import { setIsGetInintialValuesDataCollection } from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';

export default function AddDataCollection() {
  const dispatch = useDispatch();
  const {
    dataCollectionData,
    isGetInintialValuesDataCollection,
    addSelectedDataCollectionData,
  } = useSelector(({ dataCollection }) => dataCollection);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (isGetInintialValuesDataCollection?.add === true) {
      setInitialData(addSelectedDataCollectionData);
    } else {
      dispatch(
        setIsGetInintialValuesDataCollection({
          ...isGetInintialValuesDataCollection,
          add: true,
        }),
      );
      setInitialData(dataCollectionData);
    }
  }, []);

  return <DataCollectionDetail initialValues={initialData} />;
}
