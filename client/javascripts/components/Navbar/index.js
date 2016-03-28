// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React from 'react';
import NavAuth from '../../container/NavAuth';

function Navbar(props) {
  return (
    <nav className="cruddy-auth-blog-nav navbar navbar-fixed-top">
      <div className="navbar-header">
        <span className="navbar-brand">cruddy<b>AuthBlog</b></span>
      </div>
      <NavAuth/>
    </nav>
  );
}

export default Navbar;
