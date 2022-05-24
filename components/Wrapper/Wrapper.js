import React, {useRef} from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import {setSearchText, toggleSearch} from '../../store/slices/siteSlice';
import Header from '../Header/Header';

const Wrapper = ({children, header, mt, notscrollable}) => {
  const translateAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const translateUp = () => {
    Animated.timing(translateAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start();
    dispatch(toggleSearch());
  };
  const translateDown = () => {
    Animated.timing(translateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    dispatch(toggleSearch());
    dispatch(setSearchText(''));
  };
  return (
    <View
      style={tw`flex-1 bg-gray-100 ${
        typeof mt !== 'undefined' ? `mt-${mt}` : ''
      }`}>
      {notscrollable ? (
        <Animated.View
          style={{transform: [{translateY: translateAnim}], flex: 1}}>
          {children}
        </Animated.View>
      ) : (
        <ScrollView
          style={tw`flex-1`}
          vertical
          showsVerticalScrollIndicator={false}>
          {header && (
            <Header
              translateAnim={translateAnim}
              translateUp={translateUp}
              translateDown={translateDown}
            />
          )}
          <Animated.View style={{transform: [{translateY: translateAnim}]}}>
            {children}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default Wrapper;
