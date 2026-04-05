import React, { memo, useCallback, useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { useDispatch, useSelector } from 'react-redux';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import { getClientCompanyLedgerList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';

const CompanyLedger = () => {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  const startDate = new Date(currentDate);
  startDate.setFullYear(currentDate.getFullYear() - 1);

  const [selectedDates, setSelectedDates] = useState([startDate, pastDate]);
  const { selectedClientCompanyData, companyLedgerStatementData } = useSelector(
    ({ clientCompany }) => clientCompany,
  );

  const fetchLedgerData = useCallback(
    (companyId, startDate, endDate, saveAsPDF = false) => {
      const payload = {
        client_company_id: companyId,
        start_date: startDate,
        end_date: endDate,
        pdf: saveAsPDF,
      };
      dispatch(getClientCompanyLedgerList(payload));
    },
    [],
  );

  useEffect(() => {
    fetchLedgerData(selectedClientCompanyData?._id, startDate, pastDate);
  }, []);

  const handleClientCompanyLedgerDate = useCallback(e => {
    setSelectedDates(e.value);
  }, []);

  return (
    <div>
      <div className="company_statement_wrap">
        <div className="d-flex justify-content-end gap-3 mb-3">
          <div className="form_group date_select_wrapper text-end">
            <Calendar
              id="LedgerDate"
              value={selectedDates}
              selectionMode="range"
              dateFormat="dd-mm-yy"
              placeholder="Select Date Range"
              onChange={e => {
                handleClientCompanyLedgerDate(e);
              }}
              showIcon
              showButtonBar
              readOnlyInput
            />
          </div>
          <button
            className="btn_border_dark"
            onClick={() => {
              fetchLedgerData(
                selectedClientCompanyData?._id,
                startDate,
                pastDate,
                true,
              );
              // setVisible(false);
            }}
          >
            <img src={PdfIcon} alt="pdficon" /> Save As PDF
          </button>
        </div>
        <div className="statement_details border">
          <div className="statement_user d-flex justify-content-between">
            <div className="user_name mb-2">
              <h3>{selectedClientCompanyData?.company_name || ''}</h3>
            </div>
            <div className="user_ledger">Client ledger</div>
          </div>
          <div className="statement_table">
            <table className="w-100 table">
              <thead className="table-header">
                <tr>
                  <th>Sr No</th>
                  <th>Date</th>
                  <th>Voucher</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {companyLedgerStatementData?.map(item => {
                  return (
                    <tr>
                      <td>{item?.serial_no}</td>
                      <td>{item?.created_at}</td>
                      <td>{item?.voucher}</td>
                      <td>{item?.credit_amount}</td>
                      <td>{item?.debit_amount}</td>
                      <td>{item?.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CompanyLedger);
