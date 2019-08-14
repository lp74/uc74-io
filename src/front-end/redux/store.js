import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { save, load } from 'redux-localstorage-simple';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';

import signInReducer from './sign-in';

const middleware = [
  thunk,
  save({ states: ['user'], debounce: 500 }) //localStorage
];

const store = createStore(
  combineReducers({ user: signInReducer }),
  load({ states: ['user'] }),
  composeWithDevTools(
    applyMiddleware(
      ...middleware
    )
  )
);

export default store ;
