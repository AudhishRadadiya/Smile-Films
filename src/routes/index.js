import React, { Suspense } from 'react';
import AuthLayout from 'Components/Common/AuthLayout';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// import { createPopper } from '@popperjs/core';
import { createPopperLite as createPopper } from '@popperjs/core';
import '../Assets/scss/Style.scss';
import Loader from 'Components/Common/Loader';
import EditEmployee from 'Components/Setting/Employee/EditEmployee';
import EditCompany from 'Components/Setting/CompanyList/EditCompany';
import route from 'Configs/RoutesConfig';
import PrivateRoute from 'Configs/PrivateRoute';
import PublicRoute from 'Configs/PublicRoute';
const Homepage = React.lazy(() => import('Components/Home/Index'));
const Chat = React.lazy(() => import('Components/Chat/Chat'));
const Inquiry = React.lazy(() => import('Components/ActivityOverview/Inquiry'));
const CreateInquiry = React.lazy(() =>
  import('Components/ActivityOverview/CreateInquiry'),
);
const Announcement = React.lazy(() =>
  import('Components/ActivityOverview/Announcement'),
);
const DeletedHistory = React.lazy(() =>
  import('Components/ActivityOverview/DeletedHistory'),
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
const Dashboard = React.lazy(() => import('Components/Dashboard/Dashboard'));
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
const ReceiptAndPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/ReceiptAndPayment'),
);
const CreateReceiptPayment = React.lazy(() =>
  import('Components/Account/Receipt&Payment/CreateReceiptPayment'),
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
  import('Components/Account/ExpensesFlow/ViewExpense'),
);
const PurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/PurchaseInvoice'),
);
const CreatePurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/CreatePurchaseInvoice'),
);
const ViewPurchaseInvoice = React.lazy(() =>
  import('Components/Account/PurchaseInvoice/ViewPurchaseInvoice'),
);
const Exposing = React.lazy(() => import('Components/Exposing/Exposing'));
const OrderForm = React.lazy(() => import('Components/Exposing/OrderForm'));
const Quotation = React.lazy(() => import('Components/Exposing/Quotation'));
const QuotesApprove = React.lazy(() =>
  import('Components/Exposing/QuotesApprove'),
);
const AssigntoExposer = React.lazy(() =>
  import('Components/Exposing/AssigntoExposer'),
);
const Overview = React.lazy(() => import('Components/Exposing/Overview'));
const Completed = React.lazy(() => import('Components/Exposing/Completed'));
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
const AddCompanyList = React.lazy(() =>
  import('Components/Setting/CompanyList/AddCompany'),
);
const Employee = React.lazy(() =>
  import('Components/Setting/Employee/Employee'),
);
const AddEmployee = React.lazy(() =>
  import('Components/Setting/Employee/AddEmployee'),
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
const Reference = React.lazy(() => import('Components/Setting/Reference'));
const Location = React.lazy(() =>
  import('Components/Setting/Location/Location'),
);
const Devices = React.lazy(() => import('Components/Setting/Devices'));
const Currency = React.lazy(() => import('Components/Setting/Currency'));
const Account = React.lazy(() => import('Components/Setting/Account'));
const Group = React.lazy(() => import('Components/Setting/Group'));
const DataCollection = React.lazy(() =>
  import('Components/Editing/DataCollection/DataCollection'),
);
const AddDataCollection = React.lazy(() =>
  import('Components/Editing/DataCollection/AddDataCollection'),
);
const Editing = React.lazy(() =>
  import('Components/Editing/EditingFlow/Editing'),
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
const MyPay = React.lazy(() =>
  import('Components/UserDashboard/MyFinance/MyPay'),
);

export default function Index() {
  const popcorn = document.querySelector('#popcorn');
  const tooltip = document.querySelector('#tooltip');
  createPopper(popcorn, tooltip, {
    placement: 'top',
  });
  return (
    <>
      <Suspense fallback={<Loader />}>
        {/* <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-varification" element={<EmailVarification />} />
          <Route path="/creat-new-password" element={<CreatNewPassword />} />
          <Route element={<AuthLayout />}>
            <Route path="/home" element={<Homepage />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/create-inquiry" element={<CreateInquiry />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/deleted-history" element={<DeletedHistory />} />
            <Route path="/project-status" element={<ProjectStatus />} />
            <Route path="/employee-reporting" element={<ReportingSummary />} />
            <Route path="/user-reporting" element={<UserReporting />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/conversation" element={<Chat />} />
            <Route path="/calender-view" element={<Calender />} />
            <Route path="/company-list" element={<CompanyList />} />
            <Route path="/create-company" element={<AddCompanyList />} />
            <Route path="/update-company/:id" element={<EditCompany />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/create-employee" element={<AddEmployee />} />
            <Route path="/update-employee/:id" element={<EditEmployee />} />
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route path="/client-company" element={<ClientCompany />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/project-type" element={<ProjectType />} />
            <Route path="/product" element={<Product />} />
            <Route path="/package" element={<Package />} />
            <Route path="/role-permission" element={<RolePermission />} />
            <Route
              path="/add-role-permission"
              element={<AddRolePermission />}
            />
            <Route
              path="/edit-role-permission/:id"
              element={<AddRolePermission />}
            />
            <Route path="/reference" element={<Reference />} />
            <Route path="/location" element={<Location />} />
            <Route path="/device" element={<Devices />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/account" element={<Account />} />
            <Route path="/group" element={<Group />} />
            <Route path="/data-collection" element={<DataCollection />} />
            <Route
              path="/add-data-collection"
              element={<AddDataCollection />}
            />
            <Route path="/editing" element={<Editing />} />
            <Route
              path="/editing-flow"
              element={<EditingDataCollection />}
            />
            <Route path="/editing-quotation" element={<EditingQuotation />} />
            <Route
              path="/editing-quotation-approve"
              element={<EditingQuotesApprove />}
            />
            <Route path="/editing-assign" element={<EditingAssign />} />
            <Route path="/editing-overview" element={<EditingOverview />} />
            <Route path="/editing-completed" element={<EditingCompleted />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/view-billing" element={<ViewBilling />} />
            <Route path="/receipt-payment" element={<ReceiptAndPayment />} />
            <Route
              path="/create-receipt-payment"
              element={<CreateReceiptPayment />}
            />
            <Route
              path="/view-receipt-payment"
              element={<ViewReceiptPayment />}
            />
            <Route path="/journal-entry" element={<JournalEntry />} />
            <Route path="/view-journal-entry" element={<ViewJournalEntry />} />
            <Route
              path="/create-journal-entry"
              element={<CreateJournalEntry />}
            />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/create-expenses" element={<CreateExpenses />} />
            <Route path="/view-expenses" element={<ViewExpense />} />
            <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
            <Route
              path="/create-purchase-invoice"
              element={<CreatePurchaseInvoice />}
            />
            <Route
              path="/view-purchase-invoice"
              element={<ViewPurchaseInvoice />}
            />
            <Route path="/exposing" element={<Exposing />} />
            <Route path="/order-form" element={<OrderForm />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/quotes-approve" element={<QuotesApprove />} />
            <Route path="/assign-to-exposer" element={<AssigntoExposer />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/assigned-projects" element={<AssignedProjects />} />
            <Route
              path="/add-edit-assigned-projects"
              element={<AddEditAssignedProjects />}
            />
            <Route path="/projects" element={<Projects />} />
            <Route path="/Project-details" element={<ProjectDetails />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/my-pay" element={<MyPay />} />
          </Route>
        </Routes> */}

        {/* <Routes>
          {route.map((data, index) =>
            data?.isPrivate ? (
              <PrivateRoute
                path={data?.path}
                element={data?.element}
                // authenticated={authenticated}
              >
                {data}
              </PrivateRoute>
            ) : (
              <PublicRoute path={data?.path} element={data?.element} />
            ),
          )}
        </Routes> */}
      </Suspense>
    </>
  );
}
