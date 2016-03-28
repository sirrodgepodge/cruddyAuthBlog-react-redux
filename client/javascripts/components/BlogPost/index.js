// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';

// Converts javascript date object to 2-digit slashes date format
import prettyDate from '../../utils/prettyDate';

function BlogPost(props) {
  return (
    <li className="blog-post">
      <h3 className="blog-title">{props.post.title}</h3>
      <p className="blog-body">{props.post.body}</p>
      <p className="blog-created-date">{prettyDate(props.post.createdDate)}</p>
      {props.post.photo && <img className="author-photo" src={props.post.photo}/>}
      {props.post.email && <span className="author-email">{props.post.email}</span>}
      {props.post.google_link &&
        <a href={props.post.google_link} className="author-google">
          <i className="fa fa-google o-auth-btn"/>
        </a>}
      {props.post.facebook_link &&
          <a href={props.post.facebook_link} className="author-facebook">
            <i className="fa fa-facebook o-auth-btn"/>
          </a>}
      {
        // Conditional logic to hide update button if another user logged in and made that post (anonymous posts can be editted by anyone)
        (!props.post.email || props.post.email === props.userEmail)
        &&
        <div>
          <button className="delete-post" onClick={() => props.delete(props.post._id)}>Delete Post</button>
          <button className="update-post" onClick={() => props.edit(props.post, props.index)}>Update Post</button>
        </div>
      }
    </li>
  );
}

export default BlogPost;
