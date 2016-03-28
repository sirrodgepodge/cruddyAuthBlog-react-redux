// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../redux/actionCreators';

class NavAuth extends Component {

  constructor(){
    super();
  }

  handleLocalAuth() {
    const email = this.refs.email && this.refs.email.value;
    const password = this.refs.password && this.refs.password.value;
    this.props.dispatch(
      actionCreators.localAuthRequest(email, password)
    );
  }

  logout() {
    this.props.dispatch(
      actionCreators.logoutRequest()
    );
  }

  render() {
    const user = this.props.user;

    return (
      <ul className="nav navbar-nav navbar-right">
        <li className={`nav user-photo ${user && user.google && user.google.photo && 'show'}`}
            style={user && user.google && user.google.photo && {backgroundImage: `url(${user.google.photo})`}}/>
        <li className={`nav user-photo ${user && user.facebook && user.facebook.photo && 'show'}`}
            style={user && user.facebook && user.facebook.photo && {backgroundImage: `url(${user.facebook.photo})`}}></li>
        <li className="nav-button">
          {
            (!user || !user.email || !user.hasPassword || !user.google || !user.google.photo || !user.facebook || !user.facebook.photo)
            &&
            <span>
              LOG IN &#10161;
              {
                (!user || !user.google)
                &&
                <a href="/auth/google"><i className="fa fa-google o-auth-btn"></i></a>
              }
              {
                (!user || !user.facebook)
                &&
                <a href="/auth/facebook"><i className="fa fa-facebook o-auth-btn"></i></a>
              }
              {
                (!user || !user.email)
                &&
                <input className="nav-input" ref="email" placeholder="email" type="text"/>
              }
              {/*Repeating logic the the two below because of some CSS annoying-ness*/}
              {
                (!user || !user.hasPassword)
                &&
                <input className="nav-input" ref="password" placeholder="password" type="password"/>
              }
              {
                (!user || !user.hasPassword)
                &&
                <button className="local-auth-button" onClick={this.handleLocalAuth.bind(this)}>Post LocalAuth</button>
              }
            </span>
          }
          {
            user
            &&
            <a className="nav-button log-out-button show" href="#" onClick={this.logout.bind(this)}>
              LOG OUT
            </a>
          }
        </li>
      </ul>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

NavAuth.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    hasPassword: PropTypes.bool.isRequired,
    google: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    }),
    facebook: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    })
  }),
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(NavAuth);
