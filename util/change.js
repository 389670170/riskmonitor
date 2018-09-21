/**
 * Created by Administrator on 2018/1/12.
 */
const express = require('express');
const mongo = require('../dbs/mongo');

const dgram = require('dgram');

const server = dgram.createSocket('udp4');
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://192.168.31.201:27017/etfdata"
MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    db.close();
});
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