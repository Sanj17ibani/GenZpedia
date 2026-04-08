import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const RED_FLAGS = {
  harassment: [
    "hate",
    "ugly",
    "dumb",
    "stupid",
    "idiot",
    "loser",
    "trash",
    "worthless",
    "pathetic",
    "freak",
    "weirdo",
    "moron",
  ],
  threats: [
    "kys",
    "kill",
    "die",
    "go die",
    "drop dead",
    "i will hurt you",
    "i'll hurt you",
    "i will kill you",
    "i'll kill you",
    "end yourself",
  ],
  bullying: [
    "no one likes you",
    "you are nothing",
    "you don't belong",
    "nobody wants you here",
    "everyone hates you",
    "you're a joke",
    "so embarrassing",
    "embarrassing",
    "leave already",
  ],
  toxicSlang: [
    "ratio",
    "mid",
    "cringe",
    "bozo",
    "clown",
    "take the l",
    "big l",
    "you're cooked",
    "fell off",
  ],
  passiveAggressive: [
    "whatever",
    "fine do what you want",
    "i don't care",
    "sure lol",
    "good for you",
    "okay then",
    "if you say so",
    "must be nice",
  ],
};

const SAMPLE_TEXTS = [
  "You're amazing, keep going!",
  "Bruh that was mid",
  "I hate you",
  "Whatever, do what you want",
  "No one likes you here",
  "That idea is cringe",
];

type StatusType = "idle" | "safe" | "warning" | "danger";

