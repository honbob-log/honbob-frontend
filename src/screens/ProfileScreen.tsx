"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Alert, Switch } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  const userProfile = {
    name: "홍길동",
    email: "hong@example.com",
    profileImage: "https://via.placeholder.com/100x100",
    bio: "맛있는 요리를 사랑하는 홈쿡입니다 🍳",
    joinDate: "2024.01.01",
    stats: {
      recipes: 12,
      followers: 156,
      following: 89,
    },
  }

  const myRecipes = [
    {
      id: 1,
      title: "간단 계란볶음밥",
      image: "https://via.placeholder.com/150x150",
      likes: 24,
      views: 156,
    },
    {
      id: 2,
      title: "매콤 떡볶이",
      image: "https://via.placeholder.com/150x150",
      likes: 18,
      views: 89,
    },
    {
      id: 3,
      title: "치즈 라면",
      image: "https://via.placeholder.com/150x150",
      likes: 31,
      views: 203,
    },
  ]

  const menuItems = [
    { icon: "edit-3", title: "프로필 편집", onPress: () => console.log("프로필 편집") },
    { icon: "book-open", title: "내 레시피", onPress: () => console.log("내 레시피") },
    { icon: "heart", title: "즐겨찾기", onPress: () => navigation.navigate("Favorites") },
    { icon: "shopping-cart", title: "식재료 관리", onPress: () => navigation.navigate("Pantry") },
    { icon: "star", title: "내 리뷰", onPress: () => console.log("내 리뷰") },
    { icon: "settings", title: "설정", onPress: () => console.log("설정") },
    { icon: "help-circle", title: "고객센터", onPress: () => console.log("고객센터") },
    { icon: "info", title: "앱 정보", onPress: () => console.log("앱 정보") },
  ]

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: () => navigation.navigate("Login") },
    ])
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="내 정보"
        rightElement={
          <TouchableOpacity onPress={() => console.log("설정")}>
            <Icon name="settings" size={24} color="#333" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          <Text style={styles.userBio}>{userProfile.bio}</Text>
          <Text style={styles.joinDate}>가입일: {userProfile.joinDate}</Text>

          {/* 통계 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.recipes}</Text>
              <Text style={styles.statLabel}>레시피</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.followers}</Text>
              <Text style={styles.statLabel}>팔로워</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.following}</Text>
              <Text style={styles.statLabel}>팔로잉</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        {/* 내 레시피 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 레시피</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>전체보기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeList}>
            {myRecipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeStats}>
                  <View style={styles.recipeStat}>
                    <Icon name="heart" size={12} color="#ff8a3d" />
                    <Text style={styles.recipeStatText}>{recipe.likes}</Text>
                  </View>
                  <View style={styles.recipeStat}>
                    <Icon name="eye" size={12} color="#999" />
                    <Text style={styles.recipeStatText}>{recipe.views}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 메뉴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메뉴</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuLeft}>
                  <Icon name={item.icon} size={20} color="#666" />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Icon name="bell" size={20} color="#666" />
                <Text style={styles.menuText}>푸시 알림</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#ccc", true: "#ff8a3d" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Icon name="mail" size={20} color="#666" />
                <Text style={styles.menuText}>이메일 알림</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: "#ccc", true: "#ff8a3d" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* 로그아웃 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out" size={20} color="#ff4444" />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff8a3d",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#e0e0e0",
  },
  editProfileButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#ff8a3d",
    fontWeight: "500",
  },
  recipeList: {
    paddingVertical: 8,
  },
  recipeCard: {
    width: 120,
    marginRight: 16,
  },
  recipeImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recipeStats: {
    flexDirection: "row",
    gap: 8,
  },
  recipeStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeStatText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default ProfileScreen
