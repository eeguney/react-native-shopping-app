import React from 'react';
import {Provider, useDispatch} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {store} from './store/store';
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Basket from './screens/Basket';
import Navigation from './components/Navigation/Navigation';
import Favorites from './screens/Favorites';
import UserPanel from './screens/UserPanel';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import Product from './screens/Product';
import AsyncStorage from '@react-native-community/async-storage';
import {setBasket} from './store/slices/siteSlice';

export default function App() {
  const Stack = createStackNavigator();

  const Tab = createBottomTabNavigator();

  function HomeStack() {
    const dispatch = useDispatch();
    const clearBasket = async () => {
      await AsyncStorage.removeItem('basket');
      dispatch(setBasket([]));
    };

    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={props => <Navigation {...props} />}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Basket"
          component={Basket}
          options={({route, navigation}) => {
            return {
              title: route.params?.title,
              headerStyle: {
                shadowColor: 'transparent',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={tw`p-4 border-r border-gray-100`}
                  onPress={() => navigation.goBack()}>
                  <Icon
                    type="ionicon"
                    name="chevron-back"
                    size={25}
                    color="red"
                  />
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity style={tw`p-4`} onPress={clearBasket}>
                  <Icon type="ionicon" name="trash" size={25} color="red" />
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Tab.Screen
          name="Liked"
          component={Favorites}
          options={({route, navigation}) => {
            return {
              title: route.params?.title,
              headerStyle: {
                shadowColor: 'transparent',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={tw`p-4 border-r border-gray-100`}
                  onPress={() => navigation.goBack()}>
                  <Icon
                    type="ionicon"
                    name="chevron-back"
                    size={25}
                    color="red"
                  />
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Tab.Screen
          name="Profile"
          component={UserPanel}
          options={({route, navigation}) => {
            return {
              title: route.params?.title,
              headerStyle: {
                shadowColor: 'transparent',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={tw`p-4 border-r border-gray-100`}
                  onPress={() => navigation.goBack()}>
                  <Icon
                    type="ionicon"
                    name="chevron-back"
                    size={25}
                    color="red"
                  />
                </TouchableOpacity>
              ),
            };
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="WelcomeScreen"
              component={Welcome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeStack}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProductScreen"
              component={Product}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
