const util = require('../util/util.js')
import myPlugin from '../plugin/index.js';
Page({
  data: {
    docWidth: 375,
    options:{
      account:"test001",
      app_key:"d30c7775e8112d3a45a5ebe26ae972bf",
      roomid:"740082998",
      sign:"fd40f0994b98d7dabf2e6b65670a37eb",
      signedat:"1533022794000",
      username:"lisi"
    }
  },
  mathWidth() {
    /* 计算容器的宽度 */
    wx.createSelectorQuery().select('#docId').boundingClientRect((rect) => {
      // console.log(rect.width);
      // this.setData({
      //   docWidth: rect.width
      // });
    }).exec();
  },
  onReady() {
    // myPlugin.setOptions(this.data.options);
    this.mathWidth();
  },

})
