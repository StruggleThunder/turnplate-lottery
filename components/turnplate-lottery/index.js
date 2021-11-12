Component({

  properties: {
    // 转盘宽度(直径)，单位rpx
    width: {
      type: Number,
      value: 680
    },

    // 奖品数据列表
    list: {
      type: Array,
      value: []
    },

    // 扇形颜色，会循环获取
    fanColors: {
      type: Array,
      value: ['rgb(15, 95, 148)']
    },

    // 扇形图片，如果有值，那么扇形颜色就失效了
    fanImage: {
      type: String,
      value: ''
    },

    // 转盘圈数 默认5，需要大于1
    turns: {
      type: Number,
      value: 5
    },

    // 转盘总耗时（默认会根据圈数计算）单位ms，必须大于1000ms
    time: {
      type: Number,
      value: 0
    }

  },

  data: {
    initList: [], // 初始列表数据
    prizeList: [], // 奖品列表
    ani: '',
  },

  observers: {
    list(datas) {
      const len = datas.length;
      if (!len) return;
      this.handleList(datas);
      this.initData();
    }
  },

  methods: {
    // 补全list的长度到4
    handleList(datas) {
      const len = datas.length;
      let initList = [];
      if (len < 4) {
        for (let i = 0;i < 4; i++) {
          if (datas[i]) {
            initList.push(datas[i])
          } else {
            initList.push({
              name: '',
              desc: '',
              img: ''
            })
          }
        }
      } else {
        initList = datas;
      }

      this.setData({
        initList
      })
    },

    // 初始化数据
    async initData() {
      const {
        width,
        initList,
        fanColors,
        fanImage,
        turns,
        time
      } = this.data;

      const prizeTotal = initList.length; // 奖品个数
      const angle = (360 / prizeTotal) / 2; // 对角角度
      const ratio = Number(Math.sin(angle * (Math.PI * 2 / 360)).toFixed(2)); // 与半径的比率

      // 每块奖品区域的角度，宽高信息（单位rpx)
      const perPrize = {
        degree: 360 / prizeTotal,
        width: Math.floor((width * ratio)),
        height: width * 0.5
      }

      // 奖品数据列表
      const prizeList = [];
      initList.map((item, index) => {
        let imgWidth = perPrize.width * .25;

        let fanBg = '';
        if (fanColors.length && !fanImage) {
          let colorLen = fanColors.length;
          fanBg = `background: ${fanColors[index % colorLen]}`;
        }

        prizeList.push({
          ...item,
          fanStyle: `transform: rotate(${(360 / prizeTotal) * index - (360 / prizeTotal / 2)}deg) skewY(-${(90 - (360 / prizeTotal))}deg); ${fanBg}`,
          prizeStyle: `width: ${perPrize.width}rpx; transform: translateX(-50%) rotate(${perPrize.degree * index}deg);`,
          imgStyle: `width: ${imgWidth}rpx; height: ${imgWidth}rpx;`
        })
      })

      this.setData({
        prizeList
      })

      let totalTime = (turns || 1) * 1000;
      if (turns > 3) totalTime = totalTime * .8;
      if (time && time > 1000) totalTime = time;
      totalTime = totalTime < 1000 ? 1000 : totalTime;

      this.totalTime = totalTime;
      this.animation = wx.createAnimation({
        duration: totalTime,
        timingFunction: 'ease',
        delay: 0
      });

    },

    // 开始 idx：最终停留的索引
    start(idx, callback) {
      let {
        initList,
        turns
      } = this.data;

      if (idx < 0 || idx > initList.length - 1) {
        console.warn('中奖索引报错');
        callback && callback('');
        return;
      }
      
      if (this.flag === false) return;
      this.flag = false;

      let lastRotate = Math.ceil((this.rotate || 0) / 360) * 360;
      let rotate = Number(turns || 1) * 360;
      rotate = rotate - ((360 / initList.length) * idx);
      rotate = rotate + lastRotate;

      this.rotate = rotate;

      this.animation.rotate(rotate).step();
      this.setData({
        ani: this.animation.export()
      })

      setTimeout(() => {
        wx.nextTick(() => {
          this.flag = true;
          callback && callback(idx);
        })
      }, this.totalTime);

    },

    // 重置
    reset() {
      this.flag = true;
      this.rotate = 0;
      this.animation.rotate(0).step({
        duration: 0,
        timingFunction: 'step-end'
      })
      this.setData({
        ani: this.animation.export()
      })
    }

  }
})