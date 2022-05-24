import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Animated,
  Pressable,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {Icon} from 'react-native-elements';
import React, {memo, useEffect, useState} from 'react';
import ThemeText from '../ThemeText';
import Buttons from '../Buttons/Buttons';
import {useDispatch, useSelector} from 'react-redux';
import {
  categoryHandler,
  selectSearch,
  selectSearchText,
  setSearchText,
} from '../../store/slices/siteSlice';
import {selectActiveCategory} from '../../store/slices/siteSlice';

const Header = memo(({translateAnim, translateDown, translateUp}) => {
  const activeCategory = useSelector(selectActiveCategory);
  const searchQuery = useSelector(selectSearchText);
  const search = useSelector(selectSearch);
  const dispatch = useDispatch();
  const [categories, setcategories] = useState([]);

  const fetchCategories = async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    const fetchedcategories = await response.json();
    setcategories(fetchedcategories);
  };

  useEffect(() => {
    fetchCategories();
  }, [activeCategory]);

  const searchQueryHandler = query => {
    dispatch(setSearchText(query));
  };

  return (
    <Animated.View
      style={[
        tw`w-full flex-1 pt-14 mb-2`,
        {transform: [{translateY: translateAnim}]},
      ]}>
      <View style={tw`mb-6 px-4`}>
        <ThemeText style={tw`text-3xl text-gray-800 mb-1`} weight={700}>
          Shopping
        </ThemeText>
        <ThemeText style={tw`text-gray-800`}>Perfect Choice!</ThemeText>
      </View>
      <View style={tw`flex-row mb-3 px-4`}>
        <View
          style={[
            tw`rounded-2xl bg-white pl-4 h-12 flex-1 flex-row mr-3 items-center ${
              search ? 'bg-red-500' : ''
            }`,
            styles.shadow,
          ]}>
          <Icon
            type="ionicon"
            name="search"
            color={search ? 'white' : '#333'}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={search ? 'white' : '#999'}
            onTouchStart={translateUp}
            onChangeText={searchQueryHandler}
            value={searchQuery}
            style={[tw`flex-1 px-3`]}
          />
          {search && (
            <Pressable
              android_ripple={{color: '#dddddd'}}
              style={tw`h-12 w-12 items-center justify-center`}
              onPress={translateDown}>
              <Icon
                type="ionicon"
                name="close"
                color={search ? 'white' : '#333'}
              />
            </Pressable>
          )}
        </View>
        <Buttons.HeaderSearchOptions search={search} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Buttons.HeaderNavigationButton
          text="All"
          onPress={() => dispatch(categoryHandler(0))}
          active={activeCategory === 0}
        />
        {categories.map((item, index) => (
          <Buttons.HeaderNavigationButton
            key={index}
            text={item}
            onPress={() => dispatch(categoryHandler(item))}
            active={activeCategory === item}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
});

export default Header;

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'red',
    shadowOpacity: 0.2,
    elevation: 15,
  },
});
