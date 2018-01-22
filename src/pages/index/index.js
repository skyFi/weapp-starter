/* global app */

Page({
  data: {
    _id: 0,
    counties: [],
    currentCountry: {},
    cards: [],
    scrollTop: 0,
  },
  async onLoad() {
    // 获取国家排名目录
    const counties = await app.service.getCountryCategories();
    // 初始化卡片
    this._addToCards({
      type: 'country-select',
      data: {},
    });
    this.setData({
      counties,
    });
    // 绑定分发函数
    this._bindEventListener();
  },
  // 添加新卡片
  _addToCards(card) {
    if (!card) { return; }
    if (!card.data) { card.data = {}; }
    card.data.cardId = card.id = this.data._id++;
    const cards = this.data.cards || (this.data.cards = []);
    cards.push(card);
    this.setData({ cards });

    // 计算滚动位置
    const query = wx.createSelectorQuery();
    query.selectAll('.card-item').boundingClientRect();
    query.exec((res) => {
      let totalHeight = 0;
      res[0].forEach((dom, index) => {
        if (index < res[0].length - 1) {
          totalHeight += dom.height;
        }
      });
      this.setData({
        scrollTop: totalHeight,
      });
    });
  },
  // 绑定EventListener 监听各个组件行为
  _bindEventListener() {
    // 国家改变事件
    app.EventListener.on('changeCountry', (countryId) => {
      // 数组映射成map
      const countriesMap = {};
      this.data.counties.forEach(country => {
        countriesMap[country.id] = country;
      });
      const currentCountry = countriesMap[countryId] || {};
      // 添加新卡片并设置当前国家
      this._addToCards({
        type: 'category-select',
        data: {
          country: currentCountry,
        }
      });
      // 设置最新当前国家
      this.setData({
        currentCountry,
      });
    });
    // 榜单改变事件
    app.EventListener.on('changeCategory', async (categoryId) => {
      const data = await app.service.getRanks({ categoryId });
      this._addToCards({
        type: 'rank-list',
        data: {
          categoryId: data.categoryId,
          page: data.page || 1,
          count: data.count || 0,
          ranks: data.ranks || [],
          last: Math.ceil(this.count / 20) === this.page,
        },
      });
    });
    // 加载更多排名事件
    app.EventListener.on('showMoreRanks', async ({ cardId }) => {
      // 找到目标卡片
      const cards = this.data.cards.filter(card => card.type === 'rank-list' && card.id === cardId);
      // 更新卡片
      if (cards.length && cards.length > 0) {
        const card = cards[0] || {};
        const { categoryId, page, count } = card.data;
        if (Math.ceil(count / 20) === page) {
          return;
        }
        const data = await app.service.getRanks({ categoryId, page: page + 1 });
        card.data.ranks.push(...data.ranks);
        card.data.page = page + 1;
        card.data.last = Math.ceil(count / 20) === (page + 1);
        this.setData({
          cards: this.data.cards,
        });
      }
    });
    // 切换国家 添加国家卡片
    app.EventListener.on('addCardCountry', () => {
      this._addToCards({
        type: 'country-select',
        data: {},
      });
    });
    // 切换排名 添加榜单卡片
    app.EventListener.on('addCardCategory', () => {
      this._addToCards({
        type: 'category-select',
        data: {
          country: this.data.currentCountry,
        }
      });
    });
  }
});
