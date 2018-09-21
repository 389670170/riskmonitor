/**
 * 登录验证拦截器
 * Created by haoran.shu on 2017/12/6.
 */
module.exports = (req, res, next) => {
  let url = req.url;
  // 不拦截登录请求
  if(url === '/riskmonitor/' || url === '/riskmonitor/login' ||
    url === '/riskmonitor/regist' || url === '/riskmonitor/update_password') {
    next();
  } else {
    if(req.session.username) { // 已经登录
      next();
    } else {
      res.redirect('/riskmonitor')
    }
  }
};
