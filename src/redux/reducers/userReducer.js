import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_CURRENT_TAB_INDEX,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  SET_CURRENT_COMMUNITY_IMAGE,
  SET_USERS,
  SET_SELECTED_MEMBER
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  userInfo: {},
  likes: [],
  notifications: [],
  selectedMember: {},
  users : [],
  currentCommunityImageUrl: 'https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/no-img.png?alt=media&token=34f75be3-dd43-485f-830c-f6f6cfafb8db'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_CURRENT_COMMUNITY_IMAGE:
        return {
          ...state,
          currentCommunityImageUrl: action.payload
        };
    case SET_USERS:
          return {
            ...state,
            users: action.payload
          };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        userInfo: action.payload
      };
    case SET_SELECTED_MEMBER: 
    console.log('SET_SELECTED_MEMBER CALLED');
    console.log(action.payload);
    return {
      ...state,
      selectedMember: action.payload

    }  
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screamId !== action.payload.screamId
        )
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state
      };
    default:
      return state;
  }
}
