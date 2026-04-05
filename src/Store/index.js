import { configureStore } from '@reduxjs/toolkit';
import auth from './Reducers/Auth/authSlice';
import country from './Reducers/Settings/Master/CountrySlice';
import state from './Reducers/Settings/Master/StateSlice';
import city from './Reducers/Settings/Master/CitySlice';
import forgotPassword from './Reducers/Auth/forgotPasswordSlice';
import verifyEmail from './Reducers/Auth/VerifyEmailSlice';
import rolePermission from './Reducers/Settings/Master/RolesAndPermissionSlice';
import companyPermission from './Reducers/Settings/CompanySetting/CompanyAndPermissionSlice';
import common from './Reducers/Common/CommonSlice';
import resetPass from './Reducers/Auth/CreateResetPassSlice';
import projectType from './Reducers/Settings/Master/ProjectTypeSlice';
import references from './Reducers/Settings/Master/ReferenceSlice';
import devices from './Reducers/Settings/Master/DevicesSlice';
import changeFinancialYear from './Reducers/Settings/Master/ChangeFinancialYearSlice';
import currency from './Reducers/Settings/Master/CurrencySlice';
import product from './Reducers/Settings/Master/ProductSlice';
import packages from './Reducers/Settings/Master/PackageSlice';
import clientCompany from './Reducers/Settings/CompanySetting/ClientCompanySlice';
import subscription from './Reducers/Settings/Subscription/SubscriptionSlice';
import subscriptionPlans from './Reducers/Settings/Subscription/SubscriptionPlanSlice';
import company from './Reducers/Settings/CompanySetting/CompanySlice';
import profile from './Reducers/Auth/ProfileSlice';
import employee from './Reducers/Settings/CompanySetting/EmployeeSlice';
import account from './Reducers/Settings/AccountMaster/AccountSlice';
import group from './Reducers/Settings/AccountMaster/GroupSlice';
import announcement from './Reducers/ActivityOverview/announcementSlice';
import userDashboard from './Reducers/UserFlow/UserDashboardSlice';
import holiday from './Reducers/ActivityOverview/holidaySlice';
import inquiry from './Reducers/ActivityOverview/inquirySlice';
import editing from './Reducers/Editing/EditingFlow/EditingSlice';
import dataCollection from './Reducers/Editing/DataCollection/DataCollectionSlice';
import clientProject from './Reducers/ClientFlow/Project/ClientProjectSlice';
import chat from './Reducers/Editing/EditingFlow/ChatSlice';
import exposing from './Reducers/Exposing/ExposingFlow/ExposingSlice';
import subscriptionStatus from './Reducers/Settings/Master/SubscriptionStatusSlice';
import projectStatus from './Reducers/ActivityOverview/ProjectStatus/ProjectStatusSlice';
import assignedWorked from './Reducers/UserFlow/AssignedWorkedSlice';
import journalEntry from './Reducers/Accounting/JournalEntry/JournalEntrySlice';
import receiptAndPayment from './Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';
import purchaseInvoice from './Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';
import expenses from './Reducers/Account/Expenses/ExpensesSlice';
import billing from './Reducers/Accounting/Billing/BillingSlice';
import deletedHistory from './Reducers/ActivityOverview/DeletedHistory/DeletedHistorySlice';
import reporting from './Reducers/UserFlow/ReportingFlow/ReportingSlice';
import adminDashboard from './Reducers/Dashboard/AdminDashboardSlice';
import myPay from './Reducers/ClientFlow/MyPay/MyPaySlice';
import myFinance from './Reducers/UserFlow/MyFinance/MyPay/MyFinance';
import transaction from './Reducers/ClientFlow/Project/TransactionSlice';
import clientDashboard from './Reducers/ClientFlow/Dashboard/ClientDashboardSlice';
import notification from './Reducers/Notification/NotificationSlice';
import adminReporting from './Reducers/ActivityOverview/AdminReportingFlow/AdminReportingSlice';
import myPayment from './Reducers/UserFlow/MyFinance/MyPaymentSlice';
import calendar from './Reducers/Calendar/CalendarSlice';
import businessOverviewReports from './Reducers/Report/BusinessOverview/BusinessOverviewSlice';
import ledger from './Reducers/Report/Ledger/LedgerSlice';
import empTransaction from './Reducers/UserFlow/MyFinance/EmpTransactionSlice';
import generalBilling from './Reducers/GeneralBilling/GeneralBillingSlice';

const store = configureStore({
  reducer: {
    auth,
    country,
    state,
    city,
    forgotPassword,
    verifyEmail,
    rolePermission,
    companyPermission,
    common,
    resetPass,
    projectType,
    references,
    devices,
    changeFinancialYear,
    currency,
    product,
    clientCompany,
    packages,
    profile,
    employee,
    company,
    account,
    group,
    announcement,
    userDashboard,
    holiday,
    inquiry,
    dataCollection,
    editing,
    exposing,
    projectStatus,
    clientProject,
    chat,
    subscription,
    subscriptionPlans,
    subscriptionStatus,
    assignedWorked,
    journalEntry,
    receiptAndPayment,
    purchaseInvoice,
    generalBilling,
    expenses,
    billing,
    deletedHistory,
    reporting,
    adminDashboard,
    myPay,
    myFinance,
    transaction,
    clientDashboard,
    notification,
    adminReporting,
    myPayment,
    calendar,
    businessOverviewReports,
    ledger,
    empTransaction,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