export default function SpottingRedFlagsScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [matchedWord, setMatchedWord] = useState<string | null>(null);

  const warningCategories = useMemo(
    () => ["toxicSlang", "passiveAggressive"],
    []
  );

  const formatCategory = (category: string) => {
    switch (category) {
      case "harassment":
        return "Harassment";
      case "threats":
        return "Threats";
      case "bullying":
        return "Bullying";
      case "toxicSlang":
        return "Toxic Slang";
      case "passiveAggressive":
        return "Passive Aggressive Language";
      default:
        return category;
    }
  };

  const checkText = () => {
    if (!text.trim()) {
      setStatus("idle");
      setDetectedCategory(null);
      setMatchedWord(null);
      return;
    }

    const lowerText = text.toLowerCase();

    let foundCategory: string | null = null;
    let foundWord: string | null = null;

    for (const category of Object.keys(RED_FLAGS) as Array<keyof typeof RED_FLAGS>) {
      const match = RED_FLAGS[category].find((flag) =>
        lowerText.includes(flag.toLowerCase())
      );

      if (match) {
        foundCategory = category;
        foundWord = match;
        break;
      }
    }

    setDetectedCategory(foundCategory);
    setMatchedWord(foundWord);

    if (!foundCategory) {
      setStatus("safe");
      return;
    }

    if (warningCategories.includes(foundCategory)) {
      setStatus("warning");
      Alert.alert(
        "Warning Detected! 👀",
        `This text contains ${formatCategory(foundCategory)}. It may sound rude or negative in a community space.`
      );
      return;
    }

    setStatus("danger");
    Alert.alert(
      "Red Flag Detected! 🚩",
      `This text contains ${formatCategory(foundCategory)} and may be harmful or toxic.`
    );
  };

  const resetAll = () => {
    setText("");
    setStatus("idle");
    setDetectedCategory(null);
    setMatchedWord(null);
  };

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Spotting Red Flags</Text>
          <TouchableOpacity onPress={resetAll} style={styles.resetButton}>
            <Ionicons name="refresh" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.instructionWrap}>
            <Text style={styles.instructionTitle}>Vibe Check Simulator</Text>
            <Text style={styles.instructionSub}>
              Type a sentence below to see if our system flags it. Safe spaces
              need us to watch out for bullying, toxic slang, harassment, and
              harmful language.
            </Text>
          </View>

          <View style={styles.samplesWrap}>
            <Text style={styles.sectionLabel}>Try sample texts</Text>
            <View style={styles.samplesRow}>
              {SAMPLE_TEXTS.map((sample, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.sampleChip}
                  onPress={() => {
                    setText(sample);
                    setStatus("idle");
                    setDetectedCategory(null);
                    setMatchedWord(null);
                  }}
                >
                  <Text style={styles.sampleChipText}>{sample}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type a sentence to test..."
              multiline
              numberOfLines={5}
              value={text}
              onChangeText={(val) => {
                setText(val);
                setStatus("idle");
                setDetectedCategory(null);
                setMatchedWord(null);
              }}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.checkButton} onPress={checkText}>
              <Text style={styles.checkButtonText}>Scan Text 🔍</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={resetAll}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {status === "safe" && (
            <View style={[styles.resultBox, styles.safeBox]}>
              <Text style={styles.resultEmoji}>✅</Text>
              <View style={styles.resultTextWrap}>
                <Text style={styles.resultTitleSafe}>Passes the Vibe Check!</Text>
                <Text style={styles.resultDesc}>
                  This text looks clean and does not trigger the red flag filters.
                </Text>
              </View>
            </View>
          )}

          {status === "warning" && (
            <View style={[styles.resultBox, styles.warningBox]}>
              <Text style={styles.resultEmoji}>👀</Text>
              <View style={styles.resultTextWrap}>
                <Text style={styles.resultTitleWarning}>Lowkey Risky</Text>
                <Text style={styles.resultDesc}>
                  This text may not be directly harmful, but it contains language
                  that could feel rude, dismissive, or toxic.
                </Text>
                {detectedCategory && (
                  <Text style={styles.detailText}>
                    Category: {formatCategory(detectedCategory)}
                  </Text>
                )}
                {matchedWord && (
                  <Text style={styles.detailText}>Matched phrase: "{matchedWord}"</Text>
                )}
              </View>
            </View>
          )}

          {status === "danger" && (
            <View style={[styles.resultBox, styles.dangerBox]}>
              <Text style={styles.resultEmoji}>🚩</Text>
              <View style={styles.resultTextWrap}>
                <Text style={styles.resultTitleDanger}>Red Flag Detected!</Text>
                <Text style={styles.resultDesc}>
                  Your input triggered a strong toxicity filter. This kind of
                  language is not acceptable in a positive community.
                </Text>
                {detectedCategory && (
                  <Text style={styles.detailText}>
                    Category: {formatCategory(detectedCategory)}
                  </Text>
                )}
                {matchedWord && (
                  <Text style={styles.detailText}>Matched phrase: "{matchedWord}"</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What this checks</Text>
            <Text style={styles.infoText}>• Harassment</Text>
            <Text style={styles.infoText}>• Threatening language</Text>
            <Text style={styles.infoText}>• Bullying phrases</Text>
            <Text style={styles.infoText}>• Toxic slang</Text>
            <Text style={styles.infoText}>• Passive aggressive tone</Text>
          </View>
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
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  resetButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#222",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  instructionWrap: {
    marginBottom: 18,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },
  instructionSub: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
  },
  samplesWrap: {
    marginBottom: 18,
  },
  samplesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sampleChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  sampleChipText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  inputWrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: "#333",
    minHeight: 110,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  checkButton: {
    flex: 1,
    backgroundColor: "#2E805F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  clearButton: {
    width: 100,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
  clearButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "800",
  },
  resultBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "flex-start",
    marginBottom: 18,
  },
  safeBox: {
    backgroundColor: "#E6F4EA",
    borderColor: "#A5D6A7",
    borderWidth: 1,
  },
  warningBox: {
    backgroundColor: "#FFF4E5",
    borderColor: "#FFCC80",
    borderWidth: 1,
  },
  dangerBox: {
    backgroundColor: "#FCE8E6",
    borderColor: "#EF9A9A",
    borderWidth: 1,
  },
  resultEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  resultTextWrap: {
    flex: 1,
  },
  resultTitleSafe: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "900",
    marginBottom: 4,
  },
  resultTitleWarning: {
    fontSize: 18,
    color: "#E67E22",
    fontWeight: "900",
    marginBottom: 4,
  },
  resultTitleDanger: {
    fontSize: 18,
    color: "#C62828",
    fontWeight: "900",
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    lineHeight: 20,
  },
  detailText: {
    marginTop: 8,
    fontSize: 13,
    color: "#444",
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#222",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginBottom: 6,
  },
});