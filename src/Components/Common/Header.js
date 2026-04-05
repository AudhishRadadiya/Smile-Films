import { clearToken, getAuthToken, saveToken } from 'Helper/AuthTokenHelper';
import { logout } from 'Store/Reducers/Auth/ProfileSlice';
import {
  clearNotification,
  getNotificationList,
  notificationSubscribe,
  notificationUnSubscribe,
  readNotification,
  readSingleNotification,
  setAllowNotificationToggle,
  setNotificationPermissionDialogVisible,
} from 'Store/Reducers/Notification/NotificationSlice';
import _ from 'lodash';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputSwitch } from 'primereact/inputswitch';
import { Sidebar } from 'primereact/sidebar';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Account from '../../Assets/Images/account.svg';
import activityOverview from '../../Assets/Images/activity-overview.svg';
import Announcement from '../../Assets/Images/announcement.svg';
import AssignedWork from '../../Assets/Images/assigned-work.svg';
import Billing from '../../Assets/Images/billing.svg';
import ChatIcon from '../../Assets/Images/chat.svg';
import CloseIcon from '../../Assets/Images/close.svg';
import Dashboard from '../../Assets/Images/dashboard.svg';
import DataCollection from '../../Assets/Images/data-collection.svg';
import DeletedHistory from '../../Assets/Images/delete-history.svg';
import EditingFlow from '../../Assets/Images/editing-flow.svg';
import Editing from '../../Assets/Images/editing.svg';
import EmployeeReporting from '../../Assets/Images/employee-repoting.svg';
import Expenses from '../../Assets/Images/expenses.svg';
import Exposing from '../../Assets/Images/exposing.svg';
import Inquiry from '../../Assets/Images/inquiry.svg';
import JournalEntry from '../../Assets/Images/journal-entry.svg';
import Logo from '../../Assets/Images/logo.svg';
import Notifiaction from '../../Assets/Images/notification.svg';
import PaymentDetails from '../../Assets/Images/payment-details.svg';
import Payment from '../../Assets/Images/payment.svg';
import ProjectStatus from '../../Assets/Images/project-status.svg';
import Project from '../../Assets/Images/project.svg';
import PurchaseInvoice from '../../Assets/Images/purchase-invoice.svg';
import ReceiptPayment from '../../Assets/Images/receipt-payment.svg';
import Reports from '../../Assets/Images/report.svg';
import Repoting from '../../Assets/Images/repoting.svg';
import Search from '../../Assets/Images/search.svg';
import Setting from '../../Assets/Images/setting.svg';
import Transaction from '../../Assets/Images/transaction.svg';
import ChangePassWord from './ChangePassWord';
import { checkPermissionForLandingPage } from 'Helper/CommonHelper';
import { SelectButton } from 'primereact/selectbutton';
import { login, setUserPermissions } from 'Store/Reducers/Auth/authSlice';
import Loader from './Loader';
import Cookies from 'js-cookie';
import {
  setActiveTabs,
  setSwitchedUser,
} from 'Store/Reducers/Common/CommonSlice';
import NotificationPermissionDialog from './NotificationPermissionDialog';

const checkIsEmpty = data => {
  return _.isEmpty(data);
};

const items = [
  {
    label: 'Add',
    template: (item, options) => {
      return (
        <div className="saerch_input form_group">
          <InputText placeholder="Search" />
          <Button className="btn_transperant">
            <img src={Search} alt="" />
          </Button>
        </div>
      );
    },
  },
];

let rightsSessionList = [
  '/home',
  '/my-transaction',
  '/inquiry',
  '/project-status',
  '/employee-reporting',
  '/user-reporting',
  '/dashboard',
  '/calender-view',
  '/conversation',
  '/create-inquiry',
  '/update-inquiry-flow',
  '/billing',
  '/add-edit-company-list',
  '/view-billing',
  '/edit-billing',
  '/receipt-payment',
  '/create-receipt-payment',
  '/view-receipt-payment',
  '/edit-receipt-payment',
  '/journal-entry',
  '/view-journal-entry',
  '/create-journal-entry',
  '/edit-journal-entry',
  '/expenses',
  '/create-expenses',
  '/edit-expenses',
  '/view-expenses',
  '/purchase-invoice',
  '/create-purchase-invoice',
  '/edit-purchase-invoice',
  '/view-purchase-invoice',
  '/general-billing',
  '/create-general-billing',
  '/edit-general-billing',
  '/view-general-billing',
  '/exposing',
  '/exposing-flow',
  '/order-form',
  '/company-list',
  '/company-permission',
  '/edit-company-permission',
  '/subscription',
  '/create-company',
  '/employee',
  '/create-employee',
  '/client-company',
  '/project-type',
  '/product',
  '/package',
  '/role-permission',
  '/add-role-permission',
  '/edit-role-permission',
  '/reference',
  '/location',
  '/device',
  '/currency',
  '/account',
  '/group',
  '/quotation',
  '/quotes-approve',
  '/assign-to-exposer',
  '/overview',
  '/completed',
  '/employee-profile',
  '/company-profile',
  '/data-collection',
  '/add-data-collection',
  '/editing',
  '/client-dashboard',
  '/assigned-projects',
  '/project-work-editing',
  '/project-work-exposing',
  '/add-edit-assigned-projects',
  '/projects',
  '/project-details',
  '/payment-details',
  '/my-transaction',
  '/user-dashboard',
  '/reporting',
  '/my-pay',
  '/my-profile',
  '/update-employee',
  '/update-company',
  '/update-company-profile',
  '/announcement',
  '/deleted-history',
  '/editing-flow',
  '/editing-quotation',
  '/editing-quotation-approve',
  '/editing-assign',
  '/editing-overview',
  '/editing-completed',
  '/setting',
  '/subscription-status',
  '/upgrade-subscription-plans',
  '/upgrade-subscription-payment',
  '/update-inquiry',
  '/update-data-collection',
  '/change-year',
  '/reports',
  '/profit-loss',
  '/balance-sheet',
  '/account-ledger',
  '/ledger',
  '/trading',
  '/account-history',
  '/account-history-reports',
];

