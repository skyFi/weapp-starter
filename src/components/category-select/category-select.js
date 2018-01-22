/* global app */

Component({
  properties: {
    data: {
      type: 'Array',
      value: [],
      observer: function(newValue = {}, oldValue = {}) {
        const newCountry = newValue.country;
        const oldCountry = oldValue.country || {};
        if (newCountry.id !== oldCountry.id) {
          this.setData({
            name: newCountry.name || '无国家',
            rankings: (newCountry.rankings || []).map(ranking => ({
              name: ranking.name,
              value: ranking.id,
              checked: false,
            })),
          });
        }
      }
    }
  },
  methods: {
    onChange: function(e) {
      const value = e.detail.value;
      const rankings = this.data.rankings;
      rankings.forEach((ranking, i) => {
        if (`${ranking.value}` === value) {
          rankings[i].checked = true;
        } else {
          rankings[i].checked = false;
        }
      });
      this.setData({
        rankings,
      });
      // 分发榜单改变事件
      app.EventListener.emit('changeCategory', value);
    }
  }
});