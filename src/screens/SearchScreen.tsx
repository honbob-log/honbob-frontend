"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"

const { width } = Dimensions.get("window")

const SearchScreen = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("전체")
  const [sortBy, setSortBy] = useState("인기순")

  const filters = ["전체", "한식", "양식", "중식", "일식", "디저트"]
  const sortOptions = ["인기순", "최신순", "평점순", "조리시간순"]

  const recentSearches = ["김치찌개", "계란볶음밥", "파스타", "된장찌개"]

  const searchResults = [
    {
      id: 1,
      title: "매콤한 김치찌개",
      image: "https://via.placeholder.com/300x200",
      time: "30분",
      rating: 4.8,
      difficulty: "쉬움",
      author: "요리왕김치",
      isFavorite: true,
    },
    {
      id: 2,
      title: "간단 계란 볶음밥",
      image: "https://via.placeholder.com/300x200",
      time: "15분",
      rating: 4.5,
      difficulty: "쉬움",
      author: "홈쿡마스터",
      isFavorite: false,
    },
    {
      id: 3,
      title: "고소한 된장찌개",
      image: "https://via.placeholder.com/300x200",
      time: "25분",
      rating: 4.7,
      difficulty: "보통",
      author: "전통요리사",
      isFavorite: true,
    },
    {
      id: 4,
      title: "크림 파스타",
      image: "https://via.placeholder.com/300x200",
      time: "20분",
      rating: 4.6,
      difficulty: "보통",
      author: "이탈리안셰프",
      isFavorite: false,
    },
  ]

  const handleSearch = () => {
    console.log("검색:", searchQuery)
  }

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query)
    handleSearch()
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <View style={styles.container}>
      {/* 검색 헤더 */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="레시피를 검색해보세요"
            style={styles.searchInput}
            placeholderTextColor="#999"
            onSubmitEditing={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="x" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="sliders" size={20} color="#ff8a3d" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 최근 검색어 */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>최근 검색어</Text>
              <TouchableOpacity>
                <Text style={styles.clearAllText}>전체 삭제</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Icon name="clock" size={14} color="#999" />
                  <Text style={styles.recentSearchText}>{search}</Text>
                  <TouchableOpacity>
                    <Icon name="x" size={14} color="#999" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 인기 검색어 */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>인기 검색어</Text>
            <View style={styles.popularSearches}>
              {["김치찌개", "계란볶음밥", "파스타", "된장찌개", "볶음면", "치킨"].map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Text style={styles.popularSearchRank}>{index + 1}</Text>
                  <Text style={styles.popularSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 검색 결과 */}
        {searchQuery && (
          <>
            {/* 필터 및 정렬 */}
            <View style={styles.filterSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterItem, activeFilter === filter && styles.activeFilterItem]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>{sortBy}</Text>
                <Icon name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* 검색 결과 개수 */}
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>총 {searchResults.length}개의 레시피</Text>
            </View>

            {/* 검색 결과 목록 */}
            <View style={styles.resultList}>
              {searchResults.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.resultItem}
                  onPress={() => navigation.navigate("RecipeDetail", { id: recipe.id })}
                >
                  <Image source={{ uri: recipe.image }} style={styles.resultImage} />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{recipe.title}</Text>
                    <Text style={styles.resultAuthor}>by {recipe.author}</Text>
                    <View style={styles.resultMeta}>
                      <View style={styles.metaItem}>
                        <Icon name="clock" size={12} color="#999" />
                        <Text style={styles.metaText}>{recipe.time}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Icon name="star" size={12} color="#ff8a3d" />
                        <Text style={styles.metaText}>{recipe.rating}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Icon name="trending-up" size={12} color="#999" />
                        <Text style={styles.metaText}>{recipe.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Icon
                      name="heart"
                      size={20}
                      color={recipe.isFavorite ? "#ff0000" : "#ccc"}
                      fill={recipe.isFavorite ? "#ff0000" : "none"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  clearAllText: {
    fontSize: 12,
    color: "#999",
  },
  recentSearches: {
    gap: 8,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  recentSearchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  popularSearches: {
    gap: 8,
  },
  popularSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  popularSearchRank: {
    width: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff8a3d",
  },
  popularSearchText: {
    fontSize: 14,
    color: "#333",
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterList: {
    flex: 1,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  activeFilterItem: {
    backgroundColor: "#ff8a3d",
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 14,
    color: "#666",
  },
  resultList: {
    paddingHorizontal: 16,
  },
  resultItem: {
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
  resultImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  resultAuthor: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    gap: 12,
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
  favoriteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default SearchScreen
