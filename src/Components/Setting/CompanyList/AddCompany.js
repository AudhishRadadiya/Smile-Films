import { useDispatch, useSelector } from 'react-redux';
import CompanyDetail from './CompanyDetail';
import { useEffect, useState } from 'react';
import { setIsGetInitialValues } from 'Store/Reducers/Settings/CompanySetting/CompanySlice';

export default function AddCompany() {
  const dispatch = useDispatch();
  const { companyData, isGetInitialValues, addSelectedCompanyData } =
    useSelector(({ company }) => company);
  const [initialData, setInitialData] = useState({});
  useEffect(() => {
    if (isGetInitialValues?.add === true) {
      setInitialData(addSelectedCompanyData);
    } else {
      dispatch(setIsGetInitialValues({ ...isGetInitialValues, add: true }));
      setInitialData(companyData);
    }
  }, []);

  return <CompanyDetail initialValues={initialData} />;
}
