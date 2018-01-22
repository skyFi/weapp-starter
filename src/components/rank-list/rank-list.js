/* global app */

Component({
  properties: {
    data: {
      type: 'Array',
      value: [],
      observer: function(newValue = {}, oldValue) {
        this.setData({
          cardId: newValue.cardId,
          count: newValue.count || 0,
          ranks: newValue.ranks || [],
          last: !!newValue.last,
        });
      }
    }
  },
  methods: {
    // 加载更多排名
    onShowMore: function() {
      if (!this.data.last) {
        // 订阅
        app.EventListener.emit('showMoreRanks', {
          cardId: this.data.cardId,
          categoryId: this.data.categoryId,
          page: this.data.page,
        });
      }
    },
    onAddCardCountry: function() {
      app.EventListener.emit('addCardCountry');
    },
    onAddCardCategory: function() {
      app.EventListener.emit('addCardCategory');
    }
  }
});