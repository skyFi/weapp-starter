
const pageConfig = {
  
};

Page(connect(
  state => ({
    favorites: state.favorites
  })
)(pageConfig));

