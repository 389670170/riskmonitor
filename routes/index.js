const express = require('express');
const router = express.Router();
const mongo = require('../dbs/mongo');
const logger = require('log4js').getLogger('index');

const dgram = require('dgram');
const server = dgram.createSocket('udp4'); //创建udp服务器
const multicastAddr = 'riskmonitor.capitalai.cn';

//以下server.on 都是在监听不同信号
server.on('close',()=>{ // ()=> 是 ES6的箭头函数，写成 function()也是可以的
    console.log('socket已关闭');
});

server.on('error',(err)=>{
    console.log(err);
});

server.on('listening',()=>{
    console.log('socket正在监听中...');
    server.setMulticastTTL(128);

});

server.on('message',(msg,rinfo)=>{
    console.log(`receive message from ${rinfo.address}:${rinfo.port}`);
});

function sendMsg(){
    var message ="GOLD_1M,0,1,0,0,1306.24";
    server.send(message,0,message.length,41234,multicastAddr);
    //通过server.send发送组播
    //参数分别是，数据（buffer或者string），偏移量（即开始发送的位子），数据长度，接收的端口，组播组
}

server.bind(8060); //绑定端口，不绑定的话也可以send数据但是无法接受

//循环发送
setInterval(()=>{
    sendMsg();
    console.log("send message");
},1500);

//const server = dgram.createSocket('udp4');

