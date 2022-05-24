import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {Icon} from 'react-native-elements';

const Buttons = {
  HeaderSearchOptions: ({...props}) => (
    <TouchableOpacity
      style={[
        tw`w-12 h-12 bg-white rounded-2xl items-center justify-center ${
          props.search ? 'bg-red-500' : ''
        }`,
        styles.shadow,
      ]}
      {...props}>
      <Icon
        type="ionicon"
        name="options"
        color={props.search ? 'white' : 'black'}
      />
    </TouchableOpacity>
  ),
  HeaderNavigationButton: ({text, active, ...props}) => (
    <View style={tw`overflow-hidden`}>
      <Pressable
        android_ripple={{color: '#dddddd', borderless: false, radius: 30}}
        {...props}>
        <Text
          weight={500}
          style={[
            tw`${
              active
                ? 'px-4 py-2 bg-gray-900 rounded-3xl ml-4 mr-2 shadow-xl text-white'
                : 'px-3 py-2 rounded-2xl text-gray-400'
            } mt-4 mb-4`,
          ]}>
          {text}
        </Text>
      </Pressable>
    </View>
  ),
};

export default Buttons;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 15,
  },
});
