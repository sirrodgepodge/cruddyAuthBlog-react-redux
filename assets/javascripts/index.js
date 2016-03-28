import React from 'react';

// React's library for handling direct DOM interaction (vs. Virual DOM interaction)
import { render } from 'react-dom';

// React's front end routing handler
import { Router, Route, browserHistory } from 'react-router';

import App from './App';

// we only have one route, if we had more then we would add them with the same syntax, params are defined as they are in Express, like: "/:param"
render((
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
), document.getElementById('root'));
