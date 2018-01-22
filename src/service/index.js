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

// 根据目录id获取排名列表
exports.getRanks = async ({categoryId, page}) => {
  const res = await wx.request({
    url: '/ranks',
    data: {
      categoryId,
      page,
    }
  });
  if (res) {
    const obj = res.data;
    // 格式化数据
    const ranks = obj.data && obj.data.map(rank => ({
      id: rank.schoolId,
      logo: rank.logo || '',
      rank: rank.rankValue || 0,
      chineseName: rank.chineseName || '',
      englishName: rank.englishName || '',
      location: rank.cityPath || '',
      averageAdmissionRate: rank.TIE_ADMINSSION_RATE || '',
    })) || [];
    return {
      categoryId: categoryId,
      count: obj.pagination && obj.pagination.count || 0,
      page: obj.pagination && obj.pagination.page || 1,
      ranks
    };
  }
};

// 获取录取率测试人数
exports.getAdmssionRateCount = async () => {
  const res = wx.request({
    url: '/admission_rate/test_count',
  });
  return res && res.data || 0;
};
