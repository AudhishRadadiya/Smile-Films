import {
  setIsGetInintialValuesDataCollection,
  setUpdateSelectedDataCollectionData,
  getDataCollection,
} from 'Store/Reducers/Editing/DataCollection/DataCollectionSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DataCollectionDetail from './DataCollectionDetail';

export default function EditInquiry() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    isGetInintialValuesDataCollection,
    updateSelectedDataCollectionData,
  } = useSelector(({ dataCollection }) => dataCollection);
  const [initialData, setInitialData] = useState({});
  useEffect(() => {
    if (id) {
      if (isGetInintialValuesDataCollection?.update === true) {
        setInitialData(updateSelectedDataCollectionData);
      } else {
        dispatch(
          setIsGetInintialValuesDataCollection({
            ...isGetInintialValuesDataCollection,
            update: true,
          }),
        );

        dispatch(getDataCollection({ order_id: id }))
          .then(response => {
            const responseData = response.payload;
            setInitialData(responseData);
            dispatch(setUpdateSelectedDataCollectionData(responseData));
          })
          .catch(error => {
            console.error('Error fetching employee data:', error);
          });
      }
    }
  }, [id, dispatch]);

  return <DataCollectionDetail initialValues={initialData} />;
}
