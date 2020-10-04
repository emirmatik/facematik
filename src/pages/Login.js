import React, { useState, useContext } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";
import { MyContext } from "../context";
import { logIn } from "../auth/core";
import Notiflix from "notiflix-react";

Notiflix.Notify.Init({
  position: "right-bottom",
  borderRadius: "15px",
  timeout: 3000,
});

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    loginErr: "",
    loginMessage: "",
  });
  const context = useContext(MyContext);
  const { setData } = context;
  const history = useHistory();

  const loginSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;
    const body = { email, password };
    const result = await logIn(body);
    if (result.Error) {
      return setValues({ ...values, loginErr: result.Error });
    } else {
      setValues({
        ...values,
        loginErr: "",
        loginMessage: "logged in successfuly",
      });
      localStorage.setItem("my-token", result.token);
      const token = localStorage.getItem("my-token");
      setData({ token, user: result.user });
      history.push("/");
      Notiflix.Notify.Success("Successfuly Logged In !");
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFormErrors = (err) => {
    return err ? true : false;
  };

  return (
    <div className="container">
      <Grid className="sign-login-div" item md={4} sm={7}>
        <Paper elevation={3}>
          <form className="signup-form" onSubmit={loginSubmit}>
            <Typography align="center" variant="h4">
              Login
            </Typography>
            <div className="signup-inputdiv">
              <TextField
                className="signup-input"
                fullWidth
                label="Email"
                name="email"
                onChange={onChange}
                error={handleFormErrors(values.loginErr)}
              />
              <TextField
                className="signup-input"
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={onChange}
                error={handleFormErrors(values.loginErr)}
              />

              <Button
                className="signup-btn"
                color="secondary"
                variant="contained"
                size="large"
                type="submit"
              >
                Login
              </Button>

              <Typography style={{ marginBottom: "1rem" }} variant="subtitle1">
                Don't have an account ?{" "}
                <Link className="register-path" to="/register">
                  Sign Up
                </Link>
              </Typography>

              {values.loginErr ? (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {values.loginErr}
                </Alert>
              ) : (
                ""
              )}
            </div>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}

export default Login;
