import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Cell, CellGroup, Switch, Tag, Avatar, Input, SearchBar } from '@nutui/nutui-react-taro';
import { StarFill } from '@nutui/icons-react-taro';
import './index.scss';

export default function Index() {
  const [checked, setChecked] = useState(true);
  const [val, setVal] = useState('');
  const [inputVal, setInputVal] = useState('');

  return (
    <View className="demo-page">
      <View className="demo-section">
        <Text className="demo-title">按钮 Button</Text>
        <Button type="primary" block>
          主按钮
        </Button>
        <Button type="default" block>
          次按钮
        </Button>
      </View>

      <View className="demo-section">
        <Text className="demo-title">标签 Tag</Text>
        <Tag type="primary">主色</Tag>
        <Tag type="success">成功</Tag>
        <Tag type="warning">警示</Tag>
        <Tag type="danger">错误</Tag>
      </View>

      <View className="demo-section">
        <Text className="demo-title">开关 Switch</Text>
        <Switch checked={checked} onChange={(v) => setChecked(Boolean(v))} />
      </View>

      <View className="demo-section">
        <Text className="demo-title">头像 / 图标</Text>
        <Avatar size="large">TX</Avatar>
        <StarFill />
      </View>

      <View className="demo-section">
        <Text className="demo-title">输入 / 搜索</Text>
        <SearchBar value={val} onChange={(v) => setVal(v ?? '')} placeholder="搜索设备" />
        <Input value={inputVal} placeholder="单行输入" onChange={(v) => setInputVal(v ?? '')} />
      </View>

      <View className="demo-section">
        <Text className="demo-title">列表 Cell</Text>
        <CellGroup>
          <Cell title="设备状态" description="运行中" />
          <Cell title="告警数" description="3" />
        </CellGroup>
      </View>
    </View>
  );
}
