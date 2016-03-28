// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../redux/actionCreators';

class PostForm extends Component {

  constructor() {
    super();
  }

  editPost(prop, event) {
    this.props.dispatch(
      actionCreators.editPost({
        [prop]: event.target.value
      })
    );
  }

  addPost() {
    this.props.dispatch(actionCreators.addPostRequest(Object.assign({},this.props.postForm,this.props.userInfo)));
  }

  updatePost() {
    this.props.dispatch(actionCreators.updatePostRequest(this.props.postForm));
  }

  render() {
    return (
      <li className="blog-add-post">
        <input className="blog-add-post-title" type="text" placeholder="Title" onChange={this.editPost.bind(this,'title')} value={this.props.postForm.title}/>
        <textarea className="blog-add-post-body" placeholder="Body" onChange={this.editPost.bind(this,'body')} value={this.props.postForm.body}/>
        <button onClick={this.props.postForm.updating &&
                         this.updatePost.bind(this) ||
                         this.addPost.bind(this)}>
          {`${this.props.postForm.updating ? 'Update' : 'Add'} Post`}
        </button>
      </li>
    );
  }
}

function mapStateToProps(store) {
  return {
    postForm: store.postForm,
    userInfo: {
      email: store.user && store.user.email,
      photo: store.user && ((store.user.facebook && store.user.facebook.photo) || (store.user.google && store.user.google.photo)),
      facebook_link: store.user && store.user.facebook && store.user.facebook.facebook_link,
      google_link: store.user && store.user.google && store.user.google.google_link
    }
  };
}

PostForm.propTypes = {
  postForm: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    updating: PropTypes.bool,
    editIndex: PropTypes.number,
    editId: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(PostForm);
