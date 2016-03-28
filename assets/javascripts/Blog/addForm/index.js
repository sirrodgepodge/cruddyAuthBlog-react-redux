// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';

// Converts javascript date object to 2-digit slashes date format
import prettyDate from '../utils/prettyDate';

class addForm extends Component {

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
      <li className="blog-add-post">
        <input className="blog-add-post-title" type="text" placeholder="Title" onChange={this.updateState.bind(this,'title')} value={this.state.title}/>
        <textarea className="blog-add-post-body" placeholder="Body" onChange={this.updateState.bind(this,'body')} value={this.state.body}/>
        <button onClick={this.state.addOrUpdate === 'update' &&
                         this.updatePost.bind(this) ||
                         this.addPost.bind(this)}>
          {`${this.state.addOrUpdate === 'update' ? 'Update' : 'Add'} Post`}
        </button>
      </li>
    );
  }
}

export default addForm;
