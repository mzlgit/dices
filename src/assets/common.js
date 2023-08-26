/**
 * 
 * @param {*} val 0-6
 * @param {*} prefix 周 星期
 * @returns 
 */
export function getWeekday(val, prefix = '星期') {
  let target;
  switch (val) {
    case 1:
      target = "一";
      break;
    case 2:
      target = "二";
      break;
    case 3:
      target = "三";
      break;
    case 4:
      target = "四";
      break;
    case 5:
      target = "五";
      break;
    case 6:
      target = "六";
      break;
    case 0:
      target = "日";
      break;
  }
  return prefix + target;
}

// 转换为当前屏幕大小的像素
export function toCurPX(px) {
  return (px / (1920 / 100)) * (window.innerWidth / 100);
}

export function fontSizePx(res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) return;
  let fontSize = 100 * (clientWidth / 1920);
  return res * fontSize;
}

// 设置 rem 函数
export function setRem () {
  const baseSize = 10
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  // let scale = document.documentElement.clientWidth / 1920
  // scale = scale < 1 ? 1 : scale
  // // 设置页面根节点字体大小
  document.documentElement.style.fontSize = (baseSize) + 'px'
  // document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
}

/**
 * 
 * @param {*} val 学历关系
 * 用户学历，学历：4:大专、5:本科、6:硕士、7:博士
 * @returns 
 */
export function educationType(val) {
  let target;
  switch(val) {
    case 4: 
      target = '大专';
      break;
    case 5: 
      target = '本科';
      break;
    case 6: 
      target = '硕士';
      break;
    case 7: 
      target = '博士';
      break;
    default: 
      target = '';
      break;
  }
  return target;
}