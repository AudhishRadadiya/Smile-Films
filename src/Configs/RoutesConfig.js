import {
  ACCOUNT,
  ACTIVITYOVERVIEW,
  ALL,
  ASSIGNEDWORKED,
  CLIENTDASHBOARD,
  DASHBOARD,
  EDITING,
  EXPOSING,
  MYFINANCE,
  PAYMENT,
  PROJECTS,
  REPORTING,
  RoleAccount,
  RoleAll,
  RoleAnnouncement,
  RoleAssignedWorked,
  RoleBilling,
  RoleClientCompany,
  RoleCompanyList,
  RoleCurrency,
  RoleDashboard,
  RoleDataCollection,
  RoleDeletedHistory,
  RoleDevices,
  RoleEditingFlow,
  RoleEmployee,
  RoleEmployeeReporting,
  RoleExpenses,
  RoleExposing,
  RoleGroup,
  RoleInquiry,
  RoleJournalEntry,
  RoleLocation,
  RolePackage,
  RoleMyPay,
  RolePaymentDetails,
  RoleProduct,
  RoleProject,
  RoleProjectStatus,
  RoleProjectType,
  RolePurchaseInvoice,
  RoleReceiptPayment,
  RoleReference,
  RoleReporting,
  RoleRolesPermission,
  RoleSubscriptionActivePlans,
  RoleSubscriptionStatus,
  RoleTransaction,
  SETTING,
  USERDASHBOARD,
  RoleCompanyProfile,
  RoleChangeYear,
  RoleReport,
  REPORT,
  RoleTransactionEmployee,
  RoleCompanyPermission,
  GENERAL,
  RoleGeneral,
} from 'Global/Constants';
import React from 'react';

