import {
  ImageBackground,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import tw from 'tailwind-react-native-classnames';
import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 2500);
  }, [navigation]);

  return (
    <ImageBackground
      source={{uri: 'https://i.ibb.co/6nfMFCR/i-Phone-13-13-Pro-1.png'}}
      resizeMode="stretch"
      style={{height: '100%', width: '100%'}}>
      <StatusBar hidden />
      <View style={tw`flex-1 justify-center items-center relative`}>
        <View style={[tw`w-44 h-44 rounded-full shadow-lg bg-black`]} />
        <View style={tw`flex-1 absolute`}>
          <Text
            style={[
              tw`text-white`,
              {elevation: 601, fontSize: 43, fontFamily: 'Poppins-Light'},
            ]}>
            Shopping
          </Text>
          <View style={tw`absolute top-36 left-0 w-full`}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Welcome;
