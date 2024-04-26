import React, { useCallback, useEffect } from 'react';
import SendIcon from '../../Assets/Images/send-icon.svg';
import { socket } from 'socket';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAllListData,
  setFavoriteListData,
  setChatDetails,
  setViewChatData,
  setGroupInfo,
  setSendMsg,
  setIsFavoritedSucess,
  setIsDeleted,
  setIsClearChat,
  setUserID,
  setFetchListParams,
  setClearChatDetails,
  setIsReplaceMsg,
} from 'Store/Reducers/Editing/EditingFlow/ChatSlice';

import { useFormik } from 'formik';
import ChatProfilePage from './ChatProfilePage';
import ChatDetailPage from './ChatDetailPage';
import ChatMessageView from './ChatMessageView';

export default function Chat() {
  const dispatch = useDispatch();
  const {
    sendMsg,
    allSearch,
    allListData,
    chatDetails,
    activeIndex,
    viewChatData,
    favoritesearch,
    fetchListParams,
    isAuthortiyToSendMsg,
  } = useSelector(({ chat }) => chat);

  const emitEvents = useCallback(sendDataDetails => {
    socket.emit('req', sendDataDetails);
  }, []);

  const updateSocketData = useCallback(
    res => {
      const { data, en } = res;
      if (en === 'LIST' && data) {
        if (activeIndex === 0) {
          const reversedData = [...data];
          dispatch(setAllListData(reversedData));
          dispatch(setFavoriteListData([]));
        } else {
          dispatch(setFavoriteListData(data));
        }
      } else if (en === 'CHAT_DETAIL') {
        dispatch(setChatDetails(res));
      } else if (en === 'GROUP_INFO') {
        dispatch(setGroupInfo(res));
      } else if (en === 'SEND_MESSAGE') {
        dispatch(setSendMsg(res.data));
      } else if (en === 'DELETE_GROUP') {
        if (res && res.status === 0) {
          dispatch(setIsDeleted({ success: true, message: data.msg }));
        } else {
          dispatch(setIsDeleted({ success: false, message: data.msg }));
        }
      } else if (en === 'FAVOURITE' && data?.msg) {
        dispatch(setIsFavoritedSucess({ success: true, message: data.msg }));
      } else if (en === 'CLEAR_CHAT' && data?.msg) {
        dispatch(setClearChatDetails({}));
        dispatch(setIsClearChat(data.msg));
      }
    },
    [dispatch, activeIndex],
  );

  useEffect(() => {
    socket.on('res', res => {
      if (typeof res === 'object' && Object.keys(res)?.length > 0) {
        updateSocketData(res);
      }
    });
  }, [dispatch, updateSocketData]);

  useEffect(() => {
    function onConnect() {
      let UserPreferences = localStorage.getItem('UserPreferences');
      if (UserPreferences) {
        UserPreferences = JSON.parse(window?.atob(UserPreferences));
      }
      var sendData = {
        en: 'JU',
        data: {
          user_id: UserPreferences?.employee?._id,
        },
      };
      socket.emit('req', sendData);
      dispatch(setUserID(sendData?.data?.user_id));
    }
    onConnect();
    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
    };
  }, [dispatch]);

  const fetchList = useCallback(
    (isFavouriteValue = 0, searchValue = '') => {
      emitEvents({
        en: 'LIST',
        data: {
          start: 1,
          limit: 10000,
          isFavourite: isFavouriteValue === 0 ? 'false' : 'true',
          search: searchValue,
        },
      });
    },
    [emitEvents],
  );

  useEffect(() => {
    fetchList();
  }, []);

  const setReadChatHandler = useCallback(() => {
    emitEvents({
      en: 'READ_CHAT',
      data: {
        groupId: '6606508b35aac383e939b26e',
      },
    });
  }, [emitEvents]);

  const fetchChatDetails = useCallback(
    (group_id, start = 1, limit = 10, isLoadingValue = false) => {
      dispatch(
        setFetchListParams({
          ...fetchListParams,
          start: start,
          isLoading: isLoadingValue,
          limit: fetchListParams.limit,
        }),
      );
      allListData?.length > 0 &&
        dispatch(
          setViewChatData(
            allListData.find(group => group.group_id === group_id),
          ),
        );
      emitEvents({
        en: 'CHAT_DETAIL',
        data: {
          groupId: group_id,
          start: start || 0,
          limit: limit,
        },
      });
    },
    [fetchListParams, allListData, dispatch, emitEvents],
  );

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: values => {
      sendMessage(viewChatData.group_id, values.message, 1, '');
      resetForm();
    },
  });

  const { values, handleChange, resetForm, handleSubmit } = formik;

  const sendMessage = useCallback(
    (group_id, message, messageType, link) => {
      emitEvents({
        en: 'SEND_MESSAGE',
        data: {
          groupId: group_id,
          message: message,
          messageType: messageType,
          link: link,
        },
      });
    },
    [emitEvents],
  );

  const isRefreshChatApi = useCallback(() => {
    dispatch(setSendMsg(''));
    dispatch(setIsReplaceMsg(true));
    if (viewChatData?.group_id) {
      setReadChatHandler(viewChatData.group_id);
      fetchChatDetails(viewChatData.group_id, 1, 10);
    }
    fetchList(activeIndex, activeIndex === 0 ? allSearch : favoritesearch);
  }, [
    dispatch,
    allSearch,
    fetchList,
    activeIndex,
    viewChatData,
    favoritesearch,
    fetchChatDetails,
    setReadChatHandler,
  ]);

  useEffect(() => {
    if (sendMsg) {
      isRefreshChatApi();
    }
  }, [sendMsg, isRefreshChatApi]);

  return (
    <div className="main_Wrapper">
      <div className="chat_main_wrapper">
        <div className="chat_profile">
          <ChatProfilePage
            dispatch={dispatch}
            fetchList={fetchList}
            allSearch={allSearch}
            allListData={allListData}
            activeIndex={activeIndex}
            viewChatData={viewChatData}
            favoritesearch={favoritesearch}
            fetchChatDetails={fetchChatDetails}
          />
        </div>
        <div className="chat_details">
          <ChatDetailPage
            dispatch={dispatch}
            fetchList={fetchList}
            allSearch={allSearch}
            emitEvents={emitEvents}
            activeIndex={activeIndex}
            chatDetails={chatDetails}
            viewChatData={viewChatData}
            favoritesearch={favoritesearch}
            fetchChatDetails={fetchChatDetails}
          />
          <ChatMessageView
            viewChatData={viewChatData}
            fetchChatDetails={fetchChatDetails}
          />
          <form onSubmit={handleSubmit}>
            <div className="msg_send_bar_wrapper">
              {/* <div className="send_emoji_wrapper">
                <button>
                  <img src={EmojiIcon} alt="" />
                </button>
                <button>
                  <img src={AttechmentIcon} alt="" />
                </button>
              </div> */}
              <div className="send_msg_wrapper">
                <input
                  type="text"
                  placeholder="Type here..."
                  name="message"
                  value={values.message}
                  disabled={!isAuthortiyToSendMsg}
                  onChange={handleChange}
                />
              </div>
              <div className="send_btn_wrapper">
                <button type="submit">
                  <img src={SendIcon} alt="" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
