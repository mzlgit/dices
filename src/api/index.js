// 引入post
import { requestPost } from './axios'

// 获取三个总数数据
export function getTopThreeData() {
  return requestPost('/api/summaryModule/summary/getUAndPAndENum')
}

// 查询职位招聘城市排行前五名信息
export function getLeftOneData() {
  return requestPost('/api/summaryModule/summary/getRankTop5OfCityInRecruitDesc')
}

// 用户期望城市排行Top5获取
export function getLeftTwoData() {
  return requestPost('/api/summaryModule/summary/getRankTop5OfExpectCityDesc')
}

// 近一年简历投递数量获取
export function getLeftThreeData() {
  return requestPost('/api/summaryModule/summary/getDeliveryInCurrentYear')
}

// 上周热词搜索趋势获取
export function getRightOneData() {
  return requestPost('/api/summaryModule/summary/getLastWeekHotWordSearchTrend')
}

// 投递行业top8获取
export function getRightTwoData() {
  return requestPost('/api/summaryModule/summary/getDeliveryIndustryTop8')
}

// 学历人数分布获取
export function getRightThreeData() {
  return requestPost('/api/summaryModule/summary/getEduSpread')
}

// 性别人数分布获取
export function getRightFourData() {
  return requestPost('/api/summaryModule/summary/getUserSexSpread')
}

//广东省企业分布数量获取
export function getMapData() {
  return requestPost('/api/summaryModule/summary/getEnterpriseSpread')
}
