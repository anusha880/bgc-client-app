import {
  SET_SCREAMS,
  SET_POST,
  SET_MY_COMMUNITY,
  SET_COMMUNITY_POSTS,
  LOADING_MY_COMMUNITY,
  LOADING_USERS_POST,
  SET_USERS_POSTS,
  LOADING_RECOMMENDED_COMMUNITY,
  SET_ALL_USERS_COMMUNITY,
  LOADING_USERS_COMMUNITY,
  SET_REFRESH_COMMUNITY,
  LOADING_JOIN_COMMUNITY,
  SET_RECOMMENDED_COMMUNITY,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  ADD_POST,
  SUBMIT_COMMENT,
  SET_CURRENT_PAGE,
  SET_CURRENT_COMMUNITY_ID,
  SET_MEMBERS,
  LOADING_MEMBERS,
  SET_REPORTED_DATA
} from '../types'

const initialState = {
  screams: [],
  myCommunities: [],
  recommendedCommunities: [],
  recommendedCommunityLoading: false,
  joinCommunityLoading: false,
  communityPosts : [],
  usersPosts:[],
  loadingUsersPosts: false,
  loadingMyCommunities : false,
  scream: {},
  post: {},
  loading: true,
  isRefreshCommunity: false,
  isRefreshPost: false,
  currentPage: 'COMMUNITY',
  currentCommunityId: null,
  members: [],
  loadingMembers: false,
  allUsersCommunities: [],
  allUsersCommunitiesLoading: false,
  reportedData:[]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
        isRefreshPost: false
      };
      case LOADING_MEMBERS:
        return {
          ...state,
          loadingMembers: true
        };
        case LOADING_USERS_COMMUNITY:
          return {
            ...state,
            allUsersCommunitiesLoading: true,
          } 
          case SET_ALL_USERS_COMMUNITY:
            return {
              ...state,
              allUsersCommunities: action.payload,
              allUsersCommunitiesLoading: false
            };        
    case SET_CURRENT_COMMUNITY_ID:
      return {
        ...state,
        currentCommunityId: action.payload
      } 
      case SET_MEMBERS:
        return {
          ...state,
          members: action.payload,
          loadingMembers: false
        }    
    case SET_REFRESH_COMMUNITY:
      return {
        ...state,
        isRefreshCommunity: action.payload,
      } 
      case LOADING_RECOMMENDED_COMMUNITY:
        return {
          ...state,
          recommendedCommunityLoading: true,
        }
        case LOADING_MY_COMMUNITY:
          return {
            ...state,
            loadingMyCommunities: true,
          }  
      case LOADING_USERS_POST:
        return {
          ...state,
          loadingUsersPosts: true
        }
        case LOADING_JOIN_COMMUNITY:
          return {
            ...state,
            joinCommunityLoading: action.payload,
          }      
      case SET_RECOMMENDED_COMMUNITY:
        return {
          ...state,
          recommendedCommunities: action.payload,
          recommendedCommunityLoading: false
        };
    case SET_CURRENT_PAGE:
        return {
          ...state,
          currentPage: action.payload
        };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false
      };
      case SET_MY_COMMUNITY:
        return {
          ...state,
          myCommunities: action.payload,
          loadingMyCommunities: false
        };
      case SET_COMMUNITY_POSTS:
          return {
            ...state,
            communityPosts: action.payload,
            isRefreshPost: false,
            loading: false
          };
    case SET_USERS_POSTS:
            return {
              ...state,
              usersPosts: action.payload,
              loadingUsersPosts: false
            };      
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload
      };
    case SET_POST:
        return {
          ...state,
          post: action.payload
        };  
    case ADD_POST:
        return {
          ...state,
          post: action.payload
        };  
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      state.screams[index] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state,
        isRefreshPost: true,
      };
    case DELETE_SCREAM:
      index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      state.screams.splice(index, 1);
      return {
        ...state,
        isRefreshPost: true,
      };
    case POST_SCREAM:
      return {
        ...state,
        isRefreshPost: true,
        screams: [action.payload, ...state.screams]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        isRefreshPost: true,
        post: {
          ...state.post,
          comments: [...state.post.comments, action.payload]
        }
      };
      case  SET_REPORTED_DATA:
        return {
          ...state,
          reportedData: action.payload,
          loadingMembers: false
        } 
    default:
      return state;
  }
}
