// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React from 'react';

import AddPostForm from '../../container/PostForm';
import PostList from '../../container/PostList';

function Blog(props) {
  return (
    <div className="blog-list">
      <h1>Blog Away :)</h1>
      <AddPostForm/>
      <PostList/>
    </div>
  );
}

export default Blog;
