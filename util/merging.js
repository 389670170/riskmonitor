/**
 * Created by Administrator on 2018/1/9.
 */

/**
 {
"data": [
 {
     "_id": "DU229333",
     "TotalCashBalance": 1005129,
     "StockMarketValue": 0,
     "updateAccountValue": {
         "BuyingPower": [
             "4021216.04",
             "USD"
         ],
         "Billable": [
             "0.00",
             "USD"
         ],
         "AvailableFunds": [
             "1005304.01",
             "USD"
         ],
         "AccruedDividend": [
             "0.00",
             "USD"
         ],
         "AccruedCash": [
             "175",
             "USD"
         ],
         "AccountType": [
             "LLC",
             ""
         ],
         "AccountReady": [
             "true",
             ""
         ],
         "AccountOrGroup": [
             "DU229333",
             "USD"
         ],
         "AccountCode": [
             "DU229333",
             ""
         ]
     },
     "updatePortfolio": [
         {
             "symbol": "PSQ",
             "secType": "STK",
             "exchange": "",
             "position": 249,
             "marketPrice": 34.5969124,
             "marketValue": 8614.63,
             "averageCost": 34.69401605,
             "unrealizedPNL": -24.18,
             "realizedPNL": 0
         },
         {
             "realizedPNL": 0,
             "unrealizedPNL": -1.88,
             "averageCost": 37.1548325,
             "marketValue": 22178.55,
             "marketPrice": 37.15000155,
             "position": 597,
             "exchange": "",
             "secType": "STK",
             "symbol": "EWT"
         },
         {
             "realizedPNL": 0,
             "unrealizedPNL": -3.26,
             "averageCost": 272.265,
             "marketValue": 60711.83,
             "marketPrice": 272.2503662,
             "position": 223,
             "exchange": "",
             "secType": "STK",
             "symbol": "IVV"
         },
         {
             "realizedPNL": 0,
             "unrealizedPNL": -21.42,
             "averageCost": 41.47,
             "marketValue": 4125.58,
             "marketPrice": 41.25577165,
             "position": 100,
             "exchange": "",
             "secType": "STK",
             "symbol": "UGL"
         },
         {
             "realizedPNL": 0,
             "unrealizedPNL": -16.6,
             "averageCost": 41.90502515,
             "marketValue": 8322.5,
             "marketPrice": 41.82160185,
             "position": 199,
             "exchange": "",
             "secType": "STK",
             "symbol": "RWM"
         },
         {
             "realizedPNL": 0,
             "unrealizedPNL": -105.33,
             "averageCost": 92.98877195,
             "marketValue": 10495.39,
             "marketPrice": 92.06481935,
             "position": 114,
             "exchange": "",
             "secType": "STK",
             "symbol": "RXL"
         }
     ]
 }
],
"aim": [
 {
     "_id": "5a4f341f4aff750d90ce0794",
     "money": 250000,
     "position": {
         "EWJ": {
             "baseprice": 59.83,
             "weight": 0
         },
         "EWT": {
             "baseprice": 35.98,
             "weight": 0.08597382540484179
         },
         "EZJ": {
             "baseprice": 130,
             "weight": 0
         },
         "IVV": {
             "baseprice": 269.81,
             "weight": 0.24085665337280027
         },
         "PSQ": {
             "baseprice": 35.35,
             "weight": 0.03529022959082045
         },
         "RWM": {
             "baseprice": 41.94,
             "weight": 0.03349323530064045
         },
         "RXL": {
             "baseprice": 88.57,
             "weight": 0.04069469506959543
         },
         "SCJ": {
             "baseprice": 79.45,
             "weight": 0.5370027953576301
         },
         "UGL": {
             "baseprice": 40.12,
             "weight": 0.026688565903671562
         }
     },

      计算比例单个价格/总价格与目标的差距
 }
]
}
 */
