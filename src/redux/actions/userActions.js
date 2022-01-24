import {
  signIn,
  signUpUserWithEmail,
  signUpAdminWithEmail,
} from "../../firebaseActions/service";
import {
  getUserProfileInfo,
  updateUserDetails,
  getMemberDetails,
} from "../../firebaseActions/dataServices";

import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_SELECTED_MEMBER,
  SET_CURRENT_TAB_INDEX,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  SET_CURRENT_COMMUNITY_IMAGE,
  SET_HEADER_ACTIVE
} from "../types";
import axios from "axios";

export const updatePage = (pageName) => (dispatch) => {
  dispatch({ type: LOADING_UI, payload: pageName });
};

export const updateTabIndex = (index) => (dispatch) => {
  dispatch({ type: SET_CURRENT_TAB_INDEX, payload: index });
};
export const setActiveHeader = (value)=>(dispatch) =>{
  dispatch({ type: SET_HEADER_ACTIVE, payload: value });
}

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  const user = {
    email: userData.email,
    password: userData.password,
  };
  signIn(user)
    .then((result) => {
      const { userRole = "" } = result;
      if (userRole === "admin-pending") {
        throw Error("Admin approval pending, please contact super admin");
      }
      dispatch({ type: CLEAR_ERRORS });
      console.log("user10",result)
      dispatch({
        type: SET_USER,
        payload: result,
      });
      dispatch({ type: SET_CURRENT_TAB_INDEX, payload: 0 });
      userRole === "admin"
        ? history.push("/adminHome")
        : history.push("/portalHome");
    })
    .catch((error) => {
      dispatch({
        type: SET_ERRORS,
        payload: error.message,
      });
    });
};

export const signupUser = (newUserData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const result = await signUpUserWithEmail(newUserData);
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    console.log("error1", err);
    dispatch({
      type: SET_ERRORS,
      payload: err,
    });
  }
};

export const signupAdminUser = (newUserData) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    await signUpAdminWithEmail(newUserData);
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    console.log("error1", err);
    dispatch({
      type: SET_ERRORS,
      payload: err,
    });
  }
};

export const getUserProfileData = () => async (dispatch, getState) => {
  try {
    const {
      user: { userInfo },
    } = getState();
    const result = await getUserProfileInfo(userInfo.email);
  } catch (err) {
    console.log(err);
  }
};

export const getMemberData = (email) => async (dispatch) => {
  try {
    const result = await getMemberDetails(email);
    console.log('RESULTADO')
    console.log(result);
    dispatch({
      type: SET_SELECTED_MEMBER,
      payload: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const uploadCommunityImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/community/image", formData)
    .then((res) => {
      console.log("res", res);
      dispatch({
        type: SET_CURRENT_COMMUNITY_IMAGE,
        payload: res.data.imageUrl,
      });
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const result = await updateUserDetails(userDetails);
    const { email } = userDetails;
    const usersData = await getUserProfileInfo(email);
    dispatch({
      type: SET_USER,
      payload: usersData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post("/notifications", notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ,
      });
    })
    .catch((err) => console.log(err));
};
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers["content-type"] = "application/json";
  axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
