import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PurchaseInvoiceDetail from './PurchaseInvoiceDetail';
import {
  getPurchaseInvoiceDetail,
  setIsGetInitialValuesPurchaseInvoice,
  setUpdatePurchaseInvoiceData,
} from 'Store/Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { useParams } from 'react-router-dom';
import { generateUniqueId } from 'Helper/CommonHelper';

export default function AddPurchaseInvoice() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesPurchaseInvoice, updatePurchaseInvoiceData } =
    useSelector(({ purchaseInvoice }) => purchaseInvoice);

  const handleUpdatePurchaseInvoice = async () => {
    let compnayOpitions = [];
    let updatedPurchaseInvoiceDetails = {};

    dispatch(
      setIsGetInitialValuesPurchaseInvoice({
        ...isGetInitialValuesPurchaseInvoice,
        update: true,
      }),
    );

    const response = await dispatch(
      getPurchaseInvoiceDetail({
        purchase_invoice_id: id,
        pdf: false,
      }),
    );
    const companyDataList = await dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        search: '',
        isActive: true,
        type: 3,
      }),
    );

    const company = companyDataList.payload?.data?.list;

    if (company?.length) {
      compnayOpitions = company?.map(item => ({
        label: item?.company_name,
        value: item?._id,
      }));
    }

    if (response?.payload) {
      const purchaseInvoiceDetails = response?.payload;

      const updatedPurchaseItems = purchaseInvoiceDetails?.purchaseItems?.map(
        item => {
          return {
            ...item,
            unique_id: generateUniqueId(),
          };
        },
      );

      const updatedData = {
        ...response?.payload,
        create_date: purchaseInvoiceDetails?.create_date
          ? new Date(purchaseInvoiceDetails?.create_date?.split('T')[0])
          : '',
        purchase_items: updatedPurchaseItems,
      };

      updatedPurchaseInvoiceDetails = updatedData;
    }

    const purchaseInvoiceData = {
      ...updatedPurchaseInvoiceDetails,
      client_company_list: compnayOpitions,
    };

    setInitialData(purchaseInvoiceData);
    dispatch(setUpdatePurchaseInvoiceData(purchaseInvoiceData));
  };

  useEffect(() => {
    if (isGetInitialValuesPurchaseInvoice?.update === true) {
      setInitialData(updatePurchaseInvoiceData);
    } else {
      handleUpdatePurchaseInvoice();
    }
  }, []);

  return <PurchaseInvoiceDetail initialValues={initialData} />;
}
