import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'react-bootstrap';
import Logo from '../../Assets/Images/logo.svg';
import Search from '../../Assets/Images/search.svg';
import Notifiaction from '../../Assets/Images/notification.svg';
import ChatIcon from '../../Assets/Images/chat.svg';
import CloseIcon from '../../Assets/Images/close.svg';
import Dashboard from '../../Assets/Images/dashboard.svg';
import activityOverview from '../../Assets/Images/activity-overview.svg';
import Inquiry from '../../Assets/Images/inquiry.svg';
import ProjectStatus from '../../Assets/Images/project-status.svg';
import EmployeeReporting from '../../Assets/Images/employee-repoting.svg';
import Announcement from '../../Assets/Images/announcement.svg';
import DeletedHistory from '../../Assets/Images/delete-history.svg';
import Editing from '../../Assets/Images/editing.svg';
import DataCollection from '../../Assets/Images/data-collection.svg';
import EditingFlow from '../../Assets/Images/editing-flow.svg';
import Exposing from '../../Assets/Images/exposing.svg';
import Project from '../../Assets/Images/project.svg';
import Account from '../../Assets/Images/account.svg';
import Payment from '../../Assets/Images/payment.svg';
import AssignedWork from '../../Assets/Images/assigned-work.svg';
import Repoting from '../../Assets/Images/repoting.svg';
import PaymentDetails from '../../Assets/Images/payment-details.svg';
import Transaction from '../../Assets/Images/transaction.svg';
import Billing from '../../Assets/Images/billing.svg';
import ReceiptPayment from '../../Assets/Images/receipt-payment.svg';
import JournalEntry from '../../Assets/Images/journal-entry.svg';
import Expenses from '../../Assets/Images/expenses.svg';
import PurchaseInvoice from '../../Assets/Images/purchase-invoice.svg';
import Reports from '../../Assets/Images/report.svg';
import Setting from '../../Assets/Images/setting.svg';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Sidebar } from 'primereact/sidebar';
import _ from 'lodash';
import ChangePassWord from './ChangePassWord';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'Store/Reducers/Auth/ProfileSlice';
import { clearToken, getAuthToken } from 'Helper/AuthTokenHelper';

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
  '/inquiry',
  '/project-status',
  '/reporting-summary',
  '/user-reporting',
  '/dashboard',
  '/calender-view',
  '/conversation',
  '/create-inquiry',
  '/billing',
  '/add-edit-company-list',
  '/view-billing',
  '/receipt-payment',
  '/create-receipt-payment',
  '/view-receipt-payment',
  '/journal-entry',
  '/view-journal-entry',
  '/create-journal-entry',
  '/expenses',
  '/create-expenses',
  '/view-expenses',
  '/purchase-invoice',
  '/create-purchase-invoice',
  '/view-purchase-invoice',
  '/exposing',
  '/exposing-data-collection',
  '/order-form',
  '/company-list',
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
  '/add-edit-assigned-projects',
  '/projects',
  '/project-details',
  '/payment-details',
  '/transaction',
  '/user-dashboard',
  '/reporting',
  '/my-pay',
  '/my-profile',
  '/update-employee',
  '/update-company',
  '/announcement',
  '/deleted-history',
  '/editing-data-collection',
  '/editing-quotation',
  '/editing-quotation-approve',
  '/editing-assign',
  '/editing-overview',
  '/editing-completed',
  '/setting',
  '/update-inquiry',
  '/update-data-collection',
];

