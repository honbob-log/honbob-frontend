"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"

const { width } = Dimensions.get("window")

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [activeCategory, setActiveCategory] = useState("전체")

  const categories = [
    { id: "all", name: "전체", icon: "🍽️" },
    { id: "korean", name: "한식", icon: "🍚" },
    { id: "western", name: "양식", icon: "🍝" },
    { id: "chinese", name: "중식", icon: "🥟" },
    { id: "japanese", name: "일식", icon: "🍣" },
  ]

  const popularRecipes = [
    {
      id: 1,
      title: "매콤한 김치찌개",
      image: "https://via.placeholder.com/300x200",
      time: "30분",
      rating: 4.8,
      isFavorite: true,
    },
    {
      id: 2,
      title: "간단 계란 볶음밥",
      image: "https://via.placeholder.com/300x200",
      time: "15분",
      rating: 4.5,
      isFavorite: false,
    },
    {
      id: 3,
      title: "고소한 된장찌개",
      image: "https://via.placeholder.com/300x200",
      time: "25분",
      rating: 4.7,
      isFavorite: true,
    },
  ]

  const recommendedRecipes = [
    {
      id: 4,
      title: "버섯 크림 파스타",
      image: "https://via.placeholder.com/300x200",
      time: "20분",
      rating: 4.6,
    },
    {
      id: 5,
      title: "소고기 미역국",
      image: "https://via.placeholder.com/300x200",
      time: "40분",
      rating: 4.9,
    },
  ]

  const renderStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: "https://via.placeholder.com/40x40" }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>안녕하세요</Text>
            <Text style={styles.usernameText}>홍길동님 🔥</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 검색 바 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" />
          <TextInput placeholder="레시피 검색..." style={styles.searchInput} placeholderTextColor="#999" />
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로모션 배너 */}
      <View style={styles.bannerSection}>
        <View style={styles.promotionBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>오늘의 추천 레시피</Text>
            <Text style={styles.bannerSubtitle}>간단하게 만드는 김치볶음밥</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>보러가기</Text>
            </TouchableOpacity>
          </View>
          <Image source={{ uri: "https://via.placeholder.com/150x150" }} style={styles.bannerImage} />
        </View>
      </View>

      {/* 카테고리 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>카테고리</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryItem, activeCategory === category.name && styles.activeCategoryItem]}
              onPress={() => setActiveCategory(category.name)}
            >
              <View style={[styles.categoryIcon, activeCategory === category.name && styles.activeCategoryIcon]}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={[styles.categoryName, activeCategory === category.name && styles.activeCategoryName]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 인기 레시피 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>인기 레시피</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>전체보기</Text>
            <Icon name="chevron-right" size={16} color="#ff8a3d" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeList}>
          {popularRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe.id })}
            >
              <View style={styles.recipeImageContainer}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <TouchableOpacity style={styles.favoriteButton}>
                  <Icon
                    name="heart"
                    size={20}
                    color={recipe.isFavorite ? "#ff0000" : "#fff"}
                    fill={recipe.isFavorite ? "#ff0000" : "none"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                  <View style={styles.recipeRating}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingValue}>{recipe.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 추천 레시피 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>추천 레시피</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>전체보기</Text>
            <Icon name="chevron-right" size={16} color="#ff8a3d" />
          </TouchableOpacity>
        </View>
        <View style={styles.verticalRecipeList}>
          {recommendedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.horizontalRecipeCard}
              onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe.id })}
            >
              <Image source={{ uri: recipe.image }} style={styles.horizontalRecipeImage} />
              <View style={styles.horizontalRecipeInfo}>
                <Text style={styles.horizontalRecipeTitle}>{recipe.title}</Text>
                <View style={styles.horizontalRecipeMeta}>
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                  <View style={styles.recipeRating}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingValue}>{recipe.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 12,
    color: "#999",
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ff8a3d",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#ff8a3d",
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  promotionBanner: {
    backgroundColor: "#2a2b3d",
    borderRadius: 16,
    padding: 16,
    height: 128,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  bannerContent: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "#ff8a3d",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  bannerImage: {
    width: 150,
    height: 150,
    position: "absolute",
    right: 0,
    top: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#ff8a3d",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 60,
  },
  activeCategoryItem: {
    opacity: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  activeCategoryIcon: {
    backgroundColor: "rgba(255, 138, 61, 0.1)",
    borderWidth: 2,
    borderColor: "#ff8a3d",
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  activeCategoryName: {
    color: "#ff8a3d",
    fontWeight: "600",
  },
  recipeList: {
    paddingHorizontal: 16,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    width: 160,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeImageContainer: {
    position: "relative",
    height: 96,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTime: {
    fontSize: 12,
    color: "#999",
  },
  recipeRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 12,
    color: "#ff8a3d",
    fontWeight: "bold",
  },
  ratingValue: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  verticalRecipeList: {
    paddingHorizontal: 16,
  },
  horizontalRecipeCard: {
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
    height: 96,
  },
  horizontalRecipeImage: {
    width: 96,
    height: 96,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  horizontalRecipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  horizontalRecipeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  horizontalRecipeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})

export default HomeScreen
