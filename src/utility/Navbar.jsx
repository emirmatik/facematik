import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Typography, Button, Tooltip, Avatar, Badge } from "@material-ui/core";
import { Home, Notifications } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { MyContext } from "../context";
import Notiflix from "notiflix-react";
import Sidebar from "./Sidebar";
import { getNotifications } from "../auth/core";

function Navbar() {
  const { logout, token, user } = React.useContext(MyContext);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();
  const userLogout = () => {
    history.push("/");
    logout();
    Notiflix.Notify.Success("Logged Out !");
  };

  useEffect(() => {
    listNotifications();
  }, [user]);

  const listNotifications = async () => {
    const result = await getNotifications(user && user !== "none" && user.username);
    setNotifications(result);
  };

  return (
    <div className="navbar-div">
      <div className="navbar">
        <div id="logo">
          <Link style={{ color: "black", textDecoration: "none" }} to="/">
            <Typography variant="h5">Facematik</Typography>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/">
            <Tooltip title="Home">
              <Home className="nav-link icon" style={{ fontSize: "2rem" }} />
            </Tooltip>
          </Link>

          <Link to="/search">
            <Tooltip title="Search">
              <SearchIcon className="nav-link icon" />
            </Tooltip>
          </Link>

          {user && user !== "none" ? (
            <>
              <Link to="/notifications" className="nav-link notification-icon">
                <Tooltip title="Notifications">
                  {notifications.length > 0 ? (
                    <Badge color="secondary" variant="dot">
                      {" "}
                      <Notifications className="icon" />
                    </Badge>
                  ) : (
                      <Notifications className="icon" />
                    )}
                </Tooltip>
              </Link>

              <Link
                className="nav-link user-profile-avatar"
                to={`/Profile/${user.username}`}
              >
                <Avatar
                  style={{ marginRight: ".5rem" }}
                  src={!user.profile ? "" : user.profile.avatar}
                >
                  {user.username && user.username.toUpperCase()[0]}
                </Avatar>

                <Typography className="nav-avatar-username" variant="subtitle1">
                  {user.username}
                </Typography>
              </Link>

              <Sidebar logout={userLogout} />
            </>
          ) : (
              <>
                <Link className="nav-link" to="/login">
                  <Button color="secondary" variant="contained">
                    Login
                </Button>
                </Link>{" "}
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
