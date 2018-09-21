/**
 * 监控
 */
const router = require('express').Router();
const {monitor} = require('../config');

router.get('/', (req, res) => {
  let index = req.query.index || 0, mi = monitor[index];
  res.render('index', {
    title: '实时监控', // 页面标题
    username: req.session.username,
    tagIndex: 1, // 上方选项卡序号
    curAside: index, // 当前侧边栏菜单(id)
    module: 'monitor', // 当前渲染的模块(monitor.html)
    data: {
      aside: monitor,
      data: monitor[index]
    }
  });
});

module.exports = router;