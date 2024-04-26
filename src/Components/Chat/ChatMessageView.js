import React, { memo, useMemo } from 'react';
import Logo from '../../Assets/Images/logo.svg';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

const ChatMessageView = ({ viewChatData, fetchChatDetails }) => {
  const { chatDetails, userID, fetchListParams } = useSelector(
    ({ chat }) => chat,
  );

  const chatCurrentData = useMemo(() => {
    const chatDataArr =
      chatDetails?.data?.data?.length > 0 ? [...chatDetails?.data?.data] : [];
    let count = chatDetails?.data?.message_count || 0;
    return { chatDataArr, count };
  }, [chatDetails]);

  const fetchNext = () => {
    if (chatCurrentData.chatDataArr?.length < chatDetails.data.message_count) {
      fetchChatDetails(
        viewChatData && viewChatData?.group_id,
        parseInt(fetchListParams?.start) + 1,
        parseInt(fetchListParams?.limit),
        true,
      );
    }
  };

  return (
    <div className="live_chat_wrapper">
      <div
        className={`live_chat_inner ${
          Object?.keys(viewChatData || [])?.length > 0
            ? ''
            : 'live_chat_welcome_txt'
        }`}
      >
        <ul className="h-100">
          {chatCurrentData?.count > 0 && (
            <div
              id="scrollableDiv"
              className="scrollable_div"
              style={{
                height: 500,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                justifyContent: 'end',
                paddingRight: '10px',
              }}
            >
              <InfiniteScroll
                dataLength={chatCurrentData?.chatDataArr?.length || 0}
                next={() => fetchNext()}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={
                  chatCurrentData?.chatDataArr?.length < chatCurrentData?.count
                }
                loader={
                  fetchListParams?.isLoading && (
                    <h4 className="text-center">Loading...</h4>
                  )
                }
                scrollableTarget="scrollableDiv"
              >
                {chatCurrentData?.chatDataArr?.map((item, index) => {
                  return (
                    <ChatMessageViewContainerData
                      {...item}
                      key={index}
                      index={index}
                      userID={userID}
                    />
                  );
                })}
              </InfiniteScroll>
            </div>
          )}
          {chatCurrentData?.count === 0 && fetchListParams?.isLoading && (
            <h4 className="h-100 d-flex justify-content-center align-items-center m-0">
              Loading...
            </h4>
          )}
          {(!viewChatData || Object?.keys(viewChatData)?.length === 0) && (
            <li className="d-flex align-iems-center justify-content-center h-100 m-0">
              <div className="welcome_txt">
                <h1>Welcome To</h1>
                <img alt="logo" src={Logo} />
                <h4>
                  "Start a conversation. Let's create something amazing
                  together!"
                </h4>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const ChatMessageViewContainerData = ({
  index,
  image,
  userID,
  from_id,
  message,
  isNewDate,
  filterDate,
  created_at,
}) => {
  const dayTypeTag = useMemo(() => {
    return (
      <div className="devider_wrap">
        <h6>
          {filterDate.toString() === new Date().toISOString().slice(0, 10)
            ? 'Today'
            : filterDate ===
              new Date(new Date() - 86400000).toISOString().slice(0, 10)
            ? 'Yesterday'
            : filterDate.toString()}
        </h6>
      </div>
    );
  }, [filterDate]);

  const formatTime = useMemo(() => {
    if (created_at) {
      const date = new Date(created_at);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const amOrPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours < 10 ? '0' : ''}${hours}:${
        minutes < 10 ? '0' : ''
      }${minutes} ${amOrPm}`;
    }
  }, [created_at]);

  const OutgoingMessage = useMemo(() => {
    return (
      <>
        <div className="live-massge-wrapper">
          <div className="massge_inner">
            <p>{message}</p>
          </div>
          <div className="massge_send_timing">
            <h6>{created_at && formatTime}</h6>
          </div>
        </div>
      </>
    );
  }, [message, created_at, formatTime]);

  const IncomingMessage = useMemo(
    () => (
      <>
        <div className="incoming_user_profile">
          <img src={image} alt="" />
        </div>
        <div className="incoming_user_msg_wrap">
          <div className="live-massge-wrapper">
            <div className="massge_inner">
              <p>{message}</p>
            </div>
            <div className="massge_send_timing">
              <h6>{created_at && formatTime}</h6>
            </div>
          </div>
        </div>
      </>
    ),
    [image, message, created_at, formatTime],
  );

  const renderRow = useMemo(() => {
    return (
      <div className="date_divider">
        <li
          className={userID === from_id ? 'outgoing-massge' : 'incoming-massge'}
          key={`chat_detail_${index}`}
        >
          {isNewDate && dayTypeTag}
          {from_id ? OutgoingMessage : IncomingMessage}
        </li>
      </div>
    );
  }, [
    index,
    userID,
    from_id,
    isNewDate,
    dayTypeTag,
    OutgoingMessage,
    IncomingMessage,
  ]);

  return <>{renderRow}</>;
};

export default memo(ChatMessageView);
