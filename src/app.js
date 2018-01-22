import service from './service/index';
import EventListener from './utils/EventListener';

App({
  async onLaunch() {
    const loginResult = await wx.login();
    const res = await wx.request({
      url: '/schools'
    });
    console.log(res);
  },
  // 服务
  service,
  // 事件广播
  EventListener
});
