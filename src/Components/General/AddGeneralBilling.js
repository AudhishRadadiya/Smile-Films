import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getGeneralBillingNumber,
  setAddGeneralBillingData,
  setIsGetInitialValuesGeneralBilling,
} from 'Store/Reducers/GeneralBilling/GeneralBillingSlice';
import GeneralBillingDetail from 'Components/General/GeneralBillingDetail';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';

const AddGeneralBilling = () => {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    generalBillingInitial,
    isGetInitialValuesGeneralBilling,
    addGeneralBillingData,
  } = useSelector(({ generalBilling }) => generalBilling);

  const fetchRequireData = () => {
    dispatch(
      getAccountList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
    dispatch(
      getProductList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 1,
      }),
    );
    dispatch(
      getPackageList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
        type: 1,
      }),
    );
    dispatch(
      getCurrencyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
  };

  useEffect(() => {
    fetchRequireData();
  }, []);

  const handleAddGeneralBilling = () => {
    dispatch(
      setIsGetInitialValuesGeneralBilling({
        ...isGetInitialValuesGeneralBilling,
        add: true,
      }),
    );

    dispatch(getGeneralBillingNumber())
      .then(res => {
        const generalBillingData = res?.payload;
        return { generalBillingData };
      })
      .then(({ generalBillingData }) => {
        const {
          _id,
          currency_code,
          currency_name,
          currency_symbol,
          exchange_rate,
          billing_no,
          company_name,
          director_name,
          mobile_no,
          email_id,
        } = generalBillingData;

        const updatedData = {
          ...generalBillingInitial,
          company_name: company_name,
          director_name: director_name,
          mobile_no: mobile_no,
          email_id: email_id,
          selected_currency: {
            _id: _id,
            currency_code: currency_code,
            currency_name: currency_name,
            currency_symbol: currency_symbol,
            exchange_rate: exchange_rate,
            isActive: true,
          },
          currency: _id,
          currency_code: currency_code,
          currency_symbol: currency_symbol,
          currency_name: currency_name,
          conversation_rate: exchange_rate,
          isActive: true,
          billing_no: billing_no,
        };

        setInitialData(updatedData);
        dispatch(setAddGeneralBillingData(updatedData));
      })
      .catch(error => console.error('error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesGeneralBilling?.add === true) {
      setInitialData(addGeneralBillingData);
    } else {
      handleAddGeneralBilling();
    }
  }, []);

  return <GeneralBillingDetail initialValues={initialData} />;
};

export default memo(AddGeneralBilling);
