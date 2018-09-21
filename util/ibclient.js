const ib=require('ib')
var ibclient = new ib({
    clientId: 1,
    host: '127.0.0.1',
    port: 7497
}).on('error', function (err) {
    console.error('error --- %s', err.message);
}).on('result', function (event, args) {
    console.log('%s --- %s', event, JSON.stringify(args));
}).on('disconnected', function (){
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
ibclient.on('updateAccountValue', function (key, value, currency, accountName){
    //{"t":"updateAccountValue","key":key,"val":val,"currency":currency,"accountName":accountName}
    console.log(`${key},${value},${currency},${accountName}`)
})
ibclient.on('updatePortfolio', function (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, accountName){
    /*{"t":"updatePortfolio","symbol":contract.symbol,"secType":contract.secType,"exchange":contract.exchange,"position":position,
         "marketPrice":marketPrice,"marketValue":marketValue,"averageCost":averageCost,"unrealizedPNL":unrealizedPNL,
         "realizedPNL":realizedPNL,"accountName":accountName})*/
    console.log(`${contract.symbol},${contract.secType},${contract.exchange},${position},${marketPrice},${marketValue},${averageCost},${unrealizedPNL},${realizedPNL},${accountName}`)
})
ibclient.on('updateAccountTime', function (timeStamp){
    //as ping
})
ibclient.on('accountDownloadEnd', function (accountName){
//第一轮拉取用户信息结束，以后都是更新
})
ibclient.on('openOrder', function (orderId, contract, order, orderState){
   /* {"t":"openOrder","orderId":orderId, "symbol":contract.symbol, "secType":contract.secType,
        "exchange":contract.exchange,"action":order.action,"orderType":order.orderType,
        "totalQuantity":order.totalQuantity, "status":orderState.status,*/
    console.log(`${orderId},${contract.symbol},${contract.secType},${contract.exchange},${order.action},${order.orderType},${order.totalQuantity},${orderState.status}`)
})
ibclient.on('orderStatus', function (id, status, filled, remaining, avgFillPrice, permId, parentId, lastFillPrice, clientId, whyHeld){
    /*{"t":"orderStatus","orderId":id, "status":status, "filled":filled,
            "remaining":remaining, "avgFillPrice":avgFillPrice,
            "permId":permId, "parentId":parentId, "lastFillPrice":lastFillPrice,
            "clientId":clientId, "whyHeld":whyHeld,}*/
    console.log(`${id},${status},${filled},${remaining},${avgFillPrice},${permId},${parentId},${lastFillPrice},${clientId},${whyHeld}`)
})
ibclient.on('openOrderEnd', function (){
    //拉取订单结束，以后都是更新
})
