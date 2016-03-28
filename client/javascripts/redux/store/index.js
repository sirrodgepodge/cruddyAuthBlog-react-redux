import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { DevTools } from '../DevTools';

export function configureStore(initialState) {
  let finalCreateStore;

  if (process.env.NODE_ENV === 'production') {
    finalCreateStore = applyMiddleware(thunk)(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(thunk),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  }

  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
