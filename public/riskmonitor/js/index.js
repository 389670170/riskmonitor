/**
 * Created by haoran.shu on 2017/11/28.
 */
var moduleName = document.getElementById('hiddenModule').value;

if(moduleName === 'appLog') { // 系统日志
  // create the editor
  var editor = new JSONEditor(document.querySelector('#jsonDetail'),
    {
      mode: "code", // 处于代码模式
      onEditable: function (node) {
        return false; // 不可编辑
      }
    }
  ); // 显示详细信

  // 点击查看详情按钮
  lay('.btn-search-details').on('click', function() {
    editor.setText(this.parentNode.querySelector('.hide').innerHTML);
  });

  lay('.timepicker').each(function(){
    laydate.render({
      elem: this,
      theme: '#36c2fd',
      type: 'datetime',
      min: '2017-12-01 00:00:00',
      max: Date.now()
    });
  });
} else if(moduleName === 'doorLog') { // 门禁日志
  lay('.datepicker').each(function(){
    laydate.render({
      elem: this,
      theme: '#36c2fd',
      min: '2017-12-01',
      max: Date.now()
    });
  });
} else if(moduleName === 'history') { // 历史订单
  document.getElementById('nd').addEventListener('change', function(option) {
    location.href = this.getAttribute('data-baseurl') + '&nd=' + this.options[this.selectedIndex].value;
  });
} else if(moduleName === 'monitor') { // 监控
  var playerElem = document.getElementById('player');
  var monitorRadioElems = document.getElementsByName('monitor');
  var playerConfig = {
    id: "player", // 容器id
    source: monitorRadioElems[0].value, // 视频地址
    autoplay: true,    //自动播放：否
    width: "800px",       // 播放器宽度
    height: "100%",      // 播放器高度
    isLive: true, // 直播
    trackLog: false // 不打印日志
  };
  var player = new Aliplayer(playerConfig); // 初始化播放器

  // 监控摄像头切换事件
  Array.prototype.forEach.call(monitorRadioElems, function(item) {
    item.addEventListener('change', function() {
      player.dispose(); //销毁
      player = new Aliplayer(Object.assign(playerConfig, {source: this.value})); // 重新创建
    });
  });
}

