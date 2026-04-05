import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  chatMessageCount: 0,
  allListData: [],
  favoriteListData: [],
  activeIndex: 0,
  allSearch: '',
  favoritesearch: '',
  isReplaceMsg: false,
  chatDetails: {},
  userID: '',
  viewChatData: {},
  groupInfo: {},
  sendMsg: '',
  isFavoritedSucess: { success: false, message: '' },
  isDeleted: { success: false, message: '' },
  isClearChat: '',
  isAuthortiyToSendMsg: false,
  fetchListParams: {
    start: 1,
    limit: 10,
    hasMore: true,
    isLoading: false,
  },
  isChatProfileInView: true,
};

const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatMessageCount: (state, action) => {
      state.chatMessageCount = action.payload;
    },
    setAllListData: (state, action) => {
      state.allListData = action.payload;
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setFavoriteListData: (state, action) => {
      state.favoriteListData = action.payload;
    },
    setAllSearch: (state, action) => {
      state.allSearch = action.payload;
    },
    setFavoritesearch: (state, action) => {
      state.favoritesearch = action.payload;
    },
    setIsReplaceMsg: (state, action) => {
      state.isReplaceMsg = action.payload;
    },

    setIsChatProfileInView: (state, action) => {
      state.isChatProfileInView = action.payload;
    },
    setChatDetails: (state, action) => {
      let chatData = [];
      if (Object.keys(state.chatDetails)?.length === 0 || state.isReplaceMsg) {
        if (action?.payload?.data?.data?.length > 0) {
          let upcomingChatDetailsData = [...action.payload.data.data];
          upcomingChatDetailsData?.forEach(item => {
            if (Object.values(item)?.[0]?.length > 0) {
              chatData = [...chatData, ...Object.values(item)[0]];
            }
          });

          let dateValue;
          chatData = chatData.map((item, index) => {
            if (index === 0) {
              dateValue = item.filterDate;
              if (
                chatData[index + 1] &&
                chatData[index + 1].filterDate !== dateValue
              ) {
                return { ...item, isNewDate: true };
              } else if (!chatData[index + 1]) {
                return { ...item, isNewDate: true };
              }
              return item;
            } else if (
              chatData[index + 1] &&
              chatData[index + 1].filterDate !== dateValue
            ) {
              dateValue = chatData[index + 1].filterDate;
              return { ...item, isNewDate: true };
            } else if (
              chatData?.length - 1 === index &&
              item?.filterDate &&
              dateValue === item.filterDate
            ) {
              dateValue = item.filterDate;
              return { ...item, isNewDate: true };
            }
            return item;
          });
        }
        state.chatDetails = {
          ...action.payload,
          data: { ...action.payload.data, data: chatData },
        };
      } else {
        if (Object?.keys(action.payload)?.length > 0) {
          let oldChatDetailsData =
            state.chatDetails?.data?.data?.length > 0
              ? [...state.chatDetails?.data?.data]
              : [];
          let newChatDetailsData =
            action.payload?.data?.data?.length > 0
              ? [...action.payload?.data?.data]
              : [];
          let upcomingChatDetailsData = [];
          if (newChatDetailsData?.length > 0) {
            newChatDetailsData?.forEach(item => {
              if (Object.values(item)?.[0]?.length > 0) {
                upcomingChatDetailsData = [
                  ...upcomingChatDetailsData,
                  ...Object.values(item)[0],
                ];
              }
            });
            let dateValue;
            //   upcomingChatDetailsData = upcomingChatDetailsData.map(
            //     (item, index) => {
            //       if (index === 0) {
            //         dateValue = item.filterDate;
            //         return item;
            //       } else if (
            //         upcomingChatDetailsData[index + 1] &&
            //         upcomingChatDetailsData[index + 1].filterDate !== dateValue
            //       ) {
            //         dateValue = upcomingChatDetailsData[index + 1].filterDate;
            //         return { ...item, isNewDate: true };
            //       } else if (
            //         upcomingChatDetailsData?.length - 1 === index &&
            //         item?.filterDate &&
            //         dateValue === item.filterDate
            //       ) {
            //         dateValue = item.filterDate;
            //         return { ...item, isNewDate: true };
            //       }
            //       return item;
            //       /*  if (item?.filterDate && dateValue !== item.filterDate) {
            //       dateValue = item.filterDate;
            //       return { ...item, isNewDate: true };
            //     }
            //     return item; */
            //     },
            //   );
            // }
            oldChatDetailsData = [
              ...oldChatDetailsData,
              ...upcomingChatDetailsData,
            ];
            oldChatDetailsData = oldChatDetailsData.map((item, index) => {
              if (index === 0) {
                dateValue = item.filterDate;
                return item;
              } else if (
                oldChatDetailsData[index + 1] &&
                oldChatDetailsData[index + 1].filterDate !== dateValue
              ) {
                dateValue = oldChatDetailsData[index + 1].filterDate;
                return { ...item, isNewDate: true };
              } else if (
                oldChatDetailsData?.length - 1 === index &&
                item?.filterDate &&
                dateValue === item.filterDate
              ) {
                dateValue = item.filterDate;
                return { ...item, isNewDate: true };
              }
              return { ...item, isNewDate: false };
              /*  if (item?.filterDate && dateValue !== item.filterDate) {
              dateValue = item.filterDate;
              return { ...item, isNewDate: true };
            }
            return item; */
            });
          }
          /* newChatDetailsData?.forEach(item => {
            if (Object?.keys(item)?.length > 0) {
              if (
                oldChatDetailsData?.find(
                  item2 => Object.keys(item2)[0] === Object.keys(item)[0],
                )
              ) {
                oldChatDetailsData = oldChatDetailsData?.map(item2 => {
                  if (Object.keys(item2)[0] === Object.keys(item)[0]) {
                    return {
                      [Object.keys(item2)[0]]: [
                        ...Object.values(item2)[0],
                        ...Object.values(item)[0],
                      ],
                    };
                  }
                  return item2;
                });
                return oldChatDetailsData;
              } else {
                upcomingChatDetailsData.push(item);
              }
            }
          }); */
          /*  oldChatDetailsData = [
            ...oldChatDetailsData,
            ...upcomingChatDetailsData,
          ]; */
          oldChatDetailsData = {
            ...action.payload,
            data: { ...action.payload.data, data: oldChatDetailsData },
          };
          state.chatDetails = oldChatDetailsData;
        }
      }
      state.isAuthortiyToSendMsg = action.payload?.data?.is_message
        ? action.payload.data.is_message
        : false;
      state.fetchListParams = { ...state.fetchListParams, isLoading: false };
      state.isReplaceMsg = false;
    },
    setClearChatDetails: (state, action) => {
      state.chatDetails = action.payload || {};
      state.isAuthortiyToSendMsg = false;
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setViewChatData: (state, action) => {
      state.viewChatData = action.payload;
    },
    setGroupInfo: (state, action) => {
      state.groupInfo = action.payload;
    },
    setSendMsg: (state, action) => {
      state.sendMsg = action.payload;
    },
    setIsFavoritedSucess: (state, action) => {
      state.isFavoritedSucess = action.payload;
    },
    setIsDeleted: (state, action) => {
      state.isDeleted = action.payload;
    },
    setIsClearChat: (state, action) => {
      state.isClearChat = action.payload;
    },
    setFetchListParams: (state, action) => {
      state.fetchListParams = action.payload;
    },
  },
});

export const {
  setUserID,
  setSendMsg,
  setAllSearch,
  setIsDeleted,
  setGroupInfo,
  setIsClearChat,
  setIsReplaceMsg,
  setChatDetails,
  setActiveIndex,
  setAllListData,
  setViewChatData,
  setFavoritesearch,
  setFetchListParams,
  setFavoriteListData,
  setClearChatDetails,
  setChatMessageCount,
  setIsFavoritedSucess,
  setIsChatProfileInView,
} = ChatSlice.actions;

export default ChatSlice.reducer;
