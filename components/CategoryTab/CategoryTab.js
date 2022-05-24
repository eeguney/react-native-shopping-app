import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import ProductItem from '../Products/ProductItem';


const CategoryTab = ({ toggleLikedItem, products }) => {
  const navigation = useNavigation();
  return products.length > 0 ? (
    products.map((product, index) => (
      <View
        key={index}
      >
        <ProductItem
          data={product}
          toggleLikedItem={toggleLikedItem}
          onPress={() => navigation.navigate('ProductScreen', { id: product.id })}
        />
      </View>
    ))
  ) : (
    <View style={tw`flex-1 h-80 items-center justify-center`}>
      <ActivityIndicator size="large" color="#e7474a" />
    </View>
  );
};


export default CategoryTab