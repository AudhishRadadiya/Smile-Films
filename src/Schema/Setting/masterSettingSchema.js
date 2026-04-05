import * as Yup from 'yup';
import moment from 'moment';

export const projectTypeSchema = Yup.object().shape({
  project_type: Yup.string()
    .min(1, 'Project Type must be at least 1 characters')
    .max(50, 'Project Type cannot exceed 50 characters')
    .required('Project Type is required'),
  project_price: Yup.number()
    .min(1, 'Project Price minimum 1 required')
    .max(10000000, 'Project Price should be maximum 10000000')
    .required('Project Price is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const subscriptionSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Subscription Name must be at least 1 characters')
    .max(100, 'Subscription Name cannot exceed 100 characters')
    .required('Subscription Name is required'),
  duration: Yup.number()
    .min(0, 'Duration minimum 1 required')
    .max(10000000, 'Duration should be maximum 10000000')
    .required('Duration is required'),
  price: Yup.number()
    .max(10000000, 'Price should be maximum 10000000')
    .required('Price is required'),
  description: Yup.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .notRequired(),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const countrySchema = Yup.object().shape({
  country: Yup.string()
    .min(1, 'Country must be at least 1 characters')
    .max(20, 'Country cannot exceed 20 characters')
    .required('Country is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const stateSchema = Yup.object().shape({
  state: Yup.string()
    .min(1, 'State must be at least 1 characters')
    .max(20, 'State cannot exceed 20 characters')
    .required('State is required'),
  country_id: Yup.string().required('Country is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const citySchema = Yup.object().shape({
  city: Yup.string()
    .min(1, 'City must be at least 1 characters')
    .max(20, 'City cannot exceed 20 characters')
    .required('City is required'),
  country_id: Yup.string().required('Country is required'),
  state_id: Yup.string().required('State is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const referencesTypeSchema = Yup.object().shape({
  reference_name: Yup.string()
    .min(1, 'Reference must be at least 1 characters')
    .max(100, 'Reference cannot exceed 100 characters')
    .required('Reference is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const devicesTypeSchema = Yup.object().shape({
  device_name: Yup.string()
    .min(1, 'Devices Name must be at least 1 characters')
    .max(100, 'Devices Name cannot exceed 100 characters')
    .required('Devices Name is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const changeFinancialYearTypeSchema = Yup.object().shape({
  start_date: Yup.string().required('Start Date is required'),
  // end_date: Yup.string()
  //   .required('End Date is required')
  //   .test(
  //     'is-after-start-date',
  //     'End Date must be within one year of Start Date',
  //     (value, context) => {
  //       const startDate = new Date(context.parent.start_date);
  //       const endDate = new Date(value);
  //       const exactEndDate = new Date(moment(startDate).add(1, 'year'));

  //       return (
  //         endDate.getFullYear() === exactEndDate.getFullYear() &&
  //         endDate.getMonth() === exactEndDate.getMonth() &&
  //         endDate.getDate() === exactEndDate.getDate()
  //       );
  //     },
  //   ),
  end_date: Yup.string().required('End Date is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
  default: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const currrencyTypeSchema = Yup.object().shape({
  currency_name: Yup.string()
    .min(1, 'Currancy Name must be at least 1 characters')
    .max(20, 'Currancy Name cannot exceed 20 characters')
    .required('Currancy Name is required'),
  currency_code: Yup.string()
    .min(1, 'Currancy Name must be at least 1 characters')
    .max(5, 'Currancy Name cannot exceed 5 characters')
    .required('Currancy Code is required'),
  exchange_rate: Yup.number()
    .max(10000000, 'Exchange Rate should be maximum 10000000')
    .required('Exchange Rate is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const productSchema = Yup.object().shape({
  item_name: Yup.string()
    .min(1, 'Item Name must be at least 1 characters')
    .max(100, 'Item Name cannot exceed 100 characters')
    .required('Item Name is required'),
  type: Yup.number().required('Please select an item type'),
  // item_description: Yup.string()
  //   .min(7, 'Item Description must be at least 1 characters')
  //   .max(1007, 'Item Description cannot exceed 1000 characters')
  //   .required('Item Description is required'),
  // item_price: Yup.number()
  // .min(1, 'Item price minimum 1 required')
  // .max(10000000, 'Item price should be maximum 10000000')
  // .required('Item Price is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const packageSchema = Yup.object().shape({
  package_name: Yup.string()
    .min(1, 'Package Name must be at least 1 characters')
    .max(100, 'Package Name cannot exceed 100 characters')
    .required('Package Name is required'),
  type: Yup.number().required('Please select an item type'),
  items: Yup.array()
    .min(1, 'Please select any one item')
    .required('Item is required'),
  project_type: Yup.string().required('Project Type is required'),
  // remark: Yup.string()
  // .max(1000, 'Description cannot exceed 1000 characters')
  // .required('Description is required'),
  // price: Yup.number()
  //   .min(0, 'Price minimum 1 required')
  //   .max(10000000, 'Price should be maximum 10000000')
  //   .required('Price is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const addRolePermissionSchema = Yup.object().shape({
  role_name: Yup.string()
    .min(1, 'Role Name must be at least 1 characters')
    .max(100, 'Role Name cannot exceed 100 characters')
    .required('Role Name is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});

export const companyPermissionSchema = Yup.object().shape({
  company_name: Yup.string()
    .min(1, 'Role Name must be at least 1 characters')
    .max(100, 'Role Name cannot exceed 100 characters')
    .required('Role Name is required'),
  isActive: Yup.boolean().oneOf([true, false], 'Invalid option'),
});
