import React, { useEffect, useState } from 'react';
import JournalEntryDetails from './JournalEntryDetails';
import {
  getPaymentNo,
  setCreateJournalEntryData,
  setIsGetInitialValuesJournalEntry,
} from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

const CreateJournalEntry = () => {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    createJournalEntryData,
    journalEntryInitialData,
    isGetInitialValuesJournalEntry,
  } = useSelector(({ journalEntry }) => journalEntry);

  const handleAddJournalEntry = () => {
    dispatch(
      setIsGetInitialValuesJournalEntry({
        ...isGetInitialValuesJournalEntry,
        add: true,
      }),
    );

    dispatch(getPaymentNo())
      .then(res => {
        const journalEntryPaymentNo = res?.payload;
        return { journalEntryPaymentNo };
      })
      .then(({ journalEntryPaymentNo }) => {
        dispatch(
          getAccountList({
            start: 0,
            limit: 0,
            search: '',
          }),
        )
          .then(response => {
            let accountData = [];

            if (response.payload?.data?.list?.length > 0) {
              accountData = response.payload.data.list
                ?.map(item => {
                  if (
                    !['Bank Accounts (Banks)', 'Cash-in-hand'].includes(
                      item?.group_name,
                    ) &&
                    item?.account?.length
                  ) {
                    return item?.account?.map(account => ({
                      label: account?.account_name,
                      value: account?._id,
                    }));
                  }
                })
                ?.filter(account => account)
                ?.flat();
            }

            return { journalEntryPaymentNo, accountData };
          })
          .then(({ journalEntryPaymentNo, accountData }) => {
            dispatch(
              getAccountList({
                start: 0,
                limit: 0,
                isActive: '',
                search: '',
                group_type: 'Bank Accounts',
              }),
            ).then(response => {
              let paymentGroupListData = [];

              if (response.payload?.data?.list?.length) {
                paymentGroupListData = response.payload.data?.list
                  .map(item => {
                    return item?.account?.map(account => ({
                      label: account?.account_name,
                      value: account?._id,
                    }));
                  })
                  ?.filter(account => account)
                  ?.flat();
              }

              const updatedData = {
                ...journalEntryInitialData,
                payment_no: journalEntryPaymentNo,
                // client_company_list: accountData,
                // account_list: accountListData,
                account_list: accountData,
                payment_group_list: paymentGroupListData,
              };

              setInitialData(updatedData);
              dispatch(setCreateJournalEntryData(updatedData));
            });
          })
          .catch(error =>
            console.error('fetch the Accounts data - error', error),
          );
      })
      .catch(error => console.error('fetch the Payment Number - error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesJournalEntry?.add === true) {
      setInitialData(createJournalEntryData);
    } else {
      handleAddJournalEntry();
    }
  }, []);

  return <JournalEntryDetails initialValues={initialData} isEdit={false} />;
};

export default CreateJournalEntry;
