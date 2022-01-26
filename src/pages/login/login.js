import React, { Component } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@mui/material/Box";
// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions/userActions";
import "./login.css";
import { validateLoginData } from "../../util/validators";

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    const { errors, valid } = validateLoginData(userData);
    console.log(errors);
    if (valid) {
      this.props.loginUser(userData, this.props.history);
    } else {
      this.setState({ error: errors });
    }
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    console.log("email", this.state.email);
    const {
      classes,
      UI: { loading, errors },
    } = this.props;
    console.log("errors+++++", errors);
    const { error } = this.state;

    return (
      <React.Fragment>
        <Grid container>
          <Grid item md={2} />
          <Grid item xs={12} md={8}>
            <div className="login_header">
              <div className="login_header__left">
                <img
                  className="login_header__logo"
                  src="https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/bgc-logo.svg?alt=media&token=0f61a406-04b2-42a7-98ee-43f4d2183524"
                />
              </div>
              <div className="login_header__right">
                <p>Alumnae Portal</p>
                <p>Log In</p>
              </div>
            </div>
          </Grid>
          <Grid item md={2} />
          <Grid item md={2} />
          <Grid item xs={12} md={8}>
            <div className="login_block">
              <p>Welcome back!</p>
              <form noValidate onSubmit={this.handleSubmit}>
                <div className="login_field">
                  <Box>
                    <TextField
                      label="Email Address"
                      id="email"
                      name="email"
                      className="login_block_text"
                      helperText={error.email}
                      error={error.email ? true : false}
                      value={this.state.email}
                      onChange={this.handleChange}
                      fullWidth
                    />
                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      label="Password"
                      className="login_block_text"
                      helperText={error.password}
                      error={error.password ? true : false}
                      value={this.state.password}
                      onChange={this.handleChange}
                      fullWidth
                    />
                  </Box>
                </div>
                {errors && (
                  <Typography className="alert_content">{errors}</Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="login_button"
                  disabled={loading}
                >
                  Login
                  {loading && <CircularProgress size={8} />}
                </Button>
                <br />
                <p className="forgotPassword__link">
                  <Link to="/recover">Forgot Password</Link>
                </p>

                <p className="signup_link">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
              </form>
            </div>
          </Grid>
          <Grid item md={2} />
        </Grid>
      </React.Fragment>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapActionsToProps)(login);
