import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getModuleList,
  setAddRoleList,
} from 'Store/Reducers/Settings/Master/RolesAndPermissionSlice';
import { useNavigate } from 'react-router-dom';
import RolesPermissionDetail from './RolePermissionDetail';

export default function AddRolePermission() {
  const dispatch = useDispatch();

  const { moduleList, addRoleList } = useSelector(
    ({ rolePermission }) => rolePermission,
  );

  useEffect(() => {
    dispatch(getModuleList());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(moduleList)?.length) {
      dispatch(
        setAddRoleList({
          role_name: '',
          isActive: true,
          permission: moduleList?.permission,
        }),
      );
    }
  }, [moduleList, dispatch]);

  return <RolesPermissionDetail initialValues={addRoleList} />;
}
