/**
 * 获取门禁系统封装
 * Created by haoran.shu on 2017/12/5.
 */
const crypto = require('crypto');
const logger = require('log4js').getLogger('door');
const request = require('../util/request');
const qs = require('querystring');

const baseUrl = 'http://kq.qycn.com/index.php/Api'; // 基础的 url
const account = '1db2f5e3500b545a2c03982513802aae';
const secret_key = 'LhLH77K^34433sdHs92wdk';

/**
 * 进行门禁系统数据请求
 * @param apiUrl  接口地址, 例如：/Api/recordlog
 * @param params  请求参数
 */
let door = (apiUrl, params = {}) => {
  let p = {
    account: account,
    end: params.end,
    page: Number(params.page),
    requesttime: parseInt(Date.now() / 1000),
    start: params.start
  };
  logger.debug('door req str: ' + Object.values(p).join(''));
  // 签名
  let sign = crypto.createHash('md5').update(
    Object.values(p).join('') + secret_key).digest('hex');
  logger.debug('sign: ' + sign);
  p.sign = sign;
  // 请求接口获取数据
  return request(baseUrl + apiUrl + '?' + qs.stringify(p));
};

module.exports = door;