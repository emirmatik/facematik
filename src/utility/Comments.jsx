import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { getUser, getComments, addComment, removeComment } from "../auth/core";
import Notiflix from "notiflix-react";
import { MyContext } from "../context";
import CloseIcon from "@material-ui/icons/Close";
import PostDropdown from "./PostDropdown";

function Comments({
  selectedPost,
  open,
  setOpen,
  users,
  like,
  unlike,
  postUsername,
  handleDelete,
}) {
  const { user } = useContext(MyContext);
  const [postUser, setPostUser] = useState(null);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    fetchUser();
    listComments();
  }, []);

  const fetchUser = async () => {
    const user = await getUser(postUsername);
    setPostUser(user);
  };

  async function listComments() {
    await getComments(selectedPost._id).then((res) => setComments(res.data));
  }

  async function formSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const username = user.username;
    const comment = e.target.elements.comment.value;
    const body = { username, comment };
    await addComment(selectedPost._id, body)
      .then((res) => {
        listComments();
        form.reset();
      })
      .catch((err) => console.log(err));
  }

  const handleDeleteComment = async (commentId) => {
    await removeComment(selectedPost._id, commentId)
      .then((res) => {
        listComments();
        Notiflix.Notify.Success("Deleted !");
      })
      .catch((err) => console.log({ Error: err }));
  };

  const removePost = async () => {
    handleDelete(selectedPost._id);
    setOpen(false);
  };

  return (
    <>
      <div className="blur-background"></div>
      <div className="comments-container">
        {!selectedPost || !user || !postUser || !comments ? (
          <CircularProgress className="loading-gif" />
        ) : (
            <>
              <div className="post comment-post">
                <CloseIcon
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="close-comments"
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={postUser.profile.avatar}
                    className="post-avatar"
                    style={{ marginRight: "1rem" }}
                  >
                    {!postUser.profile.avatar &&
                      postUser.username.toUpperCase()[0]}
                  </Avatar>

                  <div>
                    <Typography
                      color="primary"
                      className="post-username"
                      variant="h5"
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "#1771E6",
                        }}
                        to={`/Profile/${selectedPost.username}`}
                      >
                        {selectedPost.username}
                      </Link>
                    </Typography>

                    <Typography color="textSecondary" variant="caption">
                      {new Date(selectedPost.createdAt).toLocaleString()}
                    </Typography>
                  </div>
                  {selectedPost.username === user.username && (
                    <PostDropdown post={selectedPost} handleDelete={removePost} />
                  )}
                </div>
                <Typography
                  className="post-content"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  {selectedPost.content}
                </Typography>
                <div style={{ display: "flex" }}>
                  {/*  LIKE,COMMENT BUTTONS    */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {selectedPost.likes &&
                      selectedPost.likes.includes(user.username) ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => unlike(selectedPost._id, user.username)}
                        >
                          <FavoriteIcon
                            style={{ marginRight: ".2rem" }}
                            color="secondary"
                          />
                          <Typography variant="body2" color="secondary">
                            {selectedPost.likes.length < 2
                              ? selectedPost.likes
                              : selectedPost.likes.length}
                          </Typography>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => like(selectedPost._id, user.username)}
                        >
                          <FavoriteBorderIcon
                            style={{ marginRight: ".2rem" }}
                            color="action"
                          />
                          <Typography variant="body2" color="textSecondary">
                            {selectedPost.likes.length < 2
                              ? selectedPost.likes
                              : selectedPost.likes.length}
                          </Typography>
                        </div>
                      )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        margin: "0 2rem",
                      }}
                    >
                      <ChatBubbleOutlineIcon
                        style={{ marginRight: ".2rem" }}
                        color="primary"
                      />
                      <Typography
                        color="primary"
                        variant="body2"
                      >{`Comments(${selectedPost.comments.length})`}</Typography>
                    </div>
                  </div>
                </div>
                <Divider style={{ marginTop: "1rem" }} />
              </div>
              <form onSubmit={formSubmit} className="comment-form">
                <TextField
                  id="comment-form-input"
                  name="comment"
                  fullWidth
                  variant="outlined"
                  placeholder="Type something.."
                />
                <Button
                  id="comment-form-input"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Send
              </Button>
              </form>

              <div className="comments">
                {!comments || comments.length === 0 ? (
                  <Typography variant="body1" className="no-comments-text">
                    No comments yet.
                  </Typography>
                ) : (
                    comments.map((comment) => {
                      const commentUser = users.find(
                        (u) => u.username === comment.username
                      );

                      return (
                        <React.Fragment key={comment._id}>
                          {!commentUser ? (
                            <CircularProgress className="loading-gif" />
                          ) : (
                              <div className="comment-div">
                                <div style={{ display: "flex" }}>
                                  <Avatar
                                    src={commentUser.profile.avatar}
                                    style={{ marginRight: "1rem" }}
                                  >
                                    {!commentUser.profile.avatar &&
                                      comment.username.toUpperCase()[0]}
                                  </Avatar>

                                  <div className="comment">
                                    <div className="comment-username-delete">
                                      <Typography
                                        color="primary"
                                        className="comment-username"
                                        variant="h6"
                                      >
                                        <Link
                                          style={{
                                            textDecoration: "none",
                                            color: "#1771E6",
                                          }}
                                          to={`/Profile/${comment.username}`}
                                        >
                                          {comment.username}
                                        </Link>
                                      </Typography>
                                      {(user.username === comment.username ||
                                        user.username === postUser.username) && (
                                          <PostDropdown
                                            post={comment}
                                            handleDelete={handleDeleteComment}
                                          />
                                        )}
                                    </div>

                                    <Typography
                                      color="textSecondary"
                                      variant="caption"
                                    >
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                    <div className="comment-content">
                                      <Typography
                                        color="textPrimary"
                                        variant="subtitle1"
                                        className="comment-content-text"
                                      >
                                        {comment.comment}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </React.Fragment>
                      );
                    })
                  )}
              </div>
            </>
          )}
      </div>
    </>
  );
}

export default Comments;
