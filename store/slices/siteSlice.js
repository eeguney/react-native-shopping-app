import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  search: false,
  activeCategory: 0,
  basket: [],
  liked: [],
  searchText: '',
};

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    toggleSearch: state => {
      state.search = !state.search;
    },
    categoryHandler: (state, action) => {
      state.activeCategory = action.payload;
    },
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    addToBasket: (state, action) => {
      let newProduct = state.basket;
      newProduct.push({
        product: {
          ...action.payload,
          price: action.payload.amount * action.payload.price,
        },
      });
      state.basket = newProduct;
    },
    removeFromBasket: (state, action) => {
      let newProduct = state.basket;
      newProduct.splice(action.payload, 1);
      state.basket = newProduct;
    },
    addtoLiked: (state, action) => {
      const newLiked = state.liked;
      newLiked.push(action.payload);
      state.liked = newLiked;
    },

    setLiked: (state, action) => {
      state.liked = action.payload;
    },

    removeFromLiked: (state, action) => {
      let newLiked = state.liked;
      newLiked.splice(action.payload, 1);
      state.liked = newLiked;
    },

    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
});

export const {
  toggleSearch,
  categoryHandler,
  setBasket,
  addToBasket,
  removeFromBasket,
  addtoLiked,
  setLiked,
  removeFromLiked,
  setSearchText,
} = siteSlice.actions;

export const selectSearch = state => state.site.search;
export const selectActiveCategory = state => state.site.activeCategory;
export const selectBasket = state => state.site.basket;
export const selectLiked = state => state.site.liked;
export const selectSearchText = state => state.site.searchText;

export default siteSlice.reducer;