/*let Dictionary = (function() {
    const items = {};
    class Dictionary {
        constructor() {
        }
        set(key, value) {//向字典中添加新的元素
            items[key] = value;
        }
        delete(key) {//删除字典中某个指定元素
            if(this.has(key)) {
                delete items[key];
                return true;
            }
            return false;
        }
        has(key) {//如果某个键值存在于这个字典中，则返回true，否则返回false
            return items.hasOwnProperty(key);
        }
        get(key) {//通过键值查找特定的数值并返回。
            return this.has(key) ? items[key] : undefined;
        };
        clear() {//将这个字典中的所有元素全部删除。
            items = {};
        }
        size() {//返回字典所包含元素的数量。
            return Object.keys(items).length;
        }
        keys() {//将字典所包含的所有键名以数组形式返回。
            return Object.keys(items);
        }
        values() {//将字典所包含的所有数值以数组形式返回。
            var values = [];
            for(var k in items) {
                if(this.has(k)) {
                    values.push(items[k]);
                }
            }
            return values;
        }
        each(fn) {//遍历每个元素并且执行方法
            for(var k in items) {
                if(this.has(k)) {
                    fn(k, items[k]);
                }
            }
        }
        getItems() {//返回字典
            return items;
        }
    }
    return Dictionary;
})();*/
/*
const saltRounds = 10;
const ib=require('ib')
var ibclient = new ib({
    clientId: 1,
    host: '192.168.31.66',
    port: 4002
}).on('error', function (err) {
    //console.error('error --- %s', err.message);
}).on('result', function (event, args) {
    console.log('%s --- %s', event, JSON.stringify(args));
}).on('disconnected', function ()
})

setInterval(function () {
    ibclient.connect()
},5000)
ibclient.once('nextValidId', function (orderId) {
})

ibclient.on('connected', function (){
    console.info('ibclient is listening');
})
ibclient.on('managedAccounts', function (accountsList){
    ibclient.reqAccountUpdates(true, accountsList)
    ibclient.reqAllOpenOrders()
})
//var dictionary = new Dictionary();
ibclient.on('updateAccountValue', async (key, value, currency, accountName)=>{
  //  dictionary.set('Gandalf', 'gandalf@email.com' );
    //console.log(dictionary)
    //{"t":"updateAccountValue","key":key,"val":val,"currency":currency,"accountName":accountName}
    function Map(){}
    Map.prototype.get = function(key){
        return this[key];
    };
    Map.prototype.set = function(key,val,q){
        this[key]=[val,q];
    };

    var m = new Map();
    m.set(key,value,currency);
    console.log("m:",m.get(key))
    console.log("m:",m)
    await mongo.msgModel.update({_id:accountName},{
        $push:{
        updateAccountValue: m
    }})
})
ibclient.on('updatePortfolio', async (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, accountName)=>{
    let user = await mongo.msgModel.find({_id: accountName})
    if (user.length == 0) {
        await mongo.msgModel.create({
            _id: accountName,
            updatePortfolio: [{
                symbol: contract.symbol,
                secType: contract.secType,
                exchange: contract.expiry,
                position: position,
                marketPrice: marketPrice,
                marketValue: marketValue,
                averageCost: averageCost,
                unrealizedPNL: unrealizedPNL,
                realizedPNL:realizedPNL
            }]
        })
    }
    else {
        let mesg = await mongo.msgModel.find({_id: accountName, "updatePortfolio.symbol": contract.symbol})
        if (mesg.length == 0) {
            //新增种类
            await mongo.msgModel.update({_id: accountName}, {
                $push: {
                    updatePortfolio: {

                        symbol: contract.symbol,
                        secType: contract.secType,
                        exchange: contract.expiry,
                        position: position,
                        marketPrice: marketPrice,
                        marketValue: marketValue,
                        averageCost: averageCost,
                        unrealizedPNL: unrealizedPNL,
                        realizedPNL: realizedPNL
                    }
                }
            })
        } else {
            //修改数组中的元素
            console.log("修改数组中的")
            await mongo.msgModel.update({_id: accountName, "updatePortfolio.symbol": contract.symbol}, {
                $set: {
                    "secType": contract.secType,
                    "exchange": contract.expiry,
                    "position": position,
                    "marketPrice": marketPrice,
                    "marketValue": marketValue,
                    "averageCost": averageCost,
                    "unrealizedPNL": unrealizedPNL,
                    "realizedPNL": realizedPNL
                }
            })
        }

    }
})
ibclient.on('updateAccountTime', function (timeStamp){
    //as ping
})
ibclient.on('accountDownloadEnd', function (accountName){
//第一轮拉取用户信息结束，以后都是更新
})
ibclient.on('openOrder', function (orderId, contract, order, orderState){
    /!* {"t":"openOrder","orderId":orderId, "symbol":contract.symbol, "secType":contract.secType,
     "exchange":contract.exchange,"action":order.action,"orderType":order.orderType,
     "totalQuantity":order.totalQuantity, "status":orderState.status,*!/
    console.log(`${orderId},${contract.symbol},${contract.secType},${contract.exchange},${order.action},${order.orderType},${order.totalQuantity},${orderState.status}`)
})
ibclient.on('orderStatus', function (id, status, filled, remaining, avgFillPrice, permId, parentId, lastFillPrice, clientId, whyHeld){
    /!*{"t":"orderStatus","orderId":id, "status":status, "filled":filled,
     "remaining":remaining, "avgFillPrice":avgFillPrice,
     "permId":permId, "parentId":parentId, "lastFillPrice":lastFillPrice,
     "clientId":clientId, "whyHeld":whyHeld,}*!/
    console.log(`${id},${status},${filled},${remaining},${avgFillPrice},${permId},${parentId},${lastFillPrice},${clientId},${whyHeld}`)
})
ibclient.on('openOrderEnd', function (){
    //拉取订单结束，以后都是更新
})

/!*var MongoClient = require('mongodb').MongoClient
var url = "mongodb://192.168.31.201:27017/etfdata"
MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    db.close();
});


server.on('listening', async ()=>{
  console.info('server is listening');
   let a = await mongo.etfModel.find({"name" : "DU228380"},{date:1,capitalization:1})
    console.log("aaaaaaaaaaaaa:",a)
    //lcg
    MongoClient.connect("mongodb://192.168.31.201:27017/test", async(err, db)=> {
    var oneSecond = 1000*60*60*12 * 1; // one second = 1000 x 1 ms
    setInterval(async()=> {
        var time = new Date()
        let market= await db.collection("accounts").find({},{name:1,nameNum:1,balance:1,equity:1}).toArray()
        console.log(market)
        for (var a=0;a<market.length;a++){
            await mongo.lcgModel.create({name:market[a].name,nameNum:market[a].nameNum,date:time,balance:market[a].balance,equity:market[a].equity})
        }
    }, oneSecond);})
    //etf
    var twoSecond = 1000*60*60*12 * 1; // one second = 1000 x 1 ms
    setInterval(async()=> {
        var time = new Date()
       let market = await mongo.msgModel.find({},{TotalCashBalance:1,StockMarketValue:1})
        console.log(market)
        for (var a=0;a<market.length;a++){
            let marketc = {date:time,name:market[a]._id,capitalization:market[a].TotalCashBalance+market[a].StockMarketValue}
            console.log(marketc)
            await mongo.etfModel.create({date:time,name:market[a]._id,capitalization:market[a].TotalCashBalance+market[a].StockMarketValue})
        }
          }, twoSecond);
    MongoClient.connect(url, async(err, db)=> {
        if (err) throw err;
        let aim = await mongo.aimsModel.find()
        console.log(aim[0].position)
        var key =Object.keys(aim[0].position)
            console.log(key)
        var all = 0
        for(var i=0;i<key.length;i++){
            let newMsg= await db.collection(key[i]).find({}).sort({_id:-1}).limit(1).toArray()
            let result = aim[0].position[key[i]].weight/aim[0].position[key[i]].baseprice*newMsg[0].Close
            console.log("result:",result)
          all = all+result
        }
        console.log("all:",all)
        var newA =[]
        for(var u=0;u<key.length;u++){
            let newMsg= await db.collection(key[u]).find({}).sort({_id:-1}).limit(1).toArray()
            console.log("ccc:",newMsg)
            console.log("ccc:",aim[0].position[key[u]].weight)
            let result = aim[0].position[key[u]].weight/aim[0].position[key[u]].baseprice*newMsg[0].Close
            let newWeight= result/all
            console.log("newWeight:",newWeight)
            let newAims ={[key[u]]:{weight:newWeight,baseprice:newMsg[0].Close}}
            console.log("newAims",newAims)
            newA.push(newAims)

        }
        console.log(newA)
        db.close();
    })
        });
server.on('message', async (msg1, rinfo)=>{
//计算比例单个价格/总价格与目标的差距
  console.info('get message : ' + msg1 + 'from' + rinfo.address + ':' + rinfo.port);
 // console.log(msg1)
  var msg = JSON.parse(msg1)
 // console.log(msg)
 // console.log(msg.marketPrice)
  if(msg.t=='updatePortfolio') {
      let user = await mongo.msgModel.find({_id: msg.accountName})
      if (user.length == 0) {
          await mongo.msgModel.create({
              _id: msg.accountName,
              updatePortfolio: [{
                  symbol: msg.symbol,
                  secType: msg.secType,
                  exchange: msg.exchange,
                  position: msg.position,
                  marketPrice: msg.marketPrice,
                  marketValue: msg.marketValue,
                  averageCost: msg.averageCost,
                  unrealizedPNL: msg.unrealizedPNL,
                  realizedPNL: msg.realizedPNL
              }]
          })
      }
      else {
          let mesg = await mongo.msgModel.find({_id: msg.accountName, "updatePortfolio.symbol": msg.symbol})
          if (mesg.length == 0) {
              //新增种类
              console.log("走到这里了吗")
              console.log(msg.symbol)
              await mongo.msgModel.update({_id: msg.accountName}, {
                  $push: {
                      updatePortfolio: {

                          symbol: msg.symbol,
                          secType: msg.secType,
                          exchange: msg.exchange,
                          position: msg.position,
                          marketPrice: msg.marketPrice,
                          marketValue: msg.marketValue,
                          averageCost: msg.averageCost,
                          unrealizedPNL: msg.unrealizedPNL,
                          realizedPNL: msg.realizedPNL
                      }
                  }
              })
          } else {
              //修改数组中的元素
              console.log("修改数组中的")
              await mongo.msgModel.update({_id: msg.accountName, "updatePortfolio.symbol": msg.symbol}, {
                  $set: {
                      "secType": msg.secType,
                      "exchange": msg.exchange,
                      "position": msg.position,
                      "marketPrice": msg.marketPrice,
                      "marketValue": msg.marketValue,
                      "averageCost": msg.averageCost,
                      "unrealizedPNL": msg.unrealizedPNL,
                      "realizedPNL": msg.realizedPNL
                  }
              })
          }

      }
      if (msg.status == "Submitted") {
          await mongo.msgModel.update({})
      }
      /!*
      差距：仓比减去目标仓比
      差了多少份：差距乘以总价格除以单价
      目标仓比*!/
  }
if(msg.t=='updateAccountValue') {
    let key = await mongo.msgModel.find({_id:msg.accountName})
    var key2= JSON.parse(JSON.stringify(key))
     console.log("keykeykeykey:",key)
     console.log(key2)
    // console.log(key2[0].updateAccountValue)
    var key4 = key2[0].updateAccountValue
    console.log("key4key4key4key4",key4)
    // console.log("key3key3key3key3:",key3)
    // console.log(key3[1].AvailableFunds)
    console.log("key:", msg.key)
    if (msg.key == "StockMarketValue") {
        var StockMarketValue = msg.val
        console.log(msg.val)
        await mongo.msgModel.update({_id: msg.accountName}, {
            $set: {
                StockMarketValue: StockMarketValue
            }
        })
    }
    if (msg.key == "TotalCashBalance") {
        var TotalCashBalance = msg.val
        await mongo.msgModel.update({_id: msg.accountName}, {
            $set: {
                TotalCashBalance: TotalCashBalance
            }
        })
    }
    //总市值
    if(msg.key=="AccountCode"){
        console.log("12key:",msg.key)
        console.log("lllllllllllllllllllllllll",key4.AccountCode)
        {
            if(!key4.AccountCode){
                //不存在
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccountCode: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccountCode":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AccountOrGroup"){
        console.log("key:",msg.key)
        {
            if(!key4.AccountOrGroup){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccountOrGroup: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccountOrGroup":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AccountReady"){
        console.log("12key:",msg.key)
        {
            if(!key4.AccountOrGroup){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccountReady: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccountReady":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AccountType"){
        console.log("12key:",msg.key)
        {
            if(!key4.AccountType){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccountType: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccountType":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AccruedCash"){
        console.log("12key:",msg.key)
        {
            if(!key4.AccruedCash){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccruedCash: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccruedCash":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AccruedDividend"){
        console.log("12key:",msg.key)
        {
            if(!key4.AccruedDividend){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AccruedDividend: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AccruedDividend":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="AvailableFunds"){
        console.log("12key:",msg.key)
        {
            if(!key4.AvailableFunds){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        AvailableFunds: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.AvailableFunds":[msg.val,msg.currency]}
                })
            }
        }return}
    if(msg.key=="Billable"){
        console.log("12key:",msg.key)
        {
            if(!key4.Billable){
                await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
                    updateAccountValue:{
                        Billable: [msg.val,msg.currency]
                    }
                }})}
            else{
                await mongo.msgModel.update({_id:msg.accountName},{$set:
                {"updateAccountValue.Billable":[msg.val,msg.currency]}
                })
            }
        }return}
  if(msg.key=="BuyingPower"){
    console.log("12key:",msg.key)
    {
      if(!key4.BuyingPower){
        await mongo.msgModel.update({_id:msg.accountName},{$addToSet:{
          updateAccountValue:{
            BuyingPower: [msg.val,msg.currency]
          }
        }})}
      else{
        await mongo.msgModel.update({_id:msg.accountName},{$set:
        {"updateAccountValue.BuyingPower":[msg.val,msg.currency]}
        })
      }
    }return}

  var message = new Buffer('I got message! from server');
  server.send(message, 0, message.length, rinfo.port, rinfo.address);
}});*!/
//position:仓位
//averageCost平均成本
//unrealizedPNL浮盈
//realizedPNL盈利
/!*
get message : {"orderId": 0, "symbol": "IWM", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 172.0, "status": "Submitted"}from192.168.31.44:52576
get message : {"orderId": 0, "status": "Submitted提交", "filled已完成": 0.0, "remaining还剩多少": 172.0, "avgFillPrice": 0.0, "permId": 1943416204, "parentId": 0, "lastFillPrice": 0.0, "clientId": 0, "whyHeld": ""}from192.168.31.44:52576
get message : {"orderId": 0, "symbol": "IWM", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 172.0, "status": "Filled"}from192.168.31.44:52576
get message : {"orderId": 0, "status": "Filled", "filled": 172.0, "remaining": 0.0, "avgFillPrice": 153.4, "permId": 1943416204, "parentId": 0, "lastFillPrice": 153.4, "clientId": 0, "whyHeld": ""}from192.168.31.44:52576
get message : {"orderId": 0, "symbol": "IWM", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 172.0, "status": "Filled"}from192.168.31.44:52576
get message : {"orderId": 0, "status": "Filled", "filled": 172.0, "remaining": 0.0, "avgFillPrice": 153.4, "permId": 1943416204, "parentId": 0, "lastFillPrice": 153.4, "clientId": 0, "whyHeld": ""}from192.168.31.44:52576
get message : {"orderId": 0, "symbol": "SCJ", "secType": "STK", "exchange": "SMART", "action": "BUY", "orderType": "MKT", "totalQuantity": 1681.0, "status": "Submitted"}from192.168.31.44:52576
get message : {"orderId": 0, "status": "Submitted", "filled": 0.0, "remaining": 1681.0, "avgFillPrice": 0.0, "permId": 1943416218, "parentId": 0, "lastFillPrice": 0.0, "clientId": 0, "whyHeld": ""}from192.168.31.44:52576
get message : {"t": "updatePortfolio", "symbol": "EWT", "secType": "STK", "exchange": "", "position": 3006.0, "marketPrice": 35.35770035, "marketValue": 106285.25, "averageCost": 35.39486695, "unrealizedPNL": -111.72, "realizedPNL": 0.0, "accountName": "DU229339"}from192.168.31.44:60109
get message : {"t": "updatePortfolio", "symbol": "IAU", "secType": "STK", "exchange": "", "position": 2621.0, "marketPrice": 12.1194, "marketValue": 31764.95, "averageCost": 12.1948474, "unrealizedPNL": -197.75, "realizedPNL": 0.0, "accountName": "DU229339"}from192.168.31.44:60109
get message : {"t": "updatePortfolio", "symbol": "IBB", "secType": "STK", "exchange": "", "position": 62.0, "marketPrice": 106.1039963, "marketValue": 6578.45, "averageCost": 106.69612905, "unrealizedPNL": -36.71, "realizedPNL": 0.0, "accountName": "DU229339"}from192.168.31.44:60109
get message : {"t": "updatePortfolio", "symbol": "INDF", "secType": "STK", "exchange": "", "position": 1283.0, "marketPrice": 32.90610125, "marketValue": 42218.53, "averageCost": 32.945, "unrealizedPNL": -49.91, "realizedPNL": 0.0, "accountName": "DU229339"}from192.168.31.44:60109
get message : {"t": "updatePortfolio", "symbol": "IVV", "secType": "STK", "exchange": "", "position": 220.0, "marketPrice": 269.58200075, "marketValue": 59308.04, "averageCost": 269.61454545, "unrealizedPNL": -7.16, "realizedPNL": -0.0, "accountName": "DU229339"}from192.168.31.44:60109
get message : {"t": "updatePortfolio", "symbol": "IWM", "secType": "STK", "exchange": "", "position": 172.0, "marketPrice": 153.33999635, "marketValue": 26374.48, "averageCost": 153.40581395, "unrealizedPNL": -11.32, "realizedPNL": 0.0, "accountName": "DU229339"}from192.168.31.44:60109`
 *!/
//server.bind(3000);
/!* GET home page. *!/
router.get('/', function(req, res) {
  res.render('index.html');
});

/!*!// 登录
router.post('/login', async (req, res) => {
  let params = req.body;
  let user = await mongo.findOne('users', {username:params.username});
  if(user) {
    let compare = await bcrypt.compare(params.password, user.password);
    if(compare === true) { // 登录成功, 进入首页
      req.session.username = req.body.username; // 存放登录用户名
      res.redirect('/riskmonitor/account');
    } else {
      res.render('login', {error: '密码错误'});
    }
  } else {
    res.render('login', {error: '不存在该用户'});
  }
});*!/

router.get('/logout', (req, res) => {
  req.session.username = null;
  res.render('login');
});

// 注册
router.post('/regist', async (req, res) => {
  let params = req.body;
  try {
    let ps = await bcrypt.hash(params.password, saltRounds);
    let r = await mongo.insertOne('users', {username:params.username,password:ps});
    logger.debug(r.result);
    res.end("success");
  } catch(err) {
    logger.warn(err);
    res.json({code:-1,message:'该用户已经存在'});
  }
});

// 修改密码
router.post('/update_password', async (req, res) => {
  let params = req.body;
  let ps = await bcrypt.hash(params.password, saltRounds); // 密码 hash
  let r = await mongo.updateOne('users', {username:params.username}, {$set:{password:ps}});
  logger.debug(r.result);
  res.end('success');
});

*/

module.exports = router;