import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'tailwind-react-native-classnames';
import {useDispatch, useSelector} from 'react-redux';
import {
  addtoLiked,
  selectActiveCategory,
  selectLiked,
  selectSearchText,
  setLiked,
} from '../../store/slices/siteSlice';
import CategoryTab from '../CategoryTab/CategoryTab';
import AsyncStorage from '@react-native-community/async-storage';
import {store} from '../../store/store';

const ProductList = () => {
  const dispatch = useDispatch;
  const [products, setproducts] = useState([]);
  const activeCategory = useSelector(selectActiveCategory);
  const likedList = useSelector(selectLiked);
  const searchQuery = useSelector(selectSearchText);

  const fetchProductList = async () => {
    let req;
    if (activeCategory === 0 && searchQuery === '') {
      req = 'https://dummyjson.com/products';
    } else if (activeCategory === 0 && searchQuery !== '') {
      req = 'https://dummyjson.com/products/search?q=' + searchQuery;
    } else {
      req = 'https://dummyjson.com/products/category/' + activeCategory;
    }

    const response = await fetch(req);
    const fetchedproducts = await response.json();
    setproducts(fetchedproducts.products);
  };

  useEffect(() => {
    setproducts([]);
    fetchProductList();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    getLikedFromStorage();
  }, []);

  const getLikedFromStorage = async () => {
    try {
      if (likedList.length < 1) {
        let likedFromStorage = await AsyncStorage.getItem('liked');
        likedFromStorage = JSON.parse(likedFromStorage);
        if (likedFromStorage === null) {
          await AsyncStorage.setItem('liked', JSON.stringify([]));
        }
        dispatch(setLiked({...likedFromStorage} ?? []));
      }
    } catch (error) {}
  };

  const toggleLikedItem = async id => {
    try {
      let likedFromStorage = await AsyncStorage.getItem('liked');
      likedFromStorage = JSON.parse(likedFromStorage);

      if (likedFromStorage.length < 1) {
        const liked = {id: id};
        await AsyncStorage.setItem('liked', JSON.stringify([liked]));
        store.dispatch(addtoLiked(liked));
      } else {
        if (likedList.some(item => item.id === id)) {
          var newLikedItems = likedList.filter(item => item.id !== id);

          store.dispatch(setLiked(newLikedItems));
          await AsyncStorage.setItem('liked', JSON.stringify(newLikedItems));
        } else {
          store.dispatch(addtoLiked({id: id}));
          await AsyncStorage.setItem('liked', JSON.stringify(likedList));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`p-4 pt-0`}>
      <CategoryTab products={products} toggleLikedItem={toggleLikedItem} />
    </View>
  );
};

export default ProductList;
