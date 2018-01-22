// 获取国家的榜单和目录
exports.getCountryCategories = async () => {
  const res = await wx.request({
    url: '/rank/categories/index',
  });
  let counties = [];
  if (res) {
    const integratedRankings = res.data.integratedRankings;
    if (integratedRankings.length && integratedRankings.length > 0) {
      // 处理数据
      counties = integratedRankings.slice(0, 5).map(item => ({
        id: item.groupId,
        name: item.groupName && item.groupName.replace('排名', '') || '',
        rankings: item.rankings && item.rankings.length > 0
          && item.rankings.map(ranking => ({
            id: ranking.id,
            name: `${ranking.year || ''}${ranking.type || ''}${ranking.title || ''}`
          })) || []
      }));
    }
  }
  return counties;
};
