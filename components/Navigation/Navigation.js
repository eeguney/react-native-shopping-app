import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import ThemeText from '../ThemeText';
import {useSelector} from 'react-redux';
import {selectBasket, selectLiked} from '../../store/slices/siteSlice';

const Navigation = ({state, descriptors, navigation}) => {
  let basket = useSelector(selectBasket);
  let liked = useSelector(selectLiked);

  return (
    <View
      style={[
        tw`bg-white w-full h-20 shadow-2xl px-2 flex-row justify-around`,
        styles.shadow,
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return label === 'Home' ? (
          <Pressable
            android_ripple={{color: '#dddddd'}}
            key={label}
            onPress={onPress}>
            <View
              style={[
                tw`w-20 h-20 p-3 rounded-full bg-white`,
                isFocused && {transform: [{translateY: -30}]},
              ]}>
              <Icon
                type="ionicon"
                name="home"
                color={isFocused ? 'white' : '#999'}
                size={28}
                style={tw`w-full h-full rounded-full items-center justify-center ${
                  isFocused ? 'bg-red-600 ' : 'bg-white'
                }`}
              />
              <ThemeText weight={800} style={tw`text-center mt-2 text-red-500`}>
                {label}
              </ThemeText>
            </View>
          </Pressable>
        ) : (
          <Pressable
            android_ripple={{color: '#dddddd'}}
            onPress={onPress}
            key={label}>
            <View
              style={[
                tw`w-20 h-20 p-3 rounded-full bg-white`,
                isFocused && {transform: [{translateY: -30}]},
              ]}>
              {label === 'Basket' && (
                <View style={tw`relative`}>
                  {basket.length > 0 && (
                    <View
                      style={tw`absolute w-5 h-5 rounded-full bg-green-600 top-0 right-0 z-10 items-center justify-center`}>
                      <Text style={tw`text-white text-xs font-bold`}>
                        {basket.length}
                      </Text>
                    </View>
                  )}
                  <Icon
                    type="ionicon"
                    name="basket"
                    size={35}
                    color={isFocused ? 'white' : '#999'}
                    style={tw`w-full h-full rounded-full items-center justify-center ${
                      isFocused ? 'bg-red-600 ' : 'bg-white'
                    }`}
                  />
                </View>
              )}
              {label === 'Liked' && (
                <View style={tw`relative`}>
                  {liked.length > 0 && (
                    <View
                      style={tw`absolute w-5 h-5 rounded-full bg-green-600 top-0 right-0 z-10 items-center justify-center`}>
                      <Text style={tw`text-white text-xs font-bold`}>
                        {liked.length}
                      </Text>
                    </View>
                  )}
                  <Icon
                    type="ionicon"
                    name="heart"
                    size={30}
                    color={isFocused ? 'white' : '#999'}
                    style={tw`w-full h-full rounded-full items-center justify-center ${
                      isFocused ? 'bg-red-600 ' : 'bg-white'
                    }`}
                  />
                </View>
              )}
              {label === 'Profile' && (
                <Icon
                  type="ionicon"
                  name="person"
                  size={30}
                  color={isFocused ? 'white' : '#999'}
                  style={tw`w-full h-full rounded-full items-center justify-center ${
                    isFocused ? 'bg-red-600 ' : 'bg-white'
                  }`}
                />
              )}
              <ThemeText weight={800} style={tw`text-center mt-2 text-red-500`}>
                {label}
              </ThemeText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {width: 10, height: -20},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 20,
  },
});
