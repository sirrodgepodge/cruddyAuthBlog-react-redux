import * as actionTypes from '../actionTypes';
import ajax from '../../utils/ajax';


export function initializeUserAndPosts({user: user, posts: posts}) {
  return {
    type: actionTypes.INITIALIZE_APP,
    user,
    posts
  };
}


export function initializationRequests() {
  return dispatch =>
    // retrieve app initialization data once root component has mounted
    Promise.all([
      ajax.get('/auth/session'),
      ajax.get('/api/post')
    ])
    .then(([user, posts]) =>
      dispatch(initializeUserAndPosts({
        user: user || null,
        posts: posts.sort((a,b) => Date.parse(b.createdDate) - Date.parse(a.createdDate)) // sort by date, descending
      })));
}


export function localAuth(user) {
  return {
    type: actionTypes.LOCAL_AUTH,
    user
  };
}


export function localAuthRequest(email, password) {
  return dispatch => ajax.post({
    route: '/auth/login',
    body: {
      email: email,
      password: password
    }
  }).then(user =>
    dispatch(localAuth(user)));
}


export function logout() {
  return {
    type: actionTypes.LOG_OUT
  };
}


export function logoutRequest() {
  return dispatch => ajax.get('/auth/logout')
    .then(() =>
      dispatch(logout()));
}

export function editPost(post) {
  return {
    type: actionTypes.EDIT_POST,
    post
  };
}

export function addPost(post) {
  return {
    type: actionTypes.ADD_POST,
    post
  };
}

export function addPostRequest(postBody) {
  return dispatch => ajax.post({
    route: '/api/post',
    body: postBody
  }).then(res => dispatch(addPost(res)));
}


export function updatePost({index: index, post: post}) {
  return {
    type: actionTypes.UPDATE_POST,
    index,
    post
  };
}

export function updatePostRequest(postForm) {
  const index = postForm.editIndex;
  return dispatch => ajax.put({
      route: `/api/post/${postForm.editId}`,
      body: {
        title: postForm.title,
        body: postForm.body,
        createdDate: new Date()
      }
    }).then(res =>
      dispatch(updatePost({
        index: index,
        post: res
      })));
}

export function deletePost(_id) {
  return {
    type: actionTypes.DELETE_POST,
    _id
  };
}

export function deletePostRequest(_id) {
  return dispatch => ajax.del(`/api/post/${_id}`)
    .then(res => dispatch(deletePost(_id)));
}
