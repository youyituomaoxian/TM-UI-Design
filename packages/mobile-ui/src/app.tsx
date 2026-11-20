import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import '@nutui/nutui-react-taro/dist/style.css';

import './styles/globals.css';
import './styles/components.css';

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.');
  });
  return children;
}

export default App;
