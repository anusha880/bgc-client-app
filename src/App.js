import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import jwtDecode from "jwt-decode";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
// Components
import themeObject from "./util/theme";
import AuthRoute from "./util/AuthRoute";
// Pages
import PortalHome from "./components/BGCPortalHome/Home";
import communityHome from "./components/BGCCommunity/Home";
import communityDetails from "./components/BGCCommunity/Details";
import BGCDirectoryHome from "./components/BGCDirectory/DirectoryHome";
import BGCProfileHome from "./components/UserProfile/BGCProfileHome";
import login from "./pages/login/login";
import signup from "./pages/Signup/signup";
import AdminSignup from "./pages/Signup/AdminSignup";
import UserProfile from "./pages/UserProfile";
import RecoverPassword from "./pages/passwordrecovery/RecoverPassword";

import axios from "axios";
import AdminAuthRoute from "./util/AdminAuthRoute";
import { AdminHome } from "./components/Admin/AdminHome";
import Navigation from "./components/layout/Navigation";
import Navbar from "./components/layout/Navigation";

const theme = createTheme(themeObject);

axios.defaults.baseURL =
  "https://us-central1-bgc-functions.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
console.log("token", token);
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp < Date.now()) {
    // store.dispatch({ type: SET_UNAUTHENTICATED });
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    // store.dispatch({ type: SET_UNAUTHENTICATED });
    store.dispatch({ type: SET_AUTHENTICATED });
    // axios.defaults.headers.common['Authorization'] = token;
    // store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <CssBaseline />
            {/* <div className="container"> */}
            <Container fixed>
              <Switch>
                <Route exact path="/" component={login} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
                <Route exact path="/admin-signup" component={AdminSignup} />
                <Route exact path="/recover" component={RecoverPassword} />
                <Route exact path="/directory" component={BGCDirectoryHome} />

                <Route path="/userprofile/:userId" component={BGCProfileHome} />
                <AuthRoute exact path="/portalHome" component={BGCProfileHome} />
                <AuthRoute
                  exact
                  path="/communityHome"
                  component={communityHome}
                />
                <AuthRoute
                  exact
                  path="/userprofile"
                  component={BGCProfileHome}
                />
                <AuthRoute
                  exact
                  path="/directory"
                  component={BGCDirectoryHome}
                />
                <AuthRoute
                  exact
                  path="/communityHome/:communityId"
                  component={communityDetails}
                />
                <AdminAuthRoute exact path="/adminHome" component={AdminHome} />
              </Switch>
            </Container>
          </Router>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
