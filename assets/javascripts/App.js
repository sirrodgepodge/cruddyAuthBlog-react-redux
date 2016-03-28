// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';
import ajax from './utils/ajax';

import Navbar from './Navbar';
import Blog from './Blog';

class App extends Component {
  constructor(){
    super();

    // only modify state without "setState" here when setting initial/default state
    this.state = {};

    this.addPost = postState => {
      const postBody = {
        title: postState.title,
        body: postState.body
      };

      // Adding authed properties if user is logged in
      if(this.state.user) postBody.email = this.state.user.email;
      if(this.state.user && this.state.user.google && this.state.user.google.photo) {
        postBody.photo = this.state.user.google.photo;
        postBody.google_link = this.state.user.google.link;
      }
      if(this.state.user && this.state.user.facebook && this.state.user.facebook.photo) {
        postBody.photo = this.state.user.facebook.photo;
        postBody.facebook_link = this.state.user.facebook.link;
      }

      ajax.post({
        route: '/api/post',
        body: postBody
      }).then(res => this.setState({
        posts: this.state.posts.unshift(res) && this.state.posts
      }));
    };


    this.updatePost = (postState, id) => {
      const index = postState.editIndex;
      ajax.put({
        route: `/api/post/${this.state.posts[index]._id}`,
        body: {
          title: postState.title,
          body: postState.body,
          createdDate: new Date()
        }
      }).then(res => {
        this.state.posts[index] = res;
        this.setState({
          posts: this.state.posts
        });
      });
    };

    this.deletePost = id =>
      ajax.del(`/api/post/${id}`)
        .then(res => this.setState({
          posts: this.state.posts.filter(val => val._id !== id)
        }));

    this.localAuth = (email, password) => {
      ajax.post({
        route: '/auth/login',
        body: {
          email: email || this.state.user.email, //the "or" handles if they're already authedand are adding a password to their account
          password: password
        }
      }).then(user => {
        this.setState({
          user
        });
      });
    };

    this.logout = () => {
      ajax.get('/auth/logout')
        .then(() =>
          this.setState({
            user: null
          }));
    };
  }

  componentDidMount() {
    // retrieve app initialization data once root component has mounted
    Promise.all([
      ajax.get('/auth/session'),
      ajax.get('/api/post')
    ])
    .then(([user, posts]) => {
      this.setState({
        user: user || null,
        posts: posts.sort((a,b) => Date.parse(b.createdDate) - Date.parse(a.createdDate))
      });
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Navbar user={this.state.user}
                localAuth={this.localAuth.bind(this)}
                logout={this.logout.bind(this)}/>
        <Blog posts={this.state.posts}
              userEmail={this.state.user && this.state.user.email}
              addPost={this.addPost.bind(this)}
              updatePost={this.updatePost.bind(this)}
              deletePost={this.deletePost.bind(this)}/>
      </div>
    );
  }
}

export default App;
