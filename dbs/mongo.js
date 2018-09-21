var mongo = require('mongoose');
var logger = require('log4js').getLogger('mongo');
const Schema = mongo.Schema;
mongo.Promise = Promise;
mongo.connect(require('../config').mongo.link, {
  useMongoClient: true
});
var db = mongo.connection;
db.on('error', function (error) {
  logger.error(error);
});
db.once('open', function () {
  logger.info('main mongodb is connected!');
});


module.exports = {
  /*   get message : {"orderId": 0, "symbol": "IWM", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 172.0, "status": "Submitted"}from192.168.31.44:52576
   get message : {"orderId": 0, "status": "Submitted提交", "filled已完成": 0.0, "remaining还剩多少": 172.0, "avgFillPrice": 0.0, "permId": 1943416204, "parentId": 0, "lastFillPrice": 0.0, "clientId": 0, "whyHeld": ""}from192.168.31.44:52576
   get message : {"orderId": 0, "symbol": "IWM", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 172.0, "status": "Filled"}from192.168.31.44:52576*/
  msgModel: mongo.model('message', mongo.Schema({
    _id:String,
    updatePortfolio:[{
      _id:false,
      symbol:String,
      secType:String,
      exchange:String,
      position:Number,
      marketPrice:Number,
      marketValue:Number,
      averageCost:Number,
      unrealizedPNL:Number,
      realizedPNL:Number,
      action:String,
      orderType:String,
      totalQuantity:Number,
      status:String
         }],
    updateAccountValue:{
      _id:false
   },
    StockMarketValue:Number,
    TotalCashBalance:Number
  })),
  aimsModel:mongo.model("aims",mongo.Schema({
    money:Number,
    position:{}
  })),
  lcgModel:mongo.model("lcg",mongo.Schema({
    date:Date,
    name:String,
    nameNum:Number,
    balance:Number,
    equity:Number
  })),
  etfModel:mongo.model("etf",mongo.Schema({
    date:Date,
    name:String,
    capitalization:Number
  }))
};
