// 获取国家的榜单和目录
exports.fetchList = async () => {
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        '优化小程序 `API`',
        '使用 async/await',
        '接入 `Redux` 管理页面数据流',
        '样式书写采用 `less` 预编译',
        '`wxs` 管理工具库',
        '按需加载，子页面分包（除却 `tab` 页面的其他页面）',
        '资源自动化管理'
      ]);
    }, 1000);
  })
  return res;
};
