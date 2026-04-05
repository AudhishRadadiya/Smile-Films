import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getModuleList,
  getRoles,
  setUpdateRoleList,
} from 'Store/Reducers/Settings/Master/RolesAndPermissionSlice';
import { useParams } from 'react-router-dom';
import RolesPermissionDetail from './RolePermissionDetail';

export default function EditRolePermission() {
  const dispatch = useDispatch();
  const { selectedModuleList, updateRoleList, moduleList } = useSelector(
    ({ rolePermission }) => rolePermission,
  );
  const { id } = useParams();

  useEffect(() => {
    dispatch(getModuleList());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getRoles({ role_id: id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (
      Object.keys(selectedModuleList)?.length &&
      moduleList?.permission?.length > 0
    ) {
      let updatedList = moduleList?.permission
        ?.map(mainModule => {
          let selectedMainModule = selectedModuleList?.permissions?.find(
            selectedModule =>
              selectedModule.main_module_key ===
              mainModule?.submodules[0]?.main_module_key,
          );

          let subModule = [];
          if (selectedMainModule) {
            mainModule = {
              ...mainModule,
              isSelectedAll:
                selectedMainModule.create &&
                selectedMainModule.edit &&
                selectedMainModule.view &&
                selectedMainModule.export &&
                selectedMainModule.delete,
            };

            for (let j = 0; j < mainModule.submodules.length; j++) {
              let submodule = mainModule.submodules[j];

              let selectedSubmodule = selectedModuleList?.permissions?.find(
                selectedModule =>
                  selectedModule.sub_module_key === submodule.key,
              );

              if (selectedSubmodule) {
                submodule = {
                  ...submodule,
                  sub_module_id: selectedSubmodule?._id,
                  create: selectedSubmodule.create,
                  edit: selectedSubmodule.edit,
                  view: selectedSubmodule.view,
                  export: selectedSubmodule.export,
                  delete: selectedSubmodule.delete,
                };
                subModule.push(submodule);
              }
            }
          }

          return [{ ...mainModule, submodules: subModule }];
        })
        .flat();

      let { permission, ...rest } = selectedModuleList;

      dispatch(
        setUpdateRoleList({
          rest,
          role_name: rest.name,
          isActive: rest.isActive,
          permission: updatedList,
        }),
      );
    }
  }, [selectedModuleList, dispatch, moduleList]);

  return <RolesPermissionDetail initialValues={updateRoleList} />;
}
