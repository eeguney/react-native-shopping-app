import { ActivityIndicator, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Wrapper from '../components/Wrapper/Wrapper';
import CustomStatusBar from '../components/CustomStatusBar';
import AsyncStorage from '@react-native-community/async-storage';
import tw from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket, selectBasket, setBasket } from '../store/slices/siteSlice';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Icon } from 'react-native-elements';

const Basket = ({ navigation }) => {
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false)
  const [totalprice, settotalprice] = useState(0)
  const [selectedItem, setselectedItem] = useState(null)
  const swipeableRef = useRef(null);
  const basket = useSelector(selectBasket)

  const getBasketFromStorage = async () => {
    try {
      if (basket.length < 1) {
        let basketFromStorage = await AsyncStorage.getItem('basket')
        basketFromStorage = JSON.parse(basketFromStorage)
        let newProduct = [];
        for (const item of basketFromStorage['basket']) {
          let res = await fetch('https://dummyjson.com/products/' + item.id)
          res = await res.json()
          newProduct.push({ product: { ...res, price: item.amount * res.price, amount: item.amount } })
        }
        dispatch(setBasket(newProduct))
      }
    } catch (error) {

    }
  }

  const sumprice = () => {
    let price = 0
    for (const item of basket) {
      price += item.product.price;
    }
    settotalprice(price)
  }

  useEffect(() => {
    setloading(true)
    getBasketFromStorage()
    setloading(false)
    sumprice()
  }, [basket])

  const closeSwipable = () => {
    swipeableRef.current.close()
  }

  const removeItemFromBasket = async () => {
    // storage güncelleme
    let getbasketfromstorage = await AsyncStorage.getItem('basket');
    let obj = JSON.parse(getbasketfromstorage)
    let removedBasket = obj['basket'].filter((item) => item.id !== selectedItem)
    removedBasket = JSON.stringify({ basket: removedBasket })
    await AsyncStorage.setItem(
      'basket',
      removedBasket
    );
    // store güncelleme
    const newBasket = await basket.filter((item) => item['product'].id !== selectedItem)
    dispatch(setBasket(newBasket))
  }

  const updateAmount = async (updatetype) => {
    // storage güncelleme
    let getbasketfromstorage = await AsyncStorage.getItem('basket');
    let obj = JSON.parse(getbasketfromstorage)
    // select current item
    let currentItem = obj['basket'].filter((item) => item.id === selectedItem)
    // decrease amount
    if (updatetype === 'DECREASE' && currentItem[0].amount > 1) {
      currentItem[0].amount--;
    } else if (updatetype === 'INCREASE') {
      currentItem[0].amount++;
    } else {
      removeItemFromBasket()
      return
    }
    // delete old item
    let removefromBasket = obj['basket'].filter((item) => item.id !== selectedItem)
    // update basket with new amount and save to storage
    removefromBasket.push(currentItem[0])
    removefromBasket = JSON.stringify({ basket: removefromBasket })
    await AsyncStorage.setItem(
      'basket',
      removefromBasket
    );
    // store güncelleme
    // store select item
    const selectItemFromStore = await basket.filter((item) => item['product'].id === selectedItem)
    // store decrease amount
    let updatedItemFromStore;
    if (updatetype === 'DECREASE') {
      updatedItemFromStore = { ...selectItemFromStore[0].product, amount: selectItemFromStore[0].product.amount - 1 }
    } else if (updatetype === 'INCREASE') {
      updatedItemFromStore = { ...selectItemFromStore[0].product, amount: selectItemFromStore[0].product.amount + 1 }
    }
    // store delete old item
    const deleteOldItemFromStore = await basket.filter((item) => item['product'].id !== selectedItem)
    dispatch(setBasket(deleteOldItemFromStore))
    dispatch(addToBasket(updatedItemFromStore))
    closeSwipable()
  }


  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View>
        <Animated.View style={[
          {
            transform: [{ translateX: trans }],
          },
          tw`flex-1 bg-white`
        ]}>
          <Pressable
            android_ripple={{ color: '#dddddd', borderless: false, radius: 70 }}
            style={tw`bg-red-600 w-24 flex-1 items-center justify-center`}
            onPress={removeItemFromBasket}
          >
            <Icon
              type="ionicon"
              name="trash"
              size={25}
              color="white"
            />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View>
        <Animated.View style={[
          {
            transform: [{ translateX: trans }],
          },
          tw`flex-1 bg-white flex-row`
        ]}>
          <Pressable
            android_ripple={{ color: '#dddddd', borderless: false, radius: 70 }}
            style={tw`bg-red-600 w-24 items-center justify-center`}
            onPress={() => updateAmount('DECREASE')}
          >
            <Icon
              type="ionicon"
              name="remove"
              size={25}
              color="white"
            />
          </Pressable>
          <Pressable
            android_ripple={{ color: '#dddddd', borderless: false, radius: 70 }}
            style={tw`bg-blue-600 w-24 items-center justify-center`}
            onPress={() => updateAmount('INCREASE')}
          >
            <Icon
              type="ionicon"
              name="add"
              size={25}
              color="white"
            />
          </Pressable>
          <Pressable
            android_ripple={{ color: '#dddddd', borderless: false, radius: 70 }}
            style={tw`bg-black w-24 items-center justify-center`}
            onPress={() => navigation.navigate('ProductScreen', { id: selectedItem })}
          >
            <Icon
              type="ionicon"
              name="search"
              size={25}
              color="white"
            />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <CustomStatusBar backgroundColor="red" barStyle="white-content" />
      <Wrapper header={false}>
        {
          !loading &&
          basket.length > 0 &&
          <View style={tw`py-2 px-4 bg-black flex-row justify-between items-center`}>
            <View style={tw`h-24 flex-row items-center`}>
              <Text style={tw`font-bold text-white text-xs mr-2`}>Total Price:</Text>
              <View style={tw`flex-row`}>
                <Text style={tw`font-bold text-white text-lg mt-1`}>${totalprice}<Text style={tw`text-sm`}>.00</Text></Text>
              </View>
            </View>
            <View style={tw`bg-blue-700 rounded-xl overflow-hidden`}>
              <Pressable android_ripple={{ color: '#dddddd', borderless: false, radius: 70, foreground: true }} style={tw`p-4`}>
                <Text style={tw`text-white`}>Checkout</Text>
              </Pressable>
            </View>
          </View>
        }
        {
          !loading ?
            basket.length > 0 ?
              basket.map((item, index) => (
                <Swipeable key={index} ref={swipeableRef} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions} onSwipeableOpen={() => setselectedItem(item.product.id)}>
                  <View style={tw`flex-row p-4 bg-white border-b border-gray-100 justify-between items-center`}>
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`mr-2 w-6 h-6 bg-blue-500 rounded-full items-center justify-center`}>
                        <Text style={tw`font-bold text-white text-xs`}>{item.product.amount}</Text>
                      </View>
                      <Image
                        source={{
                          uri: item.product.thumbnail,
                        }}
                        resizeMode="stretch"
                        resizeMethod="resize"
                        style={tw`w-16 h-16 mr-4 rounded-full`}
                      />
                      <Text>{item.product.title}</Text>
                    </View>
                    <Text style={tw`font-bold`}>${item.product.price}.00</Text>
                  </View>
                </Swipeable>

              ))
              :
              <View style={tw`flex-row p-4 bg-white border-b border-gray-100 justify-between items-center`}>
                <Text>There is no any item</Text>
              </View>
            :
            <View style={tw`flex-1 h-80 items-center justify-center`}>
              <ActivityIndicator size="large" color="#e7474a" />
            </View>
        }
      </Wrapper>
    </>
  );
};

export default Basket;

const styles = StyleSheet.create({});
