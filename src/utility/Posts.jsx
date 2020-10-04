import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Tooltip,
  Divider,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { MyContext } from "../context";
import {
  getPosts,
  getUsers,
  likePost,
  unLikePost,
  deletePost,
} from "../auth/core";
import Notiflix from "notiflix-react";
import Comments from "./Comments";
import PostDropdown from "./PostDropdown";

Notiflix.Confirm.Init({
  titleColor: "#ff5353",
  okButtonBackground: "#ff6060",
  rtl: true,
});

const alignStyle = {
  display: "flex",
  alignItems: "center",
};

function Posts() {
  const context = useContext(MyContext);
  const { user, token } = context;
  const url = "https://facematik.herokuapp.com";
  const [postError, setPostError] = useState("");
  const [posts, setPosts] = useState(null);
  const [postUsername, setPostUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    listUsers();
  }, []);

  useEffect(() => {
    listPosts();
  }, [user]);

  useEffect(() => {
    if (user && posts) {
      setLoading(false);
    }
  }, [user, posts]);

  useEffect(() => {
    if (openComments) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "scroll";
    }
  }, [openComments]);

  const listPosts = async () => {
    const allPosts = await getPosts();
    if (user !== "none") {
      setPosts(
        allPosts.filter(
          (post) =>
            user.friends.includes(post.username) ||
            post.username === user.username
        )
      );
    } else {
      setPosts([]);
    }
  };

  const defineNewsMessage = () => {
    return user && user !== "none" ? "There is nothing to show yet ://" : "You need to login first.";
  };

  const listUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const content = e.target.elements.content.value;
    const body = {
      username: user ? user.username : "",
      content: content,
    };
    await axios
      .post(`${url}/posts`, body, {
        headers: token ? { "my-token": token } : null,
      })
      .then((res) => {
        form.reset();
        setPostError("");
        Notiflix.Notify.Success("Post shared !");
        listPosts();
      })
      .catch((err) => {
        setPostError(err.response.data);
      });
  };

  const handleDelete = async (id) => {
    await deletePost(id)
      .then((res) => {
        listPosts();
        Notiflix.Notify.Success("Deleted !");
      })
      .catch((err) => console.log({ Error: err }));
  };

  const like = async (id, username) => {
    await likePost(id, username)
      .then((res) => {
        setSelectedPost(res.data);
        listPosts();
      })
      .catch((err) => console.log(err));
  };

  const unlike = async (id, username) => {
    await unLikePost(id, username)
      .then((res) => {
        setSelectedPost(res.data);
        listPosts();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="news-container">
      <Typography
        id="mobile-logo"
        style={{ display: "none" }}
        variant="h5"
        color="textSecondary"
      >
        Facematik
      </Typography>
      <form onSubmit={onFormSubmit} className="post-form">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            className="post-form-avatar"
            src={user === "none" ? "" : user.profile.avatar}
          >
            {user.username && user.username.toUpperCase()[0]}
          </Avatar>
          <TextField
            variant="outlined"
            name="content"
            className="post-sender"
            multiline
            error={postError ? true : false}
            placeholder={`What is in your mind ${user ? user.username : ""} ?`}
            fullWidth
          />
        </div>
        <Tooltip title="Share">
          <Button type="submit" className="post-btn" variant="contained">
            Post
          </Button>
        </Tooltip>
        {postError ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {postError}
          </Alert>
        ) : (
            ""
          )}
      </form>
      <div className="posts-container">
        <div style={{ margin: "2rem 0" }}>
          <Typography style={{ margin: "1rem" }} variant="h3">
            News
          </Typography>
          <Divider variant="middle" />
        </div>

        {loading ? (
          <CircularProgress className="loading-gif" />
        ) : user === "none" || posts.length === 0 ? (
          <Typography variant="h5">{defineNewsMessage()}</Typography>
        ) : (
              posts.map((post, i) => {
                const postUser = users.find((u) => u.username === post.username);
                return (
                  <div key={i} className="post">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {postUser && (
                        <Avatar
                          src={postUser.profile.avatar}
                          className="post-avatar"
                          style={{ marginRight: "1rem" }}
                        >
                          {!postUser.profile.avatar &&
                            post.username.toUpperCase()[0]}
                        </Avatar>
                      )}
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
                            to={`/Profile/${post.username}`}
                          >
                            {post.username}
                          </Link>
                        </Typography>

                        <Typography color="textSecondary" variant="caption">
                          {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                      </div>

                      {post.username === user.username && (
                        <PostDropdown post={post} handleDelete={handleDelete} />
                      )}
                    </div>
                    <Typography
                      className="post-content"
                      color="textPrimary"
                      variant="subtitle1"
                    >
                      {post.content}
                    </Typography>
                    <div style={{ display: "flex" }}>
                      {/*  LIKE,COMMENT BUTTONS    */}
                      <div style={alignStyle}>
                        {post.likes && post.likes.includes(user.username) ? (
                          <div
                            style={{
                              ...alignStyle,
                              cursor: "pointer",
                            }}
                            onClick={() => unlike(post._id, user.username)}
                          >
                            <FavoriteIcon
                              style={{ marginRight: ".2rem" }}
                              color="secondary"
                            />
                            <Typography variant="body2" color="secondary">
                              {post.likes.length < 2
                                ? post.likes.includes(user.username)
                                  ? "You"
                                  : post.likes
                                : post.likes.length}
                            </Typography>
                          </div>
                        ) : (
                            <div
                              style={{
                                ...alignStyle,
                                cursor: "pointer",
                              }}
                              onClick={() => like(post._id, user.username)}
                            >
                              <FavoriteBorderIcon
                                style={{ marginRight: ".2rem" }}
                                color="action"
                              />
                              <Typography variant="body2" color="textSecondary">
                                {post.likes.length < 2
                                  ? post.likes
                                  : post.likes.length}
                              </Typography>
                            </div>
                          )}
                        <div
                          style={{
                            ...alignStyle,
                            cursor: "pointer",
                            margin: "0 2rem",
                          }}
                          onClick={() => {
                            setSelectedPost(post);
                            setOpenComments(true);
                            setPostUsername(post.username);
                          }}
                        >
                          <ChatBubbleOutlineIcon
                            style={{ marginRight: ".2rem" }}
                            color="primary"
                          />
                          <Typography
                            color="primary"
                            variant="body2"
                          >{`Comments(${post.comments.length})`}</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
      </div>
      {openComments && (
        <Comments
          selectedPost={selectedPost}
          open={openComments}
          setOpen={setOpenComments}
          users={users}
          postUsername={postUsername}
          like={like}
          unlike={unlike}
          listPosts={listPosts}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Posts;
