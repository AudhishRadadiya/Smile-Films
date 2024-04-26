import React, { memo, useCallback, useMemo } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
import {
  setAllSearch,
  setActiveIndex,
  setFavoritesearch,
  setClearChatDetails,
} from 'Store/Reducers/Editing/EditingFlow/ChatSlice';
import { useSelector } from 'react-redux';

const ChatProfilePage = ({
  dispatch,
  fetchList,
  allSearch,
  allListData,
  activeIndex,
  viewChatData,
  favoritesearch,
  fetchChatDetails,
}) => {
  const { favoriteListData } = useSelector(({ chat }) => chat);

  const formatTime = useCallback(isoString => {
    if (isoString) {
      const date = new Date(isoString);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const amOrPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours < 10 ? '0' : ''}${hours}:${
        minutes < 10 ? '0' : ''
      }${minutes} ${amOrPm}`;
    }
  }, []);
  const allListDataContainer = useMemo(() => {
    return allListData?.map((list, index) => {
      return (
        <li
          key={`chat_list_${index}`}
          onClick={() => {
            fetchList(
              activeIndex,
              activeIndex === 0 ? allSearch : favoritesearch,
            );
            dispatch(setClearChatDetails({}));
            setTimeout(() => {
              list?.group_id && fetchChatDetails(list.group_id, 1, 10, true);
            }, 600);
          }}
        >
          <div className="people_profile_wrap">
            <div className="people_img gray-profile">
              <span>
                {list?.group_name
                  ? `${list?.group_name?.charAt(0)?.toUpperCase()}`
                  : 'UN'}
              </span>
            </div>
            <div className="people_name">
              <div className="people_massge">
                <h5>{list?.group_name}</h5>
                <h6 className="mb-0">{list?.last_message}</h6>
              </div>
              <div className="massge_sent_time">
                <h6>{formatTime(list?.last_message_time)}</h6>
                {list?.unread_count > 0 &&
                  (viewChatData?.group_id
                    ? list.group_id !== viewChatData?.group_id
                    : true) && (
                    <span className="unread_messages">
                      {list?.unread_count}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </li>
      );
    });
  }, [
    dispatch,
    fetchList,
    allSearch,
    formatTime,
    allListData,
    activeIndex,
    favoritesearch,
    fetchChatDetails,
    viewChatData?.group_id,
  ]);

  const allFavoriteListContainer = useMemo(() => {
    return favoriteListData?.map((list, index) => {
      return (
        <li
          key={index}
          onClick={() => {
            fetchList(
              activeIndex,
              activeIndex === 0 ? allSearch : favoritesearch,
            );
            dispatch(setClearChatDetails({}));
            setTimeout(() => {
              list?.group_id && fetchChatDetails(list.group_id, 1, 10, true);
            }, 600);
          }}
        >
          <div className="people_profile_wrap">
            <div className="people_img gray-profile">
              <span>
                {list?.group_name
                  ? `${list?.group_name?.charAt(0)?.toUpperCase()}`
                  : 'UN'}
              </span>
            </div>
            <div className="people_name">
              <div className="people_massge">
                <h5>{list?.group_name}</h5>
                <h6 className="mb-0">{list?.last_message}</h6>
              </div>
              <div className="massge_sent_time">
                <h6>{formatTime(list?.last_message_time)}</h6>
                {list?.unread_count > 0 &&
                  (viewChatData?.group_id
                    ? list.group_id !== viewChatData?.group_id
                    : true) && (
                    <span className="unread_messages">
                      {list?.unread_count}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </li>
      );
    });
  }, [
    dispatch,
    allSearch,
    fetchList,
    formatTime,
    activeIndex,
    viewChatData,
    favoritesearch,
    fetchChatDetails,
    favoriteListData,
  ]);

  const handleSearchProfileForAllSearch = useCallback(
    e => {
      fetchList(0, e.target.value);
    },
    [fetchList],
  );
  const handleSearchProfileForFavorite = useCallback(
    e => {
      fetchList(1, e.target.value);
    },
    [fetchList],
  );

  const debounceHandleSearchInputForAllSearch = useCallback(
    _.debounce(handleSearchProfileForAllSearch, 800),
    [],
  );
  const debounceHandleSearchInputFavorite = useCallback(
    _.debounce(handleSearchProfileForFavorite, 800),
    [],
  );

  return (
    <div className="card p-0">
      <TabView
        activeIndex={activeIndex}
        onTabChange={async e => {
          if (activeIndex !== e.index) {
            e.index === 0
              ? dispatch(setFavoritesearch(''))
              : dispatch(setAllSearch(''));
            await dispatch(setActiveIndex(e.index));
            await fetchList(
              e.index,
              e.index === 0 ? allSearch : favoritesearch,
            );
          }
        }}
      >
        <TabPanel header="All">
          <div className="username_search">
            <div className="form_group search_input">
              <InputText
                placeholder="Search by people, contact"
                className="input_wrap search_wrap"
                name="allSearch"
                value={allSearch}
                onChange={e => {
                  dispatch(setAllSearch(e.target.value));
                  debounceHandleSearchInputForAllSearch(e);
                }}
              />
            </div>
            <div className="people_profile_chat">
              <ul>{activeIndex === 0 && allListDataContainer}</ul>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Favorites">
          <div className="username_search">
            <div className="form_group search_input">
              <InputText
                placeholder="Search by people, contact"
                className="input_wrap search_wrap"
                name="favoritesearch"
                value={favoritesearch}
                onChange={e => {
                  dispatch(setFavoritesearch(e.target.value));
                  debounceHandleSearchInputFavorite(e, 1);
                }}
              />
            </div>
            <div className="people_profile_chat favorites_tab">
              <ul>{activeIndex === 1 && allFavoriteListContainer}</ul>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};
export default memo(ChatProfilePage);
