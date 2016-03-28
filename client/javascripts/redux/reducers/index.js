import * as actionTypes from '../actionTypes';

const initialState = {
  user: null,
  posts: [],
  postForm: {
    title: '',
    body: '',
    updating: false,
    editIndex: null,
    editId: null
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_APP :
      return Object.assign({},state,{
        user: action.user,
        posts: action.posts
      });

    case actionTypes.LOCAL_AUTH :
      return Object.assign({},state,{
        user: action.user
      });

    case actionTypes.LOG_OUT :
      return Object.assign({},state,{
        user: null
      });

    case actionTypes.EDIT_POST :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        postForm: Object.assign({}, state.postForm, action.post)
      });

    case actionTypes.ADD_POST :
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        posts: [
          action.post,
          ...state.posts
        ],
        postForm: Object.assign({}, initialState.postForm) // clear form
      });

    case actionTypes.UPDATE_POST :
      const newStatePosts = state.posts.slice(); // creating new array (removes pointer to old one)
      newStatePosts[action.index] = action.post;
      // state is immutable, each change replaces an old object with a new one
      return Object.assign({},state,{
        posts: newStatePosts,
        postForm: Object.assign({}, initialState.postForm) // clear form
      });

    case actionTypes.DELETE_POST :
      return Object.assign({},state,{
        posts: state.posts.filter(post => post._id !== action._id),
      });

    default:
      return state;
  }
};

export default rootReducer;
