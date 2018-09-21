/**
 * 常用工具类
 * Created by haoran.shu on 2017/11/30.
 */
module.exports = {
  /**
   * 根据数据总量, 计算一共有多少页
   * @param total 数据总理
   * @param pagenumber 每一页显示的数量
   */
  pages: function(total, pagenumber = 10) {
    return parseInt(total / pagenumber) + ((total % pagenumber === 0) ? 0 : 1);
  }
};
