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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { contributeSlang } from "./services/api";

const mildVulgarWords = [
  "damn",
  "hell",
  "crap",
  "wtf",
];

const severeVulgarWords = [
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "slut",
  "whore",
  "dick",
  "pussy",
  "motherfucker",
  "mf",
];

const mildAdultWords = [
  "flirty",
  "hot",
  "thirsty",
];

const severeAdultWords = [
  "sex",
  "sexy",
  "sexual",
  "nude",
  "naked",
  "porn",
  "xxx",
  "boobs",
  "breasts",
  "penis",
  "vagina",
  "horny",
  "cum",
  "nsfw",
  "suggestive",
  "explicit",
];

const severeHatefulWords = [
  "nigger",
  "niga",
  "chink",
  "faggot",
  "kike",
  "tranny",
  "retard",
];

const mildNegativeWords = [
  "toxic",
  "bully",
  "harass",
  "hate",
  "offensive",
  "abusive",
];

const severeNegativeWords = [
  "kill",
  "die",
  "suicide",
  "violence",
  "violent",
  "attack",
  "threat",
  "racism",
  "racist",
  "sexism",
  "sexist",
  "hateful",
];

const mildToneWords = [
  "sarcastic",
  "mocking",
  "aggressive",
];

const severeToneWords = [
  "vulgar",
  "sexual",
  "suggestive",
  "explicit",
  "offensive",
  "abusive",
  "hateful",
  "racist",
  "sexist",
  "nsfw",
  "dirty",
  "violent",
];

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function findMatches(text: string, words: string[]) {
  const normalized = normalizeText(text);
  return words.filter((word) => normalized.includes(word.toLowerCase()));
}

function moderateSubmission(form: {
  word: string;
  meaning: string;
  origin: string;
  tone: string;
  emotionalContext: string;
  example: string;
}) {
  const contentText = [
    form.word,
    form.meaning,
    form.origin,
    form.emotionalContext,
    form.example,
  ].join(" ");

  const toneText = form.tone || "";

  const severe = {
    vulgar: findMatches(contentText, severeVulgarWords),
    adult: findMatches(contentText, severeAdultWords),
    hateful: findMatches(contentText, severeHatefulWords),
    negative: findMatches(contentText, severeNegativeWords),
    tone: findMatches(toneText, severeToneWords),
  };

  const mild = {
    vulgar: findMatches(contentText, mildVulgarWords),
    adult: findMatches(contentText, mildAdultWords),
    negative: findMatches(contentText, mildNegativeWords),
    tone: findMatches(toneText, mildToneWords),
  };

  const hasSevere =
    severe.vulgar.length > 0 ||
    severe.adult.length > 0 ||
    severe.hateful.length > 0 ||
    severe.negative.length > 0 ||
    severe.tone.length > 0;

  const hasMild =
    mild.vulgar.length > 0 ||
    mild.adult.length > 0 ||
    mild.negative.length > 0 ||
    mild.tone.length > 0;

  return {
    severe,
    mild,
    hasSevere,
    hasMild,
  };
}

function buildSevereMessage(result: ReturnType<typeof moderateSubmission>) {
  let message =
    "This submission cannot be posted because it appears to contain prohibited content.\n\n";

  if (result.severe.vulgar.length) {
    message += `Severe vulgar words: ${result.severe.vulgar.join(", ")}\n`;
  }
  if (result.severe.adult.length) {
    message += `Adult / explicit words: ${result.severe.adult.join(", ")}\n`;
  }
  if (result.severe.hateful.length) {
    message += `Hateful words: ${result.severe.hateful.join(", ")}\n`;
  }
  if (result.severe.negative.length) {
    message += `Severely negative words: ${result.severe.negative.join(", ")}\n`;
  }
  if (result.severe.tone.length) {
    message += `Blocked tone: ${result.severe.tone.join(", ")}\n`;
  }

  message +=
    "\nPlease rewrite it using neutral, educational, and non-harmful language.";

  return message;
}

function buildMildMessage(result: ReturnType<typeof moderateSubmission>) {
  let message =
    "This submission may contain sensitive or inappropriate wording.\n\n";

  if (result.mild.vulgar.length) {
    message += `Mild vulgar words: ${result.mild.vulgar.join(", ")}\n`;
  }
  if (result.mild.adult.length) {
    message += `Suggestive words: ${result.mild.adult.join(", ")}\n`;
  }
  if (result.mild.negative.length) {
    message += `Negative wording: ${result.mild.negative.join(", ")}\n`;
  }
  if (result.mild.tone.length) {
    message += `Tone warning: ${result.mild.tone.join(", ")}\n`;
  }

  message +=
    "\nYou can edit it, or continue if the wording is clearly educational and non-harmful.";

  return message;
}

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

  const submitSlang = async () => {
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
        { text: "Awesome", onPress: () => router.back() },
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

  const handleSubmit = async () => {
    if (!form.word.trim() || !form.meaning.trim() || !form.example.trim()) {
      Alert.alert("Missing Fields", "Word, Meaning, and Example are required!");
      return;
    }

    const moderation = moderateSubmission(form);

    if (moderation.hasSevere) {
      Alert.alert("Submission Blocked", buildSevereMessage(moderation));
      return;
    }

    if (moderation.hasMild) {
      Alert.alert("Content Warning", buildMildMessage(moderation), [
        { text: "Edit Submission", style: "cancel" },
        {
          text: "Submit Anyway",
          onPress: () => {
            submitSlang();
          },
        },
      ]);
      return;
    }

    submitSlang();
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
              Got a word that everyone needs to know? Drop it here and share the
              wisdom!
            </Text>
          </View>

          <View style={styles.policyBox}>
            <Text style={styles.policyTitle}>Word Policy</Text>
            <Text style={styles.policyText}>
              Allowed: educational, neutral, pop-culture, humorous, or clearly
              explained slang.
            </Text>
            <Text style={styles.policyText}>
              Warning: mildly rude, suggestive, sarcastic, or negative wording may
              show a warning before posting.
            </Text>
            <Text style={styles.policyText}>
              Blocked: hateful slurs, explicit sexual wording, severe vulgar abuse,
              violent threats, or strongly harmful content.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Community safety</Text>
            <Text style={styles.warningText}>
              Very vulgar, hateful, adult-explicit, or highly negative submissions
              will be blocked. Mildly risky wording may show a warning.
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
    color: "#444",
    lineHeight: 20,
    fontWeight: "600",
  },
  policyBox: {
    backgroundColor: "#EEF7FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#CFE6FF",
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E5FA8",
    marginBottom: 6,
  },
  policyText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#315B82",
    fontWeight: "600",
    marginBottom: 4,
  },
  warningBox: {
    backgroundColor: "#FFF4E5",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD7A3",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#9A5A00",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8A5B1F",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
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
    color: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4FB08B",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4FB08B",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});