const NavTab = () => {
  const scrollHere = useRef(null);
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const locationPath = pathname?.split('/');

  const currentUserData = getAuthToken();

  const { activeTabs } = useSelector(({ common }) => common);

  // const [state, setState] = useState({
  //   tabs: [
  //     // {
  //     //   // name: locationPath?.length > 2 ? locationPath[2] : locationPath[1],
  //     //   // name: locationPath[1],
  //     //   // largePath: locationPath?.length > 2 ? pathname : null,
  //     // },
  //   ],
  //   currentTab: {
  //     // name: locationPath?.length > 2 ? locationPath[2] : locationPath[1],
  //     // name: locationPath[1],
  //     // largePath: locationPath?.length > 2 ? pathname : null,
  //   },
  // });

  useEffect(() => {
    if (scrollHere.current) {
      scrollHere.current.scrollIntoView();
    }
  });

  const createTabs = () => {
    const { tabs, currentTab } = activeTabs;
    let tabView = [];

    tabs?.forEach(item => {
      let obj = rightsSessionList?.find(item2 => item2?.includes(item?.name));
      if (obj) {
        tabView?.push(item);
      }
    });

    const allTabs =
      !checkIsEmpty(tabView) &&
      tabView?.map((tab, i) => {
        return (
          <NavItem key={i}>
            {currentTab?.name === tab?.name ? <div ref={scrollHere}></div> : ''}
            <NavLink
              className={`${currentTab?.name === tab?.name ? 'active' : ''} ${
                tabView?.length === 1 ? 'last_active_tab' : ''
              }`}
              onClick={e => handleSelectTab(e, tab)}
            >
              <span className="d-inline-flex align-items-center justify-content-between w-100">
                <span className="link_text">
                  {!checkIsEmpty(tab) && tab?.name === ''
                    ? 'Home'
                    : tab?.name === 'receipt-payment'
                    ? tab?.name && String(tab?.name)?.replaceAll('-', ' / ')
                    : // : tab?.name && String(tab?.name)?.replaceAll('-', ' ')}
                      tab?.name && tab?.name?.split('-')?.join(' ')}
                </span>
                <span className="close_icon">
                  <img
                    src={CloseIcon}
                    alt=""
                    onClick={e => handleDeleteTab(e, tab)}
                  />
                </span>
              </span>
            </NavLink>
          </NavItem>
        );
      });

    return (
      <Nav pills={'true'} className={'gy-2 nav-scrollable'}>
        {allTabs}
      </Nav>
    );
  };

  const handleAddTab = () => {
    const { tabs } = activeTabs;
    // const newTabObject = {
    //   name: locationPath?.length > 2 ? locationPath?.[2] : locationPath?.[1],
    //   content: `This is Tab ${tabs?.length + 1}`,
    //   largePath: locationPath?.length > 2 ? pathname : null,
    // };
    const newTabObject = {
      name: locationPath?.[1],
      content: `This is Tab ${tabs?.length + 1}`,
      largePath: locationPath?.length > 2 ? pathname : null,
    };
    // !((configAppConst.appTabs).includes((locationPath.length > 2) ? locationPath[2] : locationPath[1]))
    if (tabs?.[0]?.name === 'login') {
      // setState({
      //   tabs: [newTabObject],
      //   currentTab: newTabObject,
      // });
      dispatch(
        setActiveTabs({
          tabs: [newTabObject],
          currentTab: newTabObject,
        }),
      );
    } else {
      if (activeTabs?.tabs?.length <= 100) {
        // setState({
        //   tabs: [...tabs, newTabObject],
        //   currentTab: newTabObject,
        // });
        dispatch(
          setActiveTabs({
            tabs: [...tabs, newTabObject],
            currentTab: newTabObject,
          }),
        );
      } else {
        tabs?.splice(0, 1);
        // setState({
        //   tabs: [...tabs, newTabObject],
        //   currentTab: newTabObject,
        // });
        dispatch(
          setActiveTabs({
            tabs: [...tabs, newTabObject],
            currentTab: newTabObject,
          }),
        );
      }
    }
  };

  useEffect(() => {
    if (
      // state?.tabs?.filter(
      //   item =>
      //     item?.name ===
      //     (item?.largePath !== null ? locationPath?.[2] : locationPath?.[1]),
      // )?.length <= 0
      activeTabs?.tabs?.filter(item => item?.name === locationPath?.[1])
        ?.length <= 0
    ) {
      handleAddTab();
    } else {
      // let selectBySidebare = {
      //   name: locationPath?.length > 2 ? locationPath?.[2] : locationPath?.[1],
      //   largePath: locationPath?.length > 2 ? pathname : null,
      // };
      // setState({ ...state, currentTab: selectBySidebare });
      let selectBySidebare = {
        name: locationPath?.[1],
        largePath: locationPath?.length > 2 ? pathname : null,
      };
      let index = activeTabs?.tabs?.findIndex(
        x => x?.name === locationPath?.[1],
      );

      let cloneTabs = [...activeTabs.tabs];

      if (index >= 0)
        cloneTabs[index] = {
          ...cloneTabs[index],
          largePath: locationPath?.length > 2 ? pathname : null,
        };
      // setState({ ...cloneTabs, currentTab: selectBySidebare });
      dispatch(
        setActiveTabs({
          tabs: cloneTabs,
          currentTab: selectBySidebare,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locationPath?.length, activeTabs?.tabs?.length]);

  const handleDeleteTab = (e, tabToDelete) => {
    e.preventDefault();
    e.stopPropagation();
    const { tabs, currentTab } = activeTabs;

    if (tabs?.length <= 1) {
      const checkedPermissionData =
        checkPermissionForLandingPage(currentUserData);

      if ([1, 2].includes(currentUserData?.role)) {
        // SuperAdmin or SubAdmin
        if (currentTab.name !== 'home') {
          // setState({
          //   tabs: [],
          //   currentTab: { name: '', largePath: null },
          // });
          dispatch(
            setActiveTabs({
              tabs: [],
              currentTab: { name: '', largePath: null },
            }),
          );
          navigate(checkedPermissionData?.path);
        }
      } else if (currentUserData?.role === 3) {
        // Employee
        if (currentTab.name !== 'user-dashboard') {
          // setState({
          //   tabs: [],
          //   currentTab: { name: '', largePath: null },
          // });
          dispatch(
            setActiveTabs({
              tabs: [],
              currentTab: { name: '', largePath: null },
            }),
          );
          navigate(checkedPermissionData?.path);
        }
      } else if (currentUserData?.role === 4) {
        // Client
        if (currentTab.name !== 'client-dashboard') {
          // setState({
          //   tabs: [],
          //   currentTab: { name: '', largePath: null },
          // });
          dispatch(
            setActiveTabs({
              tabs: [],
              currentTab: { name: '', largePath: null },
            }),
          );
          navigate(checkedPermissionData?.path);
        }
      }
    } else {
      const tabToDeleteIndex = tabs?.findIndex(
        tab => tab.name === tabToDelete.name,
      );
      const updatedTabs = tabs?.filter((tab, index) => {
        return index !== tabToDeleteIndex;
      });
      const previousTab =
        tabs?.[tabToDeleteIndex - 1] || tabs?.[tabToDeleteIndex + 1] || {};
      if (currentTab?.name === tabToDelete?.name) {
        // setState({
        //   tabs: updatedTabs,
        //   currentTab: previousTab,
        // });
        dispatch(
          setActiveTabs({
            tabs: updatedTabs,
            currentTab: previousTab,
          }),
        );
        if (previousTab?.largePath !== null) {
          navigate(`${previousTab?.largePath}`);
        } else {
          navigate(`/${previousTab?.name}`);
        }
      } else {
        // setState({
        //   ...state,
        //   tabs: updatedTabs,
        // });
        dispatch(
          setActiveTabs({
            ...activeTabs,
            tabs: updatedTabs,
          }),
        );
        if (currentTab?.largePath !== null) {
          navigate(`${currentTab?.largePath}`);
        } else {
          navigate(`/${currentTab?.name}`);
        }
      }
    }
  };

  const handleSelectTab = (e, tab) => {
    e.preventDefault();
    e.stopPropagation();

    // setState({
    //   ...state,
    //   currentTab: tab,
    // });
    dispatch(
      setActiveTabs({
        ...activeTabs,
        currentTab: tab,
      }),
    );
    if (tab?.largePath !== null) {
      navigate(`${tab?.largePath}`);
    } else {
      navigate(`/${tab?.name}`);
    }
  };

  return <>{createTabs()}</>;
};

const Header = () => {
  const op = useRef(null);
  const dispatch = useDispatch();
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const userData = getAuthToken();
  let { pathname } = useLocation();

  const switchUserOptions = ['Admin', 'Employee'];

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [loginUserData, setLoginUserData] = useState({
    profile_logo: '',
    name: '',
  });
  const { switchedUser } = useSelector(({ common }) => common);
  const { chatMessageCount } = useSelector(({ chat }) => chat);
  const { userPermissions, loginLoading } = useSelector(({ auth }) => auth);
  const { currentUser } = useSelector(({ profile }) => profile);
  const {
    notificationList,
    notificationPageLimit,
    notificationCurrentPage,
    allowNotificationToggle,
    notificationPermissionDialogVisible,
  } = useSelector(({ notification }) => notification);

  const handleOptionClickEvent = (e, options) => {
    options?.onClick(e);
  };

  const debounceHandleClickEvent = useCallback(
    _.debounce(handleOptionClickEvent, 50),
    [],
  );

  const headerAndSideMenuItems = useMemo(() => {
    return [
      {
        className: `${
          pathname === '/dashboard' ||
          pathname === '/user-dashboard' ||
          pathname === '/client-dashboard'
            ? 'active'
            : ''
        }`,
        itemName: 'Dashboard',
        icon: Dashboard,
        navigateTo:
          userData?.role === 1 || userData?.role === 2
            ? '/dashboard'
            : userData?.role === 3
            ? '/user-dashboard'
            : '/client-dashboard',
        subItems: [],
      },
      {
        className: `${
          pathname === '/inquiry' ||
          pathname === '/project-status' ||
          pathname === '/employee-reporting' ||
          pathname === '/user-reporting' ||
          pathname === '/create-inquiry'
            ? 'active'
            : ''
        }`,
        itemName: 'Activity Overview',
        icon: activityOverview,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/inquiry' || pathname === '/create-inquiry'
                ? 'active'
                : ''
            }`,
            itemName: 'Inquiry',
            resName: 'inquiry',
            icon: Inquiry,
            navigateTo: '/inquiry',
          },
          {
            className: `${pathname === '/project-status' ? 'active' : ''}`,
            itemName: 'Project Status',
            resName: 'project-status',
            icon: ProjectStatus,
            navigateTo: '/project-status',
          },
          {
            className: `${
              pathname === '/employee-reporting' ||
              pathname === '/user-reporting'
                ? 'active'
                : ''
            }`,
            itemName: 'Employee Reporting',
            resName: 'employee-reporting',
            icon: EmployeeReporting,
            navigateTo: '/employee-reporting',
          },
          {
            className: `${pathname === '/announcement' ? 'active' : ''}`,
            itemName: 'Announcement',
            resName: 'announcement',
            icon: Announcement,
            navigateTo: '/announcement',
          },
          {
            className: `${pathname === '/deleted-history' ? 'active' : ''}`,
            itemName: 'Deleted History',
            resName: 'deleted-history',
            icon: DeletedHistory,
            navigateTo: '/deleted-history',
          },
        ],
      },
      {
        className: `${
          pathname === '/data-collection' ||
          pathname === '/add-data-collection' ||
          pathname === '/editing' ||
          pathname === '/editing-quotation' ||
          pathname === '/editing-quotation-approve' ||
          pathname === '/editing-assign' ||
          pathname === '/editing-overview' ||
          pathname === '/editing-completed' ||
          pathname === '/editing-flow'
            ? 'active'
            : ''
        }`,
        itemName: 'Editing',
        icon: Editing,
        navigateTo: '',
        subItems: [
          {
            className: `${
              pathname === '/data-collection' ||
              pathname === '/add-data-collection'
                ? 'active'
                : ''
            }`,
            itemName: 'Data Collection',
            resName: 'data-collection',
            icon: DataCollection,
            navigateTo: '/data-collection',
          },
          {
            className: `${
              pathname === '/editing' ||
              pathname === '/editing-quotation' ||
              pathname === '/editing-quotation-approve' ||
              pathname === '/editing-assign' ||
              pathname === '/editing-overview' ||
              pathname === '/editing-completed' ||
              pathname === '/editing-flow'
                ? 'active'
                : ''
            }`,
            itemName: 'Editing Flow',
            resName: 'editing-flow',
            icon: EditingFlow,
            navigateTo: '/editing',
          },
        ],
      },
      {
        className: `${
          pathname === '/exposing' ||
          pathname === '/order-form' ||
          pathname === '/quotation' ||
          pathname === '/quotes-approve' ||
          pathname === '/assign-to-exposer' ||
          pathname === '/overview' ||
          pathname === '/completed'
            ? 'active'
            : ''
        }`,
        itemName: 'Exposing',
        icon: Exposing,
        navigateTo: '/exposing',
        subItems: [],
      },
      {
        className: `${
          pathname === '/billing' ||
          pathname === '/view-billing' ||
          pathname === '/edit-billing' ||
          pathname === '/record-receipt-payment' ||
          pathname === '/payment' ||
          pathname === '/journal-entry' ||
          pathname === '/create-journal-entry' ||
          pathname === '/view-journal-entry' ||
          pathname === '/edit-journal-entry' ||
          pathname === '/expenses' ||
          pathname === '/create-expenses' ||
          pathname === '/view-expenses' ||
          pathname === '/edit-expenses' ||
          pathname === '/receipt-payment' ||
          pathname === '/create-receipt-payment' ||
          pathname.includes('/edit-receipt-payment') ||
          pathname.includes('/view-receipt-payment') ||
          pathname === '/purchase-invoice' ||
          pathname === '/create-purchase-invoice' ||
          pathname.includes('/edit-purchase-invoice') ||
          pathname.includes('/view-purchase-invoice')
            ? 'active'
            : ''
        }`,
        itemName: 'Account',
        icon: Account,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/billing' ? 'active' : ''}`,
            itemName: 'Billing',
            resName: 'billing',
            icon: Billing,
            navigateTo: '/billing',
          },
          {
            className: `${
              pathname === '/receipt-payment' ||
              pathname === '/create-receipt-payment' ||
              pathname.includes('/edit-receipt-payment') ||
              pathname.includes('/view-receipt-payment')
                ? 'active'
                : ''
            }`,
            itemName: 'Receipt / Payment',
            resName: 'receipt-payment',
            icon: ReceiptPayment,
            navigateTo: '/receipt-payment',
          },
          {
            className: `${pathname === '/journal-entry' ? 'active' : ''}`,
            itemName: 'Journal Entry',
            resName: 'journal-entry',
            icon: JournalEntry,
            navigateTo: '/journal-entry',
          },
          {
            className: `${pathname === '/expenses' ? 'active' : ''}`,
            itemName: 'Expenses',
            resName: 'expenses',
            icon: Expenses,
            navigateTo: '/expenses',
          },
          {
            className: `${
              pathname === '/purchase-invoice' ||
              pathname === '/create-purchase-invoice' ||
              pathname.includes('/edit-purchase-invoice') ||
              pathname.includes('/view-purchase-invoice')
                ? 'active'
                : ''
            }`,
            itemName: 'Purchase Invoice',
            resName: 'purchase-invoice',
            icon: PurchaseInvoice,
            navigateTo: '/purchase-invoice',
          },
        ],
      },
      {
        className: `${
          pathname === '/reports' || pathname === '/profit-loss' ? 'active' : ''
        }`,
        itemName: 'Report',
        icon: Reports,
        navigateTo: '/reports',
        subItems: [],
      },
      {
        className: `${
          pathname === '/setting' ||
          pathname === '/company-list' ||
          pathname === '/company-permission' ||
          pathname === '/create-company' ||
          pathname === '/employee' ||
          pathname === '/create-employee' ||
          pathname === '/client-company' ||
          pathname === '/project-type' ||
          pathname === '/package' ||
          pathname === '/role-permission' ||
          pathname === '/add-role-permission' ||
          pathname === '/reference' ||
          pathname === '/location' ||
          pathname === '/device' ||
          pathname === '/currency' ||
          pathname === '/account' ||
          pathname === '/group' ||
          pathname === '/product' ||
          pathname === '/change-year'
            ? 'active'
            : ''
        }`,
        itemName: 'Setting',
        icon: Setting,
        navigateTo: '/setting',
        subItems: [],
      },
      {
        className: `${
          pathname === '/projects' || pathname.includes('project-details')
            ? 'active'
            : ''
        }`,
        itemName: 'Projects',
        icon: Project,
        navigateTo: '/projects',
        subItems: [],
      },
      {
        className: `${
          pathname === '/payment-details' || pathname === '/my-transaction'
            ? 'active'
            : ''
        }`,
        itemName: 'Payment',
        icon: Payment,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/payment-details' ? 'active' : ''}`,
            itemName: 'Payment Details',
            resName: 'payment-details',
            icon: PaymentDetails,
            navigateTo: '/payment-details',
          },
          {
            className: `${pathname === '/my-transaction' ? 'active' : ''}`,
            itemName: 'Transaction',
            resName: 'my-transaction',
            icon: Transaction,
            navigateTo: '/my-transaction',
          },
        ],
      },
      {
        className: `${
          pathname === '/assigned-projects' ||
          pathname.includes('project-work-editing') ||
          pathname.includes('project-work-exposing')
            ? 'active'
            : ''
        }`,
        itemName: 'Assigned Worked',
        icon: AssignedWork,
        navigateTo: '/assigned-projects',
        subItems: [],
      },
      {
        className: `${pathname === '/reporting' ? 'active' : ''}`,
        itemName: 'Reporting',
        icon: Repoting,
        navigateTo: '/reporting',
        subItems: [],
      },
      {
        className: `${
          pathname === '/my-pay' || pathname === '/transaction' ? 'active' : ''
        }`,
        itemName: 'My Finance',
        icon: Payment,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/my-pay' ? 'active' : ''}`,
            itemName: 'My Pay',
            resName: 'my-pay',
            icon: PaymentDetails,
            navigateTo: '/my-pay',
          },
          {
            className: `${pathname === '/transaction' ? 'active' : ''}`,
            itemName: 'Transaction',
            resName: 'transaction',
            icon: Transaction,
            navigateTo: '/transaction',
          },
        ],
      },
      {
        className: `${
          pathname === '/general-billing' ||
          pathname === '/create-general-billing' ||
          pathname.includes('/edit-general-billing') ||
          pathname.includes('/view-general-billing')
            ? 'active'
            : ''
        }`,
        itemName: 'General',
        icon: Reports,
        navigateTo: '/general-billing',
        subItems: [],
      },
    ];
  }, [pathname]);

  const updatedMenuItems = useMemo(() => {
    const navLinks = [];
    const filteredPermissionData = [];

    // To set a permission item in the FilterData array as per permission
    userPermissions?.forEach(item => {
      item.permission.forEach(data => {
        const { main_module_key, role_id, sub_module_key, _id, ...rest } = data;
        const hasPermission = Object.keys(rest).some(key => rest[key] === true);

        if (rest?.name !== 'Other' && hasPermission) {
          const findIndex = filteredPermissionData.findIndex(
            i => i.key === item.key,
          );

          if (findIndex !== -1) {
            filteredPermissionData[findIndex].permission =
              filteredPermissionData[findIndex].permission || [];
            filteredPermissionData[findIndex].permission.push(data);
          } else {
            filteredPermissionData.push({
              ...item,
              permission: [data],
            });
          }
        }
      });
    });

    // To set filtered header-menu items according to permissions
    const filteredMenuItems = headerAndSideMenuItems
      .map(dataItem => {
        const itemNameLowerCase =
          dataItem.itemName?.toLowerCase() === 'dashboard'
            ? userData?.role === 1 || userData?.role === 2
              ? 'dashboard'
              : userData?.role === 3
              ? 'user-dashboard'
              : 'client-dashboard'
            : dataItem.itemName?.toLowerCase();

        const match = filteredPermissionData.find(headerItem => {
          const headerItemNameLowerCase = headerItem.name?.toLowerCase();

          return (
            itemNameLowerCase === headerItemNameLowerCase
            // || itemNameLowerCase === 'reports'
          );
        });

        if (match) {
          const setHeaderMenuItem =
            dataItem.subItems.length > 0
              ? match.permission.map(i => {
                  return dataItem.subItems.find(c => {
                    return c.resName === i.sub_module_key;
                  });
                })
              : [];

          return {
            ...dataItem,
            subItems: setHeaderMenuItem,
          };
        }
      })
      ?.filter(filteredItem => filteredItem);

    filteredMenuItems?.forEach(x => {
      const childItem = [];
      x?.subItems?.forEach(y => {
        childItem?.push({
          className: y?.className,
          template: (item, options) => {
            return (
              <>
                <span
                  className="menu_item_wrap"
                  onClick={e => debounceHandleClickEvent(e, options)}
                >
                  <Avatar image={y?.icon} />
                  <span>{y?.itemName}</span>
                </span>
              </>
            );
          },
          command: () => navigate(y?.navigateTo),
        });
      });

      navLinks?.push({
        className: x.className,
        template: (item, options) => {
          return (
            <>
              <span
                className={`${
                  x?.subItems?.length > 0
                    ? 'menu_item_wrap parent_menu'
                    : 'menu_item_wrap'
                }`}
                onClick={e => debounceHandleClickEvent(e, options)}
              >
                <Avatar image={x?.icon} />
                <span>{x?.itemName}</span>
              </span>
            </>
          );
        },

        items: childItem,
        command: () => {
          if (x?.navigateTo) navigate(x?.navigateTo);
        },
      });
    });

    return navLinks;
  }, [
    userPermissions,
    headerAndSideMenuItems,
    navigate,
    debounceHandleClickEvent,
  ]);

  useEffect(() => {
    if (
      currentUser?.image ||
      (currentUser?.first_name && currentUser?.last_name)
    ) {
      setLoginUserData({
        ...loginUserData,
        profile_logo: currentUser?.image,
        name: `${
          currentUser?.first_name?.charAt(0)?.toUpperCase() +
          currentUser.first_name.slice(1).toLowerCase()
        }
            ${
              currentUser?.last_name?.charAt(0)?.toUpperCase() +
              currentUser.last_name.slice(1).toLowerCase()
            }`,
      });
    } else {
      setLoginUserData({
        ...loginUserData,
        profile_logo: userData?.employee?.image,
        name:
          userData?.employee?.first_name && userData?.employee?.last_name
            ? `${
                userData?.employee?.first_name?.charAt(0)?.toUpperCase() +
                userData?.employee?.first_name?.slice(1).toLowerCase()
              }
        ${
          userData?.employee?.last_name?.charAt(0)?.toUpperCase() +
          userData?.employee?.last_name?.slice(1).toLowerCase()
        }`
            : `${userData?.employee?.company_name}`,
      });
    }

    // re-set the toggle value
    if (
      (userData?.role === 2 || (userData?.role === 3 && userData?.is_admin)) &&
      switchedUser !== userData?.switch_user
    ) {
      dispatch(setSwitchedUser(userData?.switch_user));
    }
  }, [
    currentUser,
    userData?.employee?.image,
    userData?.employee?.first_name,
    userData?.employee?.last_name,
  ]);

  const menuItems = [
    {
      className: `${pathname === '/dashboard' ? 'active' : ''}`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Dashboard} />
              <span>Dashboard</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/dashboard');
      },
    },
    {
      className: `${
        pathname === '/inquiry' ||
        pathname === '/project-status' ||
        pathname === '/employee-reporting' ||
        pathname === '/user-reporting' ||
        pathname === '/create-inquiry'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span
              className="menu_item_wrap parent_menu"
              onClick={e => options?.onClick(e)}
            >
              <Avatar image={activityOverview} />
              <span>Activity Overview</span>
            </span>
          </>
        );
      },
      items: [
        {
          className: `${
            pathname === '/inquiry' || pathname === '/create-inquiry'
              ? 'active'
              : ''
          }`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Inquiry} />
                <span>Inquiry </span>
              </span>
            );
          },
          command: () => {
            navigate('/inquiry');
          },
        },
        {
          className: `${pathname === '/project-status' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={ProjectStatus} />
                <span>Project Status</span>
              </span>
            );
          },
          command: () => {
            navigate('/project-status');
          },
        },
        {
          className: `${
            pathname === '/employee-reporting' || pathname === '/user-reporting'
              ? 'active'
              : ''
          }`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={EmployeeReporting} />
                <span>Employee Reporting</span>
              </span>
            );
          },
          command: () => {
            navigate('/employee-reporting');
          },
        },
        {
          className: `${pathname === '/stock-transfer' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Announcement} />
                <span>Announcement</span>
              </span>
            );
          },
          command: () => {
            navigate('/announcement');
          },
        },
        {
          className: `${pathname === '/stock-transfer' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={DeletedHistory} />
                <span>Deleted History</span>
              </span>
            );
          },
          command: () => {
            navigate('/deleted-history');
          },
        },
      ],
    },
    {
      className: `${
        pathname === '/data-collection' ||
        pathname === '/add-data-collection' ||
        pathname === '/editing' ||
        pathname === '/editing-quotation' ||
        pathname === '/editing-quotation-approve' ||
        pathname === '/editing-assign' ||
        pathname === '/editing-overview' ||
        pathname === '/editing-completed' ||
        pathname === '/editing-flow'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span
              className="menu_item_wrap parent_menu"
              onClick={e => options?.onClick(e)}
            >
              <Avatar image={Editing} />
              <span>Editing</span>
            </span>
          </>
        );
      },
      items: [
        {
          className: `${
            pathname === '/data-collection' ||
            pathname === '/add-data-collection'
              ? 'active'
              : ''
          }`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={DataCollection} />
                <span>Data Collection </span>
              </span>
            );
          },
          command: () => {
            navigate('/data-collection');
          },
        },
        {
          className: `${
            pathname === '/editing' ||
            pathname === '/editing-quotation' ||
            pathname === '/editing-quotation-approve' ||
            pathname === '/editing-assign' ||
            pathname === '/editing-overview' ||
            pathname === '/editing-completed' ||
            pathname === '/editing-flow'
              ? 'active'
              : ''
          }`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={EditingFlow} />
                <span>Editing Flow</span>
              </span>
            );
          },
          command: () => {
            navigate('/editing');
          },
        },
      ],
    },
    {
      className: `${
        pathname === '/exposing' ||
        pathname === '/order-form' ||
        pathname === '/quotation' ||
        pathname === '/quotes-approve' ||
        pathname === '/assign-to-exposer' ||
        pathname === '/overview' ||
        pathname === '/completed'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Exposing} />
              <span>Exposing</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/exposing');
      },
    },
    {
      className: `${
        pathname === '/billing' ||
        pathname === '/view-billing' ||
        pathname === '/edit-billing' ||
        pathname === '/record-receipt-payment' ||
        pathname === '/payment' ||
        pathname === '/journal-entry' ||
        pathname === '/edit-journal-entry' ||
        pathname === '/create-journal-entry' ||
        pathname === '/view-journal-entry' ||
        pathname === '/expenses' ||
        pathname === '/create-expenses' ||
        pathname === '/view-expenses' ||
        pathname === '/edit-expenses' ||
        pathname === '/receipt-payment'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span
              className="menu_item_wrap parent_menu"
              onClick={e => options?.onClick(e)}
            >
              <Avatar image={Account} />
              <span>Account</span>
            </span>
          </>
        );
      },
      items: [
        {
          className: `${pathname === '/billing' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Billing} />
                <span>Billing </span>
              </span>
            );
          },
          command: () => {
            navigate('/billing');
          },
        },
        {
          className: `${pathname === '/receipt-payment' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={ReceiptPayment} />
                <span>Receipt / Payment</span>
              </span>
            );
          },
          command: () => {
            navigate('/receipt-payment');
          },
        },
        {
          className: `${pathname === '/journal-entry' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={JournalEntry} />
                <span>Journal Entry</span>
              </span>
            );
          },
          command: () => {
            navigate('/journal-entry');
          },
        },
        {
          className: `${pathname === '/expenses' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Expenses} />
                <span>Expenses</span>
              </span>
            );
          },
          command: () => {
            navigate('/expenses');
          },
        },
        {
          className: `${pathname === '/purchase-invoice' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={PurchaseInvoice} />
                <span>Purchase Invoice</span>
              </span>
            );
          },
          command: () => {
            navigate('/purchase-invoice');
          },
        },
      ],
    },
    {
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Reports} />
              <span>Reports</span>
            </span>
          </>
        );
      },
    },
    {
      className: `${
        pathname === '/company-list' ||
        pathname === '/company-permission' ||
        pathname === '/create-company' ||
        pathname === '/employee' ||
        pathname === '/create-employee' ||
        pathname === '/client-company' ||
        pathname === '/project-type' ||
        pathname === '/package' ||
        pathname === '/role-permission' ||
        pathname === '/add-role-permission' ||
        pathname === '/reference' ||
        pathname === '/location' ||
        pathname === '/device' ||
        pathname === '/currency' ||
        pathname === '/account' ||
        pathname === '/group' ||
        pathname === '/product'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Setting} />
              <span>Setting</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/company-list');
      },
    },
    {
      className: `${pathname === '/projects' ? 'active' : ''}`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Project} />
              <span>Projects</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/projects');
      },
    },
    {
      className: `${
        pathname === '/payment-details' || pathname === '/my-transaction'
          ? 'active'
          : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span
              className="menu_item_wrap parent_menu"
              onClick={e => options?.onClick(e)}
            >
              <Avatar image={Payment} />
              <span>Payment</span>
            </span>
          </>
        );
      },
      items: [
        {
          className: `${pathname === '/payment-details' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={PaymentDetails} />
                <span>Payment Details </span>
              </span>
            );
          },
          command: () => {
            navigate('/payment-details');
          },
        },
        {
          className: `${pathname === '/my-transaction' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Transaction} />
                <span>Transaction</span>
              </span>
            );
          },
          command: () => {
            navigate('/my-transaction');
          },
        },
      ],
    },
    {
      className: `${pathname === '/assigned-projects' ? 'active' : ''}`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={AssignedWork} />
              <span>Assigned Worked</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/assigned-projects');
      },
    },
    {
      className: `${pathname === '/reporting' ? 'active' : ''}`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Repoting} />
              <span>Reporting</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/reporting');
      },
    },
    {
      className: `${
        pathname === '/my-pay' || pathname === '/transaction' ? 'active' : ''
      }`,
      template: (item, options) => {
        return (
          <>
            <span
              className="menu_item_wrap parent_menu"
              onClick={e => options?.onClick(e)}
            >
              <Avatar image={Payment} />
              <span>My Finance</span>
            </span>
          </>
        );
      },
      items: [
        {
          className: `${pathname === '/my-pay' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={PaymentDetails} />
                <span>My Pay</span>
              </span>
            );
          },
          command: () => {
            navigate('/my-pay');
          },
        },
        {
          className: `${pathname === '/transaction' ? 'active' : ''}`,
          template: (item, options) => {
            return (
              <span
                className="menu_item_wrap"
                onClick={e => options?.onClick(e)}
              >
                <Avatar image={Transaction} />
                <span>Transaction</span>
              </span>
            );
          },
          command: () => {
            navigate('/transaction');
          },
        },
      ],
    },
    {
      className: `${pathname === '/general-billing' ? 'active' : ''}`,
      template: (item, options) => {
        return (
          <>
            <span className="menu_item_wrap" onClick={e => options?.onClick(e)}>
              <Avatar image={Reports} />
              <span>General Billing</span>
            </span>
          </>
        );
      },
      command: () => {
        navigate('/general-billing');
      },
    },
  ];

  const userMenu = [
    {
      items: [
        {
          label: 'My Profile',
          command: () => {
            navigate('/my-profile');
          },
        },
        {
          label: 'Change Password',
          command: () => {
            setChangePasswordModal(true);
          },
        },
        {
          label: 'Logout',
          command: () => {
            dispatch(logout({ user_id: userData?.employee?._id }));
            localStorage.clear();
            clearToken();
            navigate('/');
            setLoginUserData({ ...loginUserData, profile_logo: '', name: '' });
            Cookies.remove('notificationPermissionNotAllow');
          },
        },
        {
          label: 'Allow Permission',
          template: () => (
            <div className="d-flex p-menuitem-link justify-content-between align-items-center switch-input">
              <span className="">Allow Permission</span>

              <InputSwitch
                checked={allowNotificationToggle}
                onChange={e => {
                  dispatch(setAllowNotificationToggle(e.value));
                  if (!!e.value) {
                    dispatch(notificationSubscribe());
                  } else {
                    dispatch(notificationUnSubscribe());
                    Cookies.set('notificationPermissionNotAllow', true, {
                      expires: 12,
                    });
                  }
                }}
              />
            </div>
          ),
        },
      ],
    },
  ];

  const navigatePageAsPerPermission = () => {
    const checkedPermissionData = checkPermissionForLandingPage(userData);
    return checkedPermissionData?.path;
  };

  const setUserName = () => {
    const firstName = userData?.employee?.first_name
      ? userData?.employee?.first_name
      : userData?.employee?.company_name?.split(' ')[0] || '';

    const lastName = userData?.employee?.last_name
      ? userData?.employee?.last_name
      : userData?.employee?.company_name?.split(' ')[1] || '';

    return (
      (firstName || lastName) &&
      `${firstName?.charAt(0)?.toUpperCase()}
        ${lastName?.charAt(0)?.toUpperCase()}`
    );
  };

  const start = (
    <Link to={navigatePageAsPerPermission()}>
      <img alt="logo" src={Logo} />
    </Link>
  );

  const end = (
    <ul className="right_header">
      {(userData?.role === 2 ||
        (userData?.role === 3 && userData?.is_admin)) && (
        <li className="header_toggle_btn">
          <SelectButton
            className="select_toggle_button"
            value={switchedUser}
            options={switchUserOptions}
            onChange={async e => {
              if (!!e.value) {
                dispatch(setSwitchedUser(e.value));

                saveToken({
                  ...userData,
                  switch_user: e.value,
                });

                const { company_name, email_id, original_password } =
                  userData?.employee;

                const role = e.value === 'Employee' ? true : false;

                const newObj = {
                  username: email_id,
                  password: original_password,
                  company_id: company_name,
                  switch_role: role,
                };

                let res = await dispatch(login(newObj));
                const responseData = res?.payload?.data;

                const checkedPermissionData =
                  checkPermissionForLandingPage(responseData);

                dispatch(
                  setUserPermissions(checkedPermissionData?.updated_permission),
                );
                navigate(checkedPermissionData?.path);
              }
            }}
          />
        </li>
      )}
      <li className="char_menu_wrap">
        <Link to="/conversation">
          <img src={ChatIcon} alt="" />
          {chatMessageCount > 0 && (
            <span>{chatMessageCount > 0 ? chatMessageCount : ''}</span>
          )}
        </Link>
      </li>
      <li className="notification_wrapper">
        <Button
          className={`btn_transperant ${
            notificationList?.unreadCount ? 'notification_btn' : ''
          }`}
          onClick={e => op?.current?.show(e)}
        >
          <img src={Notifiaction} alt="" />
          <span></span>
        </Button>
      </li>
      <li>
        <Menu
          model={userMenu}
          ref={menuRight}
          popup
          id="popup_menu_right"
          popupAlignment="right"
        />
        <Button
          label="Show Right"
          icon="pi pi-align-right"
          className="user_dropdown"
          onClick={e => menuRight?.current?.toggle(e)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <div className="user_img">
            {loginUserData?.profile_logo ? (
              <img src={loginUserData?.profile_logo || ''} alt={''} />
            ) : (
              <div
                style={{
                  color: 'black',
                }}
              >
                {setUserName()}
                {/* {userData?.employee?.first_name &&
                  userData?.employee?.last_name &&
                  `${userData?.employee?.first_name?.charAt(0)?.toUpperCase()}
            ${userData?.employee?.last_name?.charAt(0)?.toUpperCase()}`} */}
              </div>
            )}
          </div>
          {loginUserData?.name ? (
            <span className="pl10">{loginUserData?.name}</span>
          ) : (
            <span className="pl10">Firstname Lastname</span>
          )}
        </Button>
      </li>
    </ul>
  );

  /* NOTIFICATION */
  useEffect(() => {
    dispatch(
      getNotificationList({
        start: notificationCurrentPage,
        limit: 5,
      }),
    );
  }, [dispatch, notificationCurrentPage, notificationPageLimit]);

  const handleClearNotification = () => {
    if (notificationList?.list?.length > 0) {
      dispatch(clearNotification());
    }
  };

  const handleReadNotification = () => {
    if (notificationList?.unreadCount) {
      dispatch(readNotification())
        .then(() => {
          dispatch(
            getNotificationList({
              start: notificationCurrentPage,
              limit: visibleRight ? notificationPageLimit : 5,
            }),
          );
        })
        .catch(error => {
          console.error('Error marking notifications as read:', error);
        });
    } else {
      console.log('No unread notifications to mark as read');
    }
  };

  const handleAllNotifications = e => {
    dispatch(
      getNotificationList({
        start: notificationCurrentPage,
        limit: notificationPageLimit,
      }),
    );
    setVisibleRight(true);
    op.current?.hide();
  };

  const handleHide = () => {
    dispatch(
      getNotificationList({
        start: notificationCurrentPage,
        limit: 5,
      }),
    );
    setVisibleRight(false);
  };

  const handleNotificationNavigate = useCallback(
    (type, order_id) => {
      if (type?.toLowerCase() === 'editing' && order_id) {
        navigate(`editing-flow/${order_id}`);
      } else if (type?.toLowerCase() === 'exposing' && order_id) {
        navigate(`exposing-flow/${order_id}`);
      } else if (type?.toLowerCase() === 'inquiry' && order_id) {
        navigate(`update-inquiry-flow/${order_id}`);
      }
    },
    [navigate],
  );

  const handleSingleReadNotification = useCallback((id, type, orderId) => {
    op.current?.hide();
    handleNotificationNavigate(type, orderId);
    dispatch(readSingleNotification({ notification_id: id }))
      .then(() => {
        handleHide();
      })
      .catch(error => {
        console.error('Error marking single notifications as read:', error);
      });
  }, []);

  const debounceHandleSingleReadNotification = useCallback(
    _.debounce(handleSingleReadNotification, 250),
    [],
  );

  return (
    <>
      {loginLoading && <Loader />}
      <header>
        <div className="main_header">
          <div className="menu_wrapper">
            <Menubar model={updatedMenuItems} start={start} end={end} />
          </div>
        </div>
        <div className="page_tab_wrapper">
          <NavTab />
        </div>
        <ChangePassWord
          changePasswordModal={changePasswordModal}
          setChangePasswordModal={setChangePasswordModal}
        />
        <Sidebar
          visible={visibleRight}
          position="right"
          onHide={handleHide}
          className="notification_sidebar"
        >
          <div className="notification_main_wrapper">
            <h3 className="sidebar_title">Notifications</h3>
            <div className="notification_top">
              <Row>
                <Col>
                  <h5>
                    All <span>{notificationList?.unreadCount}</span>
                  </h5>
                </Col>
                <Col className="text-end">
                  <Button
                    className="btn_transperant text_primary"
                    onClick={handleReadNotification}
                  >
                    Mark all as read
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="notification_body">
              {notificationList?.list?.length > 0 ? (
                notificationList?.list.map(notification => (
                  <div
                    key={notification._id}
                    className={`notification_box ${
                      notification?.is_read ? '' : 'unread'
                    }`}
                  >
                    <div className="notification_icon orange">
                      <span>{notification?.user_data?.name?.charAt(0)}</span>
                    </div>
                    <div className="notification_content">
                      <h5
                        className={
                          notification?.type && notification?.order_id
                            ? 'link_color'
                            : ''
                        }
                        onClick={() => {
                          !notification?.is_read &&
                            debounceHandleSingleReadNotification(
                              notification?._id,
                              notification?.type,
                              notification?.order_id,
                            );
                        }}
                      >
                        {notification?.message}
                      </h5>
                      <div className="d-flex justify-content-between">
                        <p className="text_light m-0">
                          <small>
                            {moment(notification?.created_at).format(
                              'dddd hh:mm A',
                            )}
                          </small>
                        </p>
                        <p className="text_light m-0">
                          <small>
                            {moment(notification?.created_at).format(
                              'MMM D, YYYY',
                            )}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-notification-txt">No Notifications Found</p>
              )}
            </div>
            <div className="notification_footer d-flex justify-content-between align-items-center">
              <Button
                className="btn_transperant text_primary"
                onClick={handleClearNotification}
              >
                Clear all notifications
              </Button>
            </div>
          </div>
        </Sidebar>
      </header>
      <OverlayPanel ref={op} showCloseIcon className="notification_overlay">
        <div className="overlay_top_wrap">
          <h3>Notifications</h3>
        </div>
        <div className="notification_main_wrapper">
          <div className="notification_top">
            <Row>
              <Col>
                <h5>
                  All <span>{notificationList?.unreadCount}</span>
                </h5>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn_transperant text_primary"
                  onClick={handleReadNotification}
                >
                  Mark all as read
                </Button>
              </Col>
            </Row>
          </div>
          <div className="notification_body">
            {notificationList?.list?.length > 0 ? (
              notificationList?.list?.map(notification => (
                <div
                  key={notification._id}
                  className={`notification_box ${
                    notification.is_read ? '' : 'unread'
                  }`}
                >
                  <div className="notification_icon orange">
                    <span>{notification?.user_data.name?.charAt(0)}</span>
                  </div>
                  <div className="notification_content">
                    <h5
                      className={
                        notification?.type && notification?.order_id
                          ? 'link_color'
                          : ''
                      }
                      onClick={e => {
                        !notification?.is_read &&
                          debounceHandleSingleReadNotification(
                            notification?._id,
                            notification?.type,
                            notification?.order_id,
                          );
                      }}
                    >
                      {notification?.message}
                    </h5>
                    <div className="d-flex justify-content-between">
                      <p className="text_light m-0">
                        <small>
                          {moment(notification?.created_at).format(
                            'dddd hh:mm A',
                          )}
                        </small>
                      </p>
                      <p className="text_light m-0">
                        <small>
                          {moment(notification?.created_at).format(
                            'DD MMMM YYYY',
                          )}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notification-txt">No Notifications Found</p>
            )}
          </div>
          <div className="notification_footer d-flex justify-content-between align-items-center">
            <Button
              className="btn_transperant text_primary"
              onClick={handleClearNotification}
            >
              Clear all notifications
            </Button>
            <Button className="btn_primary" onClick={handleAllNotifications}>
              View all notifications
            </Button>
          </div>
        </div>
      </OverlayPanel>
      {notificationPermissionDialogVisible && (
        <NotificationPermissionDialog
          onClose={() =>
            dispatch(setNotificationPermissionDialogVisible(false))
          }
        />
      )}
    </>
  );
};
export default memo(Header);
