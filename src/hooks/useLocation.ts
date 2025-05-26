"use client"

import { useState } from "react"
import { Alert } from "react-native"

interface Location {
  latitude: number
  longitude: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = async (): Promise<Location | null> => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, use @react-native-geolocation/geolocation
      // For now, return mock location (Seoul)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockLocation = {
        latitude: 37.5665,
        longitude: 126.978,
      }

      setLocation(mockLocation)
      return mockLocation
    } catch (err) {
      const errorMessage = "위치 정보를 가져올 수 없습니다."
      setError(errorMessage)
      Alert.alert("위치 오류", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      // In a real app, use react-native-permissions
      // For now, simulate permission granted
      await new Promise((resolve) => setTimeout(resolve, 500))
      return true
    } catch (error) {
      Alert.alert("권한 오류", "위치 권한이 필요합니다.")
      return false
    }
  }

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    requestLocationPermission,
  }
}
