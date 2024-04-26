import React, { memo, useEffect, useMemo } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  setIsClearChat,
  setIsDeleted,
  setIsFavoritedSucess,
  setViewChatData,
} from 'Store/Reducers/Editing/EditingFlow/ChatSlice';

const ChatSideBarPage = ({
  dispatch,
  group_id,
  allSearch,
  isDeleted,
  groupInfo,
  fetchList,
  setVisible,
  activeIndex,
  chatDetails,
  isClearChat,
  visibleRight,
  favoritesearch,
  fetchGroupInfo,
  setVisibleRight,
  isFavouriteEvent,
  fetchChatDetails,
  isFavoritedSucess,
}) => {
  const { isFavourite, group_name, memberData, status } = groupInfo?.data || {};

  useEffect(() => {
    if (isFavoritedSucess?.success === true && group_id) {
      fetchGroupInfo(group_id);
      setTimeout(() => {
        fetchList(activeIndex, activeIndex === 0 ? allSearch : favoritesearch);
      }, 1000);
      if (isFavoritedSucess.message) {
        toast.success(isFavoritedSucess.message);
      }
      dispatch(setIsFavoritedSucess({ success: false, message: '' }));
    }
    if (isClearChat && group_id) {
      fetchChatDetails(group_id, 1, 10, true);
      setTimeout(() => {
        fetchList(activeIndex, activeIndex === 0 ? allSearch : favoritesearch);
      }, 1000);
      toast.success(isClearChat);
      dispatch(setIsClearChat(''));
    }
    if (isDeleted?.message !== '') {
      if (isDeleted.success === true) {
        toast.success(isDeleted.message);
        setTimeout(() => {
          fetchList(
            activeIndex,
            activeIndex === 0 ? allSearch : favoritesearch,
          );
          setVisible(false);
          dispatch(setViewChatData(''));
          setVisibleRight(false);
        }, 1000);
      } else {
        toast.error(isDeleted.message);
      }

      dispatch(setIsDeleted({ success: false, message: '' }));
    }
  }, [dispatch, isDeleted, isClearChat, isFavoritedSucess]);

  const groupFavoriteView = useMemo(() => {
    return (
      <>
        <i
          className={isFavourite ? 'pi pi-heart-fill' : 'pi pi-heart'}
          style={{
            marginRight: '8px',
            fontSize: '19px',
            color: isFavourite ? 'red' : 'black',
          }}
          onClick={e => {
            e.preventDefault();
            group_id && isFavouriteEvent(group_id);
          }}
        ></i>
        {group_name}
      </>
    );
  }, [group_id, group_name, isFavourite, isFavouriteEvent]);

  const groupMemberView = useMemo(() => {
    return memberData?.map((member, index) => (
      <GroupMemberViewContainer key={index} index={index} {...member} />
    ));
  }, [memberData]);

  return (
    <Sidebar
      visible={visibleRight}
      position="right"
      onHide={() => setVisibleRight(false)}
      className="conversation_sidebar"
    >
      <div className="profile_top_wrap">
        <h3>Group info</h3>
      </div>
      <div className="conversation_info">
        <div className="group_icon">
          <span>
            {group_name ? group_name?.charAt(0)?.toUpperCase() : 'UN'}
          </span>
        </div>
        <div className="group_name_text">
          <h2>{groupFavoriteView}</h2>
        </div>
      </div>
      <div className="members-profile">
        <div className="group-typ">
          <h5>Who Can Send message ?</h5>
          <div className="radio_wrapper d-flex">
            <div className="radio-inner-wrap d-flex align-items-center">
              <RadioButton
                inputId="ingredient1"
                name="pizza"
                value="Admins"
                // onChange={e => setIngredient(e.value)}
                checked={status !== 'member'}
              />
              <label htmlFor="ingredient1" className="ml-2">
                Only Admins
              </label>
            </div>
            <div className="radio-inner-wrap d-flex align-items-center">
              <RadioButton
                inputId="ingredient2"
                name="pizza"
                value="Member"
                // onChange={e => setIngredient(e.value)}
                checked={status === 'member'}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Any Member
              </label>
            </div>
          </div>
        </div>
        <div className="member_count">
          <h4>{chatDetails?.data?.member || 0} Members</h4>
        </div>
        <div className="members_list">
          <ul>{groupMemberView}</ul>
        </div>
      </div>
      <div className="group-delete">
        <Button
          className="delete_btn"
          label="Show"
          onClick={() => setVisible(true)}
        >
          Delete Group
        </Button>
      </div>
    </Sidebar>
  );
};

const GroupMemberViewContainer = ({
  index,
  image,
  isAdmin,
  last_name,
  first_name,
}) => {
  const memberImgTag = useMemo(() => {
    return (
      <div className="people_img gray-profile">
        <img src={image} alt="group_member_img" />
      </div>
    );
  }, [image]);
  const memberNameTag = useMemo(() => {
    return (
      <div className="people_massage">
        <h5>
          {first_name} {last_name}
        </h5>
      </div>
    );
  }, [first_name, last_name]);
  const adminTag = useMemo(() => {
    return (
      <div className="admin_tag">
        <h6>ADMIN</h6>
      </div>
    );
  }, []);

  const renderRow = useMemo(() => {
    return (
      <li key={`group_member_${index}`}>
        <div className="people_profile_wrap">
          {memberImgTag}
          <div className="people_name">
            {memberNameTag}
            {isAdmin && adminTag}
          </div>
        </div>
      </li>
    );
  }, [index, isAdmin, adminTag, memberImgTag, memberNameTag]);
  return <>{renderRow}</>;
};

export default memo(ChatSideBarPage);
