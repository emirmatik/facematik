import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Navbar from "../utility/Navbar";
import { MyContext } from "../context";
import {
  getNotifications,
  deleteNotification,
  acceptFriendReq,
  sendNotification,
} from "../auth/core";
import { Link } from "react-router-dom";
import Notiflix from "notiflix-react";

function Notifications() {
  const { user } = React.useContext(MyContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listNotifications();
  }, [user]);

  const listNotifications = async () => {
    const result = await getNotifications(user && user !== "none" && user.username);
    setNotifications(result);
    setLoading(false);
  };

  const sendNoti = async (to, body) => {
    await sendNotification(to, body);
  };

  const deleteNoti = async (id) => {
    await deleteNotification(id)
      .then((res) => {
        listNotifications();
      })
      .catch((err) => console.log(err));
  };

  const acceptButton = async (from, to, notiId) => {
    await acceptFriendReq(from, to).then((res) => {
      deleteNoti(notiId);
      Notiflix.Notify.Success("You're friends now !");
      sendNoti(from, {
        from: to,
        class: "friend-request-accepted",
      });
    });
  };

  return (
    <>
      <Navbar />
      <div className="notifications-div">
        <Typography variant="h5" style={{ marginBottom: "10px" }}>
          Notifications
        </Typography>
        <hr />
        {loading ? (
          <CircularProgress className="loading-gif" />
        ) : notifications.length === 0 ? (
          <Typography
            style={{ textAlign: "center", padding: "2rem 1rem" }}
            variant="h6"
          >
            You have no notifications yet.
          </Typography>
        ) : (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <div className="notification">
                    <CloseIcon
                      onClick={() => {
                        deleteNoti(notification._id);
                        Notiflix.Notify.Success("Deleted !");
                      }}
                      className="notification-delete-btn"
                    />{" "}
                    {notification.class === "friend-request" ? (
                      <div>
                        <Typography variant="subtitle1">
                          <Link id="noti-user" to={`/Profile/${notification.from}`}>
                            {notification.from}
                          </Link>{" "}
                      has sent you a friend request.
                    </Typography>
                        <Button
                          className="notification-btn"
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            acceptButton(
                              notification.from,
                              notification.to,
                              notification._id
                            )
                          }
                        >
                          Accept
                    </Button>
                        <Button
                          className="notification-btn"
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            deleteNoti(notification._id);
                            Notiflix.Notify.Success("Declined !");
                          }}
                        >
                          Decline
                    </Button>

                        <small className="notification-date">
                          <i>{new Date(notification.date).toLocaleDateString()}</i>
                        </small>
                      </div>
                    ) : (
                        <>
                          <Typography variant="subtitle1">
                            <Link id="noti-user" to={`/Profile/${notification.from}`}>
                              {notification.from}
                            </Link>{" "}
                      has accepted your friend request.
                    </Typography>
                          <small className="notification-date">
                            <i>{new Date(notification.date).toLocaleDateString()}</i>
                          </small>
                        </>
                      )}
                  </div>
                  <hr />
                </React.Fragment>
              ))
            )}
      </div>
    </>
  );
}
export default Notifications;
