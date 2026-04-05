import { useDispatch, useSelector } from 'react-redux';
import EmployeeDetail from './EmployeeDetail';
import { useEffect, useState } from 'react';
import {
  getEmployeeNumber,
  setAddSelectedEmployeeData,
  setIsGetInitialValuesEmployee,
} from 'Store/Reducers/Settings/CompanySetting/EmployeeSlice';

export default function AddEmployee() {
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { employeeData, isGetInitialValuesEmployee, addSelectedEmployeeData } =
    useSelector(({ employee }) => employee);

  const handleAddEmployee = async () => {
    let employeeDetails = { ...employeeData };

    dispatch(
      setIsGetInitialValuesEmployee({
        ...isGetInitialValuesEmployee,
        add: true,
      }),
    );

    const res = await dispatch(getEmployeeNumber());

    if (res?.payload) {
      employeeDetails = {
        ...employeeDetails,
        emp_no: res.payload,
      };
    }

    setInitialData(employeeDetails);
    dispatch(setAddSelectedEmployeeData(employeeDetails));
  };

  useEffect(() => {
    if (isGetInitialValuesEmployee?.add === true) {
      setInitialData(addSelectedEmployeeData);
    } else {
      handleAddEmployee();
    }
  }, []);

  return <EmployeeDetail initialValues={initialData} />;
}
