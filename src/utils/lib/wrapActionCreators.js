function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator(...arguments));
  };
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(`bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  let keys = Object.keys(actionCreators);
  let boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch);
}

module.exports = wrapActionCreators;
