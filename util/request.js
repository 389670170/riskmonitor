/**
 * Created by haoran.shu on 2017/12/5.
 */
const http = require('http');
const url = require('url');
const querystring = require('querystring');

/**
 * nodejs HTTP 请求封装
 * 关于 option 的配置参考：http://nodejs.cn/api/http.html#http_http_request_options_callback
 * @param urlstr: 请求的 url 地址, 可以不填, 然后在 option 参数中进行相关配置
 * @param option: 请求的配置参数, 带有原始的 nodejs htt.request option 参数
 *   -- 新增一个 body 参数为请求的内容, 格式为 JSON 格式
 */
let request = function(urlstr, option) {
  return new Promise((resolve, reject) => {
    const httpOption = {method: 'GET'};
    Object.assign(httpOption, url.parse(encodeURI(urlstr)), option); // 合并配置
    let postData = httpOption.body; // 获取请求内容
    delete httpOption.body;
    const req = http.request(httpOption, (res) => {
      let resData = '', statusCode = res.statusCode;
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resData += chunk;
      });
      res.on('end', () => {
        if(statusCode === 302) { // 响应重定向
          resolve('请求成功，' + resData);
        } else if(statusCode === 200) { // 请求成功
          resolve(resData);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    // 写入数据到请求主体
    if(postData) {
      if(option.headers['Content-Type'].indexOf('application/json') !== -1) {
        req.write(JSON.stringify(postData));
      } else {
        req.write(querystring.stringify(postData));
      }
    }
    req.end();
  });
};

module.exports = request;