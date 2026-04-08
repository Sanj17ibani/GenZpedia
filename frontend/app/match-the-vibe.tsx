import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";
import { fetchAllSlangs } from "./services/api";
import { useProgress } from "./progressContext";


const correctSoundFile = require("../assets/sounds/correct.mp3");
const wrongSoundFile = require("../assets/sounds/wrong.mp3");

const avatarMap = {
  female: [
    require("../assets/images/female1.png"),
    require("../assets/images/female2.png"),
    require("../assets/images/female3.png"),
    require("../assets/images/female4.png"),
  ],
  male: [
    require("../assets/images/male1.png"),
    require("../assets/images/male2.png"),
    require("../assets/images/male3.png"),
    require("../assets/images/male4.png"),
  ],
  prefer_not_to_say: [require("../assets/images/prefer_not.png")],
} as const;

const mascotImages = {
  default: require("../assets/images/mascot-default.png"),
  correct: require("../assets/images/mascot-mewing.png"),
  wrong: require("../assets/images/mascot-thumbsdown.png"),
};


function shuffleArray<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchTheVibeScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const { addXp, addGoalProgress } = useProgress();

  const [pairs, setPairs] = useState<{ word: string, meaning: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);

  const safeGender =
    gender === "female" || gender === "male" || gender === "prefer_not_to_say"
      ? gender
      : "prefer_not_to_say";

  const safeAvatarIndex = Number(avatarIndex) || 0;

  const selectedProfileImage =
    avatarMap[safeGender][safeAvatarIndex] || avatarMap.prefer_not_to_say[0];

  const displayName = name ? String(name).toUpperCase() : "USER";

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);

  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [matchedMeanings, setMatchedMeanings] = useState<string[]>([]);

  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | null>(
    null
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const shuffledMeanings = useMemo(
    () => shuffleArray(pairs.map((item) => item.meaning)),
    [pairs]
  );

  useEffect(() => {
    const loadPairs = async () => {
      try {
        const data = await fetchAllSlangs();
        if (data && data.length > 0) {
          const fetchedPairs = data
            .sort(() => 0.5 - Math.random())
            .slice(0, 5) // 5 random words
            .map((s: any) => ({ word: s.word, meaning: s.meaning }));
          setPairs(fetchedPairs.length > 0 ? fetchedPairs : [{ word: "Yapping", meaning: "Talking too much" }]);
        } else {
          setPairs([{ word: "Yapping", meaning: "Talking too much" }]);
        }
      } catch (e) {
        setPairs([{ word: "Error", meaning: "Failed to load db" }]);
      } finally {
        setLoading(false);
      }
    };
    loadPairs();
  }, []);

  const mascotSource =
    feedbackType === "correct"
      ? mascotImages.correct
      : feedbackType === "wrong"
        ? mascotImages.wrong
        : mascotImages.default;

  useEffect(() => {
    let mounted = true;
    let loadedCorrectSound: Audio.Sound | null = null;
    let loadedWrongSound: Audio.Sound | null = null;

    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        const { sound: correct } = await Audio.Sound.createAsync(
          correctSoundFile
        );
        const { sound: wrong } = await Audio.Sound.createAsync(wrongSoundFile);

        loadedCorrectSound = correct;
        loadedWrongSound = wrong;

        if (mounted) {
          setCorrectSound(correct);
          setWrongSound(wrong);
        }
      } catch (error) {
        console.log("Error loading sounds:", error);
      }
    };

    loadSounds();

    return () => {
      mounted = false;
      if (loadedCorrectSound) loadedCorrectSound.unloadAsync();
      if (loadedWrongSound) loadedWrongSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!selectedWord || !selectedMeaning) return;

    const matchedPair = pairs.find((item) => item.word === selectedWord);
    const isCorrect = matchedPair?.meaning === selectedMeaning;

    const handleMatch = async () => {
      if (isCorrect) {
        setMatchedWords((prev) => [...prev, selectedWord]);
        setMatchedMeanings((prev) => [...prev, selectedMeaning]);
        setScore((prev) => prev + 1);
        setXp((prev) => prev + 10);
        setFeedbackType("correct");
        setFeedbackMessage(`✅ Correct! +10 XP`);

        try {
          if (correctSound) {
            await correctSound.setPositionAsync(0);
            await correctSound.playAsync();
          }
        } catch (error) {
          console.log("Error playing correct sound:", error);
        }

        const newMatchedCount = matchedWords.length + 1;
        if (newMatchedCount === pairs.length) {
          addGoalProgress(25);
          setTimeout(() => {
            setQuizFinished(true);
          }, 700);
        }
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("❌ Wrong match. Try again!");

        try {
          if (wrongSound) {
            await wrongSound.setPositionAsync(0);
            await wrongSound.playAsync();
          }
        } catch (error) {
          console.log("Error playing wrong sound:", error);
        }
      }

      setTimeout(() => {
        setSelectedWord(null);
        setSelectedMeaning(null);
        setFeedbackType(null);
        setFeedbackMessage("");
      }, 700);
    };

    handleMatch();
  }, [selectedWord, selectedMeaning]);

  const progressPercent = (matchedWords.length / pairs.length) * 100;

  const handleRestart = () => {
    setScore(0);
    setXp(0);
    setQuizFinished(false);
    setSelectedWord(null);
    setSelectedMeaning(null);
    setMatchedWords([]);
    setMatchedMeanings([]);
    setFeedbackType(null);
    setFeedbackMessage("");
  };

  if (quizFinished) {
    return (
      <LinearGradient
        colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.resultContainer}>
            <View style={styles.resultTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  router.push({
                    pathname: "/practice",
                    params: {
                      name: String(name || "User"),
                      gender: String(safeGender),
                      avatarIndex: String(safeAvatarIndex),
                    },
                  })
                }
              >
                <Ionicons name="arrow-back" size={22} color="#222" />
              </TouchableOpacity>

              <View style={styles.profileMini}>
                <Image source={selectedProfileImage} style={styles.profileImage} />
                <Text style={styles.profileMiniText}>{displayName}</Text>
              </View>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>🎭</Text>
              <Text style={styles.resultTitle}>All Matched!</Text>
              <Text style={styles.resultSubtitle}>
                You matched every slang word with the correct vibe.
              </Text>

              <View style={styles.resultStatsRow}>
                <View style={styles.resultStatBox}>
                  <Text style={styles.resultStatNumber}>
                    {score}/{pairs.length}
                  </Text>
                  <Text style={styles.resultStatLabel}>Matched</Text>
                </View>

                <View style={styles.resultStatBox}>
                  <Text style={styles.resultStatNumber}>+{xp} XP</Text>
                  <Text style={styles.resultStatLabel}>Earned</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRestart}
              >
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  router.push({
                    pathname: "/practice",
                    params: {
                      name: String(name || "User"),
                      gender: String(safeGender),
                      avatarIndex: String(safeAvatarIndex),
                    },
                  })
                }
              >
                <Text style={styles.secondaryButtonText}>Back to Practice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenPadding}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                router.push({
                  pathname: "/practice",
                  params: {
                    name: String(name || "User"),
                    gender: String(safeGender),
                    avatarIndex: String(safeAvatarIndex),
                  },
                })
              }
            >
              <Ionicons name="arrow-back" size={22} color="#222" />
            </TouchableOpacity>

            <View style={styles.topProfileRow}>
              <Image source={selectedProfileImage} style={styles.profileImage} />
              <View>
                <Text style={styles.smallLabel}>Match the Vibe</Text>
                <Text style={styles.nameText}>{displayName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>Match smart. Slay harder. ✨</Text>
          </View>

          <View style={styles.xpCard}>
            <View style={styles.xpTopRow}>
              <Text style={styles.xpTitle}>Your XP</Text>
              <Text style={styles.xpValue}>+{xp} XP</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {matchedWords.length} of {pairs.length} matched
            </Text>
          </View>

          <View style={styles.gameCard}>
            <View style={styles.gameTopRow}>
              <Image source={mascotSource} style={styles.mascotImage} />

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>⚡ +10 XP</Text>
                </View>
                <View style={styles.badgePurple}>
                  <Text style={styles.badgeText}>🎯 Match Mode</Text>
                </View>
              </View>
            </View>

            <Text style={styles.instructionText}>
              Tap one word and then tap its correct meaning.
            </Text>

            {feedbackMessage ? (
              <View
                style={[
                  styles.feedbackBox,
                  feedbackType === "correct"
                    ? styles.feedbackCorrect
                    : styles.feedbackWrong,
                ]}
              >
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </View>
            ) : null}

            {loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading matches...</Text>
              </View>
            ) : (
              <View style={styles.columnsRow}>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Words</Text>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.columnList}
                  >
                    {pairs.map((item, index) => {
                      const isMatched = matchedWords.includes(item.word);
                      const isSelected = selectedWord === item.word;

                      return (
                        <TouchableOpacity
                          key={`${item.word}-${index}`}
                          disabled={isMatched}
                          style={[
                            styles.matchItem,
                            isMatched && styles.matchedItem,
                            isSelected && styles.selectedItem,
                          ]}
                          onPress={() => setSelectedWord(item.word)}
                        >
                          <Text
                            style={[
                              styles.matchItemText,
                              isMatched && styles.matchedItemText,
                            ]}
                          >
                            {item.word}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Meanings</Text>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.columnList}
                  >
                    {shuffledMeanings.map((meaning, index) => {
                      const isMatched = matchedMeanings.includes(meaning);
                      const isSelected = selectedMeaning === meaning;

                      return (
                        <TouchableOpacity
                          key={`${meaning}-${index}`}
                          disabled={isMatched}
                          style={[
                            styles.matchItem,
                            styles.meaningItem,
                            isMatched && styles.matchedItem,
                            isSelected && styles.selectedItem,
                          ]}
                          onPress={() => setSelectedMeaning(meaning)}
                        >
                          <Text
                            style={[
                              styles.matchItemText,
                              isMatched && styles.matchedItemText,
                            ]}
                          >
                            {meaning}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </View>
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

  screenPadding: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  topProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileMini: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileMiniText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
    marginLeft: 8,
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
  },

  smallLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  nameText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "800",
  },

  quoteCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: "center",
  },

  quoteText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#E96C3D",
    textAlign: "center",
  },

  xpCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },

  xpTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  xpTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111",
  },

  xpValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#32A67C",
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#32A67C",
    borderRadius: 10,
  },

  progressText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "700",
  },

  gameCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    flex: 1,
  },

  gameTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  mascotImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
    marginRight: 12,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  },

  badge: {
    backgroundColor: "#DDF8EC",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgePurple: {
    backgroundColor: "#EEE2FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#222",
  },

  instructionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    marginBottom: 14,
  },

  feedbackBox: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  feedbackCorrect: {
    backgroundColor: "#EAF9F0",
  },

  feedbackWrong: {
    backgroundColor: "#FFF1F1",
  },

  feedbackText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
  },

  columnsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  columnTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },

  columnList: {
    paddingBottom: 40,
    gap: 10,
  },

  matchItem: {
    minHeight: 54,
    backgroundColor: "#F7F7F8",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  meaningItem: {
    backgroundColor: "#F8F3FF",
  },

  selectedItem: {
    borderColor: "#8E6CE8",
    backgroundColor: "#EEE2FF",
  },

  matchedItem: {
    backgroundColor: "#E8F8EE",
    borderColor: "#63C98D",
    opacity: 0.9,
  },

  matchItemText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
  },

  matchedItemText: {
    color: "#1E7B54",
  },

  resultContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },

  resultTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },

  resultEmoji: {
    fontSize: 56,
    marginBottom: 14,
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  resultSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 22,
  },

  resultStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },

  resultStatBox: {
    flex: 1,
    backgroundColor: "#F7F7F8",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  resultStatNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 4,
  },

  resultStatLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },

  primaryButton: {
    backgroundColor: "#32A67C",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    backgroundColor: "#EFEFEF",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "800",
  },
});
