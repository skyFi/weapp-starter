import action from './actions/index';
import { createStore } from './utils/lib/redux';
import { Provider } from './utils/wxRedux';
import reducer from './reducer';

const initState = {}; // 初始化的 states
const store = createStore(reducer, initState);

App(Provider(store)({
  async onLaunch() {
    const loginResult = await wx.login();
    const res = await wx.request({
      url: '/schools'
    });
  },
  // 挂载所有的 Actions
  Action: action,
}));
