/**
 * 账户信息
 */
const router = require('express').Router();
const mongo = require('../dbs/mongo');
const zlib = require('zlib');
const merging = require('../util/merging');
// 账户信息
router.get('/information', async (req, res) => {
  let information = await mongo.userModel.find({})
  console.log("information:",information)
  res.send(information);

})
//正在进行中的交易
router.get('/Trading', async (req,res)=>{
  console.log("reqreq:",req.query.nameNum)
  var nameNum = req.query.nameNum
  let a = await mongo.followModel.find({followNumber:nameNum})
  var time = new Date()
  console.log("aaaaaaaaaaaaaaaaaaaaaa",a[0].validity<time)
  if(a.length == 0) {
    return
  }
  if(a[0].validity<time){
    return
  }
  let now = await mongo.nowModel.find({nameNum:a[0].sendNumber})
  let amount = await mongo.nowModel.count({nameNum:a[0].sendNumber})
  console.log("amount",a[0].sendNumber,amount)
  var now1 = now.toString()
  console.log("now:",JSON.stringify(now))
  console.log("res:",{now,amount})
  res.send({now,amount});
})
//历史的交易
router.get('/history1', async (req, res) => {
  await mongo.msgModel.update({_id:"DU897561"},
      {$set:
  {"updateAccountValue.BuyingPower":["2489067.16","USD"]}

  })
  res.json({errorCode:0})
})

//新的交易
router.get('/historyNew', async (req,res)=>{
  console.log(req.query.id)
  let data = await mongo.msgModel.find({_id:req.query.id})
 //console.log(data[0].updatePortfolio[0].symbol)
 //res.send({data:data})
let aim  = await mongo.aimsModel.find({})
  console.log(aim[0].position)
 //for(var i = 0, len = data[0].updatePortfolio.length; i < len; i++){
 //  var a = data[0].updatePortfolio[i].symbol
 //  data[0].updatePortfolio[i].aim = aim[0].position
 //}
  console.log(aim[0].position.key)
  console.log(data)
  merging(data,aim)
   res.json({data:data,aim:aim})
})
router.post('/aims', async (req,res)=>{
  console.log(req.body)
  await mongo.aimsModel.create({
    money:req.body.money,
    name:req.body.name,
    position:req.body.position

  })
  res.send("ok")
})
//查询etf账号的净值
router.get('/etfP',async(req,res)=>{
  let etfP = await mongo.etfModel.find({name:req.query.name})
  console.log("etfP:",req.query.name)
  console.log("etfP:",etfP)
  res.render('index.html',{a:0})
})

module.exports = router;