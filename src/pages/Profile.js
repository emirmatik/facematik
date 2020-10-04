import React, { useState, useEffect } from "react";
import {
  Button,
  Avatar,
  CircularProgress,
  Typography,
  Divider,
  TextField,
} from "@material-ui/core";
import { MyContext } from "../context";
import Navbar from "../utility/Navbar";
import axios from "axios";
import {
  getPosts,
  getUser,
  likePost,
  unLikePost,
  getUsers,
} from "../auth/core";
import Notiflix from "notiflix-react";
import LockIcon from "@material-ui/icons/Lock";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { useLocation } from "react-router-dom";
import Comments from "../utility/Comments";
import PostDropdown from "../utility/PostDropdown";

const alignStyle = {
  display: "flex",
  alignItems: "center",
};

function Profile(props) {
  const [users, setUsers] = useState([]);
  const { user } = React.useContext(MyContext);
  const [userProfile, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const username = props.match.params.username;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postUsername, setPostUsername] = useState(null);
  const url = "https://facematik.herokuapp.com";
  const location = useLocation();
  useEffect(() => {
    listMyPosts();
    listUsers();
  }, [userProfile]);

  useEffect(() => {
    window.scrollTo(0, 0);
    findUser();
  }, [location.pathname, user]);

  useEffect(() => {
    if (openComments) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "scroll";
    }
  }, [openComments]);

  const listMyPosts = async () => {
    await getPosts().then((posts) => {
      const myPosts = posts.filter((p) => p.username === userProfile.username);
      setPosts(myPosts);
    });
  };

  const listUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const findUser = async () => {
    const userProfile = await getUser(username);
    setUser(userProfile);
    if (user) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };


  const handleDelete = async (id) => {
    await axios
      .delete(`${url}/posts/${id}`)
      .then((res) => {
        listMyPosts();
        Notiflix.Notify.Success("Deleted !");
      })
      .catch((err) => console.log({ Error: err }));
  };

  const onEditSubmit = async (e) => {
    e.preventDefault();
    const avatar = e.target.elements.avatar.value;
    const bio = e.target.elements.bio.value;
    const body = { bio: bio, avatar: avatar };
    await axios
      .put(`${url}/users/${user.username}`, body)
      .then((res) => {
        setEdit(false);
        findUser();
        Notiflix.Notify.Success("Profile Edited !");
      })
      .catch((err) => console.log({ Error: err }));
  };

  const like = async (id, username) => {
    await likePost(id, username)
      .then((res) => {
        listMyPosts();
      })
      .catch((err) => console.log(err));
  };

  const unlike = async (id, username) => {
    await unLikePost(id, username)
      .then((res) => {
        listMyPosts();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <CircularProgress className="loading-gif" />
      ) : (
          <div className="news-container">
            {!edit ? (
              <>
                <div className="user-info">
                  <div className="avatar-friend-section">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={userProfile.profile.avatar}
                        className="profile-avatar"
                      >
                        <Typography variant="h4">
                          {userProfile.username.toUpperCase()[0]}
                        </Typography>
                      </Avatar>
                      <Typography variant="h6">{userProfile.username}</Typography>
                    </div>

                    <div className="post-friend-count-div">
                      <Typography variant="h5">Posts: {posts.length}</Typography>

                      <Typography variant="h5">
                        Friends: {userProfile.friends.length}
                      </Typography>
                    </div>
                  </div>

                  <div className="bio-edit-section">
                    <div className="bio">
                      <Typography variant="h6" className="bio-label">
                        Bio
                    </Typography>
                      <hr className="bio-hr" />
                      <Typography variant="subtitle1" className="bio-text">
                        {userProfile.profile.bio}
                      </Typography>
                    </div>
                    {user.username === userProfile.username && (
                      <Button
                        onClick={() => setEdit(true)}
                        variant="outlined"
                        color="primary"
                        className="edit-btn"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                <Divider className="divider" variant="middle" />

                <div className="user-posts">
                  {user.username === userProfile.username ? (
                    <Typography variant="h4">Your Posts</Typography>
                  ) : (
                      <Typography variant="h4">{`${userProfile.username}'s Posts`}</Typography>
                    )}

                  {user === "none" ? (
                    <Typography
                      style={{ margin: "5rem 0", textAlign: "center" }}
                      variant="h6"
                    >
                      Please login first
                    </Typography>
                  ) : !user.friends.find(
                    (friend) => friend === userProfile.username
                  ) && user.username !== userProfile.username ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "5rem",
                          }}
                        >
                          <LockIcon style={{ fontSize: "5rem" }} />
                          <Typography variant="h5">
                            It's private, You are not friends !
                    </Typography>
                        </div>
                      ) : posts.length === 0 ? (
                        <Typography
                          style={{ margin: "5rem 0", textAlign: "center" }}
                          variant="h6"
                        >
                          No post shared
                        </Typography>
                      ) : (
                          posts.map((post, i) => {
                            return (
                              <div key={i} className="post mypost">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <Avatar
                                    src={userProfile.profile.avatar}
                                    style={{ marginRight: "1rem" }}
                                  >
                                    {userProfile.username.toUpperCase()[0]}
                                  </Avatar>

                                  <div>
                                    <Typography color="primary" variant="h5">
                                      {post.username}
                                    </Typography>
                                    <Typography color="textSecondary" variant="body2">
                                      {new Date(post.createdAt).toLocaleString()}
                                    </Typography>
                                  </div>
                                  {userProfile.username === user.username && (
                                    <PostDropdown
                                      post={post}
                                      handleDelete={handleDelete}
                                    />
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
                                  {/* likes comments */}
                                  <div
                                    style={{ display: "flex", alignItems: "center" }}
                                  >
                                    {post.likes &&
                                      post.likes.includes(user.username) ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlike(post._id, user.username)}
                                        >
                                          <FavoriteIcon
                                            style={{
                                              marginRight: ".2rem",
                                            }}
                                            color="secondary"
                                          />
                                          <Typography variant="body2" color="secondary">
                                            {post.likes.length < 2
                                              ? post.likes
                                              : post.likes.length}
                                          </Typography>
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => like(post._id, user.username)}
                                        >
                                          <FavoriteBorderIcon
                                            style={{
                                              marginRight: ".2rem",
                                            }}
                                            color="action"
                                          />
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
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
              </>
            ) : (
                <form onSubmit={onEditSubmit} className="edit-form">
                  <CloseIcon
                    onClick={() => setEdit(false)}
                    className="notification-delete-btn close-edit"
                  />

                  <label htmlFor="avatar">Image</label>
                  <TextField
                    variant="outlined"
                    name="avatar"
                    defaultValue={userProfile.profile.avatar}
                  />
                  <br />
                  <label htmlFor="bio">Bio</label>
                  <TextField
                    variant="outlined"
                    name="bio"
                    defaultValue={userProfile.profile.bio}
                  />
                  <Button
                    className="edit-btn"
                    variant="outlined"
                    color="primary"
                    type="submit"
                  >
                    Save
              </Button>
                </form>
              )}
          </div>
        )}
      {openComments && (
        <Comments
          selectedPost={selectedPost}
          setOpen={setOpenComments}
          users={users}
          postUsername={postUsername}
          like={like}
          unlike={unlike}
          listPosts={listMyPosts}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

export default Profile;
