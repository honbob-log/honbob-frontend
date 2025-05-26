import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Dimensions } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import Icon from "react-native-vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import * as WebBrowser from 'expo-web-browser'
import { Platform, Linking } from 'react-native'

const { width, height } = Dimensions.get("window")

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize'
  const CLIENT_ID = '572a9e8fc9c22450809e035d9b58f601' // 카카오 개발자 콘솔에서 확인
  const REDIRECT_URI = 'http://172.30.126.196/auth/login/kakao' // Spring 서버의 redirect_uri와 동일하게

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 시도`)
    navigation.navigate("Onboarding")
  }

  async function handleKakaoLogin() {
    // 1. 카카오 로그인 URL 생성
    const authUrl = `${KAKAO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`

    // 2. 브라우저로 이동하여 로그인(카카오 인증)
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI)

    // result.url에 리다이렉트된 URL이 담김
    if (result.type === 'success' && result.url) {
      // code 파싱
      const codeMatch = result.url.match(/[\?&]code=([^&]+)/);
      const code = codeMatch ? codeMatch[1] : null;
      if (code) {
        // 서버에 code 전달
        const response = await fetch('http://localhost:8080/auth/login/kakao?code=' + code);
        const data = await response.json();
        alert(data.message);
        // 예: AsyncStorage.setItem('token', data.AccessToken)
      } else {
        alert('카카오 로그인 실패: code 없음');
      }
    } else {
      alert('카카오 로그인 실패');
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Oydkf0tcJVQct4T1PNr7NTAsHbTT6C.png",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]} style={styles.overlay}>
          {/* 메인 콘텐츠 */}
          <View style={styles.content}>
            <Text style={styles.title}>
              내 주변,{"\n"}
              숨어 있는 로컬들이{"\n"}
              사랑하는 공간
            </Text>
            <Text style={styles.subtitle}>혼밥 로그와 함께 나만의 레시피를 발견하세요</Text>
          </View>

          {/* 소셜 로그인 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton]}
              onPress={handleKakaoLogin}
            >
              <Text style={styles.socialIcon}>K</Text>
              <Text style={[styles.buttonText, { color: "#000" }]}>카카오로 로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.naverButton]}
              onPress={() => handleSocialLogin("naver")}
            >
              <Text style={styles.socialIcon}>N</Text>
              <Text style={[styles.buttonText, { color: "#fff" }]}>네이버로 로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialLogin("google")}
            >
              <Text style={styles.socialIcon}>G</Text>
              <Text style={[styles.buttonText, { color: "#000" }]}>구글로 로그인</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>비회원으로 계속하기</Text>
              <Text style={styles.divider}>|</Text>
              <TouchableOpacity>
                <Text style={styles.helpButton}>도움말</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              로그인함으로써 <Text style={styles.termsLink}>이용약관</Text> 및{" "}
              <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의합니다.
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 12,
  },
  statusTime: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  kakaoButton: {
    backgroundColor: "#fee500",
  },
  naverButton: {
    backgroundColor: "#03c75a",
  },
  googleButton: {
    backgroundColor: "#fff",
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  divider: {
    color: "#e0e0e0",
    fontSize: 14,
    marginHorizontal: 8,
  },
  helpButton: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  termsText: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#e0e0e0",
    textDecorationLine: "underline",
  },
})

export default LoginScreen
