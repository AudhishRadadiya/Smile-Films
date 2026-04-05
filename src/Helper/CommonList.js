export const bloodGroup = [
  { label: 'A positive (A+)', value: 'A +ve' },
  { label: 'A negative (A-)', value: 'A -ve' },
  { label: 'B positive (B+)', value: 'B +ve' },
  { label: 'B negative (B-)', value: 'B -ve' },
  { label: 'AB positive (AB+)', value: 'AB +ve' },
  { label: 'AB negative (AB-)', value: 'AB -ve' },
  { label: 'O positive (O+)', value: 'O +ve' },
  { label: 'O negative (O-)', value: 'O -ve' },
];

export const maritalStatus = [
  { label: 'Single', value: 1 },
  { label: 'Married', value: 2 },
  { label: 'Divorced', value: 3 },
];
export const GroupName = [
  { label: 'Balance Sheet', value: 'Balance Sheet' },
  { label: 'Profit & Loss', value: 'Profit & Loss' },
  { label: 'Trading', value: 'Trading' },
];
export const accountType = [
  { label: 'Saving', value: 'Saving' },
  { label: 'Current', value: 'Current' },
  { label: 'Salary', value: 'Salary' },
];
export const companyName = [
  { label: 'ABC Company ', value: 'ABC Company ' },
  { label: 'CDE Company', value: 'CDE Company' },
  { label: 'DEF Company', value: 'DEF Company' },
  { label: 'EFG Company', value: 'EFG Company' },
];
export const Role = [
  { label: 'Admin ', value: 'Admin ' },
  { label: 'Employee', value: 'Employee' },
];

export const BusinessType = [
  { label: 'Partnership', value: 'Partnership' },
  { label: 'LLP', value: 'LLP' },
];

export const InquiryStatusList = [
  { label: 'Initial', value: 1 },
  { label: 'In Progress', value: 2 },
  { label: 'Pending', value: 3 },
  { label: 'Cancelled', value: 4 },
  { label: 'Completed', value: 5 },
];

export const BillingStatusList = [
  { label: 'Due', value: 1 },
  { label: 'Partial', value: 2 },
  { label: 'Completed', value: 3 },
];

export const ClientProjectsStatusList = [
  { label: 'Running', value: 1 },
  { label: 'Completed', value: 2 },
];

export const ClientPaymentStatusList = [
  { label: 'Due', value: 1 },
  { label: 'Partial', value: 2 },
  { label: 'Completed', value: 3 },
];

export const InquiryStatusFilterList = [
  { label: 'Initial', value: 1 },
  { label: 'In Progress', value: 2 },
  { label: 'Pending', value: 3 },
  { label: 'Cancelled', value: 4 },
];

export const AssignedWorkedStatusFilterList = [
  { label: 'Initial', value: 1 },
  { label: 'Library Done', value: 2 },
  { label: 'IN Progress', value: 3 },
  { label: 'IN Checking', value: 4 },
  { label: 'Exporting', value: 5 },
  { label: 'Completed', value: 6 },
];

export const AssignedWorkedExposingStatus = [
  { label: 'Initial', value: 1 },
  { label: 'IN Progress', value: 3 },
  { label: 'Completed', value: 6 },
];

export const Type = [
  { label: 'Client Company', value: 1 },
  { label: 'Supplier ', value: 2 },
];

export const DataCollectionList = [
  { label: 'Cloud', value: 1 },
  { label: 'Courier Hard Drive', value: 2 },
  { label: 'Office Visit', value: 3 },
];

export const ReceiptAndPaymentStatus = [
  { label: 'Unpaid', value: 1 },
  { label: 'Partially Paid', value: 2 },
  { label: 'Paid', value: 3 },
];

export const CompletedStepProjectStatus = [
  { label: 'Initial', value: 1 },
  { label: 'Library Done', value: 2 },
  { label: 'IN Progress', value: 3 },
  { label: 'IN Checking', value: 4 },
  { label: 'Exporting', value: 5 },
  { label: 'Completed', value: 6 },
];

export const getSeverityStatus = product => {
  switch (product) {
    case 'Initial':
      return 'info';
    case 'Library Done':
      return 'orange';
    case 'IN Progress':
      return 'warning';
    case 'IN Checking':
      return 'danger';
    case 'Completed':
      return 'success';
    case 'Exporting':
      return 'primary';
    default:
      return null;
  }
};

export const getFormattedDate = value => {
  const date = value ? value : new Date();
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, '0');
  const day = date?.getDate()?.toString()?.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getSeverityReceiptAndPayment = statusName => {
  switch (statusName) {
    case 'Unpaid':
      return 'danger';
    case 'Paid':
      return 'success';
    case 'Partially Paid':
      return 'partially';
    default:
      return null;
  }
};

export const generateUnitForDataSize = size => {
  if (size) {
    switch (size) {
      case 1:
        return 'MB';
      case 2:
        return 'GB';
      case 3:
        return 'TB';
      default:
        return 'GB';
    }
  }
};
