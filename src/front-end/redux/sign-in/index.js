const types = {
  'SIGN_IN': '/app/sign-in',
  'SIGN_IN_SUCCESS': '/app/sign-in-success',
  'SIGN_IN_ERROR': '/app/sign-in-error',
  'SIGN_OUT': 'app/sign-out'
};

// actions

const signIn = (credentials) => {
  return { type: types.SIGN_IN, payload: credentials };
};

const signOut = (credentials) => {
  return { type: types.SIGN_OUT, payload: credentials };
};

// operations
const doSignIn  = (credentials) => (dispatch) => {
  dispatch(signIn(credentials));

  return fetch('v1/sign', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(response => {
    })
    .catch(err => {
    });
} ;

const operations = {
  doSignIn
};

const reducer = (state = { username: '', password: '' }, action) => {
  switch (action.type) {
  case types.SIGN_IN:
    return Object.assign({}, action.payload, { ongoing: true }, { error: null });
  default:
    return state;
  }
};

export { operations };
export default reducer;