const Homepage = React.lazy(() => import('Components/Home/Index'));
const AccountHistory = React.lazy(() =>
  import('Components/Setting/Account/AccountHistory'),
);
const Chat = React.lazy(() => import('Components/Chat/Chat'));
const Inquiry = React.lazy(() => import('Components/ActivityOverview/Inquiry'));
const InquiryFlow = React.lazy(() =>
  import('Components/ActivityOverview/Inquiry/InquiryFlow'),
);
const CreateInquiry = React.lazy(() =>
  import('Components/ActivityOverview/CreateInquiry'),
);
const EditInquiry = React.lazy(() =>
  import('Components/ActivityOverview/EditInquiry'),
);
const Announcement = React.lazy(() =>
  import('Components/ActivityOverview/Announcement'),
);
const DeletedHistory = React.lazy(() =>
  import('Components/ActivityOverview/DeletedHistory/DeletedHistory'),
);
const ProjectStatus = React.lazy(() =>
  import('Components/ActivityOverview/ProjectStatus/ProjectStatus'),
);
const ReportingSummary = React.lazy(() =>
  import('Components/ActivityOverview/Reporting/ReportingSummary'),
);
const UserReporting = React.lazy(() =>
  import('Components/ActivityOverview/Reporting/UserReporting'),
);
// const Dashboard = React.lazy(() => import('Components/Dashboard/Dashboard'));
const AdminDashboard = React.lazy(() =>
  import('Components/Dashboard/AdminDashboard'),
);
const UserDashboard = React.lazy(() =>
  import('Components/UserDashboard/Dashboard/UserDashboard'),
);
const MyProfile = React.lazy(() => import('Components/Dashboard/MyProfile'));
const Billing = React.lazy(() =>
  import('Components/Account/BillingFlow/Billing'),
);
const ViewBilling = React.lazy(() =>
  import('Components/Account/BillingFlow/ViewBilling'),
);
const EditBilling = React.lazy(() =>
  import('Components/Account/BillingFlow/EditBilling'),
);
const ReceiptAndPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/ReceiptAndPayment'),
);
const CreateReceiptPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/CreateReceiptPayment'),
);
const AddReceiptPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/AddReceiptPayment'),
);
const EditReceiptPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/EditReceiptPayment'),
);
const ViewReceiptPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/ViewReceiptPayment'),
);
const JournalEntry = React.lazy(() =>
  import('Components/Account/JournalEntry/JournalEntry'),
);
const ViewJournalEntry = React.lazy(() =>
  import('Components/Account/JournalEntry/ViewJournalEntry'),
);
const CreateJournalEntry = React.lazy(() =>
  import('Components/Account/JournalEntry/CreateJournalEntry'),
);
const Expenses = React.lazy(() =>
  import('Components/Account/ExpensesFlow/Expenses'),
);
const EditJournalEntry = React.lazy(() =>
  import('Components/Account/JournalEntry/EditJournalEntry'),
);
const CreateExpenses = React.lazy(() =>
  import('Components/Account/ExpensesFlow/CreateExpenses'),
);
const ViewExpense = React.lazy(() =>
  import('Components/Account/ExpensesFlow/ViewExpenses'),
);
const EditExpense = React.lazy(() =>
  import('Components/Account/ExpensesFlow/EditExpense'),
);
const PurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/PurchaseInvoice'),
);
// const CreatePurchaseInvoice = React.lazy(() =>
//   import('Components/Account/PurchaseInvoice/CreatePurchaseInvoice'),
// );
const AddPurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/AddPurchaseInvoice'),
);
const UpdatePurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/UpdatePurchaseInvoice'),
);
const ViewPurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/ViewPurchaseInvoice'),
);
const Exposing = React.lazy(() => import('Components/Exposing/Exposing'));
const ExposingFlow = React.lazy(() =>
  import('Components/Exposing/ExposingFlow'),
);
// const OrderForm = React.lazy(() => import('Components/Exposing/OrderForm'));
// const Quotation = React.lazy(() => import('Components/Exposing/Quotation'));
// const QuotesApprove = React.lazy(() =>
//   import('Components/Exposing/QuotesApprove'),
// );
// const AssigntoExposer = React.lazy(() =>
//   import('Components/Exposing/AssigntoExposer'),
// );
// const Overview = React.lazy(() => import('Components/Exposing/Overview'));
// const Completed = React.lazy(() => import('Components/Exposing/Completed'));
const Calender = React.lazy(() => import('Components/CalendarView/Index'));
const ForgotPassword = React.lazy(() =>
  import('Components/Auth/ForgotPassword'),
);
const EmailVarification = React.lazy(() =>
  import('Components/Auth/EmailVarification'),
);
const CreatNewPassword = React.lazy(() =>
  import('Components/Auth/CreatNewPassword'),
);
const Login = React.lazy(() => import('Components/Auth/Login'));
const CompanyList = React.lazy(() =>
  import('Components/Setting/CompanyList/CompanyList'),
);
const Subscription = React.lazy(() =>
  import('Components/Setting/Subscription/Subscription'),
);
const SubscriptionPlans = React.lazy(() =>
  import('Components/Setting/Subscription/SubscriptionPlans'),
);
const Payment = React.lazy(() =>
  import('Components/Setting/Subscription/Payment'),
);
const AddCompany = React.lazy(() =>
  import('Components/Setting/CompanyList/AddCompany'),
);
const EditCompany = React.lazy(() =>
  import('Components/Setting/CompanyList/EditCompany'),
);
const Employee = React.lazy(() =>
  import('Components/Setting/Employee/Employee'),
);
const AddEmployee = React.lazy(() =>
  import('Components/Setting/Employee/AddEmployee'),
);
const EditEmployee = React.lazy(() =>
  import('Components/Setting/Employee/EditEmployee'),
);

const EmployeeProfile = React.lazy(() =>
  import('Components/Setting/Employee/EmployeeProfile'),
);

