import { createStore, applyMiddleware } from './utils/lib/redux';
import createSagaMiddleware from './utils/lib/redux-saga';
import reducer from './reducer';
import rootSaga from './sagas/index';

const initState = {};
const sagaMiddleware = createSagaMiddleware({
  emitter: emit => action => {
    if (Array.isArray(action)) {
      action.forEach(emit);
      return;
    }
    emit(action);
  }
});
const store = createStore(
  reducer, initState, applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

App(Provider(store)({
  async onLaunch() {
    await wx.login();
    // const res = await wx.request({
    //   url: '/schools'
    // });
  },
}));
