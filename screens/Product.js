import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Wrapper from '../components/Wrapper/Wrapper';
import tw from 'tailwind-react-native-classnames';
import ThemeText from '../components/ThemeText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import AsyncStorage from "@react-native-community/async-storage"
import { useDispatch } from 'react-redux';
import { addToBasket, removeFromBasket } from '../store/slices/siteSlice';

const Product = ({ route, navigation }) => {
  const translateAnim = useRef(new Animated.Value(-10)).current;
  const dispatch = useDispatch()
  const [product, setproduct] = useState(null);
  const [amount, setamount] = useState(1);
  const [isBigScroll, setisBigScroll] = useState(false);
  const [scrollOffset, setscrollOffset] = useState(0);

  const { id } = route.params

  const translateUp = () => {
    Animated.timing(translateAnim, {
      toValue: -260,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fetchProduct = async () => {
    setproduct(null)
    let response = await fetch('https://dummyjson.com/products/' + id)
    const products = await response.json()
    setproduct(products)
  }

  useEffect(() => {
    fetchProduct()
  }, []);


  const scrollbegin = (nativeEvent) => {
    if (nativeEvent.contentOffset.y - scrollOffset > 50) {
      translateUp()
      setisBigScroll(true)
    }
    setscrollOffset(nativeEvent.contentOffset.y)
  }

  const amountHandler = (type) => {
    switch (type) {
      case "lower":
        if (amount > 1)
          setamount(amount - 1)
        break;
      case "higher":
        setamount(amount + 1)
      default:
        break;
    }
  }

  const saveBaskettoStorage = async () => {
    try {

      // cihaz storage'si icinde sepettekileri cek
      let basket = await AsyncStorage.getItem('basket');

      // eger sepet bos ise yapıyı oluşturarak yeni urunu sepete ekle
      if (basket === null) {
        basket = { basket: [{ id: product.id, amount }] }
        await AsyncStorage.setItem(
          'basket',
          JSON.stringify(basket)
        );
        dispatch(addToBasket({ ...product, amount }))

      } else {
        let obj = JSON.parse(basket)
        // eger ayni urun sepette varsa urunu guncelle
        if (obj['basket'].some((item) => item.id === product.id)) {
          var sameItemIndex = obj['basket'].findIndex(item => item.id == product.id)
          dispatch(removeFromBasket(sameItemIndex))
          obj['basket'].splice(sameItemIndex, 1); 
        }
        obj['basket'].push({ id: product.id, amount })
        
        basket = JSON.stringify(obj)
        await AsyncStorage.setItem(
          'basket',
          basket
        );

        dispatch(addToBasket({ ...product, amount }))
      }
      navigation.navigate("Basket")
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <Wrapper header={false} mt="0" notscrollable={true}>
      {
        product !== null ?
          <View style={tw`flex-1`}>
            <View style={tw`flex-1 relative -mb-3`}>
              <View style={tw`w-full h-72 relative`}>
                <Image
                  source={{
                    uri: product.thumbnail,
                  }}
                  resizeMethod="resize"
                  style={tw`w-full h-full`}
                />
                <View style={tw`w-14 h-14 rounded-full bg-white shadow-2xl absolute left-4 top-10 justify-center`}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                      type="ionicon"
                      name="chevron-back"
                      size={25}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Animated.View style={[tw`${isBigScroll ? "h-full" : "flex-1"}`, { transform: [{ translateY: translateAnim }] }]}>
                <ScrollView
                  style={[tw`bg-white flex-1 ${isBigScroll && "absolute left-0 bottom-6 h-5/6"} rounded-t-3xl shadow-2xl p-6`,]}
                  showsVerticalScrollIndicator={false}
                  onScroll={({ nativeEvent }) => scrollbegin(nativeEvent)}
                >
                  <View style={tw`pb-10`}>
                    <View style={tw`my-4`}>
                      <ThemeText weight={700} style={tw`text-2xl text-black`}>{product.title}</ThemeText>
                    </View>
                    <ThemeText style={tw`text-gray-500 my-1`}>{product.description}</ThemeText>
                    <View style={tw`flex-row justify-around my-2`}>
                      <Image
                        source={{
                          uri: product.images[0],
                        }}
                        resizeMode="contain"
                        resizeMethod="resize"
                        style={tw`w-24 h-24`}
                      />
                      <Image
                        source={{
                          uri: product.images[1],
                        }}
                        resizeMode="contain"
                        resizeMethod="resize"
                        style={tw`w-24 h-24`}
                      />
                      <Image
                        source={{
                          uri: product.images[2],
                        }}
                        resizeMode="contain"
                        resizeMethod="resize"
                        style={tw`w-24 h-24`}
                      />
                    </View>
                    <ThemeText style={tw`text-gray-500 my-1`}>
                      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                    </ThemeText>

                  </View>

                </ScrollView>
              </Animated.View>
            </View>
            <View style={tw` bg-white border-t border-gray-200 h-24 flex-row items-center justify-between p-6`}>
              <View style={tw`flex-row items-center`}>
                <ThemeText weight={800} style={tw`text-2xl text-gray-800`}>${product.price}</ThemeText>
                <ThemeText weight={600} style={tw`text-gray-800`}>.00</ThemeText>
              </View>
              <View style={tw`flex-row items-center`}>
                <View style={tw`flex-row bg-gray-200 rounded-full`}>
                  <TouchableOpacity style={tw`p-2 w-7 items-center`} onPress={() => amountHandler("lower")}><Text style={tw`font-bold`}>-</Text></TouchableOpacity>
                  <View style={tw`p-2 bg-gray-300 w-7 items-center`}><Text style={tw`font-bold`}>{amount}</Text></View>
                  <TouchableOpacity style={tw`p-2 w-7 items-center`} onPress={() => amountHandler("higher")}><Text style={tw`font-bold`}>+</Text></TouchableOpacity>
                </View>
                <Pressable
                  onPress={saveBaskettoStorage}
                  android_ripple={{ color: '#dddddd' }} style={tw`bg-red-600 items-center px-4 flex-row h-14 rounded-full ml-4`}>
                  <ThemeText weight={600} style={tw`text-white mt-1`}>Buy Now</ThemeText>
                </Pressable>
              </View>
            </View>

          </View>
          :
          <View style={tw`flex-1 h-80 items-center justify-center`}>
            <ActivityIndicator size="large" color="#e7474a" />
          </View>
      }

    </Wrapper>
  );
};

export default Product;

const styles = StyleSheet.create({});
