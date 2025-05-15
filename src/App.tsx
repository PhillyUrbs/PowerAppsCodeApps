import React from 'react';
import { Text, Stack } from '@fluentui/react';

import './App.css';

const App: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100vh' } }}>
      <Text variant="xxLarge">Power Platform ❤️ Code</Text>
    </Stack>
  );
};

export default App;
