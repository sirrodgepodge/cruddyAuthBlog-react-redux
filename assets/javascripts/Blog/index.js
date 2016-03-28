// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';

import AddPostForm from './AddPostForm';
import BlogPost from './BlogPost';

class Blog extends Component {

  constructor() {
    super();

    this.cleanState = () => ({
      addOrUpdate: 'add',
      title: '',
      body: '',
      editIndex: null
    });

    this.state = this.cleanState();
  }

  updateState(prop, event) {
    this.setState({
      [prop]: event.target.value
    });
  }

  editPost(post, index) {
    this.setState({
      addOrUpdate: 'update',
      title: post.title,
      body: post.body,
      editIndex: index
    });
  }

  deletePost(id) {
    this.props.deletePost(id);
  }

  addPost() {
    this.props.addPost(this.state);
    this.setState(this.cleanState());
  }

  updatePost() {
    this.props.updatePost(this.state);
    this.setState(this.cleanState());
  }

  render() {
    return (
      <ul className="blog-list">
        <h1>Blog Away :)</h1>
        <AddPostForm title={this.state.title}
                     titleChange={this.updateState.bind(this,'title')}
                     body={this.state.body}
                     bodyChange={this.updateState.bind(this,'body')}
                     buttonStr={`${this.state.addOrUpdate === 'update' ? 'Update' : 'Add'} Post`}
                     buttonClickFunc={this.state.addOrUpdate === 'update' &&
                                      this.updatePost.bind(this) ||
                                      this.addPost.bind(this)}/>
        {
          this.props.posts.map((post, index) =>
            <BlogPost post={post}
                      index={index}
                      key={post._id}
                      delete={this.deletePost.bind(this)}
                      edit={this.editPost.bind(this)}
                      userEmail={this.props.userEmail}/>)
        }
      </ul>
    );
  }
}

Blog.defaultProps = {
  posts: []
};

export default Blog;
