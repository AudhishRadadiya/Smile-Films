import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompanyRoles,
  getModuleList,
  setUpdateCompanyList,
} from 'Store/Reducers/Settings/CompanySetting/CompanyAndPermissionSlice';
import { useParams } from 'react-router-dom';
import CompanyPermissionDetail from './CompanyPermissionDetail';

export default function EditCompanyPermission() {
  const dispatch = useDispatch();
  const { selectedModuleList, updateCompanyList, moduleList } = useSelector(
    ({ companyPermission }) => companyPermission,
  );
  const { id } = useParams();

  useEffect(() => {
    dispatch(getModuleList());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getCompanyRoles({ company_id: id }));
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
              isSelectedAll: selectedMainModule.is_active,
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
                  is_active: selectedSubmodule.is_active,
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
        setUpdateCompanyList({
          permission: updatedList,
          ...rest,
        }),
      );
    }
  }, [selectedModuleList, dispatch, moduleList]);

  return <CompanyPermissionDetail initialValues={updateCompanyList} />;
}
