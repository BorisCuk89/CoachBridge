import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store/store';
import AppNavigator from '../src/navigation/AppNavigator';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
