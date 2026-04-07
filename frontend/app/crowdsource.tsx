import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "../config";


export default function CrowdsourceScreen() {
  const router = useRouter();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [tone, setTone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!word.trim() || !meaning.trim() || !example.trim()) {
      Alert.alert("Missing Fields", "Please provide the word, meaning, and at least one example!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        word: word.trim(),
        meaning: meaning.trim(),
        example: [example.trim()],
        tone: tone.trim() || undefined,
      };

      const res = await fetch(`${API_URL}/api/slang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert("Awesome!", "Your slang has been successfully contributed.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        const errorData = await res.json();
        Alert.alert("Error", errorData.message || "Failed to submit slang.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please check your network.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#EAF0FE", "#F0EAF6", "#FFEAF2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#111" />
              </TouchableOpacity>
              <Text style={styles.title}>DROP A SLANG</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.heroBox}>
              <Text style={styles.heroEmoji}>💡</Text>
              <Text style={styles.heroText}>
                Know a word that we don't? Help us build the ultimate GenZ dictionary!
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>The Word / Phrase</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rizz, No cap, Bet"
                  placeholderTextColor="#aaa"
                  value={word}
                  onChangeText={setWord}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Meaning</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What does it actually mean?"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={3}
                  value={meaning}
                  onChangeText={setMeaning}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Example usage</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Use it in a sentence..."
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={2}
                  value={example}
                  onChangeText={setExample}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tone / Context (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sarcastic, positive, hype"
                  placeholderTextColor="#aaa"
                  value={tone}
                  onChangeText={setTone}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Submitting..." : "Submit to Dictionary"}
                </Text>
                {!submitting && <Ionicons name="send" size={18} color="#fff" style={styles.sendIcon} />}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    letterSpacing: 1,
  },
  heroBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#3F6EDB",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  heroText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3F6EDB",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#3F6EDB",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#a1bbf2",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  sendIcon: {
    marginLeft: 8,
  },
});
