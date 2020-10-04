import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Avatar,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Navbar from "../utility/Navbar";
import { getUser, sendNotification, getNotifications } from "../auth/core";
import { Link, useLocation } from "react-router-dom";
import { MyContext } from "../context";
import Notiflix from "notiflix-react";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [outputUser, setOutputUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { user } = useContext(MyContext);
  const location = useLocation();

  useEffect(() => {
    disableAddFriend();
  }, [outputUser, location.pathname]);

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (searchInput.length > 1) {
      const result = await getUser(searchInput);
      if (result.Error) {
        setError(result.Error);
        setOutputUser(null);
      } else {
        setError(null);
        setOutputUser(result);
        disableAddFriend();
      }
    } else {
      setError("Should be at least 2 characters");
    }
    setLoading(false);
  };

  const addFriend = async (to, from) => {
    await sendNotification(to, {
      from,
      class: "friend-request",
    })
      .then((res) => {
        Notiflix.Notify.Success("Friend request has sent !");
        disableAddFriend();
      })
      .catch((err) => console.log(err));
  };

  const disableAddFriend = async () => {
    if (outputUser && user !== "none") {
      const hisNotifications = await getNotifications(outputUser.username);
      if (
        hisNotifications.find(
          (noti) =>
            noti.from === user.username && noti.class === "friend-request"
        ) ||
        user.friends.find((f) => f === outputUser.username)
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    } else {
      setDisabled(false);
    }
  };

  const friendBtnText = () => {
    if (user.friends.find((f) => f === outputUser.username)) {
      return "You're friends";
    } else {
      return "Sent";
    }
  };

  return (
    <>
      <Navbar />
      <div className="search-container">
        <form onSubmit={onSubmit} className="search-form">
          <div className="search-input-div">
            <TextField
              className="search-input"
              name="search"
              placeholder="Search.."
              error={error ? true : false}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ marginTop: "1rem" }}
              color="primary"
            >
              Search
            </Button>
          </div>
          <Typography
            style={{ textAlign: "center" }}
            variant="subtitle1"
            color="error"
          >
            {error ? error : ""}
          </Typography>
        </form>

        {loading ? (
          <CircularProgress />
        ) : (
            <div className="search-output-div">
              {outputUser && (
                <div className="post">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={outputUser.profile.avatar}
                      className="search-avatar"
                    >
                      {!outputUser.profile.avatar &&
                        outputUser.username.toUpperCase()[0]}
                    </Avatar>

                    <Typography color="primary" variant="h5">
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "#1771E6",
                        }}
                        to={!user ? "/login" : `/Profile/${outputUser.username}`}
                      >
                        {outputUser.username}
                      </Link>
                    </Typography>

                    {user.username !== outputUser.username && user && (
                      <div className="delete-addfriend-btn">
                        <Button
                          onClick={() =>
                            addFriend(outputUser.username, user.username)
                          }
                          variant="outlined"
                          color="primary"
                          disabled={disabled}
                        >
                          {disabled ? friendBtnText() : "Add Friend"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <Typography
                    className="post-content"
                    color="textPrimary"
                    variant="subtitle1"
                  >
                    {outputUser.profile.bio}
                  </Typography>
                </div>
              )}
            </div>
          )}
      </div>
    </>
  );
}

export default Search;
