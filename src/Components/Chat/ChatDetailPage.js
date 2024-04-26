import React, { memo, useCallback, useMemo, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import ActionBtn from '../../Assets/Images/action.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import ChatSideBarPage from './ChatSideBarPage';

const ChatDetailPage = ({
  dispatch,
  fetchList,
  allSearch,
  emitEvents,
  activeIndex,
  chatDetails,
  viewChatData = {},
  favoritesearch,
  fetchChatDetails,
}) => {
  const { group_id, group_name } = viewChatData || {};
  const { groupInfo, isFavoritedSucess, isDeleted, isClearChat } = useSelector(
    ({ chat }) => chat,
  );
  const [visibleRight, setVisibleRight] = useState(false);
  const [visible, setVisible] = useState(false);

  const deleteGroup = useCallback(
    group_id => {
      emitEvents({
        en: 'DELETE_GROUP',
        data: {
          groupId: group_id,
        },
      });
    },
    [emitEvents],
  );

  const deleteDialogBox = useMemo(() => {
    return (
      <Dialog
        className="delete_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="delete_popup_wrapper">
          <h2>Are you Sure you want to Delete this Group?</h2>
          <div className="delete_btn_wrap">
            <button
              className="btn_primary"
              onClick={() => {
                group_id && deleteGroup(group_id);
              }}
            >
              Delete
            </button>
            <button className="btn_border" onClick={() => setVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    );
  }, [deleteGroup, group_id, visible]);

  const isFavouriteEvent = useCallback(
    group_id => {
      emitEvents({
        en: 'FAVOURITE',
        data: {
          groupId: group_id,
        },
      });
    },
    [emitEvents],
  );

  const clearChat = useCallback(
    group_id => {
      emitEvents({
        en: 'CLEAR_CHAT',
        data: {
          groupId: group_id,
        },
      });
    },
    [emitEvents],
  );

  const fetchGroupInfo = useCallback(
    group_id => {
      emitEvents({
        en: 'GROUP_INFO',
        data: {
          groupId: group_id,
        },
      });
    },
    [emitEvents],
  );

  return (
    viewChatData &&
    Object.keys(viewChatData).length > 0 && (
      <>
        <div className="people_massge_header">
          <Row>
            <Col sm={6}>
              <div className="card flex justify-content-center">
                <ChatSideBarPage
                  dispatch={dispatch}
                  group_id={group_id}
                  allSearch={allSearch}
                  isDeleted={isDeleted}
                  groupInfo={groupInfo}
                  fetchList={fetchList}
                  setVisible={setVisible}
                  activeIndex={activeIndex}
                  chatDetails={chatDetails}
                  isClearChat={isClearChat}
                  visibleRight={visibleRight}
                  favoritesearch={favoritesearch}
                  fetchGroupInfo={fetchGroupInfo}
                  setVisibleRight={setVisibleRight}
                  isFavouriteEvent={isFavouriteEvent}
                  fetchChatDetails={fetchChatDetails}
                  isFavoritedSucess={isFavoritedSucess}
                />
                <button
                  onClick={() => {
                    setVisibleRight(true);
                    group_id && fetchGroupInfo(group_id);
                  }}
                >
                  <div className="people_profile_wrap">
                    <div className="people_img gray-profile">
                      <span>
                        {group_name
                          ? `${group_name?.charAt(0)?.toUpperCase()}`
                          : 'UN'}
                      </span>
                    </div>
                    <div className="people_name">
                      <div className="people_massge">
                        <h5>{group_name}</h5>

                        <h6 className="mb-0">
                          {chatDetails?.data?.member} Members
                        </h6>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </Col>
            <Col sm={6}>
              <div className="chat_search_wrapper">
                {/* <div className="search_btn">
                      <Button className="btn-transparent">
                        <img src={SearchIcon} alt="searchicon" />
                      </Button>
                    </div> */}
                <div className="dropdown_action_wrap">
                  <Dropdown className="dropdown_common position-static text-end">
                    <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                      <img src={ActionBtn} alt="" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={e => {
                          e.preventDefault();
                          group_id && clearChat(group_id);
                        }}
                      >
                        <img src={TrashIcon} alt="TrashIcon" /> Clear Chat
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {deleteDialogBox}
      </>
    )
  );
};
export default memo(ChatDetailPage);
