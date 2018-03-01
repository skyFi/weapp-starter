
const pageConfig = {
  data: {
    showTopTips: false,
    topTipMsg: '',
    form: {},
    blocks: [
      {'index': 0, 'value': ''}
    ]
  },
  onShow: function() {
    let fadeOutLeft = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });
    fadeOutLeft.translate3d('-100%', 0, 0).step();
    this.fadeOutLeft = fadeOutLeft;

    let fadeOutRight = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });
    fadeOutRight.translate3d('100%', 0, 0).step();
    this.fadeOutRight = fadeOutRight;
  },
  showMsg: function(msg) {
    let self = this;
    self.setData({
      'topTipMsg': msg,
      'showTopTips': true
    });
    setTimeout(() => {
      self.setData({
        'showTopTips': false,
        'topTipMsg': ''
      });
    }, 2000);
  },
  handPlus: function(e) {
    // 绑定增加编辑窗
    let _order = e.target.dataset.order;
    let _blocks = this.data.blocks;
    // 依次+1
    _blocks.map((n, i) => {
      if (n.index >= _order) {
        _blocks[i].index += 1;
      }
    });
    _blocks.push({'index': _order, 'value': ''});
    _blocks.sort((a, b) => { return a.index - b.index; });
    this.setData({
      'blocks': _blocks
    });
  },
  bingContentInput: function(e) {
    // 绑定输入事件
    let _index = e.target.dataset.index;
    let _blocks = this.data.blocks;

    _blocks[_index].value = e.detail.value;
    this.setData({
      'blocks': _blocks
    });
  },
  handTitleInput: function(e) {
    this.setData({
      'title': e.detail.value
    });
  },
  bingTypeSelect: function(e) {
    // 输入类型
    let type = e.target.dataset.type;
    let blocks = this.data.blocks;
    let index = e.target.dataset.index;
    
    if (type === 'image') {
      blocks[index].type = type;
      this._handImageUpload(index);
    } else {
      this._handTextInput(index);
    }
  },
  handBlockUp: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    // 依次+1
    if (index === 0) { return; }
  
    _blocks[index - 1].index += 1;
    _blocks[index].index -= 1;
    _blocks.sort((a, b) => { return a.index - b.index; });
    this.setData({
      'blocks': _blocks
    });
  },
  handBlockDown: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    if (index === _blocks.length - 1) { return; }
  
    _blocks[index + 1].index -= 1;
    _blocks[index].index += 1;
    _blocks.sort((a, b) => { return a.index - b.index; });
    this.setData({
      'blocks': _blocks
    });
  },
  handBlockClose: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    let self = this;
    if (index === 0 && _blocks.length === 1) { return; }
  
    wx.showModal({
      title: '确定要删除此段落吗？',
      success: function(res) {
        if (res.confirm) {
          _blocks.splice(index, 1);

          // 更新排序
          _blocks.map((n, i) => {
            n.index = i;
          });
          self.setData({
            'blocks': _blocks
          });
        }
      }
    });
  },
  _handTextInput: function(index) {
    let blocks = this.data.blocks;

    blocks[index].fadeOutLeft = this.fadeOutLeft;
    blocks[index].fadeOutRight = this.fadeOutRight;

    this.setData({'blocks': blocks});
    setTimeout(() => {
      blocks[index].type = 'text';
      this.setData({
        'blocks': blocks
      });
    }, 250);
  },
  _handImageUpload: function(index) {
    let blocks = this.data.blocks;
    let self = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;

        blocks[index].value = tempFilePaths;
        self.setData({
          'blocks': blocks
        });
      }
    });
  },
  // handTagTap: function(e){
  //   let _tags = this.data.tags;
  //   let _index = e.target.dataset.index;

  //   _tags[_index].actived = _tags[_index].actived?false:true;
  //   this.setData({
  //     'tags': _tags
  //   })
  // },
  formSubmit: function(e) {
    let contents = [];
    let form = this.data.form;

    if (this.data.blocks[0].value.length < 1) {
      this.showMsg('请写些内容吧');
      return;
    }

    // this.data.tags.map(function(n, i){
    //   if(n.actived){
    //     tags += n.id+'|';
    //   }
    // })
    // form.tags = tags.slice(0, tags.length-1);
    // 改造content的传递方式，从原来的构造一个dom结构，变成传递数据
    this.data.blocks.map((n, i) => {
      contents.push({ 'type': n.type, 'src': n.value});
    });
    form.content = JSON.stringify(contents);
  },
};

Page(connect(
  state => ({
    favorites: state.favorites
  })
)(pageConfig));
