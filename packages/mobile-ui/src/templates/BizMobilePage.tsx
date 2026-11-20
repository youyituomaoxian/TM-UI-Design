/*
 * BizMobilePage — 移动端页起步模板（生成器克隆源）
 * 用法：node packages/mobile-ui/scripts/new-page-mobile.js <PageName>
 * 一切视觉来自 @nutui/nutui-react-taro 真实组件 + globals.css token（var(--*)），
 * 禁止手写 HTML 重搓组件、禁止裸 hex 硬编码色。
 * 开发者在「占位区」按 弘讯移动端design-system/RULES.md §1.1b 覆写文档填充内容
 * （导航栏标题、列表/卡片数据、底部操作）。
 */
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { NavBar, Button } from '@nutui/nutui-react-taro';
import { ArrowLeft, More } from '@nutui/icons-react-taro';
import './index.scss';

export default function BizMobilePage() {
  return (
    <View className="page-page">
      {/* 顶部导航：标题由开发者按页面替换；left 返回（页面栈空时回首页） */}
      <NavBar
        className="page-navbar"
        title="页面标题"
        left={<ArrowLeft onClick={() => Taro.navigateBack()} />}
        right={<More />}
        safeAreaInsetTop
      />

      {/* 内容区（滚动契约）：按 弘讯移动端design-system/RULES.md §1.1b 覆写文档填充真实内容 */}
      <ScrollView className="page-content" scrollY>
        {/*
          TODO: 在此按 弘讯移动端design-system/RULES.md §1.1b 填充页面内容。
          全部使用 NutUI 真实组件 + globals.css token（var(--*)），
          禁止手写 HTML 重搓组件、禁止裸 hex 硬编码色。
        */}
      </ScrollView>

      {/* 底部操作区（可选）：主操作按钮走 NutUI primary token */}
      <View className="page-footer">
        <Button type="primary" block>
          {/*
            TODO: 主操作按钮，按 弘讯移动端design-system/RULES.md §1.1b 填充 onClick。
          */}
          主操作
        </Button>
      </View>
    </View>
  );
}
