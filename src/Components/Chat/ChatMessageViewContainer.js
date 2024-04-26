import React, { memo, useCallback, useMemo } from 'react';
import UserImg from '../../Assets/Images/people-img.svg';

const ChatMessageViewContainer = ({ data = [], userID }) => {
  const renderRow = useMemo(() => {
    return data?.map((item, index) => {
      return (
        <ChatMessageViewContainerView
          item={item}
          key={index}
          index={index}
          userID={userID}
        />
      );
    });
  }, [data, userID]);
  return <div>{renderRow}</div>;
};

const ChatMessageViewContainerView = ({ index, item, userID }) => {
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

  const OutgoingMessage = useCallback(
    messageData => (
      <li className="outgoing-massge">
        <div className="live-massge-wrapper">
          <div className="massge_inner">
            <p>{messageData?.message}</p>
          </div>
          <div className="massge_send_timing">
            <h6>
              {messageData?.created_at && formatTime(messageData.created_at)}
            </h6>
          </div>
        </div>
      </li>
    ),
    [formatTime],
  );

  const IncomingMessage = useCallback(
    messageData => (
      <li className="incoming-massge">
        <div className="incoming_user_profile">
          <img src={UserImg} alt="" />
        </div>
        <div className="incoming_user_msg_wrap">
          <div className="live-massge-wrapper">
            <div className="massge_inner">
              <p>{messageData?.message}</p>
            </div>
            <div className="massge_send_timing">
              <h6>
                {messageData?.created_at && formatTime(messageData.created_at)}
              </h6>
            </div>
          </div>
        </div>
      </li>
    ),
    [formatTime],
  );

  const dayTypeTag = useMemo(() => {
    return (
      <h6>
        {Object.keys(item).toString() === new Date().toISOString().slice(0, 10)
          ? 'Today'
          : Object.keys(item).toString() ===
            new Date(new Date() - 86400000).toISOString().slice(0, 10)
          ? 'Yesterday'
          : Object.keys(item).toString()}
      </h6>
    );
  }, [item]);

  const messagesTag = useMemo(() => {
    return (
      Object.values(item)
        //?.slice()
        // .reverse()
        ?.map(messages =>
          messages
            //    ?.slice()
            //  .reverse()
            ?.map(message => (
              <div key={message?._id}>
                {userID === message?.from_id
                  ? OutgoingMessage(message)
                  : IncomingMessage(message)}
              </div>
            )),
        )
    );
  }, [item, userID, IncomingMessage, OutgoingMessage]);

  const renderMessageRow = useMemo(() => {
    return (
      <div className="date_divider" key={`chat_messages_${index}`}>
        {dayTypeTag}
        {messagesTag}
        {/* <div ref={scrollHere}></div> */}
      </div>
    );
  }, [index, dayTypeTag, messagesTag]);

  return <>{renderMessageRow}</>;
};

export default memo(ChatMessageViewContainer);
