import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Text, View, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';



const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';


function HomeScreen({ navigation }) {
  const [cocktails, setCocktails] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedCocktails, setLikedCocktails] = useState([]);


  useEffect(() => {
    fetchCocktails();
  }, []);

  const fetchCocktails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a&page=${page}`);
      const newCocktails = response.data.drinks || [];
      setCocktails(prevCocktails => [...prevCocktails, ...newCocktails]);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
    setLoading(false);
  };

  const handleCocktailPress = (id) => {
    navigation.navigate('Details', { cocktailId: id });
  };

  // Fonction pour gérer les clics sur l'icône de cœur
  const toggleLike = (cocktailId) => {
    if (likedCocktails.includes(cocktailId)) {
      setLikedCocktails(likedCocktails.filter((id) => id !== cocktailId));
    } else {
      setLikedCocktails([...likedCocktails, cocktailId]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCocktailPress(item.idDrink)}>
      <View style={styles.item}>
        <Image style={styles.image} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.title}>{item.strDrink}</Text>
        <TouchableOpacity onPress={() => toggleLike(item.idDrink)}>
          <Ionicons
            name={likedCocktails.includes(item.idDrink) ? 'heart' : 'heart-outline'}
            size={24}
            color={likedCocktails.includes(item.idDrink) ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <FlatList
      data={cocktails}
      renderItem={renderItem}
      keyExtractor={(item) => item.idDrink}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading && <Text>Loading...</Text>}
    />
  );
}


const getIngredientsList = (cocktailDetails) => {
  const ingredientsList = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktailDetails['strIngredient' + i];
    const measure = cocktailDetails['strMeasure' + i];
    if (ingredient) {
      const ingredientWithMeasure = measure ? `${measure} ${ingredient}` : ingredient;
      ingredientsList.push(ingredientWithMeasure);
    } else {
      break; // No more ingredients
    }
  }
  return ingredientsList;
};

function DetailsScreen({ route, navigation }) {
  const [cocktailDetails, setCocktailDetails] = useState(null);

  useEffect(() => {
    const { cocktailId } = route.params;
    const fetchCocktailDetails = async () => {
      try {
        const response = await axios.get(API_URL + cocktailId);
        setCocktailDetails(response.data.drinks[0]); 
      } catch (error) {
        console.error('Error fetching cocktail details:', error);
      }
    };

    fetchCocktailDetails();
  }, [route.params]);

  if (!cocktailDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: cocktailDetails.strDrinkThumb }} style={{ width: 200, height: 200, marginBottom: 20 }} />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{cocktailDetails.strDrink}</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>{cocktailDetails.strInstructions}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Ingredients:</Text>
      <FlatList
        data={getIngredientsList(cocktailDetails)}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item) => item}
      />
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

function CategoryScreen({ navigation }) {
  const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cocktails, setCocktails] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL + 'list.php?c=list');
      setCategories(response.data.drinks || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCocktailsByCategory = async (category) => {
    try {
      const response = await axios.get(API_URL + 'filter.php?c=' + category);
      setCocktails(response.data.drinks || []);
    } catch (error) {
      console.error('Error fetching cocktails by category:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchCocktailsByCategory(category);
  };

  const handleCocktailPress = (id) => {
    navigation.navigate('Details', { cocktailId: id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCocktailPress(item.idDrink)}>
      <View style={styles.item}>
        <Image style={styles.image} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.title}>{item.strDrink}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => handleCategoryChange(itemValue)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category.strCategory} value={category.strCategory} />
        ))}
      </Picker>
      <FlatList
        data={cocktails}
        renderItem={renderItem}
        keyExtractor={(item) => item.idDrink}
      />
    </View>
  );
}

function FavoritesScreen({ likedCocktails, handleCocktailPress }) {
  const [favorites, setFavorites] = useState(likedCocktails); // Initialisez l'état favorites avec likedCocktails

  // Fonction pour gérer le clic sur le bouton de suppression du cocktail des favoris
  const handleRemoveFavorite = (cocktailId) => {
    const updatedFavorites = favorites.filter((item) => item.idDrink !== cocktailId);
    setFavorites(updatedFavorites);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCocktailPress(item.idDrink)}>
      <View style={styles.item}>
        <Image style={styles.image} source={{ uri: item.strDrinkThumb }} />
        <Text style={styles.title}>{item.strDrink}</Text>
        <TouchableOpacity onPress={() => handleRemoveFavorite(item.idDrink)}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.idDrink}
        contentContainerStyle={{ flexGrow: 1 }}
      />
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
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  title: {
    fontSize: 16,
  },
});
