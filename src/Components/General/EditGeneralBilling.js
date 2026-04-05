import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getGeneralBillingDetail,
  setEditGeneralBillingData,
  setIsGetInitialValuesGeneralBilling,
} from 'Store/Reducers/GeneralBilling/GeneralBillingSlice';
import GeneralBillingDetail from 'Components/General/GeneralBillingDetail';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { getProductList } from 'Store/Reducers/Settings/Master/ProductSlice';
import { getPackageList } from 'Store/Reducers/Settings/Master/PackageSlice';
import { getCurrencyList } from 'Store/Reducers/Settings/Master/CurrencySlice';
import { useParams } from 'react-router-dom';
import { generateUniqueId } from 'Helper/CommonHelper';
import moment from 'moment';

const EditGeneralBilling = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesGeneralBilling, editGeneralBillingData } =
    useSelector(({ generalBilling }) => generalBilling);

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

  const handleEditGeneralBilling = () => {
    dispatch(
      setIsGetInitialValuesGeneralBilling({
        ...isGetInitialValuesGeneralBilling,
        edit: true,
      }),
    );

    dispatch(getGeneralBillingDetail({ billing_id: id, pdf: false }))
      .then(res => {
        const generalBillingData = res?.payload;

        const {
          currency_code,
          currency_name,
          currency_symbol,
          conversation_rate,
          currency,
          due_date,
          time,
          billing_items,
        } = generalBillingData;

        const billing_inquiry =
          billing_items?.map(item => item?.item_id)?.filter(Boolean) || [];

        const updatedBillingItems = billing_items.map(item => {
          let itemName = item?.item_name;

          if (item?.package && item?.package?.length > 0) {
            itemName = item?.package[0]?.package_name;
          } else if (item?.product && item?.product?.length > 0) {
            itemName = item?.product[0]?.item_name;
          } else if (
            Array.isArray(item?.item_name) &&
            item?.package?.length > 0
          ) {
            itemName = item?.package[0]?.package_name;
          } else if (typeof item?.item_name === 'string') {
            itemName = item?.item_name;
          }

          return {
            ...item,
            due_date: new Date(item?.due_date) || null,
            unique_id: item?.unique_id || generateUniqueId(),
            item_name: itemName,
          };
        });

        const updatedData = {
          ...generalBillingData,
          due_date: due_date ? new Date(due_date) : null,
          time: time ? moment(time, 'hh:mm A').toDate() : null,
          billing_items: updatedBillingItems,
          billing_inquiry: billing_inquiry,
          selected_currency: {
            _id: currency,
            currency_code: currency_code,
            currency_name: currency_name,
            currency_symbol: currency_symbol,
            exchange_rate: conversation_rate,
            isActive: true,
          },
          currency: currency,
          currency_code: currency_code,
          currency_symbol: currency_symbol,
          currency_name: currency_name,
          conversation_rate: conversation_rate,
          isActive: true,
        };

        setInitialData(updatedData);
        dispatch(setEditGeneralBillingData(updatedData));
      })
      .catch(error => console.error('error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesGeneralBilling?.edit === true) {
      setInitialData(editGeneralBillingData);
    } else {
      handleEditGeneralBilling();
    }
  }, []);

  return <GeneralBillingDetail initialValues={initialData} />;
};

export default memo(EditGeneralBilling);
