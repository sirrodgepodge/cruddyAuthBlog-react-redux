// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';

// Converts javascript date object to 2-digit slashes date format
import prettyDate from '../../utils/prettyDate';

class BlogPost extends Component {

  render() {
    return (
      <li className="blog-post">
        <h3 className="blog-title">{this.props.post.title}</h3>
        <p className="blog-body">{this.props.post.body}</p>
        <p className="blog-created-date">{prettyDate(this.props.post.createdDate)}</p>
        {this.props.post.photo && <img className="author-photo" src={this.props.post.photo}/>}
        {this.props.post.email && <span className="author-email">{this.props.post.email}</span>}
        {this.props.post.google_link &&
          <a href={this.props.post.google_link} className="author-google">
            <i className="fa fa-google o-auth-btn"/>
          </a>}
        {this.props.post.facebook_link &&
            <a href={this.props.post.facebook_link} className="author-facebook">
              <i className="fa fa-facebook o-auth-btn"/>
            </a>}
        {
          // Conditional logic to hide update button if another user logged in and made that post (anonymous posts can be editted by anyone)
          (!this.props.post.email || this.props.post.email === this.props.userEmail)
          &&
          <div>
            <button className="delete-post" onClick={() => this.props.delete(this.props.post._id)}>Delete Post</button>
            <button className="update-post" onClick={() => this.props.edit(this.props.post, this.props.index)}>Update Post</button>
          </div>
        }
      </li>
    );
  }
}

export default BlogPost;
