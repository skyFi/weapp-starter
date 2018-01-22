module.exports = (state = {}, action) => {
  return Object.assign({}, state, {
    [action._key]: action._value
  });
}
