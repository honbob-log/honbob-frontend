import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Dimensions, Alert, Platform } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { RootStackParamList } from "../navigation/types"
import { LinearGradient } from "expo-linear-gradient"
import * as WebBrowser from 'expo-web-browser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSession from "expo-auth-session"
import * as Linking from 'expo-linking'
import { useEffect } from 'react'

const { width, height } = Dimensions.get("window")

const CLIENT_ID = "572a9e8fc9c22450809e035d9b58f601";
const REDIRECT_URI = Platform.OS === 'android'
  ? "http://10.0.2.2:8080/auth/login/kakao"
  : "http://localhost:8080/auth/login/kakao";
const SERVER_LOGIN_ENDPOINT = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/auth/kakao/login'
  : 'http://localhost:8080/api/auth/kakao/login';

const getStringParam = (param: string | string[] | undefined): string =>
  Array.isArray(param) ? param[0] ?? "" : param ?? "";

// handleDeepLink를 useEffect 바깥으로 분리
const handleDeepLink = async (
  event: { url: string },
  navigation: NavigationProp<RootStackParamList>
) => {
  const parsed = Linking.parse(event.url);
  // 안전하게 string으로 변환
  const accessToken = getStringParam(parsed.queryParams?.accessToken);
  const refreshToken = getStringParam(parsed.queryParams?.refreshToken);
  const nickname = getStringParam(parsed.queryParams?.nickname);
  const profileImageUrl = getStringParam(parsed.queryParams?.profileImageUrl);
  const isNewMember = getStringParam(parsed.queryParams?.isNewMember);

  if (accessToken && refreshToken) {
    await AsyncStorage.multiSet([
      ["accessToken", accessToken],
      ["refreshToken", refreshToken],
      ["nickname", nickname],
      ["profileImageUrl", profileImageUrl],
      ["isNewMember", isNewMember],
    ]);

    // isNewMember 값에 따라 온보딩 또는 홈 화면으로 이동
    navigation.reset({
      index: 0,
      routes: [{
        name: isNewMember === "true" ? "Onboarding" : "Tabs"
      }]
    });
  }
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 딥링크/쿼리 파라미터 이벤트 핸들러
  useEffect(() => {
    console.log("딥링크/초기 URL 이벤트 핸들러 시작");
    const eventHandler = (event: { url: string }) => handleDeepLink(event, navigation);
    const subscription = Linking.addEventListener('url', eventHandler);
    // 앱이 이미 딥링크나 exp://.../?파라미터=값 으로 열렸을 때도 처리
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleDeepLink({ url: initialUrl }, navigation);
      }
    })();
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      // 1) 서버에서 카카오 인가 URL 받아오기
      const loginUrlRes = await fetch(SERVER_LOGIN_ENDPOINT);
      if (!loginUrlRes.ok) throw new Error(`Login URL fetch failed: ${loginUrlRes.status}`);
      const loginUrlJson = await loginUrlRes.json();
      const kakaoAuthUrl = loginUrlJson.data.loginUrl;
      if (!kakaoAuthUrl) throw new Error("loginUrl is missing");
      console.log("kakaoAuthUrl", kakaoAuthUrl);
      // 2) 카카오 인증 시작 (인증 완료 후 서버가 exp://.../?파라미터=값 으로 리다이렉트)
      const result = await WebBrowser.openAuthSessionAsync(kakaoAuthUrl, REDIRECT_URI);
      console.log("result", result);
      // openAuthSessionAsync의 반환값 활용 (exp://.../?파라미터=값 도 처리)
      if (result.type === 'success' && result.url) {
        await handleDeepLink({ url: result.url }, navigation);
      }
      console.log("카카오 로그인 완료");
    } catch (e) {
      console.error("Kakao login error", e);
      Alert.alert("로그인 중 오류가 발생했습니다.");
    }
  };

  // 구글/네이버 로그인 핸들러 (Alert만)
  const handleNaverLogin = () => {
    Alert.alert("네이버 로그인 로직 추가 필요");
  };
  const handleGoogleLogin = () => {
    Alert.alert("구글 로그인 로직 추가 필요");
  };

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
              onPress={handleNaverLogin}
            >
              <Text style={styles.socialIcon}>N</Text>
              <Text style={[styles.buttonText, { color: "#fff" }]}>네이버로 로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleLogin}
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