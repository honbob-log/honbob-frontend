"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Alert, Dimensions, Modal } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"
import * as ImagePicker from "expo-image-picker"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

enum Difficulty {
  VERY_EASY = "VERY_EASY",
  EASY = "EASY",
  NORMAL = "NORMAL",
  HARD = "HARD",
  VERY_HARD = "VERY_HARD"
}

const difficultyLabels: { [key in Difficulty]: string } = {
  [Difficulty.VERY_EASY]: "매우 쉬움",
  [Difficulty.EASY]: "쉬움",
  [Difficulty.NORMAL]: "보통",
  [Difficulty.HARD]: "어려움",
  [Difficulty.VERY_HARD]: "매우 어려움"
}

const { width } = Dimensions.get("window")

const CreateRecipeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [step, setStep] = useState(1)

  // 1. 기본 정보
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL)
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false)
  const [servings, setServings] = useState("")

  // 2. 재료
  const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "" }])

  // 3. 조리법
  const [steps, setSteps] = useState([{ description: "", image: null }])

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddIngredient = () => setIngredients([...ingredients, { name: "", amount: "", unit: "" }])

  const handleRemoveIngredient = (idx: number) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== idx))
  }

  const handleIngredientChange = (idx: number, field: string, value: string) => {
    const newArr = [...ingredients]
    newArr[idx][field] = value
    setIngredients(newArr)
  }

  const handleAddStep = () => setSteps([...steps, { description: "", image: null }])

  const handleRemoveStep = (idx: number) => {
    if (steps.length > 1) setSteps(steps.filter((_, i) => i !== idx))
  }

  const handleStepChange = (idx: number, value: string) => {
    const newArr = [...steps]
    newArr[idx].description = value
    setSteps(newArr)
  }

  const handleStepImage = (idx: number, uri: string) => {
    const newArr = [...steps]
    newArr[idx].image = uri
    setSteps(newArr)
  }

  const validateInputs = () => {
    if (!title.trim()) {
      Alert.alert("오류", "레시피 제목을 입력해주세요.")
      return false
    }
    if (!summary.trim()) {
      Alert.alert("오류", "레시피 설명을 입력해주세요.")
      return false
    }
    if (!mainImage) {
      Alert.alert("오류", "대표 이미지를 추가해주세요.")
      return false
    }
    if (!cookingTime) {
      Alert.alert("오류", "조리 시간을 입력해주세요.")
      return false
    }
    if (!servings) {
      Alert.alert("오류", "인분을 입력해주세요.")
      return false
    }
    if (ingredients.some(ing => !ing.name || !ing.amount)) {
      Alert.alert("오류", "모든 재료의 이름과 수량을 입력해주세요.")
      return false
    }
    if (steps.some(step => !step.description)) {
      Alert.alert("오류", "모든 조리 단계의 설명을 입력해주세요.")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    try {
      if (!validateInputs()) {
        return
      }

      const recipeData = {
        title,
        description: summary,
        imageUrl: mainImage,
        tag: tags.join(","),
        cookTime: parseInt(cookingTime),
        difficulty,
        amount: parseInt(servings),
        ingredient: ingredients.map(ing => ({
          name: ing.name,
          amount: parseInt(ing.amount) || 0,
          ingredientId: null
        })).filter(ing => ing.name && ing.amount > 0),
        step: steps.map((step, index) => ({
          stepOrder: index + 1,
          description: step.description,
          imageUrl: step.image
        })).filter(step => step.description)
      }

      console.log("전송할 데이터:", JSON.stringify(recipeData, null, 2))

      const token = await AsyncStorage.getItem("token")
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.")
        return
      }

      const response = await axios.post("http://localhost:8080/api/recipe/register", recipeData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })

      console.log("응답 데이터:", response.data)

      Alert.alert("성공", "레시피가 등록되었습니다!", [
        { text: "확인", onPress: () => navigation.navigate("Main") }
      ])
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "레시피 등록에 실패했습니다."
        console.error("API 에러 응답:", error.response?.data)
        Alert.alert("오류", errorMessage)
      } else {
        Alert.alert("오류", "레시피 등록에 실패했습니다. 다시 시도해주세요.")
      }
      console.error("레시피 등록 오류:", error)
    }
  }

  const pickImage = async (onSelect: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onSelect(result.assets[0].uri)
    }
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>{step}/3</Text>
    </View>
  )

  const renderDifficultyPicker = () => (
    <Modal
      visible={showDifficultyPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDifficultyPicker(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowDifficultyPicker(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>난이도 선택</Text>
          {Object.entries(difficultyLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.difficultyOption,
                difficulty === key && styles.selectedDifficulty
              ]}
              onPress={() => {
                setDifficulty(key as Difficulty)
                setShowDifficultyPicker(false)
              }}
            >
              <Text style={[
                styles.difficultyOptionText,
                difficulty === key && styles.selectedDifficultyText
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <TopBar title="레시피 등록" showBackButton={true} rightElement={renderStepIndicator()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기본 정보</Text>
            <TextInput style={styles.input} placeholder="레시피 제목" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="한줄 설명" value={summary} onChangeText={setSummary} />
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setMainImage)}>
              {mainImage ? (
                <Image source={{ uri: mainImage }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="camera" size={36} color="#ff8a3d" />
                  <Text style={styles.imageText}>대표 이미지 추가</Text>
                </View>
              )}
            </TouchableOpacity>
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
            <View style={styles.tagInputRow}>
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
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="조리 시간 (예: 30분)"
                value={cookingTime}
                onChangeText={setCookingTime}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.input, { flex: 1, marginRight: 8, justifyContent: 'center' }]}
                onPress={() => setShowDifficultyPicker(true)}
              >
                <Text style={{ color: difficulty ? '#333' : '#999' }}>
                  {difficultyLabels[difficulty] || "난이도 선택"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="인분 (예: 2인분)"
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
              />
            </View>
            {renderDifficultyPicker()}
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>재료</Text>
            {ingredients.map((item, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <TextInput style={[styles.input, { flex: 2 }]} placeholder="재료명" value={item.name} onChangeText={v => handleIngredientChange(idx, "name", v)} />
                <TextInput style={[styles.input, { flex: 1, marginHorizontal: 8 }]} placeholder="수량" value={item.amount} onChangeText={v => handleIngredientChange(idx, "amount", v)} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="단위 (예: g, 개)" value={item.unit} onChangeText={v => handleIngredientChange(idx, "unit", v)} />
                <TouchableOpacity onPress={() => handleRemoveIngredient(idx)} disabled={ingredients.length === 1} style={styles.removeButton}>
                  <Icon name="x" size={16} color={ingredients.length === 1 ? "#ccc" : "#ff4444"} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
              <Icon name="plus" size={16} color="#ff8a3d" />
              <Text style={styles.addButtonText}>재료 추가</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>조리법</Text>
            {steps.map((stepItem, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{idx + 1}</Text></View>
                  <TouchableOpacity onPress={() => handleRemoveStep(idx)} disabled={steps.length === 1} style={styles.removeButton}>
                    <Icon name="x" size={16} color={steps.length === 1 ? "#ccc" : "#ff4444"} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={`단계 ${idx + 1} 설명`}
                  value={stepItem.description}
                  onChangeText={v => handleStepChange(idx, v)}
                  multiline
                />
                <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(uri => handleStepImage(idx, uri))}>
                  {stepItem.image ? (
                    <Image source={{ uri: stepItem.image }} style={styles.stepImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Icon name="camera" size={28} color="#ff8a3d" />
                      <Text style={styles.imageText}>단계 이미지 추가</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={handleAddStep} style={styles.addButton}>
              <Icon name="plus" size={16} color="#ff8a3d" />
              <Text style={styles.addButtonText}>단계 추가</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.navigation}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>이전</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>다음</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>등록하기</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: { padding: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: {
    backgroundColor: "#f5f5f5", borderRadius: 12, padding: 14, fontSize: 16,
    marginBottom: 12, color: "#333"
  },
  imagePicker: { alignItems: "center", marginBottom: 16 },
  image: { width: 200, height: 200, borderRadius: 16 },
  imagePlaceholder: {
    width: 200, height: 200, borderRadius: 16, backgroundColor: "#fff5ee",
    justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#ff8a3d"
  },
  imageText: { color: "#ff8a3d", marginTop: 8 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8, gap: 8 },
  tag: {
    flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 138, 61, 0.1)", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
  },
  tagText: { fontSize: 12, color: "#ff8a3d", marginRight: 4 },
  tagInputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  tagInput: { flex: 1, backgroundColor: "#f5f5f5", borderRadius: 12, padding: 12, fontSize: 14, color: "#333", marginRight: 8 },
  addTagButton: { backgroundColor: "#ff8a3d", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  addTagText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  row: { flexDirection: "row", marginBottom: 12 },
  ingredientRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  removeButton: { padding: 4 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 138, 61, 0.1)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 8 },
  addButtonText: { color: "#ff8a3d", fontSize: 12, fontWeight: "500", marginLeft: 4 },
  stepRow: { marginBottom: 20, borderWidth: 1, borderColor: "#f0f0f0", borderRadius: 12, padding: 16 },
  stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#ff8a3d", justifyContent: "center", alignItems: "center", marginRight: 8 },
  stepNumberText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  stepImage: { width: 120, height: 80, borderRadius: 8, marginTop: 8 },
  nutritionRow: { flexDirection: "row", marginBottom: 12 },
  navigation: { flexDirection: "row", justifyContent: "space-between", padding: 24, gap: 12 },
  navButton: { flex: 1, backgroundColor: "#f5f5f5", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginHorizontal: 4 },
  navButtonText: { color: "#666", fontSize: 16, fontWeight: "600" },
  submitButton: { flex: 1, backgroundColor: "#ff8a3d", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginHorizontal: 4 },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  difficultyOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedDifficulty: {
    backgroundColor: '#ff8a3d',
  },
  difficultyOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedDifficultyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default CreateRecipeScreen
