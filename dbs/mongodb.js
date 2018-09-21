"use strict";

const {MongoClient} = require('mongodb');
const { mongo } = require('../config.js');
const logger = require('log4js').getLogger('mongodb');
let mdb;

// 链接到 mongo
MongoClient.connect(mongo.link).then((db) => {
  logger.debug('mongo connect success!');
  mdb = db;
  mdb.collection('users').createIndex({username:1},{unique:true,background:true});
}).catch((err) => {
  logger.error(err);
});

module.exports = {
  insertOne: function(connname, doc) {
    return mdb.collection(connname).insertOne(doc);
  },
  find: function(connname, query = {}, fields) {
    return mdb.collection(connname).find(query, fields);
  },
  findOne: function(connname, query = {}, options) {
    return mdb.collection(connname).findOne(query, options);
  },
  count: function(connname, query = {}) {
    return mdb.collection(connname).count(query);
  },
  updateOne: (connname, filter, update, options) => {
    return mdb.collection(connname).updateOne(filter, update, options);
  },
  collection: (collname) => {
    return mdb.collection(collname);
  },
  close: function() {
    mdb.close();
  }
};