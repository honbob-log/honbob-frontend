"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const ReviewScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { recipeId } = route.params as { recipeId: number }

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [images, setImages] = useState<string[]>([])

  const recipe = {
    id: recipeId,
    title: "매콤한 김치찌개",
    image: "https://via.placeholder.com/300x200",
    author: "요리왕김치",
  }

  const handleStarPress = (starRating: number) => {
    setRating(starRating)
  }

  const handleAddImage = () => {
    // 실제로는 이미지 피커 로직
    const newImage = "https://via.placeholder.com/150x150"
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert("알림", "별점을 선택해주세요.")
      return
    }

    if (reviewText.trim().length < 10) {
      Alert.alert("알림", "리뷰는 10자 이상 작성해주세요.")
      return
    }

    // 실제로는 API 호출
    Alert.alert("성공", "리뷰가 등록되었습니다!", [{ text: "확인", onPress: () => navigation.goBack() }])
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => handleStarPress(index + 1)} style={styles.starButton}>
        <Icon
          name="star"
          size={32}
          color={index < rating ? "#ff8a3d" : "#ddd"}
          fill={index < rating ? "#ff8a3d" : "none"}
        />
      </TouchableOpacity>
    ))
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "별로예요"
      case 2:
        return "그저 그래요"
      case 3:
        return "보통이에요"
      case 4:
        return "좋아요"
      case 5:
        return "최고예요"
      default:
        return "별점을 선택해주세요"
    }
  }

  return (
    <View style={styles.container}>
      <TopBar title="리뷰 작성" showBackButton={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 레시피 정보 */}
        <View style={styles.recipeInfo}>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <View style={styles.recipeDetails}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeAuthor}>by {recipe.author}</Text>
          </View>
        </View>

        {/* 별점 */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>이 레시피는 어떠셨나요?</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
        </View>

        {/* 리뷰 텍스트 */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>리뷰 작성</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="레시피에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
            style={styles.reviewInput}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>{reviewText.length}/500</Text>
        </View>

        {/* 사진 추가 */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>사진 추가 (선택)</Text>
          <Text style={styles.sectionSubtitle}>완성된 요리 사진을 공유해보세요</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.reviewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                  <Icon name="x" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                <Icon name="camera" size={24} color="#999" />
                <Text style={styles.addImageText}>사진 추가</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* 리뷰 팁 */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 좋은 리뷰 작성 팁</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• 레시피의 난이도와 맛에 대해 솔직하게 작성해주세요</Text>
            <Text style={styles.tipItem}>• 조리 과정에서 어려웠던 점이나 팁을 공유해주세요</Text>
            <Text style={styles.tipItem}>• 완성된 요리 사진을 함께 올려주시면 더욱 도움이 됩니다</Text>
            <Text style={styles.tipItem}>• 다른 사용자들에게 도움이 되는 건설적인 피드백을 남겨주세요</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
          <Text style={styles.submitButtonText}>리뷰 등록</Text>
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
    paddingHorizontal: 16,
  },
  recipeInfo: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeDetails: {
    flex: 1,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  recipeAuthor: {
    fontSize: 14,
    color: "#666",
  },
  ratingSection: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  reviewSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#333",
    height: 120,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  imageSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  imageList: {
    paddingVertical: 8,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  tipsSection: {
    paddingVertical: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#ff8a3d",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
})

export default ReviewScreen
