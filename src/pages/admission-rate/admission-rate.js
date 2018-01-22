/* global app */

Page({
  data: {
    // 申请项目
    project: {
      currentIndex: 0,
      names: ['请选择', '本科', '研究生'],
      values: ['', 'MDT_BACHELOR', 'MDT_MASTER']
    },
    // grade: {
    //   currentIndex: 0,
    //   names: ['请选择', '']
    // }
    // 就读年级
    // grades: {
    //   name: ['高一', '高二', '高三', '大一']
    // }
  },
  onLoad: async function(options) {
    const { id = 4, schoolName = '哈佛大学' } = options;
    const count = await app.service.getAdmssionRateCount();

    this.setData({
      id,
      schoolName,
      testCount: count,
    });
  },
  onProjectPickerChange: function(e) {
    const project = this.data.project;
    project.currentIndex = e.detail.value;
    this.setData({
      project,
    });
  },
});