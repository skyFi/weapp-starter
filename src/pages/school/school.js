Page({
  onLoad: function(options) {
    const id = options && options.id || 0;
    this.setData({
      id,
    });
  }
});