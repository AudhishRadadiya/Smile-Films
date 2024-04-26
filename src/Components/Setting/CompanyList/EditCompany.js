import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyDetail from './CompanyDetail';
import { useParams } from 'react-router-dom';
import {
  getCompany,
  setIsGetInitialValues,
  setUpdateSelectedCompanyData,
} from 'Store/Reducers/Settings/CompanySetting/CompanySlice';

export default function EditCompany() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isGetInitialValues, updateSelectedCompanyData } = useSelector(
    ({ company }) => company,
  );
  const [initialData, setInitialData] = useState({});
  useEffect(() => {
    if (id) {
      if (isGetInitialValues?.update === true) {
        setInitialData(updateSelectedCompanyData);
      } else {
        dispatch(
          setIsGetInitialValues({ ...isGetInitialValues, update: true }),
        );

        dispatch(getCompany({ company_id: id }))
          .then(response => {
            const responseData = response.payload;
            setInitialData(responseData);
            dispatch(setUpdateSelectedCompanyData(responseData));
          })
          .catch(error => {
            console.error('Error fetching company data:', error);
          });
      }
    }
  }, [id, dispatch]);

  return <CompanyDetail initialValues={initialData} />;
}
