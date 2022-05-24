import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const CustomStatusBar = ({backgroundColor, ...props}) => (
  <View>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

export default CustomStatusBar;
