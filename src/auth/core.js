import axios from "axios";

const url = "https://facematik.herokuapp.com";

export const signUp = async (body) => {
  let message = "";
  await axios
    .post(`${url}/users`, body)
    .then((res) => {
      message = res.data;
    })
    .catch((err) => {
      message = { Error: err.response.data };
    });
  return message;
};

export const logIn = async (body) => {
  let message = "";
  await axios
    .post(`${url}/login`, body)
    .then((res) => {
      message = res.data;
    })
    .catch((err) => {
      message = { Error: err.response.data };
    });
  return message;
};

export const getPosts = async () => {
  const result = await axios.get(`${url}/posts`);
  const posts = result.data;
  return posts;
};

export const deletePost = async (id) => {
  const result = await axios.delete(`${url}/posts/${id}`);
  const posts = result.data;
  return posts;
};

export const getCurrentUser = async (token) => {
  let user = null;
  await axios
    .get(`${url}/users/me`, {
      headers: { "my-token": token },
    })
    .then((res) => {
      user = res.data;
    })
    .catch((err) => console.log({ Error: err }));
  return user;
};

export const getUser = async (username) => {
  try {
    const result = await axios.get(`${url}/users/${username}`);
    return result.data;
  } catch (error) {
    return { Error: error.response.data };
  }
};

export const getUsers = async (username) => {
  const result = await axios.get(`${url}/users`);
  return result.data;
};

export const sendNotification = async (to, body) => {
  const result = await axios.post(`${url}/notifications/${to}`, body);
  return result;
};

export const getNotifications = async (username) => {
  const result = await axios.get(`${url}/notifications/${username}`);
  return result.data;
};

export const deleteNotification = async (id) => {
  const result = await axios.delete(`${url}/notifications/${id}`);
  return result;
};

export const acceptFriendReq = async (from, to) => {
  const result = await axios.post(`${url}/users/addfriend/${from}/${to}`);
  return result;
};

export const likePost = async (postId, username) => {
  const result = await axios.post(`${url}/posts/like/${postId}`, { username });
  return result;
};

export const unLikePost = async (postId, username) => {
  const result = await axios.post(`${url}/posts/unlike/${postId}`, {
    username,
  });
  return result;
};

export const getComments = async (postId) => {
  const res = await axios.get(`${url}/posts/comments/${postId}`);
  return res;
};

export const addComment = async (postId, body) => {
  const result = await axios.post(`${url}/posts/comments/${postId}`, body);
  return result;
};

export const removeComment = async (postId, commentId) => {
  const result = await axios.delete(
    `${url}/posts/deletecomment/${postId}/${commentId}`
  );
  return result;
};
