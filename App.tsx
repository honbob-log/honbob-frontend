import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/navigation/types';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PantryScreen from './src/screens/PantryScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import CreateRecipeScreen from './src/screens/CreateRecipeScreen';
// 필요하다면 ReviewScreen, MainScreen, SearchScreen 등도 import

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="Pantry" component={PantryScreen} />
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
                <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
                {/* 필요하다면 아래에 추가 스크린 등록 */}
                {/* <Stack.Screen name="Review" component={ReviewScreen} /> */}
                {/* <Stack.Screen name="Main" component={MainScreen} /> */}
                {/* <Stack.Screen name="Search" component={SearchScreen} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
} 