import _ from 'lodash';
import moment from 'moment';

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const panNoRegex = /^([A-Z]{5}[0-9]{4}[A-Z]{1})?$/;
export const mobileRegex = /^[0-9]{10,15}$/;
export const GSTRegex =
  /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1})?$/;

export const isEmailComplete = email => {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Check if the email matches the regex
  return emailRegex.test(email);
};

export const isMobileComplete = mobile => {
  // Check if the mobile matches the regex
  return mobileRegex.test(mobile);
};

export const checkWordLimit = (value, limit) => {
  // const regex = new RegExp(`^\\d{1,${limit}}$`);
  const regex = new RegExp(`^\\d{1,${limit}}(?:\\.\\d{1,2})?$`);
  return regex.test(value);
  // return /^\d{1,limit}$/.test(value);
};

export const checkDateTime = value => {
  const check_valid_date_time = moment(value, 'HH:mm:ss', true).isValid();
  return check_valid_date_time;
};

export const getFormattedDate = date => {
  if (!date) return;
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, '0');
  const day = date?.getDate()?.toString()?.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const totalCount = (data, key) => {
  let newData = data?.length > 0 ? data : [];
  const calculatedAmount = newData?.reduce((sum, cuurent) => {
    if (Object.keys(cuurent)?.includes(key)) {
      return sum + Number(cuurent[key]);
    } else {
      return sum;
    }
  }, 0);
  return convertIntoNumber(calculatedAmount);
};

export const convertDate = date => {
  // Parse the input date using the specified format

  const latestDate = new Date(date).toLocaleString();

  // const parsedDate = moment(latestDate, 'YYYYMMDD h:mm:ss a');
  // const formattedTimestamp = moment(latestDate).format(
  //   'MMMM Do YYYY, h:mm:ss a',
  // );
  // Calculate the relative time from now
  // const showDate = latestDate?.fromNow();
  const showDate = moment(latestDate).fromNow();

  return showDate;
};

export const fetchingDateFromComment = comment => {
  return comment?.replace(/<[^>]*>/g, '');
};

export const convertIntoNumber = value => {
  return parseFloat(Number(value).toFixed(2));
};

export const generateUniqueId = () => {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.random().toString(16).substr(2, 12);
  return timestamp + randomPart;
};

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export const thousandSeparator = number => {
  if (!number) {
    return 0;
  }
  const options = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  const separatedNumber = number?.toLocaleString('en-IN', options);
  return separatedNumber;
};

