/**
 * Main Modules
 */
export const DASHBOARD = 'Dashboard';
export const USERDASHBOARD = 'user-dashboard';
export const CLIENTDASHBOARD = ' client-dashboard';
export const ACTIVITYOVERVIEW = 'Activity Overview';
export const EDITING = 'Editing'; //
export const EXPOSING = 'Exposing';
export const ACCOUNT = 'Account';
export const REPORT = 'Report';
export const SETTING = 'Setting';
export const ASSIGNEDWORKED = 'Assigned Worked';
export const REPORTING = 'Reporting';
export const MYFINANCE = 'My Finance';
export const ALL = 'All';
export const PROJECTS = 'Projects';
export const PAYMENT = 'Payment';
export const GENERAL = 'General';
/**
 * @ desc Sub Modules
 */
/************************* Dashboard ********************/
export const RoleDashboard = 'dashboard-all';

// /************************* Report ********************/
export const RoleReport = 'report-all';

/************************* Activity Overview ********************/
export const RoleAnnouncement = 'announcement';
export const RoleDeletedHistory = 'deleted-history';
export const RoleInquiry = 'inquiry';
export const RoleEmployeeReporting = 'employee-reporting';
export const RoleProjectStatus = 'project-status';

/************************* Editing ********************/
export const RoleEditingFlow = 'editing-flow'; //
export const RoleDataCollection = 'data-collection';

/************************* Exposing ********************/
export const RoleExposing = 'exposing-all';

/************************* General ********************/
export const RoleGeneral = 'general-billing';

/************************* Account ********************/
export const RoleExpenses = 'expenses';
export const RoleBilling = 'billing';
export const RolePurchaseInvoice = 'purchase-invoice';
export const RoleReceiptPayment = 'receipt-payment';
export const RoleJournalEntry = 'journal-entry';

/************************* Employee-Reporting ********************/
export const RoleReporting = 'reporting-all';

/************************* setting ********************/
export const RoleCompanyList = 'company-list';
export const RoleCompanyPermission = 'company-permission';
export const RoleCompanyProfile = 'company-profile';
export const RoleClientCompany = 'client-company';
export const RoleEmployee = 'employee';
export const RoleRolesPermission = 'roles-permission';
export const RolePackage = 'package';
export const RoleProduct = 'product';
export const RoleProjectType = 'project-type';
export const RoleCurrency = 'currency';
export const RoleSubscriptionStatus = 'subscription-status';
export const RoleLocation = 'location';
export const RoleReference = 'reference';
export const RoleDevices = 'devices';
export const RoleChangeYear = 'change-year';
export const RoleAccount = 'account';
export const RoleGroup = 'group';

/************************* All ********************/
export const RoleAll = 'other';

/************************* Projects ********************/
export const RoleProject = 'projects-all';

/************************* Payment ********************/
export const RolePaymentDetails = 'payment-details';
export const RoleTransaction = 'my-transaction';

/************************* Payment ********************/
export const RoleMyPay = 'my-pay';
export const RoleTransactionEmployee = 'transaction';

/************************* Assigned Worked ********************/
export const RoleAssignedWorked = 'assigned-worked-all';

export const UpcomingProjectFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Rework', value: 'rework' },
  { label: 'Checking', value: 'checking' },
];

export const AssignedProjectFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Rework', value: 'rework' },
  { label: 'Checker', value: 'checker' },
];

export const AssignedProjectStatusFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Completed', value: 'completed' },
];
