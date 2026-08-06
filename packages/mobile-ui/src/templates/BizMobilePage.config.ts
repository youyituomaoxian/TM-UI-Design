/*
 * BizMobilePage.config.ts — 移动端页面配置模板（生成器克隆源配套说明）
 *
 * 本文件是「模板配套说明」，不是被脚手架克隆的对象。
 * 脚手架 new-page-mobile.js 会为每个新页面在 src/pages/<dirName>/ 下生成
 * 独立的 index.config.ts，内容形如：
 *
 *   export default {
 *     navigationBarTitleText: '<PageName>',   // ← 开发者须改为真实页面名（如「设备列表」）
 *     navigationStyle: 'custom',              // 隐藏微信原生导航栏（模板固定渲染 NutUI NavBar，避免双导航栏）
 *   };
 *
 * 注意：导航栏标题（navigationBarTitleText）默认取组件名原文，
 * 真实语义标题需开发者按 弘讯移动端design-system/RULES.md §1.1b 覆写。
 * navigationStyle:'custom' 是硬约束：模板 NavBar 自带 safeAreaInsetTop 占位，
 * 删掉它会回退双导航栏（BLOCKED #38 T01 结案依据）。
 */
export default {
  navigationBarTitleText: 'BizMobilePage',
};
