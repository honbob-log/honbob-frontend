"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const FavoritesScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [activeTab, setActiveTab] = useState("recipes")

  const favoriteRecipes = [
    {
      id: 1,
      title: "매콤한 김치찌개",
      image: "https://via.placeholder.com/300x200",
      time: "30분",
      rating: 4.8,
      difficulty: "쉬움",
      author: "요리왕김치",
      savedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "고소한 된장찌개",
      image: "https://via.placeholder.com/300x200",
      time: "25분",
      rating: 4.7,
      difficulty: "보통",
      author: "전통요리사",
      savedDate: "2024-01-14",
    },
    {
      id: 3,
      title: "크림 파스타",
      image: "https://via.placeholder.com/300x200",
      time: "20분",
      rating: 4.6,
      difficulty: "보통",
      author: "이탈리안셰프",
      savedDate: "2024-01-13",
    },
  ]

  const favoriteChefs = [
    {
      id: 1,
      name: "요리왕김치",
      profileImage: "https://via.placeholder.com/60x60",
      followers: "12.5K",
      recipes: 45,
      specialty: "한식 전문",
    },
    {
      id: 2,
      name: "이탈리안셰프",
      profileImage: "https://via.placeholder.com/60x60",
      followers: "8.2K",
      recipes: 32,
      specialty: "양식 전문",
    },
  ]

  const renderRecipeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeAuthor}>by {item.author}</Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Icon name="clock" size={12} color="#999" />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="star" size={12} color="#ff8a3d" />
            <Text style={styles.metaText}>{item.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="trending-up" size={12} color="#999" />
            <Text style={styles.metaText}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.savedDate}>저장일: {item.savedDate}</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="heart" size={20} color="#ff0000" fill="#ff0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderChefItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chefCard}>
      <Image source={{ uri: item.profileImage }} style={styles.chefImage} />
      <View style={styles.chefInfo}>
        <Text style={styles.chefName}>{item.name}</Text>
        <Text style={styles.chefSpecialty}>{item.specialty}</Text>
        <View style={styles.chefStats}>
          <Text style={styles.chefStat}>팔로워 {item.followers}</Text>
          <Text style={styles.chefStat}>레시피 {item.recipes}개</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>팔로잉</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TopBar title="즐겨찾기" />

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "recipes" && styles.activeTab]}
          onPress={() => setActiveTab("recipes")}
        >
          <Text style={[styles.tabText, activeTab === "recipes" && styles.activeTabText]}>레시피</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "chefs" && styles.activeTab]}
          onPress={() => setActiveTab("chefs")}
        >
          <Text style={[styles.tabText, activeTab === "chefs" && styles.activeTabText]}>셰프</Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <View style={styles.content}>
        {activeTab === "recipes" && (
          <View style={styles.tabContent}>
            <View style={styles.header}>
              <Text style={styles.countText}>총 {favoriteRecipes.length}개의 레시피</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>최근 저장순</Text>
                <Icon name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {favoriteRecipes.length > 0 ? (
              <FlatList
                data={favoriteRecipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="heart" size={48} color="#ddd" />
                <Text style={styles.emptyTitle}>저장된 레시피가 없습니다</Text>
                <Text style={styles.emptySubtitle}>마음에 드는 레시피를 저장해보세요</Text>
                <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate("Search")}>
                  <Text style={styles.exploreButtonText}>레시피 둘러보기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === "chefs" && (
          <View style={styles.tabContent}>
            <View style={styles.header}>
              <Text style={styles.countText}>총 {favoriteChefs.length}명의 셰프</Text>
            </View>

            {favoriteChefs.length > 0 ? (
              <FlatList
                data={favoriteChefs}
                renderItem={renderChefItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="users" size={48} color="#ddd" />
                <Text style={styles.emptyTitle}>팔로우한 셰프가 없습니다</Text>
                <Text style={styles.emptySubtitle}>좋아하는 셰프를 팔로우해보세요</Text>
                <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate("Search")}>
                  <Text style={styles.exploreButtonText}>셰프 둘러보기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#ff8a3d",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#ff8a3d",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  countText: {
    fontSize: 14,
    color: "#666",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recipeAuthor: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  savedDate: {
    fontSize: 11,
    color: "#999",
  },
  favoriteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  chefCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chefImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  chefSpecialty: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  chefStats: {
    flexDirection: "row",
    gap: 12,
  },
  chefStat: {
    fontSize: 12,
    color: "#999",
  },
  followButton: {
    backgroundColor: "#ff8a3d",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#ff8a3d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default FavoritesScreen
