import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useProgress } from "./progressContext";
import { loginUser } from "./services/api";

export default function Login() {
  const router = useRouter();
  const { updateProfile } = useProgress();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  try {
    const res = await loginUser(email, password);

    const user = res.user;

    updateProfile({
      name: user.name,
      email: user.email,
      gender: "prefer_not_to_say",
      avatarIndex: 0,
      password,
    });

    // Navigate to home with user data
    router.push({
      pathname: "/home",
      params: {
        name: user.name,
        gender: "prefer_not_to_say", // temporary
        avatarIndex: "0", // temporary default
      },
    });

  } catch (err: any) {
    console.log("LOGIN ERROR:", err?.response?.data || err?.message);

    const isNetworkError =
      !err?.response &&
      (err?.code === "ECONNABORTED" ||
        err?.message?.includes("Network Error") ||
        err?.message?.includes("timeout"));

    Alert.alert(
      "Login failed",
      isNetworkError
        ? "Couldn't reach the backend. Check that EXPO_PUBLIC_API_URL points to your ngrok URL or local API."
        : err?.response?.data?.message || "Invalid credentials"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <Image
        source={require("../assets/images/mascot.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.loginButton, isSubmitting && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        <Text style={styles.loginText}>
          {isSubmitting ? "LOGGING IN..." : "LOGIN"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#B8A4E3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  loginText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.7,
  },
  backText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});
