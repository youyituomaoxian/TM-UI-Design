/* 弘讯左右结构 · 框架级多语言真源（2026-11-20 从 V7 提取） */
(function(){
  var DICT = {
    'page.title': {zh:'设备运维工作台', en:'Machine Operations'},
    'global.search': {zh:'搜索机器 / 工单 / 文档…', en:'Search machines / orders / docs…'},
    'page.sub': {zh:'Machine Operations', en:'Machine Operations'},
    'tool.home': {zh:'首页', en:'Home'},
    'tool.changepwd': {zh:'修改密码', en:'Change Password'},
    'tool.logout': {zh:'退出登录', en:'Sign Out'},
    'tool.fullscreen': {zh:'全屏', en:'Fullscreen'},
    'page.refresh': {zh:'刷新数据（当前页）', en:'Refresh this page'},
    'tool.app': {zh:'APP 下载', en:'Get App'},
    'tool.theme': {zh:'主题', en:'Theme'},
    'tool.lang': {zh:'语言', en:'Language'},
    'app.title': {zh:'APP 下载', en:'Get the App'},
    'app.sub': {zh:'扫码安装弘设汇移动端', en:'Scan to install Hongshehui mobile'},
    'app.android': {zh:'安卓版', en:'Android'},
    'app.ios': {zh:'iOS 版', en:'iOS'},
    'app.note': {zh:'也可在应用商店搜索「弘设汇」下载', en:'Or search "Hongshehui" in your app store'},
    'theme.default': {zh:'默认蓝', en:'Default blue'},
    'theme.cyan': {zh:'科技青', en:'Tech cyan'},
    'theme.green': {zh:'工业绿', en:'Industrial green'},
    'theme.amber': {zh:'琥珀橙', en:'Amber'},
    'theme.violet': {zh:'深空紫', en:'Deep violet'},
    'theme.dark': {zh:'暗色', en:'Dark'},
    'tab.production': {zh:'生产监控', en:'Production'},
    'tab.status': {zh:'运行状态', en:'Running Status'},
    'kpi.machines': {zh:'机器总数', en:'Machines'},
    'kpi.running': {zh:'生产', en:'Running'},
    'kpi.idle': {zh:'空闲', en:'Idle'},
    'kpi.off': {zh:'关机', en:'Off'},
    'kpi.alarm': {zh:'警报机器总数', en:'Alarms'},
    'kpi.activeAlarm': {zh:'活动警报 1 条', en:'1 active alarm'},
    'kpi.output': {zh:'今日产量', en:'Today Output'},
    'kpi.yesterday': {zh:'昨日', en:'yesterday'},
    'kpi.defect': {zh:'不良品数', en:'Defects'},
    'kpi.yesterday2': {zh:'昨日', en:'yesterday'},
    'kpi.oee': {zh:'综合 OEE', en:'Overall OEE'},
    'table.title': {zh:'生产机器明细', en:'Machine Details'},
    'table.search': {zh:'搜索机器名称…', en:'Search machines…'},
    'filter.all': {zh:'全部', en:'All'},
    'filter.run': {zh:'生产', en:'Running'},
    'filter.idle': {zh:'空闲', en:'Idle'},
    'filter.off': {zh:'关机', en:'Off'},
    'th.plant': {zh:'场地', en:'Site'},
    'th.machine': {zh:'机器名称', en:'Machine'},
    'th.status': {zh:'生产状态', en:'Status'},
    'th.product': {zh:'当前产品', en:'Product'},
    'th.process': {zh:'工艺编号', en:'Process No.'},
    'th.progress': {zh:'生产进度', en:'Progress'},
    'th.pph': {zh:'PPH', en:'PPH'},
    'th.good': {zh:'良品数', en:'Good'},
    'th.defect': {zh:'不良品数', en:'Defects'},
    'th.op': {zh:'操作', en:'Action'},
    'st.run': {zh:'生产', en:'Running'},
    'st.idle': {zh:'空闲', en:'Idle'},
    'st.off': {zh:'关机', en:'Off'},
    'op.detail': {zh:'详情', en:'Detail'},
    'pager.total': {zh:'共 11 条 · 1/1 页', en:'11 items · 1/1'}
  };

  DICT['template.title']={zh:'页面标题',en:'Page Title'};
  DICT['page.live']={zh:'数据实时状态',en:'Live data'};
  DICT['page.refreshLabel']={zh:'刷新',en:'Refresh'};
  DICT['template.paneHint']={zh:'双 pane 演示：页签 data-pane ↔ 正文 .page-sec.is-active 联动',en:'Dual-pane demo: tab data-pane ↔ .page-sec.is-active'};
  DICT['template.module']={zh:'业务模块',en:'Business Modules'};
  DICT['template.current']={zh:'当前页面',en:'Current Page'};
  DICT['template.page2']={zh:'页面二',en:'Page 2'};
  DICT['template.settings']={zh:'系统设置',en:'System Settings'};
  DICT['template.basic']={zh:'基础配置',en:'Basic Configuration'};
  DICT['template.tab']={zh:'页面',en:'Page'};
  DICT['template.export']={zh:'导出',en:'Export'};
  DICT['template.add']={zh:'新增',en:'New'};
  DICT['template.list']={zh:'列表视图',en:'List View'};
  DICT['template.card']={zh:'卡片视图',en:'Card View'};
  DICT['template.content']={zh:'页面内容',en:'Page Content'};
  DICT['template.contentHint']={zh:'替换本区块，不要改外壳',en:'Replace this section; do not change the shell'};
  DICT['template.hint']={zh:'从 .page-sec 开始填业务；组件直接使用 template.css 类',en:'Start in .page-sec; use template.css classes'};

  function apply(lang){
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n'); if(DICT[k]&&DICT[k][lang]) el.textContent=DICT[k][lang];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var k=el.getAttribute('data-i18n-ph'); if(DICT[k]&&DICT[k][lang]) el.setAttribute('placeholder',DICT[k][lang]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){
      var k=el.getAttribute('data-i18n-title'); if(DICT[k]&&DICT[k][lang]) el.setAttribute('title',DICT[k][lang]);
    });
    document.querySelectorAll('.lang-opt[data-lang]').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-lang')===lang);});
    try{localStorage.setItem('hx-lang',lang);}catch(e){}
  }
  document.querySelectorAll('.lang-opt[data-lang]').forEach(function(el){
    el.addEventListener('click',function(){apply(el.getAttribute('data-lang'));});
  });
  var saved='zh'; try{saved=localStorage.getItem('hx-lang')||'zh';}catch(e){}
  apply(saved);
})();
