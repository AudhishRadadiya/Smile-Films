import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ReceiptPaymentDetail from './ReceiptPaymentDetail';
import {
  getReceiptPaymentNumber,
  setAddReceiptPaymentData,
  setIsGetInitialValuesReceiptPayment,
} from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

export default function AddReceiptPayment() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    receiptPaymentInitial,
    isGetInitialValuesReceiptPayment,
    addReceiptPaymentData,
  } = useSelector(({ receiptAndPayment }) => receiptAndPayment);

  const handleAddReceiptPayment = () => {
    dispatch(
      setIsGetInitialValuesReceiptPayment({
        ...isGetInitialValuesReceiptPayment,
        add: true,
      }),
    );

    dispatch(getReceiptPaymentNumber())
      .then(res => {
        const payment_no = res?.payload;
        return { payment_no };
      })
      .then(({ payment_no }) => {
        dispatch(
          getClientCompanyList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
            type: 3,
          }),
        )
          .then(response => {
            const companyData = response.payload?.data?.list?.map(item => ({
              label: item?.company_name,
              value: item?._id,
            }));
            return { payment_no, companyData };
          })
          .then(({ payment_no, companyData }) => {
            dispatch(
              getAccountList({
                start: 0,
                limit: 0,
                // isActive: '',
                search: '',
                // group_type: 'Bank Accounts (Banks)',
              }),
            ).then(response => {
              const updatedData = {
                ...receiptPaymentInitial,
                payment_no: payment_no,
                client_company_list: companyData,
              };

              setInitialData(updatedData);
              dispatch(setAddReceiptPaymentData(updatedData));
            });
          });
      })
      .catch(error => console.error('error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesReceiptPayment?.add === true) {
      setInitialData(addReceiptPaymentData);
    } else {
      handleAddReceiptPayment();
    }
  }, []);

  return <ReceiptPaymentDetail initialValues={initialData} />;
}