const ClientCompany = React.lazy(() =>
  import('Components/Setting/ClientCompany/ClientCompany'),
);
const CompanyProfile = React.lazy(() =>
  import('Components/Setting/ClientCompany/CompanyProfile'),
);
const ProjectType = React.lazy(() => import('Components/Setting/ProjectType'));
const Product = React.lazy(() => import('Components/Setting/Product'));
const Package = React.lazy(() => import('Components/Setting/Package'));
const RolePermission = React.lazy(() =>
  import('Components/Setting/RolePermission/RolePermission'),
);
const AddRolePermission = React.lazy(() =>
  import('Components/Setting/RolePermission/AddRolePermission'),
);
const EditRolePermission = React.lazy(() =>
  import('Components/Setting/RolePermission/EditRolePermission'),
);
const Reference = React.lazy(() => import('Components/Setting/Reference'));
const Location = React.lazy(() =>
  import('Components/Setting/Location/Location'),
);
const Devices = React.lazy(() => import('Components/Setting/Devices'));
const Currency = React.lazy(() => import('Components/Setting/Currency'));
const SubscriptionStatus = React.lazy(() =>
  import('Components/Setting/SubscriptionStatus'),
);
const UpgradeSubscriptionPlans = React.lazy(() =>
  import(
    'Components/Setting/Subscription/UpgradeSubscription/UpgradeSubscriptionPlans'
  ),
);
const UpgradeSubscriptionPayment = React.lazy(() =>
  import(
    'Components/Setting/Subscription/UpgradeSubscription/UpgradeSubscriptionPayment'
  ),
);
const Account = React.lazy(() => import('Components/Setting/Account'));
const Group = React.lazy(() => import('Components/Setting/Group'));
const DataCollection = React.lazy(() =>
  import('Components/Editing/DataCollection/DataCollection'),
);
const AddDataCollection = React.lazy(() =>
  import('Components/Editing/DataCollection/AddDataCollection'),
);
const EditDataCollection = React.lazy(() =>
  import('Components/Editing/DataCollection/EditDataCollection'),
);
const Editing = React.lazy(() =>
  import('Components/Editing/EditingFlow/Editing'),
);
const EditingFlow = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingFlow'),
);
const EditingDataCollection = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingDataCollection'),
);
const EditingQuotation = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingQuotation'),
);
const EditingQuotesApprove = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingQuotesApprove'),
);
const EditingAssign = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingAssign'),
);
const EditingOverview = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingOverview'),
);
const EditingCompleted = React.lazy(() =>
  import('Components/Editing/EditingFlow/EditingCompleted'),
);
const ClientDashboard = React.lazy(() =>
  import('Components/ClientView/Dashboard/ClientDashboard'),
);
const AssignedProjects = React.lazy(() =>
  import('Components/UserDashboard/AssignedWorked/AssignedProjects'),
);
const AddEditAssignedProjects = React.lazy(() =>
  import('Components/UserDashboard/AssignedWorked/AddEditAssignedProjects'),
);
const ProjectWorkEditing = React.lazy(() =>
  import('Components/UserDashboard/AssignedWorked/ProjectWorkEditing'),
);
const ProjectWorkExposing = React.lazy(() =>
  import('Components/UserDashboard/AssignedWorked/ProjectWorkExposing'),
);
const Projects = React.lazy(() =>
  import('Components/ClientView/Projects/Projects'),
);
const ProjectDetails = React.lazy(() =>
  import('Components/ClientView/Projects/ProjectDetails'),
);
const PaymentDetails = React.lazy(() =>
  import('Components/ClientView/Payment/PaymentDetails'),
);
const Transaction = React.lazy(() =>
  import('Components/ClientView/Payment/Transaction'),
);
const Reporting = React.lazy(() =>
  import('Components/UserDashboard/Reporting/Reporting'),
);
const MyPayment = React.lazy(() =>
  import('Components/UserDashboard/MyFinance/MyPayment'),
);
const Setting = React.lazy(() => import('Components/Setting/Setting'));
const ChangeYear = React.lazy(() =>
  import('Components/Setting/ChangeYear/ChangeYear'),
);
const Reports = React.lazy(() => import('Components/Report/Reports'));
const ProfitAndLoss = React.lazy(() =>
  import('Components/Report/BusinessOverview/ProfitAndLoss'),
);
const BalanceSheet = React.lazy(() =>
  import('Components/Report/BusinessOverview/BalanceSheet'),
);
const Ledger = React.lazy(() => import('Components/Report/Ledger/Ledger'));
const AccountLedger = React.lazy(() =>
  import('Components/Report/Ledger/AccountLedger'),
);
const Trading = React.lazy(() =>
  import('Components/Report/BusinessOverview/Trading'),
);
const EmpTransaction = React.lazy(() =>
  import('Components/Setting/Employee/EmpTransaction'),
);
const AccountHistoryReports = React.lazy(() =>
  import('Components/Report/BusinessOverview/AccountHistoryReports'),
);
const CompanyPermission = React.lazy(() =>
  import('Components/Setting/CompanyPermission/CompanyPermission'),
);
const EditCompanyPermission = React.lazy(() =>
  import('Components/Setting/CompanyPermission/EditCompanyPermission'),
);
const GeneralBilling = React.lazy(() =>
  import('Components/General/GeneralBilling'),
);
const AddGeneralBilling = React.lazy(() =>
  import('Components/General/AddGeneralBilling'),
);
const EditGeneralBilling = React.lazy(() =>
  import('Components/General/EditGeneralBilling'),
);
const ViewGeneralBilling = React.lazy(() =>
  import('Components/General/ViewGeneralBilling'),
);

