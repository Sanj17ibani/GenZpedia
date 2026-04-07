import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const router = useRouter(); // ✅ navigation

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={require("../assets/images/mascot.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>GenZpedia</Text>

      {/* Tagline */}
      <Text style={styles.subtitle}>
        Translate The Vibe, Not Just The Words!
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* GET STARTED (optional → signup later) */}
        <TouchableOpacity
           style={styles.primaryButton}
           onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryText}>GET STARTED</Text>
        </TouchableOpacity>

        {/* LOGIN NAVIGATION */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryText}>
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#000",
    textShadowColor: "#fff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  subtitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    marginBottom: 40,
  },

  buttonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 60,
  },

  primaryButton: {
    backgroundColor: "#b79ced",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryText: {
    color: "#555",
    fontWeight: "600",
  },
});