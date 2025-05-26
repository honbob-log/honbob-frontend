"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Share } from "react-native"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const { width } = Dimensions.get("window")

const RecipeDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, "RecipeDetail">>()
  const { recipeId } = route.params

  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("ingredients")

  const recipe = {
    id: 1,
    title: "매콤한 김치찌개",
    description: "집에서 쉽게 만들 수 있는 매콤하고 시원한 김치찌개 레시피입니다.",
    image: "https://via.placeholder.com/400x300",
    time: "30분",
    difficulty: "쉬움",
    servings: "2인분",
    rating: 4.8,
    reviews: 156,
    author: {
      name: "요리왕김치",
      profileImage: "https://via.placeholder.com/40x40",
      followers: "12.5K",
    },
    tags: ["한식", "찌개", "매콤", "간단"],
    ingredients: [
      { name: "김치", amount: "200", unit: "g" },
      { name: "돼지고기", amount: "150", unit: "g" },
      { name: "두부", amount: "1/2", unit: "모" },
      { name: "대파", amount: "1", unit: "대" },
      { name: "양파", amount: "1/2", unit: "개" },
      { name: "마늘", amount: "3", unit: "쪽" },
      { name: "고춧가루", amount: "1", unit: "큰술" },
      { name: "참기름", amount: "1", unit: "작은술" },
    ],
    steps: [
      {
        step: 1,
        description: "김치는 한 입 크기로 썰고, 돼지고기도 적당한 크기로 썰어주세요.",
        image: "https://via.placeholder.com/300x200",
      },
      {
        step: 2,
        description: "팬에 참기름을 두르고 돼지고기를 볶아주세요.",
        image: "https://via.placeholder.com/300x200",
      },
      {
        step: 3,
        description: "고기가 익으면 김치를 넣고 함께 볶아주세요.",
        image: "https://via.placeholder.com/300x200",
      },
      {
        step: 4,
        description: "물을 넣고 끓인 후 두부와 대파를 넣어 마저 끓여주세요.",
        image: "https://via.placeholder.com/300x200",
      },
    ],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 12,
      fat: 15,
    },
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${recipe.title} - 혼밥 VLOG에서 확인하세요!`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const renderStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  return (
    <View style={styles.container}>
      <TopBar
        title=""
        showBackButton={true}
        rightElement={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Icon name="share" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
              <Icon
                name="heart"
                size={20}
                color={isFavorite ? "#ff0000" : "#333"}
                fill={isFavorite ? "#ff0000" : "none"}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 레시피 이미지 */}
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

        {/* 레시피 정보 */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>

          {/* 태그 */}
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* 메타 정보 */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="trending-up" size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="users" size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.servings}</Text>
            </View>
          </View>

          {/* 평점 */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>{renderStars(recipe.rating)}</Text>
            <Text style={styles.ratingText}>
              {recipe.rating} ({recipe.reviews}개 리뷰)
            </Text>
          </View>

          {/* 작성자 정보 */}
          <View style={styles.authorContainer}>
            <Image source={{ uri: recipe.author.profileImage }} style={styles.authorImage} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{recipe.author.name}</Text>
              <Text style={styles.authorFollowers}>팔로워 {recipe.author.followers}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>팔로우</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 탭 메뉴 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "ingredients" && styles.activeTab]}
            onPress={() => setActiveTab("ingredients")}
          >
            <Text style={[styles.tabText, activeTab === "ingredients" && styles.activeTabText]}>재료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "steps" && styles.activeTab]}
            onPress={() => setActiveTab("steps")}
          >
            <Text style={[styles.tabText, activeTab === "steps" && styles.activeTabText]}>조리법</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "nutrition" && styles.activeTab]}
            onPress={() => setActiveTab("nutrition")}
          >
            <Text style={[styles.tabText, activeTab === "nutrition" && styles.activeTabText]}>영양정보</Text>
          </TouchableOpacity>
        </View>

        {/* 탭 컨텐츠 */}
        <View style={styles.tabContent}>
          {activeTab === "ingredients" && (
            <View style={styles.ingredientsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>재료 ({recipe.ingredients.length}개)</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Icon name="shopping-cart" size={16} color="#ff8a3d" />
                  <Text style={styles.addToCartText}>장바구니 담기</Text>
                </TouchableOpacity>
              </View>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>
                    {ingredient.amount} {ingredient.unit}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "steps" && (
            <View style={styles.stepsContainer}>
              <Text style={styles.sectionTitle}>조리 과정</Text>
              {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{step.step}</Text>
                    </View>
                    <Text style={styles.stepTitle}>단계 {step.step}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                  <Image source={{ uri: step.image }} style={styles.stepImage} />
                </View>
              ))}
            </View>
          )}

          {activeTab === "nutrition" && (
            <View style={styles.nutritionContainer}>
              <Text style={styles.sectionTitle}>영양 정보 (1인분 기준)</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                  <Text style={styles.nutritionLabel}>칼로리 (kcal)</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                  <Text style={styles.nutritionLabel}>단백질</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>탄수화물</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                  <Text style={styles.nutritionLabel}>지방</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 액션 버튼 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate("Review", { recipeId: recipe.id })}
        >
          <Icon name="star" size={16} color="#666" />
          <Text style={styles.reviewButtonText}>리뷰 작성</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cookButton}>
          <Icon name="play" size={16} color="#fff" />
          <Text style={styles.cookButtonText}>요리 시작</Text>
        </TouchableOpacity>
      </View>
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  recipeImage: {
    width: width,
    height: 250,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "rgba(255, 138, 61, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#ff8a3d",
    fontWeight: "500",
  },
  metaContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingStars: {
    fontSize: 16,
    color: "#ff8a3d",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  authorFollowers: {
    fontSize: 12,
    color: "#666",
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
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#ff8a3d",
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 138, 61, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addToCartText: {
    fontSize: 12,
    color: "#ff8a3d",
    fontWeight: "500",
    marginLeft: 4,
  },
  ingredientsContainer: {},
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  ingredientName: {
    fontSize: 16,
    color: "#333",
  },
  ingredientAmount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  stepsContainer: {},
  stepItem: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff8a3d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  stepImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  nutritionContainer: {},
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff8a3d",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
  },
  bottomActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
    gap: 12,
  },
  reviewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 12,
  },
  reviewButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginLeft: 4,
  },
  cookButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8a3d",
    paddingVertical: 16,
    borderRadius: 12,
  },
  cookButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default RecipeDetailScreen
