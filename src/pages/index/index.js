/* global app */
import { connect } from '../../utils/wxRedux';

// Action Function
const setName = (text) => {
  return {
    type: 'pages/setname',
    _key: 'name',
    _value: text
  }
}

// Page config
const pageConfig = {
  data: {
    list: [],
  },
  async onLoad() {
    // 获取国家排名目录
    const list = await app.service.fetchList();
    if (list) {
      this.setData({ list });
    }
    if (this.setName instanceof Function) {
      setTimeout(() => {
        this.setName('微信小程序开发最佳实践');
      }, 500);
    }
  },
};

// connect page & redux
Page(connect(
  state => ({
    name: state.name || '这里有一个介绍'
  }),
  dispatch => ({
    setName: text => dispatch(setName(text)),
  })
)(pageConfig));
