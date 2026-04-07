import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "https://unsaddened-stylishly-maeve.ngrok-free.dev/api/auth/login",
      {
        email,
        password,
      }
    );

    const user = res.data.user;

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

    Alert.alert(
      "Login failed",
      err?.response?.data?.message || "Invalid credentials"
    );
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
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
  backText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});