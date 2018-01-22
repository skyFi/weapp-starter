/* global app */

Component({
  properties: {
    data: {
      type: 'Array',
      value: [],
      // 处理数据
      observer: function(newValue = {}) {
        this.setData({
          countries: (newValue || []).map(country => ({
            value: country.id,
            name: country.name,
            checked: false,
          }))
        });
      }
    }
  },
  methods: {
    // 改变国家事件
    onChange: function(e) {
      const value = e.detail.value;
      const countries = this.data.countries;
      countries.forEach((country, i) => {
        if (`${country.value}` === value) {
          countries[i].checked = true;
        } else {
          countries[i].checked = false;
        }
      });
      this.setData({
        countries,
      });
      // 触发改变国家的事件
      app.EventListener.emit('changeCountry', value);
    }
  },
});
