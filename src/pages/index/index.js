/* global app */

Page({
  data: {
    list: [],
  },
  async onLoad() {
    // 获取国家排名目录
    const list = await app.service.fetchList();
    if (list) {
      this.setData({ list });
    }
  },
});
