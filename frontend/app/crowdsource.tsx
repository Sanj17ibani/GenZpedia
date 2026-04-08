import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { contributeSlang } from "./services/api";

export default function CrowdsourceScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    word: "",
    meaning: "",
    origin: "",
    tone: "",
    emotionalContext: "",
    example: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.word.trim() || !form.meaning.trim() || !form.example.trim()) {
      Alert.alert("Missing Fields", "Word, Meaning, and Example are required!");
      return;
    }

    setLoading(true);
    try {
      await contributeSlang({
        word: form.word.trim(),
        meaning: form.meaning.trim(),
        origin: form.origin.trim() || undefined,
        tone: form.tone.trim() || undefined,
        emotionalContext: form.emotionalContext.trim() || undefined,
        example: [form.example.trim()],
      });
      
      Alert.alert("Success! 🎉", "Your slang has been added to GenZpedia!", [
        { text: "Awesome", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert(
        "Oops!", 
        error.response?.data?.message || "Something went wrong adding your slang."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contribute</Text>
            <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.introBox}>
             <Text style={styles.introIcon}>🚀</Text>
             <Text style={styles.introText}>
                Got a word that everyone needs to know? Drop it here and share the wisdom!
             </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Slang Word *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rizz"
              placeholderTextColor="#999"
              value={form.word}
              onChangeText={(val) => handleInputChange("word", val)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Meaning *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What does it mean?"
              placeholderTextColor="#999"
              multiline
              value={form.meaning}
              onChangeText={(val) => handleInputChange("meaning", val)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Example Sentence *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Use it in a sentence..."
              placeholderTextColor="#999"
              multiline
              value={form.example}
              onChangeText={(val) => handleInputChange("example", val)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tone (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Playful, sarcastic"
              placeholderTextColor="#999"
              value={form.tone}
              onChangeText={(val) => handleInputChange("tone", val)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Origin / Context (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Where did it come from?"
              placeholderTextColor="#999"
              value={form.origin}
              onChangeText={(val) => handleInputChange("origin", val)}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.submitButtonText}>Submit Slang</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  introIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222',
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4FB08B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#4FB08B",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  }
});
