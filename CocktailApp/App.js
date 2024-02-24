import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 



function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hommmme Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 89,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}



function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId, otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MainHomeScreen() {
  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <>
      <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Désactiver l'affichage du header
      />
        <Stack.Screen name="Details" component={DetailsScreen}  initialParams={{ itemId: 42 }}/>
      </Stack.Navigator>
      </>
    /* </View> */  );
}

function CategoryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>category!</Text>
    </View>
  );
}

function FavoritesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Favorites!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
            screenOptions={({ route}) => ({
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'MainHome') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Category') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'favorites') {
                  iconName = focused ? 'heart' : 'heart-outline';
                }
    
                return <Ionicons name={iconName} size={size} color={color} />;
              },
    
            })}
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}
      >
        <Tab.Screen name="MainHome" component={MainHomeScreen}  options={{ title: 'My home' }}/>
        <Tab.Screen name="Category" component={CategoryScreen} options={{ title: 'Category' }} />
        <Tab.Screen name="favorites" component={FavoritesScreen} options={{ title: 'favorites' }} />
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
