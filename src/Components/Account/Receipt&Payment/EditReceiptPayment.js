import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ReceiptPaymentDetail from './ReceiptPaymentDetail';
import {
  getReceiptPaymentDetails,
  setEditReceiptPaymentData,
  setIsGetInitialValuesReceiptPayment,
} from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { convertIntoNumber } from 'Helper/CommonHelper';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

export default function EditReceiptPayment() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesReceiptPayment, editReceiptPaymentData } =
    useSelector(({ receiptAndPayment }) => receiptAndPayment);

  const handleEditReceiptPayment = async () => {
    let updatedReceivePaymentDetails = {};

    dispatch(
      setIsGetInitialValuesReceiptPayment({
        ...isGetInitialValuesReceiptPayment,
        edit: true,
      }),
    );

    const response = await dispatch(
      getReceiptPaymentDetails({ receipt_id: id }),
    );

    const accountDataList = await dispatch(
      getAccountList({
        start: 0,
        limit: 0,
        search: '',
      }),
    );
    const accountList = accountDataList.payload?.data?.list;

    if (response?.payload) {
      let group = '';
      let totalPaidAmount = 0;
      let totalSelectedInvoices = 0;

      if (
        response?.payload?.payment_type === 2 ||
        response?.payload?.payment_type === 3
      ) {
        group = 'Bank Accounts (Banks)';
      } else {
        group = 'Cash-in-hand';
      }

      const paymentReceiveInOptions = accountList
        ?.map(item => {
          if (item?.group_name === group && item?.account?.length) {
            return item?.account?.map(account => ({
              label: account?.account_name,
              value: account?._id,
            }));
          }
        })
        ?.filter(account => account)
        ?.flat();

      const balance =
        convertIntoNumber(response?.payload?.amount) +
        (response?.payload?.opening_balance_type === 2
          ? convertIntoNumber(response?.payload?.opening_balance) * -1 // Making Negative number:
          : convertIntoNumber(response?.payload?.opening_balance)); // Using for positive number:

      const updatedPaymentInvoice = response?.payload?.invoiceReceiptInfo?.map(
        item => {
          totalPaidAmount += item?.paid_amount;
          totalSelectedInvoices += 1;

          return {
            ...item,
            select_receipt_invoice: true,
            invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
            partial_amount: item?.partial_amount ? item?.partial_amount : 0,
            is_amount_paid: !item?.partial_amount ? true : false,
            invoice_amount: item?.amount,
          };
        },
      );

      const receivePaymentDetails = {
        ...response?.payload,
        payment_receiveIn_list: paymentReceiveInOptions,
        account_id: response?.payload?.account_id,
        client_company_id: response?.payload?.client_company_id,
        payment_date: new Date(response?.payload?.payment_date),
        // invoice_receipt_info: updatedPaymentInvoice,
        additional_invoice_info: updatedPaymentInvoice,
        balance: balance,
        remaining_balance: balance - convertIntoNumber(totalPaidAmount),
        total_paid_amount: convertIntoNumber(totalPaidAmount),
        total_selected_invoices: totalSelectedInvoices,
      };

      updatedReceivePaymentDetails = receivePaymentDetails;
    }

    const receivePaymentData = {
      ...updatedReceivePaymentDetails,
    };

    setInitialData(receivePaymentData);
    dispatch(setEditReceiptPaymentData(receivePaymentData));
  };

  useEffect(() => {
    if (isGetInitialValuesReceiptPayment?.edit === true) {
      setInitialData(editReceiptPaymentData);
    } else {
      handleEditReceiptPayment();
    }
  }, []);

  return <ReceiptPaymentDetail initialValues={initialData} />;
}
