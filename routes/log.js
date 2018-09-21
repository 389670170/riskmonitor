/**
 * 日志(系统日志、门禁日志)
 */
const router = require('express').Router();
const {logAside} = require('../util/aside_data');
const mongo = require('../dbs/mongodb');
const logger = require('log4js').getLogger('log');
const door = require('../util/door'); // 门禁系统
const dateformat = require('../util/dateformat');

router.get('/', async (req, res) => {

  let date = new Date();
  let params = Object.assign({
    start: dateformat(date, 'yyyy-MM-dd'),
    end: dateformat(date, 'yyyy-MM-dd'),
    page: 1
  }, req.query); // 查询参数

  let doordata = await door('/Api/recordlog', params);
  doordata = JSON.parse(doordata);
  let d;
  if(doordata.status === 1) { // 获取数据成功
    d = doordata.data.attendata;
  } else {
    logger.warn(`status = ${doordata.status} ; error: ${doordata.error}` );
  }
  res.render('index', {
    title: '门禁日志', // 页面标题
    username: req.session.username,
    tagIndex: 2, // 上方选项卡序号
    curAside: 'door', // 当前侧边栏菜单(id)
    module: 'doorLog', // 当前渲染的模块(monitor.html)
    pages: {
      curr: doordata.data.page || 0,
      pages: doordata.data.totalpage || 0, // 一共有多少页
      pageurl: function(currpage) {
        return `/riskmonitor/log?start=${params.start}&end=${params.end}&page=${currpage}`;
      }
    },
    data: {
      aside: logAside,
      params: params,
      data: d || []
    },
    atten_time: (time) => {
      return dateformat(new Date(time * 1000), 'yyyy-MM-dd HH:mm:ss');
    }
  });
});

router.all('/app', async (req, res) => {
  logger.debug('search system log!');
  let param, where = {}, params = req.body;
  if((param = params['starttime'])) { // 开始时间
    Object.assign(where, {timestamp: {"$gte": new Date(param)}});
  }
  if((param = params['endtime'])) { // 结束时间
    Object.assign(where, {timestamp: {"$lte": new Date(param)}});
  }
  if((param = params['level'])) { // 级别
    Object.assign(where, {level: param})
  }
  logger.info('req params: ' + JSON.stringify(where));
  let logs = await mongo.find('logs', where).sort({'timestamp':-1}).limit(20).toArray();
  res.render('index', {
    title: '系统日志', // 页面标题
    username: req.session.username,
    tagIndex: 2, // 上方选项卡序号
    curAside: 'app', // 当前侧边栏菜单(id)
    module: 'appLog', // 当前渲染的模块(monitor.html)
    extraClass: 'content-panel-half',
    data: {
      aside: logAside,
      params: params,
      data: logs
    },
    level: function(i) {
      return 'log-level--' + i.level;
    },
    dateformat: function(i) {
      return dateformat(i.timestamp, 'MM-dd HH:mm');
    },
    jsonHtml: function(i) {
      return '{<br><span class="json-key">"timesteamp"</span>: <sapn class="json-value">"' +
        i.timestamp.toISOString() + '"</sapn> ,<br><span class="json-key">"level"</span>: ' +
        '<sapn class="json-value">"' + i.level + '"</sapn>,<br>' +
        '<span class="json-key">"message"</span>: <span class="json-value">"' + i.message + '"</span><br>}';
    }
  });
});

module.exports = router;