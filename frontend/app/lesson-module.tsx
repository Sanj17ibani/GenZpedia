import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "../config";


interface Slang {
  _id: string;
  word: string;
  meaning: string;
  example: string[];
  tone?: string;
  emotionalContext?: string;
  category?: string;
}

export default function LessonModuleScreen() {
  const router = useRouter();
  const { title, category } = useLocalSearchParams();
  const [slangs, setSlangs] = useState<Slang[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchSlangs();
  }, []);

  const fetchSlangs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/slang`);
      const result = await res.json();
      if (result && result.data) {
        let finalData = result.data;
        if (category && typeof category === "string") {
            finalData = finalData.filter((s: Slang) => 
                s.category && s.category.toLowerCase() === category.toLowerCase()
            );
        }
        setSlangs(finalData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < slangs.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentSlang = slangs[currentIndex];
  const progressPercent = slangs.length > 0 ? ((currentIndex + 1) / slangs.length) * 100 : 0;

  return (
    <LinearGradient colors={["#E3F3EE", "#EAF0FE", "#F6E7EE"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        <Text style={styles.lessonTitle}>{title || "Slang Module"}</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3F6EDB" />
          </View>
        ) : slangs.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No slangs found.</Text>
          </View>
        ) : (
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
              onPress={() => setIsFlipped(!isFlipped)}
            >
              {!isFlipped ? (
                <View style={styles.cardFront}>
                  <Text style={styles.tapPrompt}>Tap to reveal meaning 👆</Text>
                  <Text style={styles.wordText}>{currentSlang.word}</Text>
                </View>
              ) : (
                <View style={styles.cardBack}>
                  <Text style={styles.backWord}>{currentSlang.word}</Text>
                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionHeader}>Meaning</Text>
                  <Text style={styles.meaningText}>{currentSlang.meaning}</Text>

                  {currentSlang.example && currentSlang.example.length > 0 && (
                    <>
                      <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Example</Text>
                      <View style={styles.exampleBox}>
                        <Text style={styles.exampleText}>"{currentSlang.example[0]}"</Text>
                      </View>
                    </>
                  )}

                  {currentSlang.tone && (
                    <View style={styles.tagWrap}>
                      <Text style={styles.tagText}>🎭 Tone: {currentSlang.tone}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.controlButton, currentIndex === 0 && styles.controlDisabled]}
                onPress={handlePrev}
                disabled={currentIndex === 0}
              >
                <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              
              <Text style={styles.counterText}>
                {currentIndex + 1} / {slangs.length}
              </Text>

              <TouchableOpacity
                style={[styles.controlButton, currentIndex === slangs.length - 1 && styles.controlDisabled]}
                onPress={handleNext}
                disabled={currentIndex === slangs.length - 1}
              >
                <Ionicons name="arrow-forward" size={24} color={currentIndex === slangs.length - 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressBg: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#38B27C",
  },
  lessonTitle: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "900",
    color: "#222",
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  flashcard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  flashcardFlipped: {
    backgroundColor: "#FDFDFD",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardFront: {
    alignItems: "center",
  },
  tapPrompt: {
    fontSize: 12,
    color: "#999",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  wordText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
  },
  cardBack: {
    width: "100%",
  },
  backWord: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: "#38B27C",
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  meaningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 26,
  },
  exampleBox: {
    backgroundColor: "#F4F1FB",
    padding: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  exampleText: {
    fontSize: 15,
    color: "#5C4673",
    fontStyle: "italic",
    fontWeight: "500",
  },
  tagWrap: {
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97B43",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  controlButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  controlDisabled: {
    backgroundColor: "#f9f9f9",
    shadowOpacity: 0,
    elevation: 0,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#666",
  },
});
