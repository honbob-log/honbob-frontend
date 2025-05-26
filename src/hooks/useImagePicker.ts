"use client"

import { useState } from "react"
import { Alert } from "react-native"

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false)

  const pickImage = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      // In a real app, use react-native-image-picker
      // For now, return a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return "https://via.placeholder.com/300x200"
    } catch (error) {
      Alert.alert("오류", "이미지를 선택할 수 없습니다.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const takePhoto = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      // In a real app, use react-native-image-picker
      // For now, return a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return "https://via.placeholder.com/300x200"
    } catch (error) {
      Alert.alert("오류", "사진을 촬영할 수 없습니다.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    pickImage,
    takePhoto,
    isLoading,
  }
}