export const numberToWords = num => {
  if (num === 0) return 'zero';

  const a = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const g = [
    '',
    'thousand',
    'million',
    'billion',
    'trillion',
    'quadrillion',
    'quintillion',
    'sextillion',
    'septillion',
    'octillion',
    'nonillion',
  ];

  const makeGroup = ([ones, tens, huns]) => {
    return [
      huns === 0 ? '' : a[huns] + ' hundred',
      tens === 0 ? '' : b[tens],
      ones === 0 ? '' : tens === 0 ? a[ones] : '-' + a[ones],
    ]
      .filter(Boolean)
      .join(' ');
  };

  const thousand = (group, i) => (group === '' ? '' : `${group} ${g[i]}`);

  const chunk = n => {
    const r = [];
    while (n > 0) {
      r.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    return r;
  };

  const parseChunk = n => {
    return makeGroup([
      Math.floor(n % 10),
      Math.floor((n % 100) / 10),
      Math.floor(n / 100),
    ]);
  };

  const words = chunk(num)
    .map((num, i) => thousand(parseChunk(num), i))
    .filter(x => x)
    .reverse()
    .join(' ');

  return words.trim();
};

export const checkPermissionForLandingPage = data => {
  const customAdminOrder = [
    'Dashboard',
    'Activity Overview',
    'Editing',
    'Exposing',
    'Account',
    'Report',
    'Setting',
    'All',
  ];

  const customUserOrder = [
    'user-dashboard',
    'Assigned Worked',
    'Reporting',
    'My Finance',
    'Activity Overview',
    'Editing',
    'Exposing',
    'Account',
    'Report',
    'Setting',
    'All',
  ];

  const customClientOrder = ['client-dashboard', 'Projects', 'Payment', 'All'];

  // Create a sorting function based on the custom order
  const sortByCustomOrder = (arr, order) => {
    const orderMap = _.zipObject(order, _.range(order.length));
    return _.sortBy(arr, item => orderMap[item.name]);
  };

  // Sort the array
  const sortedPermissions = sortByCustomOrder(
    data?.permission,
    data?.role === 1 || data?.role === 2
      ? customAdminOrder
      : data?.role === 3
      ? customUserOrder
      : customClientOrder,
  );

  // find permission when allowing view permission to user data
  const findFirstPermissionData = sortedPermissions?.find(x => {
    const findObj = x?.permission?.find(y => y?.view === true);
    return findObj;
  });

  const findViewPermissionObj = findFirstPermissionData?.permission?.find(
    y => y?.view === true,
  );

  // window.location.href = '/home';

  const landingPagePath =
    data?.role === 1 || data?.role === 2
      ? // ? findViewPermissionObj?.path
        //   ? findViewPermissionObj?.path
        //   : '/home'
        '/home'
      : data?.role === 3
      ? '/user-dashboard'
      : findViewPermissionObj?.path
      ? findViewPermissionObj?.path
      : '/client-dashboard';

  return {
    path: landingPagePath,
    updated_permission: sortedPermissions,
  };
};

/**
 * Path to permission mapping for home/landing tiles (aligned with Header menu).
 * Each path maps to { moduleName, subModuleKey }.
 * moduleName matches permission main module name; subModuleKey matches sub_module_key.
 * Note: '/calender-view' is always visible regardless of permissions.
 */
const HOME_PATH_PERMISSION_MAP = {
  '/dashboard': { moduleName: 'dashboard', subModuleKey: null },
  '/user-dashboard': { moduleName: 'user-dashboard', subModuleKey: null },
  '/client-dashboard': { moduleName: 'client-dashboard', subModuleKey: null },
  '/inquiry': { moduleName: 'activity overview', subModuleKey: 'inquiry' },
  '/data-collection': {
    moduleName: 'editing',
    subModuleKey: 'data-collection',
  },
  '/editing': { moduleName: 'editing', subModuleKey: 'editing-flow' },
  '/exposing': { moduleName: 'exposing', subModuleKey: null },
  '/project-status': {
    moduleName: 'activity overview',
    subModuleKey: 'project-status',
  },
  '/billing': { moduleName: 'account', subModuleKey: 'billing' },
  '/receipt-payment': {
    moduleName: 'account',
    subModuleKey: 'receipt-payment',
  },
  '/calender-view': { moduleName: null, subModuleKey: 'calender-view' },
};

/**
 * Returns whether the user has view permission for the given path on home/landing.
 * Uses same permission structure as Header (userPermissions from auth).
 * @param {Array} userPermissions - auth.userPermissions (array of { name, key, permission: [{ sub_module_key, view, ... }] })
 * @param {string} path - e.g. '/inquiry', '/dashboard'
 * @returns {boolean}
 */
export const hasPermissionForHomePath = (userPermissions, path) => {
  // Calendar view is always visible regardless of permissions
  if (path === '/calender-view') return true;

  if (!userPermissions?.length) return false;

  const mapping = HOME_PATH_PERMISSION_MAP[path];

  if (!mapping) return false;

  const { moduleName, subModuleKey } = mapping;

  if (moduleName === null && subModuleKey) {
    return userPermissions.some(item =>
      item.permission?.some(
        p => p.sub_module_key === subModuleKey && p.view === true,
      ),
    );
  }

  const moduleMatch = userPermissions.find(
    item => item.name?.toLowerCase() === moduleName,
  );

  if (!moduleMatch?.permission?.length) return false;

  if (subModuleKey === null) {
    return moduleMatch.permission.some(p => p.view === true);
  }

  return moduleMatch.permission.some(
    p => p.sub_module_key === subModuleKey && p.view === true,
  );
};
