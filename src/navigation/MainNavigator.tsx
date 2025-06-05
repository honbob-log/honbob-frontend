import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type { RootStackParamList } from "./types"
import TabNavigator from "./TabNavigator"
import RecipeDetailScreen from "../screens/RecipeDetailScreen"
import CreateRecipeScreen from "../screens/CreateRecipeScreen"
import LoginScreen from "../screens/LoginScreen"
import OnboardingScreen from "../screens/OnboardingScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, ActivityIndicator } from "react-native"

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainNavigator = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isNewMember, setIsNewMember] = useState<boolean>(false)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const tokens = await AsyncStorage.multiGet([
                "accessToken",
                "refreshToken",
                "isNewMember"
            ])

            const accessToken = tokens[0][1]
            const refreshToken = tokens[1][1]
            const isNewMember = tokens[2][1]

            console.log("Auth Status:", {
                accessToken: !!accessToken,
                refreshToken: !!refreshToken,
                isNewMember
            })

            const isAuth = !!accessToken && !!refreshToken
            setIsAuthenticated(isAuth)
            setIsNewMember(isAuth && isNewMember !== "false")

        } catch (error) {
            console.error("인증 상태 확인 중 오류:", error)
            setIsAuthenticated(false)
            setIsNewMember(false)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#ff8a3d" />
            </View>
        )
    }

    const initialRouteName = !isAuthenticated
        ? "Login"
        : isNewMember
            ? "Onboarding"
            : "Tabs"

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    animationTypeForReplace: !isAuthenticated ? 'pop' : 'push'
                }}
            />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
            <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
        </Stack.Navigator>
    )
}

export default MainNavigator 