Page({

  data: {
    prizeList: [], // 奖品列表
    isCanClick: true, // 是否可以点击

    /* 自定义转盘属性用到的 START */
    array: [4, 5, 6, 7, 8, 9, 10],
    index: 2,
    turnsArray: [1, 2, 3, 4, 5, 6, 7, 8],
    turnsIdx: 5,
    timeArray: [0, 3000, 4000, 5000, 6000, 7000, 8000],
    timeIdx: 0,

    fanColors: ['rgb(15, 95, 148)', 'rgb(40, 152, 195)'],
    fanImage: '',

    /* 自定义转盘属性用到的 END */
  },

  onLoad: function (options) {
    this.initData();
  },

  // 初始化（奖品列表）
  initData() {
    const {
      array,
      index
    } = this.data;

    // 置空一下
    this.setData({
      prizeList: []
    })

    // 奖品列表
    const prizeList = [];
    for (let i = 0; i < array[index]; i++) {
      prizeList.push({
        name: '这是奖品名称：' + i,
        desc: '这是奖品描述或副标题',
        img: '/images/nm.png',
      })
    }

    this.setData({
      prizeList
    })
  },

  // 奖品个数改变事件
  bindPickerChange(e) {
    const val = e.detail.value;
    this.setData({
      index: Number(val)
    })

    this.initData();
    this.selectComponent('#turnplate').reset();
  },

  // 转盘券数改变事件
  bindTurnsChange(e) {
    const val = e.detail.value;
    this.setData({
      turnsIdx: Number(val)
    })

    this.initData();
    this.selectComponent('#turnplate').reset();
  },

  // 转圈时间改变事件
  bindTimeChange(e) {
    const val = e.detail.value;
    this.setData({
      timeIdx: Number(val)
    })

    this.initData();
    this.selectComponent('#turnplate').reset();
  },

  // 随机生成颜色
  getRandomCollor() {
    function rgb() {
      const r = Math.round(Math.random() * 255);
      const g = Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);
      return `rgb(${r}, ${g}, ${b})`;
    }

    const list = this.data.prizeList;
    const fanColors = [];
    if (list.length % 2 === 0) {
      fanColors.push(rgb(), rgb());
    } else {
      fanColors.push(rgb());
    }

    this.setData({
      fanImage: '',
      fanColors
    })

    this.initData();
    this.selectComponent('#turnplate').reset();
  },

  // 扇形背景图
  getFanImage() {
    const list = [
      '',
      '/images/img01.jpg',
      '/images/img02.jpg',
      '/images/img03.jpg',
      '/images/img04.jpg',
      '/images/img05.jpg'
    ];

    const idx = Math.floor(Math.random() * list.length);

    if (this.data.fanImage === list[idx]) {
      this.getFanImage()
      return;
    }

    this.setData({
      fanImage: list[idx]
    })

    this.initData();
    this.selectComponent('#turnplate').reset();
  },

  // 开始抽奖
  onStartLottery() {
    const {
      prizeList: list,
      isCanClick
    } = this.data;

    if (!isCanClick) return;
    this.setData({
      isCanClick: false
    })

    // 随机中奖索引
    const winIdx = Math.floor(Math.random() * list.length);

    wx.showToast({
      title: `中奖索引是：${winIdx}`,
      icon: 'none'
    })

    // 执行转盘抽奖事件
    const turnplate = this.selectComponent('#turnplate');
    if (!turnplate) return;
    turnplate.start(winIdx, (res) => {
      // 转盘停止后的回调
      this.setData({
        isCanClick: true
      })

      wx.showToast({
        title: `转盘已停下，当前停留的索引是：${res}`,
        icon: 'none',
        duration: 3000
      })
    });
  }

})