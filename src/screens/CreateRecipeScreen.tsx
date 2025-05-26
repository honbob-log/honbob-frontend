"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Alert, Dimensions } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"

const { width } = Dimensions.get("window")

const CreateRecipeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [step, setStep] = useState(1)

  // 기본 정보
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // 재료
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit: string }[]>([
    { name: "", amount: "", unit: "g" },
  ])

  // 조리 단계
  const [cookingSteps, setCookingSteps] = useState<{ description: string; image: string | null }[]>([
    { description: "", image: null },
  ])

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }])
  }

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleAddStep = () => {
    setCookingSteps([...cookingSteps, { description: "", image: null }])
  }

  const handleRemoveStep = (index: number) => {
    if (cookingSteps.length > 1) {
      setCookingSteps(cookingSteps.filter((_, i) => i !== index))
    }
  }

  const handleUploadImage = (type: "main" | "step", index?: number) => {
    if (type === "main") {
      setMainImage("https://via.placeholder.com/300x200")
    } else if (type === "step" && index !== undefined) {
      const newSteps = [...cookingSteps]
      newSteps[index].image = "https://via.placeholder.com/300x200"
      setCookingSteps(newSteps)
    }
  }

  const handleSubmit = () => {
    Alert.alert("성공", "레시피가 등록되었습니다!", [{ text: "확인", onPress: () => navigation.navigate("Main") }])
  }

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...cookingSteps]
    newSteps[index].description = value
    setCookingSteps(newSteps)
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>{step}/3</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <TopBar title="레시피 등록" showBackButton={true} rightElement={renderStepIndicator()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>레시피 제목</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="레시피 이름을 입력하세요"
                  style={styles.formInput}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>레시피 설명</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="레시피에 대한 간단한 설명을 입력하세요"
                  style={styles.formTextarea}
                  multiline
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>조리 시간</Text>
                  <TouchableOpacity style={styles.selectButton}>
                    <Text style={styles.selectText}>{cookingTime || "선택"}</Text>
                    <Icon name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>난이도</Text>
                  <TouchableOpacity style={styles.selectButton}>
                    <Text style={styles.selectText}>{difficulty || "선택"}</Text>
                    <Icon name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>대표 이미지</Text>
                {mainImage ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: mainImage }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setMainImage(null)}>
                      <Icon name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadImage("main")}>
                    <Icon name="camera" size={24} color="#999" />
                    <Text style={styles.uploadText}>이미지 업로드</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>태그</Text>
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                        <Icon name="x" size={12} color="#ff8a3d" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.tagInputContainer}>
                  <TextInput
                    value={tagInput}
                    onChangeText={setTagInput}
                    placeholder="태그 입력 (예: 한식, 매콤)"
                    style={styles.tagInput}
                    placeholderTextColor="#999"
                    onSubmitEditing={handleAddTag}
                  />
                  <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
                    <Text style={styles.addTagText}>추가</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => setStep(2)} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>다음</Text>
              <Icon name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>재료 목록</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
                  <Icon name="plus" size={16} color="#ff8a3d" />
                  <Text style={styles.addButtonText}>재료 추가</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientRow}>
                    <TextInput
                      value={ingredient.name}
                      onChangeText={(value) => handleIngredientChange(index, "name", value)}
                      placeholder="재료명"
                      style={[styles.ingredientInput, { flex: 2 }]}
                      placeholderTextColor="#999"
                    />
                    <TextInput
                      value={ingredient.amount}
                      onChangeText={(value) => handleIngredientChange(index, "amount", value)}
                      placeholder="수량"
                      style={[styles.ingredientInput, { flex: 1, marginHorizontal: 8 }]}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.unitButton}>
                      <Text style={styles.unitText}>{ingredient.unit}</Text>
                      <Icon name="chevron-down" size={12} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveIngredient(index)}
                      disabled={ingredients.length === 1}
                    >
                      <Icon name="x" size={16} color={ingredients.length === 1 ? "#ccc" : "#ff4444"} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.prevButton} onPress={() => setStep(1)}>
                <Icon name="arrow-left" size={16} color="#666" />
                <Text style={styles.prevButtonText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
                <Text style={styles.nextButtonText}>다음</Text>
                <Icon name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>조리 단계</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
                  <Icon name="plus" size={16} color="#ff8a3d" />
                  <Text style={styles.addButtonText}>단계 추가</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.stepsList}>
                {cookingSteps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepTitle}>단계 {index + 1}</Text>
                      <TouchableOpacity
                        style={styles.removeStepButton}
                        onPress={() => handleRemoveStep(index)}
                        disabled={cookingSteps.length === 1}
                      >
                        <Icon name="x" size={16} color={cookingSteps.length === 1 ? "#ccc" : "#ff4444"} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.stepContent}>
                      <TextInput
                        value={step.description}
                        onChangeText={(value) => handleStepChange(index, value)}
                        placeholder="조리 방법을 설명해주세요"
                        style={styles.stepTextarea}
                        multiline
                        placeholderTextColor="#999"
                      />

                      {step.image ? (
                        <View style={styles.stepImagePreview}>
                          <Image source={{ uri: step.image }} style={styles.stepPreviewImage} />
                          <TouchableOpacity
                            style={styles.removeStepImageButton}
                            onPress={() => {
                              const newSteps = [...cookingSteps]
                              newSteps[index].image = null
                              setCookingSteps(newSteps)
                            }}
                          >
                            <Icon name="x" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.stepImageUploadButton}
                          onPress={() => handleUploadImage("step", index)}
                        >
                          <Icon name="image" size={20} color="#999" />
                          <Text style={styles.stepImageUploadText}>이미지 추가 (선택)</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.prevButton} onPress={() => setStep(2)}>
                <Icon name="arrow-left" size={16} color="#666" />
                <Text style={styles.prevButtonText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleSubmit}>
                <Icon name="check" size={16} color="#fff" />
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepIndicator: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  stepContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  formTextarea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    height: 80,
    textAlignVertical: "top",
  },
  formRow: {
    flexDirection: "row",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 14,
    color: "#333",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  imagePreview: {
    position: "relative",
    alignSelf: "flex-start",
  },
  previewImage: {
    width: 120,
    height: 80,
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 138, 61, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#ff8a3d",
    marginRight: 4,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: "#ff8a3d",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 138, 61, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ff8a3d",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ingredientInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  unitButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 60,
  },
  unitText: {
    fontSize: 12,
    color: "#333",
    marginRight: 4,
  },
  removeButton: {
    padding: 4,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    padding: 16,
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
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  removeStepButton: {
    padding: 4,
  },
  stepContent: {
    gap: 12,
  },
  stepTextarea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    height: 80,
    textAlignVertical: "top",
  },
  stepImagePreview: {
    position: "relative",
    alignSelf: "flex-start",
  },
  stepPreviewImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  removeStepImageButton: {
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
  stepImageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  stepImageUploadText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  prevButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 12,
  },
  prevButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff8a3d",
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  completeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default CreateRecipeScreen
