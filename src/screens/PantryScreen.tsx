"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, FlatList, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const PantryScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("ingredients")
  const [searchQuery, setSearchQuery] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const [ingredients, setIngredients] = useState([
    { id: 1, name: "양파", category: "채소", quantity: "3개", expiryDate: "2024-01-20", status: "fresh" },
    { id: 2, name: "당근", category: "채소", quantity: "2개", expiryDate: "2024-01-18", status: "fresh" },
    { id: 3, name: "우유", category: "유제품", quantity: "1L", expiryDate: "2024-01-16", status: "expiring" },
    { id: 4, name: "계란", category: "단백질", quantity: "10개", expiryDate: "2024-01-25", status: "fresh" },
    { id: 5, name: "빵", category: "곡물", quantity: "1봉", expiryDate: "2024-01-15", status: "expired" },
  ])

  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: "토마토", category: "채소", isCompleted: false },
    { id: 2, name: "치즈", category: "유제품", isCompleted: false },
    { id: 3, name: "닭가슴살", category: "단백질", isCompleted: true },
    { id: 4, name: "쌀", category: "곡물", isCompleted: false },
  ])

  const categories = ["전체", "채소", "과일", "단백질", "유제품", "곡물", "조미료"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "#4CAF50"
      case "expiring":
        return "#FF9800"
      case "expired":
        return "#F44336"
      default:
        return "#999"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "fresh":
        return "신선"
      case "expiring":
        return "임박"
      case "expired":
        return "만료"
      default:
        return ""
    }
  }

  const handleAddIngredient = () => {
    if (newItemName.trim()) {
      const newIngredient = {
        id: Date.now(),
        name: newItemName,
        category: "기타",
        quantity: "1개",
        expiryDate: "2024-01-30",
        status: "fresh",
      }
      setIngredients([...ingredients, newIngredient])
      setNewItemName("")
      setShowAddForm(false)
    }
  }

  const handleAddToShoppingList = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName,
        category: "기타",
        isCompleted: false,
      }
      setShoppingList([...shoppingList, newItem])
      setNewItemName("")
      setShowAddForm(false)
    }
  }

  const handleDeleteIngredient = (id: number) => {
    Alert.alert("삭제", "이 재료를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => setIngredients(ingredients.filter((item) => item.id !== id)),
      },
    ])
  }

  const handleToggleShoppingItem = (id: number) => {
    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)))
  }

  const renderIngredientItem = ({ item }: { item: any }) => (
    <View style={styles.ingredientCard}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientCategory}>{item.category}</Text>
        <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
        <View style={styles.expiryInfo}>
          <Text style={styles.expiryDate}>유통기한: {item.expiryDate}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ingredientActions}>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit-2" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIngredient(item.id)}>
          <Icon name="trash-2" size={16} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderShoppingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.shoppingCard, item.isCompleted && styles.completedShoppingCard]}
      onPress={() => handleToggleShoppingItem(item.id)}
    >
      <View style={styles.shoppingInfo}>
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, item.isCompleted && styles.checkedCheckbox]}>
            {item.isCompleted && <Icon name="check" size={12} color="#fff" />}
          </View>
          <Text style={[styles.shoppingName, item.isCompleted && styles.completedShoppingName]}>{item.name}</Text>
        </View>
        <Text style={styles.shoppingCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShoppingList(shoppingList.filter((shoppingItem) => shoppingItem.id !== item.id))}
      >
        <Icon name="x" size={16} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TopBar
        title="식재료 관리"
        showBackButton={true}
        rightElement={
          <TouchableOpacity onPress={() => setShowAddForm(true)}>
            <Icon name="plus" size={24} color="#ff8a3d" />
          </TouchableOpacity>
        }
      />

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ingredients" && styles.activeTab]}
          onPress={() => setActiveTab("ingredients")}
        >
          <Text style={[styles.tabText, activeTab === "ingredients" && styles.activeTabText]}>보유 재료</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "shopping" && styles.activeTab]}
          onPress={() => setActiveTab("shopping")}
        >
          <Text style={[styles.tabText, activeTab === "shopping" && styles.activeTabText]}>장보기 목록</Text>
        </TouchableOpacity>
      </View>

      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={activeTab === "ingredients" ? "재료 검색..." : "장보기 목록 검색..."}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* 컨텐츠 */}
      <View style={styles.content}>
        {activeTab === "ingredients" && (
          <View style={styles.tabContent}>
            {/* 통계 */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{ingredients.length}</Text>
                <Text style={styles.statLabel}>전체 재료</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                  {ingredients.filter((item) => item.status === "expiring").length}
                </Text>
                <Text style={styles.statLabel}>유통기한 임박</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: "#F44336" }]}>
                  {ingredients.filter((item) => item.status === "expired").length}
                </Text>
                <Text style={styles.statLabel}>유통기한 만료</Text>
              </View>
            </View>

            {/* 카테고리 필터 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity key={category} style={styles.categoryButton}>
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 재료 목록 */}
            <FlatList
              data={ingredients}
              renderItem={renderIngredientItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

        {activeTab === "shopping" && (
          <View style={styles.tabContent}>
            {/* 진행률 */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                진행률: {shoppingList.filter((item) => item.isCompleted).length}/{shoppingList.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(shoppingList.filter((item) => item.isCompleted).length / shoppingList.length) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* 장보기 목록 */}
            <FlatList
              data={shoppingList}
              renderItem={renderShoppingItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}
      </View>

      {/* 추가 폼 모달 */}
      {showAddForm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{activeTab === "ingredients" ? "재료 추가" : "장보기 목록 추가"}</Text>
            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder={activeTab === "ingredients" ? "재료명을 입력하세요" : "구매할 품목을 입력하세요"}
              style={styles.modalInput}
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddForm(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={activeTab === "ingredients" ? handleAddIngredient : handleAddToShoppingList}
              >
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
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
  categoryFilter: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  ingredientCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  expiryInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expiryDate: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  ingredientActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  progressContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff8a3d",
  },
  shoppingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completedShoppingCard: {
    opacity: 0.6,
  },
  shoppingInfo: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#ff8a3d",
    borderColor: "#ff8a3d",
  },
  shoppingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  completedShoppingName: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  shoppingCategory: {
    fontSize: 12,
    color: "#666",
    marginLeft: 32,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 32,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#ff8a3d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
})

export default PantryScreen
