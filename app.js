const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const log4js = require('log4js');
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'dateFile', filename: '/tmp/riskMonitor.log', keepFileExt: true },
    'just-file': {type: 'logLevelFilter', appender: 'file', level: 'info'}
  },
  categories: { default: { appenders: ['console', 'just-file'], level: 'debug' } }
});

const laytpl = require('laytpl');
laytpl.config({
  min: true,
  cache: true
}); // 启用压缩

// const config = require("./config");
const app = express();

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('.html', laytpl.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.raw({limit: '16mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "^startRiskMonitorPro&and1511248426933end$",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// 日志
const logger = log4js.getLogger('app');
app.use(log4js.connectLogger(logger, { level: 'info',
  format: ':method :url :status :response-timems',
  nolog: '\\.ico$' }));


// 路由
app.use('/riskmonitor', require('./routes/index'));
app.use('/riskmonitor/monitor', require('./routes/monitor'));
app.use('/riskmonitor/account', require('./routes/account'));
app.use('/riskmonitor/log', require('./routes/log'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  err.status = err.status || 500;

  logger.error(err);

  // render the error page
  res.status(err.status || 500);

  res.render('error', err);
});

process.on('unhandledRejection', (reason, p) => {
  logger.warn("Unhandled Rejection at Promise; reason: ", reason);
});


module.exports = app;