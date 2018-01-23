import { effects } from '../utils/lib/redux-saga';
import * as IndexService from '../services/index';

const { call, put, take, takeLatest, takeEvery, all } = effects;

// 首页数据处理
export function* pagesIndex() {
  yield takeEvery('pages/index', function* (action) { 
    const res = yield call(IndexService.fetchFavorites);
    yield put({
      type: 'pages/index/setFavorites',
      favorites: res
    });
    yield put({
      type: 'pages/index/setname',
      name: `微信小程序开发最佳实践--${action.name}      `
    })

    // yield [
    //   put({
    //     type: 'pages/index/setFavorites',
    //     favorites: res
    //   }),
    //   put({
    //     type: 'pages/index/setname',
    //     name: `微信小程序开发最佳实践--${action.name}      `
    //   })
    // ]
  });
};

// 根 sagas，一次性全部执行
export default function* rootSaga() {
  yield all([
    pagesIndex(),
    // ... 其他页面的 saga 在这里写
  ])
}
