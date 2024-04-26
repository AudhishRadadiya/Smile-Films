import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import CustomPaginator from 'Components/Common/CustomPaginator';
import ExportIcon from '../../Assets/Images/export.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
// import ProfileImg from '../../Assets/Images/profile-img.svg';
import process from '../../Assets/Images/process.png';
import UserIcon from '../../Assets/Images/add-user.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteDataCollection,
  getExposingList,
  setExposingCurrentPage,
  setExposingPageLimit,
  setExposingSearchParam,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';
import ConfirmDeletePopup from 'Components/Common/ConfirmDeletePopup';
import _ from 'lodash';
import Loader from 'Components/Common/Loader';

const Exposing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const {
    exposingList,
    exposingCurrentPage,
    exposingPageLimit,
    exposingSearchParam,
    exposingLoading,
    exposingStepLoading,
  } = useSelector(({ exposing }) => exposing);

  useEffect(() => {
    dispatch(
      getExposingList({
        start: exposingCurrentPage,
        limit: exposingPageLimit,
        isActive: '',
        search: exposingSearchParam,
      }),
    );
  }, [dispatch, exposingCurrentPage, exposingPageLimit, exposingSearchParam]);

  const onPageChange = page => {
    let pageIndex = exposingCurrentPage;
    if (page?.page === 'Prev') pageIndex--;
    else if (page?.page === 'Next') pageIndex++;
    else pageIndex = page;
    dispatch(setExposingCurrentPage(pageIndex));
  };

  const onPageRowsChange = page => {
    dispatch(setExposingCurrentPage(page === 0 ? 0 : 1));
    dispatch(setExposingPageLimit(page));
  };

  const actionBodyTemplate = row => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="action_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                navigate(`/exposing-data-collection/${row?._id}`);
              }}
            >
              <img src={EditIcon} alt="EditIcon" /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setDeleteId(row?._id);
                setDeletePopup(true);
              }}
            >
              <img src={TrashIcon} alt="TrashIcon" /> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const handleDefaultUser = useCallback(event => {
    event.target.src = UserIcon;
  }, []);

  const AssignBodyTemplate = data => {
    return data?.exposers?.length > 0 ? (
      <ul className="assign-body-wrap">
        {data?.exposers &&
          data?.exposers?.length > 0 &&
          data?.exposers?.slice(0, 2).map((item, index) => {
            return (
              <li key={index}>
                <div className="assign-profile-wrapper">
                  <div className="assign_profile">
                    <img
                      src={item?.image ? item?.image : UserIcon}
                      alt="profileimg"
                      onError={handleDefaultUser}
                    />
                  </div>
                  <div className="profile_user_name">
                    <h5 className="m-0">{item?.employee_name}</h5>
                  </div>
                </div>
              </li>
            );
          })}

        <li>
          <div className="assign_dropdown_wrapper">
            <Dropdown className="dropdown_common position-static">
              <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                {data?.exposers?.length - 2} More...
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  {data?.exposers &&
                    data?.exposers?.length > 0 &&
                    data?.exposers?.map(item => {
                      return (
                        <div className="assign_dropdown">
                          <div className="assign_profile">
                            <img
                              src={item?.image ? item?.image : UserIcon}
                              alt="profileimg"
                              onError={handleDefaultUser}
                            />
                            <h5 className="m-0">{item?.employee_name}</h5>
                          </div>
                          <div className="profile_user_name">
                            <h6 className="text_gray m-0">{item?.item_name}</h6>
                          </div>
                        </div>
                      );
                    })}
                  {/* <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Vandana</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Pre-Wedding</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Kapil</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Teaser</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Keval</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Highlight</h6>
                    </div>
                  </div>
                  <div className="assign_dropdown">
                    <div className="assign_profile">
                      <img src={ProfileImg} alt="profileimg" />
                      <h5 className="m-0">Akash</h5>
                    </div>
                    <div className="profile_user_name">
                      <h6 className="text_gray m-0">Photos</h6>
                    </div>
                  </div> */}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </li>
      </ul>
    ) : (
      '-'
    );
  };

  const getStatus = step => {
    switch (step) {
      case 1:
        return 'Order Form';
      case 2:
        return 'Quotation';
      case 3:
        return 'Quotation Approved';
      case 4:
        return 'Assigned to Exposer';
      case 5:
        return 'Overview';
      case 6:
        return 'Completed';

      default:
        return null;
    }
  };

  const StatusBodyTemplate = data => {
    return (
      <div className="status_body_wrapper">
        <div className="verifide_wrap">
          {/* <h5 className="active m-0">1.Order Form</h5> */}
          {data?.step >= 6 ? (
            <h5 className="complete m-0">
              {`${data?.step}.${getStatus(data?.step)}`}
            </h5>
          ) : data?.step > 0 ? (
            <h5 className="active m-0">
              {`${data?.step}.${getStatus(data?.step)}`}
            </h5>
          ) : (
            <h5 className="m-0">{`${data?.step + 1}.${getStatus(
              data?.step + 1,
            )}`}</h5>
          )}

          {/*{' '}
          <h5 className="complete m-0">
            {`${data?.step}.${getStatus(data?.step)}`}
          </h5>{' '}
          */}
        </div>
        {data?.step >= 6 ? (
          ' '
        ) : (
          <div className="process_wrap">
            <img src={process} alt="process" />
          </div>
        )}
        <div className="verifide_wrap">
          {/* <h5 className="text_gray m-0">2.Quotetion</h5> */}
          {data?.step >= 6 ? (
            ''
          ) : data?.step === 0 ? (
            <h5 className="text_gray m-0">{`${data?.step + 2}.${getStatus(
              data?.step + 2,
            )}`}</h5>
          ) : (
            <h5 className="text_gray m-0">{`${data?.step + 1}.${getStatus(
              data?.step + 1,
            )}`}</h5>
          )}
        </div>
      </div>
    );
  };

  const itemsNameBodyTemplate = data => {
    let buttonTooltip = data.item_name;
    return (
      <Button
        tooltip={buttonTooltip}
        tooltipoptions={{ position: 'top' }}
        className="btn_transparent text_dark item_name_with_tooltip"
      >
        {data?.item_name}
      </Button>
    );
  };

  const companyBodyTemplate = row => {
    return (
      <span
        className="cursor_pointer hover_text"
        onClick={() => {
          navigate(`/exposing-data-collection/${row?._id}`);
        }}
      >
        {row?.company_name}
      </span>
    );
  };
  const EventDateTemplate = data => {
    return data?.start_date + ' to ' + data?.end_date;
  };

  const handleDelete = useCallback(
    async => {
      const deleteItemObj = {
        order_id: deleteId,
      };
      if (deleteId) {
        dispatch(deleteDataCollection(deleteItemObj))
          .then(response => {
            dispatch(
              getExposingList({
                start: exposingCurrentPage,
                limit: exposingPageLimit,
                isActive: '',
                search: exposingSearchParam,
              }),
            );
          })
          .catch(error => {
            console.error('Error fetching delete data:', error);
          });
      }
      setDeletePopup(false);
    },
    [dispatch, deleteId],
  );

  const handleSearchInput = e => {
    dispatch(setExposingCurrentPage(1));
    dispatch(
      getExposingList({
        start: exposingCurrentPage,
        limit: exposingPageLimit,
        isActive: '',
        search: e.target.value,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <div className="main_Wrapper">
      {(exposingLoading || exposingStepLoading) && <Loader />}
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Exposing</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul className="exposing_ul">
                  <li>
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={exposingSearchParam}
                        onChange={e => {
                          debounceHandleSearchInput(e);
                          dispatch(setExposingSearchParam(e.target.value));
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <Link to="" className="btn_border icon_btn">
                      <img src={ExportIcon} alt="" />
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper">
          <DataTable
            value={exposingList?.list}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column field="inquiry_no" header="Collection No" sortable></Column>
            <Column field="create_date" header="Create Date" sortable></Column>
            <Column
              field="company_name"
              header="Company Name"
              body={companyBodyTemplate}
              sortable
            ></Column>
            <Column field="client_name" header="Client Name" sortable></Column>
            <Column
              field="item_name"
              header="Item Names"
              body={itemsNameBodyTemplate}
              sortable
            ></Column>
            <Column field="venue" header="Venue" sortable></Column>
            <Column
              field="start_date"
              header="Event Date"
              body={EventDateTemplate}
              sortable
            ></Column>
            <Column field="confirm_by" header="Confirm By" sortable></Column>
            <Column
              field="assign_to_exposer"
              header="Assign To Exposer"
              sortable
              body={AssignBodyTemplate}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={StatusBodyTemplate}
            ></Column>
            <Column
              field="action"
              header="Action"
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
          <CustomPaginator
            dataList={exposingList?.list}
            pageLimit={exposingPageLimit}
            onPageChange={onPageChange}
            onPageRowsChange={onPageRowsChange}
            currentPage={exposingCurrentPage}
            totalCount={exposingList?.totalRows}
          />
        </div>
      </div>
      <ConfirmDeletePopup
        deletePopup={deletePopup}
        deleteId={deleteId}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </div>
  );
};
export default Exposing;
