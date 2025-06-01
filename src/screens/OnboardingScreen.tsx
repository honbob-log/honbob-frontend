"use client"

import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Dimensions, ScrollView, Alert, Platform } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import TopBar from "../components/TopBar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from 'expo-image-picker'

const { width } = Dimensions.get("window")

const SERVER_PROFILE_ENDPOINT =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/auth/login/profile"
    : "http://localhost:8080/api/auth/login/profile"

const SERVER_IMAGE_UPLOAD_ENDPOINT =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/upload/profile"
    : "http://localhost:8080/api/upload/profile"

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState("")
  const [intro, setIntro] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [nicknameError, setNicknameError] = useState("")
  const [loading, setLoading] = useState(true)
  const [isNewMember, setIsNewMember] = useState<boolean | null>(null)

  useEffect(() => {
    const loadUserInfo = async () => {
      const storedIsNewMember = await AsyncStorage.getItem("isNewMember")
      const storedNickname = await AsyncStorage.getItem("nickname")
      const storedProfileImageUrl = await AsyncStorage.getItem("profileImageUrl")
      setIsNewMember(storedIsNewMember === "true")
      if (storedNickname) setNickname(storedNickname)
      if (storedProfileImageUrl) setProfileImage(storedProfileImageUrl)
      setLoading(false)
    }
    loadUserInfo()
  }, [])

  useEffect(() => {
    if (loading) return
    if (isNewMember === false) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    }
  }, [isNewMember, loading, navigation])

  const handleNicknameCheck = () => {
    if (nickname.length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다.")
      return
    }
    if (nickname.length > 30) {
      setNicknameError("닉네임은 30자 이하여야 합니다.")
      return
    }
    setNicknameError("")
    setStep(2)
  }

  // 프로필 이미지 선택 및 업로드
  const handleProfileUpload = async () => {
    // 1. 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      setProfileImage(asset.uri)
      // 2. 서버로 업로드
      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any)
      try {
        const accessToken = await AsyncStorage.getItem("accessToken")
        const uploadRes = await fetch(SERVER_IMAGE_UPLOAD_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: formData,
        })
        if (!uploadRes.ok) throw new Error("업로드 실패")
        const data = await uploadRes.json()
        setProfileImage(data.url) // 서버에서 반환한 이미지 URL로 상태 업데이트 (key는 서버 응답에 맞게 수정)
        Alert.alert("업로드 성공", "프로필 이미지가 업로드되었습니다.")
      } catch (e) {
        Alert.alert("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.")
      }
    }
  }

  const handleSubmit = async () => {
    if (!nickname || nicknameError) {
      Alert.alert("닉네임을 올바르게 입력하세요.")
      return
    }
    try {
      const accessToken = await AsyncStorage.getItem("accessToken")
      const res = await fetch(SERVER_PROFILE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          nickname,
          profileImageUrl: profileImage,
          description: intro,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      Alert.alert("프로필 저장 완료", "유저 정보가 저장되었습니다.", [
        {
          text: "확인",
          onPress: () => navigation.reset({ index: 0, routes: [{ name: "Home" }] }),
        },
      ])
    } catch (e) {
      Alert.alert("프로필 저장 실패", "서버와 통신 중 오류가 발생했습니다.")
    }
  }

  const handleLocationPermission = (allow: boolean) => {
    navigation.navigate("Home")
  }

  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      navigation.navigate("Login")
    }
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>{step}/3</Text>
    </View>
  )

  if (loading || isNewMember === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    )
  }

  if (!isNewMember) {
    return null
  }

  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} rightElement={renderStepIndicator()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>닉네임 설정</Text>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>닉네임 (2~30자)</Text>
                <View style={styles.nicknameInputContainer}>
                  <TextInput
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="사용할 닉네임을 입력하세요"
                    style={styles.formInput}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={handleNicknameCheck} style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>중복 확인</Text>
                  </TouchableOpacity>
                </View>
                {nicknameError ? <Text style={styles.errorText}>{nicknameError}</Text> : null}
              </View>
            </View>
            <TouchableOpacity onPress={handleNicknameCheck} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>프로필 설정</Text>
              <View style={styles.profileImageSection}>
                {profileImage ? (
                  <View style={styles.profileImageWrapper}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  </View>
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Icon name="camera" size={32} color="#999" />
                  </View>
                )}
                <TouchableOpacity style={styles.uploadButton} onPress={handleProfileUpload}>
                  <Icon name="upload" size={16} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.uploadText}>프로필 이미지를 업로드하세요</Text>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>소개 (선택, 최대 100자)</Text>
                <TextInput
                  value={intro}
                  onChangeText={setIntro}
                  placeholder="자신을 소개해주세요"
                  style={styles.formTextarea}
                  multiline
                  maxLength={100}
                  placeholderTextColor="#999"
                />
                <Text style={styles.charCount}>{intro.length}/100</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>위치 정보 접근 권한</Text>
              <Text style={styles.locationDescription}>
                주변 맛집 추천과 레시피 공유를 위해 위치 정보 접근 권한이 필요합니다.
              </Text>
              <View style={styles.locationButtons}>
                <TouchableOpacity style={styles.allowButton} onPress={() => handleLocationPermission(true)}>
                  <Icon name="check" size={16} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.allowButtonText}>허용</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.laterButton} onPress={() => handleLocationPermission(false)}>
                  <Icon name="x" size={16} color="#666" style={styles.buttonIcon} />
                  <Text style={styles.laterButtonText}>나중에 설정</Text>
                </TouchableOpacity>
              </View>
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
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
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
  nicknameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  checkButton: {
    backgroundColor: "#ff8a3d",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 12,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  uploadButton: {
    position: "absolute",
    bottom: 40,
    right: width / 2 - 62,
    backgroundColor: "#ff8a3d",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
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
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 32,
  },
  locationButtons: {
    gap: 12,
  },
  allowButton: {
    backgroundColor: "#ff8a3d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  allowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  laterButton: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  laterButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  nextButton: {
    backgroundColor: "#ff8a3d",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default OnboardingScreen
