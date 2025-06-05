import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import Icon from "react-native-vector-icons/Feather"
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native"
import type { RootStackParamList } from "./types"
import type { NavigationProp } from "@react-navigation/native"

const Tab = createBottomTabNavigator()

function FloatingWriteButton({ children }) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    return (
        <TouchableOpacity
            style={styles.fabContainer}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("CreateRecipe")}
        >
            <View style={styles.fab}>{children}</View>
        </TouchableOpacity>
    )
}

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size, focused }) => {
                if (route.name === "Write") {
                    return <Icon name="plus" size={32} color="#fff" />
                }
                let iconName = "home"
                if (route.name === "Home") iconName = "home"
                else if (route.name === "Profile") iconName = "user"
                return <Icon name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: "#ff8a3d",
            tabBarInactiveTintColor: "#999",
            headerShown: false,
            tabBarShowLabel: route.name !== "Write",
            tabBarStyle: {
                height: Platform.OS === "ios" ? 80 : 64,
                paddingBottom: Platform.OS === "ios" ? 24 : 10,
                paddingTop: 8,
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: "홈" }} />
        <Tab.Screen
            name="Write"
            component={HomeScreen} // 더미 컴포넌트로 HomeScreen 사용
            options={{
                title: "",
                tabBarButton: (props) => <FloatingWriteButton {...props} />,
            }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "마이페이지" }} />
    </Tab.Navigator>
)

const styles = StyleSheet.create({
    fabContainer: {
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#ff8a3d",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
})

export default TabNavigator 