import React, { useContext, useState } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { signUp } from "../auth/core";
import { MyContext } from "../context";
import Notiflix from "notiflix-react";

function Signup() {
  const context = useContext(MyContext);
  const history = useHistory();

  const { setData } = context;

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    signErr: "",
    loggedIn: false,
  });

  const signUpSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = values;
    const body = { username, email, password };
    const result = await signUp(body);
    if (result.Error) {
      return setValues({ ...values, signErr: result.Error });
    } else {
      setValues({
        ...values,
        signErr: "user created successfuly",
        loggedIn: true,
      });
      history.push("/");
      localStorage.setItem("my-token", result.token);
      const token = localStorage.getItem("my-token");
      setData({ token, user: result.user });
      Notiflix.Notify.Success("User Created Successfuly !");
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
      <Grid justify="center" alignItems="center" container>
        {/* Signup part */}
        <Grid className="sign-login-div" item md={4} sm={7}>
          <Paper elevation={3}>
            <form className="signup-form" onSubmit={signUpSubmit}>
              <Typography align="center" variant="h4">
                Sign Up
              </Typography>
              <div className="signup-inputdiv">
                <TextField
                  className="signup-input"
                  fullWidth
                  name="username"
                  label="Username"
                  onChange={onChange}
                  error={handleFormErrors(values.signErr)}
                />
                <TextField
                  className="signup-input"
                  fullWidth
                  name="email"
                  label="Email"
                  onChange={onChange}
                  error={handleFormErrors(values.signErr)}
                />
                <TextField
                  className="signup-input"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  onChange={onChange}
                  error={handleFormErrors(values.signErr)}
                />
                <Button
                  className="signup-btn"
                  color="primary"
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  Sign Up
                </Button>

                {values.signErr ? (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {values.signErr}
                  </Alert>
                ) : (
                  ""
                )}
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Signup;