const NavTab = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  const locationPath = pathname?.split('/');

  const [state, setState] = useState({
    tabs: [
      {
        // name: locationPath?.length > 2 ? locationPath[2] : locationPath[1],
        name: locationPath[1],
        largePath: locationPath?.length > 2 ? pathname : null,
      },
    ],
    currentTab: {
      // name: locationPath?.length > 2 ? locationPath[2] : locationPath[1],
      name: locationPath[1],
      largePath: locationPath?.length > 2 ? pathname : null,
    },
  });

  const scrollHere = useRef(null);
  useEffect(() => {
    if (scrollHere.current) {
      scrollHere.current.scrollIntoView();
    }
  });

  const createTabs = () => {
    const { tabs, currentTab } = state;
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
              className={currentTab?.name === tab?.name ? 'active' : ''}
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
    let { tabs } = state;
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
      setState({
        tabs: [newTabObject],
        currentTab: newTabObject,
      });
    } else {
      if (state?.tabs?.length <= 100) {
        setState({
          tabs: [...tabs, newTabObject],
          currentTab: newTabObject,
        });
      } else {
        tabs?.splice(0, 1);
        setState({
          tabs: [...tabs, newTabObject],
          currentTab: newTabObject,
        });
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
      state?.tabs?.filter(item => item?.name === locationPath?.[1])?.length <= 0
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
      let index = state?.tabs?.findIndex(x => x?.name === locationPath?.[1]);
      // let cloneTabs = { ...JSON.parse(JSON.stringify(state)) };
      let cloneTabs = { ...state };
      if (index >= 0)
        cloneTabs.tabs[index].largePath =
          locationPath?.length > 2 ? pathname : null;
      setState({ ...cloneTabs, currentTab: selectBySidebare });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locationPath?.length, state?.tabs?.length]);

  const handleDeleteTab = (e, tabToDelete) => {
    e.preventDefault();
    e.stopPropagation();
    const { tabs, currentTab } = state;
    if (tabs?.length <= 1) {
      if (currentTab.name !== 'home') {
        setState({
          tabs: [],
          currentTab: { name: '', largePath: null },
        });
        navigate('/home');
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
        setState({
          tabs: updatedTabs,
          currentTab: previousTab,
        });
        if (previousTab?.largePath !== null) {
          navigate(`${previousTab?.largePath}`);
        } else {
          navigate(`/${previousTab?.name}`);
        }
      } else {
        setState({
          ...state,
          tabs: updatedTabs,
        });
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

    setState({
      ...state,
      currentTab: tab,
    });
    if (tab?.largePath !== null) {
      navigate(`${tab?.largePath}`);
    } else {
      navigate(`/${tab?.name}`);
    }
  };

  return <>{createTabs()}</>;
};

const Header = () => {
  const dispatch = useDispatch();
  const op = useRef(null);
  const menuRight = useRef(null);
  const navigate = useNavigate();
  let { pathname } = useLocation();

  const userData = getAuthToken();

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [loginUserData, setLoginUserData] = useState({
    profile_logo: '',
    name: '',
  });
  const { userPermissions } = useSelector(({ auth }) => auth);
  const { currentUser } = useSelector(({ profile }) => profile);

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
          pathname === '/reporting-summary' ||
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
              pathname === '/reporting-summary' ||
              pathname === '/user-reporting'
                ? 'active'
                : ''
            }`,
            itemName: 'Employee Reporting',
            resName: 'employee-reporting',
            icon: EmployeeReporting,
            navigateTo: '/reporting-summary',
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
          pathname === '/editing-data-collection'
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
              pathname === '/editing-data-collection'
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
          pathname === '/record-receipt-payment' ||
          pathname === '/payment' ||
          pathname === '/journal-entry' ||
          pathname === '/create-journal-entry' ||
          pathname === '/view-journal-entry' ||
          pathname === '/expenses' ||
          pathname === '/create-expenses' ||
          pathname === '/view-expenses' ||
          pathname === '/receipt-payment'
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
            className: `${pathname === '/receipt-payment' ? 'active' : ''}`,
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
            className: `${pathname === '/purchase-invoice' ? 'active' : ''}`,
            itemName: 'Purchase Invoice',
            resName: 'purchase-invoice',
            icon: PurchaseInvoice,
            navigateTo: '/purchase-invoice',
          },
        ],
      },
      {
        className: '',
        itemName: 'Report',
        icon: Reports,
        navigateTo: '',
        subItems: [],
      },
      {
        className: `${
          pathname === '/setting' ||
          pathname === '/company-list' ||
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
        itemName: 'Setting',
        icon: Setting,
        navigateTo: '/setting',
        subItems: [],
      },
      {
        className: `${pathname === '/projects' ? 'active' : ''}`,
        itemName: 'Projects',
        icon: Project,
        navigateTo: '/projects',
        subItems: [],
      },
      {
        className: `${
          pathname === '/payment-details' || pathname === '/transaction'
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
            className: `${pathname === '/transaction' ? 'active' : ''}`,
            itemName: 'Transaction',
            resName: 'Transaction',
            icon: Transaction,
            navigateTo: '/transaction',
          },
        ],
      },
      {
        className: `${pathname === '/assigned-projects' ? 'active' : ''}`,
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
        className: `${pathname === '/my-pay' ? 'active' : ''}`,
        itemName: 'My Finance',
        icon: Payment,
        navigateTo: '',
        subItems: [
          {
            className: `${pathname === '/my-pay' ? 'active' : ''}`,
            itemName: 'My Pay',
            resName: 'payment-details',
            icon: PaymentDetails,
            navigateTo: '/my-pay',
          },
          {
            className: `${pathname === '/' ? 'active' : ''}`,
            itemName: 'Transaction',
            resName: 'Transaction',
            icon: Transaction,
            navigateTo: '/',
          },
        ],
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
        pathname === '/reporting-summary' ||
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
            pathname === '/reporting-summary' || pathname === '/user-reporting'
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
            navigate('/reporting-summary');
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
        pathname === '/editing-data-collection'
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
            pathname === '/editing-data-collection'
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
        pathname === '/record-receipt-payment' ||
        pathname === '/payment' ||
        pathname === '/journal-entry' ||
        pathname === '/create-journal-entry' ||
        pathname === '/view-journal-entry' ||
        pathname === '/expenses' ||
        pathname === '/create-expenses' ||
        pathname === '/view-expenses' ||
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
        pathname === '/payment-details' || pathname === '/transaction'
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
        pathname === '/my-pay' || pathname === '/' ? 'active' : ''
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
          className: `${pathname === '/' ? 'active' : ''}`,
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
            navigate('/');
          },
        },
      ],
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
          },
        },
      ],
    },
  ];

  const start = (
    <Link to="/home">
      <img alt="logo" src={Logo} />
    </Link>
  );
  const end = (
    <ul className="right_header">
      <li>
        <div className="form_group search_input">
          <InputText placeholder="Search" className="input_wrap search_wrap" />
        </div>
      </li>
      <li className="char_menu_wrap">
        <Link to="/conversation">
          <img src={ChatIcon} alt="" />
          <span>3</span>
        </Link>
      </li>
      <li className="notification_wrapper">
        <Button
          className="btn_transperant notification_btn"
          onClick={e => op?.current?.toggle(e)}
        >
          <img src={Notifiaction} alt="" />
          <span></span>
        </Button>
        <OverlayPanel ref={op} showCloseIcon className="notification_overlay">
          <div className="overlay_top_wrap">
            <h3>Notifications </h3>
          </div>
          <div className="notification_main_wrapper">
            <div className="notification_top">
              <Row>
                <Col>
                  <h5>
                    All <span>1</span>
                  </h5>
                </Col>
                <Col className="text-end">
                  <span>Mark all as read</span>
                </Col>
              </Row>
            </div>
            <div className="notification_body">
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="notification_footer d-flex justify-content-between align-items-center">
              <Button className="btn_transperant text_primary">
                Clear all notifications
              </Button>
              <Button
                className="btn_primary"
                onClick={e => {
                  setVisibleRight(true);
                  op.current?.toggle(e);
                }}
              >
                View all notifications
              </Button>
            </div>
          </div>
        </OverlayPanel>
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
                {userData?.employee?.first_name &&
                  userData?.employee?.last_name &&
                  `${userData?.employee?.first_name?.charAt(0)?.toUpperCase()}
            ${userData?.employee?.last_name?.charAt(0)?.toUpperCase()}`}
              </div>
            )}
          </div>
          {/* <div className="user_img">
            <img src={userImg} alt="" />
          </div> */}
          {/* <span className="pl10">John Doe</span> */}
          {loginUserData?.name ? (
            <span className="pl10">{loginUserData?.name}</span>
          ) : (
            <span className="pl10">Firstname Lastname</span>
          )}
        </Button>
      </li>
    </ul>
  );

  return (
    <>
      <header>
        <div className="main_header">
          <div className="menu_wrapper">
            <Menubar model={updatedMenuItems} start={start} end={end} />
          </div>
        </div>
        <div className="page_tab_wrapper">
          <NavTab />
        </div>
        {/* Profile pic popup */}

        <ChangePassWord
          changePasswordModal={changePasswordModal}
          setChangePasswordModal={setChangePasswordModal}
        />
        {/* / Notification Modal / */}
        <Sidebar
          visible={visibleRight}
          position="right"
          onHide={() => setVisibleRight(false)}
          className="notification_sidebar"
        >
          <div className="notification_main_wrapper">
            <h3 className="sidebar_title">Notification</h3>
            <div className="notification_top">
              <Row>
                <Col>
                  <h5>
                    All <span>1</span>
                  </h5>
                </Col>
                <Col className="text-end">
                  <span>Mark all as read</span>
                </Col>
              </Row>
            </div>
            <div className="notification_body">
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box unread">
                <div className="notification_icon orange">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon green">
                  <span>BR</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon blue">
                  <span>KK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="notification_box">
                <div className="notification_icon yellow">
                  <span>RK</span>
                </div>
                <div className="notification_content">
                  <h5>
                    A new order has been created by the salesman 1, Kindly
                    review the details and proceed accordingly.
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="text_light m-0">
                      <small>Wednesday at 9:40 AM</small>
                    </p>
                    <p className="text_light m-0">
                      <small>Jun 05, 2024</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="notification_footer d-flex justify-content-between align-items-center">
              <Button className="btn_transperant text_primary">
                Clear all notifications
              </Button>
            </div>
          </div>
        </Sidebar>
      </header>
      <OverlayPanel ref={op} showCloseIcon className="notification_overlay">
        <div className="overlay_top_wrap">
          <h3>Notifications </h3>
        </div>
        <div className="notification_main_wrapper">
          <div className="notification_top">
            <Row>
              <Col>
                <h5>
                  All <span>1</span>
                </h5>
              </Col>
              <Col className="text-end">
                <span>Mark all as read</span>
              </Col>
            </Row>
          </div>
          <div className="notification_body">
            <div className="notification_box unread">
              <div className="notification_icon orange">
                <span>KK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon green">
                <span>BR</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon blue">
                <span>KK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="notification_box">
              <div className="notification_icon yellow">
                <span>RK</span>
              </div>
              <div className="notification_content">
                <h5>
                  A new order has been created by the salesman 1, Kindly review
                  the details and proceed accordingly.
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="text_light m-0">
                    <small>Wednesday at 9:40 AM</small>
                  </p>
                  <p className="text_light m-0">
                    <small>Jun 05, 2024</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="notification_footer d-flex justify-content-between align-items-center">
            <Button className="btn_transperant text_primary">
              Clear all notifications
            </Button>
            <Button
              className="btn_primary"
              onClick={e => {
                setVisibleRight(true);
                op.current?.toggle(e);
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};
export default memo(Header);
