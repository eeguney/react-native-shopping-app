import React from 'react';
import CustomStatusBar from '../components/CustomStatusBar';
import ProductList from '../components/Products/ProductList';
import Wrapper from '../components/Wrapper/Wrapper';

const Home = () => {
  return (
    <>
      <CustomStatusBar backgroundColor="red" barStyle="white-content" />
      <Wrapper header={true} notscrollable={false}>
        <ProductList />
      </Wrapper>
    </>
  );
};

export default Home;
