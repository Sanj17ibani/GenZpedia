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
import { signupUser } from "./services/api";

export default function Signup() {
  const router = useRouter();
  const { updateProfile } = useProgress();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await signupUser(name, email, password);
      const user = res.user;

      updateProfile({
        name: user?.name || name,
        email: user?.email || email,
        password,
        gender: "prefer_not_to_say",
        avatarIndex: 0,
      });

      Alert.alert("Success", res.message || "Signup successful");
      router.push({
        pathname: "/avatar",
        params: {
          name,
        },
      });
    } catch (err: any) {
      console.log("SIGNUP ERROR:", err?.response?.data || err?.message || err);

      const isNetworkError =
        !err?.response &&
        (err?.code === "ECONNABORTED" ||
          err?.message?.includes("Network Error") ||
          err?.message?.includes("timeout"));

      Alert.alert(
        "Signup failed",
        isNetworkError
          ? "Couldn't reach the backend. Check that EXPO_PUBLIC_API_URL points to your ngrok URL or local API."
          : err?.response?.data?.message ||
              err?.message ||
              "Something went wrong"
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

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#777"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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
        style={[styles.button, isSubmitting && styles.disabledButton]}
        onPress={handleSignup}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
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
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#B8A4E3",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.7,
  },
  backText: {
    marginTop: 20,
    color: "#555",
  },
});