const route = [
  {
    path: '/',
    component: Login,
    isPrivate: false,
    role: {
      mainModule: '',
      subModule: '',
    },
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    isPrivate: false,
    role: {
      mainModule: '',
      subModule: '',
    },
  },
  {
    path: '/email-varification',
    component: EmailVarification,
    isPrivate: false,
    role: {
      mainModule: '',
      subModule: '',
    },
  },
  {
    path: '/creat-new-password',
    component: CreatNewPassword,
    isPrivate: false,
    role: {
      mainModule: '',
      subModule: '',
    },
  },
  {
    path: '/home',
    component: Homepage,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/inquiry',
    component: Inquiry,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleInquiry,
    },
  },
  {
    path: '/update-inquiry-flow/:id',
    component: InquiryFlow,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleInquiry,
    },
  },
  {
    path: '/create-inquiry',
    component: CreateInquiry,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleInquiry,
    },
  },
  {
    path: '/update-inquiry/:id',
    component: EditInquiry,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleInquiry,
    },
  },
  {
    path: '/announcement',
    component: Announcement,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleAnnouncement,
    },
  },
  {
    path: '/deleted-history',
    component: DeletedHistory,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleDeletedHistory,
    },
  },
  {
    path: '/project-status',
    component: ProjectStatus,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleProjectStatus,
    },
  },
  {
    path: '/employee-reporting',
    component: ReportingSummary,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleEmployeeReporting,
    },
  },
  {
    path: '/user-reporting/:id',
    component: UserReporting,
    isPrivate: true,
    role: {
      mainModule: ACTIVITYOVERVIEW,
      subModule: RoleEmployeeReporting,
    },
  },
  {
    path: '/dashboard',
    component: AdminDashboard,
    isPrivate: true,
    role: {
      mainModule: DASHBOARD,
      subModule: RoleDashboard,
    },
  },
  {
    path: '/user-dashboard',
    component: UserDashboard,
    isPrivate: true,
    role: {
      mainModule: USERDASHBOARD,
      subModule: RoleDashboard,
    },
  },
  {
    path: '/my-profile',
    component: MyProfile,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/conversation',
    component: Chat,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/calender-view',
    component: Calender,
    isPrivate: true,
    role: {
      mainModule: DASHBOARD,
      subModule: RoleDashboard,
    },
  },
  {
    path: '/setting',
    component: Setting,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/general-billing',
    component: GeneralBilling,
    isPrivate: true,
    role: {
      mainModule: GENERAL,
      subModule: RoleGeneral,
    },
  },
  {
    path: '/create-general-billing',
    component: AddGeneralBilling,
    isPrivate: true,
    role: {
      mainModule: GENERAL,
      subModule: RoleGeneral,
    },
  },
  {
    path: '/edit-general-billing/:id',
    component: EditGeneralBilling,
    isPrivate: true,
    role: {
      mainModule: GENERAL,
      subModule: RoleGeneral,
    },
  },
  {
    path: '/view-general-billing/:id',
    component: ViewGeneralBilling,
    isPrivate: true,
    role: {
      mainModule: GENERAL,
      subModule: RoleGeneral,
    },
  },
  {
    path: '/company-list',
    component: CompanyList,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyList,
    },
  },
  {
    path: '/company-permission',
    component: CompanyPermission,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyPermission,
    },
  },
  {
    path: '/edit-company-permission/:id',
    component: EditCompanyPermission,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyPermission,
    },
  },
  {
    path: '/subscription',
    component: Subscription,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyList,
    },
  },
  {
    path: '/subscription-plans',
    component: SubscriptionPlans,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/payment/:planId',
    component: Payment,
    isPrivate: true,
    role: {
      mainModule: ALL,
      subModule: RoleAll,
    },
  },
  {
    path: '/create-company',
    component: AddCompany,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyList,
    },
  },
  {
    path: '/update-company/:id',
    component: EditCompany,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyList,
    },
  },
  {
    path: '/update-company-profile/:id',
    component: EditCompany,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCompanyProfile,
    },
  },
  {
    path: '/employee',
    component: Employee,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleEmployee,
    },
  },
  {
    path: '/create-employee',
    component: AddEmployee,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleEmployee,
    },
  },
  {
    path: '/update-employee/:id',
    component: EditEmployee,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleEmployee,
    },
  },
  {
    path: '/employee-profile/:id',
    component: EmployeeProfile,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleEmployee,
    },
  },
  {
    path: '/client-company',
    component: ClientCompany,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleClientCompany,
    },
  },
  {
    path: '/company-profile/:id',
    component: CompanyProfile,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleClientCompany,
    },
  },
  {
    path: '/project-type',
    component: ProjectType,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleProjectType,
    },
  },
  {
    path: '/product',
    component: Product,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleProduct,
    },
  },
  {
    path: '/package',
    component: Package,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RolePackage,
    },
  },
  {
    path: '/role-permission',
    component: RolePermission,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleRolesPermission,
    },
  },
  {
    path: '/add-role-permission',
    component: AddRolePermission,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleRolesPermission,
    },
  },
  {
    path: '/edit-role-permission/:id',
    component: EditRolePermission,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleRolesPermission,
    },
  },
  {
    path: '/reference',
    component: Reference,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleReference,
    },
  },
  {
    path: '/location',
    component: Location,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleLocation,
    },
  },
  {
    path: '/device',
    component: Devices,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleDevices,
    },
  },
  {
    path: '/currency',
    component: Currency,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleCurrency,
    },
  },
  {
    path: '/subscription-status',
    component: SubscriptionStatus,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleSubscriptionStatus,
    },
  },
  {
    path: '/upgrade-subscription-plans',
    component: UpgradeSubscriptionPlans,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleSubscriptionStatus,
    },
  },
  {
    path: '/upgrade-subscription-payment/:planId',
    component: UpgradeSubscriptionPayment,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleSubscriptionStatus,
    },
  },
  {
    path: '/account',
    component: Account,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleAccount,
    },
  },
  {
    path: '/account-history/:id',
    component: AccountHistory,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleAccount,
    },
  },
  {
    path: '/account-history-reports/:id',
    component: AccountHistoryReports,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/group',
    component: Group,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleGroup,
    },
  },
  {
    path: '/change-year',
    component: ChangeYear,
    isPrivate: true,
    role: {
      mainModule: SETTING,
      subModule: RoleChangeYear,
    },
  },
  {
    path: '/data-collection',
    component: DataCollection,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleDataCollection,
    },
  },
  {
    path: '/add-data-collection',
    component: AddDataCollection,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleDataCollection,
    },
  },
  {
    path: '/update-data-collection/:id',
    component: EditDataCollection,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleDataCollection,
    },
  },
  {
    path: '/editing',
    component: Editing,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleEditingFlow,
    },
  },
  {
    path: '/editing-flow/:id',
    component: EditingFlow,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleEditingFlow,
    },
  },
  // {
  //   path: '/editing-quotation',
  //   component: EditingQuotation,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EDITING,
  //     subModule: RoleEditingFlow,
  //   },
  // },
  // {
  //   path: '/editing-quotation-approve',
  //   component: EditingQuotesApprove,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EDITING,
  //     subModule: RoleEditingFlow,
  //   },
  // },
  // {
  //   path: '/editing-assign',
  //   component: EditingAssign,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EDITING,
  //     subModule: RoleEditingFlow,
  //   },
  // },
  // {
  //   path: '/editing-overview',
  //   component: EditingOverview,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EDITING,
  //     subModule: RoleEditingFlow,
  //   },
  // },
  // {
  //   path: '/editing-completed',
  //   component: EditingCompleted,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EDITING,
  //     subModule: RoleEditingFlow,
  //   },
  // },
  {
    path: '/billing',
    component: Billing,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleBilling,
    },
  },
  {
    path: '/view-billing/:id',
    component: ViewBilling,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleBilling,
    },
  },
  {
    path: '/edit-billing/:id',
    component: EditBilling,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleBilling,
    },
  },
  {
    path: '/receipt-payment',
    component: ReceiptAndPayment,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleReceiptPayment,
    },
  },
  {
    path: '/create-receipt-payment',
    component: AddReceiptPayment,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleReceiptPayment,
    },
  },
  {
    path: '/edit-receipt-payment/:id',
    component: EditReceiptPayment,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleReceiptPayment,
    },
  },
  {
    path: '/view-receipt-payment/:id',
    component: ViewReceiptPayment,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleReceiptPayment,
    },
  },
  {
    path: '/journal-entry',
    component: JournalEntry,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleJournalEntry,
    },
  },
  {
    path: '/view-journal-entry/:id',
    component: ViewJournalEntry,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleJournalEntry,
    },
  },
  {
    path: '/create-journal-entry',
    component: CreateJournalEntry,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleJournalEntry,
    },
  },
  {
    path: '/edit-journal-entry/:id',
    component: EditJournalEntry,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleJournalEntry,
    },
  },
  {
    path: '/expenses',
    component: Expenses,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleExpenses,
    },
  },
  {
    path: '/create-expenses',
    component: CreateExpenses,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleExpenses,
    },
  },
  {
    path: '/view-expenses/:id',
    component: ViewExpense,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleExpenses,
    },
  },
  {
    path: '/edit-expenses/:id',
    component: EditExpense,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RoleExpenses,
    },
  },
  {
    path: '/purchase-invoice',
    component: PurchaseInvoice,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RolePurchaseInvoice,
    },
  },
  {
    path: '/create-purchase-invoice',
    component: AddPurchaseInvoice,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RolePurchaseInvoice,
    },
  },
  {
    path: '/edit-purchase-invoice/:id',
    component: UpdatePurchaseInvoice,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RolePurchaseInvoice,
    },
  },
  {
    path: '/view-purchase-invoice/:id',
    component: ViewPurchaseInvoice,
    isPrivate: true,
    role: {
      mainModule: ACCOUNT,
      subModule: RolePurchaseInvoice,
    },
  },
  {
    path: '/exposing',
    component: Exposing,
    isPrivate: true,
    role: {
      mainModule: EXPOSING,
      subModule: RoleExposing,
    },
  },
  {
    path: '/exposing-flow/:id',
    component: ExposingFlow,
    isPrivate: true,
    role: {
      mainModule: EDITING,
      subModule: RoleEditingFlow,
    },
  },
  {
    path: '/reports',
    component: Reports,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/profit-loss',
    component: ProfitAndLoss,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/balance-sheet',
    component: BalanceSheet,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/account-ledger',
    component: AccountLedger,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/ledger/:id',
    component: Ledger,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  {
    path: '/trading',
    component: Trading,
    isPrivate: true,
    role: {
      mainModule: REPORT,
      subModule: RoleReport,
    },
  },
  // {
  //   path: '/order-form',
  //   component: OrderForm,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  // {
  //   path: '/quotation',
  //   component: Quotation,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  // {
  //   path: '/quotes-approve',
  //   component: QuotesApprove,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  // {
  //   path: '/assign-to-exposer',
  //   component: AssigntoExposer,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  // {
  //   path: '/overview',
  //   component: Overview,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  // {
  //   path: '/completed',
  //   component: Completed,
  //   isPrivate: true,
  //   role: {
  //     mainModule: EXPOSING,
  //     subModule: RoleExposing,
  //   },
  // },
  {
    path: '/client-dashboard',
    component: ClientDashboard,
    isPrivate: true,
    role: {
      mainModule: CLIENTDASHBOARD,
      subModule: RoleDashboard,
    },
  },
  {
    path: '/assigned-projects',
    component: AssignedProjects,
    isPrivate: true,
    role: {
      // mainModule: ACTIVITYOVERVIEW,
      // subModule: RoleInquiry,
      mainModule: ASSIGNEDWORKED,
      subModule: RoleAssignedWorked,
    },
  },
  {
    path: '/project-work-editing/:id',
    component: ProjectWorkEditing,
    isPrivate: true,
    role: {
      mainModule: ASSIGNEDWORKED,
      subModule: RoleAssignedWorked,
    },
  },
  {
    path: '/project-work-exposing/:id',
    component: ProjectWorkExposing,
    isPrivate: true,
    role: {
      mainModule: ASSIGNEDWORKED,
      subModule: RoleAssignedWorked,
    },
  },
  {
    path: '/add-edit-assigned-projects',
    component: AddEditAssignedProjects,
    isPrivate: true,
    role: {
      // mainModule: ACTIVITYOVERVIEW,
      // subModule: RoleInquiry,
      mainModule: ASSIGNEDWORKED,
      subModule: RoleAssignedWorked,
    },
  },
  {
    path: '/projects',
    component: Projects,
    isPrivate: true,
    role: {
      mainModule: PROJECTS,
      subModule: RoleProject,
    },
  },
  {
    path: '/project-details/:id',
    component: ProjectDetails,
    isPrivate: true,
    role: {
      mainModule: PROJECTS,
      subModule: RoleProject,
    },
  },
  {
    path: '/payment-details',
    component: PaymentDetails,
    isPrivate: true,
    role: {
      mainModule: PAYMENT,
      subModule: RolePaymentDetails,
    },
  },
  {
    path: '/my-transaction',
    component: Transaction,
    isPrivate: true,
    role: {
      mainModule: PAYMENT,
      subModule: RoleTransaction,
    },
  },
  {
    path: '/reporting',
    component: Reporting,
    isPrivate: true,
    role: {
      mainModule: REPORTING,
      subModule: RoleReporting,
    },
  },
  {
    path: '/my-pay',
    component: MyPayment,
    isPrivate: true,
    role: {
      mainModule: MYFINANCE,
      subModule: RoleMyPay,
    },
  },
  {
    path: '/transaction',
    component: EmpTransaction,
    isPrivate: true,
    role: {
      mainModule: MYFINANCE,
      subModule: RoleTransactionEmployee,
    },
  },
];

export default route;
