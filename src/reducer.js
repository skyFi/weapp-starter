module.exports = (state = {}, action) => {
  switch (action.type) {
    case 'pages/index/setname':
      return Object.assign({}, state, {
        name: action.name
      });
    case 'pages/index/setFavorites':
      return Object.assign({}, state, {
        favorites: action.favorites
      });
    default:
      return Object.assign({}, state);
  }
};
