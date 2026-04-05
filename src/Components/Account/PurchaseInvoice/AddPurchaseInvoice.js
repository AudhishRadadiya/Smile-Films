import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PurchaseInvoiceDetail from './PurchaseInvoiceDetail';
import {
  getPurchaseInvoiceNumber,
  setAddPurchaseInvoiceData,
  setIsGetInitialValuesPurchaseInvoice,
} from 'Store/Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

export default function AddPurchaseInvoice() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    purchaseInvoiceInitial,
    isGetInitialValuesPurchaseInvoice,
    addPurchaseInvoiceData,
  } = useSelector(({ purchaseInvoice }) => purchaseInvoice);

  const handleAddPurchaseInvoice = () => {
    dispatch(
      setIsGetInitialValuesPurchaseInvoice({
        ...isGetInitialValuesPurchaseInvoice,
        add: true,
      }),
    );

    dispatch(getPurchaseInvoiceNumber())
      .then(res => {
        const purchaseInvoiceNo = res?.payload;
        return { purchaseInvoiceNo };
      })
      .then(({ purchaseInvoiceNo }) => {
        dispatch(
          getClientCompanyList({
            start: 0,
            limit: 0,
            search: '',
            isActive: true,
            type: 3, // not required // 1- client company list, 2- supplier, 3- all
          }),
        )
          .then(response => {
            const companyData = response.payload?.data?.list?.map(item => ({
              label: item?.company_name,
              value: item?._id,
            }));
            return { purchaseInvoiceNo, companyData };
          })
          .then(({ purchaseInvoiceNo, companyData }) => {
            const updatedData = {
              ...purchaseInvoiceInitial,
              purchase_invoice_no: purchaseInvoiceNo,
              client_company_list: companyData,
            };

            setInitialData(updatedData);
            dispatch(setAddPurchaseInvoiceData(updatedData));
          });
      })
      .catch(error => console.error('error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesPurchaseInvoice?.add === true) {
      setInitialData(addPurchaseInvoiceData);
    } else {
      handleAddPurchaseInvoice();
    }
  }, []);

  return <PurchaseInvoiceDetail initialValues={initialData} />;
}