/*module.exports = function(aims, updatePortfolios) {
    // 1. 计算交易种类总价格
    let all = updatePortfolios.reduce((sum, updatePortfolio) => {
        return sum + updatePortfolio.marketValue;
    }, 0);

    /!* 2. 遍历(目标种类和交易种类)计算所有种类的差距 *!/
    let result = [];
    // 遍历所有的目标
    aims.forEach((aim) => {
        let ri = [], position = aim.position;
        // 目标的所有种类
        let asStr = Object.keys(position).toString(),
            updatePortfolioSymbols = []; // 所有的交易的种类集
        /!* 计算差距, 分3种情况(a,b,c) *!/
        for(let i = 0, len = updatePortfolios.length; i < len; i++) {
            let updatePortfolio = updatePortfolios[i], gap = 0;
            if(asStr.indexOf(updatePortfolio.symbol) !== -1) { // a.目标和交易都有
                gap = updatePortfolio.marketValue / all - position[key].weight;
            } else { // b.交易有,目标没有
                gap = updatePortfolio.marketValue / all;
            }
            ri.push({symbol:updatePortfolio.symbol,gap});
            updatePortfolioSymbols.push(updatePortfolio.symbol);
        }
        updatePortfolioSymbols = updatePortfolioSymbols.toString();
        for(let key in position) {
            if(updatePortfolioSymbols.indexOf(key) !== -1) { // c.目标有,交易没有
                ri.push({symbol:key,gap:-position[key].weight});
            }
        }
        result.push(ri);
    });
    return result;
};*/
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
let merges = function(data,aim ) {
    // console.log(data[0].updatePortfolio[0].symbol)
    //console.log(aim[0].position)
    var all= 0
    var key1 =[]
    var key2 =[]
    for (var i = 0; i < data[0].updatePortfolio.length; i++) {
        all=all+data[0].updatePortfolio[i].marketValue
        console.log("all:",data[0].updatePortfolio[i].marketValue)
        console.log("all:",all)
        key2.push(data[0].updatePortfolio[i].symbol)
        //console.log(data[0].updatePortfolio[i].symbol)
    }
    for (var key in aim[0].position) {
        //console.log(Object.keys(aim[0].position))
        // console.log(key, aim[0].position[key])

        console.log("ddd:", key)
        key1.push(key)

    }
    console.log("key1:",key1)
    console.log("all:",all)
    var result =[]
    var result1=[]
    var result2=[]
    for (var key in aim[0].position) {
        for (var m = 0; m < data[0].updatePortfolio.length; m++) {
            if (data[0].updatePortfolio[m].symbol == key) {
                let final =aim[0].position[key].weight - data[0].updatePortfolio[m].marketValue / all
                console.log("final:", data[0].updatePortfolio[m].marketValue)
                console.log("final1111:", data[0].updatePortfolio[m].marketValue / all)
                console.log("final:", aim[0].position[key].weight)
                console.log("final:", final)
                var po = {symbol:data[0].updatePortfolio[m].symbol,gap:final}
                console.log("popopopopopo:",po)
                result.push(po)
                key1.remove(key)
                key2.remove(data[0].updatePortfolio[m].symbol)
                console.log(key)
                console.log(key1)
            }
        }}
        for(var l =0;l<key1.length;l++){
            console.log("aaaaaaaaaaaaaa:",aim[0].position[key1[l]].weight)
            let final1 = aim[0].position[key1[l]].weight
            var po1 = {symbol:key1[l],gap:final1}
            result.push(po1)
        }
        for(var z =0;z<key2.length;z++){
            console.log("aaaaaaaaaaaaaa:",data[0].updatePortfolio[z].symbol)
            let final2 = - data[0].updatePortfolio[z].marketValue/all
            var po2 = {symbol:key2[z],gap:final2}
            result.push(po2)
        }
    // 差了多少份：差距乘以总价格除以单价
    console.log("key1:",key1)
    console.log("result:",result)
    var posit = []
    var copi = []
    for (var i in aim[0].position){
    posit.push(aim[0].position[i])}
    console.log("posit:",posit)
    for(var w = 0;w<result.length;w++) {
            for (var key in aim[0].position) {
                if (result[w].symbol == key){
                    let copies =  result[w].gap*all/aim[0].position[key].baseprice
                   // console.log("copies:",copies)
                    var cop = {symbol:result[w].symbol,gap:result[w].gap,copies:copies}
                    copi.push(cop)
                }
                    }
            // let copies =  result[w].gap*all/


    }
console.log("copi:",copi)
return result
}
module.exports= merges;
