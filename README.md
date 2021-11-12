# 小程序转盘抽奖组件

#### 介绍
小程序转盘抽奖组件

### 效果图  

![zhyd9xhruv.gif](https://www.clluo.com/resource/images/article/image1636687605050.png)  


### 使用方式  

**引入组件 .json**   
```js
{
  "usingComponents": {
    "turnplate-lottery": "/components/turnplate-lottery/index"
  }
}
```


**使用组件 .wxml**  
```js
<turnplate-lottery id="turnplate" list="{{prizeList}}"></turnplate-lottery>
<button catchtap="onStartLottery">开始抽奖</button>
```

**调用抽奖方法 .js**  
```js
// 开始抽奖
onStartLottery(e) {
    const winIdx = 3; // 中奖索引（由接口返回），由0开始算，这表示会停留在第四个上
    this.selectComponent('#turnplate').start(winIdx, (res) => {
        console.log('转盘停止后的回调')
    })
}
```

**重置方法 .js**  
```js
// 转盘角度会重置到0度
this.selectComponent('#turnplate').reset();
```

### 属性说明  

|属性名|类型|默认值|说明|
|--|--|--|--|
|width|Number|680|转盘宽度（直径），单位rpx|
|list|Array|[]|奖品数据列表 [{name: '奖品名', desc: '描述', img: '奖品图'}, ...]|
|fanColors|Array|['rgb(15, 95, 148)']|扇形颜色，会循环获取|
|fanImage|String|无|扇形图片，如果有值，那么`fanColors`就失效了|
|turns|Number|5|转盘圈数，需要大于1|
|time|Number|0|转盘总耗时，单位ms，默认会根据圈数计算，必须大于1000ms|

### 方法  

|方法名|说明|
|--|--|
|start|开始抽奖 `start(idx, callback)`|
|reset|重置转盘的调度 `reset()`|




