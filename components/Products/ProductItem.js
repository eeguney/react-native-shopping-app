import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import ThemeText from '../ThemeText';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectLiked } from '../../store/slices/siteSlice';

const ProductItem = ({ data, toggleLikedItem, ...props }) => {
  const likedList = useSelector(selectLiked)
  return (
    <Pressable
      android_ripple={{ color: '#dddddd' }}
      style={[tw`flex-1 p-3 flex-row bg-white rounded-3xl mb-6 shadow-xl`]}
      {...props}>
      <View style={tw`relative`}>
        <Image
          source={{
            uri: data.thumbnail,
          }}
          resizeMode="contain"
          resizeMethod="resize"
          style={tw`w-32 h-36 rounded-3xl mr-4`}
        />
        <TouchableOpacity
          style={tw`bg-white rounded-full w-6 h-6 bg-white absolute top-3 right-7 justify-center shadow-2xl`}
          onPress={async () => await toggleLikedItem(data.id)}
        >
          <Icon type="ionicon" name="heart" color={likedList.some((item) => item.id === data.id) ? "red" : "#999"} size={13} />
        </TouchableOpacity>
      </View>
      <View style={tw`justify-center flex-1`}>
        <ThemeText weight={600} style={tw`text-gray-700 text-lg mb-0.5`}>
          {data.title.substring(0, 12)}...
        </ThemeText>
        <ThemeText style={tw`text-gray-500 text-xs`}>
          By <ThemeText weight={600}>{data.brand}</ThemeText>
        </ThemeText>
        <ThemeText style={tw`text-xs mt-2 leading-5`}>
          {data.description.substring(0, 50)}...
        </ThemeText>
        <View style={tw`flex-row justify-between items-center mt-2`}>
          <ThemeText weight={700} style={tw`text-lg -mb-0.5 text-black`}>
            ${data.price}
          </ThemeText>
          <View
            style={tw`bg-red-500 py-1.5 px-4 rounded-2xl shadow-lg`}>
            <ThemeText weight={600} style={tw`text-white text-sm`}>
              Buy
            </ThemeText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductItem;
