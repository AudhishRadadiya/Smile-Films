import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CompanyLedger from './CompanyLedger';
import Loader from 'Components/Common/Loader';
import CompanySidebar from '../CompanySidebar';
import CompanyOverview from './CompanyOverview';
import CompanyActivity from './CompanyActivity';
import { TabView, TabPanel } from 'primereact/tabview';
import CompanyTransactions from './CompanyTransactions';

export default function CompanyProfile() {
  const {
    clientCompanyLoading,
    companyLedgerLoading,
    companyInvoiceLoading,
    companyProjectLoading,
    companyQuotationLoading,
    companyTransactioLoading,
  } = useSelector(({ clientCompany }) => clientCompany);

  const { clientCashFlowDataLoading } = useSelector(
    ({ clientDashboard }) => clientDashboard,
  );

  const { clientBillingLoading } = useSelector(
    ({ clientProject }) => clientProject,
  );

  return (
    <>
      {(companyLedgerLoading ||
        clientCompanyLoading ||
        companyInvoiceLoading ||
        companyProjectLoading ||
        companyQuotationLoading ||
        companyTransactioLoading ||
        clientCashFlowDataLoading ||
        clientBillingLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="setting_main_wrap">
          <CompanySidebar />
          <div className="setting_right_wrap bg-white radius15 border">
            <div className="tab_list_wrap">
              <div className="title_right_wrapper">
                <ul className="title_right_inner">
                  <li>
                    <Link to="/client-company" className="btn_border_dark">
                      Exit Page
                    </Link>
                  </li>
                </ul>
              </div>
              <TabView>
                <TabPanel header="Overview">
                  <CompanyOverview />
                </TabPanel>
                <TabPanel header="Transaction">
                  <CompanyTransactions />
                </TabPanel>
                <TabPanel header="Activity">
                  <CompanyActivity />
                </TabPanel>
                <TabPanel header="Ledger (Statement)">
                  <CompanyLedger />
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
