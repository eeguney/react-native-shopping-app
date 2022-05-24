import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../components/Wrapper/Wrapper';
import {useDispatch, useSelector} from 'react-redux';
import {selectLiked, setLiked} from '../store/slices/siteSlice';
import tw from 'tailwind-react-native-classnames';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

const Favorites = ({navigation}) => {
  const dispatch = useDispatch();
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setloading] = useState(false);
  let likedList = useSelector(selectLiked);
  const [selectedItem, setselectedItem] = useState(null);
  const swipeableRef = useRef(null);

  const getLiked = async () => {
    try {
      const newLikedItems = [];
      if (likedList.length < 1) likedList = [];
      for (const item of likedList) {
        let res = await fetch('https://dummyjson.com/products/' + item.id);
        res = await res.json();
        newLikedItems.push(res);
      }
      setLikedItems(newLikedItems);
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemFromLiked = async () => {
    // storage güncelleme
    let getlikedfromstorage = await AsyncStorage.getItem('liked');
    let obj = JSON.parse(getlikedfromstorage);
    let removedLiked = obj.filter(item => item.id !== selectedItem);
    removedLiked = JSON.stringify(removedLiked);
    await AsyncStorage.setItem('liked', removedLiked);
    // store güncelleme
    const newLiked = await likedList.filter(item => item.id !== selectedItem);
    console.log(newLiked);
    dispatch(setLiked(newLiked));
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View>
        <Animated.View
          style={[
            {
              transform: [{translateX: trans}],
            },
            tw`flex-1 bg-white`,
          ]}>
          <Pressable
            android_ripple={{color: '#dddddd', borderless: false, radius: 70}}
            style={tw`bg-red-600 w-24 flex-1 items-center justify-center`}
            onPress={removeItemFromLiked}>
            <Icon type="ionicon" name="trash" size={25} color="white" />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  useEffect(() => {
    setloading(true);
    getLiked();
    setloading(false);
  }, [likedList]);

  return (
    <Wrapper header={false}>
      {!loading ? (
        likedItems.length > 0 ? (
          likedItems.map((item, index) => (
            <Swipeable
              key={index}
              ref={swipeableRef}
              renderLeftActions={renderLeftActions}
              onSwipeableOpen={() => setselectedItem(item.id)}>
              <Pressable
                android_ripple={{color: '#dddddd'}}
                style={tw`flex-row p-4 bg-white border-b border-gray-100 justify-between items-center`}
                onPress={() =>
                  navigation.navigate('ProductScreen', {id: item.id})
                }>
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={{
                      uri: item.thumbnail,
                    }}
                    resizeMode="stretch"
                    resizeMethod="resize"
                    style={tw`w-16 h-16 mr-4 rounded-full`}
                  />
                  <Text>{item.title}</Text>
                </View>
                <Text style={tw`font-bold`}>${item.price}.00</Text>
              </Pressable>
            </Swipeable>
          ))
        ) : (
          <View
            style={tw`flex-row p-4 bg-white border-b border-gray-100 justify-between items-center`}>
            <Text>There is no any item</Text>
          </View>
        )
      ) : (
        <View style={tw`flex-1 h-80 items-center justify-center`}>
          <ActivityIndicator size="large" color="#e7474a" />
        </View>
      )}
    </Wrapper>
  );
};

export default Favorites;

const styles = StyleSheet.create({});
