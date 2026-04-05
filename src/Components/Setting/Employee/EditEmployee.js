import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmployeeDetail from './EmployeeDetail';
import { useParams } from 'react-router-dom';
import {
  getEmployee,
  setIsGetInitialValuesEmployee,
  setUpdateSelectedEmployeeData,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';

export default function EditEmployee() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});
  const { isGetInitialValuesEmployee, updateSelectedEmployeeData } =
    useSelector(({ employee }) => employee);

  useEffect(() => {
    if (id) {
      if (isGetInitialValuesEmployee?.update === true) {
        setInitialData(updateSelectedEmployeeData);
      } else {
        dispatch(
          setIsGetInitialValuesEmployee({
            ...isGetInitialValuesEmployee,
            update: true,
          }),
        );

        dispatch(getEmployee({ employee_id: id }))
          .then(response => {
            const responseData = response.payload;
            setInitialData({
              ...responseData,
              password: responseData?.original_password,
            });
            dispatch(setUpdateSelectedEmployeeData(responseData));
          })
          .catch(error => {
            console.error('Error fetching employee data:', error);
          });
      }
    }
  }, [id, dispatch]);

  return <EmployeeDetail initialValues={initialData} />;
}
